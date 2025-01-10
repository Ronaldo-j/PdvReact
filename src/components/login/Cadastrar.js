import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import style from './Cadastrar.module.css'

export default function Cadastrar() {
    const [conta, setConta] = useState({})
    const navigate = useNavigate()

    function handleChange(e){
        setConta({
            ...conta,
            [e.target.name]: e.target.value
        })
    }

    function handleSubmit(e){
        e.preventDefault()

        if(!conta.name || !conta.email || !conta.password || !conta.passwordConfirm){
            window.alert('todos os campos devem estar preenchidos !')
            return
        }
        if(conta.password !== conta.passwordConfirm){
            window.alert('as senhas não coincidem')
            return
        }

        fetch(`http://localhost:5000/contas?email=${conta.email}`)
        .then((resp)=> resp.json())
        .then(data => {
            if(data.lenght > 0){
                window.alert('email já cadastrado')
                return
            }else {
                fetch(`http://localhost:5000/contas?password=${conta.password}`)
                .then((resp) => resp.json())
                .then(data => {
                    if(data.lenght > 0){
                        window.alert('senha já cadastrada')
                        return
                    }else{
                        fetch(`http://localhost:5000/contas`, {
                            method: 'POST',
                            headers: {
                                'Content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                name: conta.name,
                                email: conta.email,
                                password: conta.password,
                                produtos: []
                            }),
                        })
                        .then((resp) => resp.json())
                        .then(data => {
                            window.alert('usuario cadastrado com sucesso', data)
                            navigate('/')
                            setConta({
                                name: '',
                                email: '',
                                password: '',
                                passwordConfirm: '',
                            })
                        })
                        .catch((err) => console.log(err))
                    }
                })
            }
        })
        .catch((err) => console.log(err))
    }

    return(
        <div className={style.div_form}>
            <form onSubmit={handleSubmit}>
                <h1>Cadastrar</h1>
                <h4>Nome</h4>
                <input 
                 type='text'
                 name='name'
                 placeholder='Insira seu nome'
                 value={conta.name}
                 onChange={handleChange}
                />
                <h4>Email</h4>
                <input 
                 type="email"
                 name='email'
                 placeholder="Insira seu email"
                 value={conta.email}
                 onChange={handleChange}
                />
                <h4>Senha</h4>
                <input 
                 type="password"
                 name='password'
                 placeholder="Insira sua senha"
                 value={conta.password}
                 onChange={handleChange}
                />
                <h4>Confirmar senha</h4>
                <input 
                 type='password'
                 name='passwordConfirm'
                 placeholder='Confirme a senha'
                 value={conta.passwordConfirm}
                 onChange={handleChange}
                />
                <p>
                    <button type='submit'>Criar Conta</button>
                </p>
                <p>
                    Já tenho uma conta <Link to='/'>login</Link>
                </p>
            </form>
        </div>
    )
}