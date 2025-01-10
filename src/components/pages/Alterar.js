import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import style from './Alterar.module.css'

export default function Alterar() {
    const [updatedProduto, setUpdatedProduto] = useState({});
    const [produtos, setProdutos] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const produto = location.state?.produto;

    useEffect(() => {
        if (produto) {
            setUpdatedProduto(produto);
        } else {
            navigate('/estoque');
        }
    }, [produto, navigate]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetch(`http://localhost:5000/contas/${userId}/produtos`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro na resposta: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => setProdutos(data.produtos || []))
                .catch(error => {
                    console.error('Erro ao buscar produtos:', error);
                });
        }
    }, []);

    function handleChange(e) {
        setUpdatedProduto(prev => {
            const updatedProduto = {
                ...prev,
                [e.target.name]: e.target.value
            }
            
            if(updatedProduto.custo && updatedProduto.lucro){
                const novaSugestao = Number(updatedProduto.custo) + (Number(updatedProduto.custo) * (Number(updatedProduto.lucro)/100))
                updatedProduto.sugestao = novaSugestao.toFixed(2)
            }else {
                updatedProduto.sugestao = updatedProduto.custo
            }

            
            if (updatedProduto.preco && updatedProduto.custo) {
                const luc = ((Number(updatedProduto.preco) - Number(updatedProduto.custo)) / Number(updatedProduto.custo)) * 100;
                document.getElementById('luc').innerHTML = luc.toFixed(1) + '%';
            }

            return updatedProduto;
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
    
        if (!updatedProduto.codigo || !updatedProduto.nome || !updatedProduto.custo || !updatedProduto.lucro || !updatedProduto.sugestao || !updatedProduto.preco || !updatedProduto.estoqueMin || !updatedProduto.estoqueAtual) {
            window.alert('Todos os campos devem estar preenchidos');
            return;
        }
    
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('Usuário não encontrado no localStorage');
            return;
        }

        fetch(`http://localhost:5000/contas/${userId}`)
        .then(response => response.json())
        .then(conta => {
        // Preserve todos os dados da conta e apenas atualize os produtos
        const produtosAtualizados = conta.produtos.map(p => p.codigo === updatedProduto.codigo ? updatedProduto : p);
        const contaAtualizada = {
            ...conta,
            produtos: produtosAtualizados
        };

        return fetch(`http://localhost:5000/contas/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contaAtualizada)
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao atualizar a conta');
        }
        return response.json();
    })
    .then(() => {
        window.alert('Produto atualizado com sucesso');
        navigate('/estoque');
    })
    .catch(error => {
        console.error('Erro:', error);
        window.alert(`Erro ao atualizar o produto: ${error.message}`);
    });


}
    
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Alterar produto</h1>
                <div>
                    <b>Nome:</b> 
                    <input 
                        type="text"
                        name="nome"
                        value={updatedProduto.nome || ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <b>Custo:</b> 
                    <input 
                        type="number"
                        name="custo"
                        value={updatedProduto.custo || ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <b>Lucro(%):</b> 
                    <input 
                        type="number"
                        name="lucro"
                        value={updatedProduto.lucro || ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <b>Sugestão:</b> 
                    <input 
                        type="number" 
                        readOnly
                        name="sugestao"
                        value={updatedProduto.sugestao || ''}
                    />
                </div>
                <div className={style.form_group}>
                    <b>Preço de Venda:</b> 
                    <input 
                        type="number"
                        name="preco"
                        value={updatedProduto.preco || ''}
                        onChange={handleChange}
                    />
                    <p id="luc">0,0%</p>
                </div>
                <div>
                    <b>Qtd. Mín.:</b> 
                    <input 
                        type="number"
                        name="estoqueMin"
                        value={updatedProduto.estoqueMin || ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <b>Qtd. Atual:</b> 
                    <input 
                        type="number"
                        name="estoqueAtual"
                        value={updatedProduto.estoqueAtual || ''}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Link to='/estoque'><button type="button">Voltar</button></Link>
                    <button type="submit">Alterar</button>
                </div>
            </form>
        </div>
    );
}
