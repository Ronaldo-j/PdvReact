import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import style from './Login.module.css'

export default function Login() {
    const [dados, setDados] = useState({});
    const navigate = useNavigate();

    function handleChange(e) {
        setDados({
            ...dados,
            [e.target.name]: e.target.value
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!dados.email || !dados.password) {
            window.alert('Os campos precisam estar preenchidos');
            return;
        }

        fetch(`http://localhost:5000/contas?email=${dados.email}`)
            .then((resp) => resp.json())
            .then((data) => {
                if (data.length === 0) {
                    window.alert('Email incorreto');
                    return;
                } else {
                    if (data[0].password === dados.password) {
                        window.alert('Login feito com sucesso');
                        localStorage.setItem('userId', data[0].id); // Armazena o ID do usuário no localStorage
                        navigate('/home');
                    } else {
                        window.alert('Senha incorreta');
                    }
                }
            })
            .catch((err) => console.log(err));
    }

    return (
        <div className={style.div_form}>
            <form onSubmit={handleSubmit} >
                <h1>Login</h1>
                <h4>Email</h4>
                <input
                    type="email"
                    placeholder="Insira seu email"
                    name="email"
                    value={dados.email || ''}
                    onChange={handleChange}
                />
                <h4>Senha</h4>
                <input
                    type="password"
                    placeholder="Insira sua senha"
                    name="password"
                    value={dados.password || ''}
                    onChange={handleChange}
                />
                <p>
                    <button type="submit">Fazer login</button>
                </p>
                <p>
                    Caso não possua uma conta <Link to='/cadastrar'>clique aqui</Link>
                </p>
            </form>
        </div>
    );
}
