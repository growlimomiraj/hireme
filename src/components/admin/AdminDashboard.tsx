import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { APP_CONFIG, CATEGORIES_SEED } from '../../config';
import {
  Users,
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  CreditCard,
  TrendingUp,
  Settings,
  History,
  Layers,
  Search,
  ExternalLink,
  DollarSign,
  Briefcase
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    providers,
    requests,
    offers,
    bookings,
    supportTickets,
    auditLogs,
    adminVerifyProvider
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'verification' | 'bookings' | 'categories' | 'disputes' | 'audit'>('overview');
  const [rejectReason, setRejectReason] = useState<string>('CNIC scan blurry; please re-upload clear color image.');
  const [selectedReviewProviderId, setSelectedReviewProviderId] = useState<string | null>(null);

  // Compute Marketplace Analytics
  const totalVolumePKR = bookings.reduce((sum, b) => sum + b.agreedPrice, 0) + 42000;
  const platformRevenuePKR = Math.round(totalVolumePKR * APP_CONFIG.platformCommissionRate);
  const activeProvidersCount = providers.filter(p => p.isOnline).length;
  const pendingVerificationCount = providers.filter(p => p.verificationStatus === 'under_review').length;

  const handleApprove = (providerId: string) => {
    adminVerifyProvider(providerId, true, "All documents verified authentic.");
  };

  const handleReject = (providerId: string) => {
    adminVerifyProvider(providerId, false, rejectReason);
    setSelectedReviewProviderId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-black text-[#B5F33D] font-black text-xs px-2 py-0.5 rounded uppercase">
              Admin Portal
            </span>
            <span className="text-xs text-gray-400">Master Control & Compliance</span>
          </div>
          <h1 className="text-2xl font-black text-[#151515] mt-1">
            ServiceBid Operations & Verification Console
          </h1>
        </div>

        <div className="text-xs text-gray-500 bg-white px-3 py-2 rounded-xl border border-gray-200">
          Super Admin: <b>Hamza Malik</b> • Market: <b>Islamabad & Rawalpindi</b>
        </div>
      </div>

      {/* Admin Subnav Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200 text-xs font-bold">
        {[
          { id: 'overview', label: 'KPI Overview', icon: TrendingUp },
          { id: 'verification', label: `Provider Verification (${pendingVerificationCount})`, icon: ShieldCheck },
          { id: 'bookings', label: `Live Bookings (${bookings.length})`, icon: Briefcase },
          { id: 'categories', label: 'Services & Commissions', icon: Layers },
          { id: 'disputes', label: `Disputes & Support (${supportTickets.length})`, icon: AlertTriangle },
          { id: 'audit', label: 'Audit Trail Logs', icon: History }
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
                isSelected
                  ? 'bg-[#151515] text-[#B5F33D] shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: KPI OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Gross Booking Volume</span>
              <div className="text-2xl font-black text-black">PKR {totalVolumePKR.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-600 font-semibold">+18.4% this week</span>
            </div>

            <div className="bg-lime-50 border-2 border-lime-300 rounded-3xl p-5 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-lime-950 block tracking-wider">Platform Net Revenue (10%)</span>
              <div className="text-2xl font-black text-[#151515]">PKR {platformRevenuePKR.toLocaleString()}</div>
              <span className="text-[11px] text-gray-600 font-medium">Automatic fee retention</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Active Providers</span>
              <div className="text-2xl font-black text-black">{activeProvidersCount} / {providers.length}</div>
              <span className="text-[11px] text-gray-500 font-medium">Online in twin cities</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Avg. Time to First Offer</span>
              <div className="text-2xl font-black text-black">3.2 Mins</div>
              <span className="text-[11px] text-emerald-600 font-semibold">inDrive speed benchmark</span>
            </div>

          </div>

          {/* Quick Summary Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Open Requests */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm text-[#151515]">Recent Customer Requests</h3>
              <div className="space-y-2 text-xs">
                {requests.slice(0, 4).map(req => (
                  <div key={req.id} className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-black">{req.title}</div>
                      <div className="text-gray-500 text-[11px]">{req.customerName} • {req.location.area}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-black block">₨ {req.budget.toLocaleString()}</span>
                      <StatusBadge status={req.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Provider Verification Pipeline */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-3">
              <h3 className="font-extrabold text-sm text-[#151515]">Verification Queue</h3>
              <div className="space-y-2 text-xs">
                {providers.filter(p => p.verificationStatus === 'under_review').length === 0 ? (
                  <p className="text-gray-400 py-4 text-center">No pending verifications in queue.</p>
                ) : (
                  providers.filter(p => p.verificationStatus === 'under_review').map(prov => (
                    <div key={prov.id} className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="font-bold text-amber-950">{prov.name} ({prov.specialty})</div>
                        <div className="text-amber-800 text-[11px]">{prov.documents.length} documents awaiting review</div>
                      </div>
                      <button
                        onClick={() => setActiveTab('verification')}
                        className="bg-black text-white font-bold px-3 py-1.5 rounded-xl hover:bg-gray-800"
                      >
                        Review
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: PROVIDER VERIFICATION QUEUE */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[#151515]">Identity & Trade Document Review Queue</h3>
            <span className="text-xs text-gray-500">NADRA CNIC & Police Clearance checks</span>
          </div>

          <div className="space-y-4">
            {providers.map(prov => (
              <div
                key={prov.id}
                className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={prov.avatar}
                      alt={prov.name}
                      className="w-13 h-13 rounded-2xl object-cover border border-gray-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-base text-black">{prov.name}</h4>
                        <StatusBadge status={prov.verificationStatus} size="sm" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">{prov.specialty} • {prov.phone}</p>
                      <span className="text-[11px] text-gray-400">{prov.location.address} ({prov.location.area})</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {prov.verificationStatus !== 'approved' ? (
                      <>
                        <button
                          onClick={() => handleApprove(prov.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1 shadow"
                        >
                          <CheckCircle size={14} />
                          <span>Approve & Authorize Bidding</span>
                        </button>

                        <button
                          onClick={() => setSelectedReviewProviderId(prov.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1"
                        >
                          <XCircle size={14} />
                          <span>Reject / Resubmit</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
                        <CheckCircle size={14} />
                        <span>Active & Approved Provider</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Documents submitted */}
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex flex-wrap items-center gap-3 text-xs">
                  <span className="font-bold text-gray-700">Submitted Documents:</span>
                  {prov.documents.length === 0 ? (
                    <span className="text-gray-400">No documents on file yet</span>
                  ) : (
                    prov.documents.map(doc => (
                      <a
                        key={doc.id}
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white hover:bg-gray-100 px-2.5 py-1 rounded-lg border border-gray-200 font-medium text-gray-800 flex items-center gap-1.5"
                      >
                        <FileText size={13} className="text-gray-400" />
                        <span>{doc.name}</span>
                        <ExternalLink size={11} className="text-gray-400" />
                      </a>
                    ))
                  )}
                </div>

              </div>
            ))}
          </div>

          {/* Reject Reason Modal */}
          {selectedReviewProviderId && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
                <h3 className="font-extrabold text-base text-black">Record Rejection / Resubmission Reason</h3>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full mt-3 px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button
                    onClick={() => setSelectedReviewProviderId(null)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReject(selectedReviewProviderId)}
                    className="bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[#151515]">All Confirmed Bookings Across Twin Cities</h3>
            <span className="text-xs text-gray-400">{bookings.length} Total records</span>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-gray-200">
                <thead className="bg-gray-50 font-bold text-gray-500 uppercase text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Booking ID</th>
                    <th className="px-4 py-3">Service / Request</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Provider</th>
                    <th className="px-4 py-3">Agreed Total</th>
                    <th className="px-4 py-3">Job Status</th>
                    <th className="px-4 py-3">Payment Hold</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono font-bold text-gray-500">{b.id}</td>
                      <td className="px-4 py-3 font-bold text-black">{b.requestTitle}</td>
                      <td className="px-4 py-3">{b.customerName}</td>
                      <td className="px-4 py-3">{b.providerName}</td>
                      <td className="px-4 py-3 font-bold text-black">PKR {b.agreedPrice.toLocaleString()}</td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} size="sm" /></td>
                      <td className="px-4 py-3"><StatusBadge status={b.paymentStatus} size="sm" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CATEGORIES & COMMISSIONS */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-black">Market Categories & Commission Policy</h3>
              <p className="text-xs text-gray-500">Configure marketplace commission rate and baseline starting prices.</p>
            </div>
            <div className="bg-lime-50 border border-lime-300 rounded-xl px-4 py-2 text-right">
              <span className="text-[10px] uppercase font-bold text-lime-950 block">Current Commission Rate</span>
              <span className="text-lg font-black text-black">{APP_CONFIG.platformCommissionRate * 100}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {CATEGORIES_SEED.map(cat => (
              <div key={cat.id} className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-between">
                <div>
                  <div className="font-bold text-black">{cat.name}</div>
                  <div className="text-[11px] text-gray-500 font-urdu">{cat.nameUrdu}</div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-black block">₨ {cat.startingPrice}</span>
                  <span className="text-[10px] text-gray-400">Base estimate</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DISPUTES & SUPPORT */}
      {activeTab === 'disputes' && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-base text-black">Support Tickets & Dispute Resolution</h3>
          {supportTickets.map(tkt => (
            <div key={tkt.id} className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-black">{tkt.subject}</span>
                <StatusBadge status={tkt.status} size="sm" />
              </div>
              <p className="text-gray-600">{tkt.description}</p>
              <div className="flex items-center justify-between text-gray-400 pt-2 border-t border-gray-100 text-[11px]">
                <span>Submitted by: <b>{tkt.userName}</b> ({tkt.userRole})</span>
                <span>{new Date(tkt.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: AUDIT TRAIL LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-black">Privileged Action Audit Logs</h3>
          <div className="divide-y divide-gray-100 text-xs">
            {auditLogs.map(log => (
              <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                      {log.action}
                    </span>
                    <span className="font-medium text-gray-600">by {log.actorName} ({log.actorRole})</span>
                  </div>
                  <p className="text-gray-600 mt-1">{log.reason}</p>
                </div>
                <span className="text-[10px] text-gray-400 flex-shrink-0">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
