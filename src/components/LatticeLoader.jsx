export default function LatticeLoader(){
  return<div className="lat" aria-hidden="true">{Array.from({length:25},(_,i)=><i key={i} style={{animationDelay:((i%5)+Math.floor(i/5))*.08+'s'}}/>)}</div>
}
