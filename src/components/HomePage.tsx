import React, { useState } from 'react';
import { ItemReport, PageType } from '../types';
import { formatDate } from '../data/initialData';
import { Search, ArrowRight, Sparkles, MessageSquareHeart } from 'lucide-react';

interface HomePageProps {
  items: ItemReport[];
  onNavigate: (page: PageType) => void;
  onViewItem: (item: ItemReport) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ items, onNavigate, onViewItem }) => {
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredItems = items.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      searchQuery === '' ||
      (item.name + ' ' + item.desc + ' ' + item.location).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div id="homePageContainer" className="relative">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_80%_15%,rgba(200,211,189,0.45)_0%,transparent_50%),radial-gradient(ellipse_at_10%_80%,rgba(184,148,90,0.2)_0%,transparent_45%)]" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#c8d3bd] text-[#1c2b1f] text-xs font-mono uppercase tracking-widest border border-black/5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#1c2b1f] animate-pulse" />
              1,204 items reunited this month
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tight text-[#1c2b1f] leading-[1.04]">
              Every lost thing<br />
              is someone&apos;s <em className="italic text-[#2d5038]">whole day</em>,<br />
              turned upside down.
            </h1>

            <p className="text-lg text-[#3f3d34] max-w-xl leading-relaxed font-normal">
              Relief connects the person who lost a wallet on the train with the neighbor who picked it up. Post in under a minute — verified, secure, and built for real reunions.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="heroLostBtn"
                onClick={() => onNavigate('login')}
                className="px-7 py-3.5 bg-[#1c2b1f] hover:bg-[#243527] text-[#efe9d9] font-medium text-base rounded-xl shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                I lost something
              </button>
              <button
                id="heroFoundBtn"
                onClick={() => onNavigate('login')}
                className="px-7 py-3.5 bg-[#f3ecd8] hover:bg-white text-[#1a1a17] border border-black/15 font-medium text-base rounded-xl shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                I found something
              </button>
            </div>

            <p className="text-xs text-[#6b6a5f] font-mono tracking-wide pt-1">
              ✓ Most matches happen within 48 hours of posting.
            </p>
          </div>

          {/* Right Corkboard */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              id="heroCorkboard"
              className="relative w-full max-w-md aspect-[1/0.92] rounded-2xl bg-gradient-to-br from-[#c9a966] via-[#b8935a] to-[#c4a060] p-4 shadow-2xl border-4 border-[#8a6030]/20 transform transition-transform hover:scale-[1.01]"
            >
              {/* Cork texture & vignette */}
              <div className="absolute inset-0 rounded-xl bg-black/10 mix-blend-overlay pointer-events-none" />
              <div className="absolute inset-0 rounded-xl bg-[radial-gradient(ellipse_at_50%_50%,transparent_35%,rgba(60,35,8,0.4)_100%)] pointer-events-none" />

              {/* Pinned Note 1: Calculator */}
              <div
                onClick={() => {
                  const item = items.find((i) => i.name.includes('Calculator'));
                  if (item) onViewItem(item);
                }}
                className="absolute top-4 left-4 w-36 bg-[#f7f0da] rounded-md p-2.5 pt-4 shadow-lg -rotate-6 hover:rotate-0 hover:scale-105 transition-all cursor-pointer z-10"
              >
                {/* Pin */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-[#e06b5a] to-[#8a2f24] shadow-md border border-black/20" />
                <div className="text-3xl text-center mb-1">🧮</div>
                <span className="inline-block text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#e9c9c2] text-[#8a2f24] mb-1">
                  Lost
                </span>
                <div className="font-serif text-xs font-semibold text-[#1a1a17] truncate">Calculator</div>
                <div className="text-[10px] text-[#6b6a5f] truncate">Science Block · Today</div>
              </div>

              {/* Pinned Note 2: Student ID */}
              <div
                onClick={() => {
                  const item = items.find((i) => i.name.includes('Student ID'));
                  if (item) onViewItem(item);
                }}
                className="absolute top-5 right-5 w-36 bg-[#f7f0da] rounded-md p-2.5 pt-4 shadow-lg rotate-6 hover:rotate-0 hover:scale-105 transition-all cursor-pointer z-10"
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-[#e06b5a] to-[#8a2f24] shadow-md border border-black/20" />
                <div className="text-3xl text-center mb-1">🪪</div>
                <span className="inline-block text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#e9c9c2] text-[#8a2f24] mb-1">
                  Lost
                </span>
                <div className="font-serif text-xs font-semibold text-[#1a1a17] truncate">Student ID</div>
                <div className="text-[10px] text-[#6b6a5f] truncate">Library · Yesterday</div>
              </div>

              {/* Pinned Note 3: Water Bottle */}
              <div
                onClick={() => {
                  const item = items.find((i) => i.name.includes('Bottle'));
                  if (item) onViewItem(item);
                }}
                className="absolute bottom-5 left-5 w-36 bg-[#f7f0da] rounded-md p-2.5 pt-4 shadow-lg -rotate-3 hover:rotate-0 hover:scale-105 transition-all cursor-pointer z-10"
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-[#e06b5a] to-[#8a2f24] shadow-md border border-black/20" />
                <div className="text-3xl text-center mb-1">💧</div>
                <span className="inline-block text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#c9d6c8] text-[#2d4a34] mb-1">
                  Found
                </span>
                <div className="font-serif text-xs font-semibold text-[#1a1a17] truncate">Water Bottle</div>
                <div className="text-[10px] text-[#6b6a5f] truncate">Cafeteria · Solved</div>
              </div>

              {/* Pinned Note 4: AirPods */}
              <div
                onClick={() => {
                  const item = items.find((i) => i.name.includes('AirPods'));
                  if (item) onViewItem(item);
                }}
                className="absolute bottom-6 right-4 w-36 bg-[#f7f0da] rounded-md p-2.5 pt-4 shadow-lg rotate-8 hover:rotate-0 hover:scale-105 transition-all cursor-pointer z-10"
              >
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-[#e06b5a] to-[#8a2f24] shadow-md border border-black/20" />
                <div className="text-3xl text-center mb-1">🎧</div>
                <span className="inline-block text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-[#e9c9c2] text-[#8a2f24] mb-1">
                  Lost
                </span>
                <div className="font-serif text-xs font-semibold text-[#1a1a17] truncate">AirPods Pro</div>
                <div className="text-[10px] text-[#6b6a5f] truncate">Gym area · 2d ago</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROCESS SECTION ================= */}
      <section id="process-section" className="py-24 border-t border-black/5 bg-[#efe9d9]/60">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c8d3bd] text-[#1c2b1f] text-xs font-mono uppercase tracking-wider mb-4 border border-black/5">
            <span className="w-2 h-2 rounded-full bg-[#1c2b1f]" />
            The process
          </div>

          <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#1c2b1f] tracking-tight mb-4">
            Three steps back to its owner
          </h2>

          <p className="text-base text-[#3f3d34] max-w-2xl leading-relaxed mb-12">
            No middleman, no complicated shipping labels — just a clear trail from the sidewalk or bench where it was found to the hands it belongs in.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-[#d9c9a3]/60 hover:bg-[#d9c9a3] p-8 rounded-2xl shadow-xs transition-all hover:-translate-y-1">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#c8d3bd] text-[#1c2b1f] font-mono font-semibold text-xs mb-6">
                01
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[#1a1a17] mb-3">
                Post the details
              </h3>
              <p className="text-sm text-[#4a4940] leading-relaxed">
                Snap a photo, drop a recognizable location, and describe any distinctive traits. Takes under 60 seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#d9c9a3]/60 hover:bg-[#d9c9a3] p-8 rounded-2xl shadow-xs transition-all hover:-translate-y-1">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#c8d3bd] text-[#1c2b1f] font-mono font-semibold text-xs mb-6">
                02
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[#1a1a17] mb-3">
                We surface the match
              </h3>
              <p className="text-sm text-[#4a4940] leading-relaxed">
                Relief checks newly reported items against the community board automatically and flags likely matches immediately.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#d9c9a3]/60 hover:bg-[#d9c9a3] p-8 rounded-2xl shadow-xs transition-all hover:-translate-y-1">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#c8d3bd] text-[#1c2b1f] font-mono font-semibold text-xs mb-6">
                03
              </span>
              <h3 className="font-serif text-2xl font-semibold text-[#1a1a17] mb-3">
                Message, meet & review
              </h3>
              <p className="text-sm text-[#4a4940] leading-relaxed">
                Coordinate a safe handover in a public area, mark the item as solved, and share your experience to help the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BROWSE / RECENTLY POSTED ================= */}
      <section id="browse-section" className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#1c2b1f] tracking-tight">
                Recently posted
              </h2>
              <p className="text-sm text-[#6b6a5f] mt-1.5">
                Browse recently reported items across campus and neighborhood spots.
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Filter Tabs */}
              <div className="inline-flex p-1 bg-black/5 rounded-xl gap-1">
                {(['all', 'lost', 'found'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      filterType === t
                        ? 'bg-[#1c2b1f] text-[#efe9d9] shadow-xs'
                        : 'text-[#6b6a5f] hover:text-[#1a1a17]'
                    }`}
                  >
                    {t === 'all' ? 'All items' : t === 'lost' ? 'Lost' : 'Found'}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="flex items-center gap-2 bg-[#f3ecd8] border border-black/15 rounded-xl px-3.5 py-2 w-full sm:w-64 focus-within:border-[#1c2b1f] focus-within:ring-2 focus-within:ring-[#1c2b1f]/10 transition-all">
                <Search className="w-4 h-4 text-[#6b6a5f]" />
                <input
                  type="text"
                  placeholder="Search item, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm w-full text-[#1a1a17] placeholder:text-[#6b6a5f]"
                />
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                onClick={() => onViewItem(item)}
                className="group bg-[#d9c9a3]/70 hover:bg-[#d9c9a3] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col cursor-pointer border border-[#c9b98a]/40"
              >
                <div
                  className={`aspect-4/3 flex items-center justify-center text-6xl relative overflow-hidden ${
                    item.type === 'found' ? 'bg-[#b8cdb9]' : 'bg-[#d8bfb0]'
                  }`}
                >
                  {item.imageData ? (
                    <img
                      src={item.imageData}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="group-hover:scale-110 transition-transform duration-300">
                      {item.emoji}
                    </span>
                  )}

                  <span
                    className={`absolute top-3 left-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs ${
                      item.type === 'lost'
                        ? 'bg-[#e9c9c2] text-[#8a2f24]'
                        : 'bg-[#c9d6c8] text-[#2d4a34]'
                    }`}
                  >
                    {item.type}
                  </span>

                  {item.status === 'solved' && (
                    <span className="absolute top-3 right-3 text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-[#2d4a34] text-white">
                      ✓ Solved
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-[#1a1a17] leading-snug line-clamp-1 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#6b6a5f] truncate mb-0.5">{item.location}</p>
                    <p className="text-xs text-[#6b6a5f] font-mono mb-4">{formatDate(item.date)}</p>
                  </div>

                  <button className="w-full py-2 px-3 text-xs font-medium border border-black/15 group-hover:border-black/30 rounded-lg bg-[#f3ecd8] group-hover:bg-white text-[#1a1a17] transition-colors flex items-center justify-center gap-1.5 cursor-pointer">
                    <span>View details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16 bg-[#f3ecd8]/60 rounded-2xl border border-dashed border-[#d9c9a3]">
              <p className="text-base text-[#6b6a5f]">No matching reports found.</p>
              <button
                onClick={() => {
                  setFilterType('all');
                  setSearchQuery('');
                }}
                className="mt-3 text-xs font-semibold text-[#1c2b1f] underline cursor-pointer"
              >
                Clear search filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="bg-[#1c2b1f] text-[#efe9d9] rounded-3xl p-10 md:p-14 shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div>
              <div className="font-serif text-4xl md:text-6xl font-medium tracking-tight text-[#efe9d9] mb-1">
                18,402
              </div>
              <p className="text-xs md:text-sm text-[#a9bda0] font-mono">Items posted to date</p>
            </div>

            <div>
              <div className="font-serif text-4xl md:text-6xl font-medium tracking-tight text-[#efe9d9] mb-1">
                11,760
              </div>
              <p className="text-xs md:text-sm text-[#a9bda0] font-mono">Successfully reunited</p>
            </div>

            <div>
              <div className="font-serif text-4xl md:text-6xl font-medium tracking-tight text-[#efe9d9] mb-1">
                64%
              </div>
              <p className="text-xs md:text-sm text-[#a9bda0] font-mono">Matched within 48h</p>
            </div>

            <div>
              <div className="font-serif text-4xl md:text-6xl font-medium tracking-tight text-[#efe9d9] mb-1">
                312
              </div>
              <p className="text-xs md:text-sm text-[#a9bda0] font-mono">Active campus zones</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STORY SECTION ================= */}
      <section id="stories-section" className="py-24 border-t border-black/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c8d3bd] text-[#1c2b1f] text-xs font-mono uppercase tracking-wider border border-black/5">
              <span className="w-2 h-2 rounded-full bg-[#1c2b1f]" />
              A recent reunion
            </div>

            <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#1c2b1f] tracking-tight leading-tight">
              &ldquo;I thought my AirPods were gone right before finals week.&rdquo;
            </h2>
          </div>

          <div className="lg:col-span-7 bg-[#d9c9a3]/70 p-8 md:p-12 rounded-3xl shadow-sm relative">
            <span className="font-serif text-7xl text-[#b8945a] leading-none block mb-2 opacity-80">
              &ldquo;
            </span>
            <blockquote className="font-serif italic text-xl md:text-2xl text-[#1a1a17] leading-relaxed mb-6 font-normal">
              I left my AirPods Pro charging case on a study table in the library during late-night revision and panicked when I couldn&apos;t find them the next morning. I reported them lost on Relief — within three hours, a fellow student who found them on table 14 reached out. We met outside the campus café and I got them back with full battery!
            </blockquote>
            <div className="border-t border-black/10 pt-4">
              <strong className="block text-base font-semibold text-[#1c2b1f]">Rohan S. (2nd Year CS)</strong>
              <span className="text-xs font-mono text-[#6b6a5f]">Reunited in 3 hours · Central Library</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="pt-20 pb-12 border-t border-black/10 bg-[#e8e0c9]/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          <div>
            <div className="flex items-center gap-2 font-serif text-2xl font-semibold text-[#1c2b1f] mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#b8945a] flex items-center justify-center text-white text-sm">
                📋
              </div>
              <span>Relief</span>
            </div>
            <p className="text-sm text-[#6b6a5f] leading-relaxed max-w-xs">
              A community lost and found board for the things that go missing, and the kind people who find them.
            </p>
          </div>

          <div>
            <h5 className="font-mono text-xs uppercase tracking-widest text-[#6b6a5f] font-semibold mb-4">
              Browse
            </h5>
            <ul className="space-y-2 text-sm text-[#1a1a17]">
              <li>
                <button onClick={() => setFilterType('lost')} className="hover:text-[#1c2b1f] cursor-pointer">
                  Lost items
                </button>
              </li>
              <li>
                <button onClick={() => setFilterType('found')} className="hover:text-[#1c2b1f] cursor-pointer">
                  Found items
                </button>
              </li>
              <li>
                <button onClick={() => setFilterType('all')} className="hover:text-[#1c2b1f] cursor-pointer">
                  All community posts
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-xs uppercase tracking-widest text-[#6b6a5f] font-semibold mb-4">
              Relief
            </h5>
            <ul className="space-y-2 text-sm text-[#1a1a17]">
              <li>
                <a href="#process-section" className="hover:text-[#1c2b1f]">
                  How it works
                </a>
              </li>
              <li>
                <a href="#stories-section" className="hover:text-[#1c2b1f]">
                  Reunion stories
                </a>
              </li>
              <li>
                <button onClick={() => onNavigate('login')} className="hover:text-[#1c2b1f] cursor-pointer">
                  Report an item
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-mono text-xs uppercase tracking-widest text-[#6b6a5f] font-semibold mb-4">
              Portals
            </h5>
            <ul className="space-y-2 text-sm text-[#1a1a17]">
              <li>
                <button onClick={() => onNavigate('login')} className="hover:text-[#1c2b1f] cursor-pointer">
                  User sign in
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('signup')} className="hover:text-[#1c2b1f] cursor-pointer">
                  Create account
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-login')} className="hover:text-[#1c2b1f] text-xs font-mono cursor-pointer">
                  Admin portal →
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-6 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6b6a5f]">
          <span>© 2026 Relief. Made for the things we can&apos;t bear to lose.</span>
          <span className="font-mono">v1.2 · Post-Report Feedback Enabled</span>
        </div>
      </footer>
    </div>
  );
};
