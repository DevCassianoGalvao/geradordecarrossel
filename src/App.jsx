import React, { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
//  GERADOR DE CARROSSEL — Cassiano Galvão · v6
//  + foto fixada · fontes maiores · edição inline · histórico
//  + snap Y=0 · capas corrigidas · tweet corrigido · ZIP export
// ============================================================

const HANDLE = "@cassianogalvao.web";
const NOME = "Cassiano Galvão";
const PERFIL_DEFAULT = "data:image/jpeg;base64,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";

const C = {
  black:"#000000", panel:"#0d0d10", panel2:"#141418",
  purple:"#8928FF", green:"#00EF9E", white:"#FFFFFF",
  line:"rgba(255,255,255,0.10)", dim:"rgba(255,255,255,0.50)",
};
const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const SLIDE_W = 340, SLIDE_H = 425;

const CONTEXTO = `Você é o estrategista de conteúdo do Cassiano Galvão, web designer há 16 anos (+160 projetos). Reposicionamento: "parei de vender SÓ sites" — entrega o site MAIS o sistema que faz ele trabalhar (mini-CRM, painel, simulador, automação). Diferencial: julgamento sobre o que construir + entregar o sistema sozinho.
PÚBLICO: profissionais de saúde CONSOLIDADOS no BRASIL TODO (dermato, plástica, harmonização, odonto/implante, oftalmo) — consultório próprio, caixa, agenda cheia. NÃO mencione cidade.
REGRAS: fale da DOR (site parado que não capta, agendamento só por telefone, recepção afogada, paciente que some à noite). NUNCA invente métrica.`;

const ANTI_IA = `VOZ: primeira pessoa ("eu", "meu") — Instagram do Cassiano.
STORYTELLING: Capa para o dedo (max 7 palavras). Slides 2-3 aprofundam dor com cena concreta. Slides 4-5 mostram virada. CTA convida sem pressão.
Cada slide = UMA ideia. Narrativa linear, cada slide puxa o próximo.
PROIBIDO: travessão no meio de frase. "imagine". "vamos". "descubra". "transforme". "afinal". Listas com marcadores. Tom corporativo.
Varie tamanho das frases: frase longa. Depois, seca. Português do Brasil falado.`;

const HOOK_CAPA = `CAPA: max 7 palavras, provoca, não explica. Técnicas: loop aberto / número específico / afirmação contra senso comum / custo concreto / imagem vívida.`;

const STYLE_TPL = {
  premium:"dark premium tech aesthetic, pure black background, electric purple (#8928FF) and mint green (#00EF9E) volumetric glow, 3D render, cinematic lighting, moody, high-end",
  pixel:"16-bit pixel art, retro SNES-era game art, cozy detailed scene, warm lighting with purple (#8928FF) and mint green (#00EF9E) accents, crisp pixel shading",
  minimal:"minimalist editorial illustration, generous negative space, mint green (#00EF9E) accent on near-black, clean geometric shapes",
  foto:"photorealistic cinematic photography, shallow depth of field, premium moody lighting, professional",
};

const OBJETIVOS = {
  educacional:{ label:"Educacional", desc:"Fecha com lição e convite leve." },
  provocativo:{ label:"Provocativo", desc:"Crava opinião que incomoda." },
  isca:{ label:"Isca — comente pra receber", desc:"CTA com palavra-gatilho." },
  lista:{ label:"Lista numerada", desc:"Ex.: 7 erros, 5 ferramentas." },
  antes_depois:{ label:"Antes e depois", desc:"Contraste realidade x resultado." },
  historia:{ label:"História real", desc:"Caso de cliente (sem inventar dados)." },
};

async function askClaude(prompt) {
  const r = await fetch("/api/claude", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1200, messages:[{role:"user",content:prompt}] }),
  });
  if (!r.ok) throw new Error("Falha na chamada (" + r.status + ")");
  const data = await r.json();
  return (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("\n");
}
function parseJSON(text) {
  let t = text.replace(/```json/gi,"").replace(/```/g,"").trim();
  try { return JSON.parse(t); } catch(_) {}
  const aS=t.indexOf("["),aE=t.lastIndexOf("]"),oS=t.indexOf("{"),oE=t.lastIndexOf("}");
  let cand=null;
  if(aS!==-1&&(oS===-1||aS<oS)) cand=t.slice(aS,aE+1); else if(oS!==-1) cand=t.slice(oS,oE+1);
  if(cand){try{return JSON.parse(cand);}catch(_){}}
  throw new Error("Não consegui ler a resposta. Tenta de novo.");
}
function asSlideObj(p){let u=p;if(Array.isArray(u))u=u[0]||{};if(u&&u.slide)u=u.slide;return u||{};}
function splitTitulo(titulo,destaque){
  if(!destaque||!titulo)return[{t:titulo||"",hi:false}];
  const i=titulo.toLowerCase().indexOf(destaque.toLowerCase());
  if(i===-1)return[{t:titulo,hi:false}];
  return[{t:titulo.slice(0,i),hi:false},{t:titulo.slice(i,i+destaque.length),hi:true},{t:titulo.slice(i+destaque.length),hi:false}].filter(p=>p.t.length>0);
}
function sortidoEff(slide,idx){
  if(slide.tipo==="capa"||slide.tipo==="cta")return"dark";
  const seq=[1,0,0,1,0,1,0,0,1,0];
  return seq[idx%seq.length]?"light":"dark";
}
function widow(s){if(!s)return s;const i=s.lastIndexOf(" ");return i>0?s.slice(0,i)+"\u00A0"+s.slice(i+1):s;}

