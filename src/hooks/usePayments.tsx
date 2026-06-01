import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type NodeRequestStatus = 'pending' | 'approved' | 'rejected';
export type PaymentStatus = 'unpaid' | 'paid' | 'overdue';

export interface NodeRequest {
  id: string; nodeName: string; location: string;
  requestedAt: string; status: NodeRequestStatus; approvedAt?: string;
}
export interface Payment {
  id: string; type: 'subscription'|'node'; label: string;
  amount: string; status: PaymentStatus; dueDate: string; paidAt?: string; nodeId?: string;
}
export interface Notification {
  id: string; title: string; message: string;
  type: 'info'|'warning'|'success'|'error'; read: boolean; createdAt: string;
}

interface PaymentContextType {
  nodeRequests: NodeRequest[]; payments: Payment[]; notifications: Notification[];
  requestNode: (name: string, location: string) => Promise<void>;
  approveNodeRequest: (id: string) => void;
  markPaymentPaid: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  unreadCount: number;
  addSubscriptionPayment: (plan: string, amount: string) => Promise<void>;
  loadFromSupabase: (userId: string, token: string) => Promise<void>;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

async function sb(method: string, path: string, body?: unknown, token?: string) {
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
  return { ok: res.ok, data: await res.json().catch(() => ({})) };
}

function dueIn(days: number) {
  const d = new Date(); d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function now() {
  return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

const PaymentContext = createContext<PaymentContextType>({
  nodeRequests:[], payments:[], notifications:[],
  requestNode: async()=>{}, approveNodeRequest:()=>{},
  markPaymentPaid: async()=>{}, markNotificationRead:()=>{}, markAllRead:()=>{},
  unreadCount:0, addSubscriptionPayment: async()=>{},
  loadFromSupabase: async()=>{},
});

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [nodeRequests, setNodeRequests] = useState<NodeRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string|null>(null);
  const [token, setToken] = useState<string|null>(null);

  const addNotification = (n: Omit<Notification,'id'|'read'|'createdAt'>) => {
    setNotifications(prev => [{ ...n, id: Date.now().toString(), read: false, createdAt: now() }, ...prev]);
  };

  const loadFromSupabase = async (uid: string, tok: string) => {
    setUserId(uid); setToken(tok);
    const [rRes, pRes] = await Promise.all([
      sb('GET', `/rest/v1/node_requests?user_id=eq.${uid}&order=created_at.desc&select=*`, undefined, tok),
      sb('GET', `/rest/v1/payments?user_id=eq.${uid}&order=created_at.desc&select=*`, undefined, tok),
    ]);
    if (rRes.ok && Array.isArray(rRes.data)) {
      setNodeRequests(rRes.data.map((r: Record<string,unknown>) => ({
        id: r.id as string, nodeName: r.node_name as string, location: r.location as string,
        requestedAt: new Date(r.created_at as string).toLocaleDateString(),
        status: r.status as NodeRequestStatus,
        approvedAt: r.approved_at ? new Date(r.approved_at as string).toLocaleDateString() : undefined,
      })));
    }
    if (pRes.ok && Array.isArray(pRes.data)) {
      setPayments(pRes.data.map((p: Record<string,unknown>) => ({
        id: p.id as string, type: p.type as 'subscription'|'node',
        label: p.label as string, amount: p.amount as string,
        status: p.status as PaymentStatus, dueDate: p.due_date as string,
        paidAt: p.paid_at as string|undefined, nodeId: p.node_id as string|undefined,
      })));
    }
  };

  const requestNode = async (name: string, location: string) => {
    const tempId = `REQ-${Date.now()}`;
    const newReq: NodeRequest = { id: tempId, nodeName: name, location, requestedAt: now(), status: 'pending' };
    setNodeRequests(prev => [newReq, ...prev]);
    addNotification({ type:'info', title:'Node Request Submitted', message:`"${name}" is pending approval. We'll notify you within 24h.` });
    if (userId && token) {
      const res = await sb('POST', '/rest/v1/node_requests',
        { user_id: userId, node_name: name, location, status: 'pending' }, token);
      if (res.ok && res.data?.[0]) {
        const real = res.data[0];
        setNodeRequests(prev => prev.map(r => r.id === tempId ? { ...r, id: real.id } : r));
        // Auto-approve after 3s for demo
        setTimeout(() => approveInSupabase(real.id, name, userId, token), 3000);
      }
    } else {
      setTimeout(() => approveLocal(tempId, name), 3000);
    }
  };

  const approveInSupabase = async (id: string, name: string, uid: string, tok: string) => {
    await sb('PATCH', `/rest/v1/node_requests?id=eq.${id}`,
      { status: 'approved', approved_at: new Date().toISOString() }, tok);
    setNodeRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved', approvedAt: now() } : r));
    const payRes = await sb('POST', '/rest/v1/payments', {
      user_id: uid, type: 'node', label: `Node Purchase: ${name}`,
      amount: 'KD 120', status: 'unpaid', due_date: dueIn(14), node_id: id,
    }, tok);
    if (payRes.ok && payRes.data?.[0]) {
      const p = payRes.data[0];
      setPayments(prev => [{ id: p.id, type:'node', label:`Node Purchase: ${name}`, amount:'KD 120', status:'unpaid', dueDate: dueIn(14), nodeId: id }, ...prev]);
    }
    addNotification({ type:'warning', title:'Node Approved — Payment Required', message:`"${name}" approved! Pay KD 120 within 14 days or data access pauses.` });
    addNotification({ type:'success', title:'Node Approved!', message:`"${name}" is ready to deploy once payment is confirmed.` });
  };

  const approveLocal = (id: string, name: string) => {
    setNodeRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved', approvedAt: now() } : r));
    const payId = `PAY-${Date.now()}`;
    setPayments(prev => [{ id: payId, type:'node', label:`Node Purchase: ${name}`, amount:'KD 120', status:'unpaid', dueDate: dueIn(14), nodeId: id }, ...prev]);
    addNotification({ type:'warning', title:'Node Approved — Payment Required', message:`"${name}" approved! Pay KD 120 within 14 days.` });
    addNotification({ type:'success', title:'Node Approved!', message:`"${name}" ready to deploy after payment.` });
  };

  const approveNodeRequest = (id: string) => {
    const req = nodeRequests.find(r => r.id === id);
    if (!req) return;
    if (userId && token) approveInSupabase(id, req.nodeName, userId, token);
    else approveLocal(id, req.nodeName);
  };

  const markPaymentPaid = async (id: string) => {
    if (userId && token) {
      await sb('PATCH', `/rest/v1/payments?id=eq.${id}`,
        { status: 'paid', paid_at: new Date().toISOString() }, token);
    }
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'paid', paidAt: now() } : p));
    const p = payments.find(pay => pay.id === id);
    addNotification({ type:'success', title:'Payment Confirmed', message: p ? `Payment for "${p.label}" received.` : 'Payment confirmed.' });
  };

  const addSubscriptionPayment = async (plan: string, amount: string) => {
    const label = `${plan} Plan — Monthly`;
    if (userId && token) {
      const res = await sb('POST', '/rest/v1/payments',
        { user_id: userId, type: 'subscription', label, amount, status: 'unpaid', due_date: dueIn(30) }, token);
      if (res.ok && res.data?.[0]) {
        const p = res.data[0];
        setPayments(prev => [{ id: p.id, type:'subscription', label, amount, status:'unpaid', dueDate: dueIn(30) }, ...prev]);
        return;
      }
    }
    setPayments(prev => [{ id:`SUB-${Date.now()}`, type:'subscription', label, amount, status:'unpaid', dueDate: dueIn(30) }, ...prev]);
  };

  const markNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <PaymentContext.Provider value={{ nodeRequests, payments, notifications, requestNode, approveNodeRequest, markPaymentPaid, markNotificationRead, markAllRead, unreadCount, addSubscriptionPayment, loadFromSupabase }}>
      {children}
    </PaymentContext.Provider>
  );
}
export function usePayments() { return useContext(PaymentContext); }
