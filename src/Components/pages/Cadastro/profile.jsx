import { useState } from 'react';
import axios from 'axios';
// Importe ícones se precisar

const SectionVincularEscola = () => {
    const [token, setToken] = useState("");
    const [loading, setLoading] = useState(false);
    
    // IMPORTANTE: Recupere o token de autenticação do usuário logado
    // (Depende de onde você salvou no login: localStorage, Context, Cookies...)
    const userAuthToken = localStorage.getItem('token'); 

    const handleJoinSchool = async () => {
        if (!token || token.length < 6) {
            alert("Digite um token válido (mínimo 6 caracteres).");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/schools/join/',
                { token: token },
                {
                    headers: {
                        // O Django precisa saber QUEM está enviando o token
                        'Authorization': `Bearer ${userAuthToken}`, 
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Sucesso!
            alert(`Parabéns! ${response.data.message}`);
            // Aqui você deve recarregar a página ou atualizar o estado global 
            // para mostrar as ferramentas de professor
            window.location.reload(); 

        } catch (error) {
            console.error("Erro token:", error);
            
            if (error.response) {
                // Erro de Negócio (ex: Token esgotado, espere 15 min)
                // O backend retorna { "error": "Token esgotado..." }
                alert(error.response.data.error || "Erro ao validar token.");
            } else {
                alert("Erro de conexão com o servidor.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card-token-escola" style={{ 
            padding: '20px', 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            marginTop: '20px',
            backgroundColor: '#f9f9f9'
        }}>
            <h3>Sou Professor</h3>
            <p>Possui um código de convite da sua escola? Insira abaixo para ativar seu perfil de professor.</p>
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <input 
                    type="text" 
                    placeholder="Ex: ABC12345" 
                    value={token}
                    onChange={(e) => setToken(e.target.value.toUpperCase())}
                    style={{ 
                        padding: '10px', 
                        borderRadius: '5px', 
                        border: '1px solid #ccc',
                        flex: 1 
                    }}
                />
                <button 
                    onClick={handleJoinSchool} 
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? 'Validando...' : 'Ativar Professor'}
                </button>
            </div>
        </div>
    );
};

export default SectionVincularEscola;