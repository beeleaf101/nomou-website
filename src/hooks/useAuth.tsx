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
  nodes: NodeDevice[];
}

interface AuthContextType {
  user: User | null; loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, company?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updatePlan: (plan: Plan) => Promise<void>;
  isLoggedIn: boolean;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const TOKEN_KEY = 'nomou_access_token';
const REFRESH_KEY = 'nomou_refresh_token';

async function sbFetch(method: string, path: string, body?: unknown, token?: string) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token ?? SUPABASE_ANON_KEY}`,
      ...(method !== 'GET' ? { 'Prefer': 'return=representation' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

async function authPost(path: string, body: unknown) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, data: await res.json() };
}

async function loadProfile(token: string, userId: string): Promise<User | null> {
  const [pRes, nRes] = await Promise.all([
    sbFetch('GET', `/rest/v1/profiles?id=eq.${userId}&select=*`, undefined, token),
    sbFetch('GET', `/rest/v1/nodes?user_id=eq.${userId}&select=*`, undefined, token),
  ]);
  if (!pRes.ok || !pRes.data?.[0]) return null;
  const p = pRes.data[0];
  const nodes: NodeDevice[] = (nRes.data ?? []).map((n: Record<string,unknown>) => ({
    id: n.id as string, name: n.name as string, location: n.location as string,
    lat: n.lat as number, lng: n.lng as number,
    status: n.status as 'online'|'offline'|'warning',
    lastSeen: n.last_seen as string ?? '—',
    soil: n.soil as number ?? 0, air: n.air as number ?? 0,
    water: n.water as number ?? 0, temp: n.temp as number ?? 0,
    humidity: n.humidity as number ?? 0,
  }));
  return { id: userId, name: p.full_name, email: p.email, plan: p.plan as Plan, company: p.company, trialEndsAt: p.trial_ends_at, nodes };
}

const AuthContext = createContext<AuthContextType>({
  user: null, loading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: async () => {},
  updatePlan: async () => {},
  isLoggedIn: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const refresh = localStorage.getItem(REFRESH_KEY);
      if (!token) { setLoading(false); return; }
      const meRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${token}` },
      });
      if (meRes.ok) {
        const me = await meRes.json();
        setUser(await loadProfile(token, me.id));
      } else if (refresh) {
        const r = await authPost('/token?grant_type=refresh_token', { refresh_token: refresh });
        if (r.ok && r.data.access_token) {
          localStorage.setItem(TOKEN_KEY, r.data.access_token);
          localStorage.setItem(REFRESH_KEY, r.data.refresh_token);
          setUser(await loadProfile(r.data.access_token, r.data.user.id));
        } else { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(REFRESH_KEY); }
      }
      setLoading(false);
    };
    restore();
  }, []);

  const login = async (email: string, password: string) => {
    const { ok, data } = await authPost('/token?grant_type=password', { email, password });
    if (!ok) return { success: false, error: data.error_description ?? 'Invalid email or password.' };
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(REFRESH_KEY, data.refresh_token);
    const profile = await loadProfile(data.access_token, data.user.id);
    if (!profile) return { success: false, error: 'Profile not found.' };
    setUser(profile);
    return { success: true };
  };

  const signup = async (name: string, email: string, password: string, company?: string) => {
    const { ok, data } = await authPost('/signup', { email, password });
    if (!ok) return { success: false, error: data.msg ?? data.error_description ?? 'Sign up failed.' };
    const token = data.access_token; const userId = data.user?.id;
    if (!token || !userId) return { success: false, error: 'Sign up failed.' };
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_KEY, data.refresh_token);
    await sbFetch('POST', '/rest/v1/profiles', {
      id: userId, full_name: name, email, company: company ?? null,
      plan: 'trial',
      trial_ends_at: new Date(Date.now() + 14 * 86400000).toISOString(),
    }, token);
    setUser({ id: userId, name, email, plan: 'trial', company, nodes: [],
      trialEndsAt: new Date(Date.now() + 14 * 86400000).toISOString() });
    return { success: true };
  };

  const logout = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST', headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${token}` },
    });
    localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(REFRESH_KEY);
    setUser(null);
  };

  const updatePlan = async (plan: Plan) => {
    if (!user) return;
    const token = localStorage.getItem(TOKEN_KEY);
    await sbFetch('PATCH', `/rest/v1/profiles?id=eq.${user.id}`, { plan }, token ?? undefined);
    setUser({ ...user, plan });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updatePlan, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
