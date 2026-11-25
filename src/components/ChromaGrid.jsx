const COLS=['#eaff00','#ff31dd','#e68b5a','#f6ff77']
// Kartu fitur: sorotan warna mengikuti kursor, kartu lain memudar jadi abu-abu saat hover
export default function ChromaGrid({items}){
  const mv=e=>{const c=e.currentTarget,b=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-b.left+'px');c.style.setProperty('--my',e.clientY-b.top+'px')}
  return<div className="cg">{items.map(([t,d],i)=>
    <div key={t} className="cc" onPointerMove={mv} style={{'--c':COLS[i%COLS.length]}}><h3>{t}</h3><p>{d}</p></div>)}</div>
}
