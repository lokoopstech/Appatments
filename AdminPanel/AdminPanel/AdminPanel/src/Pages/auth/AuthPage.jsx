import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Phone, Building2, AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../utils/api';
import './Auth.css';

export default function AuthPage() {
  const [tab, setTab] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const toast = useToast();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', phone: '', password: '' });



const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);                               // ✅ added
  try {
    const res = await api.post('/auth/login', loginForm);

    if (!res.data || res.data.role !== 'admin') {
      toast.error('Access denied. Admin accounts only.');
      return;
    }

    login(res.data, res.token);
    toast.success(`Welcome back, ${res.data.name || res.data.email}!`);
  } catch (err) {
    toast.error(err.message || 'Login failed');
  } finally {
    setLoading(false);                            // ✅ added
  }
};

const handleSignup = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await api.post('/auth/admin/register', signupForm);

    if (!res.data) {
      toast.error('Registration failed. Try again.');
      return;
    }

    login(res.data, res.token);
    toast.success('Admin account created successfully!');
  } catch (err) {
    toast.error(err.message || 'Signup failed');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="auth-root">
      {/* Brand Panel */}
      <div className="auth-brand">
        <div className="auth-brand__logo">
          <div className="auth-brand__logo-icon">
            <Building2 size={24} color="white" />
          </div>
          <span className="auth-brand__logo-text">SpaceHubAdmin</span>
        </div>
        <p className="auth-brand__tagline">Property Management Suite</p>
        <h1 className="auth-brand__title">
          Manage your<br /><span>properties</span><br />with confidence
        </h1>
        <p className="auth-brand__desc">
          A powerful admin dashboard to control apartments, bookings, guests, analytics, and content — all in one place.
        </p>
        <div className="auth-brand__stats">
          <div>
            <span className="auth-stat__value">50+</span>
            <span className="auth-stat__label">Endpoints</span>
          </div>
          <div>
            <span className="auth-stat__value">7</span>
            <span className="auth-stat__label">Modules</span>
          </div>
          <div>
            <span className="auth-stat__value">Real-time</span>
            <span className="auth-stat__label">Analytics</span>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-box">
          <div className="auth-form-box__header">
            <p className="auth-form-box__eyebrow">Admin Portal</p>
            <h2 className="auth-form-box__title">
              {tab === 'login' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="auth-form-box__sub">
              {tab === 'login'
                ? 'Sign in to access your dashboard'
                : 'Set up the admin account for this system'}
            </p>
          </div>

          <div className="auth-tabs">
            <button className={`auth-tab ${tab === 'login' ? 'auth-tab--active' : ''}`} onClick={() => setTab('login')}>
              Sign In
            </button>
            <button className={`auth-tab ${tab === 'signup' ? 'auth-tab--active' : ''}`} onClick={() => setTab('signup')}>
              Register Admin
            </button>
          </div>

          {tab === 'signup' && (
            <div className="auth-notice">
              <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              Only one admin account is allowed. This option will be disabled once an admin has been registered.
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className="auth-field">
                <label className="auth-field__label">Email Address</label>
                <div className="auth-field__wrap">
                  <span className="auth-field__icon"><Mail size={16} /></span>
                  <input
                    className="auth-field__input"
                    type="email"
                    placeholder="admin@example.com"
                    value={loginForm.email}
                    onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-field__label">Password</label>
                <div className="auth-field__wrap">
                  <span className="auth-field__icon"><Lock size={16} /></span>
                  <input
                    className="auth-field__input"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                    required
                  />
                  <button type="button" className="auth-field__toggle" onClick={() => setShowPass(p => !p)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button className="auth-btn auth-btn--primary" type="submit" disabled={loading}>
                {loading ? 'Signing in…' : <><LogIn size={16} /> Sign In to Dashboard</>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignup}>
              <div className="auth-field">
                <label className="auth-field__label">Full Name</label>
                <div className="auth-field__wrap">
                  <span className="auth-field__icon"><User size={16} /></span>
                  <input className="auth-field__input" type="text" placeholder="Your full name"
                    value={signupForm.name}
                    onChange={e => setSignupForm(p => ({ ...p, name: e.target.value }))} required />
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-field__label">Email Address</label>
                <div className="auth-field__wrap">
                  <span className="auth-field__icon"><Mail size={16} /></span>
                  <input className="auth-field__input" type="email" placeholder="admin@example.com"
                    value={signupForm.email}
                    onChange={e => setSignupForm(p => ({ ...p, email: e.target.value }))} required />
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-field__label">Phone (optional)</label>
                <div className="auth-field__wrap">
                  <span className="auth-field__icon"><Phone size={16} /></span>
                  <input className="auth-field__input" type="tel" placeholder="+1 (555) 000-0000"
                    value={signupForm.phone}
                    onChange={e => setSignupForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-field__label">Password</label>
                <div className="auth-field__wrap">
                  <span className="auth-field__icon"><Lock size={16} /></span>
                  <input className="auth-field__input"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={signupForm.password}
                    onChange={e => setSignupForm(p => ({ ...p, password: e.target.value }))} required />
                  <button type="button" className="auth-field__toggle" onClick={() => setShowPass(p => !p)}>
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button className="auth-btn auth-btn--primary" type="submit" disabled={loading}>
                {loading ? 'Creating…' : <><UserPlus size={16} /> Create Admin Account</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
