import { useState, useEffect } from 'react';
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaCalendarAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { registrarUsuario } from '../../../services/api';
import './Cadastro.css';

const Cadastro = () => {
    const navigate = useNavigate();
    const [cpf, setCpf] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState(null);
    const [loadingCpf, setLoadingCpf] = useState(false);
    const [cpfValido, setCpfValido] = useState(false);

    useEffect(() => {
        const validarEConsultar = async () => {
            const cpfLimpo = cpf.replace(/\D/g, "");
            
            if (cpfLimpo.length === 11) {
                setLoadingCpf(true);
                
                try {
                    // Tentativa com BrasilAPI (mais rápida para CPFs reais)
                    const response = await fetch(`https://brasilapi.com.br/api/cpf/v1/${cpfLimpo}`);
                    
                    if (response.ok) {
                        const data = await response.json();
                        setName(data.nome);
                        // Converte a data de YYYY-MM-DD para o formato do input date
                        setBirthDate(data.data_nascimento);
                        setCpfValido(true);
                    } else {
                        throw new Error("CPF não encontrado");
                    }
                } catch (error) {
                    console.error("Erro na consulta:", error);
                    setCpfValido(false);
                    setName("");
                    setBirthDate("");
                    alert("Não foi possível validar este CPF. Verifique se o número existe na base da Receita Federal.");
                } finally {
                    setLoadingCpf(false);
                }
            } else {
                setCpfValido(false);
            }
        };

        const delayDebounce = setTimeout(() => {
            validarEConsultar();
        }, 600);

        return () => clearTimeout(delayDebounce);
    }, [cpf]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!cpfValido) return alert("CPF Inválido!");
        if (password !== confirmPassword) return alert("As senhas não coincidem!");
        if (!role) return alert("Selecione seu cargo!");

        const user = { 
            nome: name, 
            email, 
            cpf: cpf.replace(/\D/g, ""), 
            data_nascimento: birthDate, 
            password, 
            role, 
            ativo: true 
        };

        try {
            const res = await registrarUsuario(user);
            if (res) {
                alert("Sucesso!");
                navigate('/login');
            }
        } catch (e) {
            alert("Erro ao conectar com o servidor.");
        }
    };

    return (
        <div className="content-wrap">
            <form onSubmit={handleSubmit}>
                <h1>Crie sua Conta</h1>

                <div className='input-field'>
                    <input 
                        type="text" 
                        placeholder="CPF (11 dígitos)" 
                        maxLength="11"
                        value={cpf} 
                        onChange={(e) => setCpf(e.target.value)} 
                        required 
                    />
                    <FaIdCard className='icon' />
                </div>

                <div className='input-field'>
                    <input 
                        type="text" 
                        placeholder={loadingCpf ? "Validando..." : "Nome completo"} 
                        value={name} 
                        readOnly 
                        className="readonly-field" 
                        required
                    />
                    <FaUser className='icon' />
                </div>

                <div className='input-field'>
                    <input 
                        type="date" 
                        value={birthDate} 
                        readOnly 
                        className="readonly-field" 
                        required
                    />
                    <FaCalendarAlt className='icon' />
                </div>

                <div className='input-field'>
                    <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <FaEnvelope className='icon' />
                </div>

                <div className='input-field'>
                    <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <FaLock className='icon' />
                </div>

                <div className='input-field'>
                    <input type="password" placeholder="Confirmar" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <FaLock className='icon' />
                </div>

                <div className='role-container'>
                    <label><input type="radio" name="role" onChange={() => setRole("ALUNO")} /> Aluno</label>
                    <label><input type="radio" name="role" onChange={() => setRole("PROFESSOR")} /> Professor</label>
                </div>

                <button type="submit" disabled={loadingCpf || !cpfValido}>
                    {loadingCpf ? "Aguarde..." : "Cadastrar"}
                </button>
            </form>
        </div>
    );
};

export default Cadastro;