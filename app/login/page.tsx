'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular um pequeno delay para melhor UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (code.length !== 4) {
      setError('O código deve ter exatamente 4 números');
      setIsLoading(false);
      return;
    }

    if (!/^\d{4}$/.test(code)) {
      setError('O código deve conter apenas números');
      setIsLoading(false);
      return;
    }

    const success = login(code);
    if (success) {
      router.push('/');
    } else {
      setError('Código incorreto. Tente novamente.');
      setCode('');
    }
    setIsLoading(false);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir apenas números e limitar a 4 dígitos
    if (/^\d*$/.test(value) && value.length <= 4) {
      setCode(value);
      setError('');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f9fafb',
      padding: '48px 16px'
    }}>
      <div style={{ 
        maxWidth: '448px', 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '32px' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            margin: '0 auto',
            height: '48px',
            width: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            backgroundColor: '#dbeafe'
          }}>
            🔒
          </div>
          <h2 style={{
            marginTop: '24px',
            fontSize: '30px',
            fontWeight: '800',
            color: '#111827',
            textAlign: 'center'
          }}>
            Acesso ao Sistema
          </h2>
          <p style={{
            marginTop: '8px',
            fontSize: '14px',
            color: '#6b7280',
            textAlign: 'center'
          }}>
            Digite o código de 4 números para acessar o sistema
          </p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label htmlFor="code" style={{ display: 'none' }}>
              Código de Acesso
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="code"
                name="code"
                type="password"
                required
                value={code}
                onChange={handleCodeChange}
                style={{
                  appearance: 'none',
                  borderRadius: '8px',
                  position: 'relative',
                  display: 'block',
                  width: '100%',
                  padding: '16px 12px',
                  textAlign: 'center',
                  fontSize: '24px',
                  fontFamily: 'monospace',
                  letterSpacing: '0.2em',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  color: '#111827',
                  outline: 'none'
                }}
                placeholder="0000"
                maxLength={4}
                autoComplete="off"
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div style={{
              borderRadius: '6px',
              backgroundColor: '#fef2f2',
              padding: '16px',
              border: '1px solid #fecaca'
            }}>
              <div style={{ fontSize: '14px', color: '#991b1b' }}>{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || code.length !== 4}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                padding: '16px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '8px',
                color: '#ffffff',
                backgroundColor: isLoading || code.length !== 4 ? '#9ca3af' : '#2563eb',
                cursor: isLoading || code.length !== 4 ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => {
                if (!isLoading && code.length === 4) {
                  e.currentTarget.style.backgroundColor = '#1d4ed8';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading && code.length === 4) {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                }
              }}
            >
              {isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid #ffffff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px'
                  }}></div>
                  Verificando...
                </div>
              ) : (
                'Entrar no Sistema'
              )}
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>
              Código padrão: <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>1234</span>
            </p>
          </div>
        </form>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
