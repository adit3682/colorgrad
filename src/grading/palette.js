export const lum=c=>.2126*c[0]+.7152*c[1]+.0722*c[2]
export const hex=c=>'#'+c.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('')
export const rgb=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16))
export function kmeans(d,k=5){
  const px=[],st=Math.max(1,Math.floor(d.length/16000))
  for(let i=0;i<d.length;i+=4*st)px.push([d[i],d[i+1],d[i+2]])
  let c=Array.from({length:k},(_,i)=>px[Math.floor((i+.5)*px.length/k)])
  for(let it=0;it<10;it++){
    const s=c.map(()=>[0,0,0,0])
    for(const p of px){let b=0,bd=1e9
      c.forEach((q,j)=>{const e=(p[0]-q[0])**2+(p[1]-q[1])**2+(p[2]-q[2])**2;if(e<bd){bd=e;b=j}})
      const a=s[b];a[0]+=p[0];a[1]+=p[1];a[2]+=p[2];a[3]++}
    c=c.map((q,j)=>s[j][3]?[s[j][0]/s[j][3],s[j][1]/s[j][3],s[j][2]/s[j][3]]:q)}
  return c.sort((a,b)=>lum(a)-lum(b))
}
const NAMA=['merah','kuning','hijau','cyan','biru','magenta']
const warna=(x,y)=>NAMA[Math.round(((Math.atan2(y,x)*180/Math.PI+360)%360)/60)%6]
// Terjemahkan palet film jadi posisi awal wheel + penjelasan
export function refWheels(film,s){
  const p=film.c.map(rgb).sort((a,b)=>lum(a)-lum(b)),wheels={},notes=[]
  ;[['lift',p[0],'shadows'],['gamma',p[2],'midtones'],['gain',p[4],'highlights']].forEach(([k,c,t])=>{
    const y=lum(c),d=c.map(v=>(v-y)/255)
    let x=(2*d[0]-d[1]-d[2])/3*s*1.5,yy=(d[1]-d[2])/1.732*s*1.5;const n=Math.hypot(x,yy)
    if(n>1){x/=n;yy/=n}
    wheels[k]={x,y:yy,m:0}
    notes.push(n<.06?`${k} dibiarkan netral karena ${t} referensi hampir abu-abu.`
      :`${k} menggeser ${t} ke arah ${warna(x,yy)}, mengikuti ${t} palet ${film.n}.`)})
  return{wheels,notes,palette:p}
}
