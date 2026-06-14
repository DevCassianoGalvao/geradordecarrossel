import React, { useState, useEffect, useRef } from "react";

// ============================================================
//  GERADOR DE CARROSSEL — Cassiano Galvão · v3
//  Fix do merge no ajuste · autosave · configs de agente ·
//  direção/estilo de imagem · posição de imagem · export.
// ============================================================

const HANDLE = "@cassianogalvao.web";
const NOME = "Cassiano Galvão";
const C = {
  black: "#000000", panel: "#0d0d10", panel2: "#141418",
  purple: "#8928FF", green: "#00EF9E", white: "#FFFFFF",
  line: "rgba(255,255,255,0.10)", dim: "rgba(255,255,255,0.55)",
};
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const SLIDE_W = 340, SLIDE_H = 425;

const CONTEXTO = `Você é o estrategista de conteúdo do Cassiano Galvão, web designer há 16 anos (+160 projetos). Reposicionamento: "parei de vender SÓ sites" — entrega o site MAIS o sistema que faz ele trabalhar (mini-CRM, painel, simulador, automação). Diferencial: julgamento sobre o que construir + entregar o sistema sozinho. A IA é commodity; NUNCA venda a ferramenta nem ensine o público a fazer sozinho.
PÚBLICO: profissionais de saúde CONSOLIDADOS e individuais no BRASIL TODO (dermato, plástica, harmonização, odonto/implante, oftalmo) — consultório próprio, caixa, agenda cheia, já investem em presença. Conteúdo nacional: NÃO mencione cidade específica.
REGRAS: fale da DOR do público (site parado que não capta, agendamento só por telefone, recepção afogada no WhatsApp, paciente que pesquisa de madrugada e some pro concorrente). Posicione o Cassiano como autoridade de julgamento. NUNCA invente métrica.`;

const ANTI_IA = `VOZ: primeira pessoa ("eu", "meu", "minha") — é o Instagram do Cassiano. Ele fala como especialista que já viu esse erro mil vezes, não como redator.

COPYWRITING DE CARROSSEL (obrigatório):
- Slide 1 (CAPA): gancho que interrompe o scroll. Curiosidade, dor nomeada ou afirmação que incomoda. Máx 7 palavras.
- Slides 2-3: aprofunda a dor com cena concreta e específica. O leitor tem que pensar "isso é exatamente o que acontece comigo".
- Slides 4-5: virada — o que muda quando o problema é resolvido, sem prometer milagre.
- Último slide (CTA): convite direto, baixo risco, sem pressão.
- Cada slide deve ter UMA ideia só. Narrativa linear: cada slide leva ao próximo.
- Punchline: a frase que o leitor vai copiar pro status. Curta, direta, memorável.

PROIBIÇÕES absolutas:
- Travessão (—) no meio de frases. Nunca.
- "Não é X, é Y", "imagine que", "vamos", "descubra", "transforme", "no fim das contas", "veja bem", "afinal".
- Frases todas do mesmo tamanho. Varie: frase longa. Depois, seca.
- Perguntas retóricas empilhadas.
- Listas com marcadores dentro do corpo do slide.
- Qualquer coisa que soe como e-mail marketing ou post corporativo.

Português do Brasil falado. Cena concreta vence abstração sempre.`;


const HOOK_CAPA = `A CAPA precisa parar o dedo: máx 7 palavras, registro de provocação (não explicação). Use UMA técnica: loop aberto / número específico / afirmação contra o senso comum / chamar o avatar direto / custo concreto (paciente perdido) / imagem vívida.`;

const STYLE_TPL = {
  premium: "dark premium tech aesthetic, pure black background, electric purple (#8928FF) and mint green (#00EF9E) volumetric glow, 3D render, cinematic lighting, moody, high-end",
  pixel: "16-bit pixel art, retro SNES-era nintendo game art, cozy detailed scene, warm lighting with purple (#8928FF) and mint green (#00EF9E) accents, crisp pixel shading",
  minimal: "minimalist editorial illustration, generous negative space, single mint green (#00EF9E) accent on near-black, clean geometric shapes",
  foto: "photorealistic cinematic photography, shallow depth of field, premium moody lighting, professional",
};

