import {useState} from 'react'
// Satu item aktif melebar; klik item lain untuk berpindah. Gambar masih penampung abu-abu.
export default function FlexCarousel({items,title,ph,use,onUse}){
  const [a,setA]=useState(0)
  return<div className="fc" role="group" aria-label={title}>{items.map((f,i)=>
    <div key={f.n} className={'fi'+(i===a?' on':'')}>
      <button type="button" className="fb" aria-pressed={i===a} aria-label={f.n} onClick={()=>setA(i)}>
        <span>{ph} {i+1}</span><span className="cap">{f.n}<span className="dots">{f.c.map(h=><i key={h} style={{background:h}}/>)}</span></span></button>
      {i===a&&<button type="button" className="btn fu" onClick={()=>onUse(i)}>{use}</button>}</div>)}</div>
}
