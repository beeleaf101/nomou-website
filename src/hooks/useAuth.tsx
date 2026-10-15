import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Plan = 'trial' | 'bronze' | 'silver' | 'gold';

export interface NodeDevice {
  id: string; name: string; location: string;
  lat: number; lng: number;
  status: 'online'|'offline'|'warning';
  lastSeen: string;
  soil: number; air: number; water: number; temp: number; humidity: number;
}

export interface User {
  id: string; name: string; email: string;
  plan: Plan; company?: string;
  trialEndsAt?: string;
  avatarUrl?: string;
  nodes: NodeDevice[];
}

interface AuthContextType {
  user: User | null; loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, company?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updatePlan: (plan: Plan) => Promise<void>;
  isLoggedIn: boolean;
}

const API_BASE = (import.meta.env.VITE_NOMOU_API_URL as string | undefined)?.replace(/\/+$/, '') || 'https://api.nomou.app';
const TOKEN_KEY = 'nomou_access_token';

async function api(path: string, init: RequestInit = {}, token?: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

function mapUser(raw: any): User {
  return {
    id: raw.id,
    name: raw.name ?? raw.full_name ?? 'Nomou User',
    email: raw.email ?? '',
    plan: (raw.plan ?? 'trial') as Plan,
    company: raw.company ?? undefined,
    trialEndsAt: raw.trialEndsAt ?? raw.trial_ends_at ?? undefined,
    avatarUrl: raw.avatarUrl ?? raw.avatar_url ?? undefined,
    nodes: Array.isArray(raw.nodes) ? raw.nodes : [],
  };
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  signInWithGoogle: async () => ({ success: false }),
  logout: async () => {},
  updatePlan: async () => {},
  isLoggedIn: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const hash = window.location.hash;
      const googleMatch = hash.match(/[?&]google_token=([^&]+)/);
      if (googleMatch?.[1]) {
        const token = decodeURIComponent(googleMatch[1]);
        localStorage.setItem(TOKEN_KEY, token);
        const me = await api('/api/auth/me', { method: 'GET' }, token);
        if (me.ok && me.data?.user) {
          setUser(mapUser(me.data.user));
          window.history.replaceState({}, document.title, window.location.pathname + '#/portal/dashboard');
          setLoading(false);
          return;
        }
        localStorage.removeItem(TOKEN_KEY);
      }

      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }

      const me = await api('/api/auth/me', { method: 'GET' }, token);
      if (me.ok && me.data?.user) setUser(mapUser(me.data.user));
      else localStorage.removeItem(TOKEN_KEY);
      setLoading(false);
    };

    restore();
  }, []);

  const login = async (email: string, password: string) => {
    const { ok, data } = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (!ok) return { success: false, error: data.error ?? 'Invalid email or password.' };

    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(mapUser(data.user));
    return { success: true };
  };

  const signup = async (name: string, email: string, password: string, company?: string) => {
    const { ok, data } = await api('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, company }),
    });
    if (!ok) return { success: false, error: data.error ?? 'Sign up failed.' };

    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(mapUser(data.user));
    return { success: true };
  };

  const signInWithGoogle = async () => {
    const returnTo = window.location.origin;
    window.location.assign(`${API_BASE}/api/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`);
    return { success: true };
  };

  const logout = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      await api('/api/auth/logout', { method: 'POST' }, token).catch(() => null);
    }
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const updatePlan = async (plan: Plan) => {
    if (!user) return;
    setUser({ ...user, plan });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, signInWithGoogle, logout, updatePlan, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
