export const emptyW=()=>({lift:{x:0,y:0,m:0},gamma:{x:0,y:0,m:0},gain:{x:0,y:0,m:0}})
export const f=(v,l,g,m)=>{v=v*g+l*(1-v);v=Math.min(1,Math.max(0,v));return Math.pow(v,1/m)}
export function params(W){
  const o=(w,c)=>[w.x,-.5*w.x+.866*w.y,-.5*w.x-.866*w.y][c]+w.m
  return{
    l:[0,1,2].map(c=>.2*o(W.lift,c)),
    g:[0,1,2].map(c=>1+.5*o(W.gain,c)),
    m:[0,1,2].map(c=>Math.max(.25,1+.6*o(W.gamma,c)))}
}
export function tables(W){
  const p=params(W)
  return[0,1,2].map(c=>{const t=new Uint8ClampedArray(256);for(let i=0;i<256;i++)t[i]=f(i/255,p.l[c],p.g[c],p.m[c])*255;return t})
}
