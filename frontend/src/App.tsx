import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Listing from './pages/Listing';
import Detail from './pages/Detail';
import Search from './pages/Search';
import Checkout from './pages/Checkout';
import Track from './pages/Track';
import Account from './pages/Account';
import Admin from './pages/Admin';

import { useUIStore } from './store/uiStore';

function App() {
  const toasts = useUIStore(state => state.toasts);
  const removeToast = useUIStore(state => state.removeToast);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listing" element={<Listing />} />
          <Route path="/product/:id" element={<Detail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track/:orderId" element={<Track />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {toasts.map(t => (
           <div key={t.id} onClick={() => removeToast(t.id)} style={{ background: t.type === 'error' ? '#ef4444' : '#10b981', color: 'white', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', cursor: 'pointer', fontFamily: 'sans-serif', fontWeight: 600 }}>
             {t.message}
           </div>
        ))}
      </div>
    </>
  );
}

export default App;
