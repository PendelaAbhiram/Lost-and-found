import React, { useState } from 'react';
import { ItemReport } from '../types';
import { Camera, Check, X } from 'lucide-react';

interface SolveModalProps {
  item: ItemReport | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSolve: (itemId: number, photoData: string | null) => void;
}

export const SolveModal: React.FC<SolveModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmSolve,
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  if (!isOpen || !item) return null;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    onConfirmSolve(item.id, photoPreview);
    setPhotoPreview(null);
    onClose();
  };

  return (
    <div
      id="solveModalOverlay"
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#140f05]/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-[#1c2b1f]/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#1a1a17] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-serif text-2xl font-medium text-[#1c2b1f] mb-2">Mark as Solved</h3>
        <p className="text-sm text-[#6b6a5f] mb-4">
          Upload a handover photo of the item being safely returned to verify resolution.
        </p>

        <div className="p-3 bg-[#f3ecd8] rounded-xl mb-4 text-sm">
          <strong className="text-[#1c2b1f]">Item:</strong> {item.name}
          <div className="text-xs text-[#6b6a5f] mt-0.5 font-mono uppercase">
            {item.type} · Reported by {item.user}
          </div>
        </div>

        <label
          htmlFor="solvePhotoInput"
          className="border-2 border-dashed border-[#1c2b1f]/20 hover:border-[#1c2b1f] rounded-xl p-6 text-center cursor-pointer bg-[#efe9d9]/50 hover:bg-white block transition-all mb-5"
        >
          <Camera className="w-9 h-9 text-[#1c2b1f]/60 mx-auto mb-2" />
          <div className="font-medium text-sm text-[#1c2b1f]">Upload handover photo</div>
          <div className="text-xs text-[#6b6a5f] mt-0.5">Photo of owner receiving the item (optional)</div>
          <input
            id="solvePhotoInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Handover preview"
              className="w-full h-36 object-cover rounded-lg mt-3 border border-[#d9c9a3]"
            />
          )}
        </label>

        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-[#1c2b1f] hover:bg-[#243527] text-[#efe9d9] font-medium py-2.5 px-4 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 text-[#b8945a]" />
            Confirm Solved
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-black/15 hover:bg-black/5 rounded-xl text-sm font-medium text-[#1a1a17] transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
