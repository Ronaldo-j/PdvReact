import { Link, useNavigate } from 'react-router-dom'
import style from './Estoque.module.css'
import { useEffect, useState } from 'react'

export default function Estoque() {
    const [produtos, setProdutos] = useState([])
    const [selectedIndex, setIndex] = useState(null)
    const navigate = useNavigate()

    const alterarProduto = () => {
        if (selectedIndex === null) {
            window.alert('Selecione um produto')
        } else {
            const produtoSelecionado = produtos[selectedIndex]
            navigate('/alterar', { state: { produto: produtoSelecionado } })
        }
    }

    const deletarProduto = () => {
        if (selectedIndex === null) {
            window.alert('Selecione um produto para deletar');
            return;
        }
    
        const produtoSelecionado = produtos[selectedIndex];
        const confirmacao = window.confirm(`Tem certeza que deseja deletar o produto ${produtoSelecionado.nome}?`);
    
        if (confirmacao) {
            // Buscar a conta e remover o produto manualmente
            fetch(`http://localhost:5000/contas/${userId}`)
                .then((resp) => resp.json())
                .then((conta) => {
                    const produtosAtualizados = conta.produtos.filter(p => p.codigo !== produtoSelecionado.codigo);
                    return fetch(`http://localhost:5000/contas/${userId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ produtos: produtosAtualizados })
                    });
                })
                .then((resp) => {
                    if (resp.ok) {
                        setProdutos(produtos.filter((_, index) => index !== selectedIndex));
                        setIndex(null); // Desmarcar o produto
                    } else {
                        return resp.text().then(text => {
                            throw new Error(`Falha ao deletar o produto: ${text}`);
                        });
                    }
                })
                .catch((err) => console.log(err));
        }
    }
    

    const handleSelectedIndex = (index) => {
        setIndex(index)
    }

    const [userId, setUserId] = useState(null)

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

    return (
        <div>
            <h1>Estoque</h1>
            <div className={style.grid_container}>
                <div className={style.grid_item}>
                    <h4>Código</h4>
                    {produtos.map((produto, index) => (
                        <div 
                         key={index}
                         className={selectedIndex === index ? style.selected : ''}
                         onClick={() => handleSelectedIndex(index)}
                        >
                            {produto.codigo}
                        </div>
                    ))}
                </div>
                <div className={style.grid_item}>
                    <h4>Nome</h4>
                    {produtos.map((produto, index) => (
                        <div 
                         key={index}
                         className={selectedIndex === index ? style.selected : ''}
                         onClick={() => handleSelectedIndex(index)}
                        >
                            {produto.nome}
                        </div>
                    ))}
                </div>
                <div className={style.grid_item}>
                    <h4>Custo</h4>
                    {produtos.map((produto, index) => (
                        <div 
                         key={index}
                         className={selectedIndex === index ? style.selected : ''}
                         onClick={() => handleSelectedIndex(index)}
                        >
                            {produto.custo}
                        </div>
                    ))}
                </div>
                <div className={style.grid_item}>
                    <h4>Lucro(%)</h4>
                    {produtos.map((produto, index) => (
                        <div 
                         key={index}
                         className={selectedIndex === index ? style.selected : ''}
                         onClick={() => handleSelectedIndex(index)}
                        >
                            {produto.lucro}
                        </div>
                    ))}
                </div>
                <div className={style.grid_item}>
                    <h4>Sugestão</h4>
                    {produtos.map((produto, index) => (
                        <div 
                         key={index}
                         className={selectedIndex === index ? style.selected : ''}
                         onClick={() => handleSelectedIndex(index)}
                        >
                            {produto.sugestao}
                        </div>
                    ))}
                </div>
                <div className={style.grid_item}>
                    <h4>Preço de Venda</h4>
                    {produtos.map((produto, index) => (
                        <div 
                         key={index}
                         className={selectedIndex === index ? style.selected : ''}
                         onClick={() => handleSelectedIndex(index)} 
                        >
                            {produto.preco}
                        </div>
                    ))}
                </div>
                <div className={style.grid_item}>
                    <h4>Qtd. Mín.</h4>
                    {produtos.map((produto, index) => (
                        <div 
                         key={index}
                         className={selectedIndex === index ? style.selected : ''}
                         onClick={() => handleSelectedIndex(index)}
                        >
                            {produto.estoqueMin}
                        </div>
                    ))}
                </div>
                <div className={style.grid_item}>
                    <h4>Qtd. Atual</h4>
                    {produtos.map((produto, index) => (
                        <div 
                         key={index}
                         className={selectedIndex === index ? style.selected : ''}
                         onClick={() => handleSelectedIndex(index)}
                        >
                            {produto.estoqueAtual}
                        </div>
                    ))}
                </div>
            </div>

            <div className={style.div_button}>
                <Link to='/home'><button>Voltar</button></Link>
                <Link to='/novoproduto'><button>Novo</button></Link>
                <button onClick={alterarProduto} disabled={selectedIndex === null}>Alterar</button>
                <button onClick={deletarProduto} disabled={selectedIndex === null}>Apagar</button>
            </div>
        </div>
    )
}
