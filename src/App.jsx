import React, { useState, useEffect, useRef, useCallback } from "react";

// v5 — todos os ajustes aplicados
const HANDLE = "@cassianogalvao.web";
const NOME = "Cassiano Galvão";
const PERFIL_DEFAULT = null; // fixar foto: trocar null por string base64

const C = {
  black: "#000000", panel: "#0d0d10", panel2: "#141418",
  purple: "#8928FF", green: "#00EF9E", white: "#FFFFFF",
  line: "rgba(255,255,255,0.10)", dim: "rgba(255,255,255,0.50)",
};
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const SLIDE_W = 340, SLIDE_H = 425;

const CONTEXTO = `Você é o estrategista de conteúdo do Cassiano Galvão, web designer há 16 anos (+160 projetos). Reposicionamento: "parei de vender SÓ sites" — entrega o site MAIS o sistema que faz ele trabalhar (mini-CRM, painel, simulador, automação). Diferencial: julgamento sobre o que construir + entregar o sistema sozinho.
PÚBLICO: profissionais de saúde CONSOLIDADOS no BRASIL TODO (dermato, plástica, harmonização, odonto/implante, oftalmo) — consultório próprio, caixa, agenda cheia. NÃO mencione cidade.
REGRAS: fale da DOR (site parado que não capta, agendamento só por telefone, recepção afogada, paciente que some à noite). Posicione o Cassiano como autoridade. NUNCA invente métrica.`;

const ANTI_IA = `VOZ: primeira pessoa ("eu", "meu") — é o Instagram do Cassiano falando diretamente.

STORYTELLING DE CARROSSEL (obrigatório):
- Capa: gancho que para o dedo. Máx 7 palavras. Provoca, não explica.
- Slides 2-3: aprofunda a dor com UMA cena concreta. O leitor pensa "isso sou eu".
- Slides 4-5: virada — o que muda. Sem prometer milagre.
- CTA final: convite direto, sem pressão, baixo risco.
- Cada slide: UMA ideia. Cada slide puxa o próximo. Narrativa linear.
- Punchline: frase curta, memorável, que o leitor vai copiar.

PROIBIDO: travessão (—) no meio de frases. "Não é X é Y". "imagine". "vamos". "descubra". "transforme". "afinal". Perguntas retóricas empilhadas. Listas com marcadores. Tom corporativo.
Varie tamanho das frases: frase longa. Depois, seca.
Português do Brasil falado. Cena concreta vence abstração.`;

const HOOK_CAPA = `CAPA: máx 7 palavras, provoca, não explica. Técnicas: loop aberto / número específico / afirmação contra senso comum / custo concreto / imagem vívida.`;

const STYLE_TPL = {
  premium: "dark premium tech aesthetic, pure black background, electric purple (#8928FF) and mint green (#00EF9E) volumetric glow, 3D render, cinematic lighting, moody, high-end",
  pixel: "16-bit pixel art, retro SNES-era game art, cozy detailed scene, warm lighting with purple (#8928FF) and mint green (#00EF9E) accents, crisp pixel shading",
  minimal: "minimalist editorial illustration, generous negative space, single mint green (#00EF9E) accent on near-black, clean geometric shapes",
  foto: "photorealistic cinematic photography, shallow depth of field, premium moody lighting, professional",
};

const OBJETIVOS = {
  educacional: { label: "Educacional", desc: "Fecha com a lição e convite leve." },
  provocativo: { label: "Provocativo", desc: "Crava opinião que incomoda." },
  isca: { label: "Isca — comente pra receber", desc: "CTA com palavra-gatilho." },
  lista: { label: "Lista numerada", desc: "Ex.: 7 erros, 5 ferramentas." },
  antes_depois: { label: "Antes e depois", desc: "Contraste de realidade x resultado." },
  historia: { label: "História real", desc: "Caso de cliente (sem inventar dados)." },
};

async function askClaude(prompt) {
  const r = await fetch("/api/claude", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1200, messages: [{ role: "user", content: prompt }] }),
  });
  if (!r.ok) throw new Error("Falha na chamada (" + r.status + ")");
  const data = await r.json();
  return (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
}
function parseJSON(text) {
  let t = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  try { return JSON.parse(t); } catch (_) {}
  const aS = t.indexOf("["), aE = t.lastIndexOf("]"), oS = t.indexOf("{"), oE = t.lastIndexOf("}");
  let cand = null;
  if (aS !== -1 && (oS === -1 || aS < oS)) cand = t.slice(aS, aE + 1);
  else if (oS !== -1) cand = t.slice(oS, oE + 1);
  if (cand) { try { return JSON.parse(cand); } catch (_) {} }
  throw new Error("Não consegui ler a resposta. Tenta de novo.");
}
function asSlideObj(parsed) {
  let u = parsed; if (Array.isArray(u)) u = u[0] || {}; if (u && u.slide) u = u.slide; return u || {};
}
function splitTitulo(titulo, destaque) {
  if (!destaque || !titulo) return [{ t: titulo || "", hi: false }];
  const i = titulo.toLowerCase().indexOf(destaque.toLowerCase());
  if (i === -1) return [{ t: titulo, hi: false }];
  return [{ t: titulo.slice(0, i), hi: false }, { t: titulo.slice(i, i + destaque.length), hi: true }, { t: titulo.slice(i + destaque.length), hi: false }].filter(p => p.t.length > 0);
}
// sortido: randomiza dark/light por slide, mas garante capa e cta dark
function sortidoEff(slide, idx, total) {
  if (slide.tipo === "capa" || slide.tipo === "cta") return "dark";
  // seed simples por índice pra ser estável mas variado
  const seq = [1, 0, 0, 1, 0, 1, 0, 0, 1, 1]; // 0=dark,1=light — padrão que alterna
  return seq[idx % seq.length] ? "light" : "dark";
}

