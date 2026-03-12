'use client';
import { useState, useEffect, useRef } from 'react';

const C = { gold:'#F5A623',orange:'#E8630A',red:'#D63C2A',violet:'#7B5EA7',blue:'#2D6BE4',green:'#1A9641',white:'#F8F4EC',black:'#0A0A0A' };

function PixelGrid() {
  const [pixels,setPixels] = useState(()=>Array.from({length:100},()=>{const w=['black','black','black','black','black','gold','orange','red','violet','blue','green'];return w[Math.floor(Math.random()*w.length)];}));
  useEffect(()=>{const iv=setInterval(()=>{setPixels(p=>{const n=[...p];n[Math.floor(Math.random()*n.length)]=['black','black','black','black','gold','orange','red','violet','blue','green'][Math.floor(Math.random()*10)];return n;});},180);return()=>clearInterval(iv);},[]);
  return <div style={{display:'grid',gridTemplateColumns:'repeat(10,1fr)',gap:'2px',width:'80px',height:'80px',flexShrink:0}}>{pixels.map((c,i)=><div key={i} style={{background:C[c],width:'100%',aspectRatio:'1',transition:'background 0.3s'}}/>)}</div>;
}

function TypewriterText({text,onDone}){
  const[d,setD]=useState('');const[done,setDone]=useState(false);const idx=useRef(0);
  useEffect(()=>{setD('');setDone(false);idx.current=0;const iv=setInterval(()=>{if(idx.current<text.length){setD(text.slice(0,idx.current+1));idx.current++;}else{clearInterval(iv);setDone(true);onDone?.();}},10);return()=>clearInterval(iv);},[text]);
  return <span style={{whiteSpace:'pre-wrap',lineHeight:1.7}}>{d}{!done&&<span style={{animation:'blink 1s infinite',color:C.gold}}>▊</span>}</span>;
}

