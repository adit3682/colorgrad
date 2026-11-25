import {useEffect,useMemo,useState} from 'react'
import films from '../data/film-palettes.json'
import ColorWheel from '../components/ColorWheel.jsx'
import GlideSelect from '../components/GlideSelect.jsx'
import LatticeLoader from '../components/LatticeLoader.jsx'
import FlexCarousel from '../components/FlexCarousel.jsx'
import GlPreview from '../components/GlPreview.jsx'
import {emptyW} from '../grading/grade.js'
import {kmeans,hex,refWheels} from '../grading/palette.js'
import {buildCube} from '../grading/lut.js'
import {useI18n} from '../i18n/index.jsx'
const KEYS=['lift','gamma','gain']
const LAB={lift:'Lift (shadows)',gamma:'Gamma (midtones)',gain:'Gain (highlights)'}
const TABS=[['CapCut','capcut'],['Premiere Pro','premiere'],['DaVinci Resolve','davinci']]
const Strip=({cols})=><div className="strip">{cols.map((c,i)=>{const h=hex(c);return<div key={i} style={{background:h}}><span>{h}</span></div>})}</div>
function demoImage(){
  const c=document.createElement('canvas');c.width=960;c.height=540;const x=c.getContext('2d')
  const g=x.createLinearGradient(0,0,0,540);g.addColorStop(0,'#6fa8dc');g.addColorStop(.55,'#f3d9b1');g.addColorStop(.56,'#4f7a4a');g.addColorStop(1,'#243d2a')
  x.fillStyle=g;x.fillRect(0,0,960,540);x.fillStyle='#fff4d0';x.beginPath();x.arc(720,170,48,0,7);x.fill()
  x.fillStyle='#7a5a3a';x.fillRect(180,300,120,90);x.fillStyle='#b0443a';x.beginPath();x.moveTo(165,300);x.lineTo(240,240);x.lineTo(315,300);x.fill()
  return c.toDataURL('image/png')
}
export default function Studio(){
  const {t}=useI18n()
  const [frame,setFrame]=useState(null),[W,setW]=useState(emptyW()),[ref,setRef]=useState(-1),[str,setStr]=useState(60)
  const [split,setSplit]=useState(50),[fp,setFp]=useState([]),[notes,setNotes]=useState([]),[cube,setCube]=useState('')
  const [loading,setLoading]=useState(false),[busy,setBusy]=useState(false),[tab,setTab]=useState('capcut'),[over,setOver]=useState(false)
  const has=!!frame
  const load=src=>{setLoading(true);const im=new Image();im.onerror=()=>setLoading(false);im.onload=()=>setTimeout(()=>{
    const w=Math.min(960,im.width),h=Math.round(im.height*w/im.width),c=document.createElement('canvas')
    c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0,w,h)
    setFp(kmeans(x.getImageData(0,0,w,h).data));setCube('');setFrame(c);setLoading(false)},30);im.src=src}
  const read=fl=>{if(!fl||!/^image\/(jpeg|png)$/.test(fl.type))return;const r=new FileReader();r.onload=()=>load(r.result);r.readAsDataURL(fl)}
  useEffect(()=>{ // terapkan referensi
    if(ref<0){setNotes([]);return}
    const r=refWheels(films[ref],str/100*2.2);setW(w=>({...w,...r.wheels}));setNotes(r.notes)
  },[ref,str])
  const pickRef=n=>{setRef(n);if(n<0)setW(emptyW())}
  const reset=()=>{setRef(-1);setW(emptyW())}
  const exportLut=()=>{setBusy(true);setTimeout(()=>{setCube(buildCube(W));setBusy(false)},40)}
  const url=useMemo(()=>cube?URL.createObjectURL(new Blob([cube],{type:'text/plain'})):'',[cube])
  const rp=ref>=0?refWheels(films[ref],0).palette:[]
  const note=n=>n.color?t('note.shift',{k:n.k,tone:n.tone,color:t('color.'+n.color),film:n.film}):t('note.neutral',{k:n.k,tone:n.tone})
  return<section id="studio">
    <div className="grid"><div><div className="panel">
      <div id="stage" onDragOver={e=>{e.preventDefault();setOver(true)}} onDragLeave={()=>setOver(false)}
        onDrop={e=>{e.preventDefault();setOver(false);read(e.dataTransfer.files[0])}}>
        {!has&&!loading&&<div id="drop" className={over?'on':''}><p>{t('drop.text')}</p>
          <label className="btn" tabIndex="0">{t('drop.pick')}<input type="file" accept="image/jpeg,image/png" hidden onChange={e=>read(e.target.files[0])}/></label>{' '}
          <button className="btn alt" onClick={()=>load(demoImage())}>{t('drop.demo')}</button></div>}
        {frame&&<GlPreview source={frame} W={W} split={split}/>}
        {loading&&<div className="ov"><LatticeLoader/><span>{t('loading')}</span></div>}
        {has&&<><span className="tag" style={{left:10,display:'block'}}>{t('before')}</span><span className="tag" style={{right:10,display:'block'}}>{t('after')}</span></>}
      </div>
      {has&&<input id="sp" style={{display:'block'}} type="range" min="0" max="100" value={split} onChange={e=>setSplit(+e.target.value)} aria-label={t('slider')}/>}
      <p className="note">{t('calib')}</p>
      {has&&<div className="strips" style={{display:'block'}}>
        <div className="lab">{t('pal.frame')}</div><Strip cols={fp}/>
        <div className="lab">{ref>=0?t('pal.ref',{film:films[ref].n}):t('pal.none')}</div>{ref>=0&&<Strip cols={rp}/>}</div>}
    </div></div>
    <div className="panel"><h3>{t('refs.title')}</h3>
      <GlideSelect label={t('refs.title')} items={films} value={ref} onChange={pickRef} noneLabel={t('ref.none')}/>
      <label className="lab" htmlFor="str" style={{display:'block',marginTop:12}}>{t('str',{v:str})}</label>
      <input id="str" type="range" min="0" max="100" value={str} onChange={e=>setStr(+e.target.value)} style={{width:'100%',accentColor:'var(--lime)'}}/>
      <h3 style={{marginTop:18}}>{t('wheels')}</h3>
      <div className="wheels">{KEYS.map(k=><ColorWheel key={k} id={'w-'+k} label={LAB[k]} brightLabel={t('bright',{label:LAB[k]})} v={W[k]} onChange={v=>setW(w=>({...w,[k]:v}))}/>)}</div>
      <ul id="why">{notes.map((n,i)=><li key={i}>{note(n)}</li>)}</ul>
      <div className="row"><button className="btn" disabled={!has||busy} onClick={exportLut}>{t('export')}</button>
        <button className="btn alt" disabled={!has} onClick={reset}>{t('reset')}</button></div>
      <p id="st" role="status">{busy?<><LatticeLoader/>{t('busy')}</>:cube?t('done'):''}</p>
      {cube&&<div id="done" style={{display:'block'}}><b>{t('lut.ready')}</b>
        <div className="row" style={{marginTop:8}}><a className="btn" href={url} download="colorgrad-look.cube">{t('lut.dl')}</a></div>
        <div className="tabs" role="tablist">{TABS.map(([n,k])=><button key={k} role="tab" aria-selected={tab===k} onClick={()=>setTab(k)}>{n}</button>)}</div>
        <p id="guide">{t('guide.'+tab)}</p></div>}
    </div></div>
    <div className="panel" style={{marginTop:24}}><h3>{t('carousel.h')}</h3>
      <FlexCarousel items={films.slice(0,5)} title={t('carousel.h')} ph={t('carousel.ph')} use={t('carousel.use')} onUse={pickRef}/></div></section>
}
