import {useEffect,useRef} from 'react'
import {params,tables} from '../grading/grade.js'
// Rumus sama dengan grading/grade.js (dan LUT): v = clamp(v*gain + lift*(1-v)); pow(v, 1/gamma)
const VS='attribute vec2 p;varying vec2 u;void main(){u=p*.5+.5;gl_Position=vec4(p,0.,1.);}'
const FS=`precision mediump float;varying vec2 u;uniform sampler2D t;uniform vec3 l,g,m;uniform float s;uniform vec2 px;
void main(){vec3 c=texture2D(t,u).rgb;vec3 v=pow(clamp(c*g+l*(1.-c),0.,1.),1./m);
if(u.x<s)v=c;if(abs(u.x-s)<px.x)v=vec3(1.);gl_FragColor=vec4(v,1.);}`
export default function GlPreview({source,W,split}){
  const cv=useRef(),S=useRef({})
  useEffect(()=>{ // siapkan WebGL sekali
    const gl=cv.current.getContext('webgl');if(!gl)return
    const sh=(t,s)=>{const o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o}
    const pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS))
    gl.linkProgram(pr);gl.useProgram(pr)
    gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW)
    const a=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0)
    gl.bindTexture(gl.TEXTURE_2D,gl.createTexture())
    ;[[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]]
      .forEach(([k,v])=>gl.texParameteri(gl.TEXTURE_2D,k,v))
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true)
    S.current={gl,u:n=>gl.getUniformLocation(pr,n)}
  },[])
  useEffect(()=>{ // gambar baru: ukuran kanvas dan tekstur
    const c=cv.current,{gl}=S.current;c.width=source.width;c.height=source.height
    if(gl){gl.viewport(0,0,c.width,c.height);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source)}
  },[source])
  useEffect(()=>{ // gambar ulang saat wheel atau slider berubah
    const c=cv.current,{gl,u}=S.current
    if(gl){const p=params(W)
      gl.uniform3fv(u('l'),p.l);gl.uniform3fv(u('g'),p.g);gl.uniform3fv(u('m'),p.m)
      gl.uniform1f(u('s'),split/100);gl.uniform2f(u('px'),1/c.width,0);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);return}
    // cadangan Canvas 2D (CPU)
    const x=c.getContext('2d'),im=source.getContext('2d').getImageData(0,0,c.width,c.height),a=im.data,o=a.slice()
    const T=tables(W),sw=Math.floor(c.width*split/100)
    for(let i=0;i<a.length;i+=4)if((i/4)%c.width>=sw){a[i]=T[0][o[i]];a[i+1]=T[1][o[i+1]];a[i+2]=T[2][o[i+2]]}
    x.putImageData(im,0,0);x.fillStyle='#fff';x.fillRect(sw-1,0,2,c.height)
  },[source,W,split])
  return<canvas id="cv" ref={cv} style={{display:'block'}}/>
}
