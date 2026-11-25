import {useEffect,useMemo,useState} from 'react'
import films from '../data/film-palettes.json'
import ColorWheel from '../components/ColorWheel.jsx'
import {emptyW} from '../grading/grade.js'
import GlPreview from '../components/GlPreview.jsx'
import {kmeans,hex,refWheels} from '../grading/palette.js'
import {buildCube} from '../grading/lut.js'
const KEYS=['lift','gamma','gain']
const LAB={lift:'Lift (shadows)',gamma:'Gamma (midtones)',gain:'Gain (highlights)'}
const GUIDE={
  'CapCut':'Dukungan LUT bergantung pada versi CapCut dan belum diverifikasi di semua versi. Di versi terbaru, cari opsi impor LUT di bagian Filter atau Adjustment, lalu pilih berkas .cube.',
  'Premiere Pro':'Buka panel Lumetri Color, lalu Creative. Di menu Look pilih Browse, dan pilih berkas .cube.',
  'DaVinci Resolve':'Salin berkas .cube ke folder LUT DaVinci, lalu di halaman Color klik kanan node dan pilih LUT, atau Refresh LUT jika belum muncul.'}
const Strip=({cols})=><div className="strip">{cols.map((c,i)=>{const h=hex(c);return<div key={i} style={{background:h}}><span>{h}</span></div>})}</div>
function demoImage(){
  const c=document.createElement('canvas');c.width=960;c.height=540;const x=c.getContext('2d')
  const g=x.createLinearGradient(0,0,0,540);g.addColorStop(0,'#6fa8dc');g.addColorStop(.55,'#f3d9b1');g.addColorStop(.56,'#4f7a4a');g.addColorStop(1,'#243d2a')
  x.fillStyle=g;x.fillRect(0,0,960,540);x.fillStyle='#fff4d0';x.beginPath();x.arc(720,170,48,0,7);x.fill()
  x.fillStyle='#7a5a3a';x.fillRect(180,300,120,90);x.fillStyle='#b0443a';x.beginPath();x.moveTo(165,300);x.lineTo(240,240);x.lineTo(315,300);x.fill()
  return c.toDataURL('image/png')
}
export default function Studio(){
  const [frame,setFrame]=useState(null)
  const [has,setHas]=useState(false),[W,setW]=useState(emptyW()),[ref,setRef]=useState(-1),[str,setStr]=useState(60)
  const [split,setSplit]=useState(50),[fp,setFp]=useState([]),[notes,setNotes]=useState([]),[cube,setCube]=useState('')
  const [busy,setBusy]=useState(false),[tab,setTab]=useState('CapCut'),[over,setOver]=useState(false)
  const load=src=>{const im=new Image();im.onload=()=>{
    const w=Math.min(960,im.width),h=Math.round(im.height*w/im.width),c=document.createElement('canvas')
    c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0,w,h)
    setFp(kmeans(x.getImageData(0,0,w,h).data));setCube('');setFrame(c);setHas(true)};im.src=src}
  const read=fl=>{if(!fl||!/^image\/(jpeg|png)$/.test(fl.type))return;const r=new FileReader();r.onload=()=>load(r.result);r.readAsDataURL(fl)}
  useEffect(()=>{ // terapkan referensi
    if(ref<0){setNotes([]);return}
    const r=refWheels(films[ref],str/100*2.2);setW(w=>({...w,...r.wheels}));setNotes(r.notes)
  },[ref,str])
  const pickRef=i=>{const n=ref===i?-1:i;setRef(n);if(n<0)setW(emptyW())}
  const reset=()=>{setRef(-1);setW(emptyW())}
  const exportLut=()=>{setBusy(true);setTimeout(()=>{setCube(buildCube(W));setBusy(false)},40)}
  const url=useMemo(()=>cube?URL.createObjectURL(new Blob([cube],{type:'text/plain'})):'',[cube])
  const rp=ref>=0?refWheels(films[ref],0).palette:[]
  return<section id="studio">
    <div className="grid"><div><div className="panel">
      <div id="stage" onDragOver={e=>{e.preventDefault();setOver(true)}} onDragLeave={()=>setOver(false)}
        onDrop={e=>{e.preventDefault();setOver(false);read(e.dataTransfer.files[0])}}>
        {!has&&<div id="drop" className={over?'on':''}><p>Seret satu frame ke sini, atau pilih berkas.</p>
          <label className="btn" tabIndex="0">Pilih gambar<input type="file" accept="image/jpeg,image/png" hidden onChange={e=>read(e.target.files[0])}/></label>{' '}
          <button className="btn alt" onClick={()=>load(demoImage())}>Pakai gambar contoh</button></div>}
        {frame&&<GlPreview source={frame} W={W} split={split}/>}
        {has&&<><span className="tag" style={{left:10,display:'block'}}>Sebelum</span><span className="tag" style={{right:10,display:'block'}}>Sesudah</span></>}
      </div>
      {has&&<input id="sp" style={{display:'block'}} type="range" min="0" max="100" value={split} onChange={e=>setSplit(+e.target.value)} aria-label="Geser perbandingan sebelum dan sesudah"/>}
      <p className="note">Warna di layarmu bergantung pada kalibrasi monitor. Anggap hasilnya sebagai titik awal, lalu cek lagi di editormu.</p>
      {has&&<div className="strips" style={{display:'block'}}>
        <div className="lab">Palet frame kamu</div><Strip cols={fp}/>
        <div className="lab">{ref>=0?'Palet referensi: '+films[ref].n:'Palet referensi (belum dipilih)'}</div>{ref>=0&&<Strip cols={rp}/>}</div>}
    </div></div>
    <div className="panel"><h3>Look referensi</h3>
      <div id="refs">{films.map((f,i)=><button key={f.n} className="ref" aria-pressed={ref===i} onClick={()=>pickRef(i)}>
        <span>{f.n}</span><span className="dots">{f.c.map(h=><i key={h} style={{background:h}}/>)}</span></button>)}</div>
      <label className="lab" htmlFor="str" style={{display:'block',marginTop:12}}>Kekuatan look: {str}%</label>
      <input id="str" type="range" min="0" max="100" value={str} onChange={e=>setStr(+e.target.value)} style={{width:'100%',accentColor:'var(--lime)'}}/>
      <h3 style={{marginTop:18}}>Color wheel</h3>
      <div className="wheels">{KEYS.map(k=><ColorWheel key={k} id={'w-'+k} label={LAB[k]} v={W[k]} onChange={v=>setW(w=>({...w,[k]:v}))}/>)}</div>
      <ul id="why">{notes.map((n,i)=><li key={i}>{n}</li>)}</ul>
      <div className="row"><button className="btn" disabled={!has||busy} onClick={exportLut}>Ekspor LUT (.cube)</button>
        <button className="btn alt" disabled={!has} onClick={reset}>Atur ulang</button></div>
      <p id="st" role="status">{busy?'Membuat LUT 33 titik…':cube?'Selesai.':''}</p>
      {cube&&<div id="done" style={{display:'block'}}><b>LUT siap.</b>
        <div className="row" style={{marginTop:8}}><a className="btn" href={url} download="colorgrad-look.cube">Unduh colorgrad-look.cube</a></div>
        <div className="tabs" role="tablist">{Object.keys(GUIDE).map(n=><button key={n} role="tab" aria-selected={tab===n} onClick={()=>setTab(n)}>{n}</button>)}</div>
        <p id="guide">{GUIDE[tab]}</p></div>}
    </div></div></section>
}
