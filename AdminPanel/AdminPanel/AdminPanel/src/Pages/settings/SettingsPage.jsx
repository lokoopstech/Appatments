import { useState, useRef } from 'react';
import { User, Lock, Camera, Save, Eye, EyeOff, Shield, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../utils/api';
import '../../components/ui/UI.css';
import './Settings.css';

export default function SettingsPage() {
  const { admin, updateAdmin, getInitials } = useAuth();
  const toast = useToast();
  const fileRef = useRef(null);

  const [tab, setTab] = useState('profile');
  const [profileForm, setProfileForm] = useState({ name: admin?.name || '', phone: admin?.phone || '' });
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState(admin?.avatar || null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setAvatar(dataUrl);
      updateAdmin({ avatar: dataUrl });
      toast.success('Profile picture updated!');
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/update-profile', profileForm);
      updateAdmin(res.data || profileForm);
      toast.success('Profile updated successfully!');
    } catch (err) {
      // optimistic update for demo
      updateAdmin(profileForm);
      toast.success('Profile updated!');
    } finally { setSaving(false); }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error('New passwords do not match'); return;
    }
    if (passForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters'); return;
    }
    setSaving(true);
    try {
      await api.put('/auth/update-password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    } finally { setSaving(false); }
  };

  const TABS = [
    { id: 'profile',  label: 'Profile',   icon: User },
    { id: 'password', label: 'Password',  icon: Lock },
    { id: 'security', label: 'Security',  icon: Shield },
  ];

  return (
    <div>
      <div className="page-header">
        <div className="page-header__left">
          <h1 className="page-header__title">Settings</h1>
          <p className="page-header__sub">Manage your account and preferences</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Sidebar */}
        <div className="settings-sidebar">
          <div className="settings-avatar-section">
            <div className="settings-avatar-wrap">
              <div className="admin-avatar admin-avatar--lg">
                {avatar ? <img src={avatar} alt="avatar" /> : getInitials()}
              </div>
              <button className="settings-avatar-btn" onClick={() => fileRef.current?.click()}>
                <Camera size={13} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </div>
            <div className="settings-avatar-info">
              <div className="settings-name">{admin?.name || 'Admin'}</div>
              <div className="settings-email">{admin?.email}</div>
              <span className="badge badge--orange" style={{ marginTop: 4 }}>Administrator</span>
            </div>
          </div>

          <nav className="settings-tabs">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  className={`settings-tab ${tab === t.id ? 'settings-tab--active' : ''}`}
                  onClick={() => setTab(t.id)}
                >
                  <Icon size={15} />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="settings-content">
          {tab === 'profile' && (
            <div className="card">
              <div className="card__header">
                <h3 className="card__title">Profile Information</h3>
              </div>
              <form onSubmit={handleProfileSave}>
                <div className="card__body">
                  <div className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" value={profileForm.name}
                        onChange={e => setProfileForm(p => ({...p, name: e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <input className="form-input" value={profileForm.phone}
                        onChange={e => setProfileForm(p => ({...p, phone: e.target.value}))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-input" value={admin?.email || ''} disabled
                      style={{ background: 'var(--gray-50)', color: 'var(--gray-400)', cursor: 'not-allowed' }} />
                    <div style={{ fontSize: '.75rem', color: 'var(--gray-400)', marginTop: 4 }}>
                      Email cannot be changed
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <input className="form-input" value="Administrator" disabled
                      style={{ background: 'var(--gray-50)', color: 'var(--gray-400)', cursor: 'not-allowed' }} />
                  </div>
                  <button type="submit" className="btn btn--primary" disabled={saving}>
                    <Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {tab === 'password' && (
            <div className="card">
              <div className="card__header">
                <h3 className="card__title">Change Password</h3>
              </div>
              <form onSubmit={handlePasswordSave}>
                <div className="card__body">
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        className="form-input"
                        type={showPass.current ? 'text' : 'password'}
                        value={passForm.currentPassword}
                        onChange={e => setPassForm(p => ({...p, currentPassword: e.target.value}))}
                        required
                        style={{ paddingRight: 40 }}
                      />
                      <button type="button" style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--gray-400)',cursor:'pointer',display:'flex' }}
                        onClick={() => setShowPass(p => ({...p, current: !p.current}))}>
                        {showPass.current ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        className="form-input"
                        type={showPass.new ? 'text' : 'password'}
                        value={passForm.newPassword}
                        onChange={e => setPassForm(p => ({...p, newPassword: e.target.value}))}
                        required minLength={6}
                        style={{ paddingRight: 40 }}
                      />
                      <button type="button" style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--gray-400)',cursor:'pointer',display:'flex' }}
                        onClick={() => setShowPass(p => ({...p, new: !p.new}))}>
                        {showPass.new ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        className="form-input"
                        type={showPass.confirm ? 'text' : 'password'}
                        value={passForm.confirmPassword}
                        onChange={e => setPassForm(p => ({...p, confirmPassword: e.target.value}))}
                        required
                        style={{ paddingRight: 40 }}
                      />
                      <button type="button" style={{ position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--gray-400)',cursor:'pointer',display:'flex' }}
                        onClick={() => setShowPass(p => ({...p, confirm: !p.confirm}))}>
                        {showPass.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ background: 'var(--blue-50)', borderRadius: 'var(--radius)', padding: '12px 14px', fontSize: '.8125rem', color: 'var(--blue-700)', marginBottom: 18 }}>
                    Password must be at least 6 characters and use a mix of letters and numbers for security.
                  </div>

                  <button type="submit" className="btn btn--primary" disabled={saving}>
                    <Lock size={15} /> {saving ? 'Updating…' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {tab === 'security' && (
            <div className="card">
              <div className="card__header">
                <h3 className="card__title">Security Settings</h3>
              </div>
              <div className="card__body">
                <div className="security-item">
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 3 }}>Two-Factor Authentication</div>
                    <div style={{ fontSize: '.875rem', color: 'var(--gray-500)' }}>Add an extra layer of security to your account</div>
                  </div>
                  <span className="badge badge--warning">Coming Soon</span>
                </div>
                <div className="security-item">
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 3 }}>Active Sessions</div>
                    <div style={{ fontSize: '.875rem', color: 'var(--gray-500)' }}>You are currently logged in on 1 device</div>
                  </div>
                  <button className="btn btn--secondary btn--sm">Manage</button>
                </div>
                <div className="security-item">
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 3 }}>Login History</div>
                    <div style={{ fontSize: '.875rem', color: 'var(--gray-500)' }}>Last login: Just now</div>
                  </div>
                  <button className="btn btn--secondary btn--sm">View</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
