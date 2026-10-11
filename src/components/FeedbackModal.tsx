import React, { useState } from 'react';
import { ItemReport, ReportFeedback, RecommendationOption } from '../types';
import { Star, MessageSquareHeart, Sparkles, X } from 'lucide-react';

interface FeedbackModalProps {
  item: ItemReport | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (feedback: Omit<ReportFeedback, 'id' | 'submittedAt'>) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Needs improvement 😕',
  2: 'Could be better 😐',
  3: 'Fair & straightforward 🙂',
  4: 'Very good & smooth 😊',
  5: 'Outstanding & fast! 🌟',
};

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  item,
  isOpen,
  onClose,
  onSubmitFeedback,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [recommendation, setRecommendation] = useState<RecommendationOption>('definitely');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    onSubmitFeedback({
      itemId: item.id,
      itemName: item.name,
      itemType: item.type,
      userEmail: item.user,
      userName: item.userName || item.user.split('@')[0],
      rating,
      tags: [],
      comment: comment.trim(),
      recommendation,
      adminReviewed: false,
    });

    setIsSubmitting(false);
  };

  const activeStars = hoverRating || rating;

  return (
    <div
      id="feedbackModalOverlay"
      className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-[#140f05]/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg bg-[#ffffff] rounded-2xl shadow-2xl border border-[#1c2b1f]/10 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top decorative header */}
        <div className="bg-gradient-to-r from-[#1c2b1f] via-[#243527] to-[#1c2b1f] text-[#efe9d9] p-6 pb-5 relative">
          <button
            id="closeFeedbackModalBtn"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            title="Skip or Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#b8945a]/25 border border-[#b8945a]/40 text-[#efe9d9] text-xs font-mono uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-[#b8945a]" />
            Report Published
          </div>

          <h2 className="font-serif text-2xl font-medium text-[#efe9d9]">
            How was your reporting experience?
          </h2>

          {/* Item reference card */}
          <div className="mt-3.5 bg-white/10 rounded-xl p-2.5 px-3.5 flex items-center gap-3 border border-white/10">
            <span className="text-2xl flex-shrink-0">{item.emoji || '📋'}</span>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-mono uppercase tracking-wider text-[#d9c9a3]">
                Feedback for: {item.type === 'lost' ? 'Lost Item Report' : 'Found Item Report'}
              </div>
              <div className="text-sm font-semibold text-[#ffffff] truncate">{item.name}</div>
            </div>
            <span
              className={`text-[11px] font-mono px-2.5 py-1 rounded-md font-semibold ${
                item.type === 'lost' ? 'bg-[#e9c9c2] text-[#8a2f24]' : 'bg-[#c9d6c8] text-[#2d4a34]'
              }`}
            >
              {item.type.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Star Rating */}
          <div className="text-center py-2 bg-[#f3ecd8]/50 rounded-xl border border-[#d9c9a3]/40 p-4">
            <label className="block text-xs font-mono uppercase tracking-wider text-[#6b6a5f] font-semibold mb-2">
              Rate the reporting process
            </label>
            <div className="flex justify-center items-center gap-2 mb-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  id={`starRatingBtn-${star}`}
                  className="p-1.5 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`${star} star`}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= activeStars
                        ? 'fill-[#b8945a] text-[#b8945a]'
                        : 'text-[#d9c9a3] hover:text-[#b8945a]/60'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-sm font-medium text-[#1c2b1f] min-h-[22px]">
              {RATING_LABELS[activeStars] || 'Click to select rating'}
            </div>
          </div>

          {/* Feedback details textarea */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#6b6a5f] font-semibold mb-1.5">
              Description (Optional)
            </label>
            <textarea
              id="feedbackCommentInput"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you liked about reporting this item, or what features would help you find or return items faster..."
              className="w-full text-sm p-3 rounded-xl border border-[#d9c9a3] bg-[#efe9d9]/40 focus:bg-white focus:outline-none focus:border-[#1c2b1f] focus:ring-2 focus:ring-[#1c2b1f]/10 transition-all resize-none text-[#1a1a17]"
            />
          </div>

          {/* Recommendation */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#6b6a5f] font-semibold mb-2">
              Would you recommend Relief to friends or colleagues?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 'definitely', label: 'Definitely Yes 👍' },
                { val: 'maybe', label: 'Maybe 🤔' },
                { val: 'not_likely', label: 'Not Yet 👎' },
              ].map((rec) => (
                <button
                  type="button"
                  key={rec.val}
                  onClick={() => setRecommendation(rec.val as RecommendationOption)}
                  className={`text-xs py-2 px-2 rounded-xl text-center font-medium border transition-all cursor-pointer ${
                    recommendation === rec.val
                      ? 'bg-[#c8d3bd] text-[#1c2b1f] border-[#2d4a34] font-semibold shadow-xs'
                      : 'bg-[#f3ecd8] text-[#6b6a5f] border-[#d9c9a3] hover:bg-[#e8e0c9]'
                  }`}
                >
                  {rec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#d9c9a3]/30">
            <button
              type="button"
              id="skipFeedbackBtn"
              onClick={onClose}
              className="text-xs font-medium text-[#6b6a5f] hover:text-[#1c2b1f] underline transition-colors px-2 py-2 cursor-pointer"
            >
              Skip for now
            </button>

            <button
              type="submit"
              id="submitFeedbackBtn"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-[#1c2b1f] hover:bg-[#243527] text-[#efe9d9] px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
            >
              <MessageSquareHeart className="w-4 h-4 text-[#b8945a]" />
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
