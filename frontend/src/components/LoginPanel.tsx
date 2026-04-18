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

  const handleGoogleClick = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) return;
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const result = await loginWithPhone(formattedPhone);
      setConfirmationResult(result);
      setShowOTPInput(true);
    } catch (error) {
      console.error('Phone login error:', error);
    }
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult || otp.length !== 6) return;

    try {
      await verifyOTP(otp, confirmationResult);
      setPhoneNumber('');
      setOtp('');
      setConfirmationResult(null);
      setShowOTPInput(false);
    } catch (error) {
      console.error('OTP error:', error);
    }
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
              ? `Enter the 6-digit OTP sent to +91 ${phoneNumber}` 
              : 'Log in or sign up to continue'}
          </p>

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
                  />
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
                  onClick={() => {
                    setShowOTPInput(false);
                    setOtp('');
                  }}
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
