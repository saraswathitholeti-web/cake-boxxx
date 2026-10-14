'use client';

import React, { useState, useEffect } from 'react';
import { SupportTicket } from '@/types';
import { useAuth } from '@/context/AuthContext';
import {
  LifeBuoy,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Ticket,
  HelpCircle,
} from 'lucide-react';

export default function SupportPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [userName, setUserName] = useState(user?.name || 'Priya Sharma');
  const [userPhone, setUserPhone] = useState(user?.phone || '9848022334');
  const [orderId, setOrderId] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('Order Status');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/tickets?userId=${user?.id || 'u-default'}`);
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 'u-default',
          userName,
          userPhone,
          orderId: orderId.trim() || undefined,
          category,
          description,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit ticket');

      setSuccessMsg(`Ticket created successfully! Your ticket number is ${data.ticketNumber}. Our Brodipet support team will contact you.`);
      setDescription('');
      setOrderId('');
      loadTickets();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error creating support ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-[#E85A71] uppercase tracking-widest flex items-center justify-center gap-1">
          <LifeBuoy className="w-3.5 h-3.5" /> Customer Assistance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#4A2E18] tracking-tight">
          Customer Care & Help Center
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          We’re here to help you with order inquiries, custom birthday cake designs, refunds, or delivery questions in Guntur.
        </p>
      </div>

      {/* Quick Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#4A2E18] flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5 text-[#E85A71]" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kitchen Hotline</div>
            <a href="tel:+918632234567" className="text-sm font-black text-[#4A2E18] hover:text-[#E85A71] transition-colors">
              +91 863 223 4567
            </a>
            <div className="text-[10px] text-gray-500">10:00 AM – 10:30 PM (Daily)</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#4A2E18] flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-[#E85A71]" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email Support</div>
            <a href="mailto:orders@cakeboxguntur.com" className="text-sm font-black text-[#4A2E18] hover:text-[#E85A71] transition-colors">
              orders@cakeboxguntur.com
            </a>
            <div className="text-[10px] text-gray-500">Fast response within 2 hours</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#4A2E18] flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-[#E85A71]" />
          </div>
          <div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bakery Location</div>
            <div className="text-xs font-bold text-[#4A2E18]">4th Lane, Brodipet, Guntur</div>
            <div className="text-[10px] text-gray-500">Beside ICICI Bank (522002)</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Support Ticket Submission Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-amber-100 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
            <Ticket className="w-5 h-5 text-[#E85A71]" />
            <h2 className="text-lg font-bold text-[#4A2E18]">Submit a Support Request</h2>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A2E18] bg-white font-medium"
                >
                  <option value="Order Status">Order Status & Delay</option>
                  <option value="Payment & Refund">Payment & Refund</option>
                  <option value="Food Quality">Food & Packaging Quality</option>
                  <option value="Custom Cake">Custom Cake Design Inquiry</option>
                  <option value="Late Delivery">Late Delivery Complaint</option>
                  <option value="Other">Other Feedback</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Order # (Optional)</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                  placeholder="e.g. CB-8821"
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A2E18] uppercase"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Describe your query or feedback</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the details of your request so our team can assist you quickly..."
                className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#4A2E18]"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="py-3 px-6 bg-[#4A2E18] hover:bg-[#2A170F] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-amber-200" />
              <span>{submitting ? 'Submitting...' : 'Submit Support Ticket'}</span>
            </button>
          </form>
        </div>

        {/* Ticket History */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-[#4A2E18] uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#C68B59]" /> Your Support Tickets ({tickets.length})
            </h3>

            {loading ? (
              <div className="p-4 text-xs text-gray-400 text-center">Loading ticket history...</div>
            ) : tickets.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {tickets.map((t) => (
                  <div key={t.id} className="p-3.5 bg-[#FAF5EE] rounded-2xl border border-amber-200/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-[#4A2E18]">{t.ticketNumber}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          t.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    <div className="text-[11px] font-bold text-gray-700">{t.category}</div>
                    <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">{t.description}</p>

                    {t.adminNotes && (
                      <div className="p-2 bg-white rounded-xl border border-amber-100 text-[10px] text-[#4A2E18]">
                        <strong>Kitchen Response:</strong> {t.adminNotes}
                      </div>
                    )}

                    <div className="text-[9px] text-gray-400 text-right">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-gray-400">
                You have no active support tickets.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