export default function App() {
  const [foco, setFoco] = useState("Sites de clínica que são vitrine parada e não captam paciente");
  const [ideias, setIdeias] = useState([]);
  const [ideiaSel, setIdeiaSel] = useState(null);
  const [confirmar, setConfirmar] = useState(null); // ideia aguardando confirmação
  const [slides, setSlides] = useState([]);
  const [estilo, setEstilo] = useState("sortido");
  const [idx, setIdx] = useState(0);
  const [carregando, setCarregando] = useState("");
  const [erro, setErro] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatTarget, setChatTarget] = useState("slide");
  const [chatLog, setChatLog] = useState([]);
  const [chatBusy, setChatBusy] = useState(false);
  const [showCfg, setShowCfg] = useState(false);
  const [perfil, setPerfil] = useState(PERFIL_DEFAULT);
  const [copyInstr, setCopyInstr] = useState("");
  const [imgDir, setImgDir] = useState("");
  const [imgStyle, setImgStyle] = useState("premium");
  const [capaPadrao, setCapaPadrao] = useState(0);
  const [objetivo, setObjetivo] = useState("educacional");
  const [isca, setIsca] = useState("");
  const [promptBusy, setPromptBusy] = useState(null); // índice gerando prompt
  const slideRef = useRef(null);

  const ctx = () => CONTEXTO + (copyInstr ? "\n\nINSTRUÇÕES EXTRAS:\n" + copyInstr : "") + "\n\n" + ANTI_IA;

  async function gerarIdeias() {
    setErro(""); setCarregando("ideias"); setIdeias([]); setIdeiaSel(null); setConfirmar(null);
    const listaExtra = objetivo === "lista"
      ? "Cada ideia deve ter ângulo de LISTA NUMERADA (ex: 7 erros, 5 sinais, 8 ferramentas) aplicada ao nicho de saúde."
      : objetivo === "historia"
      ? "Cada ideia deve ser uma HISTÓRIA REAL de situação vivida por clínica (sem inventar dados)."
      : "";
    try {
      const out = await askClaude(`${ctx()}\n${listaExtra}\nTAREFA: 6 ideias de carrossel sobre: "${foco}". Ângulo afiado que dói no profissional de saúde consolidado.\nAPENAS JSON: [{"titulo":"","angulo":"","gancho":""}]`);
      const d = parseJSON(out); setIdeias(Array.isArray(d) ? d : d.ideias || []);
    } catch (e) { setErro(e.message); } finally { setCarregando(""); }
  }

  async function gerarCarrossel(ideia) {
    setConfirmar(null); setErro(""); setIdeiaSel(ideia); setCarregando("carrossel");
    setSlides([]); setIdx(0); setChatLog([]); setIsca("");
    const objInstr = {
      educacional: `OBJETIVO EDUCACIONAL: fecha com lição e convite leve.`,
      provocativo: `OBJETIVO PROVOCATIVO: último slide crava opinião que incomoda, convite suave.`,
      isca: `OBJETIVO ISCA: último slide pede "comente PALAVRA pra receber [material]" — escolha palavra-gatilho em MAIÚSCULAS. Retorne também "isca" com sugestão de material baixável concreto.`,
      lista: `OBJETIVO LISTA: estruture como lista numerada ("7 erros que...", "5 sinais de..."). Cada slide de conteúdo revela 1 ou 2 itens da lista.`,
      antes_depois: `OBJETIVO ANTES/DEPOIS: slides 2-3 mostram a realidade atual (dor), slides 4-5 mostram o depois (resultado possível). Sem inventar métricas.`,
      historia: `OBJETIVO HISTÓRIA: conte como uma situação real se desenrolou (sem inventar dados). Capa apresenta o problema, slides do meio contam o que aconteceu, CTA convida a conversa.`,
    }[objetivo] || "";
    try {
      const out = await askClaude(`${ctx()}\n${HOOK_CAPA}\n${objInstr}\nTAREFA: carrossel completo sobre: Título "${ideia.titulo}" | Ângulo "${ideia.angulo}".\n1 CAPA + 4-5 CONTEÚDO + 1 CTA. Cada slide: "tipo"(capa|conteudo|cta), "titulo", "destaque"(palavra contida no título), "corpo"(1-2 frases ou ""), "punchline"(frase memorável ou "").\nAPENAS JSON: {"isca":"","slides":[{"tipo":"capa","titulo":"","destaque":"","corpo":"","punchline":""}]}`);
      const d = parseJSON(out);
      const obj = Array.isArray(d) ? { isca: "", slides: d } : d;
      const arr = (obj.slides || []).map((s) => ({ ...s, bgImage: null, imgPos: "top", imgOffsetY: 0, coverLayout: capaPadrao, image_prompt: "" }));
      setIsca(obj.isca || ""); setSlides(arr);
    } catch (e) { setErro(e.message); } finally { setCarregando(""); }
  }

  async function gerarPromptSlide(i) {
    const s = slides[i]; if (!s) return;
    setPromptBusy(i);
    try {
      const personagem = imgDir ? `PERSONAGEM RECORRENTE (mesma aparência em todas as imagens): ${imgDir}. ` : "";
      const ANGULOS = ["wide establishing shot, full scene", "medium shot, 3/4 angle", "close-up on face or hands", "low-angle dramatic upward view", "over-the-shoulder perspective", "bird's eye top-down view", "dutch angle tension shot", "silhouette contre-jour"];
      const angulo = ANGULOS[i % ANGULOS.length];
      const out = await askClaude(`Gere UM prompt de imagem (INGLÊS) para este slide de carrossel.
TÍTULO: ${s.titulo} | MENSAGEM: ${[s.corpo, s.punchline].filter(Boolean).join(" ")}
${personagem}
CÂMERA: ${angulo} — obrigatório usar este ângulo.
Ação do personagem deve REPRESENTAR o sentimento do texto (frustração, alívio, urgência, foco, celebração).
Varie: ${i % 2 === 0 ? "interior, noturno" : "ambiente clínico, luz natural"}.
Estética OBRIGATÓRIA: ${STYLE_TPL[imgStyle]}. no text, no watermark, no logo. Máx 40 palavras.
Responda APENAS a string do prompt, sem aspas, sem markdown.`);
      const prompt = out.trim().replace(/^"+|"+$/g, "");
      setSlides(p => p.map((sl, j) => j === i ? { ...sl, image_prompt: prompt } : sl));
    } catch (e) { setErro("Prompt erro: " + e.message); }
    finally { setPromptBusy(null); }
  }

  async function enviarAjuste() {
    const instr = chatInput.trim(); if (!instr || !slides.length) return;
    setChatBusy(true); setChatLog(l => [...l, { who: "voce", txt: instr }]); setChatInput("");
    try {
      if (chatTarget === "slide") {
        const s = slides[idx];
        const out = await askClaude(`${ctx()}\nSlide atual (JSON):\n${JSON.stringify({ tipo: s.tipo, titulo: s.titulo, destaque: s.destaque, corpo: s.corpo, punchline: s.punchline })}\nAjuste: "${instr}". Mantenha as chaves. APENAS JSON do slide.`);
        const upd = asSlideObj(parseJSON(out));
        setSlides(p => p.map((sl, i) => i === idx ? { ...sl, ...upd } : sl));
        setChatLog(l => [...l, { who: "claude", txt: "Slide " + (idx + 1) + " atualizado." }]);
      } else {
        const payload = slides.map(s => ({ tipo: s.tipo, titulo: s.titulo, destaque: s.destaque, corpo: s.corpo, punchline: s.punchline }));
        const out = await askClaude(`${ctx()}\n${HOOK_CAPA}\nCarrossel (JSON):\n${JSON.stringify(payload)}\nAjuste: "${instr}". Mesmas chaves e quantidade. APENAS JSON array.`);
        let upd = parseJSON(out); if (!Array.isArray(upd)) upd = upd.slides || [];
        if (Array.isArray(upd) && upd.length) {
          setSlides(p => upd.map((u, i) => ({ ...(p[i] || {}), ...u })));
          setChatLog(l => [...l, { who: "claude", txt: "Carrossel atualizado." }]);
        }
      }
    } catch (e) { setChatLog(l => [...l, { who: "claude", txt: "Erro: " + e.message }]); }
    finally { setChatBusy(false); }
  }

  function onUpload(e, target) {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => { if (target === "perfil") setPerfil(rd.result); else setSlides(p => p.map((s, i) => i === idx ? { ...s, bgImage: rd.result } : s)); };
    rd.readAsDataURL(f);
  }
  function setSlideField(field, val) { setSlides(p => p.map((s, i) => i === idx ? { ...s, [field]: val } : s)); }
  function copiar(txt) { const ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (_) {} document.body.removeChild(ta); }
  function exportarRoteiro() {
    const head = `CARROSSEL — ${ideiaSel ? ideiaSel.titulo : ""}\nDireção: ${imgDir || "-"} | Estilo: ${imgStyle}\n\n`;
    const body = slides.map((s, i) => `SLIDE ${i+1} [${s.tipo}]\nTítulo: ${s.titulo}\nCorpo: ${s.corpo || "-"}\nPunchline: ${s.punchline || "-"}\nPrompt: ${s.image_prompt || "-"}\n`).join("\n");
    const b = new Blob([head + body], { type: "text/plain" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = "roteiro.txt"; a.click(); URL.revokeObjectURL(u);
  }

  const slide = slides[idx];
  const slideEff = slide ? (estilo === "sortido" ? sortidoEff(slide, idx, slides.length) : estilo === "twitter" ? "twitter" : estilo) : "dark";

  return (
    <div style={St.root}>
      <style>{CSS}</style>
      <header style={St.header}>
        <div><div style={St.brand}>GERADOR DE CARROSSEL</div><div style={St.brandSub}>{NOME}</div></div>
        <button style={St.btnGhost} onClick={() => setShowCfg(v => !v)}>⚙ Configurações</button>
      </header>

      {showCfg && (
        <section style={{ ...St.card, marginBottom: 18 }}>
          <div style={St.cfgGrid}>
            <div>
              <div style={St.lab}>Foto de perfil (Tweet)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ ...St.avatarMini, backgroundImage: perfil ? `url(${perfil})` : "none" }}>{!perfil && "CG"}</div>
                <label style={St.uploadBtn}>enviar foto<input type="file" accept="image/*" style={{ display: "none" }} onChange={e => onUpload(e, "perfil")} /></label>
                {perfil && perfil !== PERFIL_DEFAULT && <button style={St.removeImg} onClick={() => setPerfil(PERFIL_DEFAULT)}>remover</button>}
              </div>
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <div style={St.lab}>Instruções extras de copy</div>
              <textarea style={St.textarea} rows={2} value={copyInstr} onChange={e => setCopyInstr(e.target.value)} placeholder="tom mais direto, foco em harmonização…" />
            </div>
          </div>
        </section>
      )}

      <div className="__grid" style={St.grid}>
        {/* ESQUERDA */}
        <div style={St.left}>
          <section style={St.card}>
            <div style={St.step}><span style={St.stepNum}>01</span> Foco do conteúdo</div>
            <textarea style={St.textarea} value={foco} onChange={e => setFoco(e.target.value)} rows={3} />

            <div style={St.lab}>Capa</div>
            <select style={St.input} value={capaPadrao} onChange={e => setCapaPadrao(Number(e.target.value))}>
              <option value={0}>Só texto (glow) — texto baixo</option>
              <option value={1}>Só texto — texto centro-alto</option>
              <option value={2}>Imagem de fundo</option>
              <option value={3}>Imagem horizontal em cima</option>
              <option value={4}>Imagem horizontal embaixo</option>
            </select>

            <div style={{ ...St.lab, marginTop: 10 }}>Objetivo</div>
            <select style={St.input} value={objetivo} onChange={e => setObjetivo(e.target.value)}>
              {Object.entries(OBJETIVOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <div style={{ fontSize: 10, color: C.dim, marginTop: 4, marginBottom: 10 }}>{OBJETIVOS[objetivo]?.desc}</div>

            <div style={St.lab}>Direção das imagens</div>
            <input style={St.input} value={imgDir} onChange={e => setImgDir(e.target.value)} placeholder="ex.: uma médica dermatologista" />

            <div style={{ ...St.lab, marginTop: 8 }}>Estilo das imagens</div>
            <select style={St.input} value={imgStyle} onChange={e => setImgStyle(e.target.value)}>
              <option value="premium">Premium dark tech</option>
              <option value="pixel">Pixel-art 8-bit</option>
              <option value="minimal">Minimalista editorial</option>
              <option value="foto">Fotográfico</option>
            </select>

            <button style={{ ...St.btnPrimary, marginTop: 14 }} onClick={gerarIdeias} disabled={carregando === "ideias"}>
              {carregando === "ideias" ? "Pensando…" : "Gerar 6 ideias"}
            </button>
          </section>

          {ideias.length > 0 && (
            <section style={St.card}>
              <div style={St.step}><span style={St.stepNum}>02</span> Escolha um ângulo</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ideias.map((it, i) => {
                  const sel = ideiaSel && ideiaSel.titulo === it.titulo;
                  return (
                    <button key={i} onClick={() => setConfirmar(it)}
                      style={{ ...St.ideia, borderColor: sel ? C.green : confirmar?.titulo === it.titulo ? C.purple : C.line, background: sel ? "rgba(0,239,158,0.06)" : confirmar?.titulo === it.titulo ? "rgba(137,40,255,0.08)" : C.panel2 }}>
                      <div style={St.ideiaTit}>{it.titulo}</div>
                      <div style={St.ideiaAng}>{it.angulo}</div>
                    </button>
                  );
                })}
              </div>
              {confirmar && (
                <div style={{ marginTop: 12, background: "rgba(137,40,255,0.1)", border: `1px solid ${C.purple}`, borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 12, marginBottom: 8 }}>Gerar carrossel com <b style={{ color: C.green }}>"{confirmar.titulo}"</b>?</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{ ...St.btnPrimary, flex: 1 }} onClick={() => gerarCarrossel(confirmar)} disabled={carregando === "carrossel"}>
                      {carregando === "carrossel" ? "Gerando…" : "Confirmar"}
                    </button>
                    <button style={{ ...St.btnGhost }} onClick={() => setConfirmar(null)}>Cancelar</button>
                  </div>
                </div>
              )}
            </section>
          )}
          {erro && <div style={St.erro}>{erro}</div>}
        </div>

        {/* DIREITA */}
        <div style={St.right}>
          <div style={St.previewBar}>
            <div style={St.styleSwitch}>
              {[["dark","Escuro"],["light","Claro"],["sortido","Sortido"],["twitter","Tweet"]].map(([k,l]) => (
                <button key={k} onClick={() => setEstilo(k)} style={{ ...St.styleBtn, color: estilo===k ? C.black : C.white, background: estilo===k ? C.green : "transparent" }}>{l}</button>
              ))}
            </div>
            {slides.length > 0 && (
              <div style={{ display: "flex", gap: 8 }}>
                <button style={St.btnGhost} onClick={() => copiar(slides.map((s,i) => `SLIDE ${i+1}\n${s.titulo}\n${s.corpo||""}\n${s.punchline ? "» "+s.punchline : ""}`).join("\n\n"))}>Copiar</button>
                <button style={St.btnGhost} onClick={exportarRoteiro}>Roteiro</button>
              </div>
            )}
          </div>

          {isca && <div style={{ background: "rgba(0,239,158,0.08)", border: `1px solid ${C.green}`, borderRadius: 10, padding: "10px 14px", fontSize: 12 }}><b style={{ color: C.green }}>Isca sugerida:</b> {isca}</div>}

          <div style={St.stage}>
            {carregando === "carrossel" && <div style={St.placeholder}>Montando o carrossel…</div>}
            {!slide && carregando !== "carrossel" && <div style={St.placeholder}>{ideias.length===0 ? "Passo 01: foco e gere ideias." : "Passo 02: escolha e confirme um ângulo."}</div>}
            {slide && <div ref={slideRef}><Slide slide={slide} estilo={estilo} idx={idx} total={slides.length} perfil={perfil} sortidoEff={sortidoEff} /></div>}
          </div>

          {slides.length > 0 && (<>
            <div style={St.nav}>
              <button style={St.navBtn} onClick={() => setIdx(i => Math.max(0,i-1))} disabled={idx===0}>←</button>
              <div style={St.dots}>{slides.map((_,i) => <span key={i} onClick={() => setIdx(i)} style={{ ...St.dot, background: i===idx ? C.green : "rgba(255,255,255,0.25)" }} />)}</div>
              <button style={St.navBtn} onClick={() => setIdx(i => Math.min(slides.length-1,i+1))} disabled={idx===slides.length-1}>→</button>
            </div>

            <div style={St.slideTools}>
              <label style={St.uploadBtn}>{slide.bgImage ? "trocar img" : "+ imagem"}<input type="file" accept="image/*" style={{ display:"none" }} onChange={e => onUpload(e,"slide")} /></label>
              {slide.bgImage && <button style={St.removeImg} onClick={() => setSlideField("bgImage",null)}>remover</button>}
              {slide.bgImage && slide.tipo !== "capa" && [["top","cima"],["bottom","baixo"],["bg","fundo"]].map(([k,l]) => (
                <button key={k} onClick={() => setSlideField("imgPos",k)} style={{ ...St.posBtn, background: slide.imgPos===k ? C.green : "transparent", color: slide.imgPos===k ? C.black : C.white }}>{l}</button>
              ))}
              {slide.bgImage && (
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:10, color:C.dim }}>Y</span>
                  <input type="range" min="-100" max="100" value={slide.imgOffsetY||0}
                    onChange={e => setSlideField("imgOffsetY", Number(e.target.value))}
                    style={{ width:70, accentColor: C.green }} />
                </div>
              )}
              {slide.tipo==="capa" && estilo!=="twitter" && (
                <button style={St.removeImg} onClick={() => setSlideField("coverLayout",((slide.coverLayout||0)+1)%5)}>
                  capa ({(slide.coverLayout||0)+1}/5)
                </button>
              )}
            </div>

            {/* PROMPT POR SLIDE */}
            <div style={St.promptBox}>
              <div style={St.promptHead}>
                PROMPT · slide {idx+1}
                <div style={{ display:"flex", gap:6 }}>
                  <button style={St.copyMini} onClick={() => gerarPromptSlide(idx)} disabled={promptBusy===idx}>
                    {promptBusy===idx ? "gerando…" : slide.image_prompt ? "regen" : "gerar"}
                  </button>
                  {slide.image_prompt && <button style={St.copyMini} onClick={() => copiar(slide.image_prompt)}>copiar</button>}
                </div>
              </div>
              <div style={St.promptTxt}>{slide.image_prompt || <span style={{ color:C.dim }}>Clique em "gerar" para criar o prompt deste slide.</span>}</div>
            </div>

            {/* CHAT DE AJUSTE */}
            <div style={St.card}>
              <div style={St.step}><span style={St.stepNum}>★</span> Chat de ajuste</div>
              <div style={St.targetRow}>
                {[["slide","Slide atual"],["all","Carrossel todo"]].map(([k,l]) => (
                  <button key={k} onClick={() => setChatTarget(k)} style={{ ...St.targetBtn, color: chatTarget===k ? C.black : C.white, background: chatTarget===k ? C.green : "transparent" }}>{l}</button>
                ))}
              </div>
              {chatLog.length > 0 && <div style={St.chatLog}>{chatLog.map((m,i) => <div key={i} style={{ ...St.chatMsg, color: m.who==="voce" ? C.white : C.green }}><b>{m.who}:</b> {m.txt}</div>)}</div>}
              <textarea style={St.textarea} rows={2} value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="ex.: mais provocativo / trocar o exemplo" />
              <button style={St.btnPrimary} onClick={enviarAjuste} disabled={chatBusy}>{chatBusy ? "Ajustando…" : "Enviar"}</button>
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}

