import { Link } from 'react-router-dom'
import style from './Home.module.css'

export default function Home() {
    return(
        <div className={style.container}>
            <h1>Sistema de pdv</h1>
            <Link to='/estoque'><button>Estoque</button></Link>
            <Link to='/pdv'><button>PDV</button></Link>
        </div>
    )
}