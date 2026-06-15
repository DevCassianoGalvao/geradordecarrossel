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
    body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:2000, messages:[{role:"user",content:prompt}] }),
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

// ===== PADR\u00D5ES DE FUNDO =====
const PATTERN_NAMES={
  glow:"Glow",glow2:"Glow Alt",grid:"Grid",diagonal:"Diagonal",
  dots:"Pontos",waves:"Ondas",zigzag:"Zigzag",scanlines:"Scanlines",
  circuit:"Circuito",minimal:"Minimal",
  corners:"Cantos",radial:"Radial",crosshatch:"Hachura",checker:"Xadrez"
};
function BgDecor({pattern,light}){
  if(light)return null;
  if(!pattern||pattern==="minimal")return null;
  const abs={position:"absolute",pointerEvents:"none",zIndex:0};
  if(pattern==="glow")return(<>
    <div style={{...abs,width:230,height:230,background:`radial-gradient(circle,${C.purple},transparent 70%)`,opacity:.6,filter:"blur(11px)",mixBlendMode:"screen",top:-55,left:-45}}/>
    <div style={{...abs,width:230,height:230,background:`radial-gradient(circle,${C.green},transparent 70%)`,opacity:.32,filter:"blur(11px)",mixBlendMode:"screen",bottom:-75,right:-55}}/>
  </>);
  if(pattern==="glow2")return(<>
    <div style={{...abs,width:230,height:230,background:`radial-gradient(circle,${C.green},transparent 70%)`,opacity:.45,filter:"blur(11px)",mixBlendMode:"screen",top:-55,right:-45}}/>
    <div style={{...abs,width:230,height:230,background:`radial-gradient(circle,${C.purple},transparent 70%)`,opacity:.35,filter:"blur(11px)",mixBlendMode:"screen",bottom:-75,left:-55}}/>
  </>);
  if(pattern==="grid")return <div style={{...abs,inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)",backgroundSize:"34px 34px"}}/>;
  if(pattern==="diagonal")return <div style={{...abs,inset:0,backgroundImage:"repeating-linear-gradient(45deg,rgba(255,255,255,0.035) 0px,rgba(255,255,255,0.035) 1px,transparent 1px,transparent 22px)"}}/>;
  if(pattern==="dots")return <div style={{...abs,inset:0,backgroundImage:"radial-gradient(rgba(255,255,255,0.14) 1.2px,transparent 1.2px)",backgroundSize:"22px 22px"}}/>;
  if(pattern==="waves")return(
    <svg style={{...abs,inset:0,width:"100%",height:"100%",opacity:.09}} preserveAspectRatio="none" viewBox="0 0 340 425">
      {Array.from({length:14},(_,i)=>{const y=20+i*32;return<path key={i} d={`M0,${y} Q85,${y-18} 170,${y} T340,${y}`} stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none"/>;})}
    </svg>
  );
  if(pattern==="zigzag")return(
    <svg style={{...abs,inset:0,width:"100%",height:"100%",opacity:.08}} preserveAspectRatio="none" viewBox="0 0 340 425">
      {Array.from({length:7},(_,i)=>{const y=40+i*60;let d=`M0,${y}`;for(let j=1;j<=18;j++)d+=` L${j*19},${j%2===0?y:y-24}`;return<path key={i} d={d} stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none"/>;})}
    </svg>
  );
  if(pattern==="scanlines")return <div style={{...abs,inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.025) 3px,rgba(255,255,255,0.025) 4px)"}}/>;
  if(pattern==="circuit")return(
    <svg style={{...abs,inset:0,width:"100%",height:"100%",opacity:.09}} viewBox="0 0 340 425">
      <path d="M20,50 H90 V90 H170 V50 H230 M230,50 H290 M290,50 V130 H210 V170 M210,170 H130 V210 H70 V250 M70,250 H150 V290 H230 V330 H310 M310,330 V370 H250 M250,370 H170 V410 M170,410 H90" stroke="rgba(255,255,255,0.65)" strokeWidth="1.2" fill="none"/>
      <path d="M90,50 V20 H180 V50 M310,130 H340 M70,250 V220 H20" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none"/>
      {[[90,50],[170,50],[210,170],[70,250],[230,330],[170,410]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r="3.5" fill="rgba(255,255,255,0.5)"/>)}
    </svg>
  );
  if(pattern==="corners")return(
    <svg style={{...abs,inset:0,width:"100%",height:"100%",opacity:.18}} viewBox="0 0 340 425">
      <path d="M10,65 L10,10 L65,10 M275,10 L330,10 L330,65 M330,360 L330,415 L275,415 M65,415 L10,415 L10,360" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
  if(pattern==="radial")return(
    <svg style={{...abs,inset:0,width:"100%",height:"100%",opacity:.07}} viewBox="0 0 340 425">
      {[45,90,135,180,230,280,330].map((r,i)=><circle key={i} cx="170" cy="212" r={r} stroke="white" strokeWidth="1" fill="none"/>)}
    </svg>
  );
  if(pattern==="crosshatch")return <div style={{...abs,inset:0,backgroundImage:"repeating-linear-gradient(45deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 0,transparent 50%),repeating-linear-gradient(-45deg,rgba(255,255,255,0.03) 0,rgba(255,255,255,0.03) 1px,transparent 0,transparent 50%)",backgroundSize:"20px 20px"}}/>;
  if(pattern==="checker")return <div style={{...abs,inset:0,backgroundImage:"linear-gradient(45deg,rgba(255,255,255,0.025) 25%,transparent 25%),linear-gradient(-45deg,rgba(255,255,255,0.025) 25%,transparent 25%),linear-gradient(45deg,transparent 75%,rgba(255,255,255,0.025) 75%),linear-gradient(-45deg,transparent 75%,rgba(255,255,255,0.025) 75%)",backgroundSize:"24px 24px",backgroundPosition:"0 0,0 12px,12px -12px,-12px 0"}}/>;
  return null;
}

// ===== \u00CDCONES =====
const ICONS={
  phone:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.87 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  calendar:"M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  clock:"M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 6v6l4 2",
  star:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  heart:"M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  check:"M20 6L9 17l-5-5",
  "arrow-right":"M5 12h14M12 5l7 7-7 7",
  zap:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  trending:"M22 7l-8.5 8.5-5-5L2 17M16 7h6v6",
  users:"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  message:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  lock:"M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  target:"M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  sparkles:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
  award:"M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2zM8 21v-4M16 21v-4",
  wifi:"M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01",
  layers:"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  dollar:"M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  "credit-card":"M2 5h20v14H2zM2 10h20",
  "bar-chart":"M18 20V10M12 20V4M6 20v-6",
  activity:"M22 12h-4l-3 9L9 3l-3 9H2",
  cross:"M12 5v14M5 12h14",
  thermometer:"M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z",
  code:"M16 18l6-6-6-6M8 6l-6 6 6 6",
  terminal:"M4 17l6-6-6-6M12 19h8",
  database:"M21 5c0-1.66-4.03-3-9-3S3 3.34 3 5M21 5v14c0 1.66-4.03 3-9 3S3 20.66 3 19V5M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12",
  cpu:"M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM9 9h6v6H9zM9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2",
  layout:"M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM3 9h18M9 21V9",
  pen:"M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
  share:"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
  scissors:"M3 6a3 3 0 1 0 6 0 3 3 0 1 0-6 0M15 6a3 3 0 1 0 6 0 3 3 0 1 0-6 0M5 9l14 6M19 9L5 15",
  "plus-circle":"M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM12 8v8M8 12h8",
};
function Icon({name,size=24,color="currentColor",style={}}){
  const d=ICONS[name];if(!d)return null;
  return<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}><path d={d}/></svg>;
}

class ErrorBoundary extends React.Component {
  constructor(props){super(props);this.state={error:null,info:null};}
  static getDerivedStateFromError(e){return{error:e};}
  componentDidCatch(e,info){this.setState({error:e,info:info});}
  render(){
    if(this.state.error){
      const msg=this.state.error&&this.state.error.message?this.state.error.message:String(this.state.error);
      const stack=this.state.info&&this.state.info.componentStack?this.state.info.componentStack.slice(0,300):"";
      return(
        <div style={{padding:24,color:"#00EF9E",fontFamily:"monospace",background:"#000",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
          <div style={{fontSize:15,fontWeight:700}}>Erro — recarregue a pagina</div>
          <div style={{fontSize:12,opacity:0.8,maxWidth:500,textAlign:"center",background:"#0d0d10",padding:12,borderRadius:8,border:"1px solid #8928FF"}}>{msg}</div>
          {stack&&<div style={{fontSize:10,opacity:0.5,maxWidth:500,whiteSpace:"pre-wrap"}}>{stack}</div>}
          <button onClick={()=>window.location.reload()} style={{background:"#00EF9E",color:"#000",border:"none",borderRadius:8,padding:"10px 24px",fontFamily:"monospace",fontSize:13,fontWeight:700,cursor:"pointer"}}>Recarregar</button>
        </div>
      );
    }
    return this.props.children;
  }
}
const SENHA = "150771ca";

function LoginGate({onLogin}){
  const [val,setVal]=useState("");
  const [erro,setErro]=useState(false);
  function tentar(e){
    e.preventDefault();
    if(val===SENHA){onLogin();}
    else{setErro(true);setTimeout(()=>setErro(false),1500);}
  }
  return(
    <div style={{minHeight:"100vh",background:"#000",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:MONO}}>
      <style>{CSS}</style>
      <div style={{background:C.panel,border:`1px solid ${C.line}`,borderRadius:16,padding:"40px 36px",width:320,textAlign:"center"}}>
        <div style={{fontSize:14,fontWeight:700,color:C.white,letterSpacing:"0.05em",marginBottom:4}}>GERADOR DE CARROSSEL</div>
        <div style={{fontSize:11,color:C.dim,marginBottom:28}}>Cassiano Galvão</div>
        <form onSubmit={tentar} style={{display:"flex",flexDirection:"column",gap:12}}>
          <input
            id="cg-senha"
            name="password"
            type="password"
            autoComplete="current-password"
            value={val}
            onChange={e=>{setVal(e.target.value);setErro(false);}}
            placeholder="senha"
            style={{background:C.panel2,border:`1px solid ${erro?C.purple:C.line}`,borderRadius:9,color:C.white,fontFamily:MONO,fontSize:14,padding:"11px 14px",outline:"none",textAlign:"center",transition:"border-color 0.2s"}}
          />
          <button type="submit" style={{background:C.green,color:C.black,border:"none",borderRadius:9,padding:"11px",fontFamily:MONO,fontSize:13,fontWeight:700,cursor:"pointer"}}>
            Entrar
          </button>
          {erro&&<div style={{fontSize:11,color:C.purple}}>Senha incorreta</div>}
        </form>
      </div>
    </div>
  );
}

export default function App(){
  const [autenticado,setAutenticado]=useState(()=>{try{return sessionStorage.getItem("cg_auth")==="1";}catch{return false;}});
  function onLogin(){try{sessionStorage.setItem("cg_auth","1");}catch{}setAutenticado(true);}
  if(!autenticado)return<LoginGate onLogin={onLogin}/>;
  return<AppContent/>;
}

function AppContent(){

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
  const [legenda,setLegenda]=useState("");
  const [legendaBusy,setLegendaBusy]=useState(false);
  const [bgPattern,setBgPattern]=useState("glow");
  const [showIconPicker,setShowIconPicker]=useState(false);
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
      lista:"OBJETIVO LISTA NUMERADA: siga EXATAMENTE esta estrutura: (1) CAPA = gancho com o numero da lista no titulo (ex: '5 razoes pelas quais seu site perde paciente') — max 8 palavras, sem explicar, so provocar. (2) Slides de conteudo = cada um revela 1 item numerado da lista, com o numero no inicio do titulo (ex: '1. O paciente chegou de noite e...'), corpo com a cena concreta daquele item especifico, punchline que resume aquele item. (3) CTA = convite para conversa. NUNCA invente numeros. Mantenha coerencia com o angulo escolhido em todos os slides.",
      antes_depois:"OBJETIVO ANTES/DEPOIS: slides 2-3 mostram dor atual, slides 4-5 mostram resultado possível. Sem inventar métricas.",
      historia:"OBJETIVO HISTÓRIA: conte situação real. Capa apresenta problema, meio conta o que aconteceu, CTA convida conversa.",
    }[objetivo]||"";
    try{
      const out=await askClaude(`${ctx()}\n${HOOK_CAPA}\n${objInstr}\nTAREFA: carrossel completo sobre: Título "${ideia.titulo}" | Ângulo "${ideia.angulo}".\n1 CAPA + 4-5 CONTEÚDO + 1 CTA. Cada slide: "tipo"(capa|conteudo|cta),"titulo","destaque"(palavra do título),"corpo"(1-2 frases ou ""),"punchline"(frase memorável ou ""),"label"(2-3 palavras CAPS p/ rótulo acima do título — varie: "A VIRADA","O CUSTO","A PERGUNTA","O DIAGNÓSTICO","O PROBLEMA","A SOLUÇÃO","O CASO","O CONVITE" — nunca repita).\nAPENAS JSON: {"isca":"","slides":[{"tipo":"capa","titulo":"","destaque":"","corpo":"","punchline":"","label":""}]}`);
      const d=parseJSON(out);
      const obj=Array.isArray(d)?{isca:"",slides:d}:d;
      const arr=(obj.slides||[]).map((s,si)=>({...s,bgImage:null,imgMode:"foto",imgPos:"top",imgOffsetY:0,imgOffsetX:0,imgScale:1,coverLayout:capaPadrao,image_prompt:"",icon:null,imgBandH:90,typo:{ts:si===0?28:20,tw:700,bs:11,bw:400,blh:1.5,ps:11,pw:700}}));
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

  async function gerarLegenda(){
    if(!slides.length)return;
    setLegendaBusy(true);
    const isEstetica=/harmoniz|dermat|estetica|skin|beleza/i.test((imgDir||"")+foco);
    const tipoNicho=isEstetica?"clinicas de estetica e harmonizacao":"medicos e profissionais de saude";
    const resumo=slides.map((s,i)=>String(i+1)+". "+s.titulo+(s.punchline?" | "+s.punchline:"")).join(" / ");
    const prompt=[
      "Crie uma legenda de Instagram para um carrossel.",
      "TEMA: "+foco,
      "SLIDES: "+resumo,
      "PUBLICO: "+tipoNicho,
      "REGRAS: use emojis com moderacao (1-2 por paragrafo, nao em toda frase). Primeira linha de impacto sem emoji. 2-3 paragrafos curtos em primeira pessoa com emojis naturais que reforcem o ponto. CTA no final com emoji de acao (ex: arrow, direct). Linha separadora (---). 15-20 hashtags misturadas (nicho grande + especificas + #webdesign #marketingmedico #siteparaclinica #captacaodepacientes). Tom direto, humano, nao parece post corporativo. Retorne APENAS a legenda pronta."
    ].join(" / ");
    try{
      const out=await askClaude(prompt);
      setLegenda(out.trim());
    }catch(e){setErro("Legenda erro: "+e.message);}
    finally{setLegendaBusy(false);}
  }

  // Load lib dynamically
  async function loadLib(url, check){
    if(window[check])return;
    return new Promise((res,rej)=>{const s=document.createElement("script");s.src=url;s.onload=res;s.onerror=rej;document.head.appendChild(s);});
  }

  async function captureSlide(slideIndex){
    if(!slides[slideIndex])return null;
    const prev=idx;
    try{
      setIdx(slideIndex);
      await new Promise(r=>setTimeout(r,180));
      const node=slideRef.current?.firstElementChild;
      if(!node)return null;
      await loadLib("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js","html2canvas");

      // For each <img>, pre-render a correctly-cropped copy at full resolution
      // onto an offscreen canvas, then swap the src. This preserves object-fit
      // AND keeps the element in the exact same DOM position (no layout shift).
      const imgs=Array.from(node.querySelectorAll("img"));
      const swaps=[];
      for(const img of imgs){
        const ps=window.getComputedStyle(img);
        const w=img.offsetWidth, h=img.offsetHeight;
        if(!w||!h||!img.naturalWidth){continue;}
        const fit=ps.objectFit;
        const SC=3; // supersample for quality
        const cv=document.createElement("canvas");
        cv.width=w*SC; cv.height=h*SC;
        const ctx=cv.getContext("2d");
        ctx.imageSmoothingQuality="high";
        const iw=img.naturalWidth, ih=img.naturalHeight;
        const opParts=(ps.objectPosition||"50% 50%").split(" ");
        const opx=(parseFloat(opParts[0])||50)/100;
        const opy=(parseFloat(opParts[1])||50)/100;
        if(fit==="contain"){
          const s=Math.min(w/iw,h/ih);
          const dw=iw*s, dh=ih*s;
          ctx.drawImage(img,((w-dw)*opx)*SC,((h-dh)*opy)*SC,dw*SC,dh*SC);
        }else{ // cover (default)
          const s=Math.max(w/iw,h/ih);
          const dw=iw*s, dh=ih*s;
          ctx.drawImage(img,((w-dw)*opx)*SC,((h-dh)*opy)*SC,dw*SC,dh*SC);
        }
        const newSrc=cv.toDataURL("image/png");
        swaps.push({img,oldSrc:img.src,oldFit:img.style.objectFit,oldPos:img.style.objectPosition});
        img.src=newSrc;
        img.style.objectFit="fill";
        img.style.objectPosition="center";
      }
      // wait for new srcs to decode
      await Promise.all(imgs.map(img=>img.decode?img.decode().catch(()=>{}):Promise.resolve()));

      // Remove rounded corners for Instagram (square export)
      const origRadius=node.style.borderRadius;
      const origShadow=node.style.boxShadow;
      const origBorder=node.style.border;
      node.style.borderRadius="0";
      node.style.boxShadow="none";
      node.style.border="none";

      let dataUrl=null;
      try{
        const canvas=await window.html2canvas(node,{
          scale:3, useCORS:true, allowTaint:true, backgroundColor:getComputedStyle(node).backgroundColor||"#000000",
          width:SLIDE_W, height:SLIDE_H, logging:false
        });
        dataUrl=canvas.toDataURL("image/png");
      }finally{
        node.style.borderRadius=origRadius;
        node.style.boxShadow=origShadow;
        node.style.border=origBorder;
        swaps.forEach(({img,oldSrc,oldFit,oldPos})=>{img.src=oldSrc;img.style.objectFit=oldFit;img.style.objectPosition=oldPos;});
      }
      return dataUrl;
    }finally{
      setIdx(prev);
    }
  }

  async function exportarZip(){
    if(!slides.length)return;
    setExportBusy(true);
    try{
      await loadLib("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js","JSZip");
      await loadLib("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js","html2canvas");
      const zip=new window.JSZip();
      for(let i=0;i<slides.length;i++){
        const png=await captureSlide(i);
        if(png) zip.file(`slide-${String(i+1).padStart(2,"0")}.png`,png.split(",")[1],{base64:true});
      }
      const blob=await zip.generateAsync({type:"blob"});
      const u=URL.createObjectURL(blob);const a=document.createElement("a");a.href=u;a.download="carrossel.zip";a.click();URL.revokeObjectURL(u);
    }catch(e){setErro("ZIP erro: "+e.message);}finally{setExportBusy(false);}
  }

  async function exportarPNG(){
    if(!slide)return;
    const png=await captureSlide(idx);
    if(!png){setErro("Falha ao capturar slide.");return;}
    const a=document.createElement("a");a.href=png;a.download=`slide-${String(idx+1).padStart(2,"0")}.png`;a.click();
  }

  const slide=slides[idx];

  return(
    <div style={{...St.root,background:"#000"}}>
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
                <button style={{...St.btnGhost}} onClick={exportarPNG} disabled={exportBusy}>⬇ PNG</button>
                <button style={{...St.btnGhost,color:C.green,borderColor:C.green}} onClick={exportarZip} disabled={exportBusy}>{exportBusy?"Gerando…":"⬇ ZIP"}</button>
              </div>
            )}
          </div>
          {/* Seletor de padrão de fundo */}
          <div style={{display:"flex",gap:4,flexWrap:"wrap",padding:"6px 0"}}>
            {Object.entries(PATTERN_NAMES).map(([k,l])=>(
              <button key={k} onClick={()=>setBgPattern(k)} style={{background:bgPattern===k?C.purple:"transparent",color:bgPattern===k?C.white:C.dim,border:`1px solid ${bgPattern===k?C.purple:C.line}`,borderRadius:6,padding:"3px 8px",fontFamily:MONO,fontSize:10,cursor:"pointer"}}>{l}</button>
            ))}
          </div>

          {isca&&<div style={{background:"rgba(0,239,158,0.08)",border:`1px solid ${C.green}`,borderRadius:9,padding:"9px 13px",fontSize:12}}><b style={{color:C.green}}>Isca:</b> {isca}</div>}

          <div style={{...St.stage,background:"#0d0d10"}}>
            {carregando==="carrossel"&&<div style={{...St.placeholder,color:"#00EF9E"}}>Montando o carrossel…</div>}
            {!slide&&carregando!=="carrossel"&&<div style={St.placeholder}>{ideias.length===0?"Passo 01: foco e gere ideias.":"Passo 02: escolha e confirme um ângulo."}</div>}
            {slide&&<div ref={slideRef} data-cap="1"><Slide slide={slide} estilo={estilo} idx={idx} total={slides.length} perfil={perfil} editField={editField} editVal={editVal} setEditVal={setEditVal} onEdit={startEdit} onCommit={commitEdit} bgPattern={bgPattern}/></div>}
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
              {slide.bgImage&&(
                <button onClick={()=>setSlideField("imgMode",slide.imgMode==="ilustracao"?"foto":"ilustracao")}
                  style={{...St.posBtn,color:slide.imgMode==="ilustracao"?C.green:C.white,borderColor:slide.imgMode==="ilustracao"?C.green:C.line}}>
                  {slide.imgMode==="ilustracao"?"ilustracao ativo":"modo foto"}
                </button>
              )}
              {slide.bgImage&&(slide.tipo!=="capa"||estilo==="twitter")&&slide.imgMode!=="ilustracao"&&[["top","cima"],["bottom","baixo"],["bg","fundo"]].map(([k,l])=>(
                <button key={k} onClick={()=>setSlideField("imgPos",k)} style={{...St.posBtn,background:slide.imgPos===k?C.green:"transparent",color:slide.imgPos===k?C.black:C.white}}>{l}</button>
              ))}
              {slide.bgImage&&(
                <div style={{display:"flex",gap:8,alignItems:"center",background:C.panel2,borderRadius:8,padding:"4px 10px",flexWrap:"wrap"}}>
                  {[["Y",slide.imgOffsetY||0,"imgOffsetY"],["X",slide.imgOffsetX||0,"imgOffsetX"]].map(([label,val,field])=>(
                    <div key={field} style={{display:"flex",alignItems:"center",gap:4}}>
                      <span style={{fontSize:9,color:C.dim,width:10}}>{label}</span>
                      <div style={{position:"relative",display:"flex",alignItems:"center"}}>
                        <input type="range" min="-100" max="100" value={val}
                          onChange={e=>{const v=Number(e.target.value);const snapped=Math.abs(v)<=4?0:v;setSlides(p=>p.map((s,i)=>i===idx?{...s,[field]:snapped}:s));}}
                          style={{width:70,accentColor:C.green}}/>
                        {Math.abs(val)<=4&&<div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",width:7,height:7,borderRadius:"50%",background:C.green,pointerEvents:"none",boxShadow:`0 0 5px ${C.green}`}}/>}
                      </div>
                      <span style={{fontSize:9,color:val===0?C.green:C.dim,minWidth:22}}>{val}</span>
                    </div>
                  ))}
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <span style={{fontSize:9,color:C.dim,width:14}}>Z</span>
                    <input type="range" min="1" max="3" step="0.05" value={slide.imgScale||1}
                      onChange={e=>setSlides(p=>p.map((s,i)=>i===idx?{...s,imgScale:Number(e.target.value)}:s))}
                      style={{width:70,accentColor:C.purple}}/>
                    <span style={{fontSize:9,color:(slide.imgScale||1)===1?C.green:C.dim,minWidth:28}}>{(slide.imgScale||1).toFixed(2)}x</span>
                    {(slide.imgScale||1)>1&&<button onClick={()=>setSlides(p=>p.map((s,i)=>i===idx?{...s,imgScale:1}:s))} style={{background:"transparent",border:"none",color:C.dim,fontSize:9,cursor:"pointer",padding:0}}>↺</button>}
                  </div>
                </div>
              )}
              {slide.tipo==="capa"&&estilo!=="twitter"&&(
                <button style={St.removeImg} onClick={()=>setSlideField("coverLayout",((slide.coverLayout||0)+1)%5)}>
                  capa ({(slide.coverLayout||0)+1}/5)
                </button>
              )}
              {/* Altura da faixa de imagem — conteúdo + capas com band (lay 3/4) */}
              {slide.bgImage&&(slide.tipo!=="capa"||(slide.coverLayout===3||slide.coverLayout===4))&&(
                <div style={{display:"flex",alignItems:"center",gap:4,background:C.panel2,borderRadius:8,padding:"4px 8px"}}>
                  <span style={{fontSize:9,color:C.dim}}>H</span>
                  <input type="range" min="50" max="220" value={slide.imgBandH||(slide.tipo==="capa"?150:90)} onChange={e=>setSlides(p=>p.map((s,i)=>i===idx?{...s,imgBandH:Number(e.target.value)}:s))} style={{width:60,accentColor:C.green}}/>
                  <span style={{fontSize:9,color:C.white,minWidth:24}}>{slide.imgBandH||(slide.tipo==="capa"?150:90)}</span>
                </div>
              )}
              {/* Ícone decorativo */}
              <button style={{...St.removeImg,color:slide.icon?C.green:C.dim,borderColor:slide.icon?C.green:C.line}} onClick={()=>setShowIconPicker(v=>!v)}>
                {slide.icon?<><Icon name={slide.icon} size={11} color={C.green}/> ícone</>:"+ ícone"}
              </button>
              {slide.icon&&<button style={St.removeImg} onClick={()=>setSlideField("icon",null)}>× ícone</button>}
            </div>
            {/* Icon picker */}
            {showIconPicker&&(
              <div style={{background:C.panel,border:`1px solid ${C.line}`,borderRadius:10,padding:10}}>
                <div style={{fontSize:9,color:C.dim,marginBottom:8,letterSpacing:"0.1em"}}>ÍCONE DECORATIVO — clique para aplicar ao slide atual</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {Object.keys(ICONS).map(name=>(
                    <button key={name} title={name} onClick={()=>{setSlideField("icon",name);setShowIconPicker(false);}}
                      style={{background:slide.icon===name?"rgba(0,239,158,0.15)":"transparent",border:`1px solid ${slide.icon===name?C.green:C.line}`,borderRadius:7,padding:"7px 10px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                      <Icon name={name} size={16} color={slide.icon===name?C.green:C.dim}/>
                      <span style={{fontSize:8,color:C.dim,fontFamily:MONO}}>{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <TypoPanel slide={slide} idx={idx} setSlides={setSlides}/>

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

            <div style={St.card}>
              <div style={{...St.step,marginBottom:8}}><span style={St.stepNum}>L</span> Legenda do post</div>
              <div style={{display:"flex",gap:8,marginBottom:legenda?10:0}}>
                <button style={{...St.btnPrimary,flex:1}} onClick={gerarLegenda} disabled={legendaBusy||!slides.length}>
                  {legendaBusy?"Gerando...":"Gerar legenda + hashtags"}
                </button>
                {legenda&&<button style={St.btnGhost} onClick={()=>copiar(legenda)}>Copiar</button>}
              </div>
              {legenda&&(
                <textarea value={legenda} onChange={e=>setLegenda(e.target.value)}
                  style={{...St.textarea,marginBottom:0,minHeight:200,fontSize:12,lineHeight:1.6}}/>
              )}
            </div>
          </>)}
        </div>
      </div>
    </div>
  );
}

// ===== SLIDE RENDER =====
function Slide({slide,estilo,idx,total,perfil,editField,editVal,setEditVal,onEdit,onCommit,bgPattern}){
  if(estilo==="twitter")return<TweetSlide slide={slide} idx={idx} total={total} perfil={perfil} editField={editField} editVal={editVal} setEditVal={setEditVal} onEdit={onEdit} onCommit={onCommit} bgPattern={bgPattern}/>;
  const eff=estilo==="sortido"?sortidoEff(slide,idx):estilo;
  if(slide.tipo==="capa")return<CoverSlide slide={slide} eff={eff} idx={idx} total={total} editField={editField} editVal={editVal} setEditVal={setEditVal} onEdit={onEdit} onCommit={onCommit} bgPattern={bgPattern}/>;
  return<ContentSlide slide={slide} eff={eff} idx={idx} total={total} editField={editField} editVal={editVal} setEditVal={setEditVal} onEdit={onEdit} onCommit={onCommit} bgPattern={bgPattern}/>;
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
function EditablePunch({text,accent,light,size=12,weight=700,field,slideIdx,editField,editVal,setEditVal,onEdit,onCommit}){
  const isMe=editField&&editField.slideIdx===slideIdx&&editField.field===field;
  if(isMe)return<div style={{borderLeft:`3px solid ${accent}`,paddingLeft:11,marginBottom:12}}><textarea autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)} onBlur={onCommit} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();onCommit();}}} style={{width:"100%",background:"rgba(0,0,0,0.5)",border:`1px solid ${accent}`,borderRadius:6,color:C.white,fontFamily:MONO,fontSize:14,fontWeight:700,padding:4,resize:"none",outline:"none"}}/></div>;
  return<div onDoubleClick={()=>onEdit(slideIdx,field)} title="Duplo clique para editar" style={{borderLeft:`3px solid ${accent}`,paddingLeft:11,fontSize:size,fontWeight:weight,lineHeight:1.4,color:light?C.black:C.white,marginBottom:12,cursor:"text",textWrap:"pretty"}}>{widow(text)}</div>;
}
function PunchEl({txt,accent,light}){
  return<div style={{borderLeft:`3px solid ${accent}`,paddingLeft:11,fontSize:14,fontWeight:700,lineHeight:1.4,color:light?C.black:C.white,marginBottom:12,textWrap:"pretty"}}>{widow(txt)}</div>;
}
function BandEl({src,h,offsetY,offsetX,scale,mode}){
  if(mode==="ilustracao") return(
    <div style={{display:"flex",justifyContent:"center",height:h||120,flexShrink:0}}>
      <img src={src} alt="" style={{height:"100%",width:"auto",objectFit:"contain",filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.5))"}}/>
    </div>
  );
  const ms=Math.max(1.2,scale||1);
  const base=`${(1-ms)*50}%`;
  return(
    <div style={{borderRadius:9,overflow:"hidden",height:h||90,flexShrink:0,position:"relative"}}>
      <img src={src} alt="" style={{
        position:"absolute",
        width:`${ms*100}%`,height:`${ms*100}%`,
        objectFit:"cover",
        top:`calc(${base} + ${-(offsetY||0)}px)`,
        left:`calc(${base} + ${-(offsetX||0)}px)`,
      }}/>
    </div>
  );
}
// Imagem full-bleed com suporte a zoom (Z) e pan X/Y — usada em capas e bg
function ImgFullBleed({src,off,offX,scale,opacity}){
  const ms=Math.max(1.15,scale||1);
  const base=`${(1-ms)*50}%`;
  const st={position:"absolute",width:`${ms*100}%`,height:`${ms*100}%`,objectFit:"cover",top:`calc(${base} + ${-off}px)`,left:`calc(${base} + ${-offX}px)`};
  if(opacity!==undefined)st.opacity=opacity;
  return<div style={{position:"absolute",inset:0,overflow:"hidden"}}><img src={src} alt="" style={st}/></div>;
}
function EditableText({text,destaque,size,color,accent,field,slideIdx,editField,editVal,setEditVal,onEdit,onCommit,bold=true,lh,style={}}){
  const isMe=editField&&editField.slideIdx===slideIdx&&editField.field===field;
  if(isMe)return<textarea autoFocus value={editVal} onChange={e=>setEditVal(e.target.value)}
    onBlur={onCommit} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();onCommit();}}}
    style={{width:"100%",background:"rgba(0,0,0,0.5)",border:`1px solid ${C.green}`,borderRadius:6,color:C.white,fontFamily:MONO,fontSize:size,fontWeight:bold?700:400,padding:6,resize:"none",outline:"none",...style}}/>;
  const parts=destaque?splitTitulo(text,destaque):null;
  return<div onDoubleClick={()=>onEdit(slideIdx,field)} title="Duplo clique para editar"
    style={{cursor:"text",fontFamily:MONO,fontWeight:bold?700:400,fontSize:size,lineHeight:lh||(bold?1.12:1.5),color,textWrap:bold?"balance":"pretty",...style}}>
    {parts?parts.map((p,i)=><span key={i} style={p.hi?{fontStyle:"italic",fontWeight:700,color:accent||color}:undefined}>{p.t}</span>):(text||<span style={{opacity:0.3,fontStyle:"italic"}}>vazio</span>)}
  </div>;
}
function cardBase(light){return{width:SLIDE_W,height:SLIDE_H,borderRadius:14,position:"relative",overflow:"hidden",boxShadow:"0 20px 50px rgba(0,0,0,0.55)",border:light?"none":`1px solid ${C.line}`,background:light?"#FAFAF7":C.black};}
const imgFull={position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"};
const scrim={position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(0,0,0,.1),rgba(0,0,0,.82))",zIndex:1};
const padCol={position:"relative",height:"100%",padding:22,display:"flex",flexDirection:"column",boxSizing:"border-box",zIndex:2};

function CoverSlide({slide,eff,idx,total,editField,editVal,setEditVal,onEdit,onCommit,bgPattern}){
  const light=eff==="light",accent=light?C.purple:C.green,fg=light?C.black:C.white;
  const lay=slide.coverLayout||0,img=slide.bgImage,off=slide.imgOffsetY||0,offX=slide.imgOffsetX||0;
  const titleColor=img&&(lay===0||lay===2)?C.white:fg;
  const titleAccent=img&&(lay===0||lay===2)?C.green:accent;

  const tp=slide.typo||{ts:28,tw:700,bs:12,bw:400,blh:1.5,ps:12,pw:700};
  const titleEl=<EditableText text={slide.titulo} destaque={slide.destaque} size={tp.ts} color={titleColor} accent={titleAccent} field="titulo" slideIdx={idx} editField={editField} editVal={editVal} setEditVal={setEditVal} onEdit={onEdit} onCommit={onCommit}/>;
  const corpoEl=slide.corpo?<EditableText text={slide.corpo} destaque={slide.corpoDestaque} accent={accent} size={tp.bs} color={img?"rgba(255,255,255,.8)":(light?"rgba(0,0,0,.6)":"rgba(255,255,255,.7)")} bold={tp.bw>=700} lh={tp.blh} field="corpo" slideIdx={idx} editField={editField} editVal={editVal} setEditVal={setEditVal} onEdit={onEdit} onCommit={onCommit} style={{marginTop:10}}/>:null;
  const footEl=<Foot light={!img&&light} accent={img&&(lay===0||lay===2)?C.green:accent} label={pg(idx,total)}/>;

  if(lay===2)return(
    <div style={cardBase(light)}>
      {img&&slide.imgMode!=="ilustracao"?<><ImgFullBleed src={img} off={off} offX={offX} scale={slide.imgScale}/><div style={scrim}/></>:<BgDecor pattern={bgPattern} light={light}/>}
      {img&&slide.imgMode==="ilustracao"&&<img src={img} alt="" style={{position:"absolute",bottom:60,right:10,height:"55%",width:"auto",objectFit:"contain",filter:"drop-shadow(0 4px 20px rgba(0,0,0,0.6))",zIndex:1,pointerEvents:"none"}}/>}
      <div style={padCol}><div style={{flex:1}}/>{titleEl}<div style={{marginTop:10}}>{footEl}</div></div>
    </div>
  );
  if(lay===1)return(
    <div style={cardBase(light)}>
      {<BgDecor pattern={bgPattern} light={light}/>}
      <div style={{...padCol,paddingTop:55}}>
        {titleEl}
        {corpoEl}
        <div style={{flex:1}}/>{footEl}
      </div>
    </div>
  );
  if(lay===3)return(
    <div style={cardBase(light)}>
      {<BgDecor pattern={bgPattern} light={light}/>}
      <div style={{...padCol,justifyContent:"space-between"}}>
        {img&&<BandEl src={img} h={slide.imgBandH||150} offsetY={off} offsetX={slide.imgOffsetX||0} scale={slide.imgScale} mode={slide.imgMode||"foto"}/>}
        <div style={{display:"flex",flexDirection:"column",gap:10,flex:1,justifyContent:"center",paddingTop:img?12:0}}>
          {titleEl}
          {corpoEl}
        </div>
        {footEl}
      </div>
    </div>
  );
  if(lay===4)return(
    <div style={cardBase(light)}>
      {<BgDecor pattern={bgPattern} light={light}/>}
      <div style={{...padCol,justifyContent:"space-between"}}>
        <div style={{display:"flex",flexDirection:"column",gap:10,flex:1,justifyContent:"center"}}>
          {titleEl}
          {corpoEl}
        </div>
        {img&&<><BandEl src={img} h={slide.imgBandH||150} offsetY={off} offsetX={slide.imgOffsetX||0} scale={slide.imgScale} mode={slide.imgMode||"foto"}/><div style={{height:8}}/></>}
        {footEl}
      </div>
    </div>
  );
  // lay 0 — base
  return(
    <div style={cardBase(light)}>
      {img?<><ImgFullBleed src={img} off={off} offX={offX} scale={slide.imgScale}/><div style={scrim}/></>:null}
      <div style={padCol}>
        <div style={{flex:1}}/>{titleEl}
        {corpoEl}
        <div style={{fontSize:9,letterSpacing:"0.12em",color:img?"rgba(255,255,255,.6)":(light?"rgba(0,0,0,.35)":C.dim),margin:"14px 0 12px"}}>ARRASTA →</div>
        {footEl}
      </div>
    </div>
  );
}

function ContentSlide({slide,eff,idx,total,editField,editVal,setEditVal,onEdit,onCommit,bgPattern}){
  const light=eff==="light",accent=light?C.purple:C.green;
  const pos=slide.imgPos||"top",img=slide.bgImage,off=slide.imgOffsetY||0,offX=slide.imgOffsetX||0;
  const cc=light?"rgba(0,0,0,.65)":"rgba(255,255,255,.74)";
  const titleColor=light?C.black:C.white;

  const tp=slide.typo||{ts:20,tw:700,bs:12,bw:400,blh:1.5,ps:12,pw:700};
  const titleEl=<EditableText text={slide.titulo} destaque={slide.destaque} size={tp.ts} color={titleColor} accent={accent} field="titulo" slideIdx={idx} editField={editField} editVal={editVal} setEditVal={setEditVal} onEdit={onEdit} onCommit={onCommit}/>;
  const corpoEl2=slide.corpo?<EditableText text={slide.corpo} destaque={slide.corpoDestaque} accent={accent} size={tp.bs} color={cc} bold={tp.bw>=700} lh={tp.blh} field="corpo" slideIdx={idx} editField={editField} editVal={editVal} setEditVal={setEditVal} onEdit={onEdit} onCommit={onCommit} style={{marginTop:11}}/>:null;
  const punchEl2=slide.punchline?<EditablePunch text={slide.punchline} accent={accent} light={light} size={tp.ps} weight={tp.pw} field="punchline" slideIdx={idx} editField={editField} editVal={editVal} setEditVal={setEditVal} onEdit={onEdit} onCommit={onCommit}/>:null;

  if(img&&pos==="bg")return(
    <div style={cardBase(light)}>
      <ImgFullBleed src={img} off={off} offX={offX} scale={slide.imgScale} opacity={light?0.15:0.28}/>
      {<BgDecor pattern={bgPattern} light={light}/>}
      <div style={padCol}>
        {titleEl}
        {corpoEl2}
        <div style={{flex:1}}/>
        {punchEl2}
        <Foot light={light} accent={accent} label={pg(idx,total)}/>
      </div>
    </div>
  );

  const hasImg=img&&(pos==="top"||pos==="bottom");
  const hasContent=slide.corpo||slide.punchline;
  return(
    <div style={cardBase(light)}>
      {<BgDecor pattern={bgPattern} light={light}/>}
      <div style={padCol}>
        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:12}}>
          {slide.icon&&<Icon name={slide.icon} size={13} color={accent} style={{flexShrink:0,opacity:.8}}/>}
          <EditableText text={slide.label||(slide.tipo==="cta"?"O CONVITE":"O DIAGNÓSTICO")} size={9} color={light?"rgba(0,0,0,.4)":C.dim} accent={accent} field="label" slideIdx={idx} editField={editField} editVal={editVal} setEditVal={setEditVal} onEdit={onEdit} onCommit={onCommit} bold={false} lh={1} style={{letterSpacing:"0.11em",textTransform:"uppercase"}}/>
        </div>
        {hasImg&&pos==="top"&&<div style={{marginBottom:12}}><BandEl src={img} h={slide.imgBandH||90} offsetY={off} offsetX={offX} scale={slide.imgScale} mode={slide.imgMode||"foto"}/></div>}
        {titleEl}
        {slide.corpo?corpoEl2:(!hasContent&&<div style={{flex:1}}/>)}
        {hasImg&&pos==="bottom"&&<div style={{marginTop:12}}><BandEl src={img} h={slide.imgBandH||(slide.imgMode==="ilustracao"?130:90)} offsetY={off} offsetX={offX} scale={slide.imgScale} mode={slide.imgMode||"foto"}/></div>}
        <div style={{flex:1}}/>
        {punchEl2}
        <Foot light={light} accent={accent} label={pg(idx,total)}/>
      </div>
    </div>
  );
}

function TweetSlide({slide,idx,total,perfil,editField,editVal,setEditVal,onEdit,onCommit,bgPattern}){
  const img=slide.bgImage,pos=slide.imgPos||"bottom",off=slide.imgOffsetY||0,offX=slide.imgOffsetX||0;
  const ms=Math.max(1.2,slide.imgScale||1);
  const base=`${(1-ms)*50}%`;
  const bandImgStyle={position:"absolute",width:`${ms*100}%`,height:`${ms*100}%`,objectFit:"cover",top:`calc(${base} + ${-off}px)`,left:`calc(${base} + ${-offX}px)`};
  return(
    <div style={{...TW.card,position:"relative",overflow:"hidden"}}>
      {/* fundo quando bg */}
      {img&&pos==="bg"&&<>
        <div style={{position:"absolute",inset:0,overflow:"hidden"}}>
          <img src={img} alt="" style={{...bandImgStyle,opacity:.12}}/>
        </div>
        <div style={{position:"absolute",inset:0,background:"rgba(255,255,255,0.88)"}}/>
      </>}
      <div style={{...TW.top,position:"relative",zIndex:1}}>
        <div style={{...TW.avatar,backgroundImage:`url(${perfil})`,backgroundSize:"cover",backgroundPosition:"center"}}/>
        <div>
          <div style={TW.name}>{NOME} <span style={{color:C.purple}}>✦</span></div>
          <div style={{...TW.handle,display:"flex",alignItems:"center",gap:4}}>
            {slide.icon&&<Icon name={slide.icon} size={11} color={C.purple} style={{opacity:.7}}/>}
            {HANDLE}
          </div>
        </div>
      </div>
      {/* imagem cima */}
      {img&&pos==="top"&&<div style={{marginBottom:10,borderRadius:10,overflow:"hidden",height:slide.imgBandH||100,position:"relative",zIndex:1}}>
        <img src={img} alt="" style={bandImgStyle}/>
      </div>}
      <EditableText text={slide.titulo} destaque={slide.destaque} size={17} color="#0f1419" accent={C.purple} bold={true} field="titulo" slideIdx={idx} editField={editField} editVal={editVal} setEditVal={setEditVal} onEdit={onEdit} onCommit={onCommit} style={{...TW.body,position:"relative",zIndex:1}}/>
      {slide.corpo&&<EditableText text={slide.corpo} size={14} color="#0f1419" bold={false} lh={1.45} field="corpo" slideIdx={idx} editField={editField} editVal={editVal} setEditVal={setEditVal} onEdit={onEdit} onCommit={onCommit} style={{...TW.sub,position:"relative",zIndex:1}}/>}
      {slide.punchline&&<EditableText text={slide.punchline} size={13} color="#0f1419" bold={true} field="punchline" slideIdx={idx} editField={editField} editVal={editVal} setEditVal={setEditVal} onEdit={onEdit} onCommit={onCommit} style={{...TW.quote,position:"relative",zIndex:1}}/>}
      {/* imagem baixo */}
      {img&&pos==="bottom"&&<div style={{marginTop:10,borderRadius:10,overflow:"hidden",height:slide.imgBandH||100,flexShrink:0,position:"relative",zIndex:1}}>
        <img src={img} alt="" style={bandImgStyle}/>
      </div>}
      <div style={{flex:1,position:"relative",zIndex:1}}/>
      <div style={{...TW.foot,position:"relative",zIndex:1}}>{pg(idx,total)}</div>
    </div>
  );
}


function TypoPanel({slide,idx,setSlides}){
  const t=slide.typo||{ts:20,tw:700,bs:12,bw:400,blh:1.5,ps:12,pw:700};
  const upd=(k,v)=>setSlides(p=>p.map((s,i)=>i===idx?{...s,typo:{...s.typo,[k]:v}}:s));
  const row=(label,field,min,max,step,isWeight)=>(
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
      <span style={{fontSize:10,color:C.dim,width:90,flexShrink:0}}>{label}</span>
      {isWeight
        ?<div style={{display:"flex",gap:4}}>
          {[400,500,700].map(w=><button key={w} onClick={()=>upd(field,w)} style={{background:t[field]===w?C.green:"transparent",color:t[field]===w?C.black:C.white,border:"1px solid "+(t[field]===w?C.green:C.line),borderRadius:6,padding:"3px 8px",fontFamily:MONO,fontSize:10,cursor:"pointer"}}>{w}</button>)}
        </div>
        :<><input type="range" min={min} max={max} step={step} value={t[field]} onChange={e=>upd(field,Number(e.target.value))} style={{flex:1,accentColor:C.green}}/><span style={{fontSize:10,color:C.white,minWidth:28}}>{t[field]}</span></>
      }
    </div>
  );
  return(
    <div style={{background:C.panel,border:"1px solid "+C.line,borderRadius:11,padding:12}}>
      <div style={{fontSize:10,letterSpacing:"0.1em",color:C.dim,marginBottom:10}}>TIPOGRAFIA · slide {idx+1}</div>
      <div style={{fontSize:10,color:C.green,marginBottom:4}}>Titulo</div>
      {row("Tamanho","ts",14,40,1,false)}
      {row("Peso","tw",400,700,100,true)}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
        <span style={{fontSize:10,color:C.dim,width:90,flexShrink:0}}>Destaque</span>
        <input value={slide.destaque||""} onChange={e=>setSlides(p=>p.map((s,i)=>i===idx?{...s,destaque:e.target.value}:s))}
          placeholder="palavra exata do titulo" style={{flex:1,background:C.panel2,border:"1px solid "+C.line,borderRadius:6,color:C.white,fontFamily:MONO,fontSize:11,padding:"4px 8px",outline:"none"}}/>
        {slide.destaque&&<button onClick={()=>setSlides(p=>p.map((s,i)=>i===idx?{...s,destaque:""}:s))} style={{background:"transparent",color:C.dim,border:"1px solid "+C.line,borderRadius:5,padding:"2px 6px",fontSize:10,cursor:"pointer"}}>x</button>}
      </div>
      <div style={{fontSize:10,color:C.green,marginBottom:4,marginTop:6}}>Corpo</div>
      {row("Tamanho","bs",10,22,1,false)}
      {row("Peso","bw",400,700,100,true)}
      {row("Line height","blh",1.2,2.2,0.05,false)}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
        <span style={{fontSize:10,color:C.dim,width:90,flexShrink:0}}>Destaque</span>
        <input value={slide.corpoDestaque||""} onChange={e=>setSlides(p=>p.map((s,i)=>i===idx?{...s,corpoDestaque:e.target.value}:s))}
          placeholder="trecho exato do corpo" style={{flex:1,background:C.panel2,border:"1px solid "+C.line,borderRadius:6,color:C.white,fontFamily:MONO,fontSize:11,padding:"4px 8px",outline:"none"}}/>
        {slide.corpoDestaque&&<button onClick={()=>setSlides(p=>p.map((s,i)=>i===idx?{...s,corpoDestaque:""}:s))} style={{background:"transparent",color:C.dim,border:"1px solid "+C.line,borderRadius:5,padding:"2px 6px",fontSize:10,cursor:"pointer"}}>x</button>}
      </div>
      <div style={{fontSize:10,color:C.green,marginBottom:4,marginTop:6}}>Punchline</div>
      {row("Tamanho","ps",10,22,1,false)}
      {row("Peso","pw",400,700,100,true)}
    </div>
  );
}

// ===== ESTILOS =====
const St={
  root:{minHeight:"100vh",background:C.black,color:C.white,fontFamily:MONO,padding:"16px 20px 40px"},
  header:{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:14,borderBottom:`1px solid ${C.line}`,marginBottom:14},
  brand:{fontSize:13,fontWeight:700,letterSpacing:"0.04em"},
  brandSub:{fontSize:11,color:C.dim,marginTop:2},
  grid:{display:"grid",gridTemplateColumns:"minmax(260px,360px) 1fr",gap:20,alignItems:"start"},
  left:{display:"flex",flexDirection:"column",gap:12},
  right:{display:"flex",flexDirection:"column",gap:11},
  card:{background:C.panel,border:`1px solid ${C.line}`,borderRadius:13,padding:15},
  step:{fontSize:11,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:7},
  stepNum:{color:C.green,fontWeight:700},
  lab:{fontSize:11,color:C.dim,marginBottom:4},
  textarea:{width:"100%",background:C.panel2,border:`1px solid ${C.line}`,borderRadius:8,color:C.white,fontFamily:MONO,fontSize:14,padding:10,resize:"vertical",boxSizing:"border-box",marginBottom:4},
  input:{width:"100%",background:C.panel2,border:`1px solid ${C.line}`,borderRadius:8,color:C.white,fontFamily:MONO,fontSize:14,padding:"9px 11px",boxSizing:"border-box"},
  btnPrimary:{width:"100%",background:C.green,color:C.black,border:"none",borderRadius:8,padding:"11px 14px",fontFamily:MONO,fontSize:14,fontWeight:700,cursor:"pointer"},
  btnGhost:{background:"transparent",color:C.white,border:`1px solid ${C.line}`,borderRadius:7,padding:"7px 12px",fontFamily:MONO,fontSize:13,cursor:"pointer"},
  ideia:{textAlign:"left",border:"1px solid",borderRadius:8,padding:"10px 12px",cursor:"pointer",fontFamily:MONO,color:C.white},
  ideiaTit:{fontSize:13,fontWeight:700,marginBottom:3,lineHeight:1.3},
  ideiaAng:{fontSize:11,color:C.dim,lineHeight:1.4},
  targetRow:{display:"flex",gap:6,marginBottom:8},
  targetBtn:{flex:1,border:`1px solid ${C.line}`,borderRadius:7,padding:"6px 10px",fontFamily:MONO,fontSize:12,fontWeight:700,cursor:"pointer"},
  chatLog:{maxHeight:90,overflowY:"auto",marginBottom:8,display:"flex",flexDirection:"column",gap:4},
  chatMsg:{fontSize:11,lineHeight:1.4},
  erro:{background:"rgba(137,40,255,0.12)",border:`1px solid ${C.purple}`,borderRadius:8,padding:10,fontSize:13},
  previewBar:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8},
  styleSwitch:{display:"inline-flex",background:C.panel,border:`1px solid ${C.line}`,borderRadius:8,padding:3,gap:3},
  styleBtn:{border:"none",borderRadius:6,padding:"6px 10px",fontFamily:MONO,fontSize:13,fontWeight:700,cursor:"pointer"},
  stage:{display:"flex",justifyContent:"center",alignItems:"center",minHeight:440,background:C.panel,border:`1px solid ${C.line}`,borderRadius:13,padding:18},
  placeholder:{color:C.dim,fontSize:12,textAlign:"center",maxWidth:280},
  nav:{display:"flex",alignItems:"center",justifyContent:"center",gap:13},
  navBtn:{background:C.panel,color:C.white,border:`1px solid ${C.line}`,borderRadius:7,width:36,height:33,fontSize:14,cursor:"pointer"},
  dots:{display:"flex",gap:6},dot:{width:7,height:7,borderRadius:"50%",cursor:"pointer"},
  slideTools:{display:"flex",gap:6,justifyContent:"center",flexWrap:"wrap"},
  uploadBtn:{background:"transparent",color:C.green,border:`1px solid ${C.green}`,borderRadius:7,padding:"5px 10px",fontFamily:MONO,fontSize:12,cursor:"pointer"},
  removeImg:{background:"transparent",color:C.dim,border:`1px solid ${C.line}`,borderRadius:7,padding:"5px 10px",fontFamily:MONO,fontSize:12,cursor:"pointer"},
  posBtn:{background:"transparent",color:C.dim,border:`1px solid ${C.line}`,borderRadius:7,padding:"5px 10px",fontFamily:MONO,fontSize:12,cursor:"pointer"},
  promptBox:{background:C.panel,border:`1px solid ${C.line}`,borderRadius:10,padding:11},
  promptHead:{fontSize:11,letterSpacing:"0.1em",color:C.dim,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"},
  promptTxt:{fontSize:12,lineHeight:1.5,color:"rgba(255,255,255,0.85)"},
  copyMini:{background:"transparent",color:C.green,border:`1px solid ${C.green}`,borderRadius:5,padding:"2px 8px",fontSize:11,fontFamily:MONO,cursor:"pointer"},
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
html{background:#000;overflow-x:hidden;}
body{background:#000;margin:0;padding:0;overflow-x:hidden;}
#root{background:#000;min-height:100vh;}
button:disabled{opacity:0.45;cursor:not-allowed;}
select{appearance:none;}
input[type=range]{height:4px;}
textarea:focus,input:focus,button:focus-visible,select:focus{outline:2px solid ${C.green};outline-offset:1px;}
@media(max-width:820px){.__grid{grid-template-columns:1fr!important;}}
`;
