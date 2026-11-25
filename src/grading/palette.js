export const lum=c=>.2126*c[0]+.7152*c[1]+.0722*c[2]
export const hex=c=>'#'+c.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('')
export const rgb=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16))
const lin=v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}
// sRGB (0-255) -> CIE Lab (D65)
export function toLab([r,g,b]){
  const R=lin(r),G=lin(g),B=lin(b)
  const x=(.4124*R+.3576*G+.1805*B)/.95047,y=.2126*R+.7152*G+.0722*B,z=(.0193*R+.1192*G+.9505*B)/1.08883
  const q=t=>t>.008856?Math.cbrt(t):7.787*t+16/116,fx=q(x),fy=q(y),fz=q(z)
  return[116*fy-16,500*(fx-fy),200*(fy-fz)]
}
const d2=(a,b)=>(a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2
// k-means di ruang Lab (jarak sesuai persepsi); hasil dikembalikan sebagai RGB rata-rata tiap klaster
export function kmeans(d,k=5){
  const px=[],st=Math.max(1,Math.floor(d.length/16000))
  for(let i=0;i<d.length;i+=4*st)px.push([d[i],d[i+1],d[i+2]])
  const L=px.map(toLab),ord=L.map((_,i)=>i).sort((a,b)=>L[a][0]-L[b][0])
  let c=Array.from({length:k},(_,i)=>L[ord[Math.floor((i+.5)*ord.length/k)]])
  let rg=c.map(()=>[0,0,0,0])
  for(let it=0;it<12;it++){
    const s=c.map(()=>[0,0,0,0]),r=c.map(()=>[0,0,0,0])
    L.forEach((p,n)=>{let b=0,bd=1e9
      c.forEach((q,j)=>{const e=d2(p,q);if(e<bd){bd=e;b=j}})
      s[b][0]+=p[0];s[b][1]+=p[1];s[b][2]+=p[2];s[b][3]++
      r[b][0]+=px[n][0];r[b][1]+=px[n][1];r[b][2]+=px[n][2];r[b][3]++})
    c=c.map((q,j)=>s[j][3]?[s[j][0]/s[j][3],s[j][1]/s[j][3],s[j][2]/s[j][3]]:q)
    rg=r}
  return rg.filter(a=>a[3]).map(a=>[a[0]/a[3],a[1]/a[3],a[2]/a[3]]).sort((a,b)=>lum(a)-lum(b))
}
const NAMA=['red','yellow','green','cyan','blue','magenta']
const warna=(x,y)=>NAMA[Math.round(((Math.atan2(y,x)*180/Math.PI+360)%360)/60)%6]
// Terjemahkan palet film jadi posisi awal wheel + penjelasan
export function refWheels(film,s){
  const p=film.c.map(rgb).sort((a,b)=>lum(a)-lum(b)),wheels={},notes=[]
  ;[['lift',p[0],'shadows'],['gamma',p[2],'midtones'],['gain',p[4],'highlights']].forEach(([k,c,t])=>{
    const y=lum(c),d=c.map(v=>(v-y)/255)
    let x=(2*d[0]-d[1]-d[2])/3*s*1.5,yy=(d[1]-d[2])/1.732*s*1.5;const n=Math.hypot(x,yy)
    if(n>1){x/=n;yy/=n}
    wheels[k]={x,y:yy,m:0}
    notes.push({k,tone:t,color:n<.06?null:warna(x,yy),film:film.n})})
  return{wheels,notes,palette:p}
}
