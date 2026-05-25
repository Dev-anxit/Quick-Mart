import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/uiStore';
import './LoginPanel.css';

export function LoginPanel() {
  const { loginWithGoogle, loginWithPhone, verifyOTP, isLoading, isLoggedIn } = useAuth();
  const { isAuthModalOpen, setAuthModalOpen } = useUIStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] = useState<{ phoneNumber: string } | null>(null);

  useEffect(() => {
    if (isLoggedIn && isAuthModalOpen) {
      setAuthModalOpen(false);
    }
  }, [isLoggedIn, isAuthModalOpen, setAuthModalOpen]);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (showOTPInput) {
      otpRefs.current[0]?.focus();
    }
  }, [showOTPInput]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (phoneNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit phone number');
      return;
    }
    try {
      const result = await loginWithPhone(phoneNumber);
      setConfirmationResult(result);
      setShowOTPInput(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send OTP';
      setErrorMessage(message);
    }
  };

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otpDigits];
    next[idx] = val;
    setOtpDigits(next);
    if (val && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtpDigits(text.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const otp = otpDigits.join('');
    if (!confirmationResult || otp.length !== 6) {
      setErrorMessage('Please enter all 6 digits');
      return;
    }
    try {
      await verifyOTP(otp, confirmationResult);
      setPhoneNumber('');
      setOtpDigits(['', '', '', '', '', '']);
      setConfirmationResult(null);
      setShowOTPInput(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid OTP';
      setErrorMessage(message);
    }
  };

  const handleResendOTP = async () => {
    setErrorMessage('');
    setOtpDigits(['', '', '', '', '', '']);
    try {
      const result = await loginWithPhone(phoneNumber);
      setConfirmationResult(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resend OTP';
      setErrorMessage(message);
    }
  };

  return (
    <div className={`auth-layout ${isAuthModalOpen ? 'auth-modal-layout' : ''}`}>
      {/* Left banner */}
      <div className="auth-banner">
        <div className="banner-content">
          <div className="banner-logo">🛒</div>
          <h1>Fresh Groceries,<br />Delivered in<br /><span>10 Minutes.</span></h1>
          <p>Join millions of users and experience lightning-fast grocery delivery right to your doorstep.</p>
          <div className="banner-features">
            <div className="banner-feature">⚡ Instant 10-min delivery</div>
            <div className="banner-feature">🌿 5000+ fresh products</div>
            <div className="banner-feature">💳 Secure Razorpay payments</div>
            <div className="banner-feature">🎁 Exclusive member deals</div>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-form-container" style={{ position: 'relative' }}>
        {isAuthModalOpen && (
          <button 
            type="button" 
            onClick={() => setAuthModalOpen(false)} 
            className="auth-modal-close-btn"
          >
            ✕
          </button>
        )}
        <div className="auth-form-wrapper">
          <div className="brand-header">
            <span className="brand-logo">🛒</span>
            <h2>QuickMart</h2>
          </div>

          {!showOTPInput ? (
            <>
              <h3 className="form-title">Welcome Back!</h3>
              <p className="form-subtitle">Login or create an account in seconds</p>

              {errorMessage && (
                <div className="error-banner">{errorMessage}</div>
              )}

              <form onSubmit={handlePhoneSubmit}>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="phone-input-wrapper">
                    <span className="country-code">🇮🇳 +91</span>
                    <input
                      id="phone"
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10-digit number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      disabled={isLoading}
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || phoneNumber.length < 10}
                  className="primary-btn"
                >
                  {isLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                      <span className="spinner" /> Sending OTP...
                    </span>
                  ) : 'Get OTP →'}
                </button>
              </form>

              <div className="divider"><span>or</span></div>

              {/* Google Login */}
              <button 
                className="google-btn" 
                onClick={loginWithGoogle} 
                disabled={isLoading} 
                type="button"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="google-icon" />
                Continue with Google
              </button>

              <p className="auth-terms">
                By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </p>
            </>
          ) : (
            <>
              <div className="otp-header">
                <div className="otp-icon">📱</div>
                <h3 className="form-title">Verify Your Number</h3>
                <p className="form-subtitle">OTP sent to <strong>+91 {phoneNumber}</strong></p>
              </div>

              {errorMessage && (
                <div className="error-banner">{errorMessage}</div>
              )}

              <form onSubmit={handleOTPVerify}>
                <div className="form-group">
                  <label>Enter 6-digit OTP</label>
                  <div className="otp-boxes" onPaste={handleOtpPaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={el => { otpRefs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(idx, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(idx, e)}
                        className={`otp-box ${digit ? 'filled' : ''}`}
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                  <p className="resend-text">
                    Didn't receive OTP?{' '}
                    <button type="button" onClick={handleResendOTP} disabled={isLoading} className="resend-btn">
                      Resend OTP
                    </button>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpDigits.join('').length !== 6}
                  className="primary-btn"
                >
                  {isLoading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
                      <span className="spinner" /> Verifying...
                    </span>
                  ) : '✓ Verify & Login'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowOTPInput(false); setErrorMessage(''); setOtpDigits(['','','','','','']); }}
                  disabled={isLoading}
                  className="back-btn"
                >
                  ← Change Phone Number
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