async function askClaude(prompt) {
  const r = await fetch("/api/claude", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
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
  let u = parsed;
  if (Array.isArray(u)) u = u[0] || {};
  if (u && u.slide) u = u.slide;
  return u || {};
}
function splitTitulo(titulo, destaque) {
  if (!destaque || !titulo) return [{ t: titulo || "", hi: false }];
  const i = titulo.toLowerCase().indexOf(destaque.toLowerCase());
  if (i === -1) return [{ t: titulo, hi: false }];
  return [{ t: titulo.slice(0, i), hi: false }, { t: titulo.slice(i, i + destaque.length), hi: true }, { t: titulo.slice(i + destaque.length), hi: false }].filter((p) => p.t.length > 0);
}
async function saveState(obj) { try { if (window.storage) await window.storage.set("carrossel:last", JSON.stringify(obj), false); } catch (_) {} }
async function loadState() { try { if (!window.storage) return null; const r = await window.storage.get("carrossel:last", false); return r ? JSON.parse(r.value) : null; } catch (_) { return null; } }

export default function App() {
  const [foco, setFoco] = useState("Sites de clínica que são vitrine parada e não captam paciente");
  const [ideias, setIdeias] = useState([]);
  const [ideiaSel, setIdeiaSel] = useState(null);
  const [slides, setSlides] = useState([]);
  const [estilo, setEstilo] = useState("sortido");
  const [idx, setIdx] = useState(0);
  const [carregando, setCarregando] = useState("");
  const [erro, setErro] = useState("");
  // chat
  const [chatInput, setChatInput] = useState("");
  const [chatTarget, setChatTarget] = useState("slide");
  const [chatLog, setChatLog] = useState([]);
  const [chatBusy, setChatBusy] = useState(false);
  // configs / agentes
  const [showCfg, setShowCfg] = useState(false);
  const [perfil, setPerfil] = useState(null);
  const [copyInstr, setCopyInstr] = useState("");
  const [imgDir, setImgDir] = useState("");
  const [imgStyle, setImgStyle] = useState("premium");
  const [capaPadrao, setCapaPadrao] = useState(0); // layout inicial da capa
  const [objetivo, setObjetivo] = useState("educacional");
  const [isca, setIsca] = useState("");
  const slideRef = useRef(null);

  // carregar sessão
  useEffect(() => { (async () => {
    const s = await loadState();
    if (s) {
      if (s.foco) setFoco(s.foco);
      if (s.copyInstr) setCopyInstr(s.copyInstr);
      if (s.imgDir) setImgDir(s.imgDir);
      if (s.imgStyle) setImgStyle(s.imgStyle);
      if (s.estilo) setEstilo(s.estilo);
      if (Array.isArray(s.slides) && s.slides.length) setSlides(s.slides);
    }
  })(); }, []);
  // autosave (sem imagens, pra ficar leve)
  useEffect(() => {
    saveState({ foco, copyInstr, imgDir, imgStyle, estilo, slides: slides.map((s) => ({ tipo: s.tipo, titulo: s.titulo, destaque: s.destaque, corpo: s.corpo, punchline: s.punchline, image_prompt: s.image_prompt, imgPos: s.imgPos, coverLayout: s.coverLayout })) });
  }, [foco, copyInstr, imgDir, imgStyle, estilo, slides]);

  const ctx = () => CONTEXTO + (copyInstr ? "\n\nINSTRUÇÕES EXTRAS DO CASSIANO:\n" + copyInstr : "") + "\n\n" + ANTI_IA;

  async function gerarIdeias() {
    setErro(""); setCarregando("ideias"); setIdeias([]); setIdeiaSel(null);
    try {
      const out = await askClaude(`${ctx()}

TAREFA: 6 ideias de carrossel sobre: "${foco}". Cada ideia é um ângulo afiado que dói no profissional de saúde consolidado.
APENAS JSON: [{"titulo":"","angulo":"","gancho":""}]`);
      const d = parseJSON(out); setIdeias(Array.isArray(d) ? d : d.ideias || []);
    } catch (e) { setErro(e.message); } finally { setCarregando(""); }
  }

  async function gerarCarrossel(ideia) {
    setErro(""); setIdeiaSel(ideia); setCarregando("carrossel"); setSlides([]); setIdx(0); setChatLog([]); setIsca("");
    const objTxt = objetivo === "isca"
      ? `OBJETIVO: ISCA. O último slide (cta) é um convite "comente PALAVRA pra receber [material]" — escolha uma PALAVRA-gatilho curta em MAIÚSCULAS. Proponha também uma ISCA: um material baixável concreto e específico que o Cassiano pode produzir (ex.: "Checklist: 9 pontos que fazem o site de uma clínica perder paciente — PDF").`
      : objetivo === "provocativo"
      ? `OBJETIVO: PROVOCATIVO. Sem isca, sem "comente pra receber". O último slide crava uma opinião que incomoda e fecha com convite leve (seguir, ou DM se quiser trocar ideia). Campo "isca" vazio.`
      : `OBJETIVO: EDUCACIONAL. Sem isca, sem "comente pra receber". O último slide fecha com a lição principal e um convite leve (seguir pra mais, ou DM). Campo "isca" vazio.`;
    try {
      const out = await askClaude(`${ctx()}

${HOOK_CAPA}

${objTxt}

TAREFA: carrossel completo sobre: Título "${ideia.titulo}" | Ângulo "${ideia.angulo}".
1 CAPA + 4-5 CONTEÚDO + 1 CTA. Cada slide: "tipo"(capa|conteudo|cta), "titulo", "destaque"(palavra contida no título), "corpo"(1-2 frases curtas ou ""), "punchline"(frase tweetável ou "").
APENAS JSON: {"isca":"<ideia de material baixável, ou string vazia>","slides":[{"tipo":"capa","titulo":"","destaque":"","corpo":"","punchline":""}]}`);
      const d = parseJSON(out);
      const obj = Array.isArray(d) ? { isca: "", slides: d } : d;
      const arr = (obj.slides || []).map((s) => ({ ...s, bgImage: null, imgPos: "top", coverLayout: capaPadrao }));
      setIsca(obj.isca || "");
      setSlides(arr); gerarPrompts(arr);
    } catch (e) { setErro(e.message); } finally { setCarregando(""); }
  }

  async function gerarPrompts(arr) {
    try {
      const base = arr || slides;
      const lista = base.map((s, i) => `${i + 1}. TÍTULO: ${s.titulo} | MENSAGEM: ${[s.corpo, s.punchline].filter(Boolean).join(" ")}`).join("\n");
      const personagem = imgDir ? `PERSONAGEM RECORRENTE — mantenha EXATAMENTE a mesma aparência (rosto, cabelo, roupa) em TODAS as imagens: ${imgDir}. ` : "";
      const out = await askClaude(`Gere prompts de imagem (INGLÊS) para ${base.length} slides de carrossel.
Cada prompt deve CAPTAR O SENTIMENTO e a cena da mensagem do slide. A imagem conta a mesma história que o texto.
${personagem}
ÂNGULOS OBRIGATORIAMENTE VARIADOS — NÃO repita posição de câmera ou postura:
slide 1: wide establishing shot / slide 2: medium shot, 3/4 angle / slide 3: close-up face or hands / slide 4: low-angle dramatic / slide 5+: over-the-shoulder or bird's eye.
Ações do personagem devem ser RELATIVAS ao conteúdo: se o texto fala de agenda cheia, personagem com prancheta e fila; se fala de paciente sumindo, personagem olhando porta fechada; se fala de resultado, personagem comemorando ou relaxado.
Varie também: dia/noite, interior/exterior, sozinho/com outros, emoção (frustração, alívio, foco, celebração).
Estética OBRIGATÓRIA: ${STYLE_TPL[imgStyle]}. no text, no watermark, no logo, no UI elements. Máx 40 palavras cada.
Slides:\n${lista}
APENAS JSON: array de strings na ordem.`);
      const d = parseJSON(out);
      if (Array.isArray(d)) setSlides((p) => p.map((s, i) => ({ ...s, image_prompt: d[i] || "" })));
    } catch (_) {}
  }

  async function enviarAjuste() {
    const instr = chatInput.trim();
    if (!instr || !slides.length) return;
    setChatBusy(true); setChatLog((l) => [...l, { who: "voce", txt: instr }]); setChatInput("");
    try {
      if (chatTarget === "slide") {
        const s = slides[idx];
        const payload = { tipo: s.tipo, titulo: s.titulo, destaque: s.destaque, corpo: s.corpo, punchline: s.punchline };
        const out = await askClaude(`${ctx()}\n\nUM slide (JSON):\n${JSON.stringify(payload)}\nAjuste conforme: "${instr}". Mantenha as chaves. APENAS o JSON do slide atualizado.`);
        const upd = asSlideObj(parseJSON(out));
        setSlides((p) => p.map((sl, i) => (i === idx ? { ...sl, ...upd } : sl)));
        setChatLog((l) => [...l, { who: "claude", txt: "Slide " + (idx + 1) + " atualizado." }]);
      } else {
        const payload = slides.map((s) => ({ tipo: s.tipo, titulo: s.titulo, destaque: s.destaque, corpo: s.corpo, punchline: s.punchline }));
        const out = await askClaude(`${ctx()}\n\n${HOOK_CAPA}\n\nCarrossel inteiro (JSON):\n${JSON.stringify(payload)}\nAjuste conforme: "${instr}". Mesmas chaves e mesma quantidade. APENAS o JSON (array).`);
        let upd = parseJSON(out); if (!Array.isArray(upd)) upd = upd.slides || [];
        if (Array.isArray(upd) && upd.length) {
          setSlides((p) => upd.map((u, i) => ({ ...(p[i] || {}), ...u })));
          setChatLog((l) => [...l, { who: "claude", txt: "Carrossel atualizado." }]);
        }
      }
    } catch (e) { setChatLog((l) => [...l, { who: "claude", txt: "Deu ruim: " + e.message }]); }
    finally { setChatBusy(false); }
  }

  function onUpload(e, target) {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => { if (target === "perfil") setPerfil(rd.result); else setSlides((p) => p.map((s, i) => (i === idx ? { ...s, bgImage: rd.result } : s))); };
    rd.readAsDataURL(f);
  }
  function setSlideField(field, val) { setSlides((p) => p.map((s, i) => (i === idx ? { ...s, [field]: val } : s))); }

  function copiar(txt) { const ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (_) {} document.body.removeChild(ta); }
  function baixar(nome, conteudo, tipo) { const b = new Blob([conteudo], { type: tipo }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = nome; a.click(); URL.revokeObjectURL(u); }
  function exportarRoteiro() {
    const head = `CARROSSEL — ${ideiaSel ? ideiaSel.titulo : ""}\nDireção de imagem: ${imgDir || "-"} | Estilo: ${imgStyle}\n\n`;
    const body = slides.map((s, i) => `SLIDE ${i + 1} [${s.tipo}]\nTítulo: ${s.titulo}\nCorpo: ${s.corpo || "-"}\nPunchline: ${s.punchline || "-"}\nPrompt de imagem: ${s.image_prompt || "-"}\n`).join("\n");
    baixar("roteiro-carrossel.txt", head + body, "text/plain");
  }
  async function exportarPNG() {
    if (!slide) return;
    try { await Promise.all([document.fonts.load("700 90px 'IBM Plex Mono'"), document.fonts.load("italic 700 90px 'IBM Plex Mono'"), document.fonts.load("400 40px 'IBM Plex Mono'")]); } catch (_) {}
    const W = 1080, H = 1350, k = W / SLIDE_W, pad = Math.round(24 * k);
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H; const ctx = cv.getContext("2d");
    const eff = estilo === "twitter" ? "twitter" : (estilo === "sortido" ? (slide.tipo === "conteudo" ? "light" : "dark") : estilo);
    const img = slide.bgImage ? await cvLoadImg(slide.bgImage) : null;

    if (eff === "twitter") {
      ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, W, H);
      let y = pad; const aR = 44 * k / 2, aX = pad + aR, aY = y + aR;
      const av = perfil ? await cvLoadImg(perfil) : null;
      ctx.save(); ctx.beginPath(); ctx.arc(aX, aY, aR, 0, Math.PI * 2); ctx.closePath(); ctx.clip();
      if (av) { cvCover(ctx, av, pad, y, aR * 2, aR * 2); } else { ctx.fillStyle = C.purple; ctx.fillRect(pad, y, aR * 2, aR * 2); ctx.fillStyle = "#fff"; ctx.font = cvFont(15 * k, true, false); ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("CG", aX, aY); ctx.textAlign = "left"; }
      ctx.restore();
      ctx.textBaseline = "top"; ctx.fillStyle = "#0f1419"; ctx.font = cvFont(14 * k, true, false); ctx.fillText(NOME + "  ✦", pad + aR * 2 + 14 * k, y + 5 * k);
      ctx.fillStyle = "#536471"; ctx.font = cvFont(12 * k, false, false); ctx.fillText(HANDLE, pad + aR * 2 + 14 * k, y + 26 * k);
      y += aR * 2 + 16 * k;
      y = cvDrawTitle(ctx, cvTitleWords(slide), pad, y, 17 * k, 17 * k * 1.32, "#0f1419", C.purple, W - pad * 2, "left") + 10 * k;
      if (img) { const bh = 150 * k; cvRound(ctx, pad, y, W - pad * 2, bh, 14 * k); ctx.save(); ctx.clip(); cvCover(ctx, img, pad, y, W - pad * 2, bh); ctx.restore(); y += bh + 12 * k; }
      if (slide.corpo) y = cvDrawPara(ctx, slide.corpo, pad, y, 12.5 * k, 12.5 * k * 1.5, "#0f1419", W - pad * 2) + 8 * k;
      if (slide.punchline) { ctx.font = cvFont(12.5 * k, true, false); const pl = cvWrap(ctx, slide.punchline, W - pad * 2 - 14 * k); const ph = pl.length * 12.5 * k * 1.4; ctx.fillStyle = C.green; ctx.fillRect(pad, y, 4 * k, ph); let yy = y; ctx.fillStyle = "#0f1419"; ctx.textBaseline = "top"; for (const l of pl) { ctx.fillText(l, pad + 14 * k, yy); yy += 12.5 * k * 1.4; } }
      ctx.fillStyle = "#536471"; ctx.font = cvFont(12 * k, false, false); ctx.fillText(page(idx, slides.length), pad, H - pad - 12 * k);
    } else {
      const light = eff === "light", accent = light ? C.purple : C.green, fg = light ? "#000" : "#fff";
      ctx.fillStyle = light ? "#FAFAF7" : "#000000"; ctx.fillRect(0, 0, W, H);
      const fullImg = img && (slide.tipo === "capa" || slide.imgPos === "bg");
      if (fullImg) { cvCover(ctx, img, 0, 0, W, H); if (slide.tipo === "capa") { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "rgba(0,0,0,.12)"); g.addColorStop(1, "rgba(0,0,0,.82)"); ctx.fillStyle = g; } else { ctx.fillStyle = light ? "rgba(250,250,247,.84)" : "rgba(0,0,0,.7)"; } ctx.fillRect(0, 0, W, H); }
      if (!light) cvGlows(ctx, W, H);
      const footY = H - pad - 30 * k;
      const footer = () => { ctx.strokeStyle = light ? "rgba(0,0,0,.12)" : "rgba(255,255,255,.10)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, footY); ctx.lineTo(W - pad, footY); ctx.stroke(); ctx.textBaseline = "top"; ctx.font = cvFont(11 * k, false, false); ctx.fillStyle = light ? "rgba(0,0,0,.45)" : C.dim; ctx.fillText(HANDLE, pad, footY + 12 * k); ctx.font = cvFont(11 * k, false, true); ctx.fillStyle = accent; const pg = page(idx, slides.length); ctx.fillText(pg, W - pad - ctx.measureText(pg).width, footY + 12 * k); };

      if (slide.tipo === "capa") {
        const tColor = fullImg ? "#fff" : fg, tAccent = fullImg ? C.green : accent;
        let y = H * 0.5;
        y = cvDrawTitle(ctx, cvTitleWords(slide), pad, y, 28 * k, 28 * k * 1.16, tColor, tAccent, W - pad * 2, "left");
        if (slide.corpo) y = cvDrawPara(ctx, slide.corpo, pad, y + 10 * k, 13 * k, 13 * k * 1.5, fullImg ? "rgba(255,255,255,.85)" : (light ? "rgba(0,0,0,.6)" : "rgba(255,255,255,.7)"), W - pad * 2);
        ctx.font = cvFont(10 * k, false, false); ctx.fillStyle = fullImg ? "rgba(255,255,255,.7)" : (light ? "rgba(0,0,0,.4)" : C.dim); ctx.textBaseline = "top"; ctx.fillText("ARRASTA →", pad, y + 14 * k);
        footer();
      } else {
        let y = pad;
        ctx.font = cvFont(10 * k, false, false); ctx.fillStyle = light ? "rgba(0,0,0,.45)" : C.dim; ctx.textBaseline = "top"; ctx.fillText(slide.tipo === "cta" ? "— O CONVITE" : "— O DIAGNÓSTICO", pad, y); y += 24 * k;
        if (img && slide.imgPos === "top") { const bh = 96 * k; cvRound(ctx, pad, y, W - pad * 2, bh, 10 * k); ctx.save(); ctx.clip(); cvCover(ctx, img, pad, y, W - pad * 2, bh); ctx.restore(); y += bh + 14 * k; }
        y = cvDrawTitle(ctx, cvTitleWords(slide), pad, y, 20 * k, 20 * k * 1.16, fg, accent, W - pad * 2, "left");
        if (slide.corpo) y = cvDrawPara(ctx, slide.corpo, pad, y + 12 * k, 12.5 * k, 12.5 * k * 1.45, light ? "rgba(0,0,0,.66)" : "rgba(255,255,255,.74)", W - pad * 2);
        if (img && slide.imgPos === "bottom") { const bh = 96 * k; y += 14 * k; cvRound(ctx, pad, y, W - pad * 2, bh, 10 * k); ctx.save(); ctx.clip(); cvCover(ctx, img, pad, y, W - pad * 2, bh); ctx.restore(); }
        if (slide.punchline) { ctx.font = cvFont(12.5 * k, true, false); const pl = cvWrap(ctx, slide.punchline, W - pad * 2 - 14 * k); const ph = pl.length * 12.5 * k * 1.4; const py = footY - ph - 28 * k; ctx.fillStyle = accent; ctx.fillRect(pad, py, 4 * k, ph); let yy = py; ctx.fillStyle = fg; ctx.textBaseline = "top"; for (const l of pl) { ctx.fillText(l, pad + 14 * k, yy); yy += 12.5 * k * 1.4; } }
        footer();
      }
    }
    cv.toBlob((b) => { if (!b) { alert("Falhou ao gerar PNG."); return; } const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = `slide-${idx + 1}.png`; a.click(); URL.revokeObjectURL(u); }, "image/png");
  }

  const slide = slides[idx];

  return (
    <div style={St.root}>
      <style>{CSS}</style>
      <header style={St.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div><div style={St.brand}>GERADOR DE CARROSSEL</div><div style={St.brandSub}>{NOME}</div></div>
        </div>
        <button style={St.btnGhost} onClick={() => setShowCfg((v) => !v)}>⚙ Configurações</button>
      </header>

      {/* PAINEL DE CONFIGURAÇÕES / AGENTES */}
      {showCfg && (
        <section style={{ ...St.card, marginBottom: 18 }}>
          <div style={St.cfgGrid}>
            <div>
              <div style={St.lab}>Foto de perfil (avatar do estilo Tweet)</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ ...St.avatarMini, backgroundImage: perfil ? `url(${perfil})` : "none" }}>{!perfil && "CG"}</div>
                <label style={St.uploadBtn}>enviar foto<input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => onUpload(e, "perfil")} /></label>
                {perfil && <button style={St.removeImg} onClick={() => setPerfil(null)}>remover</button>}
              </div>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={St.lab}>Agente de copy — instruções extras</div>
              <textarea style={St.textarea} rows={2} value={copyInstr} onChange={(e) => setCopyInstr(e.target.value)} placeholder="ex.: tom mais direto, foco em harmonização, evitar jargão…" />
            </div>
          </div>
        </section>
      )}

      <div className="__grid" style={St.grid}>
        {/* ESQUERDA */}
        <div style={St.left}>
          <section style={St.card}>
            <div style={St.step}><span style={St.stepNum}>01</span> Foco do conteúdo</div>
            <textarea style={St.textarea} value={foco} onChange={(e) => setFoco(e.target.value)} rows={3} />
            <div style={St.lab}>Capa do próximo carrossel</div>
            <select style={St.input} value={capaPadrao} onChange={(e) => setCapaPadrao(Number(e.target.value))}>
              <option value={0}>Só texto (glow)</option>
              <option value={1}>Só texto (centrado)</option>
              <option value={2}>Imagem de fundo</option>
              <option value={3}>Imagem horizontal em cima</option>
              <option value={4}>Imagem horizontal embaixo</option>
            </select>
            <div style={{ ...St.lab, marginTop: 10 }}>Objetivo do carrossel</div>
            <select style={St.input} value={objetivo} onChange={(e) => setObjetivo(e.target.value)}>
              <option value="educacional">Educacional (sem isca)</option>
              <option value="provocativo">Provocativo (sem isca)</option>
              <option value="isca">Isca — "comente pra receber"</option>
            </select>
            <div style={{ ...St.lab, marginTop: 10 }}>Direção das imagens deste carrossel</div>
            <input style={St.input} value={imgDir} onChange={(e) => setImgDir(e.target.value)} placeholder="ex.: uma médica dermatologista" />
            <div style={{ ...St.lab, marginTop: 8 }}>Estilo das imagens</div>
            <select style={St.input} value={imgStyle} onChange={(e) => setImgStyle(e.target.value)}>
              <option value="premium">Premium dark tech (sua paleta)</option>
              <option value="pixel">Pixel-art 8-bit</option>
              <option value="minimal">Minimalista editorial</option>
              <option value="foto">Fotográfico cinematográfico</option>
            </select>
            {slides.length > 0 && <button style={{ ...St.btnGhost, marginTop: 8 }} onClick={() => gerarPrompts()}>regenerar prompts deste carrossel</button>}
            <button style={{ ...St.btnPrimary, marginTop: 12 }} onClick={gerarIdeias} disabled={carregando === "ideias"}>{carregando === "ideias" ? "Pensando…" : "Gerar 6 ideias"}</button>
          </section>

          {ideias.length > 0 && (
            <section style={St.card}>
              <div style={St.step}><span style={St.stepNum}>02</span> Escolha um ângulo</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ideias.map((it, i) => {
                  const sel = ideiaSel && ideiaSel.titulo === it.titulo;
                  return (<button key={i} onClick={() => gerarCarrossel(it)} style={{ ...St.ideia, borderColor: sel ? C.green : C.line, background: sel ? "rgba(0,239,158,0.06)" : C.panel2 }}>
                    <div style={St.ideiaTit}>{it.titulo}</div><div style={St.ideiaAng}>{it.angulo}</div></button>);
                })}
              </div>
            </section>
          )}
          {erro && <div style={St.erro}>{erro}</div>}
        </div>

        {/* DIREITA */}
        <div style={St.right}>
          <div style={St.previewBar}>
            <div style={St.styleSwitch}>
              {[["dark", "Escuro"], ["light", "Claro"], ["sortido", "Sortido"], ["twitter", "Tweet"]].map(([k, l]) => (
                <button key={k} onClick={() => setEstilo(k)} style={{ ...St.styleBtn, color: estilo === k ? C.black : C.white, background: estilo === k ? C.green : "transparent" }}>{l}</button>
              ))}
            </div>
            {slides.length > 0 && (<div style={{ display: "flex", gap: 8 }}>
              <button style={St.btnGhost} onClick={() => copiar(slides.map((s, i) => `SLIDE ${i + 1}\n${s.titulo}\n${s.corpo || ""}\n${s.punchline ? "» " + s.punchline : ""}`).join("\n\n"))}>Copiar texto</button>
              <button style={St.btnGhost} onClick={exportarRoteiro}>Exportar roteiro</button>
            </div>)}
          </div>

          {isca && <div style={{ background: "rgba(0,239,158,0.08)", border: `1px solid ${C.green}`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: C.white }}><b style={{ color: C.green }}>Isca sugerida:</b> {isca}</div>}

          <div style={St.stage}>
            {carregando === "carrossel" && <div style={St.placeholder}>Montando o carrossel…</div>}
            {!slide && carregando !== "carrossel" && <div style={St.placeholder}>{ideias.length === 0 ? "Passo 01: foco e gere ideias." : "Passo 02: escolha um ângulo."}</div>}
            {slide && <div ref={slideRef}><Slide slide={slide} estilo={estilo} idx={idx} total={slides.length} perfil={perfil} /></div>}
          </div>

          {slides.length > 0 && (<>
            <div style={St.nav}>
              <button style={St.navBtn} onClick={() => setIdx((i) => Math.max(0, i - 1))} disabled={idx === 0}>←</button>
              <div style={St.dots}>{slides.map((_, i) => <span key={i} onClick={() => setIdx(i)} style={{ ...St.dot, background: i === idx ? C.green : "rgba(255,255,255,0.25)" }} />)}</div>
              <button style={St.navBtn} onClick={() => setIdx((i) => Math.min(slides.length - 1, i + 1))} disabled={idx === slides.length - 1}>→</button>
            </div>

            <div style={St.slideTools}>
              <label style={St.uploadBtn}>{slide.bgImage ? "trocar imagem" : "+ imagem"}<input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => onUpload(e, "slide")} /></label>
              {slide.bgImage && <button style={St.removeImg} onClick={() => setSlideField("bgImage", null)}>remover</button>}
              {slide.bgImage && slide.tipo !== "capa" && [["top", "cima"], ["bottom", "baixo"], ["bg", "fundo"]].map(([k, l]) => (
                <button key={k} onClick={() => setSlideField("imgPos", k)} style={{ ...St.posBtn, background: slide.imgPos === k ? C.green : "transparent", color: slide.imgPos === k ? C.black : C.white }}>{l}</button>
              ))}
              {slide.tipo === "capa" && estilo !== "twitter" && <button style={St.removeImg} onClick={() => setSlideField("coverLayout", ((slide.coverLayout || 0) + 1) % 5)}>trocar capa ({(slide.coverLayout || 0) + 1}/5)</button>}
              <button style={St.removeImg} onClick={exportarPNG}>baixar PNG</button>
            </div>

            <div style={St.promptBox}>
              <div style={St.promptHead}>PROMPT DE IMAGEM · slide {idx + 1}{slide.image_prompt && <button style={St.copyMini} onClick={() => copiar(slide.image_prompt)}>copiar</button>}</div>
              <div style={St.promptTxt}>{slide.image_prompt || "gerando prompt…"}</div>
            </div>

            {/* CHAT DE AJUSTE — agora aqui embaixo */}
            <div style={St.card}>
              <div style={St.step}><span style={St.stepNum}>★</span> Chat de ajuste</div>
              <div style={St.targetRow}>
                {[["slide", "Slide atual"], ["all", "Carrossel todo"]].map(([k, l]) => (
                  <button key={k} onClick={() => setChatTarget(k)} style={{ ...St.targetBtn, color: chatTarget === k ? C.black : C.white, background: chatTarget === k ? C.green : "transparent" }}>{l}</button>
                ))}
              </div>
              {chatLog.length > 0 && <div style={St.chatLog}>{chatLog.map((m, i) => <div key={i} style={{ ...St.chatMsg, color: m.who === "voce" ? C.white : C.green }}><b>{m.who}:</b> {m.txt}</div>)}</div>}
              <textarea style={St.textarea} rows={2} value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="ex.: deixa a capa mais agressiva / mais humano, menos cara de IA" />
              <button style={St.btnPrimary} onClick={enviarAjuste} disabled={chatBusy}>{chatBusy ? "Ajustando…" : "Enviar ajuste"}</button>
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}

