import {createContext,useContext,useEffect,useState} from 'react'
import id from './id.json'
import en from './en.json'
const D={id,en},Ctx=createContext(null)
const initial=()=>{try{const l=localStorage.getItem('cg-lang');if(D[l])return l}catch(e){}return'id'}
export function I18nProvider({children}){
  const [lang,setLang]=useState(initial)
  useEffect(()=>{document.documentElement.lang=lang;try{localStorage.setItem('cg-lang',lang)}catch(e){}},[lang])
  const t=(k,v={})=>(D[lang][k]??D.id[k]??k).replace(/\{(\w+)\}/g,(_,n)=>v[n]??'')
  return<Ctx.Provider value={{lang,setLang,t}}>{children}</Ctx.Provider>
}
export const useI18n=()=>useContext(Ctx)
