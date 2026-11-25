import {useEffect,useRef} from 'react'
import {rgb} from '../grading/palette.js'
const CH=' .:-=+*#%@',CS=14
const mix=(a,b,t)=>a.map((v,i)=>Math.round(v+(b[i]-v)*t))
const C1=rgb('#eaff00'),C2=rgb('#ff31dd'),C3=rgb('#e68b5a')
export default function AsciiBackground(){
  const ref=useRef()
  useEffect(()=>{
    const ac=ref.current,ax=ac.getContext('2d');let t=0,last=0,vis=true,raf
    const RM=matchMedia('(prefers-reduced-motion:reduce)').matches
    const frame=()=>{const w=ac.clientWidth,h=ac.clientHeight
      if(ac.width!==w||ac.height!==h){ac.width=w;ac.height=h}
      ax.clearRect(0,0,w,h);ax.font=CS+'px ui-monospace,Menlo,monospace';ax.textBaseline='top'
      for(let y=0;y<h;y+=CS)for(let x=0;x<w;x+=CS*.62){
        const u=x/w,v=(Math.sin(u*6+t)+Math.sin(y*.012-t*.8)+Math.sin((u+y/h)*5+t*.5)+3)/6
        const col=u<.5?mix(C1,C2,u*2):mix(C2,C3,(u-.5)*2)
        ax.fillStyle=`rgba(${col},${.15+v*.55})`;ax.fillText(CH[Math.min(9,Math.floor(v*10))],x,y)}}
    const loop=ms=>{if(vis&&ms-last>50){t+=.05;last=ms;frame()}raf=requestAnimationFrame(loop)}
    const io=new IntersectionObserver(e=>{vis=e[0].isIntersecting});io.observe(ac)
    frame();if(!RM)raf=requestAnimationFrame(loop)
    const rs=()=>frame();addEventListener('resize',rs)
    return()=>{cancelAnimationFrame(raf);io.disconnect();removeEventListener('resize',rs)}
  },[])
  return<canvas id="ascii" ref={ref} aria-hidden="true"/>
}
