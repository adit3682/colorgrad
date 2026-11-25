import {f,params} from './grade.js'
export function buildCube(W,N=33){
  const p=params(W)
  let s='TITLE "ColorGrad"\nLUT_3D_SIZE '+N+'\nDOMAIN_MIN 0 0 0\nDOMAIN_MAX 1 1 1\n'
  for(let b=0;b<N;b++)for(let g=0;g<N;g++)for(let r=0;r<N;r++)
    s+=[r,g,b].map((q,c)=>f(q/(N-1),p.l[c],p.g[c],p.m[c]).toFixed(6)).join(' ')+'\n'
  return s
}