// ================= RENDER =================
function Slide({ slide, estilo, idx, total, perfil }) {
  if (estilo === "twitter") return <TweetSlide slide={slide} idx={idx} total={total} perfil={perfil} />;
  const eff = estilo === "sortido" ? (slide.tipo === "conteudo" ? "light" : "dark") : estilo;
  if (slide.tipo === "capa") return <CoverSlide slide={slide} eff={eff} idx={idx} total={total} />;
  return <ContentSlide slide={slide} eff={eff} idx={idx} total={total} />;
}
const page = (i, t) => `${String(i + 1).padStart(2, "0")} / ${String(t).padStart(2, "0")}`;
function glow(color, pos, opacity) { return { position: "absolute", width: 230, height: 230, background: `radial-gradient(circle, ${color}, transparent 70%)`, opacity, filter: "blur(11px)", mixBlendMode: "screen", pointerEvents: "none", ...pos }; }
function Grid() {
  return <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.07) 1px,transparent 1px)", backgroundSize: "32px 32px", zIndex: 1 }} />;
}
function Glows() { return (<><div style={glow(C.purple, { top: -55, left: -45 }, 0.6)} /><div style={glow(C.green, { bottom: -75, right: -55 }, 0.32)} /></>); }
function widow(s) { if (!s) return s; const i = s.lastIndexOf(" "); return i > 0 ? s.slice(0, i) + "\u00A0" + s.slice(i + 1) : s; }
function cvLoadImg(src) { return new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; }); }
function cvCover(ctx, img, x, y, w, h) { const ir = img.width / img.height, r = w / h; let sw, sh, sx, sy; if (ir > r) { sh = img.height; sw = sh * r; sx = (img.width - sw) / 2; sy = 0; } else { sw = img.width; sh = sw / r; sx = 0; sy = (img.height - sh) / 2; } ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h); }
function cvRound(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function cvGlows(ctx, W, H) { ctx.save(); ctx.globalCompositeOperation = "lighter"; let g = ctx.createRadialGradient(W * 0.05, 0, 0, W * 0.05, 0, W * 0.75); g.addColorStop(0, "rgba(137,40,255,0.5)"); g.addColorStop(1, "rgba(137,40,255,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); let g2 = ctx.createRadialGradient(W * 0.95, H, 0, W * 0.95, H, W * 0.75); g2.addColorStop(0, "rgba(0,239,158,0.3)"); g2.addColorStop(1, "rgba(0,239,158,0)"); ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function cvFont(px, bold, italic) { return `${italic ? "italic " : ""}${bold ? "700" : "400"} ${px}px 'IBM Plex Mono', monospace`; }
function cvTitleWords(slide) { const parts = splitTitulo(slide.titulo, slide.destaque); const out = []; parts.forEach((p) => { p.t.split(/\s+/).forEach((tok) => { if (tok) out.push({ w: tok, hi: p.hi }); }); }); return out; }
function cvWrap(ctx, text, maxW) { const words = (text || "").split(/\s+/).filter(Boolean); const lines = []; let line = ""; for (const w of words) { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; } if (line) lines.push(line); return lines; }
function cvDrawPara(ctx, text, x, y, px, lineH, color, maxW) { ctx.font = cvFont(px, false, false); ctx.fillStyle = color; ctx.textBaseline = "top"; for (const l of cvWrap(ctx, text, maxW)) { ctx.fillText(l, x, y); y += lineH; } return y; }
function cvDrawTitle(ctx, words, x, y, px, lineH, color, accent, maxW, align) {
  ctx.textBaseline = "top"; ctx.font = cvFont(px, true, false); const spaceW = ctx.measureText(" ").width;
  const lines = []; let cur = [], curW = 0;
  for (const tk of words) { ctx.font = cvFont(px, true, tk.hi); const ww = ctx.measureText(tk.w).width; const add = (cur.length ? spaceW : 0) + ww; if (curW + add > maxW && cur.length) { lines.push(cur); cur = [tk]; curW = ww; } else { cur.push(tk); curW += add; } }
  if (cur.length) lines.push(cur);
  for (const ln of lines) { let tw = 0; ln.forEach((tk, i) => { ctx.font = cvFont(px, true, tk.hi); tw += ctx.measureText(tk.w).width + (i ? spaceW : 0); }); let cx = align === "center" ? x + (maxW - tw) / 2 : x; for (const tk of ln) { ctx.font = cvFont(px, true, tk.hi); ctx.fillStyle = tk.hi ? accent : color; ctx.fillText(tk.w, cx, y); cx += ctx.measureText(tk.w).width + spaceW; } y += lineH; }
  return y;
}

function Foot({ light, accent, label }) {
  return <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: light ? "rgba(0,0,0,0.45)" : C.dim, borderTop: `1px solid ${light ? "rgba(0,0,0,0.12)" : C.line}`, paddingTop: 12 }}>
    <span>{HANDLE}</span><span style={{ color: accent, fontStyle: "italic" }}>{label}</span></div>;
}
function Title({ slide, size, color, accent }) {
  const parts = splitTitulo(slide.titulo, slide.destaque);
  return <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: size, lineHeight: 1.12, color, textWrap: "balance" }}>
    {parts.map((p, i) => <span key={i} style={p.hi ? { fontStyle: "italic", color: accent } : undefined}>{p.t}</span>)}</div>;
}
function cardBase(light, h) { return { width: SLIDE_W, height: h || SLIDE_H, borderRadius: 14, position: "relative", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.55)", border: light ? "none" : `1px solid ${C.line}`, background: light ? "#FAFAF7" : C.black }; }
function band(src, h) { return <div style={{ borderRadius: 10, overflow: "hidden", height: h || 96, flexShrink: 0 }}><img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>; }
const imgFull = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };
const scrim = { position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,.12),rgba(0,0,0,.82))" };
const padCol = { position: "relative", height: "100%", padding: 24, display: "flex", flexDirection: "column", boxSizing: "border-box", zIndex: 2 };

