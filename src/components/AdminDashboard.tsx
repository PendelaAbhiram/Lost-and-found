import React, { useState } from 'react';
import {
  ItemReport,
  ReportFeedback,
  AdminTabType,
  PageType,
} from '../types';
import { formatDate } from '../data/initialData';
import {
  LayoutDashboard,
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Settings,
  LogOut,
  Star,
  Search,
  Check,
  Trash2,
  Eye,
  Mail,
  KeyRound,
  ShieldCheck,
  MessageSquareHeart,
  ThumbsUp,
  Filter,
  Database,
} from 'lucide-react';

interface AdminDashboardProps {
  items: ItemReport[];
  feedbacks: ReportFeedback[];
  adminEmail: string;
  onNavigate: (page: PageType) => void;
  onLogout: () => void;
  onOpenSolveModal: (item: ItemReport) => void;
  onViewItem: (item: ItemReport) => void;
  onDeleteItem: (id: number) => void;
  onOpenChangeEmailModal: () => void;
  onOpenAdminPasswordModal: () => void;
  onToggleFeedbackReviewed?: (feedbackId: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  items,
  feedbacks,
  adminEmail,
  onNavigate,
  onLogout,
  onOpenSolveModal,
  onViewItem,
  onDeleteItem,
  onOpenChangeEmailModal,
  onOpenAdminPasswordModal,
  onToggleFeedbackReviewed,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTabType>('overview');

  // All reports filters
  const [tableFilter, setTableFilter] = useState<'all' | 'lost' | 'found' | 'unsolved' | 'solved'>('all');
  const [tableSearch, setTableSearch] = useState('');

  // Feedback tab filters
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState<number | 'all'>('all');
  const [feedbackTypeFilter, setFeedbackTypeFilter] = useState<'all' | 'lost' | 'found'>('all');

  const unsolvedItems = items.filter((i) => i.status !== 'solved');
  const solvedItems = items.filter((i) => i.status === 'solved');

  // Calculate feedback statistics
  const totalFeedbacks = feedbacks.length;
  const avgRating = totalFeedbacks
    ? (feedbacks.reduce((acc, f) => acc + f.rating, 0) / totalFeedbacks).toFixed(1)
    : '0.0';
  const positiveFeedbacks = feedbacks.filter((f) => f.rating >= 4).length;
  const satisfactionRate = totalFeedbacks
    ? Math.round((positiveFeedbacks / totalFeedbacks) * 100)
    : 100;
  const recommendCount = feedbacks.filter((f) => f.recommendation === 'definitely').length;
  const recommendRate = totalFeedbacks
    ? Math.round((recommendCount / totalFeedbacks) * 100)
    : 100;

  // Filter feedbacks
  const filteredFeedbacks = feedbacks.filter((f) => {
    const matchesRating =
      feedbackRatingFilter === 'all' || f.rating === feedbackRatingFilter;
    const matchesType =
      feedbackTypeFilter === 'all' || f.itemType === feedbackTypeFilter;
    return matchesRating && matchesType;
  });

  // Filter all reports
  const filteredItems = items.filter((item) => {
    let matchesStatus = true;
    if (tableFilter === 'lost') matchesStatus = item.type === 'lost';
    else if (tableFilter === 'found') matchesStatus = item.type === 'found';
    else if (tableFilter === 'unsolved') matchesStatus = item.status !== 'solved';
    else if (tableFilter === 'solved') matchesStatus = item.status === 'solved';

    const matchesSearch =
      tableSearch === '' ||
      (item.name + ' ' + item.desc + ' ' + item.location + ' ' + item.user)
        .toLowerCase()
        .includes(tableSearch.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-[#efe9d9]">
      {/* Admin Sidebar */}
      <aside className="md:col-span-3 lg:col-span-2.5 bg-[#0f1a12] text-[#efe9d9] flex flex-col justify-between h-auto md:h-screen sticky top-0 border-r border-black/20">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 font-serif text-2xl font-semibold text-[#efe9d9] cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#b8945a] flex items-center justify-center text-white">
                📋
              </div>
              <span>Relief</span>
            </button>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#b8945a] text-white font-bold">
              ADMIN
            </span>
          </div>

          {/* Admin User info */}
          <div className="p-5 border-b border-white/10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#b8945a] to-[#8a6030] text-white font-serif font-bold text-lg flex items-center justify-center shadow-xs flex-shrink-0">
              A
            </div>
            <div className="min-w-0">
              <div className="font-serif text-sm font-semibold truncate text-[#efe9d9]">Admin Portal</div>
              <div className="text-xs text-[#a9bda0] font-mono truncate">{adminEmail}</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              {
                id: 'unsolved',
                label: 'Unsolved Cases',
                icon: AlertCircle,
                badge: unsolvedItems.length,
                badgeColor: 'bg-[#8a2f24]',
              },
              {
                id: 'solved',
                label: 'Solved Cases',
                icon: CheckCircle2,
                badge: solvedItems.length,
                badgeColor: 'bg-[#2d4a34]',
              },
              {
                id: 'feedbacks',
                label: 'User Feedbacks',
                icon: MessageSquareHeart,
                badge: feedbacks.length,
                badgeColor: 'bg-[#b8945a]',
              },
              { id: 'all-items', label: 'All Reports', icon: ClipboardList, badge: items.length },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`adminTabBtn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as AdminTabType)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#b8945a]/25 text-[#b8945a] font-semibold'
                      : 'text-[#d0d8cb] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full text-white font-bold ${
                        tab.badgeColor || 'bg-white/20'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-[#ffb4aa] hover:bg-red-900/30 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <main className="md:col-span-9 lg:col-span-9.5 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-6 md:px-10 bg-[#efe9d9]/90 backdrop-blur-md border-b border-black/10 sticky top-0 z-20 flex items-center justify-between">
          <h1 className="font-serif text-2xl md:text-3xl font-medium text-[#1c2b1f] capitalize">
            {activeTab === 'feedbacks' ? 'User Feedbacks & Reviews' : `Admin ${activeTab.replace('-', ' ')}`}
          </h1>
          <div className="text-xs font-mono text-[#6b6a5f]">Admin Portal v1.2</div>
        </header>

        {/* Content */}
        <div className="p-6 md:p-10 flex-1 space-y-8">
          {/* ================= OVERVIEW TAB ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-[#f3ecd8] p-6 rounded-2xl shadow-xs border border-[#d9c9a3]">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="font-serif text-4xl font-medium text-[#1c2b1f] mb-1">{items.length}</div>
                  <div className="text-xs font-mono uppercase text-[#6b6a5f]">Total Community Reports</div>
                </div>

                <div className="bg-[#f3ecd8] p-6 rounded-2xl shadow-xs border border-[#d9c9a3]">
                  <div className="text-2xl mb-2">⏳</div>
                  <div className="font-serif text-4xl font-medium text-[#8a2f24] mb-1">
                    {unsolvedItems.length}
                  </div>
                  <div className="text-xs font-mono uppercase text-[#6b6a5f]">Pending Cases</div>
                </div>

                <div className="bg-[#f3ecd8] p-6 rounded-2xl shadow-xs border border-[#d9c9a3]">
                  <div className="text-2xl mb-2">✅</div>
                  <div className="font-serif text-4xl font-medium text-[#2d4a34] mb-1">
                    {solvedItems.length}
                  </div>
                  <div className="text-xs font-mono uppercase text-[#6b6a5f]">Resolved Cases</div>
                </div>

                <div className="bg-[#f3ecd8] p-6 rounded-2xl shadow-xs border border-[#d9c9a3]">
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="font-serif text-4xl font-medium text-[#b8945a] mb-1">
                    {avgRating} <span className="text-lg font-normal text-[#6b6a5f]">/ 5</span>
                  </div>
                  <div className="text-xs font-mono uppercase text-[#6b6a5f]">
                    User Feedback ({feedbacks.length})
                  </div>
                </div>
              </div>

              {/* Feedbacks Quick Glance */}
              {feedbacks.length > 0 && (
                <div className="bg-[#f3ecd8] p-6 rounded-2xl border border-[#d9c9a3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-serif text-lg font-medium text-[#1c2b1f] flex items-center gap-2">
                      <MessageSquareHeart className="w-5 h-5 text-[#b8945a]" />
                      Latest Reporter Feedback: &ldquo;{feedbacks[0].comment || feedbacks[0].tags[0]}&rdquo;
                    </div>
                    <div className="text-xs text-[#6b6a5f] mt-1">
                      Submitted by {feedbacks[0].userName} for item &ldquo;{feedbacks[0].itemName}&rdquo; ({feedbacks[0].rating}★)
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('feedbacks')}
                    className="px-4 py-2 bg-[#1c2b1f] text-[#efe9d9] rounded-xl text-xs font-semibold hover:bg-[#243527] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    View All Feedback ({feedbacks.length}) →
                  </button>
                </div>
              )}

              {/* Recent Reports Table */}
              <div>
                <h3 className="font-serif text-xl font-medium text-[#1c2b1f] mb-4">Recent Reports</h3>
                <div className="bg-white rounded-2xl shadow-xs border border-[#d9c9a3] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-[#f3ecd8] text-[11px] font-mono uppercase tracking-wider text-[#6b6a5f] border-b border-[#d9c9a3]">
                          <th className="p-4 pl-6">Item</th>
                          <th className="p-4">Type</th>
                          <th className="p-4">Reporter</th>
                          <th className="p-4">Location</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {items.slice(0, 8).map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4 pl-6">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{item.emoji}</span>
                                <strong className="font-medium text-[#1a1a17]">{item.name}</strong>
                              </div>
                            </td>
                            <td className="p-4">
                              <span
                                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                                  item.type === 'lost'
                                    ? 'bg-[#e9c9c2] text-[#8a2f24]'
                                    : 'bg-[#c9d6c8] text-[#2d4a34]'
                                }`}
                              >
                                {item.type}
                              </span>
                            </td>
                            <td className="p-4 text-xs text-[#6b6a5f]">{item.user}</td>
                            <td className="p-4 text-xs text-[#6b6a5f]">{item.location}</td>
                            <td className="p-4 text-xs text-[#6b6a5f] font-mono">{formatDate(item.date)}</td>
                            <td className="p-4">
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                                  item.status === 'solved'
                                    ? 'bg-[#2d4a34] text-white'
                                    : 'bg-[#b8945a]/20 text-[#b8945a]'
                                }`}
                              >
                                {item.status === 'solved' ? '✓ Solved' : 'Open'}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => onViewItem(item)}
                                  className="p-1.5 hover:bg-gray-100 rounded text-[#1c2b1f] text-xs font-semibold cursor-pointer"
                                  title="View report details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                {item.status !== 'solved' && (
                                  <button
                                    onClick={() => onOpenSolveModal(item)}
                                    className="px-2.5 py-1 bg-[#2d4a34]/15 hover:bg-[#2d4a34]/25 text-[#2d4a34] rounded text-xs font-semibold cursor-pointer"
                                    title="Mark case as solved"
                                  >
                                    Solve
                                  </button>
                                )}
                                <button
                                  onClick={() => onDeleteItem(item.id)}
                                  className="p-1.5 hover:bg-red-50 text-[#8a2f24] rounded text-xs cursor-pointer"
                                  title="Delete report"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= USER FEEDBACKS TAB (FEATURE FOCUS) ================= */}
          {activeTab === 'feedbacks' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-medium text-[#1c2b1f]">
                  Reporter Feedback & Satisfaction
                </h2>
                <p className="text-sm text-[#6b6a5f] mt-1">
                  Reviews and suggestions collected immediately after users submit lost or found item reports.
                </p>
              </div>

              {/* Feedback Analytics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-[#f3ecd8] p-6 rounded-2xl shadow-xs border border-[#d9c9a3]">
                  <div className="text-xs font-mono uppercase text-[#6b6a5f] mb-1">Average Rating</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-5xl font-medium text-[#b8945a]">{avgRating}</span>
                    <span className="text-sm text-[#6b6a5f]">/ 5.0</span>
                  </div>
                  <div className="flex gap-1 mt-2 text-[#b8945a]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-[#b8945a]" />
                    ))}
                  </div>
                </div>

                <div className="bg-[#f3ecd8] p-6 rounded-2xl shadow-xs border border-[#d9c9a3]">
                  <div className="text-xs font-mono uppercase text-[#6b6a5f] mb-1">Total Submissions</div>
                  <div className="font-serif text-5xl font-medium text-[#1c2b1f]">{totalFeedbacks}</div>
                  <div className="text-xs text-[#2d4a34] font-medium mt-2">
                    {totalFeedbacks ? 'Feedback from real reporters' : 'Awaiting submissions'}
                  </div>
                </div>

                <div className="bg-[#f3ecd8] p-6 rounded-2xl shadow-xs border border-[#d9c9a3]">
                  <div className="text-xs font-mono uppercase text-[#6b6a5f] mb-1">Positive Reviews</div>
                  <div className="font-serif text-5xl font-medium text-[#2d4a34]">{satisfactionRate}%</div>
                  <div className="text-xs text-[#6b6a5f] mt-2">Rated 4 or 5 stars</div>
                </div>

                <div className="bg-[#f3ecd8] p-6 rounded-2xl shadow-xs border border-[#d9c9a3]">
                  <div className="text-xs font-mono uppercase text-[#6b6a5f] mb-1">Recommendation Rate</div>
                  <div className="font-serif text-5xl font-medium text-[#1c2b1f]">{recommendRate}%</div>
                  <div className="text-xs text-[#6b6a5f] mt-2">Would recommend Relief</div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#d9c9a3]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono uppercase text-[#6b6a5f] font-semibold mr-1 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" /> Filter Rating:
                  </span>
                  {(['all', 5, 4, 3, 2, 1] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setFeedbackRatingFilter(r)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        feedbackRatingFilter === r
                          ? 'bg-[#1c2b1f] text-[#efe9d9]'
                          : 'bg-[#efe9d9]/60 text-[#1a1a17] hover:bg-[#efe9d9]'
                      }`}
                    >
                      {r === 'all' ? 'All Ratings' : `${r} ★`}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase text-[#6b6a5f] font-semibold mr-1">
                    Report Type:
                  </span>
                  {(['all', 'lost', 'found'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFeedbackTypeFilter(t)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                        feedbackTypeFilter === t
                          ? 'bg-[#b8945a] text-white'
                          : 'bg-[#efe9d9]/60 text-[#1a1a17] hover:bg-[#efe9d9]'
                      }`}
                    >
                      {t === 'all' ? 'All' : t === 'lost' ? 'Lost Reports' : 'Found Reports'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Cards List */}
              <div className="space-y-4">
                {filteredFeedbacks.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#d9c9a3]">
                    <p className="text-sm text-[#6b6a5f]">No feedback entries match your filter criteria.</p>
                  </div>
                ) : (
                  filteredFeedbacks.map((fb) => (
                    <div
                      key={fb.id}
                      className="bg-white rounded-2xl p-6 shadow-xs border border-[#d9c9a3] hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#f3ecd8] text-[#1c2b1f] font-serif font-bold flex items-center justify-center flex-shrink-0">
                            {fb.userName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-serif text-base font-semibold text-[#1a1a17]">
                              {fb.userName}{' '}
                              <span className="text-xs font-normal text-[#6b6a5f]">({fb.userEmail})</span>
                            </div>
                            <div className="text-xs text-[#6b6a5f] flex items-center gap-2">
                              <span>Reported: <strong>{fb.itemName}</strong></span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.2 rounded font-semibold ${
                                  fb.itemType === 'lost'
                                    ? 'bg-[#e9c9c2] text-[#8a2f24]'
                                    : 'bg-[#c9d6c8] text-[#2d4a34]'
                                }`}
                              >
                                {fb.itemType.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Stars */}
                          <div className="flex items-center gap-1 bg-[#f3ecd8] px-3 py-1 rounded-xl">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-4 h-4 ${
                                  s <= fb.rating
                                    ? 'fill-[#b8945a] text-[#b8945a]'
                                    : 'text-gray-200'
                                }`}
                              />
                            ))}
                            <span className="text-xs font-bold text-[#1c2b1f] ml-1">{fb.rating}.0</span>
                          </div>

                          <span className="text-xs text-[#6b6a5f] font-mono">
                            {formatDate(fb.submittedAt)}
                          </span>
                        </div>
                      </div>

                      {/* Aspect Tags */}
                      {fb.tags && fb.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {fb.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2.5 py-1 rounded-lg bg-[#efe9d9] text-[#1c2b1f] font-medium border border-[#d9c9a3]/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Comment */}
                      {fb.comment && (
                        <div className="bg-[#efe9d9]/40 p-3.5 rounded-xl border border-[#d9c9a3]/40 text-sm text-[#3f3d34] italic mb-3">
                          &ldquo;{fb.comment}&rdquo;
                        </div>
                      )}

                      {/* Recommendation & Admin review status */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-black/5 text-xs text-[#6b6a5f]">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="w-3.5 h-3.5 text-[#b8945a]" />
                          <span>
                            Recommendation:{' '}
                            <strong className="text-[#1c2b1f] capitalize">
                              {fb.recommendation ? fb.recommendation.replace('_', ' ') : 'Not specified'}
                            </strong>
                          </span>
                        </div>

                        {onToggleFeedbackReviewed && (
                          <button
                            onClick={() => onToggleFeedbackReviewed(fb.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
                              fb.adminReviewed
                                ? 'bg-[#c8d3bd] text-[#2d4a34]'
                                : 'bg-gray-100 hover:bg-gray-200 text-[#1a1a17]'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            {fb.adminReviewed ? 'Reviewed' : 'Mark as Reviewed'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= UNSOLVED TAB ================= */}
          {activeTab === 'unsolved' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="font-serif text-2xl font-medium text-[#1c2b1f]">
                  Unsolved Cases ({unsolvedItems.length})
                </h2>
                <p className="text-sm text-[#6b6a5f] mt-1">Pending items that have not yet been marked as returned.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xs border border-[#d9c9a3] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#f3ecd8] text-[11px] font-mono uppercase tracking-wider text-[#6b6a5f] border-b border-[#d9c9a3]">
                        <th className="p-4 pl-6">Item</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Reporter</th>
                        <th className="p-4">Contact</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {unsolvedItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{item.emoji}</span>
                              <strong className="font-medium text-[#1a1a17]">{item.name}</strong>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                                item.type === 'lost'
                                  ? 'bg-[#e9c9c2] text-[#8a2f24]'
                                  : 'bg-[#c9d6c8] text-[#2d4a34]'
                              }`}
                            >
                              {item.type}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-[#6b6a5f]">{item.user}</td>
                          <td className="p-4 text-xs text-[#6b6a5f]">{item.phone}</td>
                          <td className="p-4 text-xs text-[#6b6a5f]">{item.location}</td>
                          <td className="p-4 text-xs text-[#6b6a5f] font-mono">{formatDate(item.date)}</td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => onViewItem(item)}
                                className="p-1.5 hover:bg-gray-100 rounded text-xs font-semibold cursor-pointer"
                              >
                                View
                              </button>
                              <button
                                onClick={() => onOpenSolveModal(item)}
                                className="px-3 py-1 bg-[#2d4a34] text-white rounded text-xs font-semibold cursor-pointer"
                              >
                                Solve
                              </button>
                              <button
                                onClick={() => onDeleteItem(item.id)}
                                className="p-1.5 hover:bg-red-50 text-[#8a2f24] rounded text-xs cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= SOLVED TAB ================= */}
          {activeTab === 'solved' && (
            <div className="space-y-6 max-w-6xl">
              <div>
                <h2 className="font-serif text-2xl font-medium text-[#1c2b1f]">
                  Solved Cases ({solvedItems.length})
                </h2>
                <p className="text-sm text-[#6b6a5f] mt-1">Successfully resolved cases with handover verification.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xs border border-[#d9c9a3] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#f3ecd8] text-[11px] font-mono uppercase tracking-wider text-[#6b6a5f] border-b border-[#d9c9a3]">
                        <th className="p-4 pl-6">Item</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Resolved Date</th>
                        <th className="p-4">Reporter</th>
                        <th className="p-4 pr-6">Handover Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {solvedItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{item.emoji}</span>
                              <strong className="font-medium text-[#1a1a17]">{item.name}</strong>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                                item.type === 'lost'
                                  ? 'bg-[#e9c9c2] text-[#8a2f24]'
                                  : 'bg-[#c9d6c8] text-[#2d4a34]'
                              }`}
                            >
                              {item.type}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-[#6b6a5f] font-mono">
                            {formatDate(item.solveDate || item.date)}
                          </td>
                          <td className="p-4 text-xs text-[#6b6a5f]">{item.user}</td>
                          <td className="p-4 pr-6">
                            {item.solvePhoto ? (
                              <img
                                src={item.solvePhoto}
                                alt="Verification"
                                className="w-12 h-12 object-cover rounded-lg border border-black/10"
                              />
                            ) : (
                              <span className="text-xs text-[#6b6a5f] font-mono">Verified in person</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= ALL REPORTS TAB ================= */}
          {activeTab === 'all-items' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="inline-flex p-1 bg-black/5 rounded-xl gap-1">
                  {(['all', 'lost', 'found', 'unsolved', 'solved'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTableFilter(t)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        tableFilter === t
                          ? 'bg-[#0f1a12] text-white'
                          : 'text-[#6b6a5f] hover:text-[#1a1a17]'
                      }`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 bg-white border border-[#d9c9a3] rounded-xl px-3 py-1.5 w-full sm:w-64">
                  <Search className="w-4 h-4 text-[#6b6a5f]" />
                  <input
                    type="text"
                    placeholder="Search all reports..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="bg-transparent text-xs outline-none w-full text-[#1a1a17]"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xs border border-[#d9c9a3] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#f3ecd8] text-[11px] font-mono uppercase tracking-wider text-[#6b6a5f] border-b border-[#d9c9a3]">
                        <th className="p-4 pl-6">Item</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Reporter</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{item.emoji}</span>
                              <strong className="font-medium text-[#1a1a17]">{item.name}</strong>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                                item.type === 'lost'
                                  ? 'bg-[#e9c9c2] text-[#8a2f24]'
                                  : 'bg-[#c9d6c8] text-[#2d4a34]'
                              }`}
                            >
                              {item.type}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-[#6b6a5f]">{item.user}</td>
                          <td className="p-4 text-xs text-[#6b6a5f]">{item.location}</td>
                          <td className="p-4 text-xs text-[#6b6a5f] font-mono">{formatDate(item.date)}</td>
                          <td className="p-4">
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                                item.status === 'solved'
                                  ? 'bg-[#2d4a34] text-white'
                                  : 'bg-[#b8945a]/20 text-[#b8945a]'
                              }`}
                            >
                              {item.status === 'solved' ? '✓ Solved' : 'Open'}
                            </span>
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onViewItem(item)}
                                className="p-1.5 hover:bg-gray-100 rounded text-xs font-semibold cursor-pointer"
                              >
                                View
                              </button>
                              {item.status !== 'solved' && (
                                <button
                                  onClick={() => onOpenSolveModal(item)}
                                  className="px-2.5 py-1 bg-[#2d4a34] text-white rounded text-xs font-semibold cursor-pointer"
                                >
                                  Solve
                                </button>
                              )}
                              <button
                                onClick={() => onDeleteItem(item.id)}
                                className="p-1.5 hover:bg-red-50 text-[#8a2f24] rounded text-xs cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= SETTINGS TAB ================= */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h2 className="font-serif text-3xl font-medium text-[#1c2b1f]">Admin Security Settings</h2>
                <p className="text-sm text-[#6b6a5f] mt-1">
                  Manage primary admin credentials and 6-digit OTP identity verification.
                </p>
              </div>

              {/* Firebase Cloud Firestore & Auth Card */}
              <div className="bg-[#f3ecd8] p-6 rounded-2xl border border-[#d9c9a3] space-y-3">
                <h3 className="font-serif text-xl font-medium text-[#1c2b1f] flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#b8945a]" />
                  Firebase Cloud Firestore & Auth
                </h3>
                <p className="text-xs text-[#6b6a5f] leading-relaxed">
                  Connected to live Firestore database and Google Authentication. All items, resolution states, and user feedbacks are persisted securely in real-time.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-white rounded-xl border border-[#d9c9a3]">
                    <div className="text-[10px] font-mono uppercase text-[#6b6a5f]">Firestore Database</div>
                    <div className="text-xs font-semibold text-[#2d4a34] flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      Connected & Synced in Realtime
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#d9c9a3]">
                    <div className="text-[10px] font-mono uppercase text-[#6b6a5f]">Authentication Provider</div>
                    <div className="text-xs font-semibold text-[#1c2b1f] mt-0.5">
                      Firebase Auth (Google Sign-In)
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Email Card */}
              <div className="bg-[#f3ecd8] p-6 rounded-2xl border border-[#d9c9a3] space-y-4">
                <h3 className="font-serif text-xl font-medium text-[#1c2b1f] flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#b8945a]" />
                  Admin Email Address
                </h3>
                <p className="text-xs text-[#6b6a5f] leading-relaxed">
                  To update the admin notification email, we verify ownership by sending a 6-digit one-time passcode.
                </p>

                <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-[#d9c9a3]">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#6b6a5f] block">
                      Current Verified Email
                    </span>
                    <strong className="text-sm text-[#1c2b1f]">{adminEmail}</strong>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 bg-[#c9d6c8] text-[#2d4a34] font-bold rounded">
                    VERIFIED
                  </span>
                </div>

                <button
                  id="adminChangeEmailBtn"
                  onClick={onOpenChangeEmailModal}
                  className="bg-[#0f1a12] hover:bg-black text-[#efe9d9] px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Change Email Address →
                </button>
              </div>

              {/* Change Password Card */}
              <div className="bg-[#f3ecd8] p-6 rounded-2xl border border-[#d9c9a3] space-y-4">
                <h3 className="font-serif text-xl font-medium text-[#1c2b1f] flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#b8945a]" />
                  Admin Password
                </h3>
                <p className="text-xs text-[#6b6a5f] leading-relaxed">
                  Verify the registered email address with OTP before changing master administrator credentials.
                </p>

                <button
                  id="adminChangePasswordBtn"
                  onClick={onOpenAdminPasswordModal}
                  className="bg-[#0f1a12] hover:bg-black text-[#efe9d9] px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Change Admin Password →
                </button>
              </div>

              {/* Security Information */}
              <div className="p-4 bg-[#c8d3bd]/30 rounded-2xl border border-[#c8d3bd] space-y-2 text-xs text-[#2d4a34]">
                <div className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#2d4a34]" />
                  Security Protocols
                </div>
                <p>
                  • OTP passcodes expire automatically after 60 seconds to protect against brute force attempts.
                </p>
                <p>
                  • In this live test environment, OTP codes are shown in the secure preview dialog for testing.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