export default function App(){
  const [foco,setFoco]=useState("Sites de clínica que são vitrine parada e não captam paciente");
  const [ideias,setIdeias]=useState([]);
  const [ideiaSel,setIdeiaSel]=useState(null);
  const [confirmar,setConfirmar]=useState(null);
  const [slides,setSlides]=useState([]);
  const [history,setHistory]=useState([]); // array de snapshots
  const [estilo,setEstilo]=useState("sortido");
  const [idx,setIdx]=useState(0);
  const [carregando,setCarregando]=useState("");
  const [erro,setErro]=useState("");
  const [chatInput,setChatInput]=useState("");
  const [chatTarget,setChatTarget]=useState("slide");
  const [chatLog,setChatLog]=useState([]);
  const [chatBusy,setChatBusy]=useState(false);
  const [showCfg,setShowCfg]=useState(false);
  const [perfil,setPerfil]=useState(PERFIL_DEFAULT);
  const [copyInstr,setCopyInstr]=useState("");
  const [imgDir,setImgDir]=useState("");
  const [imgStyle,setImgStyle]=useState("premium");
  const [capaPadrao,setCapaPadrao]=useState(0);
  const [objetivo,setObjetivo]=useState("educacional");
  const [isca,setIsca]=useState("");
  const [promptBusy,setPromptBusy]=useState(null);
  const [editField,setEditField]=useState(null); // {slideIdx, field}
  const [editVal,setEditVal]=useState("");
  const [exportBusy,setExportBusy]=useState(false);
  const slideRef=useRef(null);

  const ctx=()=>CONTEXTO+(copyInstr?"\n\nINSTRUÇÕES EXTRAS:\n"+copyInstr:"")+"\n\n"+ANTI_IA;

  // salva snapshot antes de mudar slides
  function pushHistory(current){
    setHistory(h=>[...h.slice(-9), JSON.parse(JSON.stringify(current))]);
  }
  function undo(){
    if(!history.length)return;
    const prev=history[history.length-1];
    setSlides(prev);
    setHistory(h=>h.slice(0,-1));
  }

  async function gerarIdeias(){
    setErro("");setCarregando("ideias");setIdeias([]);setIdeiaSel(null);setConfirmar(null);
    const extra=objetivo==="lista"?"Cada ideia deve ter ângulo de LISTA NUMERADA (ex: 7 erros, 5 sinais)."
      :objetivo==="historia"?"Cada ideia deve ser HISTÓRIA REAL de situação vivida por clínica (sem inventar dados).":"";
    try{
      const out=await askClaude(`${ctx()}\n${extra}\nTAREFA: 6 ideias de carrossel sobre: "${foco}". Ângulo afiado que dói no profissional de saúde consolidado.\nAPENAS JSON: [{"titulo":"","angulo":"","gancho":""}]`);
      const d=parseJSON(out);setIdeias(Array.isArray(d)?d:d.ideias||[]);
    }catch(e){setErro(e.message);}finally{setCarregando("");}
  }

  async function gerarCarrossel(ideia){
    setConfirmar(null);setErro("");setIdeiaSel(ideia);setCarregando("carrossel");
    setSlides([]);setIdx(0);setChatLog([]);setIsca("");setHistory([]);
    const objInstr={
      educacional:"OBJETIVO EDUCACIONAL: fecha com lição e convite leve.",
      provocativo:"OBJETIVO PROVOCATIVO: último slide crava opinião que incomoda.",
      isca:"OBJETIVO ISCA: último slide pede 'comente PALAVRA pra receber [material]'. Retorne 'isca' com sugestão de material.",
      lista:"OBJETIVO LISTA: estruture como lista numerada. Cada slide revela 1-2 itens.",
      antes_depois:"OBJETIVO ANTES/DEPOIS: slides 2-3 mostram dor atual, slides 4-5 mostram resultado possível. Sem inventar métricas.",
      historia:"OBJETIVO HISTÓRIA: conte situação real. Capa apresenta problema, meio conta o que aconteceu, CTA convida conversa.",
    }[objetivo]||"";
    try{
      const out=await askClaude(`${ctx()}\n${HOOK_CAPA}\n${objInstr}\nTAREFA: carrossel completo sobre: Título "${ideia.titulo}" | Ângulo "${ideia.angulo}".\n1 CAPA + 4-5 CONTEÚDO + 1 CTA. Cada slide: "tipo"(capa|conteudo|cta),"titulo","destaque"(palavra do título),"corpo"(1-2 frases ou ""),"punchline"(frase memorável ou "").\nAPENAS JSON: {"isca":"","slides":[{"tipo":"capa","titulo":"","destaque":"","corpo":"","punchline":""}]}`);
      const d=parseJSON(out);
      const obj=Array.isArray(d)?{isca:"",slides:d}:d;
      const arr=(obj.slides||[]).map(s=>({...s,bgImage:null,imgPos:"top",imgOffsetY:0,coverLayout:capaPadrao,image_prompt:""}));
      setIsca(obj.isca||"");setSlides(arr);
    }catch(e){setErro(e.message);}finally{setCarregando("");}
  }

  async function gerarPromptSlide(i){
    const s=slides[i];if(!s)return;
    setPromptBusy(i);
    try{
      const personagem=imgDir?`PERSONAGEM RECORRENTE (mesma aparência): ${imgDir}. `:"";
      const ANGULOS=["wide establishing shot, full scene","medium shot, 3/4 angle","close-up on face or hands","low-angle dramatic upward","over-the-shoulder","bird's eye top-down","dutch angle tension","silhouette contre-jour"];
      const angulo=ANGULOS[i%ANGULOS.length];
      const out=await askClaude(`Gere UM prompt de imagem (INGLÊS) para este slide.
TÍTULO: ${s.titulo} | MENSAGEM: ${[s.corpo,s.punchline].filter(Boolean).join(" ")}
${personagem}CÂMERA OBRIGATÓRIA: ${angulo}. Ação do personagem representa o sentimento do texto.
Varie: ${i%2===0?"interior, noturno":"ambiente clínico, luz natural"}.
Estética: ${STYLE_TPL[imgStyle]}. no text, no watermark, no logo. Máx 40 palavras.
Apenas a string do prompt, sem aspas, sem markdown.`);
      setSlides(p=>p.map((sl,j)=>j===i?{...sl,image_prompt:out.trim().replace(/^"+|"+$/g,"")}:sl));
    }catch(e){setErro("Prompt erro: "+e.message);}finally{setPromptBusy(null);}
  }

  async function enviarAjuste(){
    const instr=chatInput.trim();if(!instr||!slides.length)return;
    pushHistory(slides);
    setChatBusy(true);setChatLog(l=>[...l,{who:"voce",txt:instr}]);setChatInput("");
    try{
      if(chatTarget==="slide"){
        const s=slides[idx];
        const out=await askClaude(`${ctx()}\nSlide (JSON):\n${JSON.stringify({tipo:s.tipo,titulo:s.titulo,destaque:s.destaque,corpo:s.corpo,punchline:s.punchline})}\nAjuste: "${instr}". Mantenha chaves. APENAS JSON do slide.`);
        const upd=asSlideObj(parseJSON(out));
        setSlides(p=>p.map((sl,i)=>i===idx?{...sl,...upd}:sl));
        setChatLog(l=>[...l,{who:"claude",txt:"Slide "+(idx+1)+" atualizado."}]);
      }else{
        const payload=slides.map(s=>({tipo:s.tipo,titulo:s.titulo,destaque:s.destaque,corpo:s.corpo,punchline:s.punchline}));
        const out=await askClaude(`${ctx()}\n${HOOK_CAPA}\nCarrossel (JSON):\n${JSON.stringify(payload)}\nAjuste: "${instr}". Mesmas chaves e quantidade. APENAS JSON array.`);
        let upd=parseJSON(out);if(!Array.isArray(upd))upd=upd.slides||[];
        if(Array.isArray(upd)&&upd.length){setSlides(p=>upd.map((u,i)=>({...(p[i]||{}),...u})));setChatLog(l=>[...l,{who:"claude",txt:"Carrossel atualizado."}]);}
      }
    }catch(e){setChatLog(l=>[...l,{who:"claude",txt:"Erro: "+e.message}]);}
    finally{setChatBusy(false);}
  }

  // edição inline
  function startEdit(slideIdx,field){
    const val=slides[slideIdx][field]||"";
    setEditField({slideIdx,field});setEditVal(val);
  }
  function commitEdit(){
    if(!editField)return;
    pushHistory(slides);
    setSlides(p=>p.map((s,i)=>i===editField.slideIdx?{...s,[editField.field]:editVal}:s));
    setEditField(null);
  }

  function onUpload(e,target){
    const f=e.target.files&&e.target.files[0];if(!f)return;
    const rd=new FileReader();
    rd.onload=()=>{if(target==="perfil")setPerfil(rd.result);else setSlides(p=>p.map((s,i)=>i===idx?{...s,bgImage:rd.result}:s));};
    rd.readAsDataURL(f);
  }
  function setSlideField(field,val){
    pushHistory(slides);
    setSlides(p=>p.map((s,i)=>i===idx?{...s,[field]:val}:s));
  }

  function copiar(txt){const ta=document.createElement("textarea");ta.value=txt;document.body.appendChild(ta);ta.select();try{document.execCommand("copy");}catch(_){}document.body.removeChild(ta);}
  function exportarRoteiro(){
    const head=`CARROSSEL — ${ideiaSel?ideiaSel.titulo:""}\nDireção: ${imgDir||"-"} | Estilo: ${imgStyle}\n\n`;
    const body=slides.map((s,i)=>`SLIDE ${i+1} [${s.tipo}]\nTítulo: ${s.titulo}\nCorpo: ${s.corpo||"-"}\nPunchline: ${s.punchline||"-"}\nPrompt: ${s.image_prompt||"-"}\n`).join("\n");
    const b=new Blob([head+body],{type:"text/plain"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="roteiro.txt";a.click();URL.revokeObjectURL(u);
  }

  async function exportarZip(){
    if(!slides.length)return;
    setExportBusy(true);
    try{
      // load JSZip dynamically
      await new Promise((res,rej)=>{
        if(window.JSZip)return res();
        const s=document.createElement("script");
        s.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
        s.onload=res;s.onerror=rej;document.head.appendChild(s);
      });
      const zip=new window.JSZip();
      // export each slide as PNG
      for(let i=0;i<slides.length;i++){
        const png=await renderSlideToPNG(slides[i],i,slides.length,estilo,perfil);
        if(png) zip.file(`slide-${String(i+1).padStart(2,"0")}.png`,png.split(",")[1],{base64:true});
      }
      const blob=await zip.generateAsync({type:"blob"});
      const u=URL.createObjectURL(blob);const a=document.createElement("a");a.href=u;a.download="carrossel.zip";a.click();URL.revokeObjectURL(u);
    }catch(e){setErro("ZIP erro: "+e.message);}finally{setExportBusy(false);}
  }

  const slide=slides[idx];

  return(
    <div style={St.root}>
      <style>{CSS}</style>
      <header style={St.header}>
        <div><div style={St.brand}>GERADOR DE CARROSSEL</div><div style={St.brandSub}>{NOME}</div></div>
        <div style={{display:"flex",gap:8}}>
          {history.length>0&&<button style={{...St.btnGhost,color:C.green,borderColor:C.green}} onClick={undo}>↩ Desfazer</button>}
          <button style={St.btnGhost} onClick={()=>setShowCfg(v=>!v)}>⚙ Config</button>
        </div>
      </header>

      {showCfg&&(
        <section style={{...St.card,marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:16,alignItems:"start"}}>
            <div>
              <div style={St.lab}>Foto de perfil</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{...St.avatarMini,backgroundImage:`url(${perfil})`,backgroundSize:"cover",backgroundPosition:"center"}}/>
                <label style={St.uploadBtn}>trocar<input type="file" accept="image/*" style={{display:"none"}} onChange={e=>onUpload(e,"perfil")}/></label>
                {perfil!==PERFIL_DEFAULT&&<button style={St.removeImg} onClick={()=>setPerfil(PERFIL_DEFAULT)}>resetar</button>}
              </div>
            </div>
            <div>
              <div style={St.lab}>Instruções extras de copy</div>
              <textarea style={St.textarea} rows={2} value={copyInstr} onChange={e=>setCopyInstr(e.target.value)} placeholder="tom mais direto, foco em harmonização…"/>
            </div>
          </div>
        </section>
      )}

      <div className="__grid" style={St.grid}>
        {/* ESQUERDA */}
        <div style={St.left}>
          <section style={St.card}>
            <div style={St.step}><span style={St.stepNum}>01</span> Foco do conteúdo</div>
            <textarea style={St.textarea} value={foco} onChange={e=>setFoco(e.target.value)} rows={3}/>

            <div style={St.lab}>Capa padrão</div>
            <select style={St.input} value={capaPadrao} onChange={e=>setCapaPadrao(Number(e.target.value))}>
              <option value={0}>Só texto — base</option>
              <option value={1}>Só texto — topo</option>
              <option value={2}>Imagem de fundo</option>
              <option value={3}>Imagem em cima</option>
              <option value={4}>Imagem embaixo</option>
            </select>

            <div style={{...St.lab,marginTop:10}}>Objetivo</div>
            <select style={St.input} value={objetivo} onChange={e=>setObjetivo(e.target.value)}>
              {Object.entries(OBJETIVOS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
            <div style={{fontSize:10,color:C.dim,marginTop:3,marginBottom:10}}>{OBJETIVOS[objetivo]?.desc}</div>

            <div style={St.lab}>Direção das imagens</div>
            <input style={St.input} value={imgDir} onChange={e=>setImgDir(e.target.value)} placeholder="ex.: uma médica dermatologista"/>

            <div style={{...St.lab,marginTop:8}}>Estilo das imagens</div>
            <select style={St.input} value={imgStyle} onChange={e=>setImgStyle(e.target.value)}>
              <option value="premium">Premium dark tech</option>
              <option value="pixel">Pixel-art 8-bit</option>
              <option value="minimal">Minimalista editorial</option>
              <option value="foto">Fotográfico</option>
            </select>

            <button style={{...St.btnPrimary,marginTop:14}} onClick={gerarIdeias} disabled={carregando==="ideias"}>
              {carregando==="ideias"?"Pensando…":"Gerar 6 ideias"}
            </button>
          </section>

          {ideias.length>0&&(
            <section style={St.card}>
              <div style={St.step}><span style={St.stepNum}>02</span> Escolha um ângulo</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {ideias.map((it,i)=>{
                  const sel=ideiaSel&&ideiaSel.titulo===it.titulo;
                  const pend=confirmar?.titulo===it.titulo;
                  return(
                    <button key={i} onClick={()=>setConfirmar(it)}
                      style={{...St.ideia,borderColor:sel?C.green:pend?C.purple:C.line,background:sel?"rgba(0,239,158,0.06)":pend?"rgba(137,40,255,0.08)":C.panel2}}>
                      <div style={St.ideiaTit}>{it.titulo}</div>
                      <div style={St.ideiaAng}>{it.angulo}</div>
                    </button>
                  );
                })}
              </div>
              {confirmar&&(
                <div style={{marginTop:12,background:"rgba(137,40,255,0.1)",border:`1px solid ${C.purple}`,borderRadius:9,padding:12}}>
                  <div style={{fontSize:12,marginBottom:8}}>Gerar com <b style={{color:C.green}}>"{confirmar.titulo}"</b>?</div>
                  <div style={{display:"flex",gap:8}}>
                    <button style={{...St.btnPrimary,flex:1}} onClick={()=>gerarCarrossel(confirmar)} disabled={carregando==="carrossel"}>
                      {carregando==="carrossel"?"Gerando…":"Confirmar"}
                    </button>
                    <button style={St.btnGhost} onClick={()=>setConfirmar(null)}>Cancelar</button>
                  </div>
                </div>
              )}
            </section>
          )}
          {erro&&<div style={St.erro}>{erro}</div>}
        </div>

        {/* DIREITA */}
        <div style={St.right}>
          <div style={St.previewBar}>
            <div style={St.styleSwitch}>
              {[["dark","Escuro"],["light","Claro"],["sortido","Sortido"],["twitter","Tweet"]].map(([k,l])=>(
                <button key={k} onClick={()=>setEstilo(k)} style={{...St.styleBtn,color:estilo===k?C.black:C.white,background:estilo===k?C.green:"transparent"}}>{l}</button>
              ))}
            </div>
            {slides.length>0&&(
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                <button style={St.btnGhost} onClick={()=>copiar(slides.map((s,i)=>`SLIDE ${i+1}\n${s.titulo}\n${s.corpo||""}\n${s.punchline?"» "+s.punchline:""}`).join("\n\n"))}>Copiar</button>
                <button style={St.btnGhost} onClick={exportarRoteiro}>Roteiro</button>
                <button style={{...St.btnGhost,color:C.green,borderColor:C.green}} onClick={exportarZip} disabled={exportBusy}>{exportBusy?"Gerando ZIP…":"⬇ ZIP"}</button>
              </div>
            )}
          </div>

          {isca&&<div style={{background:"rgba(0,239,158,0.08)",border:`1px solid ${C.green}`,borderRadius:9,padding:"9px 13px",fontSize:12}}><b style={{color:C.green}}>Isca:</b> {isca}</div>}

          <div style={St.stage}>
            {carregando==="carrossel"&&<div style={St.placeholder}>Montando o carrossel…</div>}
            {!slide&&carregando!=="carrossel"&&<div style={St.placeholder}>{ideias.length===0?"Passo 01: foco e gere ideias.":"Passo 02: escolha e confirme um ângulo."}</div>}
            {slide&&<div ref={slideRef}><Slide slide={slide} estilo={estilo} idx={idx} total={slides.length} perfil={perfil} editField={editField} editVal={editVal} setEditVal={setEditVal} onEdit={startEdit} onCommit={commitEdit}/></div>}
          </div>

          {slides.length>0&&(<>
            <div style={St.nav}>
              <button style={St.navBtn} onClick={()=>setIdx(i=>Math.max(0,i-1))} disabled={idx===0}>←</button>
              <div style={St.dots}>{slides.map((_,i)=><span key={i} onClick={()=>setIdx(i)} style={{...St.dot,background:i===idx?C.green:"rgba(255,255,255,0.25)"}}/>)}</div>
              <button style={St.navBtn} onClick={()=>setIdx(i=>Math.min(slides.length-1,i+1))} disabled={idx===slides.length-1}>→</button>
            </div>

            <div style={St.slideTools}>
              <label style={St.uploadBtn}>{slide.bgImage?"trocar img":"+ imagem"}<input type="file" accept="image/*" style={{display:"none"}} onChange={e=>onUpload(e,"slide")}/></label>
              {slide.bgImage&&<button style={St.removeImg} onClick={()=>setSlideField("bgImage",null)}>remover</button>}
              {slide.bgImage&&slide.tipo!=="capa"&&[["top","cima"],["bottom","baixo"],["bg","fundo"]].map(([k,l])=>(
                <button key={k} onClick={()=>setSlideField("imgPos",k)} style={{...St.posBtn,background:slide.imgPos===k?C.green:"transparent",color:slide.imgPos===k?C.black:C.white}}>{l}</button>
              ))}
              {slide.bgImage&&(
                <div style={{display:"flex",alignItems:"center",gap:6,background:C.panel2,borderRadius:8,padding:"4px 8px"}}>
                  <span style={{fontSize:9,color:C.dim}}>Y</span>
                  <div style={{position:"relative",display:"flex",alignItems:"center"}}>
                    <input type="range" min="-100" max="100" value={slide.imgOffsetY||0}
                      onChange={e=>{
                        const v=Number(e.target.value);
                        const snapped=Math.abs(v)<=4?0:v;
                        setSlides(p=>p.map((s,i)=>i===idx?{...s,imgOffsetY:snapped}:s));
                      }}
                      style={{width:80,accentColor:C.green}}/>
                    {Math.abs(slide.imgOffsetY||0)<=4&&<div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",width:8,height:8,borderRadius:"50%",background:C.green,pointerEvents:"none",boxShadow:`0 0 6px ${C.green}`}}/>}
                  </div>
                  <span style={{fontSize:9,color:slide.imgOffsetY===0?C.green:C.dim,minWidth:22}}>{slide.imgOffsetY||0}</span>
                </div>
              )}
              {slide.tipo==="capa"&&estilo!=="twitter"&&(
                <button style={St.removeImg} onClick={()=>setSlideField("coverLayout",((slide.coverLayout||0)+1)%5)}>
                  capa ({(slide.coverLayout||0)+1}/5)
                </button>
              )}
            </div>

            <div style={St.promptBox}>
              <div style={St.promptHead}>
                PROMPT · slide {idx+1}
                <div style={{display:"flex",gap:6}}>
                  <button style={St.copyMini} onClick={()=>gerarPromptSlide(idx)} disabled={promptBusy===idx}>
                    {promptBusy===idx?"gerando…":slide.image_prompt?"regen":"gerar"}
                  </button>
                  {slide.image_prompt&&<button style={St.copyMini} onClick={()=>copiar(slide.image_prompt)}>copiar</button>}
                </div>
              </div>
              <div style={St.promptTxt}>{slide.image_prompt||<span style={{color:C.dim}}>Clique em "gerar" para criar o prompt deste slide.</span>}</div>
            </div>

            <div style={St.card}>
              <div style={St.step}><span style={St.stepNum}>★</span> Chat de ajuste</div>
              <div style={St.targetRow}>
                {[["slide","Slide atual"],["all","Carrossel todo"]].map(([k,l])=>(
                  <button key={k} onClick={()=>setChatTarget(k)} style={{...St.targetBtn,color:chatTarget===k?C.black:C.white,background:chatTarget===k?C.green:"transparent"}}>{l}</button>
                ))}
              </div>
              {chatLog.length>0&&<div style={St.chatLog}>{chatLog.map((m,i)=><div key={i} style={{...St.chatMsg,color:m.who==="voce"?C.white:C.green}}><b>{m.who}:</b> {m.txt}</div>)}</div>}
              <textarea style={St.textarea} rows={2} value={chatInput} onChange={e=>setChatInput(e.target.value)} placeholder="ex.: mais provocativo / trocar o exemplo"/>
              <button style={St.btnPrimary} onClick={enviarAjuste} disabled={chatBusy}>{chatBusy?"Ajustando…":"Enviar"}</button>
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}

// ===== SLIDE RENDER =====
function Slide({slide,estilo,idx,total,perfil,editField,editVal,setEditVal,onEdit,onCommit}){
  if(estilo==="twitter")return<TweetSlide slide={slide} idx={idx} total={total} perfil={perfil} editField={editField} editVal={editVal} setEditVal={setEditVal} onEdit={onEdit} onCommit={onCommit}/>;
  const eff=estilo==="sortido"?sortidoEff(slide,idx):estilo;
  if(slide.tipo==="capa")return<CoverSlide slide={slide} eff={eff} idx={idx} total={total} editField={editField} editVal={editVal} setEditVal={setEditVal} onEdit={onEdit} onCommit={onCommit}/>;
  return<ContentSlide slide={slide} eff={eff} idx={idx} total={total} editField={editField} editVal={editVal} setEditVal={setEditVal} onEdit={onEdit} onCommit={onCommit}/>;
}

const pg=(i,t)=>`${String(i+1).padStart(2,"0")} / ${String(t).padStart(2,"0")}`;
function glow(color,pos,opacity){return{position:"absolute",width:230,height:230,background:`radial-gradient(circle, ${color}, transparent 70%)`,opacity,filter:"blur(11px)",mixBlendMode:"screen",pointerEvents:"none",zIndex:1,...pos};}
function Glows(){return(<><div style={glow(C.purple,{top:-55,left:-45},0.6)}/><div style={glow(C.green,{bottom:-75,right:-55},0.32)}/></>);}
function splitEl(slide,size,color,accent){
  const parts=splitTitulo(slide.titulo,slide.destaque);
  return<div style={{fontFamily:MONO,fontWeight:700,fontSize:size,lineHeight:1.12,color,textWrap:"balance"}}>
    {parts.map((p,i)=><span key={i} style={p.hi?{fontStyle:"italic",color:accent}:undefined}>{p.t}</span>)}
  </div>;
}
function Foot({light,accent,label}){
  return<div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:light?"rgba(0,0,0,0.4)":C.dim,borderTop:`1px solid ${light?"rgba(0,0,0,0.1)":C.line}`,paddingTop:9}}>
    <span>{HANDLE}</span><span style={{color:accent,fontStyle:"italic"}}>{label}</span>
  </div>;
}
function PunchEl({txt,accent,light}){
  return<div style={{borderLeft:`3px solid ${accent}`,paddingLeft:11,fontSize:14,fontWeight:700,lineHeight:1.4,color:light?C.black:C.white,marginBottom:12,textWrap:"pretty"}}>{widow(txt)}</div>;
}
function BandEl({src,h,offsetY}){
  return<div style={{borderRadius:9,overflow:"hidden",height:h||90,flexShrink:0}}>
    <img src={src} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:`center ${50+(offsetY||0)}%`}}/>
  </div>;
}
function EditableText({text,size,color,field,slideIdx,editField,editVal,setEditVal,onEdit,onCommit,style={}}){
  const isMe=editField&&editField.slideIdx===slideIdx&&editField.field===field;
  if(isMe)return<textarea autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)}
    onBlur={onCommit} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();onCommit();}}}
    style={{width:"100%",background:"rgba(0,0,0,0.5)",border:`1px solid ${C.green}`,borderRadius:6,color:C.white,fontFamily:MONO,fontSize:size,fontWeight:700,padding:4,resize:"none",outline:"none",...style}}/>;
  return<div onDoubleClick={()=>onEdit(slideIdx,field)}
    title="Duplo clique para editar"
    style={{cursor:"text",fontSize:size,fontWeight:700,color,lineHeight:1.3,...style}}>{text||<span style={{opacity:0.3,fontStyle:"italic"}}>vazio</span>}</div>;
}
function cardBase(light){return{width:SLIDE_W,height:SLIDE_H,borderRadius:14,position:"relative",overflow:"hidden",boxShadow:"0 20px 50px rgba(0,0,0,0.55)",border:light?"none":`1px solid ${C.line}`,background:light?"#FAFAF7":C.black};}
const imgFull={position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"};
const scrim={position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(0,0,0,.1),rgba(0,0,0,.82))",zIndex:1};
const padCol={position:"relative",height:"100%",padding:22,display:"flex",flexDirection:"column",boxSizing:"border-box",zIndex:2};

function CoverSlide({slide,eff,idx,total,editField,editVal,setEditVal,onEdit,onCommit}){
  const light=eff==="light",accent=light?C.purple:C.green,fg=light?C.black:C.white;
  const lay=slide.coverLayout||0,img=slide.bgImage,off=slide.imgOffsetY||0;

  const titleEl=splitEl(slide,28,img&&(lay===0||lay===2)?C.white:fg,img&&(lay===0||lay===2)?C.green:accent);
  const footEl=<Foot light={!img&&light} accent={img&&(lay===0||lay===2)?C.green:accent} label={pg(idx,total)}/>;

  if(lay===2)return(
    <div style={cardBase(light)}>
      {img?<><img src={img} alt="" style={{...imgFull,objectPosition:`center ${50+off}%`}}/><div style={scrim}/></>:<Glows/>}
      <div style={padCol}><div style={{flex:1}}/>{titleEl}<div style={{marginTop:10}}>{footEl}</div></div>
    </div>
  );
  if(lay===1)return(
    <div style={cardBase(light)}>
      {!light&&<Glows/>}
      <div style={{...padCol,paddingTop:55}}>
        {titleEl}
        {slide.corpo&&<div style={{marginTop:12,fontSize:16,color:light?"rgba(0,0,0,.6)":"rgba(255,255,255,.7)",textWrap:"pretty"}}>{widow(slide.corpo)}</div>}
        <div style={{flex:1}}/>{footEl}
      </div>
    </div>
  );
  if(lay===3)return(
    <div style={cardBase(light)}>
      {!light&&<Glows/>}
      <div style={{...padCol,justifyContent:"space-between"}}>
        {img&&<BandEl src={img} h={150} offsetY={off}/>}
        <div style={{display:"flex",flexDirection:"column",gap:10,flex:1,justifyContent:"center",paddingTop:img?12:0}}>
          {titleEl}
          {slide.corpo&&<div style={{fontSize:16,color:light?"rgba(0,0,0,.6)":"rgba(255,255,255,.7)"}}>{widow(slide.corpo)}</div>}
        </div>
        {footEl}
      </div>
    </div>
  );
  if(lay===4)return(
    <div style={cardBase(light)}>
      {!light&&<Glows/>}
      <div style={{...padCol,justifyContent:"space-between"}}>
        <div style={{display:"flex",flexDirection:"column",gap:10,flex:1,justifyContent:"center"}}>
          {titleEl}
          {slide.corpo&&<div style={{fontSize:16,color:light?"rgba(0,0,0,.6)":"rgba(255,255,255,.7)"}}>{widow(slide.corpo)}</div>}
        </div>
        {img&&<><BandEl src={img} h={150} offsetY={off}/><div style={{height:8}}/></>}
        {footEl}
      </div>
    </div>
  );
  // lay 0 — base
  return(
    <div style={cardBase(light)}>
      {img?<><img src={img} alt="" style={{...imgFull,objectPosition:`center ${50+off}%`}}/><div style={scrim}/></>:null}
      <div style={padCol}>
        <div style={{flex:1}}/>{titleEl}
        {slide.corpo&&<div style={{marginTop:10,fontSize:16,color:img?"rgba(255,255,255,.8)":(light?"rgba(0,0,0,.6)":"rgba(255,255,255,.7)")}}>{widow(slide.corpo)}</div>}
        <div style={{fontSize:9,letterSpacing:"0.12em",color:img?"rgba(255,255,255,.6)":(light?"rgba(0,0,0,.35)":C.dim),margin:"14px 0 12px"}}>ARRASTA →</div>
        {footEl}
      </div>
    </div>
  );
}

function ContentSlide({slide,eff,idx,total,editField,editVal,setEditVal,onEdit,onCommit}){
  const light=eff==="light",accent=light?C.purple:C.green;
  const pos=slide.imgPos||"top",img=slide.bgImage,off=slide.imgOffsetY||0;
  const cc=light?"rgba(0,0,0,.65)":"rgba(255,255,255,.74)";
  const titleColor=light?C.black:C.white;

  const titleEl=<div style={{fontFamily:MONO,fontWeight:700,fontSize:20,lineHeight:1.12,color:titleColor,textWrap:"balance"}}>
    {splitTitulo(slide.titulo,slide.destaque).map((p,i)=><span key={i} style={p.hi?{fontStyle:"italic",color:accent}:undefined}>{p.t}</span>)}
  </div>;

  if(img&&pos==="bg")return(
    <div style={cardBase(light)}>
      <img src={img} alt="" style={{...imgFull,opacity:light?0.15:0.28,objectPosition:`center ${50+off}%`}}/>
      {!light&&<Glows/>}
      <div style={padCol}>
        {titleEl}
        {slide.corpo&&<div style={{marginTop:12,fontSize:16,lineHeight:1.5,color:cc,textWrap:"pretty"}}>{widow(slide.corpo)}</div>}
        <div style={{flex:1}}/>
        {slide.punchline&&<PunchEl txt={slide.punchline} accent={accent} light={light}/>}
        <Foot light={light} accent={accent} label={pg(idx,total)}/>
      </div>
    </div>
  );

  const hasImg=img&&(pos==="top"||pos==="bottom");
  const hasContent=slide.corpo||slide.punchline;
  return(
    <div style={cardBase(light)}>
      {!light&&<Glows/>}
      <div style={padCol}>
        <div style={{fontSize:9,letterSpacing:"0.11em",color:light?"rgba(0,0,0,.4)":C.dim,marginBottom:12}}>
          <span style={{color:accent}}>—</span> {slide.tipo==="cta"?"O CONVITE":"O DIAGNÓSTICO"}
        </div>
        {hasImg&&pos==="top"&&<div style={{marginBottom:12}}><BandEl src={img} h={90} offsetY={off}/></div>}
        {titleEl}
        {slide.corpo
          ?<div style={{marginTop:12,fontSize:16,lineHeight:1.5,color:cc,textWrap:"pretty"}}>{widow(slide.corpo)}</div>
          :!hasContent&&<div style={{flex:1}}/>
        }
        {hasImg&&pos==="bottom"&&<div style={{marginTop:12}}><BandEl src={img} h={90} offsetY={off}/></div>}
        <div style={{flex:1}}/>
        {slide.punchline&&<PunchEl txt={slide.punchline} accent={accent} light={light}/>}
        <Foot light={light} accent={accent} label={pg(idx,total)}/>
      </div>
    </div>
  );
}

function TweetSlide({slide,idx,total,perfil,editField,editVal,setEditVal,onEdit,onCommit}){
  const parts=splitTitulo(slide.titulo,slide.destaque);
  return(
    <div style={{...TW.card}}>
      <div style={TW.top}>
        <div style={{...TW.avatar,backgroundImage:`url(${perfil})`,backgroundSize:"cover",backgroundPosition:"center"}}/>
        <div><div style={TW.name}>{NOME} <span style={{color:C.purple}}>✦</span></div><div style={TW.handle}>{HANDLE}</div></div>
      </div>
      <div style={TW.body}>{parts.map((p,i)=><span key={i} style={p.hi?{color:C.purple,fontStyle:"italic"}:undefined}>{p.t}</span>)}</div>
      {slide.bgImage&&<div style={{marginTop:10,borderRadius:12,overflow:"hidden",width:"100%",aspectRatio:"16/9",flexShrink:0}}><img src={slide.bgImage} alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:`center ${50+(slide.imgOffsetY||0)}%`}}/></div>}
      {slide.corpo&&<div style={TW.sub}>{widow(slide.corpo)}</div>}
      {slide.punchline&&<div style={TW.quote}>{widow(slide.punchline)}</div>}
      <div style={{flex:1}}/>
      <div style={TW.foot}>{pg(idx,total)}</div>
    </div>
  );
}