function Message({msg,isLast}){
  const isA=msg.role==='assistant';const[typed,setTyped]=useState(!isLast||!isA);
  return <div style={{display:'flex',gap:'14px',alignItems:'flex-start',padding:'18px 0',borderBottom:'1px solid rgba(245,166,35,0.08)',animation:'fadeUp 0.4s ease'}}>
    {isA?<div style={{width:'36px',height:'36px',flexShrink:0,background:'linear-gradient(135deg,#F5A623,#E8630A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',fontWeight:'bold',color:'#0A0A0A',fontFamily:'monospace',clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)'}}>A</div>
    :<div style={{width:'36px',height:'36px',flexShrink:0,border:'1px solid rgba(245,166,35,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',color:'rgba(248,244,236,0.4)',fontFamily:'monospace'}}>YOU</div>}
    <div style={{flex:1,fontFamily:'monospace',fontSize:'13px',color:isA?C.white:'rgba(248,244,236,0.7)',letterSpacing:'0.02em',lineHeight:1.7}}>
      {isA&&isLast&&!typed?<TypewriterText text={msg.content} onDone={()=>setTyped(true)}/>:<span style={{whiteSpace:'pre-wrap'}}>{msg.content}</span>}
    </div>
  </div>;
}

const QA=[
  {label:'▸ Weekly Briefing',prompt:"Give me this week's Aurora Briefing with all 3 deliverables."},
  {label:'◆ Outreach Batch',prompt:'Generate 5 outreach messages ready to send this week.'},
  {label:'◈ Gallery Pitch',prompt:'Write a tailored pitch for SuperRare and fx(hash) galleries.'},
  {label:'◉ Museum Pitch',prompt:'Write a tailored pitch for a contemporary museum seeking Web3 positioning.'},
];

export default function App(){
  const[msgs,setMsgs]=useState([]);const[inp,setInp]=useState('');const[loading,setLoading]=useState(false);const[started,setStarted]=useState(false);const bottom=useRef(null);
  useEffect(()=>{bottom.current?.scrollIntoView({behavior:'smooth'});},[msgs,loading]);

  const send=async(text)=>{
    const m=text||inp.trim();if(!m||loading)return;
    setInp('');setStarted(true);
    const nm=[...msgs,{role:'user',content:m}];setMsgs(nm);setLoading(true);
    try{
      const res=await fetch('/api/aurora',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:nm})});
      const data=await res.json();
      setMsgs([...nm,{role:'assistant',content:data.content?.[0]?.text||'— signal lost —'}]);
    }catch{setMsgs([...nm,{role:'assistant',content:'— connection error —'}]);}
    finally{setLoading(false);}
  };

  const btnStyle=(hover)=>({background:hover?'rgba(245,166,35,0.12)':'rgba(245,166,35,0.06)',border:'1px solid '+(hover?'rgba(245,166,35,0.5)':'rgba(245,166,35,0.2)'),color:hover?C.white:'rgba(248,244,236,0.7)',padding:'14px 16px',fontSize:'11px',letterSpacing:'0.08em',cursor:'pointer',textAlign:'left',fontFamily:'monospace',transition:'all 0.2s'});

  return <>
    <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:0.6}50%{opacity:1}}*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(245,166,35,0.3)}textarea{resize:none}textarea:focus{outline:none}textarea::placeholder{color:rgba(248,244,236,0.25)}`}</style>
    <div style={{minHeight:'100vh',background:'#0A0A0A',display:'flex',flexDirection:'column',fontFamily:'monospace',color:C.white}}>
      <div style={{borderBottom:'1px solid rgba(245,166,35,0.2)',padding:'20px 32px',display:'flex',alignItems:'center',gap:'20px',background:'rgba(245,166,35,0.02)',position:'sticky',top:0,zIndex:10}}>
        <PixelGrid/>
        <div style={{flex:1}}>
          <div style={{fontSize:'22px',fontWeight:'bold',letterSpacing:'0.15em',color:C.gold}}>AURORA</div>
          <div style={{fontSize:'10px',letterSpacing:'0.2em',color:'rgba(245,166,35,0.5)',marginTop:'2px'}}>STRATEGIC CULTURE OPERATOR · DRAW BITCOIN</div>
        </div>
        <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'4px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'6px'}}><div style={{width:'6px',height:'6px',borderRadius:'50%',background:'#1A9641',animation:'pulse 2s infinite'}}/><span style={{fontSize:'10px',color:'rgba(248,244,236,0.3)',letterSpacing:'0.1em'}}>LIVE</span></div>
          <div style={{fontSize:'9px',color:'rgba(245,166,35,0.4)',letterSpacing:'0.1em'}}>PRE-LAUNCH · 8 BTC RAISE</div>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:'24px 32px',maxWidth:'860px',width:'100%',margin:'0 auto',alignSelf:'stretch'}}>
        {!started&&<div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'50vh',gap:'32px',animation:'fadeUp 0.6s ease'}}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:'11px',letterSpacing:'0.3em',color:'rgba(245,166,35,0.5)',marginBottom:'12px'}}>NEW MONEY. NEW ART.</div>
            <div style={{fontSize:'32px',fontWeight:'bold',color:C.gold,letterSpacing:'0.05em',lineHeight:1.2}}>Your Culture Intelligence<br/><span style={{color:C.white}}>is ready.</span></div>
            <div style={{fontSize:'12px',color:'rgba(248,244,236,0.35)',marginTop:'12px'}}>Aurora connects Draw Bitcoin to galleries, museums & OG artists.</div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',width:'100%',maxWidth:'480px'}}>
            {QA.map(a=>{const[h,setH]=useState(false);return <button key={a.label} onClick={()=>send(a.prompt)} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={btnStyle(h)}>{a.label}</button>;})}
          </div>
        </div>}
        {msgs.map((m,i)=><Message key={i} msg={m} isLast={i===msgs.length-1}/>)}
        {loading&&<div style={{display:'flex',gap:'14px',alignItems:'flex-start',padding:'18px 0'}}>
          <div style={{width:'36px',height:'36px',flexShrink:0,background:'linear-gradient(135deg,#F5A623,#E8630A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'16px',fontWeight:'bold',color:'#0A0A0A',clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)'}}>A</div>
          <div style={{display:'flex',gap:'6px',alignItems:'center',paddingTop:'10px'}}>{[0,1,2].map(i=><div key={i} style={{width:'6px',height:'6px',background:C.gold,animation:`pulse 1s infinite ${i*0.2}s`}}/>)}</div>
        </div>}
        <div ref={bottom}/>
      </div>
      {started&&<div style={{borderTop:'1px solid rgba(245,166,35,0.08)',padding:'10px 32px',display:'flex',gap:'8px',overflowX:'auto'}}>
        {QA.map(a=><button key={a.label} onClick={()=>send(a.prompt)} style={{background:'transparent',border:'1px solid rgba(245,166,35,0.2)',color:'rgba(248,244,236,0.4)',padding:'6px 12px',fontSize:'10px',cursor:'pointer',whiteSpace:'nowrap',fontFamily:'monospace',transition:'all 0.2s'}} onMouseEnter={e=>{e.currentTarget.style.color=C.gold;e.currentTarget.style.borderColor='rgba(245,166,35,0.5)';}} onMouseLeave={e=>{e.currentTarget.style.color='rgba(248,244,236,0.4)';e.currentTarget.style.borderColor='rgba(245,166,35,0.2)';}}>{a.label}</button>)}
      </div>}
      <div style={{borderTop:'1px solid rgba(245,166,35,0.15)',padding:'20px 32px',background:'#0A0A0A'}}>
        <div style={{maxWidth:'860px',margin:'0 auto'}}>
          <div style={{display:'flex',gap:'12px',alignItems:'flex-end',border:'1px solid rgba(245,166,35,0.25)',padding:'14px 16px',background:'rgba(245,166,35,0.03)'}}>
            <textarea value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Ask Aurora for a briefing, outreach, pitch..." rows={2} style={{flex:1,background:'transparent',border:'none',color:C.white,fontSize:'13px',fontFamily:'monospace',letterSpacing:'0.02em',lineHeight:1.6}}/>
            <button onClick={()=>send()} disabled={loading||!inp.trim()} style={{background:loading||!inp.trim()?'rgba(245,166,35,0.15)':'linear-gradient(135deg,#F5A623,#E8630A)',border:'none',color:loading||!inp.trim()?'rgba(245,166,35,0.3)':'#0A0A0A',width:'36px',height:'36px',cursor:loading||!inp.trim()?'default':'pointer',fontSize:'16px',fontWeight:'bold',flexShrink:0}}>▸</button>
          </div>
          <div style={{fontSize:'9px',color:'rgba(248,244,236,0.2)',marginTop:'8px',letterSpacing:'0.1em'}}>ENTER to send · SHIFT+ENTER new line · All outputs in BTC</div>
        </div>
      </div>
    </div>
  </>;
}