// ===== SLIDE RENDER =====
function Slide({ slide, estilo, idx, total, perfil, sortidoEff }) {
  if (estilo === "twitter") return <TweetSlide slide={slide} idx={idx} total={total} perfil={perfil} />;
  const eff = estilo === "sortido" ? sortidoEff(slide, idx, total) : estilo;
  if (slide.tipo === "capa") return <CoverSlide slide={slide} eff={eff} idx={idx} total={total} />;
  return <ContentSlide slide={slide} eff={eff} idx={idx} total={total} />;
}

const pg = (i,t) => `${String(i+1).padStart(2,"0")} / ${String(t).padStart(2,"0")}`;
function glow(color, pos, opacity) { return { position:"absolute", width:230, height:230, background:`radial-gradient(circle, ${color}, transparent 70%)`, opacity, filter:"blur(11px)", mixBlendMode:"screen", pointerEvents:"none", zIndex:1, ...pos }; }
function Glows() { return (<><div style={glow(C.purple,{top:-55,left:-45},0.6)}/><div style={glow(C.green,{bottom:-75,right:-55},0.32)}/></>); }
function splitTituloEl(slide, size, color, accent) {
  const parts = splitTitulo(slide.titulo, slide.destaque);
  return <div style={{ fontFamily:MONO, fontWeight:700, fontSize:size, lineHeight:1.12, color, textWrap:"balance" }}>
    {parts.map((p,i) => <span key={i} style={p.hi ? { fontStyle:"italic", color:accent } : undefined}>{p.t}</span>)}
  </div>;
}
function FooterEl({ light, accent, label }) {
  return <div style={{ display:"flex", justifyContent:"space-between", fontSize:9, color: light ? "rgba(0,0,0,0.4)" : C.dim, borderTop:`1px solid ${light?"rgba(0,0,0,0.1)":C.line}`, paddingTop:10 }}>
    <span>{HANDLE}</span><span style={{ color:accent, fontStyle:"italic" }}>{label}</span>
  </div>;
}
function PunchEl({ txt, accent, light }) {
  return <div style={{ borderLeft:`3px solid ${accent}`, paddingLeft:11, fontSize:12, fontWeight:700, lineHeight:1.4, color: light ? C.black : C.white, marginBottom:13, textWrap:"pretty" }}>{widow(txt)}</div>;
}
function BandEl({ src, h, offsetY }) {
  return <div style={{ borderRadius:9, overflow:"hidden", height:h||90, flexShrink:0 }}>
    <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:`center ${50+(offsetY||0)}%` }} />
  </div>;
}
function cardBase(light) { return { width:SLIDE_W, height:SLIDE_H, borderRadius:14, position:"relative", overflow:"hidden", boxShadow:"0 20px 50px rgba(0,0,0,0.55)", border: light ? "none" : `1px solid ${C.line}`, background: light ? "#FAFAF7" : C.black }; }
const imgFull = { position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" };
const scrim = { position:"absolute", inset:0, background:"linear-gradient(180deg,rgba(0,0,0,.1),rgba(0,0,0,.82))", zIndex:1 };
const padCol = { position:"relative", height:"100%", padding:22, display:"flex", flexDirection:"column", boxSizing:"border-box", zIndex:2 };

function CoverSlide({ slide, eff, idx, total }) {
  const light = eff==="light", accent = light ? C.purple : C.green, fg = light ? C.black : C.white;
  const lay = slide.coverLayout||0, img = slide.bgImage, off = slide.imgOffsetY||0;

  // lay 2: imagem full-bleed
  if (lay===2) return (
    <div style={cardBase(light)}>
      {img ? <><img src={img} alt="" style={{ ...imgFull, objectPosition:`center ${50+off}%` }}/><div style={scrim}/></> : <Glows/>}
      <div style={padCol}>
        <div style={{ flex:1 }}/>
        {splitTituloEl(slide, 28, img ? C.white : fg, img ? C.green : accent)}
        {slide.corpo && <div style={{ marginTop:10, fontSize:12, color: img ? "rgba(255,255,255,.8)" : (light?"rgba(0,0,0,.6)":"rgba(255,255,255,.7)") }}>{widow(slide.corpo)}</div>}
        <div style={{ marginTop:14 }}><FooterEl light={!img && light} accent={img ? C.green : accent} label={pg(idx,total)}/></div>
      </div>
    </div>
  );

  // lay 1: texto no centro-alto
  if (lay===1) return (
    <div style={cardBase(light)}>
      {!light && <Glows/>}
      <div style={{ ...padCol, paddingTop:60 }}>
        {splitTituloEl(slide, 28, fg, accent)}
        {slide.corpo && <div style={{ marginTop:14, fontSize:12, color: light?"rgba(0,0,0,.6)":"rgba(255,255,255,.7)", maxWidth:260, textWrap:"pretty" }}>{widow(slide.corpo)}</div>}
        <div style={{ flex:1 }}/>
        <FooterEl light={light} accent={accent} label={pg(idx,total)}/>
      </div>
    </div>
  );

  // lay 3/4: faixa de imagem cima/baixo
  if ((lay===3||lay===4)) return (
    <div style={cardBase(light)}>
      {!light && <Glows/>}
      <div style={{ ...padCol, gap:12, justifyContent:"center" }}>
        {lay===3 && img && <BandEl src={img} h={140} offsetY={off}/>}
        {splitTituloEl(slide, 26, fg, accent)}
        {slide.corpo && <div style={{ fontSize:12, color: light?"rgba(0,0,0,.6)":"rgba(255,255,255,.7)" }}>{widow(slide.corpo)}</div>}
        {lay===4 && img && <BandEl src={img} h={140} offsetY={off}/>}
        <div style={{ flex:1 }}/>
        <FooterEl light={light} accent={accent} label={pg(idx,total)}/>
      </div>
    </div>
  );

  // lay 0: padrão — sem glows na capa, texto na base
  return (
    <div style={cardBase(light)}>
      {img && <><img src={img} alt="" style={{ ...imgFull, objectPosition:`center ${50+off}%` }}/><div style={scrim}/></>}
      <div style={padCol}>
        <div style={{ flex:1 }}/>
        {splitTituloEl(slide, 28, img ? C.white : fg, img ? C.green : accent)}
        {slide.corpo && <div style={{ marginTop:10, fontSize:12, color: img?"rgba(255,255,255,.8)":(light?"rgba(0,0,0,.6)":"rgba(255,255,255,.7)") }}>{widow(slide.corpo)}</div>}
        <div style={{ fontSize:9, letterSpacing:"0.12em", color: img?"rgba(255,255,255,.6)":(light?"rgba(0,0,0,.35)":C.dim), margin:"14px 0 12px" }}>ARRASTA →</div>
        <FooterEl light={light && !img} accent={img ? C.green : accent} label={pg(idx,total)}/>
      </div>
    </div>
  );
}

function ContentSlide({ slide, eff, idx, total }) {
  const light = eff==="light", accent = light ? C.purple : C.green;
  const pos = slide.imgPos||"top", img = slide.bgImage, off = slide.imgOffsetY||0;
  const corpoColor = light ? "rgba(0,0,0,.65)" : "rgba(255,255,255,.74)";

  if (img && pos==="bg") return (
    <div style={cardBase(light)}>
      <img src={img} alt="" style={{ ...imgFull, opacity: light?0.15:0.28, objectPosition:`center ${50+off}%` }}/>
      {!light && <Glows/>}
      <div style={padCol}>
        {splitTituloEl(slide, 20, light ? C.black : C.white, accent)}
        {slide.corpo && <div style={{ marginTop:11, fontSize:12, lineHeight:1.45, color:corpoColor, textWrap:"pretty" }}>{widow(slide.corpo)}</div>}
        <div style={{ flex:1 }}/>
        {slide.punchline && <PunchEl txt={slide.punchline} accent={accent} light={light}/>}
        <FooterEl light={light} accent={accent} label={pg(idx,total)}/>
      </div>
    </div>
  );

  // detecta se há conteúdo suficiente pra preencher; se não, expande
  const hasImg = img && (pos==="top"||pos==="bottom");
  return (
    <div style={cardBase(light)}>
      {!light && <Glows/>}
      <div style={padCol}>
        <div style={{ fontSize:9, letterSpacing:"0.11em", color: light?"rgba(0,0,0,.4)":C.dim, marginBottom:12 }}>
          <span style={{ color:accent }}>—</span> {slide.tipo==="cta" ? "O CONVITE" : "O DIAGNÓSTICO"}
        </div>
        {hasImg && pos==="top" && <div style={{ marginBottom:12 }}><BandEl src={img} h={90} offsetY={off}/></div>}
        {splitTituloEl(slide, 20, light ? C.black : C.white, accent)}
        {slide.corpo
          ? <div style={{ marginTop:11, fontSize:12, lineHeight:1.45, color:corpoColor, textWrap:"pretty" }}>{widow(slide.corpo)}</div>
          : <div style={{ flex:1 }}/> /* expande pra preencher vazio */
        }
        {hasImg && pos==="bottom" && <div style={{ marginTop:12 }}><BandEl src={img} h={90} offsetY={off}/></div>}
        <div style={{ flex:1 }}/>
        {slide.punchline && <PunchEl txt={slide.punchline} accent={accent} light={light}/>}
        <FooterEl light={light} accent={accent} label={pg(idx,total)}/>
      </div>
    </div>
  );
}

function TweetSlide({ slide, idx, total, perfil }) {
  const parts = splitTitulo(slide.titulo, slide.destaque);
  return (
    <div style={TW.card}>
      <div style={TW.top}>
        <div style={{ ...TW.avatar, backgroundImage: perfil ? `url(${perfil})` : "none", backgroundSize:"cover", backgroundPosition:"center" }}>{!perfil && "CG"}</div>
        <div><div style={TW.name}>{NOME} <span style={{ color:C.purple }}>✦</span></div><div style={TW.handle}>{HANDLE}</div></div>
      </div>
      <div style={TW.body}>{parts.map((p,i) => <span key={i} style={p.hi ? { color:C.purple, fontStyle:"italic" } : undefined}>{p.t}</span>)}</div>
      {slide.bgImage && (
        <div style={{ marginTop:10, borderRadius:12, overflow:"hidden", aspectRatio:"16/9", flexShrink:0 }}>
          <img src={slide.bgImage} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:`center ${50+(slide.imgOffsetY||0)}%` }}/>
        </div>
      )}
      {slide.corpo && <div style={TW.sub}>{widow(slide.corpo)}</div>}
      {slide.punchline && <div style={TW.quote}>{widow(slide.punchline)}</div>}
      <div style={{ flex:1 }}/>
      <div style={TW.foot}>{pg(idx,total)}</div>
    </div>
  );
}