function CoverSlide({ slide, eff, idx, total }) {
  const light = eff === "light", accent = light ? C.purple : C.green, fg = light ? C.black : C.white;
  const lay = slide.coverLayout || 0, img = slide.bgImage;

  if (lay === 2 && img) return (
    <div style={cardBase(light)}>
      <img src={img} alt="" style={imgFull} /><div style={scrim} />
      <div style={padCol}>
        <div style={{ flex: 1 }} />
        <Title slide={slide} size={27} color={C.white} accent={C.green} />
        <div style={{ marginTop: 16 }}><Foot light={false} accent={C.green} label={page(idx, total)} /></div>
      </div>
    </div>
  );
  if (lay === 1) return (
    <div style={cardBase(light)}>
      {!light && <><Grid /><Glows /></>}
      <div style={{ ...padCol, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <Title slide={slide} size={28} color={fg} accent={accent} />
        {slide.corpo && <div style={{ marginTop: 16, fontSize: 13, color: light ? "rgba(0,0,0,.6)" : "rgba(255,255,255,.7)", maxWidth: 250, textWrap: "pretty" }}>{widow(slide.corpo)}</div>}
        <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}><Foot light={light} accent={accent} label={page(idx, total)} /></div>
      </div>
    </div>
  );
  if ((lay === 3 || lay === 4) && img) return (
    <div style={cardBase(light)}>
      {!light && <><Grid /><Glows /></>}
      <div style={{ ...padCol, justifyContent: "center", gap: 16 }}>
        {lay === 3 && band(img, 150)}
        <Title slide={slide} size={26} color={fg} accent={accent} />
        {lay === 4 && band(img, 150)}
        <div style={{ flex: 1 }} /><Foot light={light} accent={accent} label={page(idx, total)} />
      </div>
    </div>
  );
  return (
    <div style={cardBase(light)}>
      {img && <img src={img} alt="" style={imgFull} />}{img && <div style={scrim} />}{!light && !img && <Glows />}
      <div style={padCol}>
        <div style={{ flex: 1 }} />
        <Title slide={slide} size={28} color={img ? C.white : fg} accent={img ? C.green : accent} />
        {slide.corpo && <div style={{ marginTop: 12, fontSize: 13, color: img ? "rgba(255,255,255,.85)" : (light ? "rgba(0,0,0,.6)" : "rgba(255,255,255,.7)"), textWrap: "pretty" }}>{widow(slide.corpo)}</div>}
        <div style={{ fontSize: 10, letterSpacing: "0.14em", color: img ? "rgba(255,255,255,.7)" : (light ? "rgba(0,0,0,.4)" : C.dim), margin: "16px 0 14px" }}>ARRASTA →</div>
        <Foot light={light && !img} accent={img ? C.green : accent} label={page(idx, total)} />
      </div>
    </div>
  );
}

function ContentSlide({ slide, eff, idx, total }) {
  const light = eff === "light", accent = light ? C.purple : C.green;
  const pos = slide.imgPos || "top", img = slide.bgImage;
  const corpoCol = light ? "rgba(0,0,0,.66)" : "rgba(255,255,255,.74)";
  if (img && pos === "bg") return (
    <div style={cardBase(light)}>
      <img src={img} alt="" style={{ ...imgFull, opacity: light ? 0.16 : 0.3 }} />{!light && <><Grid /><Glows /></>}
      <div style={padCol}>
        <Title slide={slide} size={20} color={light ? C.black : C.white} accent={accent} />
        {slide.corpo && <div style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.45, color: corpoCol, textWrap: "pretty" }}>{widow(slide.corpo)}</div>}
        <div style={{ flex: 1 }} />
        {slide.punchline && <Punch accent={accent} light={light} txt={slide.punchline} />}
        <Foot light={light} accent={accent} label={page(idx, total)} />
      </div>
    </div>
  );
  return (
    <div style={cardBase(light)}>
      {!light && <><Grid /><Glows /></>}
      <div style={padCol}>
        <div style={{ fontSize: 10, letterSpacing: "0.12em", color: light ? "rgba(0,0,0,.45)" : C.dim, marginBottom: 14 }}><span style={{ color: accent }}>—</span> {slide.tipo === "cta" ? "O CONVITE" : "O DIAGNÓSTICO"}</div>
        {img && pos === "top" && <div style={{ marginBottom: 14 }}>{band(img, 96)}</div>}
        <Title slide={slide} size={20} color={light ? C.black : C.white} accent={accent} />
        {slide.corpo && <div style={{ marginTop: 12, fontSize: 12.5, lineHeight: 1.45, color: corpoCol, textWrap: "pretty" }}>{widow(slide.corpo)}</div>}
        {img && pos === "bottom" && <div style={{ marginTop: 14 }}>{band(img, 96)}</div>}
        <div style={{ flex: 1 }} />
        {slide.punchline && <Punch accent={accent} light={light} txt={slide.punchline} />}
        <Foot light={light} accent={accent} label={page(idx, total)} />
      </div>
    </div>
  );
}
function Punch({ accent, light, txt }) {
  return <div style={{ borderLeft: `3px solid ${accent}`, paddingLeft: 12, fontSize: 12.5, fontWeight: 700, lineHeight: 1.4, color: light ? C.black : C.white, marginBottom: 14, textWrap: "pretty" }}>{widow(txt)}</div>;
}

