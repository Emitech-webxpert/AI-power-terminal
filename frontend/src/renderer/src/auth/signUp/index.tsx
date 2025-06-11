// src/components/SignIn.tsx
import React from 'react'

interface SignInProps {
  onLoginSuccess: () => void
}

const SignIn: React.FC<SignInProps> = ({ onLoginSuccess }) => {
  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true')
    onLoginSuccess()
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        padding: '2rem',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>Terminal Access</h2>
        <p style={{ marginBottom: '1.5rem', color: '#666' }}>Please login to access terminal</p>
        <button 
          onClick={handleLogin}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Login
        </button>
      </div>
    </div>
  )
}

export default SignIn