// ===== HELPERS =====
function widow(s) { if (!s) return s; const i = s.lastIndexOf(" "); return i>0 ? s.slice(0,i)+"\u00A0"+s.slice(i+1) : s; }

// canvas helpers (para PNG export)
function cvLoadImg(src) { return new Promise(res => { const i=new Image(); i.onload=()=>res(i); i.onerror=()=>res(null); i.src=src; }); }
function cvCover(ctx,img,x,y,w,h,oy=0){const ir=img.width/img.height,r=w/h;let sw,sh,sx,sy;if(ir>r){sh=img.height;sw=sh*r;sx=(img.width-sw)/2;sy=0;}else{sw=img.width;sh=sw/r;sx=0;sy=(img.height-sh)/2;}const offPx=(oy/100)*sh;ctx.drawImage(img,sx,sy+offPx,sw,sh-Math.abs(offPx)*2,x,y,w,h);}
function cvRound(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
function cvGlows(ctx,W,H){ctx.save();ctx.globalCompositeOperation="lighter";let g=ctx.createRadialGradient(W*.05,0,0,W*.05,0,W*.75);g.addColorStop(0,"rgba(137,40,255,0.5)");g.addColorStop(1,"rgba(137,40,255,0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);let g2=ctx.createRadialGradient(W*.95,H,0,W*.95,H,W*.75);g2.addColorStop(0,"rgba(0,239,158,0.3)");g2.addColorStop(1,"rgba(0,239,158,0)");ctx.fillStyle=g2;ctx.fillRect(0,0,W,H);ctx.restore();}
function cvFont(px,bold,italic){return`${italic?"italic ":""}${bold?"700":"400"} ${px}px 'IBM Plex Mono',monospace`;}
function cvWrap(ctx,text,maxW){const words=(text||"").split(/\s+/).filter(Boolean);const lines=[];let line="";for(const w of words){const t=line?line+" "+w:w;if(ctx.measureText(t).width>maxW&&line){lines.push(line);line=w;}else line=t;}if(line)lines.push(line);return lines;}
function cvDrawPara(ctx,text,x,y,px,lh,color,maxW){ctx.font=cvFont(px,false,false);ctx.fillStyle=color;ctx.textBaseline="top";for(const l of cvWrap(ctx,text,maxW)){ctx.fillText(l,x,y);y+=lh;}return y;}
function cvTitleWords(slide){const parts=splitTitulo(slide.titulo,slide.destaque);const out=[];parts.forEach(p=>{p.t.split(/\s+/).forEach(tok=>{if(tok)out.push({w:tok,hi:p.hi});});});return out;}
function cvDrawTitle(ctx,words,x,y,px,lh,color,accent,maxW){ctx.textBaseline="top";const spW=ctx.measureText(" ").width;const lines=[];let cur=[],curW=0;for(const tk of words){ctx.font=cvFont(px,true,tk.hi);const ww=ctx.measureText(tk.w).width;const add=(cur.length?spW:0)+ww;if(curW+add>maxW&&cur.length){lines.push(cur);cur=[tk];curW=ww;}else{cur.push(tk);curW+=add;}}if(cur.length)lines.push(cur);for(const ln of lines){let cx=x;for(const tk of ln){ctx.font=cvFont(px,true,tk.hi);ctx.fillStyle=tk.hi?accent:color;ctx.fillText(tk.w,cx,y);cx+=ctx.measureText(tk.w).width+spW;}y+=lh;}return y;}

// ===== ESTILOS =====
const St = {
  root: { minHeight:"100vh", background:C.black, color:C.white, fontFamily:MONO, padding:"16px 20px 40px" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:16, borderBottom:`1px solid ${C.line}`, marginBottom:16 },
  brand: { fontSize:13, fontWeight:700, letterSpacing:"0.04em" },
  brandSub: { fontSize:10, color:C.dim, marginTop:2 },
  grid: { display:"grid", gridTemplateColumns:"minmax(260px,360px) 1fr", gap:22, alignItems:"start" },
  left: { display:"flex", flexDirection:"column", gap:14 },
  right: { display:"flex", flexDirection:"column", gap:12 },
  card: { background:C.panel, border:`1px solid ${C.line}`, borderRadius:14, padding:16 },
  cfgGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 },
  step: { fontSize:11, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:10, display:"flex", alignItems:"center", gap:7 },
  stepNum: { color:C.green, fontWeight:700 },
  lab: { fontSize:10, color:C.dim, marginBottom:5 },
  textarea: { width:"100%", background:C.panel2, border:`1px solid ${C.line}`, borderRadius:9, color:C.white, fontFamily:MONO, fontSize:12, padding:10, resize:"vertical", boxSizing:"border-box", marginBottom:4 },
  input: { width:"100%", background:C.panel2, border:`1px solid ${C.line}`, borderRadius:9, color:C.white, fontFamily:MONO, fontSize:12, padding:"9px 11px", boxSizing:"border-box" },
  btnPrimary: { width:"100%", background:C.green, color:C.black, border:"none", borderRadius:9, padding:"11px 14px", fontFamily:MONO, fontSize:12, fontWeight:700, cursor:"pointer" },
  btnGhost: { background:"transparent", color:C.white, border:`1px solid ${C.line}`, borderRadius:8, padding:"7px 13px", fontFamily:MONO, fontSize:11, cursor:"pointer" },
  ideia: { textAlign:"left", border:`1px solid`, borderRadius:9, padding:"11px 13px", cursor:"pointer", fontFamily:MONO, color:C.white },
  ideiaTit: { fontSize:12, fontWeight:700, marginBottom:3, lineHeight:1.3 },
  ideiaAng: { fontSize:10, color:C.dim, lineHeight:1.4 },
  targetRow: { display:"flex", gap:6, marginBottom:9 },
  targetBtn: { flex:1, border:`1px solid ${C.line}`, borderRadius:8, padding:"6px 10px", fontFamily:MONO, fontSize:10, fontWeight:700, cursor:"pointer" },
  chatLog: { maxHeight:100, overflowY:"auto", marginBottom:9, display:"flex", flexDirection:"column", gap:5 },
  chatMsg: { fontSize:10, lineHeight:1.4 },
  erro: { background:"rgba(137,40,255,0.12)", border:`1px solid ${C.purple}`, borderRadius:9, padding:11, fontSize:11 },
  previewBar: { display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 },
  styleSwitch: { display:"inline-flex", background:C.panel, border:`1px solid ${C.line}`, borderRadius:9, padding:3, gap:3 },
  styleBtn: { border:"none", borderRadius:7, padding:"6px 11px", fontFamily:MONO, fontSize:11, fontWeight:700, cursor:"pointer" },
  stage: { display:"flex", justifyContent:"center", alignItems:"center", minHeight:440, background:C.panel, border:`1px solid ${C.line}`, borderRadius:14, padding:20 },
  placeholder: { color:C.dim, fontSize:12, textAlign:"center", maxWidth:280 },
  nav: { display:"flex", alignItems:"center", justifyContent:"center", gap:14 },
  navBtn: { background:C.panel, color:C.white, border:`1px solid ${C.line}`, borderRadius:8, width:38, height:34, fontSize:15, cursor:"pointer" },
  dots: { display:"flex", gap:6 }, dot: { width:7, height:7, borderRadius:"50%", cursor:"pointer" },
  slideTools: { display:"flex", gap:7, justifyContent:"center", flexWrap:"wrap" },
  uploadBtn: { background:"transparent", color:C.green, border:`1px solid ${C.green}`, borderRadius:7, padding:"6px 11px", fontFamily:MONO, fontSize:10, cursor:"pointer" },
  removeImg: { background:"transparent", color:C.dim, border:`1px solid ${C.line}`, borderRadius:7, padding:"6px 11px", fontFamily:MONO, fontSize:10, cursor:"pointer" },
  posBtn: { border:`1px solid ${C.line}`, borderRadius:7, padding:"6px 11px", fontFamily:MONO, fontSize:10, cursor:"pointer" },
  promptBox: { background:C.panel, border:`1px solid ${C.line}`, borderRadius:11, padding:12 },
  promptHead: { fontSize:9, letterSpacing:"0.1em", color:C.dim, marginBottom:7, display:"flex", justifyContent:"space-between", alignItems:"center" },
  promptTxt: { fontSize:11, lineHeight:1.5, color:"rgba(255,255,255,0.85)" },
  copyMini: { background:"transparent", color:C.green, border:`1px solid ${C.green}`, borderRadius:5, padding:"2px 8px", fontSize:9, fontFamily:MONO, cursor:"pointer" },
  avatarMini: { width:42, height:42, borderRadius:"50%", background:C.purple, color:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:13, fontFamily:MONO, backgroundSize:"cover", backgroundPosition:"center" },
};
const TW = {
  card: { width:SLIDE_W, height:SLIDE_H, overflow:"hidden", background:C.white, borderRadius:18, padding:20, boxSizing:"border-box", boxShadow:"0 20px 50px rgba(0,0,0,0.45)", display:"flex", flexDirection:"column" },
  top: { display:"flex", alignItems:"center", gap:11, marginBottom:14 },
  avatar: { width:42, height:42, borderRadius:"50%", background:C.purple, color:C.white, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:14, fontFamily:MONO },
  name: { fontWeight:700, fontSize:13, color:"#0f1419", fontFamily:MONO },
  handle: { fontSize:11, color:"#536471", fontFamily:MONO },
  body: { fontFamily:MONO, fontSize:16, lineHeight:1.3, color:"#0f1419", fontWeight:700, textWrap:"balance" },
  sub: { marginTop:10, fontSize:12, lineHeight:1.45, color:"#0f1419", fontFamily:MONO },
  quote: { marginTop:12, borderLeft:`3px solid ${C.green}`, paddingLeft:11, fontSize:12, fontWeight:700, color:"#0f1419", fontFamily:MONO },
  foot: { paddingTop:14, borderTop:"1px solid #eff3f4", fontSize:10, color:"#536471", fontFamily:MONO },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap');
* { box-sizing:border-box; margin:0; padding:0; }
body { background:#000; }
button:disabled { opacity:0.45; cursor:not-allowed; }
select { appearance:none; }
input[type=range] { height:4px; }
textarea:focus, input:focus, button:focus-visible, select:focus { outline:2px solid ${C.green}; outline-offset:1px; }
@media (max-width:820px) { .__grid { grid-template-columns:1fr !important; } }
`;
