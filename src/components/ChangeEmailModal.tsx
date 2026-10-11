import React, { useState, useEffect } from 'react';
import { Mail, Check, X, ShieldCheck, ArrowRight } from 'lucide-react';

interface ChangeEmailModalProps {
  isOpen: boolean;
  currentEmail: string;
  onClose: () => void;
  onSuccess: (newEmail: string) => void;
}

export const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({
  isOpen,
  currentEmail,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<number>(0);
  const [enteredCurrent, setEnteredCurrent] = useState<string>(currentEmail);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [timer, setTimer] = useState<number>(60);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [newEmail, setNewEmail] = useState<string>('');
  const [confirmEmail, setConfirmEmail] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setEnteredCurrent(currentEmail);
  }, [currentEmail]);

  useEffect(() => {
    let interval: any;
    if (step === 1 && timer > 0) {
      interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    } else if (step === 1 && timer === 0) {
      setIsExpired(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  if (!isOpen) return null;

  const handleSendOtp = () => {
    if (enteredCurrent.trim().toLowerCase() !== currentEmail.trim().toLowerCase()) {
      setErrorMessage('Entered email does not match registered admin email.');
      return;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(code);
    setTimer(60);
    setIsExpired(false);
    setOtp(['', '', '', '', '', '']);
    setErrorMessage('');
    setStep(1);
  };

  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);

    if (clean && index < 5) {
      const nextInput = document.getElementById(`cemOtp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`cemOtp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const entered = otp.join('');
    if (entered.length < 6) {
      setErrorMessage('Please enter all 6 digits of the OTP.');
      return;
    }
    if (isExpired) {
      setErrorMessage('This OTP has expired. Please request a new code.');
      return;
    }
    if (entered !== generatedOtp) {
      setErrorMessage('Incorrect OTP. Please check the code and try again.');
      return;
    }
    setErrorMessage('');
    setStep(2);
  };

  const handleUpdateEmail = () => {
    const cleanNew = newEmail.trim();
    const cleanConfirm = confirmEmail.trim();

    if (!cleanNew) {
      setErrorMessage('Please enter a new email address.');
      return;
    }
    if (!cleanNew.includes('@') || !cleanNew.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (cleanNew.toLowerCase() === currentEmail.toLowerCase()) {
      setErrorMessage('New email cannot be the same as the current email.');
      return;
    }
    if (cleanNew.toLowerCase() !== cleanConfirm.toLowerCase()) {
      setErrorMessage('Email addresses do not match.');
      return;
    }

    setStep(3);
    setTimeout(() => {
      onSuccess(cleanNew);
      handleClose();
    }, 1200);
  };

  const handleClose = () => {
    setStep(0);
    setOtp(['', '', '', '', '', '']);
    setNewEmail('');
    setConfirmEmail('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#140f05]/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-[#1c2b1f]/10">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-[#1a1a17] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-[#0f1a12]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {errorMessage && (
          <div className="mb-4 p-2.5 bg-[#e9c9c2]/60 text-[#8a2f24] text-xs rounded-lg font-medium">
            {errorMessage}
          </div>
        )}

        {/* Step 0: Verify current */}
        {step === 0 && (
          <div>
            <h3 className="font-serif text-2xl font-medium text-[#0f1a12] mb-2">Change Admin Email</h3>
            <p className="text-sm text-[#6b6a5f] mb-4">
              To change your admin email, verify ownership of your current registered email with a 6-digit OTP.
            </p>
            <div className="mb-5">
              <label className="text-xs font-semibold text-[#1a1a17] block mb-1">Current Admin Email</label>
              <input
                type="email"
                value={enteredCurrent}
                onChange={(e) => setEnteredCurrent(e.target.value)}
                className="w-full p-2.5 border border-[#d9c9a3] rounded-xl text-sm bg-[#efe9d9]/40 focus:bg-white outline-none focus:border-[#0f1a12]"
              />
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full bg-[#0f1a12] hover:bg-black text-[#efe9d9] py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer"
            >
              Send Verification OTP →
            </button>
          </div>
        )}

        {/* Step 1: OTP */}
        {step === 1 && (
          <div>
            <h3 className="font-serif text-2xl font-medium text-[#0f1a12] mb-1">Enter Verification Code</h3>
            <p className="text-sm text-[#6b6a5f] mb-3">
              Enter the 6-digit code sent to <span className="font-medium text-[#0f1a12]">{enteredCurrent}</span>
            </p>

            <div className="bg-[#0f1a12] text-center p-3.5 rounded-xl mb-4 text-[#efe9d9]">
              <div className="text-[10px] font-mono tracking-widest text-[#d9c9a3] uppercase mb-1">
                Demo Preview OTP
              </div>
              <div className="text-2xl font-mono font-bold tracking-widest text-[#b8945a]">
                {generatedOtp}
              </div>
            </div>

            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`cemOtp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-12 text-center text-xl font-bold font-mono border-2 border-gray-300 focus:border-[#0f1a12] rounded-xl outline-none bg-[#efe9d9]/40 focus:bg-white"
                />
              ))}
            </div>

            <div className="text-center text-xs text-[#6b6a5f] mb-4">
              {isExpired ? (
                <span className="text-[#8a2f24] font-medium">Code expired.</span>
              ) : (
                <span>
                  Code expires in <strong className="text-[#0f1a12]">{timer}s</strong>
                </span>
              )}
              <div className="mt-1">
                <button
                  onClick={handleSendOtp}
                  disabled={timer > 45}
                  className="text-[#0f1a12] underline disabled:opacity-50 text-xs font-semibold cursor-pointer"
                >
                  Resend OTP
                </button>
              </div>
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-[#0f1a12] hover:bg-black text-[#efe9d9] py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer"
            >
              Verify OTP Code →
            </button>
          </div>
        )}

        {/* Step 2: Set New Email */}
        {step === 2 && (
          <div>
            <h3 className="font-serif text-2xl font-medium text-[#0f1a12] mb-2">Set New Admin Email</h3>
            <p className="text-xs text-[#6b6a5f] mb-4">Identity verified. Enter your new primary admin email.</p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-semibold text-[#1a1a17] block mb-1">New Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full p-2.5 border border-[#d9c9a3] rounded-xl text-sm bg-[#efe9d9]/30 focus:bg-white outline-none focus:border-[#0f1a12]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1a1a17] block mb-1">Confirm New Email</label>
                <input
                  type="email"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder="Repeat new email address"
                  className="w-full p-2.5 border border-[#d9c9a3] rounded-xl text-sm bg-[#efe9d9]/30 focus:bg-white outline-none focus:border-[#0f1a12]"
                />
              </div>
            </div>

            <button
              onClick={handleUpdateEmail}
              className="w-full bg-[#0f1a12] hover:bg-black text-[#efe9d9] py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer"
            >
              Update Admin Email
            </button>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-[#c8d3bd] text-[#2d4a34] rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-2xl text-[#0f1a12] mb-1">Email Updated!</h4>
            <p className="text-sm text-[#6b6a5f]">
              Admin email changed from <span className="font-semibold">{currentEmail}</span> to <span className="font-semibold">{newEmail}</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
