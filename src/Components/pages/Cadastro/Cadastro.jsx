import { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaCalendarAlt, FaFileUpload, FaUniversity } from 'react-icons/fa';
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
        matricula: "",
    });

    const [role, setRole] = useState(null);
    const [arquivo, setArquivo] = useState(null);
    const [loading, setLoading] = useState(false);

    // --- MÁSCARA MANUAL DE CPF ---
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

        if (name === 'cpf') {
            valorFinal = aplicarMascaraCPF(value);
        }

        setFormData(prevState => ({
            ...prevState,
            [name]: valorFinal
        }));
    };

    const handleConsultarCPF = async () => {
        const cpfNumeros = formData.cpf.replace(/\D/g, '');

        if (cpfNumeros.length !== 11) {
            alert("Digite o CPF completo (11 números).");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/consulta-cpf/${cpfNumeros}/`);
            const { nome, data_nascimento } = response.data;
            
            setFormData(prev => ({
                ...prev,
                nome: nome || prev.nome,
                nascimento: data_nascimento || prev.nascimento
            }));
        } catch (error) {
            console.error("Erro na consulta:", error);
            alert("CPF não encontrado ou erro de conexão.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!formData.nome.trim()) return alert("Nome é obrigatório (Consulte o CPF).");
        if (formData.password !== formData.confirmPassword) return alert("As senhas não coincidem!");
        if (!role) return alert("Selecione: Aluno ou Professor?");
        if (formData.cpf.length < 14) return alert("CPF incompleto.");

        const dataToSend = new FormData();
        dataToSend.append('email', formData.email);
        dataToSend.append('nome', formData.nome);
        dataToSend.append('password', formData.password);
        dataToSend.append('cpf', formData.cpf.replace(/\D/g, ''));
        dataToSend.append('data_nascimento', formData.nascimento);
        
        let urlEndpoint = '';
        if (role === 'PROFESSOR') {
            urlEndpoint = `${API_BASE}/professores/cadastro/`;
            dataToSend.append('matricula', formData.matricula);
            if (arquivo) {
                dataToSend.append('comprovante_vinculo', arquivo);
            }
        } else {
            urlEndpoint = `${API_BASE}/users/`; 
            dataToSend.append('role', 'ALUNO');
        }

        try {
            await axios.post(urlEndpoint, dataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Sucesso! Cadastro realizado.");
            navigate('/login');
        } catch (error) {
            console.error("Erro no envio:", error);
            const msg = error.response?.data?.detail || "Erro ao cadastrar. Verifique os dados.";
            alert(msg);
        }
    };

    return (
        <div className="content-wrap">
            <form onSubmit={handleSubmit}>
                <h1>Crie sua Conta</h1>

                <div className='role-container'>
                    <p>Eu sou:</p>
                    <div className='role-options'>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={role === "ALUNO"} 
                                onChange={() => setRole("ALUNO")} 
                            /> Aluno
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                checked={role === "PROFESSOR"} 
                                onChange={() => setRole("PROFESSOR")} 
                            /> Professor
                        </label>
                    </div>
                </div>

                <div className='input-field cpf-group'>
                    <input 
                        type="text" 
                        name="cpf"
                        placeholder="CPF (000.000.000-00)" 
                        value={formData.cpf} 
                        onChange={handleChange}
                        maxLength={14}
                        required 
                    />
                    <FaIdCard className='icon' />
                    <button 
                        type="button" 
                        onClick={handleConsultarCPF} 
                        className="btn-consultar"
                        disabled={loading}
                    >
                        {loading ? '...' : 'Consultar'}
                    </button>
                </div>

                <div className='input-field'>
                    <input 
                        type="text" 
                        name="nome"
                        placeholder="Nome (Preenchimento Automático)" 
                        value={formData.nome} 
                        onChange={handleChange}
                        readOnly 
                        required
                    />
                    <FaUser className='icon' />
                </div>

                <div className='input-field'>
                    <input 
                        type="date" 
                        name="nascimento"
                        value={formData.nascimento} 
                        onChange={handleChange}
                        readOnly 
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

                {role === 'PROFESSOR' && (
                    <>
                        <div className='input-field'>
                            <input 
                                type="text" 
                                name="matricula"
                                placeholder="Matrícula" 
                                value={formData.matricula} 
                                onChange={handleChange} 
                            />
                            <FaUniversity className='icon' />
                        </div>
                        <div className='input-field file-input'>
                            <label className="file-label">Comprovante (PDF/Imagem)</label>
                            <input 
                                type="file" 
                                accept=".pdf,image/*" 
                                onChange={(e) => setArquivo(e.target.files[0])} 
                            />
                            <FaFileUpload className='icon' />
                        </div>
                    </>
                )}

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
                    <input 
                        type="password" 
                        name="confirmarSenha"
                        placeholder="Confirmar Senha" 
                        value={formData.confirmarSenha} 
                        onChange={handleChange} 
                        required 
                    />
                    <FaLock className='icon' />
                </div>

                <button type="submit">Cadastrar</button>

                <div className='singnup-link'>
                    <p>Já tem uma conta? <Link to="/login">Entrar</Link></p>
                </div>
            </form>
        </div>
    );
};

export default Cadastro;