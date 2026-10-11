import React from 'react';
import { ItemReport, ReportFeedback } from '../types';
import { formatDate } from '../data/initialData';
import { Star, MapPin, Calendar, Phone, User, MessageSquare, X, CheckCircle2 } from 'lucide-react';

interface ViewItemModalProps {
  item: ItemReport | null;
  feedback?: ReportFeedback;
  isOpen: boolean;
  onClose: () => void;
  onRequestFeedback?: (item: ItemReport) => void;
  isOwner?: boolean;
}

export const ViewItemModal: React.FC<ViewItemModalProps> = ({
  item,
  feedback,
  isOpen,
  onClose,
  onRequestFeedback,
  isOwner,
}) => {
  if (!isOpen || !item) return null;

  return (
    <div
      id="viewModalOverlay"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#140f05]/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-[#1c2b1f]/10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#1a1a17] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Media or Emoji */}
        {item.imageData ? (
          <img
            src={item.imageData}
            alt={item.name}
            className="w-full h-52 object-cover rounded-xl mb-4 border border-[#d9c9a3]"
          />
        ) : (
          <div className="w-full h-36 bg-[#f3ecd8] rounded-xl mb-4 flex items-center justify-center text-6xl">
            {item.emoji}
          </div>
        )}

        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span
            className={`text-xs font-mono uppercase px-2.5 py-1 rounded-md font-semibold ${
              item.type === 'lost' ? 'bg-[#e9c9c2] text-[#8a2f24]' : 'bg-[#c9d6c8] text-[#2d4a34]'
            }`}
          >
            {item.type.toUpperCase()}
          </span>

          <span
            className={`text-xs font-mono px-2.5 py-1 rounded-md font-semibold ${
              item.status === 'solved'
                ? 'bg-[#c9d6c8] text-[#2d4a34]'
                : 'bg-[#b8945a]/20 text-[#b8945a]'
            }`}
          >
            {item.status === 'solved' ? '✓ SOLVED' : 'OPEN'}
          </span>
        </div>

        <h3 className="font-serif text-2xl font-semibold text-[#1c2b1f] mb-3">{item.name}</h3>

        <div className="space-y-2.5 text-sm text-[#3f3d34] mb-5">
          <p className="bg-[#efe9d9]/60 p-3 rounded-xl border border-[#d9c9a3]/50 text-sm leading-relaxed">
            {item.desc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 bg-[#f3ecd8] p-2.5 rounded-lg">
              <MapPin className="w-4 h-4 text-[#b8945a] flex-shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#f3ecd8] p-2.5 rounded-lg">
              <Calendar className="w-4 h-4 text-[#b8945a] flex-shrink-0" />
              <span>{formatDate(item.date)}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#f3ecd8] p-2.5 rounded-lg">
              <Phone className="w-4 h-4 text-[#b8945a] flex-shrink-0" />
              <span>{item.phone}</span>
            </div>
            <div className="flex items-center gap-2 bg-[#f3ecd8] p-2.5 rounded-lg">
              <User className="w-4 h-4 text-[#b8945a] flex-shrink-0" />
              <span className="truncate">{item.userName || item.user}</span>
            </div>
          </div>
        </div>

        {/* Handover verification photo if solved */}
        {item.solvePhoto && (
          <div className="mb-5 p-3.5 bg-[#c8d3bd]/20 rounded-xl border border-[#a9bda0]">
            <div className="text-xs font-semibold text-[#2d4a34] flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Verified Handover Record ({formatDate(item.solveDate)})
            </div>
            <img
              src={item.solvePhoto}
              alt="Handover verification"
              className="w-full h-40 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Feedback Section */}
        {feedback ? (
          <div className="p-4 bg-[#f3ecd8] rounded-xl border border-[#b8945a]/30 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#1c2b1f]">
                <MessageSquare className="w-4 h-4 text-[#b8945a]" />
                Reporter Feedback
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= feedback.rating
                        ? 'fill-[#b8945a] text-[#b8945a]'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold ml-1 text-[#1c2b1f]">{feedback.rating}.0</span>
              </div>
            </div>

            {feedback.tags && feedback.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {feedback.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-white/80 text-[#1c2b1f] font-medium border border-[#d9c9a3]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {feedback.comment && (
              <p className="text-xs text-[#3f3d34] italic mt-1.5 bg-white/50 p-2.5 rounded-lg">
                &ldquo;{feedback.comment}&rdquo;
              </p>
            )}

            <div className="text-[11px] text-[#6b6a5f] mt-2 text-right">
              Submitted by {feedback.userName} · {formatDate(feedback.submittedAt)}
            </div>
          </div>
        ) : isOwner && onRequestFeedback ? (
          <div className="p-4 bg-[#efe9d9] rounded-xl border border-[#d9c9a3] mb-4 flex items-center justify-between">
            <div className="text-xs text-[#6b6a5f]">
              <span className="font-semibold text-[#1c2b1f]">No feedback given yet</span>
              <p>Share your experience about reporting this item.</p>
            </div>
            <button
              onClick={() => {
                onClose();
                onRequestFeedback(item);
              }}
              className="px-3 py-1.5 bg-[#1c2b1f] text-[#efe9d9] rounded-lg text-xs font-medium hover:bg-[#243527] transition-all cursor-pointer flex items-center gap-1"
            >
              <Star className="w-3.5 h-3.5 text-[#b8945a]" />
              Add Feedback
            </button>
          </div>
        ) : null}

        <button
          onClick={onClose}
          className="w-full bg-[#1c2b1f] hover:bg-[#243527] text-[#efe9d9] py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
