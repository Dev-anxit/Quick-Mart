import type React from 'react';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import './LoginPanel.css';

export function LoginPanel() {
  const { loginWithGoogle, loginWithPhone, verifyOTP, isLoading } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGoogleClick = async () => {
    try {
      setErrorMessage('');
      await loginWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Google login is not available');
    }
  };

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
    } catch (error: any) {
      console.error('Phone login error:', error);
      setErrorMessage(error.message || 'Failed to send OTP');
    }
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!confirmationResult || otp.length !== 6 || !/^\d+$/.test(otp)) {
      setErrorMessage('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      await verifyOTP(otp, confirmationResult);
      setPhoneNumber('');
      setOtp('');
      setConfirmationResult(null);
      setShowOTPInput(false);
    } catch (error: any) {
      console.error('OTP error:', error);
      setErrorMessage(error.message || 'Invalid OTP');
    }
  };

  const handleResendOTP = async () => {
    setErrorMessage('');
    try {
      const result = await loginWithPhone(phoneNumber);
      setConfirmationResult(result);
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      setErrorMessage(error.message || 'Failed to resend OTP');
    }
  };

  const handleBackToPhone = () => {
    setOtp('');
    setShowOTPInput(false);
    setErrorMessage('');
  };

  return (
    <div className="auth-layout">
      <div className="auth-banner">
        <div className="banner-content">
          <h1>Fresh Groceries,<br/>Delivered in Minutes.</h1>
          <p>Join millions of users and experience lightning fast grocery delivery right to your doorstep.</p>
        </div>
      </div>
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <div className="brand-header">
            <span className="brand-logo">🛒</span>
            <h2>QuickMart</h2>
          </div>
          
          <h3 className="form-title">
            {showOTPInput ? 'Verify your number' : 'Welcome to QuickMart'}
          </h3>
          <p className="form-subtitle">
            {showOTPInput 
              ? `Enter the 6-digit OTP sent to +91${phoneNumber}` 
              : 'Log in or sign up to continue'}
          </p>

          {errorMessage && (
            <div style={{
              padding: '12px',
              marginBottom: '16px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c33',
              fontSize: '14px'
            }}>
              {errorMessage}
            </div>
          )}

          {!showOTPInput ? (
            <div className="form-content">
              <form onSubmit={handlePhoneSubmit}>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <div className="phone-input-wrapper">
                    <span className="country-code">+91</span>
                    <input
                      id="phone"
                      type="tel"
                      maxLength={10}
                      placeholder="Enter 10 digit number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || phoneNumber.length < 10}
                  className="primary-btn"
                >
                  {isLoading ? 'Sending OTP...' : 'Continue'}
                </button>
              </form>

              <div id="recaptcha-container" className="recaptcha" />

              <div className="divider">
                <span>or</span>
              </div>

              <button
                onClick={handleGoogleClick}
                disabled={isLoading}
                className="google-btn"
                type="button"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="google-icon" />
                Continue with Google
              </button>
            </div>
          ) : (
            <div className="form-content">
              <form onSubmit={handleOTPVerify}>
                <div className="form-group">
                  <label htmlFor="otp">One Time Password</label>
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    disabled={isLoading}
                    className="otp-field"
                    required
                    autoFocus
                  />
                  <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                    Didn't receive OTP?{' '}
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#10b981',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Resend OTP
                    </button>
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="primary-btn"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Proceed'}
                </button>
                <button
                  type="button"
                  onClick={handleBackToPhone}
                  disabled={isLoading}
                  className="back-btn"
                >
                  Change Phone Number
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
