import {useEffect,useState} from 'react'
import Menu from './components/Menu.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Studio from './pages/Studio.jsx'
const page=()=>location.hash.slice(1)||'beranda'
export default function App(){
  const [h,setH]=useState(page())
  useEffect(()=>{
    const on=()=>{setH(page())
      if(page()==='tentang')setTimeout(()=>document.getElementById('tentang')?.scrollIntoView({behavior:'smooth'}),0)
      else scrollTo(0,0)}
    addEventListener('hashchange',on);return()=>removeEventListener('hashchange',on)},[])
  return<><Menu/>{h==='studio'?<Studio/>:<Home/>}<Footer/></>
}
