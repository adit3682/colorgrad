import {useEffect,useState} from 'react'
import {useI18n} from '../i18n/index.jsx'
const LINKS=[['menu.home','beranda'],['menu.studio','studio'],['menu.about','tentang']]
export default function Menu(){
  const {t,lang,setLang}=useI18n(),[o,setO]=useState(false)
  useEffect(()=>{const c=()=>setO(false);addEventListener('hashchange',c);return()=>removeEventListener('hashchange',c)},[])
  return<>
    <header><a className="logo" href="#beranda">ColorGrad</a>
      <div className="hr"><button id="lg" aria-label={t('lang.switch')} onClick={()=>setLang(lang==='id'?'en':'id')}>{lang==='id'?'EN':'ID'}</button>
        <button id="mb" aria-expanded={o} aria-controls="menu" onClick={()=>setO(!o)}>{t(o?'menu.close':'menu.open')}</button></div></header>
    <nav id="menu" className={o?'open':''} aria-label={t('nav.label')}>
      {LINKS.map(([k,h],i)=><a key={h} href={'#'+h} style={{transitionDelay:(.12+i*.08)+'s'}}>{t(k)}</a>)}</nav></>
}
