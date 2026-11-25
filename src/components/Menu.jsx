import {useEffect,useState} from 'react'
const LINKS=[['Beranda','beranda'],['Studio','studio'],['Tentang','tentang']]
export default function Menu(){
  const [o,setO]=useState(false)
  useEffect(()=>{const c=()=>setO(false);addEventListener('hashchange',c);return()=>removeEventListener('hashchange',c)},[])
  return<>
    <header><a className="logo" href="#beranda">ColorGrad</a>
      <button id="mb" aria-expanded={o} aria-controls="menu" onClick={()=>setO(!o)}>{o?'Tutup':'Menu'}</button></header>
    <nav id="menu" className={o?'open':''} aria-label="Navigasi">
      {LINKS.map(([t,h],i)=><a key={h} href={'#'+h} style={{transitionDelay:(.12+i*.08)+'s'}}>{t}</a>)}</nav></>
}
