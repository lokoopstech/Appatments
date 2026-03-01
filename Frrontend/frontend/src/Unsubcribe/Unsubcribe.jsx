// src/hooks/useSubscribe.js
import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Reusable subscription hook.
 * Usage:
 *   const { email, setEmail, status, error, handleSubscribe } = useSubscribe({ source: 'footer' });
 *
 * status: 'idle' | 'loading' | 'success' | 'already_subscribed' | 'error'
 */
export const useSubscribe = ({ source = 'footer', name = '' } = {}) => {
  const [email, setEmail]   = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | already_subscribed | error
  const [error, setError]   = useState('');

  const handleSubscribe = async (e) => {
    e?.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setError('');

    try {
      const res  = await fetch(`${API_BASE}/subscriptions/subscribe`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          email: email.trim(),
          name:  name.trim() || undefined,
          source,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message?.toLowerCase().includes('already subscribed')) {
          setStatus('already_subscribed');
        } else {
          throw new Error(data.message || 'Subscription failed');
        }
        return;
      }

      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  const reset = () => { setStatus('idle'); setEmail(''); setError(''); };

  return { email, setEmail, status, error, handleSubscribe, reset };
};