function TweetSlide({ slide, idx, total, perfil }) {
  const parts = splitTitulo(slide.titulo, slide.destaque);
  const hasImg = !!slide.bgImage;
  return (
    <div style={TW.card}>
      <div style={TW.top}>
        <div style={{ ...TW.avatar, backgroundImage: perfil ? `url(${perfil})` : "none", backgroundSize: "cover" }}>{!perfil && "CG"}</div>
        <div><div style={TW.name}>{NOME} <span style={{ color: C.purple }}>✦</span></div><div style={TW.handle}>{HANDLE}</div></div>
      </div>
      <div style={TW.body}>{parts.map((p, i) => <span key={i} style={p.hi ? { color: C.purple, fontStyle: "italic" } : undefined}>{p.t}</span>)}</div>
      {hasImg && (
        <div style={{ marginTop: 12, borderRadius: 14, overflow: "hidden", aspectRatio: "16/9", flexShrink: 0 }}>
          <img src={slide.bgImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      {slide.corpo && <div style={TW.sub}>{widow(slide.corpo)}</div>}
      {slide.punchline && <div style={TW.quote}>{widow(slide.punchline)}</div>}
      <div style={TW.foot}>{page(idx, total)}</div>
    </div>
  );
}

// ================= ESTILOS =================
const St = {
  root: { minHeight: "100vh", background: C.black, color: C.white, fontFamily: MONO, padding: 20 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 18, borderBottom: `1px solid ${C.line}`, marginBottom: 18 },
  mark: { width: 26, height: 26, borderRadius: 6, background: `conic-gradient(from 90deg, ${C.purple}, ${C.green}, ${C.purple})`, display: "inline-block", boxShadow: "0 0 22px rgba(137,40,255,0.6)" },
  brand: { fontSize: 14, fontWeight: 700, letterSpacing: "0.04em" },
  brandSub: { fontSize: 11, color: C.dim, marginTop: 2 },
  grid: { display: "grid", gridTemplateColumns: "minmax(280px, 380px) 1fr", gap: 24, alignItems: "start" },
  left: { display: "flex", flexDirection: "column", gap: 16 },
  right: { display: "flex", flexDirection: "column", gap: 14 },
  card: { background: C.panel, border: `1px solid ${C.line}`, borderRadius: 14, padding: 18 },
  cfgGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  step: { fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 },
  stepNum: { color: C.green, fontWeight: 700 },
  lab: { fontSize: 11, color: C.dim, marginBottom: 6 },
  textarea: { width: "100%", background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 10, color: C.white, fontFamily: MONO, fontSize: 13, padding: 12, resize: "vertical", boxSizing: "border-box", marginBottom: 6 },
  input: { width: "100%", background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 10, color: C.white, fontFamily: MONO, fontSize: 13, padding: "10px 12px", boxSizing: "border-box" },
  btnPrimary: { width: "100%", background: C.green, color: C.black, border: "none", borderRadius: 10, padding: "12px 16px", fontFamily: MONO, fontSize: 13, fontWeight: 700, cursor: "pointer" },
  btnGhost: { background: "transparent", color: C.white, border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 14px", fontFamily: MONO, fontSize: 12, cursor: "pointer" },
  ideia: { textAlign: "left", border: `1px solid ${C.line}`, borderRadius: 10, padding: "12px 14px", cursor: "pointer", fontFamily: MONO, color: C.white },
  ideiaTit: { fontSize: 13, fontWeight: 700, marginBottom: 4, lineHeight: 1.3 },
  ideiaAng: { fontSize: 11, color: C.dim, lineHeight: 1.4 },
  targetRow: { display: "flex", gap: 6, marginBottom: 10 },
  targetBtn: { flex: 1, border: `1px solid ${C.line}`, borderRadius: 8, padding: "7px 10px", fontFamily: MONO, fontSize: 11, fontWeight: 700, cursor: "pointer" },
  chatLog: { maxHeight: 110, overflowY: "auto", marginBottom: 10, display: "flex", flexDirection: "column", gap: 6 },
  chatMsg: { fontSize: 11, lineHeight: 1.4 },
  erro: { background: "rgba(137,40,255,0.12)", border: `1px solid ${C.purple}`, borderRadius: 10, padding: 12, fontSize: 12 },
  previewBar: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 },
  styleSwitch: { display: "inline-flex", background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, padding: 4, gap: 4 },
  styleBtn: { border: "none", borderRadius: 7, padding: "7px 12px", fontFamily: MONO, fontSize: 12, fontWeight: 700, cursor: "pointer" },
  stage: { display: "flex", justifyContent: "center", alignItems: "center", minHeight: 460, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24 },
  placeholder: { color: C.dim, fontSize: 13, textAlign: "center", maxWidth: 280 },
  nav: { display: "flex", alignItems: "center", justifyContent: "center", gap: 16 },
  navBtn: { background: C.panel, color: C.white, border: `1px solid ${C.line}`, borderRadius: 8, width: 40, height: 36, fontSize: 16, cursor: "pointer" },
  dots: { display: "flex", gap: 7 }, dot: { width: 8, height: 8, borderRadius: "50%", cursor: "pointer" },
  slideTools: { display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" },
  uploadBtn: { background: "transparent", color: C.green, border: `1px solid ${C.green}`, borderRadius: 8, padding: "7px 12px", fontFamily: MONO, fontSize: 11, cursor: "pointer" },
  removeImg: { background: "transparent", color: C.dim, border: `1px solid ${C.line}`, borderRadius: 8, padding: "7px 12px", fontFamily: MONO, fontSize: 11, cursor: "pointer" },
  posBtn: { border: `1px solid ${C.line}`, borderRadius: 8, padding: "7px 12px", fontFamily: MONO, fontSize: 11, cursor: "pointer" },
  promptBox: { background: C.panel, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14 },
  promptHead: { fontSize: 10, letterSpacing: "0.1em", color: C.dim, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" },
  promptTxt: { fontSize: 12, lineHeight: 1.5, color: "rgba(255,255,255,0.85)" },
  copyMini: { background: "transparent", color: C.green, border: `1px solid ${C.green}`, borderRadius: 6, padding: "3px 9px", fontSize: 10, fontFamily: MONO, cursor: "pointer" },
  avatarMini: { width: 44, height: 44, borderRadius: "50%", background: C.purple, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, fontFamily: MONO, backgroundSize: "cover", backgroundPosition: "center" },
};
const TW = {
  card: { width: SLIDE_W, minHeight: SLIDE_H, maxHeight: SLIDE_H + 60, overflow: "hidden", background: C.white, borderRadius: 18, padding: 22, boxSizing: "border-box", boxShadow: "0 24px 60px rgba(0,0,0,0.45)", display: "flex", flexDirection: "column" },
  top: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  avatar: { width: 44, height: 44, borderRadius: "50%", background: C.purple, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, fontFamily: MONO, backgroundPosition: "center" },
  name: { fontWeight: 700, fontSize: 14, color: "#0f1419", fontFamily: MONO }, handle: { fontSize: 12, color: "#536471", fontFamily: MONO },
  body: { fontFamily: MONO, fontSize: 17, lineHeight: 1.3, color: "#0f1419", fontWeight: 700, textWrap: "balance" },
  sub: { marginTop: 12, fontSize: 12.5, lineHeight: 1.45, color: "#0f1419", fontFamily: MONO },
  quote: { marginTop: 14, borderLeft: `3px solid ${C.green}`, paddingLeft: 12, fontSize: 13, fontWeight: 700, color: "#0f1419", fontFamily: MONO },
  foot: { marginTop: "auto", paddingTop: 16, borderTop: "1px solid #eff3f4", fontSize: 12, color: "#536471", fontFamily: MONO },
};
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap');
* { box-sizing: border-box; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
select { appearance: none; }
textarea:focus, input:focus, button:focus-visible, select:focus { outline: 2px solid ${C.green}; outline-offset: 1px; }
@media (max-width: 820px) { .__grid { grid-template-columns: 1fr !important; } }
`;
