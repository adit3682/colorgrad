import AsciiBackground from '../components/AsciiBackground.jsx'
const STEPS=[
  ['1','Unggah','Pilih satu frame JPG atau PNG dari footage Rec.709-mu. ColorGrad mengambil lima warna dominannya.'],
  ['2','Bandingkan','Pilih look dari film terkenal. Palet referensi diterjemahkan jadi posisi awal color wheel, lengkap dengan penjelasannya.'],
  ['3','Ekspor LUT','Hasil gradingmu jadi file .cube 33 titik, siap dimuat di editor yang sudah kamu pakai.']]
export default function Home(){
  return<section id="home">
    <div id="hero"><AsciiBackground/>
      <h1>Color grading yang kamu pahami alasannya</h1>
      <p>Unggah satu frame, bandingkan dengan palet film terkenal, atur lift, gamma, dan gain, lalu ekspor LUT untuk CapCut, Premiere Pro, atau DaVinci Resolve. Gratis, dan fotomu tidak keluar dari browser.</p>
      <div><a className="btn" href="#studio">Mulai Grading</a></div></div>
    <div className="sec"><h2>Dari satu frame sampai file LUT</h2>
      <div className="cards">{STEPS.map(([n,t,d],i)=>
        <div key={n} className={'card'+(i===2?' hot':'')}><span className="n">{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></div>
  </section>
}
