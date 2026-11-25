import {useEffect,useRef,useState} from 'react'
// Dropdown kustom dengan animasi meluncur; mendukung keyboard (panah, Enter, Escape)
export default function GlideSelect({label,items,value,onChange,noneLabel}){
  const [o,setO]=useState(false),box=useRef()
  const opts=[{n:noneLabel,c:[]},...items],sel=value+1,[a,setA]=useState(sel)
  useEffect(()=>{
    if(!o)return
    const h=e=>{if(!box.current.contains(e.target))setO(false)}
    addEventListener('pointerdown',h);return()=>removeEventListener('pointerdown',h)},[o])
  const pick=i=>{onChange(i-1);setO(false)}
  const open=()=>{setA(sel);setO(true)}
  const key=e=>{
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!o)return open()
      setA(Math.max(0,Math.min(opts.length-1,a+(e.key==='ArrowDown'?1:-1))))}
    else if((e.key==='Enter'||e.key===' ')&&o){e.preventDefault();pick(a)}
    else if(e.key==='Escape')setO(false)}
  return<div className={'gs'+(o?' open':'')} ref={box}>
    <button type="button" className="gs-btn" role="combobox" aria-haspopup="listbox" aria-expanded={o} aria-controls="gs-l"
      aria-label={label} aria-activedescendant={o?'gs-o'+a:undefined} onClick={()=>o?setO(false):open()} onKeyDown={key}>
      <span>{opts[sel].n}</span><span className="dots">{opts[sel].c.map(h=><i key={h} style={{background:h}}/>)}</span></button>
    <ul id="gs-l" className="gs-list" role="listbox" aria-label={label}>
      {opts.map((f,i)=><li key={i} id={'gs-o'+i} role="option" aria-selected={i===sel} className={'gs-opt'+(i===a?' act':'')}
        onClick={()=>pick(i)} onMouseEnter={()=>setA(i)}><span>{f.n}</span><span className="dots">{f.c.map(h=><i key={h} style={{background:h}}/>)}</span></li>)}</ul>
  </div>
}
