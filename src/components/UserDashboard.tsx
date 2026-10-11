import React, { useState } from 'react';
import {
  ItemReport,
  ReportFeedback,
  UserProfile,
  UserTabType,
  PageType,
} from '../types';
import { formatDate } from '../data/initialData';
import {
  LayoutDashboard,
  AlertCircle,
  MapPin,
  ClipboardList,
  Compass,
  User,
  LogOut,
  Camera,
  Trash2,
  Calendar,
  Phone,
  Search,
  Star,
  KeyRound,
  CheckCircle2,
  MessageSquareHeart,
} from 'lucide-react';

interface UserDashboardProps {
  user: UserProfile;
  items: ItemReport[];
  feedbacks: ReportFeedback[];
  onNavigate: (page: PageType) => void;
  onLogout: () => void;
  onSubmitReport: (report: Omit<ItemReport, 'id' | 'status' | 'submittedAt'>) => void;
  onDeleteReport: (id: number) => void;
  onViewItem: (item: ItemReport) => void;
  onOpenFeedbackModal: (item: ItemReport) => void;
  onOpenPasswordModal: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  items,
  feedbacks,
  onNavigate,
  onLogout,
  onSubmitReport,
  onDeleteReport,
  onViewItem,
  onOpenFeedbackModal,
  onOpenPasswordModal,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<UserTabType>('overview');

  // Form states - Lost
  const [lostName, setLostName] = useState('');
  const [lostDesc, setLostDesc] = useState('');
  const [lostLocation, setLostLocation] = useState('');
  const [lostDate, setLostDate] = useState(new Date().toISOString().split('T')[0]);
  const [lostPhone, setLostPhone] = useState(user.phone || '+91 98765 43210');
  const [lostPhoto, setLostPhoto] = useState<string | null>(null);

  // Form states - Found
  const [foundName, setFoundName] = useState('');
  const [foundDesc, setFoundDesc] = useState('');
  const [foundLocation, setFoundLocation] = useState('');
  const [foundDate, setFoundDate] = useState(new Date().toISOString().split('T')[0]);
  const [foundPhone, setFoundPhone] = useState(user.phone || '+91 98765 43210');
  const [foundPhoto, setFoundPhoto] = useState<string | null>(null);

  // Browse tab states
  const [browseFilter, setBrowseFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [browseSearch, setBrowseSearch] = useState('');

  // Profile edit states
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profilePhone, setProfilePhone] = useState(user.phone);

  const myItems = items.filter(
    (i) =>
      (user.email && i.user?.toLowerCase() === user.email.toLowerCase()) ||
      (user.uid && i.userId === user.uid)
  );
  const myLost = myItems.filter((i) => i.type === 'lost');
  const myFound = myItems.filter((i) => i.type === 'found');
  const mySolved = myItems.filter((i) => i.status === 'solved');
  const myFeedbacks = feedbacks.filter(
    (f) =>
      (user.email && f.userEmail?.toLowerCase() === user.email.toLowerCase()) ||
      (user.uid && f.userId === user.uid)
  );

