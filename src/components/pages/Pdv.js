import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import style from './Pdv.module.css'

export default function Pdv() {
    const [codigo, setCodigo] = useState('')
    const [produtos, setProdutos] = useState([])
    const [userId, setUserId] = useState(null)
    const [valTotal, setValTotal] = useState(0)
    const [produtoPassado, setProdutoPassado] = useState([])

    useEffect(() => {
        const id = localStorage.getItem('userId')
        setUserId(id)
    }, [])

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:5000/contas/${userId}`)
                .then((resp) => resp.json())
                .then((data) => setProdutos(data.produtos || []))
                .catch((err) => console.log(err))
        }
    }, [userId])

    function handleChange(e) {
        const value = e.target.value
        setCodigo(value)

        const divProduto = document.getElementById('produto')
        const produtoEncontrado = produtos.find((produtos) => produtos.codigo === value)

        if (!produtoEncontrado) {
            divProduto.innerHTML = 'Produto não encontrado'
        } else {
            divProduto.innerHTML = `
                <p>Nome: ${produtoEncontrado.nome}</p>
                <p>Preço: ${produtoEncontrado.preco}</p>
                <p>Estoque: ${produtoEncontrado.estoqueAtual}</p>
            `
        }
    }

    function handleSubmit(e) {
        e.preventDefault()

        if (!codigo) {
            window.alert('Insira um código')
            return
        }

        const produtoEncontrado = produtos.find((produtos) => produtos.codigo === codigo)
        if (produtoEncontrado.estoqueAtual === 0) {
            window.alert('Produto esgotado')
            return
        } else {
            setValTotal(prevTotal => prevTotal + Number(produtoEncontrado.preco))
            setProdutoPassado(prevProdutos => [...prevProdutos, produtoEncontrado.nome])
        }
    }

    function apagar(e) {
        e.preventDefault()
        setProdutoPassado([])
        setValTotal(0)
    }

    return (
        <div className={style.container}>
            <input 
                type='number'
                placeholder='Insira o código do produto'
                value={codigo.numero}
                onChange={handleChange}
                className={style.inputField}
            />
            <div id="produto" className={style.productInfo}></div>
            <button type="submit" onClick={handleSubmit} className={style.button}>Adicionar</button>
            <div id="produtoPassado" className={style.productList}>
                {produtoPassado.map((produto, index) => (
                    <p key={index}>{produto}</p>
                ))}
            </div>
            <h2 id='valTotal' className={style.total}>Total: {valTotal}</h2>
            <p>
            <button type='submit' onClick={apagar} className={style.button}>Apagar</button>
            <Link to='/home' className={style.linkButton}>
                <button className={style.button}>Voltar</button>
            </Link>
            </p>
        </div>
    )
}
