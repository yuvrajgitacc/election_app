export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      background: '#f8f9fa',
      borderTop: '1px solid var(--border)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            color: 'var(--text-primary)',
            marginBottom: '6px'
          }}>
            <span style={{ fontStyle: 'italic' }}>Election</span>
            <span style={{ 
              color: 'var(--accent)', 
              fontFamily: 'var(--font-body)',
              fontWeight: 300 
            }}>App</span>
          </div>
          <p style={{ 
            fontSize: '13px', 
            color: 'var(--text-muted)' 
          }}>
            AI-powered civic education for everyone.
          </p>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '24px' 
        }}>
          {['About', 'Privacy', 'Contact'].map(link => (
            <a key={link} href="#" style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}>
              {link}
            </a>
          ))}
        </div>
      </div>
      <div style={{
        borderTop: '1px solid var(--border)',
        padding: '20px 24px',
        textAlign: 'center'
      }}>
        <p style={{ 
          fontSize: '12px', 
          color: 'var(--text-muted)' 
        }}>
          Built with Gemini AI and Firebase · ElectionApp 2025
        </p>
      </div>
    </footer>
  )
}
