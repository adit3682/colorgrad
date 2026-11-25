// Empat lapis backdrop-filter dengan mask bertingkat; blur makin kuat ke tepi bawah
export default function GradualBlur(){
  return<div className="gb" aria-hidden="true">{[1,2,4,8].map((b,i)=>{
    const m=`linear-gradient(to bottom,transparent ${i*20}%,#000 ${i*20+25}%)`
    return<div key={b} style={{backdropFilter:`blur(${b}px)`,WebkitBackdropFilter:`blur(${b}px)`,maskImage:m,WebkitMaskImage:m}}/>})}</div>
}
