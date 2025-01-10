import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import style from './NovoProduto.module.css'

export default function NovoProduto() {
    const [produto, setProduto] = useState({
        codigo: '',
        nome: '',
        custo: '',
        lucro: '',
        sugestao: '',
        preco: '',
        estoqueMin: '',
        estoqueAtual: ''
    });
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const id = localStorage.getItem('userId');
        setUserId(id);
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setProduto(prevProduto => {
            const updatedProduto = {
                ...prevProduto,
                [name]: value
            };

            if (updatedProduto.custo && updatedProduto.lucro) {
                const sug = Number(updatedProduto.custo) + (Number(updatedProduto.custo) * (Number(updatedProduto.lucro) / 100));
                updatedProduto.sugestao = sug.toFixed(2);
            } else {
                updatedProduto.sugestao = updatedProduto.custo;
            }

            if (updatedProduto.preco && updatedProduto.custo) {
                const luc = ((Number(updatedProduto.preco) - Number(updatedProduto.custo)) / Number(updatedProduto.custo)) * 100;
                document.getElementById('lucro').innerHTML = luc.toFixed(1) + '%';
            }

            return updatedProduto;
        });
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (!produto.codigo || !produto.nome || !produto.custo || !produto.lucro || !produto.sugestao || !produto.preco || !produto.estoqueMin || !produto.estoqueAtual) {
            window.alert('Todos os campos devem estar preenchidos');
            return;
        }

        if (!userId) {
            window.alert('Usuário não está logado');
            return;
        }

        fetch(`http://localhost:5000/contas/${userId}`)
            .then(resp => resp.json())
            .then(conta => {
                if (!conta) {
                    window.alert('Conta não encontrada');
                    return;
                }

                const produtoExistente = conta.produtos.find(p => p.codigo === produto.codigo);
                if (produtoExistente) {
                    window.alert('Código já cadastrado');
                    return;
                }

                conta.produtos.push(produto);

                fetch(`http://localhost:5000/contas/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(conta),
                })
                .then(resp => {
                    if (!resp.ok) {
                        throw new Error('Erro ao cadastrar o produto');
                    }
                    return resp.json();
                })
                .then(data => {
                    window.alert('Produto cadastrado com sucesso');
                    navigate('/estoque');
                    setProduto({
                        codigo: '',
                        nome: '',
                        custo: '',
                        lucro: '',
                        sugestao: '',
                        preco: '',
                        estoqueMin: '',
                        estoqueAtual: ''
                    });
                    document.getElementById('lucro').innerHTML = '0,0%';
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }

    return (
        <div className={style.container}>
            <form onSubmit={handleSubmit}>
                <h1>Novo Produto</h1>
                <h4>
                    Código:
                    <input
                        type="number"
                        name='codigo'
                        value={produto.codigo}
                        onChange={handleChange}
                    />
                </h4>
                <h4>
                    Nome:
                    <input
                        type="text"
                        name='nome'
                        value={produto.nome}
                        onChange={handleChange}
                    />
                </h4>
                <h4>
                    Custo:
                    <input
                        type="number"
                        name='custo'
                        value={produto.custo}
                        onChange={handleChange}
                    />
                </h4>
                <h4>
                    Lucro(%):
                    <input
                        type="number"
                        name='lucro'
                        value={produto.lucro}
                        onChange={handleChange}
                    />
                </h4>
                <h4>
                    Sugestão:
                    <input
                        type="number"
                        name='sugestao'
                        value={produto.sugestao}
                        readOnly
                    />
                </h4>
                <div className={style.precoLucroContainer}>
                <h4>
                    Preço de Venda:
                    <input
                        type="number"
                        name='preco'
                        value={produto.preco}
                        onChange={handleChange}
                    />
                </h4>
                <p id='lucro'>0,0%</p>
                </div>
                <h4>
                    Estoque Mínimo:
                    <input
                        type="number"
                        name='estoqueMin'
                        value={produto.estoqueMin}
                        onChange={handleChange}
                    />
                </h4>
                <h4>
                    Estoque Atual:
                    <input
                        type="number"
                        name='estoqueAtual'
                        value={produto.estoqueAtual}
                        onChange={handleChange}
                    />
                </h4>

                <div>
                    <Link to='/estoque'><button>Voltar</button></Link>
                    <button type='submit'>Enviar</button>
                </div>
            </form>
        </div>
    );
}
