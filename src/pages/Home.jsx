import AsciiBackground from '../components/AsciiBackground.jsx'
import GradualBlur from '../components/GradualBlur.jsx'
import ChromaGrid from '../components/ChromaGrid.jsx'
import HoloCard from '../components/HoloCard.jsx'
import {useI18n} from '../i18n/index.jsx'
export default function Home(){
  const {t}=useI18n()
  return<section id="home">
    <div id="hero"><AsciiBackground/><GradualBlur/>
      <h1>{t('home.h1')}</h1><p>{t('home.p')}</p>
      <div><a className="btn" href="#studio">{t('home.cta')}</a></div></div>
    <div className="sec"><h2>{t('home.h2')}</h2>
      <div className="cards">{[1,2,3].map(n=>
        <div key={n} className={'card'+(n===3?' hot':'')}><span className="n">{n}</span><h3>{t('step'+n+'.t')}</h3><p>{t('step'+n+'.d')}</p></div>)}</div></div>
    <div className="sec"><h2>{t('feat.h2')}</h2>
      <ChromaGrid items={[1,2,3,4].map(n=>[t('feat'+n+'.t'),t('feat'+n+'.d')])}/></div>
    <div className="sec"><div className="holo-sec">
      <div className="tx"><h2>{t('holo.h2')}</h2><p>{t('holo.d')}</p><a className="btn" href="#studio">{t('home.cta')}</a></div>
      <HoloCard><span className="badge">{t('holo.badge')}</span>
        <pre>{'TITLE "ColorGrad"\nLUT_3D_SIZE 33\nDOMAIN_MIN 0 0 0\nDOMAIN_MAX 1 1 1\n0.000000 0.000000 0.000000\n0.012431 0.003112 0.020884\n…'}</pre></HoloCard></div></div>
  </section>
}
