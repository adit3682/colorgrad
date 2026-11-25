// Satu kartu sorotan: miring mengikuti kursor dengan kilau holografik
export default function HoloCard({children}){
  const mv=e=>{const c=e.currentTarget,b=c.getBoundingClientRect(),x=(e.clientX-b.left)/b.width,y=(e.clientY-b.top)/b.height
    c.style.setProperty('--px',x*100+'%');c.style.setProperty('--py',y*100+'%')
    c.style.setProperty('--ry',(x-.5)*16+'deg');c.style.setProperty('--rx',(.5-y)*16+'deg')}
  const lv=e=>{e.currentTarget.style.setProperty('--rx','0deg');e.currentTarget.style.setProperty('--ry','0deg')}
  return<div className="holo" onPointerMove={mv} onPointerLeave={lv}>{children}</div>
}