// PNG render headless pra ZIP
async function cvLoadImg(src){return new Promise(res=>{const i=new Image();i.crossOrigin="anonymous";i.onload=()=>res(i);i.onerror=()=>res(null);i.src=src;});}
async function renderSlideToPNG(slide,i,total,estilo,perfil){
  try{
    const W=1080,H=1350,k=W/SLIDE_W;
    const cv=document.createElement("canvas");cv.width=W;cv.height=H;
    const ctx=cv.getContext("2d");
    const eff=estilo==="twitter"?"twitter":estilo==="sortido"?sortidoEff(slide,i):"dark";
    const light=eff==="light";
    ctx.fillStyle=light?"#FAFAF7":"#000000";ctx.fillRect(0,0,W,H);
    if(!light){
      ctx.save();ctx.globalCompositeOperation="lighter";
      let g=ctx.createRadialGradient(W*.05,0,0,W*.05,0,W*.75);g.addColorStop(0,"rgba(137,40,255,0.5)");g.addColorStop(1,"rgba(137,40,255,0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      g=ctx.createRadialGradient(W*.95,H,0,W*.95,H,W*.75);g.addColorStop(0,"rgba(0,239,158,0.3)");g.addColorStop(1,"rgba(0,239,158,0)");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      ctx.restore();
    }
    const pad=22*k,footY=H-pad-28*k;
    const accent=light?C.purple:C.green;
    const img=slide.bgImage?await cvLoadImg(slide.bgImage):null;
    if(img&&(slide.tipo==="capa"||slide.imgPos==="bg")){
      const off=slide.imgOffsetY||0;
      const ir=img.width/img.height,r=W/H;
      let sw,sh,sx,sy;
      if(ir>r){sh=img.height;sw=sh*r;sx=(img.width-sw)/2;sy=0;}else{sw=img.width;sh=sw/r;sx=0;sy=(img.height-sh)/2;}
      const offPx=(off/100)*sh;
      ctx.drawImage(img,sx,sy+offPx,sw,sh-Math.abs(offPx)*2,0,0,W,H);
      const gr=ctx.createLinearGradient(0,0,0,H);gr.addColorStop(0,"rgba(0,0,0,.1)");gr.addColorStop(1,"rgba(0,0,0,.82)");ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
    }
    try{await Promise.all([document.fonts.load(`700 ${20*k}px 'IBM Plex Mono'`),document.fonts.load(`italic 700 ${20*k}px 'IBM Plex Mono'`)]);}catch(_){}
    // title
    const parts=splitTitulo(slide.titulo,slide.destaque);
    const titleSize=slide.tipo==="capa"?28*k:20*k;
    const titleColor=(img&&slide.tipo==="capa")?C.white:(light?C.black:C.white);
    let y=slide.tipo==="capa"?H*0.52:pad+22*k;
    const spW=ctx.measureText(" ").width;
    ctx.textBaseline="top";
    const words=[];parts.forEach(p=>{p.t.split(/\s+/).forEach(w=>{if(w)words.push({w,hi:p.hi});});});
    const maxW=W-pad*2;
    const lines=[];let cur=[],curW=0;
    for(const tk of words){ctx.font=`italic 700 ${titleSize}px 'IBM Plex Mono',monospace`;const ww=ctx.measureText(tk.w).width;const add=(cur.length?spW:0)+ww;if(curW+add>maxW&&cur.length){lines.push(cur);cur=[tk];curW=ww;}else{cur.push(tk);curW+=add;}}
    if(cur.length)lines.push(cur);
    for(const ln of lines){let cx=pad;for(const tk of ln){ctx.font=tk.hi?`italic 700 ${titleSize}px 'IBM Plex Mono',monospace`:`700 ${titleSize}px 'IBM Plex Mono',monospace`;ctx.fillStyle=tk.hi?accent:titleColor;ctx.fillText(tk.w,cx,y);cx+=ctx.measureText(tk.w).width+spW;}y+=titleSize*1.15;}
    if(slide.corpo){y+=8*k;ctx.font=`400 ${16*k}px 'IBM Plex Mono',monospace`;ctx.fillStyle=light?"rgba(0,0,0,.65)":"rgba(255,255,255,.74)";const bodyWords=slide.corpo.split(/\s+/);const bodyLines=[];let bl="";for(const w of bodyWords){const t=bl?bl+" "+w:w;if(ctx.measureText(t).width>maxW&&bl){bodyLines.push(bl);bl=w;}else bl=t;}if(bl)bodyLines.push(bl);for(const l of bodyLines){ctx.fillText(l,pad,y);y+=16*k*1.5;}}
    if(slide.punchline){ctx.font=`700 ${14*k}px 'IBM Plex Mono',monospace`;ctx.fillStyle=accent;ctx.fillRect(pad,footY-40*k,3*k,32*k);ctx.fillStyle=light?C.black:C.white;ctx.fillText(slide.punchline.slice(0,60),pad+12*k,footY-38*k);}
    ctx.strokeStyle=light?"rgba(0,0,0,.1)":"rgba(255,255,255,.1)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(pad,footY);ctx.lineTo(W-pad,footY);ctx.stroke();
    ctx.font=`400 ${9*k}px 'IBM Plex Mono',monospace`;ctx.fillStyle=light?"rgba(0,0,0,.4)":C.dim;ctx.fillText(HANDLE,pad,footY+10*k);
    ctx.fillStyle=accent;const pgStr=pg(i,total);ctx.fillText(pgStr,W-pad-ctx.measureText(pgStr).width,footY+10*k);
    return cv.toDataURL("image/png");
  }catch(e){console.error(e);return null;}
}

// ===== ESTILOS =====
const St={
  root:{minHeight:"100vh",background:C.black,color:C.white,fontFamily:MONO,padding:"16px 20px 40px"},
  header:{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:14,borderBottom:`1px solid ${C.line}`,marginBottom:14},
  brand:{fontSize:13,fontWeight:700,letterSpacing:"0.04em"},
  brandSub:{fontSize:10,color:C.dim,marginTop:2},
  grid:{display:"grid",gridTemplateColumns:"minmax(260px,360px) 1fr",gap:20,alignItems:"start"},
  left:{display:"flex",flexDirection:"column",gap:12},
  right:{display:"flex",flexDirection:"column",gap:11},
  card:{background:C.panel,border:`1px solid ${C.line}`,borderRadius:13,padding:15},
  step:{fontSize:11,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:7},
  stepNum:{color:C.green,fontWeight:700},
  lab:{fontSize:10,color:C.dim,marginBottom:4},
  textarea:{width:"100%",background:C.panel2,border:`1px solid ${C.line}`,borderRadius:8,color:C.white,fontFamily:MONO,fontSize:13,padding:10,resize:"vertical",boxSizing:"border-box",marginBottom:4},
  input:{width:"100%",background:C.panel2,border:`1px solid ${C.line}`,borderRadius:8,color:C.white,fontFamily:MONO,fontSize:13,padding:"9px 11px",boxSizing:"border-box"},
  btnPrimary:{width:"100%",background:C.green,color:C.black,border:"none",borderRadius:8,padding:"11px 14px",fontFamily:MONO,fontSize:13,fontWeight:700,cursor:"pointer"},
  btnGhost:{background:"transparent",color:C.white,border:`1px solid ${C.line}`,borderRadius:7,padding:"7px 12px",fontFamily:MONO,fontSize:11,cursor:"pointer"},
  ideia:{textAlign:"left",border:"1px solid",borderRadius:8,padding:"10px 12px",cursor:"pointer",fontFamily:MONO,color:C.white},
  ideiaTit:{fontSize:12,fontWeight:700,marginBottom:3,lineHeight:1.3},
  ideiaAng:{fontSize:10,color:C.dim,lineHeight:1.4},
  targetRow:{display:"flex",gap:6,marginBottom:8},
  targetBtn:{flex:1,border:`1px solid ${C.line}`,borderRadius:7,padding:"6px 10px",fontFamily:MONO,fontSize:10,fontWeight:700,cursor:"pointer"},
  chatLog:{maxHeight:90,overflowY:"auto",marginBottom:8,display:"flex",flexDirection:"column",gap:4},
  chatMsg:{fontSize:10,lineHeight:1.4},
  erro:{background:"rgba(137,40,255,0.12)",border:`1px solid ${C.purple}`,borderRadius:8,padding:10,fontSize:11},
  previewBar:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8},
  styleSwitch:{display:"inline-flex",background:C.panel,border:`1px solid ${C.line}`,borderRadius:8,padding:3,gap:3},
  styleBtn:{border:"none",borderRadius:6,padding:"6px 10px",fontFamily:MONO,fontSize:11,fontWeight:700,cursor:"pointer"},
  stage:{display:"flex",justifyContent:"center",alignItems:"center",minHeight:440,background:C.panel,border:`1px solid ${C.line}`,borderRadius:13,padding:18},
  placeholder:{color:C.dim,fontSize:12,textAlign:"center",maxWidth:280},
  nav:{display:"flex",alignItems:"center",justifyContent:"center",gap:13},
  navBtn:{background:C.panel,color:C.white,border:`1px solid ${C.line}`,borderRadius:7,width:36,height:33,fontSize:14,cursor:"pointer"},
  dots:{display:"flex",gap:6},dot:{width:7,height:7,borderRadius:"50%",cursor:"pointer"},
  slideTools:{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"},
  uploadBtn:{background:"transparent",color:C.green,border:`1px solid ${C.green}`,borderRadius:7,padding:"5px 10px",fontFamily:MONO,fontSize:10,cursor:"pointer"},
  removeImg:{background:"transparent",color:C.dim,border:`1px solid ${C.line}`,borderRadius:7,padding:"5px 10px",fontFamily:MONO,fontSize:10,cursor:"pointer"},
  posBtn:{border:`1px solid ${C.line}`,borderRadius:7,padding:"5px 10px",fontFamily:MONO,fontSize:10,cursor:"pointer"},
  promptBox:{background:C.panel,border:`1px solid ${C.line}`,borderRadius:10,padding:11},
  promptHead:{fontSize:9,letterSpacing:"0.1em",color:C.dim,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"},
  promptTxt:{fontSize:11,lineHeight:1.5,color:"rgba(255,255,255,0.85)"},
  copyMini:{background:"transparent",color:C.green,border:`1px solid ${C.green}`,borderRadius:5,padding:"2px 8px",fontSize:9,fontFamily:MONO,cursor:"pointer"},
  avatarMini:{width:40,height:40,borderRadius:"50%",background:C.purple,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,fontFamily:MONO},
};
const TW={
  card:{width:SLIDE_W,height:SLIDE_H,overflow:"hidden",background:C.white,borderRadius:18,padding:18,boxSizing:"border-box",boxShadow:"0 20px 50px rgba(0,0,0,0.45)",display:"flex",flexDirection:"column"},
  top:{display:"flex",alignItems:"center",gap:10,marginBottom:13},
  avatar:{width:40,height:40,borderRadius:"50%",background:C.purple,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:13,fontFamily:MONO,flexShrink:0},
  name:{fontWeight:700,fontSize:13,color:"#0f1419",fontFamily:MONO},
  handle:{fontSize:10,color:"#536471",fontFamily:MONO},
  body:{fontFamily:MONO,fontSize:17,lineHeight:1.3,color:"#0f1419",fontWeight:700,textWrap:"balance"},
  sub:{marginTop:9,fontSize:14,lineHeight:1.45,color:"#0f1419",fontFamily:MONO},
  quote:{marginTop:10,borderLeft:`3px solid ${C.green}`,paddingLeft:10,fontSize:13,fontWeight:700,color:"#0f1419",fontFamily:MONO},
  foot:{paddingTop:12,borderTop:"1px solid #eff3f4",fontSize:9,color:"#536471",fontFamily:MONO},
};
const CSS=`
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
html,body,#root{background:#000;min-height:100%;}
button:disabled{opacity:0.45;cursor:not-allowed;}
select{appearance:none;}
input[type=range]{height:4px;}
textarea:focus,input:focus,button:focus-visible,select:focus{outline:2px solid ${C.green};outline-offset:1px;}
@media(max-width:820px){.__grid{grid-template-columns:1fr!important;}}
`;
