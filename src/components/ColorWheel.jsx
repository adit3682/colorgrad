import {useEffect,useRef} from 'react'
const S=120
export default function ColorWheel({id,label,brightLabel,v,onChange}){
  const c=useRef(),drag=useRef(false),D=window.devicePixelRatio||1
  useEffect(()=>{
    const x=c.current.getContext('2d'),R=S/2
    x.setTransform(D,0,0,D,0,0);x.clearRect(0,0,S,S)
    const g=x.createConicGradient(0,R,R)
    ;[['#f00',0],['#f0f',.167],['#00f',.333],['#0ff',.5],['#0f0',.667],['#ff0',.833],['#f00',1]].forEach(([a,b])=>g.addColorStop(b,a))
    x.beginPath();x.arc(R,R,R-6,0,7);x.fillStyle=g;x.fill()
    const rg=x.createRadialGradient(R,R,0,R,R,R-6);rg.addColorStop(0,'#888');rg.addColorStop(1,'#8880');x.fillStyle=rg;x.fill()
    x.beginPath();x.arc(R+v.x*(R-6),R-v.y*(R-6),6,0,7);x.fillStyle='#fff';x.fill();x.lineWidth=2;x.strokeStyle='#000';x.stroke()
  },[v.x,v.y,D])
  const move=e=>{const b=c.current.getBoundingClientRect(),R=b.width/2
    const x=(e.clientX-b.left-R)/(R-6),y=-(e.clientY-b.top-R)/(R-6),n=Math.hypot(x,y)||1,q=Math.min(1,n)/n
    onChange({...v,x:x*q,y:y*q})}
  return<div>
    <canvas ref={c} id={id} width={S*D} height={S*D} aria-label={label}
      onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);drag.current=true;move(e)}}
      onPointerMove={e=>drag.current&&move(e)} onPointerUp={()=>{drag.current=false}}
      onDoubleClick={()=>onChange({...v,x:0,y:0})}/>
    <label>{label}</label>
    <input type="range" min="-1" max="1" step=".01" value={v.m} aria-label={brightLabel}
      onChange={e=>onChange({...v,m:+e.target.value})}/>
  </div>
}
