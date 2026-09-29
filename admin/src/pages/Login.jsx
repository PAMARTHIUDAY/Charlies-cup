import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState('phone');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const sendOTP = async () => {
    setLoading(true);
    try {
      await authAPI.sendOTP(phone);
      setStage('otp');
      alert('OTP sent! Dev OTP: 123456 (or check server logs)');
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const verify = async () => {
    setLoading(true);
    try {
      const { data } = await authAPI.verifyOTP(phone, otp);
      localStorage.setItem('cc_token', data.token);
      localStorage.setItem('cc_user', JSON.stringify(data.user));
      nav('/');
    } catch (e) {
      alert(e.response?.data?.error || 'Invalid OTP');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-card p-10 rounded-2xl border border-coral/30 w-full max-w-md">
        <div className="text-5xl font-script text-coral text-center mb-2">
          Charlie's Cup
        </div>
        <p className="text-center text-cream/60 mb-8">Admin Login</p>

        {stage === 'phone' ? (
          <>
            <input
              className="w-full px-4 py-3 bg-ink rounded-xl border border-coral/20 mb-4 outline-none focus:border-coral"
              placeholder="+91 phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <button
              disabled={loading || !phone}
              onClick={sendOTP}
              className="w-full py-3 bg-coral rounded-xl font-semibold hover:bg-coral/90 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            <p className="text-xs text-cream/40 mt-3 text-center">
              Dev tip: use OTP <strong className="text-coral">123456</strong>
            </p>
          </>
        ) : (
          <>
            <input
              className="w-full px-4 py-3 bg-ink rounded-xl border border-coral/20 mb-4 outline-none focus:border-coral text-center text-2xl tracking-widest"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
            <button
              disabled={loading || otp.length !== 6}
              onClick={verify}
              className="w-full py-3 bg-coral rounded-xl font-semibold hover:bg-coral/90 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Enter'}
            </button>
            <button
              onClick={() => setStage('phone')}
              className="w-full py-2 mt-2 text-cream/60 text-sm hover:text-coral"
            >
              ← Change number
            </button>
          </>
        )}
      </div>
    </div>
  );
}
