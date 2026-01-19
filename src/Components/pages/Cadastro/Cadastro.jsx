import { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaCalendarAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Cadastro.css';

const Cadastro = () => {
    const navigate = useNavigate();
    const API_BASE = 'http://127.0.0.1:8000/api'; 

    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        password: "",
        confirmPassword: "",
        cpf: "",
        nascimento: "",
    });

    const [loading, setLoading] = useState(false);

    // Máscara visual simples para CPF
    const aplicarMascaraCPF = (valor) => {
        return valor
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let valorFinal = value;
        if (name === 'cpf') valorFinal = aplicarMascaraCPF(value);
        
        setFormData(prev => ({ ...prev, [name]: valorFinal }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Debug para garantir que está lendo certo
        if (formData.password !== formData.confirmPassword) {
            alert("As senhas não conferem!");
            return;
        }
        
        // Payload adaptado para o Django (User model padrão)
        const payload = {
            username: formData.email, // Usamos email como username
            email: formData.email,
            password: formData.password,
            first_name: formData.nome,
            role: 'ALUNO', // Padrão inicial
            cpf: formData.cpf.replace(/\D/g, ''),
            data_nascimento: formData.nascimento
        };

        setLoading(true);
        try {
            // Certifique-se que a rota /users/ cria usuários no seu back
            await axios.post(`${API_BASE}/users/`, payload);
            alert("Conta criada com sucesso! Faça login.");
            navigate('/login');
        } catch (error) {
            console.error(error);
            // Tenta pegar a mensagem de erro específica do Django
            const msgErro = error.response?.data?.email 
                ? "Este email já está em uso." 
                : "Erro ao cadastrar. Verifique os dados.";
            alert(msgErro);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content-wrap">
            <form onSubmit={handleSubmit}>
                <h1>Crie sua Conta</h1>
                <p style={{textAlign: 'center', marginBottom: '20px', fontSize: '14px', color: '#666'}}>
                    Cadastro padrão de Aluno. Professores validam o token no perfil.
                </p>

                <div className='input-field'>
                    <input 
                        type="text" 
                        name="nome" 
                        placeholder="Nome Completo" 
                        value={formData.nome} 
                        onChange={handleChange} 
                        required 
                    />
                    <FaUser className='icon' />
                </div>

                <div className='input-field'>
                    <input 
                        type="text" 
                        name="cpf" 
                        placeholder="CPF" 
                        value={formData.cpf} 
                        onChange={handleChange} 
                        maxLength={14} 
                        required 
                    />
                    <FaIdCard className='icon' />
                </div>

                <div className='input-field'>
                    <input 
                        type="date" 
                        name="nascimento" 
                        value={formData.nascimento} 
                        onChange={handleChange} 
                        required 
                    />
                    <FaCalendarAlt className='icon' />
                </div>

                <div className='input-field'>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="E-mail" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />
                    <FaEnvelope className='icon' />
                </div>

                <div className='input-field'>
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Senha" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                    />
                    <FaLock className='icon' />
                </div>

                <div className='input-field'>
                    {/* CORREÇÃO AQUI: name="confirmPassword" igual ao useState */}
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        placeholder="Confirmar Senha" 
                        value={formData.confirmPassword} 
                        onChange={handleChange} 
                        required 
                    />
                    <FaLock className='icon' />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Carregando...' : 'Criar Conta'}
                </button>

                <div className='singnup-link'>
                    <p>Já tem uma conta? <Link to="/login">Entrar</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Cadastro;