  const handleLostPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setLostPhoto(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFoundPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setFoundPhoto(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleLostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport({
      type: 'lost',
      name: lostName,
      desc: lostDesc,
      location: lostLocation,
      date: lostDate,
      phone: lostPhone,
      emoji: '🔍',
      user: user.email,
      userName: user.name,
      imageData: lostPhoto,
    });
    // Reset form
    setLostName('');
    setLostDesc('');
    setLostLocation('');
    setLostPhoto(null);
  };

  const handleFoundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport({
      type: 'found',
      name: foundName,
      desc: foundDesc,
      location: foundLocation,
      date: foundDate,
      phone: foundPhone,
      emoji: '✅',
      user: user.email,
      userName: user.name,
      imageData: foundPhoto,
    });
    // Reset form
    setFoundName('');
    setFoundDesc('');
    setFoundLocation('');
    setFoundPhoto(null);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
    });
  };

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const filteredBrowse = items.filter((i) => {
    const matchesFilter = browseFilter === 'all' || i.type === browseFilter;
    const matchesSearch =
      browseSearch === '' ||
      (i.name + ' ' + i.desc + ' ' + i.location).toLowerCase().includes(browseSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-[#efe9d9]">
      {/* Sidebar */}
      <aside className="md:col-span-3 lg:col-span-2.5 bg-[#1c2b1f] text-[#efe9d9] flex flex-col justify-between h-auto md:h-screen sticky top-0 border-r border-black/10">
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
          </div>

          {/* User badge */}
          <div className="p-5 border-b border-white/10 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#b8945a] to-[#d9c9a3] text-[#1c2b1f] font-serif font-bold text-lg flex items-center justify-center shadow-xs flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="font-serif text-sm font-semibold truncate text-[#efe9d9]">{user.name}</div>
              <div className="text-xs text-[#a9bda0] font-mono truncate">{user.email}</div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'report-lost', label: 'Report Lost Item', icon: AlertCircle },
              { id: 'report-found', label: 'Report Found Item', icon: MapPin },
              { id: 'my-items', label: 'My Items', icon: ClipboardList, badge: myItems.length },
              { id: 'browse', label: 'Browse All', icon: Compass },
              { id: 'profile', label: 'My Profile', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`userTabBtn-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as UserTabType)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white/15 text-white shadow-xs'
                      : 'text-[#d0d8cb] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#b8945a]" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#b8945a] text-white">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
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

      {/* Main Panel */}
      <main className="md:col-span-9 lg:col-span-9.5 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-6 md:px-10 bg-[#efe9d9]/90 backdrop-blur-md border-b border-black/10 sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-serif text-2xl md:text-3xl font-medium text-[#1c2b1f] capitalize">
            {activeTab.replace('-', ' ')}
          </h1>

          <div className="flex items-center gap-2.5">
            <button
              id="dashQuickReportLostBtn"
              onClick={() => setActiveTab('report-lost')}
              className="px-3.5 py-2 text-xs font-semibold bg-[#1c2b1f] text-[#efe9d9] hover:bg-[#243527] rounded-xl shadow-xs transition-all cursor-pointer"
            >
              + Report Lost
            </button>
            <button
              id="dashQuickReportFoundBtn"
              onClick={() => setActiveTab('report-found')}
              className="px-3.5 py-2 text-xs font-semibold bg-[#f3ecd8] text-[#1a1a17] border border-black/15 hover:bg-white rounded-xl shadow-xs transition-all cursor-pointer"
            >
              + Report Found
            </button>
          </div>
        </header>

        {/* Tab Contents */}
        <div className="p-6 md:p-10 flex-1">
          {/* ================= OVERVIEW TAB ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-5xl">
              {/* Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-[#d9c9a3]/70 p-6 rounded-2xl shadow-xs border border-[#c9b98a]/40">
                  <div className="text-2xl mb-2">📋</div>
                  <div className="font-serif text-4xl font-medium text-[#1c2b1f] mb-1">{myItems.length}</div>
                  <div className="text-xs font-mono uppercase text-[#6b6a5f]">Total Reports Posted</div>
                </div>

                <div className="bg-[#d9c9a3]/70 p-6 rounded-2xl shadow-xs border border-[#c9b98a]/40">
                  <div className="text-2xl mb-2">🔍</div>
                  <div className="font-serif text-4xl font-medium text-[#8a2f24] mb-1">{myLost.length}</div>
                  <div className="text-xs font-mono uppercase text-[#6b6a5f]">Lost Items Reported</div>
                </div>

                <div className="bg-[#d9c9a3]/70 p-6 rounded-2xl shadow-xs border border-[#c9b98a]/40">
                  <div className="text-2xl mb-2">✅</div>
                  <div className="font-serif text-4xl font-medium text-[#2d4a34] mb-1">{mySolved.length}</div>
                  <div className="text-xs font-mono uppercase text-[#6b6a5f]">Resolved Cases</div>
                </div>
              </div>

              {/* Feedback Prompt Banner */}
              {myItems.length > 0 && (
                <div className="bg-gradient-to-r from-[#1c2b1f] to-[#243527] text-[#efe9d9] p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#b8945a] flex items-center justify-center text-white flex-shrink-0">
                      <MessageSquareHeart className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-serif text-base font-medium">Have feedback on your recent reports?</div>
                      <div className="text-xs text-[#c4cebd]">
                        Help make our community lost & found smoother and faster for everyone.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('my-items')}
                    className="text-xs font-semibold px-4 py-2 rounded-xl bg-[#efe9d9] text-[#1c2b1f] hover:bg-white transition-all cursor-pointer whitespace-nowrap"
                  >
                    View My Reports & Feedback →
                  </button>
                </div>
              )}

              {/* Recent Reports List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-xl font-medium text-[#1c2b1f]">Your recent reports</h3>
                  <button
                    onClick={() => setActiveTab('my-items')}
                    className="text-xs font-semibold text-[#1c2b1f] underline cursor-pointer"
                  >
                    View all ({myItems.length})
                  </button>
                </div>

                {myItems.length === 0 ? (
                  <div className="text-center py-12 bg-[#f3ecd8]/60 rounded-2xl border border-dashed border-[#d9c9a3]">
                    <p className="text-sm text-[#6b6a5f] mb-3">No items reported yet.</p>
                    <button
                      onClick={() => setActiveTab('report-lost')}
                      className="px-4 py-2 bg-[#1c2b1f] text-[#efe9d9] rounded-xl text-xs font-medium cursor-pointer"
                    >
                      Report your first lost item →
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {myItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#f3ecd8] rounded-xl p-4 shadow-xs border border-[#d9c9a3] flex flex-col justify-between hover:shadow-md transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                                item.type === 'lost'
                                  ? 'bg-[#e9c9c2] text-[#8a2f24]'
                                  : 'bg-[#c9d6c8] text-[#2d4a34]'
                              }`}
                            >
                              {item.type}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                                item.status === 'solved'
                                  ? 'bg-[#2d4a34] text-white'
                                  : 'bg-[#b8945a]/20 text-[#b8945a]'
                              }`}
                            >
                              {item.status === 'solved' ? '✓ Solved' : 'Open'}
                            </span>
                          </div>
                          <h4 className="font-serif text-base font-semibold text-[#1a1a17] truncate mb-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-[#6b6a5f] truncate mb-0.5">{item.location}</p>
                          <p className="text-xs text-[#6b6a5f] font-mono">{formatDate(item.date)}</p>
                        </div>

                        <div className="pt-4 mt-2 border-t border-black/5 flex items-center justify-between">
                          <button
                            onClick={() => onViewItem(item)}
                            className="text-xs font-semibold text-[#1c2b1f] hover:underline cursor-pointer"
                          >
                            View details
                          </button>
                          <button
                            onClick={() => onOpenFeedbackModal(item)}
                            className="text-xs font-medium text-[#b8945a] hover:text-[#8a6030] flex items-center gap-1 cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 fill-[#b8945a]" />
                            Feedback
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= REPORT LOST ITEM TAB ================= */}
          {activeTab === 'report-lost' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h2 className="font-serif text-3xl font-medium text-[#1c2b1f]">Report a Lost Item</h2>
                <p className="text-sm text-[#6b6a5f] mt-1">
                  Describe what you lost so the Relief community can help you find it.
                </p>
              </div>

              <form onSubmit={handleLostSubmit} className="space-y-6">
                {/* Photo zone */}
                <div className="bg-[#f3ecd8] p-6 rounded-2xl border border-[#d9c9a3]">
                  <label className="text-xs font-mono uppercase tracking-wider font-semibold text-[#1c2b1f] block mb-3">
                    📷 Item Photo (Optional)
                  </label>
                  <label
                    htmlFor="lostPhotoUpload"
                    className="border-2 border-dashed border-[#1c2b1f]/20 hover:border-[#1c2b1f] rounded-xl p-8 text-center cursor-pointer bg-[#efe9d9]/60 hover:bg-white block transition-all"
                  >
                    <Camera className="w-8 h-8 text-[#1c2b1f]/60 mx-auto mb-2" />
                    <span className="text-sm font-medium text-[#1c2b1f] block">
                      Click to upload a photo
                    </span>
                    <span className="text-xs text-[#6b6a5f]">Drag and drop or browse files</span>
                    <input
                      id="lostPhotoUpload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLostPhotoUpload}
                    />
                    {lostPhoto && (
                      <img
                        src={lostPhoto}
                        alt="Lost preview"
                        className="w-full h-44 object-cover rounded-xl mt-4 border border-[#d9c9a3]"
                      />
                    )}
                  </label>
                </div>

                {/* Details */}
                <div className="bg-[#f3ecd8] p-6 rounded-2xl border border-[#d9c9a3] space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#1c2b1f]">
                    📋 Item Details
                  </h3>

                  <div>
                    <label className="text-xs font-semibold text-[#1a1a17] block mb-1">
                      Item Name *
                    </label>
                    <input
                      id="lostItemNameInput"
                      type="text"
                      required
                      value={lostName}
                      onChange={(e) => setLostName(e.target.value)}
                      placeholder="e.g. Navy Blue Backpack, Laptop inside"
                      className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1c2b1f]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1a1a17] block mb-1">
                      Description *
                    </label>
                    <textarea
                      id="lostItemDescInput"
                      required
                      rows={3}
                      value={lostDesc}
                      onChange={(e) => setLostDesc(e.target.value)}
                      placeholder="Provide specific details: brand, stickers, scratches, contents..."
                      className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1c2b1f] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#1a1a17] block mb-1">
                        Location Lost *
                      </label>
                      <input
                        id="lostItemLocationInput"
                        type="text"
                        required
                        value={lostLocation}
                        onChange={(e) => setLostLocation(e.target.value)}
                        placeholder="e.g. Room 204, Science Block"
                        className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1c2b1f]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#1a1a17] block mb-1">
                        Date Lost *
                      </label>
                      <input
                        id="lostItemDateInput"
                        type="date"
                        required
                        value={lostDate}
                        onChange={(e) => setLostDate(e.target.value)}
                        className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1c2b1f]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1a1a17] block mb-1">
                      Contact Phone / WhatsApp *
                    </label>
                    <input
                      id="lostItemPhoneInput"
                      type="tel"
                      required
                      value={lostPhone}
                      onChange={(e) => setLostPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1c2b1f]"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#c8d3bd]/30 rounded-xl border border-[#c8d3bd] text-xs text-[#2d4a34]">
                  💡 <strong>Feedback feature enabled:</strong> After reporting, a quick prompt will let you rate your experience and suggest improvements!
                </div>

                <button
                  type="submit"
                  id="submitLostReportBtn"
                  className="w-full bg-[#1c2b1f] hover:bg-[#243527] text-[#efe9d9] font-medium py-3.5 rounded-xl text-base shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Submit Lost Report →
                </button>
              </form>
            </div>
          )}

          {/* ================= REPORT FOUND ITEM TAB ================= */}
          {activeTab === 'report-found' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h2 className="font-serif text-3xl font-medium text-[#1c2b1f]">Report a Found Item</h2>
                <p className="text-sm text-[#6b6a5f] mt-1">
                  Help return an item to its owner by listing what you picked up.
                </p>
              </div>

              <form onSubmit={handleFoundSubmit} className="space-y-6">
                {/* Photo zone */}
                <div className="bg-[#f3ecd8] p-6 rounded-2xl border border-[#d9c9a3]">
                  <label className="text-xs font-mono uppercase tracking-wider font-semibold text-[#1c2b1f] block mb-3">
                    📷 Item Photo (Recommended)
                  </label>
                  <label
                    htmlFor="foundPhotoUpload"
                    className="border-2 border-dashed border-[#1c2b1f]/20 hover:border-[#1c2b1f] rounded-xl p-8 text-center cursor-pointer bg-[#efe9d9]/60 hover:bg-white block transition-all"
                  >
                    <Camera className="w-8 h-8 text-[#1c2b1f]/60 mx-auto mb-2" />
                    <span className="text-sm font-medium text-[#1c2b1f] block">
                      Click to upload photo of found item
                    </span>
                    <span className="text-xs text-[#6b6a5f]">Helps owner confirm ownership</span>
                    <input
                      id="foundPhotoUpload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFoundPhotoUpload}
                    />
                    {foundPhoto && (
                      <img
                        src={foundPhoto}
                        alt="Found preview"
                        className="w-full h-44 object-cover rounded-xl mt-4 border border-[#d9c9a3]"
                      />
                    )}
                  </label>
                </div>

                {/* Details */}
                <div className="bg-[#f3ecd8] p-6 rounded-2xl border border-[#d9c9a3] space-y-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#1c2b1f]">
                    📋 Found Item Details
                  </h3>

                  <div>
                    <label className="text-xs font-semibold text-[#1a1a17] block mb-1">
                      Item Name *
                    </label>
                    <input
                      id="foundItemNameInput"
                      type="text"
                      required
                      value={foundName}
                      onChange={(e) => setFoundName(e.target.value)}
                      placeholder="e.g. Black Leather Wallet, Car Keys"
                      className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1c2b1f]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1a1a17] block mb-1">
                      Description *
                    </label>
                    <textarea
                      id="foundItemDescInput"
                      required
                      rows={3}
                      value={foundDesc}
                      onChange={(e) => setFoundDesc(e.target.value)}
                      placeholder="Describe what you found without giving away sensitive verification secrets..."
                      className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1c2b1f] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#1a1a17] block mb-1">
                        Location Found *
                      </label>
                      <input
                        id="foundItemLocationInput"
                        type="text"
                        required
                        value={foundLocation}
                        onChange={(e) => setFoundLocation(e.target.value)}
                        placeholder="e.g. Near Gate 3, Cafeteria Table 12"
                        className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1c2b1f]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#1a1a17] block mb-1">
                        Date Found *
                      </label>
                      <input
                        id="foundItemDateInput"
                        type="date"
                        required
                        value={foundDate}
                        onChange={(e) => setFoundDate(e.target.value)}
                        className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1c2b1f]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#1a1a17] block mb-1">
                      Your Contact Number *
                    </label>
                    <input
                      id="foundItemPhoneInput"
                      type="tel"
                      required
                      value={foundPhone}
                      onChange={(e) => setFoundPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1c2b1f]"
                    />
                  </div>
                </div>

                <div className="p-4 bg-[#c8d3bd]/30 rounded-xl border border-[#c8d3bd] text-xs text-[#2d4a34]">
                  💡 <strong>Feedback feature enabled:</strong> You will be invited to give feedback right after submitting this found report!
                </div>

                <button
                  type="submit"
                  id="submitFoundReportBtn"
                  className="w-full bg-[#b8945a] hover:bg-[#a68045] text-white font-medium py-3.5 rounded-xl text-base shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Submit Found Report →
                </button>
              </form>
            </div>
          )}

          {/* ================= MY ITEMS TAB ================= */}
          {activeTab === 'my-items' && (
            <div className="space-y-10 max-w-5xl">
              {/* Lost Complaints */}
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#1c2b1f] mb-4">
                  My Lost Complaints ({myLost.length})
                </h3>
                {myLost.length === 0 ? (
                  <p className="text-xs text-[#6b6a5f] bg-[#f3ecd8] p-4 rounded-xl">
                    No lost items reported yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {myLost.map((item) => {
                      const fb = feedbacks.find((f) => f.itemId === item.id);
                      return (
                        <div
                          key={item.id}
                          className="bg-[#f3ecd8] rounded-2xl p-5 shadow-xs border border-[#d9c9a3] flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold bg-[#e9c9c2] text-[#8a2f24]">
                                Lost
                              </span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                                  item.status === 'solved'
                                    ? 'bg-[#2d4a34] text-white'
                                    : 'bg-[#b8945a]/20 text-[#b8945a]'
                                }`}
                              >
                                {item.status === 'solved' ? '✓ Solved' : 'Open'}
                              </span>
                            </div>

                            <div className="w-full h-32 rounded-xl bg-black/5 flex items-center justify-center text-4xl mb-3 overflow-hidden">
                              {item.imageData ? (
                                <img src={item.imageData} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                item.emoji
                              )}
                            </div>

                            <h4 className="font-serif text-base font-semibold text-[#1a1a17] mb-1 truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-[#6b6a5f] truncate mb-0.5">{item.location}</p>
                            <p className="text-xs text-[#6b6a5f] font-mono">{formatDate(item.date)}</p>

                            {/* Feedback badge */}
                            <div className="mt-2.5">
                              {fb ? (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#c8d3bd]/40 border border-[#c8d3bd] text-[11px] text-[#2d4a34]">
                                  <Star className="w-3 h-3 fill-[#b8945a] text-[#b8945a]" />
                                  <span>Feedback: {fb.rating}★ {fb.comment ? `“${fb.comment.slice(0, 24)}${fb.comment.length > 24 ? '...' : ''}”` : ((fb.tags && fb.tags[0]) || 'Rated')}</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => onOpenFeedbackModal(item)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#b8945a]/15 text-[#8a6030] hover:bg-[#b8945a]/25 text-[11px] font-medium transition-colors cursor-pointer"
                                >
                                  <Star className="w-3 h-3 text-[#b8945a]" />
                                  <span>+ Give feedback on this report</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="pt-4 mt-3 border-t border-black/10 flex items-center justify-between">
                            <button
                              onClick={() => onViewItem(item)}
                              className="text-xs font-semibold text-[#1c2b1f] hover:underline cursor-pointer"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => onDeleteReport(item.id)}
                              className="text-xs text-[#8a2f24] hover:bg-red-50 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Items I Found */}
              <div>
                <h3 className="font-serif text-2xl font-medium text-[#1c2b1f] mb-4">
                  Items I Found ({myFound.length})
                </h3>
                {myFound.length === 0 ? (
                  <p className="text-xs text-[#6b6a5f] bg-[#f3ecd8] p-4 rounded-xl">
                    No found items reported yet.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {myFound.map((item) => {
                      const fb = feedbacks.find((f) => f.itemId === item.id);
                      return (
                        <div
                          key={item.id}
                          className="bg-[#f3ecd8] rounded-2xl p-5 shadow-xs border border-[#d9c9a3] flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold bg-[#c9d6c8] text-[#2d4a34]">
                                Found
                              </span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                                  item.status === 'solved'
                                    ? 'bg-[#2d4a34] text-white'
                                    : 'bg-[#b8945a]/20 text-[#b8945a]'
                                }`}
                              >
                                {item.status === 'solved' ? '✓ Solved' : 'Open'}
                              </span>
                            </div>

                            <div className="w-full h-32 rounded-xl bg-black/5 flex items-center justify-center text-4xl mb-3 overflow-hidden">
                              {item.imageData ? (
                                <img src={item.imageData} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                item.emoji
                              )}
                            </div>

                            <h4 className="font-serif text-base font-semibold text-[#1a1a17] mb-1 truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-[#6b6a5f] truncate mb-0.5">{item.location}</p>
                            <p className="text-xs text-[#6b6a5f] font-mono">{formatDate(item.date)}</p>

                            {/* Feedback badge */}
                            <div className="mt-2.5">
                              {fb ? (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#c8d3bd]/40 border border-[#c8d3bd] text-[11px] text-[#2d4a34]">
                                  <Star className="w-3 h-3 fill-[#b8945a] text-[#b8945a]" />
                                  <span>Feedback: {fb.rating}★ {fb.comment ? `“${fb.comment.slice(0, 24)}${fb.comment.length > 24 ? '...' : ''}”` : ((fb.tags && fb.tags[0]) || 'Rated')}</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => onOpenFeedbackModal(item)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#b8945a]/15 text-[#8a6030] hover:bg-[#b8945a]/25 text-[11px] font-medium transition-colors cursor-pointer"
                                >
                                  <Star className="w-3 h-3 text-[#b8945a]" />
                                  <span>+ Give feedback on this report</span>
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="pt-4 mt-3 border-t border-black/10 flex items-center justify-between">
                            <button
                              onClick={() => onViewItem(item)}
                              className="text-xs font-semibold text-[#1c2b1f] hover:underline cursor-pointer"
                            >
                              View Details
                            </button>
                            <button
                              onClick={() => onDeleteReport(item.id)}
                              className="text-xs text-[#8a2f24] hover:bg-red-50 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= BROWSE TAB ================= */}
          {activeTab === 'browse' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Filter tabs */}
                <div className="inline-flex p-1 bg-black/5 rounded-xl gap-1">
                  {(['all', 'lost', 'found'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setBrowseFilter(t)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                        browseFilter === t
                          ? 'bg-[#1c2b1f] text-[#efe9d9]'
                          : 'text-[#6b6a5f] hover:text-[#1a1a17]'
                      }`}
                    >
                      {t === 'all' ? 'All' : t === 'lost' ? 'Lost' : 'Found'}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="flex items-center gap-2 bg-white border border-[#d9c9a3] rounded-xl px-3 py-1.5 w-full sm:w-64">
                  <Search className="w-4 h-4 text-[#6b6a5f]" />
                  <input
                    type="text"
                    placeholder="Search all items..."
                    value={browseSearch}
                    onChange={(e) => setBrowseSearch(e.target.value)}
                    className="bg-transparent text-xs outline-none w-full text-[#1a1a17]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBrowse.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onViewItem(item)}
                    className="bg-[#f3ecd8] rounded-2xl p-5 shadow-xs border border-[#d9c9a3] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                            item.type === 'lost'
                              ? 'bg-[#e9c9c2] text-[#8a2f24]'
                              : 'bg-[#c9d6c8] text-[#2d4a34]'
                          }`}
                        >
                          {item.type}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                            item.status === 'solved'
                              ? 'bg-[#2d4a34] text-white'
                              : 'bg-[#b8945a]/20 text-[#b8945a]'
                          }`}
                        >
                          {item.status === 'solved' ? '✓ Solved' : 'Open'}
                        </span>
                      </div>

                      <div className="w-full h-32 rounded-xl bg-black/5 flex items-center justify-center text-4xl mb-3 overflow-hidden">
                        {item.imageData ? (
                          <img src={item.imageData} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          item.emoji
                        )}
                      </div>

                      <h4 className="font-serif text-base font-semibold text-[#1a1a17] truncate mb-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#6b6a5f] truncate mb-0.5">{item.location}</p>
                      <p className="text-xs text-[#6b6a5f] font-mono">{formatDate(item.date)}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-black/10 flex items-center justify-between text-xs">
                      <span className="text-[#6b6a5f]">By {item.userName || item.user.split('@')[0]}</span>
                      <span className="font-semibold text-[#1c2b1f]">View Details →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= PROFILE TAB ================= */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div>
                <h2 className="font-serif text-3xl font-medium text-[#1c2b1f]">My Profile</h2>
                <p className="text-sm text-[#6b6a5f] mt-1">Manage your account details and security.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="bg-[#f3ecd8] p-6 rounded-2xl border border-[#d9c9a3] space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#b8945a] to-[#d9c9a3] text-[#1c2b1f] font-serif font-bold text-2xl flex items-center justify-center">
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#1c2b1f]">{user.name}</h3>
                    <p className="text-xs text-[#6b6a5f] font-mono">{user.email}</p>
                    {user.uid && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 mt-1 rounded bg-[#2d4a34]/10 text-[10px] text-[#2d4a34] font-medium border border-[#2d4a34]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        Firebase Auth (Google) • UID: {user.uid.slice(0, 10)}...
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1a1a17] block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1c2b1f]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1a1a17] block mb-1">Email</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1c2b1f]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#1a1a17] block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full p-3 border border-[#d9c9a3] rounded-xl text-sm bg-white focus:outline-none focus:border-[#1c2b1f]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#1c2b1f] hover:bg-[#243527] text-[#efe9d9] font-medium px-6 py-2.5 rounded-xl text-sm shadow-sm cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>

              {/* Password security card */}
              <div className="bg-[#f3ecd8] p-6 rounded-2xl border border-[#d9c9a3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif text-lg font-medium text-[#1c2b1f] flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-[#b8945a]" />
                    Password & Security
                  </h4>
                  <p className="text-xs text-[#6b6a5f] mt-1">
                    Verified via 6-digit OTP passcode sent to your registered email.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenPasswordModal}
                  className="px-4 py-2 bg-[#1c2b1f] text-[#efe9d9] hover:bg-[#243527] rounded-xl text-xs font-semibold shadow-xs cursor-pointer whitespace-nowrap"
                >
                  Change Password
                </button>
              </div>

              {/* Activity stats */}
              <div className="bg-[#f3ecd8] p-6 rounded-2xl border border-[#d9c9a3]">
                <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-[#1c2b1f] mb-4">
                  📊 Activity Summary
                </h4>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="bg-white p-3.5 rounded-xl">
                    <div className="font-serif text-2xl font-bold text-[#1c2b1f]">{myItems.length}</div>
                    <div className="text-[11px] text-[#6b6a5f]">Reports</div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl">
                    <div className="font-serif text-2xl font-bold text-[#8a2f24]">{myLost.length}</div>
                    <div className="text-[11px] text-[#6b6a5f]">Lost</div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl">
                    <div className="font-serif text-2xl font-bold text-[#2d4a34]">{mySolved.length}</div>
                    <div className="text-[11px] text-[#6b6a5f]">Solved</div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl">
                    <div className="font-serif text-2xl font-bold text-[#b8945a]">{myFeedbacks.length}</div>
                    <div className="text-[11px] text-[#6b6a5f]">Feedbacks</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
