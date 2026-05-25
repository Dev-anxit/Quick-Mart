import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Listing from './pages/Listing';
import Detail from './pages/Detail';
import Search from './pages/Search';
import Checkout from './pages/Checkout';
import Track from './pages/Track';
import Account from './pages/Account';
import Admin from './pages/Admin';
import OrderConfirmation from './pages/OrderConfirmation';
import { LoginPanel } from './components/LoginPanel';

import { useUIStore } from './store/uiStore';

function App() {
  const toasts = useUIStore(state => state.toasts);
  const removeToast = useUIStore(state => state.removeToast);
  const isAuthModalOpen = useUIStore(state => state.isAuthModalOpen);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listing" element={<Listing />} />
          <Route path="/product/:id" element={<Detail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/track/:orderId" element={<Track />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      {/* Global Login Modal Overlay */}
      {isAuthModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          animation: 'fadeInModal 0.2s ease-out'
        }}>
          <div style={{
            background: 'white', borderRadius: '24px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            maxWidth: '450px', width: '100%', position: 'relative',
            overflow: 'hidden', margin: '20px'
          }}>
            <LoginPanel />
          </div>
        </div>
      )}

      <div style={{
        position: 'fixed', top: '80px', right: '20px', zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: '10px',
        maxWidth: 360, width: '100%',
      }}>
        {toasts.map(t => {
          const styles: Record<string, { bg: string; icon: string; border: string }> = {
            success: { bg: 'linear-gradient(135deg, #0d9e6e, #059669)', icon: '✓', border: '#065f46' },
            error:   { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', icon: '✕', border: '#991b1b' },
            info:    { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', icon: 'ℹ', border: '#1d4ed8' },
            warning: { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', icon: '⚠', border: '#92400e' },
          };
          const s = styles[t.type] || styles.info;
          return (
            <div
              key={t.id}
              onClick={() => removeToast(t.id)}
              style={{
                background: s.bg,
                color: 'white',
                padding: '12px 16px',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                animation: 'slideInToast 0.3s ease',
                border: `1px solid ${s.border}40`,
              }}
            >
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem', fontWeight: 900 }}>{s.icon}</span>
              <span style={{ flex: 1 }}>{t.message}</span>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes slideInToast {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeInModal {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}

export default App;
