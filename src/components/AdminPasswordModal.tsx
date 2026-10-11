import React, { useState, useEffect } from 'react';
import { KeyRound, Mail, Check, X, Eye, EyeOff, ShieldCheck } from 'lucide-react';

interface AdminPasswordModalProps {
  isOpen: boolean;
  adminEmail: string;
  onClose: () => void;
  onSuccess: (newPassword: string) => void;
}

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  adminEmail,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<number>(0);
  const [enteredEmail, setEnteredEmail] = useState<string>(adminEmail);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [timer, setTimer] = useState<number>(60);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [newPass, setNewPass] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [showPass, setShowPass] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    setEnteredEmail(adminEmail);
  }, [adminEmail]);

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
    if (enteredEmail.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
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
      const nextInput = document.getElementById(`adminOtp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`adminOtp-${index - 1}`);
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

  const handleUpdatePassword = () => {
    if (!newPass) {
      setErrorMessage('Please enter a new password.');
      return;
    }
    if (newPass.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (newPass !== confirmPass) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    setStep(3);
    setTimeout(() => {
      onSuccess(newPass);
      handleClose();
    }, 1200);
  };

  const handleClose = () => {
    setStep(0);
    setOtp(['', '', '', '', '', '']);
    setNewPass('');
    setConfirmPass('');
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

        {/* Step 0 */}
        {step === 0 && (
          <div>
            <h3 className="font-serif text-2xl font-medium text-[#0f1a12] mb-2">Verify Admin Email</h3>
            <p className="text-sm text-[#6b6a5f] mb-4">
              Enter registered admin email to receive a 6-digit OTP code before changing the password.
            </p>
            <div className="mb-5">
              <label className="text-xs font-semibold text-[#1a1a17] block mb-1">Admin Email</label>
              <input
                type="email"
                value={enteredEmail}
                onChange={(e) => setEnteredEmail(e.target.value)}
                className="w-full p-2.5 border border-[#d9c9a3] rounded-xl text-sm bg-[#efe9d9]/40 focus:bg-white outline-none focus:border-[#0f1a12]"
              />
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full bg-[#0f1a12] hover:bg-black text-[#efe9d9] py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer"
            >
              Send OTP Code →
            </button>
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h3 className="font-serif text-2xl font-medium text-[#0f1a12] mb-1">Enter Admin OTP</h3>
            <p className="text-sm text-[#6b6a5f] mb-3">
              Enter the 6-digit passcode sent to <span className="font-medium text-[#0f1a12]">{enteredEmail}</span>
            </p>

            <div className="bg-[#0f1a12] text-center p-3.5 rounded-xl mb-4 text-[#efe9d9]">
              <div className="text-[10px] font-mono tracking-widest text-[#d9c9a3] uppercase mb-1">
                Demo Admin Code
              </div>
              <div className="text-2xl font-mono font-bold tracking-widest text-[#b8945a]">
                {generatedOtp}
              </div>
            </div>

            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`adminOtp-${idx}`}
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

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h3 className="font-serif text-2xl font-medium text-[#0f1a12] mb-2">Set New Admin Password</h3>
            <p className="text-xs text-[#6b6a5f] mb-4">Identity verified. Create a secure password for admin operations.</p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-semibold text-[#1a1a17] block mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full p-2.5 pr-10 border border-[#d9c9a3] rounded-xl text-sm bg-[#efe9d9]/30 focus:bg-white outline-none focus:border-[#0f1a12]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black cursor-pointer"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1a1a17] block mb-1">Confirm New Password</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full p-2.5 border border-[#d9c9a3] rounded-xl text-sm bg-[#efe9d9]/30 focus:bg-white outline-none focus:border-[#0f1a12]"
                />
              </div>
            </div>

            <button
              onClick={handleUpdatePassword}
              className="w-full bg-[#0f1a12] hover:bg-black text-[#efe9d9] py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm cursor-pointer"
            >
              Update Admin Password
            </button>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-[#c8d3bd] text-[#2d4a34] rounded-full flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-2xl text-[#0f1a12] mb-1">Admin Password Changed!</h4>
            <p className="text-sm text-[#6b6a5f]">You can now sign in using your new credentials.</p>
          </div>
        )}
      </div>
    </div>
  );
};
