    // ==============================================================================
    // 06_MODALS.JSX
    // Authentication, OTP Verification, Secure Admin Gateway, Investment Modal
    // with Dynamic Prokolpo Allocation Breakdown, Multi-Channel Deposit & Withdraw,
    // Digital Agricultural Partnership Certificate, Farm IoT, & Live AI Advisor
    // ==============================================================================

    function AuthModal({ lang = 'bn', mode, setMode, initialVerifyEmail, onClose, onSuccess, onOpenAdminGateway }) {
      const [email, setEmail] = React.useState(initialVerifyEmail || '');
      const [password, setPassword] = React.useState('');
      const [name, setName] = React.useState('');
      const [phone, setPhone] = React.useState('');
      const [otp, setOtp] = React.useState('');
      const [loading, setLoading] = React.useState(false);
      const [errorMessage, setErrorMessage] = React.useState('');
      const [successMessage, setSuccessMessage] = React.useState('');
      const [showOtpScreen, setShowOtpScreen] = React.useState(!!initialVerifyEmail);
      const [resendCooldown, setResendCooldown] = React.useState(0);

      // Forgot Password State
      const [forgotStep, setForgotStep] = React.useState('request'); // 'request' | 'reset'
      const [resetOtp, setResetOtp] = React.useState('');
      const [newPassword, setNewPassword] = React.useState('');
      const [confirmPassword, setConfirmPassword] = React.useState('');

      React.useEffect(() => {
        let timer;
        if (resendCooldown > 0) {
          timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
        }
        return () => clearTimeout(timer);
      }, [resendCooldown]);

      const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);
        try {
          const res = await apiCall('/api/auth/login', 'POST', { email, password });
          if (res.success) {
            onSuccess(res.user, res.token);
          } else {
            setErrorMessage(res.message || (lang === 'bn' ? 'লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।' : 'Login failed. Please check credentials.'));
          }
        } catch (err) {
          setErrorMessage(err.message || (lang === 'bn' ? 'নেটওয়ার্ক সংযোগ সমস্যা।' : 'Network error during login.'));
        } finally {
          setLoading(false);
        }
      };

      const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);
        try {
          const res = await apiCall('/api/auth/register', 'POST', { name, email, password, phone });
          if (res.success) {
            if (res.autoActivated && res.token && res.user) {
              onSuccess(res.user, res.token);
              return;
            }
            setSuccessMessage(res.message || (lang === 'bn' ? 'রেজিস্ট্রেশন সম্পন্ন! আপনার ইমেইলে ওটিপি পাঠানো হয়েছে।' : 'Registration successful! Verification code sent to email.'));
            setShowOtpScreen(true);
            setOtp('');
            setResendCooldown(60);
          } else {
            setErrorMessage(res.message || (lang === 'bn' ? 'রেজিস্ট্রেশন ব্যর্থ হয়েছে।' : 'Registration failed.'));
          }
        } catch (err) {
          setErrorMessage(err.message || (lang === 'bn' ? 'নেটওয়ার্ক সংযোগ ত্রুটি।' : 'Network error during registration.'));
        } finally {
          setLoading(false);
        }
      };

      const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);
        try {
          const res = await apiCall('/api/auth/verify-email', 'POST', { email, otp: otp.trim() });
          if (res.success) {
            onSuccess(res.user, res.token);
          } else {
            setErrorMessage(res.message || (lang === 'bn' ? 'ভুল ওটিপি কোড।' : 'Invalid OTP code.'));
          }
        } catch (err) {
          setErrorMessage(err.message || (lang === 'bn' ? 'ওটিপি যাচাইকরণে সমস্যা।' : 'Error verifying OTP code.'));
        } finally {
          setLoading(false);
        }
      };

      const handleResendOtp = async () => {
        if (resendCooldown > 0) return;
        setErrorMessage('');
        setSuccessMessage('');
        try {
          const res = await apiCall('/api/auth/resend-verification', 'POST', { email });
          if (res.success) {
            setSuccessMessage(lang === 'bn' ? 'নতুন ওটিপি কোড পাঠানো হয়েছে। ইমেইল ইনবক্স বা স্প্যাম চেক করুন।' : 'Fresh OTP dispatched. Please check your inbox or spam folder.');
            setOtp('');
            setResendCooldown(60);
          } else {
            setErrorMessage(res.message || (lang === 'bn' ? 'ওটিপি পুনরায় পাঠাতে ব্যর্থ হয়েছে।' : 'Failed to resend OTP.'));
          }
        } catch (err) {
          setErrorMessage(lang === 'bn' ? 'ওটিপি পাঠাতে সমস্যা হয়েছে।' : 'Error resending OTP.');
        }
      };

      const handleForgotRequestOtp = async (e) => {
        if (e) e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        if (!email || !email.includes('@')) {
          setErrorMessage(lang === 'bn' ? 'একটি সঠিক ইমেইল ঠিকানা প্রদান করুন।' : 'Please enter a valid email address.');
          return;
        }
        setLoading(true);
        try {
          const res = await apiCall('/api/auth/forgot-password', 'POST', { email });
          if (res.success) {
            setSuccessMessage(res.message || (lang === 'bn' ? 'আপনার ইমেইলে ওটিপি পাঠানো হয়েছে!' : 'Password reset code sent to your email!'));
            setForgotStep('reset');
            setResetOtp('');
            setResendCooldown(60);
          } else {
            setErrorMessage(res.message || (lang === 'bn' ? 'ওটিপি পাঠাতে ব্যর্থ হয়েছে।' : 'Failed to send reset code.'));
          }
        } catch (err) {
          setErrorMessage(err.message || (lang === 'bn' ? 'নেটওয়ার্ক সংযোগ সমস্যা।' : 'Network connection error.'));
        } finally {
          setLoading(false);
        }
      };

      const handleResetPassword = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        if (!resetOtp || resetOtp.length < 6) {
          setErrorMessage(lang === 'bn' ? '৬-সংখ্যার ওটিপি কোডটি সঠিকভাবে লিখুন।' : 'Please enter the 6-digit OTP code.');
          return;
        }
        if (!newPassword || newPassword.length < 6) {
          setErrorMessage(lang === 'bn' ? 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'New password must be at least 6 characters.');
          return;
        }
        if (newPassword !== confirmPassword) {
          setErrorMessage(lang === 'bn' ? 'নতুন পাসওয়ার্ড দুটি মিলছে না।' : 'Passwords do not match.');
          return;
        }
        setLoading(true);
        try {
          const res = await apiCall('/api/auth/reset-password', 'POST', {
            email,
            otp: resetOtp.trim(),
            newPassword
          });
          if (res.success) {
            setSuccessMessage(res.message || (lang === 'bn' ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।' : 'Password updated successfully! Please sign in.'));
            setPassword('');
            setResetOtp('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => {
              setMode('login');
              setForgotStep('request');
            }, 2500);
          } else {
            setErrorMessage(res.message || (lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।' : 'Password reset failed.'));
          }
        } catch (err) {
          setErrorMessage(err.message || (lang === 'bn' ? 'নেটওয়ার্ক সংযোগ সমস্যা।' : 'Network connection error.'));
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative animate-fade-in">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition"
            >
              ✕
            </button>

            {/* HEADER */}
            <div className="text-center space-y-1">
              <span className="text-3xl">{mode === 'forgot' ? '🔐' : '🌾'}</span>
              <h2 className="text-xl font-black text-slate-900">
                {showOtpScreen
                  ? (lang === 'bn' ? 'ইমেইল ওটিপি যাচাইকরণ' : 'Verify Email Address')
                  : mode === 'forgot'
                  ? (forgotStep === 'request'
                      ? (lang === 'bn' ? 'পাসওয়ার্ড পুনরুদ্ধার' : 'Reset Password')
                      : (lang === 'bn' ? 'নতুন পাসওয়ার্ড নির্ধারণ' : 'Set New Password'))
                  : (mode === 'login' ? (lang === 'bn' ? 'বিনিয়োগকারী প্রবেশ' : 'Investor Sign In') : (lang === 'bn' ? 'নতুন একাউন্ট খুলুন' : 'Create Investor Account'))}
              </h2>
              <p className="text-xs text-slate-500">
                {showOtpScreen
                  ? (lang === 'bn' ? 'আপনার ইমেইলে পাঠানো ৬-সংখ্যার ওটিপি কোডটি লিখুন' : 'Enter the 6-digit OTP code sent to your email')
                  : mode === 'forgot'
                  ? (forgotStep === 'request'
                      ? (lang === 'bn' ? 'আপনার নিবন্ধিত ইমেইল দিন, পাসওয়ার্ড রিসেট ওটিপি পাঠানো হবে' : 'Enter registered email to receive a 6-digit reset OTP code')
                      : (lang === 'bn' ? 'ইমেইলের ওটিপি কোড এবং আপনার নতুন পাসওয়ার্ড লিখুন' : 'Enter the 6-digit OTP code and your new password'))
                  : (mode === 'login' ? (lang === 'bn' ? 'আপনার পোর্টফোলিও ও রিটার্ন দেখতে লগইন করুন' : 'Sign in to access your portfolio & agricultural returns') : (lang === 'bn' ? 'নিরাপদ প্রাতিষ্ঠানিক কৃষি প্রকল্পে বিনিয়োগের সুযোগ' : 'Invest in insured agricultural ventures with direct yield'))}
              </p>
            </div>

            {/* ALERTS */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <span>✓</span>
                <span>{successMessage}</span>
              </div>
            )}

            {/* OTP VERIFICATION VIEW */}
            {showOtpScreen ? (
              <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'bn' ? 'রেজিস্ট্রিকৃত ইমেইল ঠিকানা' : 'Registered Email'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-medium"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">
                      {lang === 'bn' ? '৬-সংখ্যার ওটিপি কোড *' : '6-Digit Verification Code *'}
                    </label>
                  </div>
                  <input
                    type="text"
                    name="oneTimePassword"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center font-mono text-2xl font-black tracking-widest text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <div className="mt-3 p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                      <span>📩</span>
                      <span>{lang === 'bn' ? 'ইমেইল ইনবক্স বা স্প্যাম ফোল্ডার চেক করুন' : 'Verification Code Sent to Email'}</span>
                    </div>
                    <p className="text-[10px] text-emerald-800 leading-relaxed">
                      {lang === 'bn'
                        ? 'আপনার ইমেইল ঠিকানায় একটি গোপন ৬-সংখ্যার ভেরিফিকেশন ওটিপি পাঠানো হয়েছে। অনুগ্রহ করে ইনবক্স চেক করে কোডটি নিচের বক্সে লিখুন।'
                        : 'A 6-digit verification OTP has been dispatched to your email address. Please check your inbox or spam folder and enter the code.'}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl gradient-agro text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  {loading ? (lang === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying Code...') : (lang === 'bn' ? 'একাউন্ট সক্রিয় ও প্রবেশ করুন' : 'Activate & Sign In Instantly')}
                </button>

                <div className="flex justify-between items-center pt-2 text-[11px] text-slate-500">
                  <button
                    type="button"
                    onClick={() => setShowOtpScreen(false)}
                    className="hover:underline text-slate-600"
                  >
                    ← {lang === 'bn' ? 'লগইন পেজে ফিরুন' : 'Back to Login'}
                  </button>
                  <button
                    type="button"
                    disabled={resendCooldown > 0}
                    onClick={handleResendOtp}
                    className={`font-bold ${resendCooldown > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-emerald-600 hover:underline'}`}
                  >
                    {resendCooldown > 0
                      ? (lang === 'bn' ? `পুনরায় পাঠান (${resendCooldown}s)` : `Resend in (${resendCooldown}s)`)
                      : (lang === 'bn' ? 'কোড পুনরায় পাঠান' : 'Resend Code')}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* LOGIN VS REGISTER TABS (HIDDEN IN FORGOT PASSWORD MODE) */}
                {mode !== 'forgot' && (
                  <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                      className={`flex-1 py-2 rounded-lg transition ${
                        mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {lang === 'bn' ? 'লগইন' : 'Sign In'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
                      className={`flex-1 py-2 rounded-lg transition ${
                        mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {lang === 'bn' ? 'রেজিস্ট্রেশন' : 'Register'}
                    </button>
                  </div>
                )}

                {/* FORGOT PASSWORD FORM */}
                {mode === 'forgot' ? (
                  forgotStep === 'request' ? (
                    <form onSubmit={handleForgotRequestOtp} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          {lang === 'bn' ? 'নিবন্ধিত ইমেইল ঠিকানা *' : 'Registered Email Address *'}
                        </label>
                        <input
                          type="email"
                          placeholder="investor@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                        <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                          {lang === 'bn' 
                            ? 'আপনার একাউন্টের পাসওয়ার্ড রিসেট করার জন্য এই ইমেইলে একটি ৬-সংখ্যার ওটিপি কোড পাঠানো হবে।' 
                            : 'A 6-digit cryptographic password reset code will be sent to this email address.'}
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl gradient-agro text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>{lang === 'bn' ? 'ওটিপি কোড পাঠানো হচ্ছে...' : 'Sending Verification Code...'}</span>
                          </span>
                        ) : (
                          <span>{lang === 'bn' ? 'ইমেইলে ওটিপি কোড পাঠান 📩' : 'Send Reset Code to Email 📩'}</span>
                        )}
                      </button>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                          className="text-[11px] text-slate-600 hover:text-emerald-700 font-bold hover:underline"
                        >
                          ← {lang === 'bn' ? 'লগইন পেজে ফিরে যান' : 'Back to Sign In'}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
                      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                        <span className="text-base shrink-0 mt-0.5">📩</span>
                        <div>
                          <p className="font-bold">{lang === 'bn' ? 'ওটিপি কোড পাঠানো হয়েছে!' : 'Verification Code Dispatched!'}</p>
                          <p className="text-[10px] text-emerald-800 mt-0.5">
                            <strong>{email}</strong> {lang === 'bn' ? 'ঠিকানায় ওটিপি পাঠানো হয়েছে। ইনবক্স অথবা স্প্যাম ফোল্ডার চেক করুন।' : 'has received the code. Please check your inbox or spam folder.'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-bold text-slate-700">
                            {lang === 'bn' ? '৬-সংখ্যার ওটিপি কোড *' : '6-Digit OTP Code *'}
                          </label>
                        </div>
                        <input
                          type="text"
                          name="oneTimePassword"
                          autoComplete="one-time-code"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="••••••"
                          value={resetOtp}
                          onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ''))}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center font-mono text-2xl font-black tracking-widest text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                        <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 text-[11px] flex items-center gap-1.5">
                          <span>⏱️</span>
                          <span>{lang === 'bn' ? 'আপনার ইমেইলে প্রেরিত কোডটির মেয়াদ আগামী ১৫ মিনিট কার্যকর থাকবে' : 'The OTP code sent to your email is valid for 15 minutes.'}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          {lang === 'bn' ? 'নতুন পাসওয়ার্ড * (কমপক্ষে ৬ অক্ষর)' : 'New Password * (Min 6 chars)'}
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={6}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          {lang === 'bn' ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন *' : 'Confirm New Password *'}
                        </label>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl gradient-agro text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>{lang === 'bn' ? 'পরিবর্তন যাচাই করা হচ্ছে...' : 'Updating Password...'}</span>
                          </span>
                        ) : (
                          <span>{lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন নিশ্চিত করুন 🔐' : 'Confirm Password Reset 🔐'}</span>
                        )}
                      </button>

                      <div className="flex justify-between items-center pt-2 text-[11px] text-slate-500">
                        <button
                          type="button"
                          onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                          className="hover:underline text-slate-600 font-medium"
                        >
                          ← {lang === 'bn' ? 'লগইন পেজে ফিরুন' : 'Back to Login'}
                        </button>
                        <button
                          type="button"
                          disabled={resendCooldown > 0}
                          onClick={handleForgotRequestOtp}
                          className={`font-bold ${resendCooldown > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-emerald-600 hover:underline'}`}
                        >
                          {resendCooldown > 0
                            ? (lang === 'bn' ? `পুনরায় কোড (${resendCooldown}s)` : `Resend in (${resendCooldown}s)`)
                            : (lang === 'bn' ? 'ওটিপি পুনরায় পাঠান' : 'Resend Code')}
                        </button>
                      </div>
                    </form>
                  )
                ) : mode === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {lang === 'bn' ? 'ইমেইল ঠিকানা *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        placeholder="investor@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {lang === 'bn' ? 'পাসওয়ার্ড *' : 'Password *'}
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end items-center text-[11px] pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setForgotStep('request');
                          setErrorMessage('');
                          setSuccessMessage('');
                        }}
                        className="text-slate-400 hover:text-emerald-700 hover:underline transition font-medium"
                      >
                        {lang === 'bn' ? 'পাসওয়ার্ড ভুলে গেছেন?' : 'Forgot Password?'}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl gradient-agro text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
                    >
                      {loading ? (lang === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Authenticating...') : (lang === 'bn' ? 'ড্যাশবোর্ডে প্রবেশ করুন' : 'Sign In to Dashboard')}
                    </button>
                  </form>
                ) : (
                  /* REGISTER FORM */
                  <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {lang === 'bn' ? 'পূর্ণ নাম (জাতীয় পরিচয়পত্র অনুযায়ী) *' : 'Full Legal Name *'}
                      </label>
                      <input
                        type="text"
                        placeholder={lang === 'bn' ? 'উদাঃ রফিকুল ইসলাম' : 'e.g. Rafiqul Islam'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {lang === 'bn' ? 'ইমেইল ঠিকানা *' : 'Email Address *'}
                      </label>
                      <input
                        type="email"
                        placeholder="rafiqul@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {lang === 'bn' ? 'মোবাইল নম্বর (বাংলাদেশ) *' : 'Mobile Phone (Bangladesh) *'}
                      </label>
                      <input
                        type="tel"
                        placeholder="01712-345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {lang === 'bn' ? 'পাসওয়ার্ড *' : 'Password *'}
                      </label>
                      <input
                        type="password"
                        placeholder={lang === 'bn' ? 'কমপক্ষে ৬ অক্ষর' : 'Min 6 characters'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <p className="text-[10px] text-slate-500 leading-normal">
                      {lang === 'bn'
                        ? 'রেজিস্ট্রেশন করার মাধ্যমে আপনি এগ্রোফাইন্যান্সের সরাসরি কৃষি অংশীদারিত্ব ও বিনিয়োগ নীতিমালার সাথে একমত পোষণ করছেন।'
                        : "By registering, you agree to AgroFinance BD's agricultural partnership terms and investment guidelines."}
                    </p>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl gradient-agro text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
                    >
                      {loading ? (lang === 'bn' ? 'একাউন্ট তৈরি হচ্ছে...' : 'Creating Account...') : (lang === 'bn' ? 'রেজিস্ট্রেশন ও ওটিপি গ্রহণ' : 'Register & Receive OTP')}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      );
    }

    function AdminGatewayModal({ lang = 'bn', onClose, onSuccess }) {
      const [email, setEmail] = React.useState('admin@agrofinance.bd');
      const [password, setPassword] = React.useState('admin123');
      const [securityKey, setSecurityKey] = React.useState('');
      const [loading, setLoading] = React.useState(false);
      const [errorMessage, setErrorMessage] = React.useState('');

      const handleAdminLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);
        try {
          const res = await apiCall('/api/auth/admin-login', 'POST', { email, password, securityKey });
          if (res.success) {
            onSuccess(res.user, res.token);
          } else {
            setErrorMessage(res.message || (lang === 'bn' ? 'অনুমোদন প্রত্যাখ্যাত।' : 'Access Denied.'));
          }
        } catch (err) {
          setErrorMessage(err.message || (lang === 'bn' ? 'অ্যাডমিন গেটওয়ে সংযোগে ত্রুটি।' : 'Administration gateway connection failed.'));
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl text-slate-200 relative animate-fade-in">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition"
            >
              ✕
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center text-2xl mx-auto shadow-inner">
                🛡️
              </div>
              <h2 className="text-lg font-black text-white tracking-wide">
                {lang === 'bn' ? 'অ্যাডমিন কন্ট্রোল গেটওয়ে' : 'ENTERPRISE ADMIN GATEWAY'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'অনুমোদিত কর্মকর্তাদের জন্য • এনক্রিপ্টেড সেশন' : 'Authorized Personnel Only • Hardware IP & Session Encrypted'}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                <span>🚫</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {lang === 'bn' ? 'অ্যাডমিন ইমেইল' : 'Administrative Email'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {lang === 'bn' ? 'মাস্টার পাসওয়ার্ড' : 'Master Password'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {lang === 'bn' ? 'সিকিউরিটি কি / এমএফএ (ঐচ্ছিক)' : 'Enterprise Security Token / MFA (Optional)'}
                </label>
                <input
                  type="password"
                  placeholder="AGRO-SEC-2026-ROOT"
                  value={securityKey}
                  onChange={(e) => setSecurityKey(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-between items-center text-[11px] pt-1 text-slate-400">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@agrofinance.bd');
                    setPassword('admin123');
                    setSecurityKey('AGRO-SEC-2026-ROOT');
                  }}
                  className="text-rose-400 hover:text-rose-300 font-bold hover:underline flex items-center gap-1"
                >
                  ⚡ {lang === 'bn' ? 'অ্যাডমিন তথ্য পূরণ করুন' : 'Fill Master Credentials'}
                </button>
                <span className="font-mono text-[10px] text-slate-500">Root Access</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-xs shadow-lg active:scale-95 transition flex items-center justify-center gap-2"
              >
                {loading
                  ? (lang === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Authenticating Gateway...')
                  : (lang === 'bn' ? 'অ্যাডমিন প্যানেল আনলক করুন' : 'Unlock Administration Console')}
              </button>
            </form>
          </div>
        </div>
      );
    }

    // ==============================================================================
    // CORPORATE BANK ACCOUNTS CARD
    // Official Settlement Accounts with 1-Click Clipboard Copy
    // ==============================================================================
    function CorporateBankAccountsCard({ lang = 'bn', selectedBank, onSelectBank }) {
      const [copiedKey, setCopiedKey] = React.useState(null);

      const copyToClipboard = (text, key) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text);
          setCopiedKey(key);
          setTimeout(() => setCopiedKey(null), 2000);
        }
      };

      const corporateBanks = [
        {
          id: 'Dutch-Bangla Bank PLC',
          code: 'DBBL',
          name: lang === 'bn' ? 'ডাচ-বাংলা ব্যাংক পিএলসি' : 'Dutch-Bangla Bank PLC',
          acName: 'AgroFinance Bangladesh Technologies Ltd.',
          acNumber: '107.120.0048921',
          branch: lang === 'bn' ? 'মতিঝিল কর্পোরেট শাখা, ঢাকা' : 'Motijheel Corporate Branch, Dhaka',
          routing: '090271839',
          swift: 'DBBLBDDH',
          tag: lang === 'bn' ? 'প্রধান সেটেলমেন্ট একাউন্ট' : 'Primary Settlement Account',
          accent: 'border-emerald-500 bg-emerald-50/50 text-emerald-900',
          badgeColor: 'bg-emerald-100 text-emerald-800'
        },
        {
          id: 'The City Bank PLC',
          code: 'CIBL',
          name: lang === 'bn' ? 'দি সিটি ব্যাংক পিএলসি' : 'The City Bank PLC',
          acName: 'AgroFinance Bangladesh Technologies Ltd.',
          acNumber: '110.284.9921001',
          branch: lang === 'bn' ? 'গুলশান এভিনিউ শাখা, ঢাকা' : 'Gulshan Avenue Branch, Dhaka',
          routing: '225272384',
          swift: 'CIBLBDDH',
          tag: lang === 'bn' ? 'NPSB ও দ্রুত ক্লিয়ারিং' : 'NPSB & BEFTN Instant Clearing',
          accent: 'border-blue-500 bg-blue-50/50 text-blue-900',
          badgeColor: 'bg-blue-100 text-blue-800'
        },
        {
          id: 'BRAC Bank PLC',
          code: 'BRAC',
          name: lang === 'bn' ? 'ব্র্যাক ব্যাংক পিএলসি' : 'BRAC Bank PLC',
          acName: 'AgroFinance Bangladesh Technologies Ltd.',
          acNumber: '150.120.3849100',
          branch: lang === 'bn' ? 'আগ্রাবাদ কর্পোরেট শাখা, চট্টগ্রাম' : 'Agrabad Branch, Chattogram',
          routing: '060260421',
          swift: 'BRAKBDDH',
          tag: lang === 'bn' ? 'কৃষি ট্রেজারি ফান্ড' : 'Agro Agriculture Treasury',
          accent: 'border-amber-500 bg-amber-50/50 text-amber-900',
          badgeColor: 'bg-amber-100 text-amber-800'
        }
      ];

      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>🏛️</span>
              <span>{lang === 'bn' ? 'অফিসিয়াল কর্পোরেট ব্যাংক একাউন্ট সমূহ' : 'Official Corporate Bank Accounts'}</span>
            </span>
            <span className="text-[10px] text-slate-500">
              {lang === 'bn' ? 'যেকোনো একটিতে টাকা জমা বা ট্রান্সফার করুন' : 'Transfer or deposit to any account'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {corporateBanks.map((b) => {
              const isSelected = selectedBank === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => onSelectBank && onSelectBank(b.id)}
                  className={`p-3.5 rounded-2xl border transition relative cursor-pointer ${
                    isSelected
                      ? `${b.accent} ring-2 ring-emerald-500 shadow-sm`
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-black text-xs text-slate-900 leading-tight">
                      {b.name}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${b.badgeColor}`}>
                      {b.code}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div>
                      <span className="text-slate-400 text-[10px] block">{lang === 'bn' ? 'একাউন্ট নাম:' : 'A/C Name:'}</span>
                      <span className="font-semibold text-slate-800 line-clamp-1">{b.acName}</span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[10px]">{lang === 'bn' ? 'একাউন্ট নম্বর:' : 'A/C Number:'}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(b.acNumber, b.id + '_ac');
                          }}
                          className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                        >
                          {copiedKey === b.id + '_ac' ? (
                            <span className="text-emerald-600 font-black">✓ {lang === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
                          ) : (
                            <span>📋 {lang === 'bn' ? 'কপি' : 'Copy'}</span>
                          )}
                        </button>
                      </div>
                      <span className="font-mono font-black text-slate-900 text-xs tracking-wider">{b.acNumber}</span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-[10px]">{lang === 'bn' ? 'রাউটিং নম্বর:' : 'Routing No:'}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(b.routing, b.id + '_rt');
                          }}
                          className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900"
                        >
                          {copiedKey === b.id + '_rt' ? '✓' : '📋'}
                        </button>
                      </div>
                      <span className="font-mono font-bold text-slate-700">{b.routing}</span>
                    </div>

                    <div className="text-[10px] text-slate-500 pt-0.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="line-clamp-1">📍 {b.branch}</span>
                      <span className="font-mono font-semibold">{b.swift}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // ==============================================================================
    // UNIFIED ONLINE PAYMENT GATEWAY CHECKOUT MODAL
    // ==============================================================================
    function PaymentGatewayCheckoutModal({
      lang = 'bn',
      isOpen,
      amount = 25000,
      purpose = 'investment',
      itemTitle = '',
      userPhone = '',
      onClose,
      onPaymentSuccess
    }) {
      if (!isOpen) return null;

      const [tab, setTab] = React.useState('mfs'); // 'mfs', 'cards', 'netbanking'
      const [mfsChannel, setMfsChannel] = React.useState('bKash'); // 'bKash', 'Nagad', 'Rocket', 'Upay'
      const [mfsStep, setMfsStep] = React.useState('number'); // 'number', 'otp', 'pin', 'processing'
      const [mfsNumber, setMfsNumber] = React.useState(userPhone || '01712-345678');
      const [mfsOtp, setMfsOtp] = React.useState('');
      const [mfsPin, setMfsPin] = React.useState('');
      const [mfsTimer, setMfsTimer] = React.useState(60);

      // Card States
      const [cardData, setCardData] = React.useState({
        number: '4242 4242 4242 4242',
        name: 'MAHMUDUL HASSAN',
        expiry: '12/28',
        cvv: '891'
      });
      const [cardStep, setCardStep] = React.useState('form'); // 'form', 'otp_3d', 'processing'
      const [cardOtp, setCardOtp] = React.useState('');

      // Net Banking States
      const [selectedBank, setSelectedBank] = React.useState('The City Bank (CityTouch)');
      const [bankUserId, setBankUserId] = React.useState('CB-789210');
      const [bankPassword, setBankPassword] = React.useState('••••••••');
      const [bankStep, setBankStep] = React.useState('select'); // 'select', 'login', 'processing'

      const [processingProgress, setProcessingProgress] = React.useState(0);
      const [isComplete, setIsComplete] = React.useState(false);
      const [generatedTrxId, setGeneratedTrxId] = React.useState('');

      // OTP Countdown Timer
      React.useEffect(() => {
        let timer;
        if (mfsStep === 'otp' && mfsTimer > 0) {
          timer = setTimeout(() => setMfsTimer(t => t - 1), 1000);
        }
        return () => clearTimeout(timer);
      }, [mfsStep, mfsTimer]);

      const executePaymentSuccess = (method, sender) => {
        const prefix = method.toUpperCase().slice(0, 5).replace(/\s+/g, '');
        const randomNum = Math.floor(10000000 + Math.random() * 90000000);
        const trx = `PGW-${prefix}-${randomNum}`;
        setGeneratedTrxId(trx);
        setIsComplete(true);

        setTimeout(() => {
          onPaymentSuccess({
            method: `${method} Gateway`,
            trxId: trx,
            senderAccount: sender,
            channelType: 'gateway'
          });
        }, 1200);
      };

      const handleMfsNumberSubmit = (e) => {
        e.preventDefault();
        if (!mfsNumber || mfsNumber.length < 11) return;
        setMfsStep('otp');
        setMfsTimer(60);
      };

      const handleMfsOtpSubmit = (e) => {
        e.preventDefault();
        if (!mfsOtp) return;
        setMfsStep('pin');
      };

      const handleMfsPinSubmit = (e) => {
        e.preventDefault();
        if (!mfsPin) return;
        setMfsStep('processing');
        let prog = 0;
        const interval = setInterval(() => {
          prog += 25;
          setProcessingProgress(prog);
          if (prog >= 100) {
            clearInterval(interval);
            executePaymentSuccess(mfsChannel, mfsNumber);
          }
        }, 300);
      };

      const handleCardFormSubmit = (e) => {
        e.preventDefault();
        setCardStep('otp_3d');
      };

      const handleCardOtpSubmit = (e) => {
        e.preventDefault();
        setCardStep('processing');
        let prog = 0;
        const interval = setInterval(() => {
          prog += 25;
          setProcessingProgress(prog);
          if (prog >= 100) {
            clearInterval(interval);
            executePaymentSuccess('Visa / Mastercard', cardData.number.slice(-4));
          }
        }, 300);
      };

      const handleBankSubmit = (e) => {
        e.preventDefault();
        setBankStep('processing');
        let prog = 0;
        const interval = setInterval(() => {
          prog += 25;
          setProcessingProgress(prog);
          if (prog >= 100) {
            clearInterval(interval);
            executePaymentSuccess(selectedBank, bankUserId);
          }
        }, 300);
      };

      const cardBrand = cardData.number.startsWith('4')
        ? 'VISA'
        : cardData.number.startsWith('5')
        ? 'MASTERCARD'
        : cardData.number.startsWith('3')
        ? 'AMEX'
        : 'UNIONPAY';

      return (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[95vh] relative">
            {/* GATEWAY TOP SECURE HEADER */}
            <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-lg font-black">
                  🔒
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm tracking-wide">AgroFinance Secure PGW</span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      256-bit TLS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'bn' ? 'বাংলাদেশ ব্যাংক অনুমোদিত ডিজিটাল পেমেন্ট সুইচ' : 'Authorized Enterprise Payment Gateway'}
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 block">{lang === 'bn' ? 'পরিশোধযোগ্য অর্থ' : 'Payable'}</span>
                  <span className="font-mono text-base font-black text-emerald-400">{formatBDT(amount)}</span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* IF COMPLETED: SUCCESS SPLASH */}
            {isComplete ? (
              <div className="p-8 text-center space-y-4 my-auto animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-3xl flex items-center justify-center mx-auto animate-bounce">
                  ✓
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">
                    {lang === 'bn' ? 'পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!' : 'Payment Completed Successfully!'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'bn' ? 'আপনার লেনদেন ট্রানজেকশন আইডি:' : 'Your Transaction ID:'} <strong className="font-mono text-emerald-700">{generatedTrxId}</strong>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 max-w-sm mx-auto">
                  {formatBDT(amount)} • {purpose === 'investment' ? (itemTitle || 'Agro Investment') : 'Wallet Deposit'}
                </div>
                <p className="text-[11px] text-slate-400">
                  {lang === 'bn' ? 'অনুরোধটি প্রক্রিয়াধীন... অনুগ্রহ করে অপেক্ষা করুন' : 'Processing request, please wait...'}
                </p>
              </div>
            ) : (
              <>
                {/* CHANNEL NAVIGATION TABS */}
                <div className="flex border-b border-slate-200 bg-slate-50/80 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => { setTab('mfs'); setMfsStep('number'); }}
                    className={`flex-1 py-3 px-2 text-center transition flex items-center justify-center gap-1.5 border-b-2 ${
                      tab === 'mfs'
                        ? 'border-emerald-600 bg-white text-emerald-700 font-black'
                        : 'border-transparent text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>📱</span>
                    <span>{lang === 'bn' ? 'মোবাইল ব্যাংকিং (MFS)' : 'Mobile Banking (MFS)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setTab('cards'); setCardStep('form'); }}
                    className={`flex-1 py-3 px-2 text-center transition flex items-center justify-center gap-1.5 border-b-2 ${
                      tab === 'cards'
                        ? 'border-emerald-600 bg-white text-emerald-700 font-black'
                        : 'border-transparent text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>💳</span>
                    <span>{lang === 'bn' ? 'কার্ড (Visa / MC)' : 'Debit / Credit Card'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setTab('netbanking'); setBankStep('select'); }}
                    className={`flex-1 py-3 px-2 text-center transition flex items-center justify-center gap-1.5 border-b-2 ${
                      tab === 'netbanking'
                        ? 'border-emerald-600 bg-white text-emerald-700 font-black'
                        : 'border-transparent text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>🏛️</span>
                    <span>{lang === 'bn' ? 'ইন্টারনেট ব্যাংকিং' : 'Internet Banking'}</span>
                  </button>
                </div>

                {/* TAB 1: MOBILE BANKING */}
                {tab === 'mfs' && (
                  <div className="p-6 space-y-5 overflow-y-auto">
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'bKash', name: 'bKash', active: 'ring-2 ring-pink-500 bg-pink-100/70', icon: '🌸' },
                        { id: 'Nagad', name: 'Nagad', active: 'ring-2 ring-orange-500 bg-orange-100/70', icon: '⚡' },
                        { id: 'Rocket', name: 'Rocket', active: 'ring-2 ring-purple-500 bg-purple-100/70', icon: '🚀' },
                        { id: 'Upay', name: 'Upay', active: 'ring-2 ring-blue-500 bg-blue-100/70', icon: '🔷' }
                      ].map(m => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => { setMfsChannel(m.id); setMfsStep('number'); }}
                          className={`p-2.5 rounded-xl border text-center transition ${
                            mfsChannel === m.id ? m.active : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-base block">{m.icon}</span>
                          <span className="font-black text-xs block mt-1">{m.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className={`p-5 rounded-2xl border ${
                      mfsChannel === 'bKash' ? 'bg-[#e2136e]/5 border-[#e2136e]/30' :
                      mfsChannel === 'Nagad' ? 'bg-[#f7941d]/5 border-[#f7941d]/30' :
                      'bg-purple-50/50 border-purple-200'
                    }`}>
                      <div className={`p-3 rounded-xl text-white font-black text-xs flex justify-between items-center mb-4 ${
                        mfsChannel === 'bKash' ? 'bg-[#e2136e]' :
                        mfsChannel === 'Nagad' ? 'bg-[#f7941d]' :
                        'bg-purple-700'
                      }`}>
                        <span>{mfsChannel} Direct Merchant Checkout</span>
                        <span className="font-mono font-bold text-sm">{formatBDT(amount)}</span>
                      </div>

                      {mfsStep === 'number' && (
                        <form onSubmit={handleMfsNumberSubmit} className="space-y-4 text-xs">
                          <div>
                            <label className="block font-bold text-slate-800 mb-1">
                              {lang === 'bn' ? `আপনার ${mfsChannel} একাউন্ট নম্বর দিন *` : `Enter your ${mfsChannel} Account Number *`}
                            </label>
                            <input
                              type="text"
                              value={mfsNumber}
                              onChange={(e) => setMfsNumber(e.target.value)}
                              placeholder="01XXXXXXXXX"
                              required
                              maxLength={14}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-base font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                            <span className="text-[10px] text-slate-500 mt-1 block">
                              {lang === 'bn' ? 'নিশ্চিত করুন এ ক্লিক করার মাধ্যমে আপনি মার্চেন্ট নীতিমালায় সম্মত হচ্ছেন।' : 'By clicking confirm you agree to merchant payment terms.'}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className={`flex-1 py-3 rounded-xl text-white font-black text-xs shadow transition ${
                                mfsChannel === 'bKash' ? 'bg-[#e2136e] hover:brightness-110' :
                                mfsChannel === 'Nagad' ? 'bg-[#f7941d] hover:brightness-110' :
                                'bg-purple-700 hover:brightness-110'
                              }`}
                            >
                              {lang === 'bn' ? 'এগিয়ে যান (Confirm) →' : 'Confirm & Proceed →'}
                            </button>
                            <button
                              type="button"
                              onClick={onClose}
                              className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 text-xs"
                            >
                              {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                            </button>
                          </div>
                        </form>
                      )}

                      {mfsStep === 'otp' && (
                        <form onSubmit={handleMfsOtpSubmit} className="space-y-4 text-xs">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="font-bold text-slate-800">
                                {lang === 'bn' ? `${mfsChannel} ভেরিফিকেশন কোড (OTP) *` : `${mfsChannel} Verification Code (OTP) *`}
                              </label>
                              <button
                                type="button"
                                onClick={() => setMfsOtp('891204')}
                                className="text-[10px] text-emerald-700 font-bold underline"
                              >
                                ⚡ {lang === 'bn' ? 'অটো-কোড বসান' : 'Auto-Fill Code'}
                              </button>
                            </div>
                            <input
                              type="text"
                              value={mfsOtp}
                              onChange={(e) => setMfsOtp(e.target.value)}
                              placeholder="••••••"
                              required
                              maxLength={6}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-center text-xl font-black tracking-widest focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                              <span>{mfsNumber} নম্বরে কোড পাঠানো হয়েছে</span>
                              <span>{mfsTimer > 0 ? `পুনরায় (${mfsTimer}s)` : <button type="button" onClick={() => setMfsTimer(60)} className="text-emerald-700 font-bold">Resend</button>}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className={`flex-1 py-3 rounded-xl text-white font-black text-xs shadow transition ${
                                mfsChannel === 'bKash' ? 'bg-[#e2136e] hover:brightness-110' :
                                mfsChannel === 'Nagad' ? 'bg-[#f7941d] hover:brightness-110' :
                                'bg-purple-700 hover:brightness-110'
                              }`}
                            >
                              {lang === 'bn' ? 'ওটিপি যাচাই করুন →' : 'Verify OTP →'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setMfsStep('number')}
                              className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 text-xs"
                            >
                              {lang === 'bn' ? 'পিছনে' : 'Back'}
                            </button>
                          </div>
                        </form>
                      )}

                      {mfsStep === 'pin' && (
                        <form onSubmit={handleMfsPinSubmit} className="space-y-4 text-xs">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="font-bold text-slate-800">
                                {lang === 'bn' ? `আপনার ${mfsChannel} পিন (PIN) দিন *` : `Enter your ${mfsChannel} PIN *`}
                              </label>
                              <button
                                type="button"
                                onClick={() => setMfsPin('12345')}
                                className="text-[10px] text-emerald-700 font-bold underline"
                              >
                                ⚡ {lang === 'bn' ? 'ডেমো পিন দিন' : 'Demo PIN'}
                              </button>
                            </div>
                            <input
                              type="password"
                              value={mfsPin}
                              onChange={(e) => setMfsPin(e.target.value)}
                              placeholder="•••••"
                              required
                              maxLength={5}
                              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-center text-xl font-black tracking-widest focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                            <span className="text-[10px] text-slate-500 mt-1 block">
                              🔒 আপনার পিন সম্পূর্ণ গোপন থাকে এবং কখনো সিস্টেমে সংরক্ষিত হয় না।
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className={`flex-1 py-3 rounded-xl text-white font-black text-xs shadow transition ${
                                mfsChannel === 'bKash' ? 'bg-[#e2136e] hover:brightness-110' :
                                mfsChannel === 'Nagad' ? 'bg-[#f7941d] hover:brightness-110' :
                                'bg-purple-700 hover:brightness-110'
                              }`}
                            >
                              {lang === 'bn' ? `পেমেন্ট সম্পন্ন করুন (${formatBDT(amount)})` : `Complete Payment of ${formatBDT(amount)}`}
                            </button>
                            <button
                              type="button"
                              onClick={() => setMfsStep('otp')}
                              className="px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 text-xs"
                            >
                              {lang === 'bn' ? 'পিছনে' : 'Back'}
                            </button>
                          </div>
                        </form>
                      )}

                      {mfsStep === 'processing' && (
                        <div className="py-8 text-center space-y-3">
                          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-emerald-600 animate-spin mx-auto"></div>
                          <span className="font-black text-xs text-slate-800 block">
                            {lang === 'bn' ? `${mfsChannel} পেমেন্ট গেটওয়েতে যোগাযোগ করা হচ্ছে...` : `Communicating with ${mfsChannel} Gateway...`}
                          </span>
                          <div className="w-48 bg-slate-200 h-1.5 rounded-full mx-auto overflow-hidden">
                            <div className="bg-emerald-600 h-full transition-all duration-300" style={{ width: `${processingProgress}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: CARDS */}
                {tab === 'cards' && (
                  <div className="p-6 space-y-5 overflow-y-auto">
                    <div className="w-full max-w-sm mx-auto h-44 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-900 p-5 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-7 rounded-md bg-amber-400/80 border border-amber-300/40 relative flex items-center justify-center">
                          <div className="w-5 h-4 border border-amber-700/50 rounded-xs"></div>
                        </div>
                        <span className="font-mono text-sm font-black tracking-widest text-emerald-300">{cardBrand}</span>
                      </div>

                      <div className="font-mono text-base font-black tracking-widest text-slate-200">
                        {cardData.number || '•••• •••• •••• ••••'}
                      </div>

                      <div className="flex justify-between items-end text-[10px] font-mono">
                        <div>
                          <span className="text-slate-400 block text-[9px]">CARDHOLDER</span>
                          <span className="font-bold tracking-wider text-slate-200">{cardData.name || 'YOUR NAME'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px]">EXPIRES</span>
                          <span className="font-bold text-slate-200">{cardData.expiry || 'MM/YY'}</span>
                        </div>
                      </div>
                    </div>

                    {cardStep === 'form' && (
                      <form onSubmit={handleCardFormSubmit} className="space-y-4 text-xs">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            {lang === 'bn' ? 'কার্ড নম্বর *' : 'Card Number *'}
                          </label>
                          <input
                            type="text"
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            placeholder="4242 4242 4242 4242"
                            required
                            maxLength={19}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              {lang === 'bn' ? 'কার্ডধারীর নাম *' : 'Cardholder Name *'}
                            </label>
                            <input
                              type="text"
                              value={cardData.name}
                              onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                              placeholder="FULL NAME"
                              required
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono text-xs font-bold uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">
                                {lang === 'bn' ? 'মেয়াদ *' : 'Expiry *'}
                              </label>
                              <input
                                type="text"
                                value={cardData.expiry}
                                onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                                placeholder="MM/YY"
                                required
                                maxLength={5}
                                className="w-full px-2 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-center font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">
                                CVV *
                              </label>
                              <input
                                type="password"
                                value={cardData.cvv}
                                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                                placeholder="•••"
                                required
                                maxLength={4}
                                className="w-full px-2 py-2.5 rounded-xl border border-slate-300 font-mono text-xs text-center font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 rounded-xl gradient-agro text-white font-black text-xs shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2"
                        >
                          <span>🔒</span>
                          <span>{lang === 'bn' ? `নিরাপদে পরিশোধ করুন (${formatBDT(amount)})` : `Pay Securely ${formatBDT(amount)}`}</span>
                        </button>
                      </form>
                    )}

                    {cardStep === 'otp_3d' && (
                      <form onSubmit={handleCardOtpSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                          <span className="font-black text-slate-900 text-xs">Verified by Visa / Mastercard 3D-Secure</span>
                          <span className="font-mono text-emerald-700 font-bold">{formatBDT(amount)}</span>
                        </div>
                        <p className="text-slate-600 leading-normal">
                          {lang === 'bn'
                            ? 'আপনার নিবন্ধিত মোবাইল নম্বরে (••••••92) প্রেরিত ৬-সংখ্যার ওটিপি কোডটি লিখুন:'
                            : 'Enter the 6-digit One-Time Password (OTP) sent to your registered mobile (••••••92):'}
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={cardOtp}
                            onChange={(e) => setCardOtp(e.target.value)}
                            placeholder="••••••"
                            required
                            maxLength={6}
                            className="flex-1 px-4 py-2 rounded-xl border border-slate-300 font-mono text-center text-lg font-black tracking-widest focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setCardOtp('729104')}
                            className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 text-[10px]"
                          >
                            ⚡ Auto-Fill
                          </button>
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow transition"
                        >
                          {lang === 'bn' ? 'অনুমোদন নিশ্চিত করুন' : 'Confirm Authentication'}
                        </button>
                      </form>
                    )}

                    {cardStep === 'processing' && (
                      <div className="py-8 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-emerald-600 animate-spin mx-auto"></div>
                        <span className="font-black text-xs text-slate-800 block">
                          3D-Secure Card Authorization in progress...
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: INTERNET BANKING */}
                {tab === 'netbanking' && (
                  <div className="p-6 space-y-5 overflow-y-auto text-xs">
                    <div>
                      <label className="block font-bold text-slate-800 mb-2">
                        {lang === 'bn' ? 'ইন্টারনেট ব্যাংকিং পোর্টাল নির্বাচন করুন *' : 'Select Internet Banking Portal *'}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          'The City Bank (CityTouch)',
                          'BRAC Bank (Astha)',
                          'Eastern Bank (Skybanking)',
                          'Dutch-Bangla Bank (NexusPay)',
                          'Islami Bank (Cellfin)'
                        ].map(bnk => (
                          <button
                            key={bnk}
                            type="button"
                            onClick={() => setSelectedBank(bnk)}
                            className={`p-3 rounded-xl border text-left transition font-bold ${
                              selectedBank === bnk
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            🏛️ {bnk}
                          </button>
                        ))}
                      </div>
                    </div>

                    <form onSubmit={handleBankSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-slate-900">{selectedBank} Login Simulation</span>
                        <span className="text-emerald-700 font-mono font-black">{formatBDT(amount)}</span>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">User ID / Customer ID</label>
                        <input
                          type="text"
                          value={bankUserId}
                          onChange={(e) => setBankUserId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Portal Password / OTP</label>
                        <input
                          type="password"
                          value={bankPassword}
                          onChange={(e) => setBankPassword(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl gradient-agro text-white font-black text-xs shadow hover:brightness-110 transition"
                      >
                        {lang === 'bn' ? `পেমেন্ট অনুমোদন দিন (${formatBDT(amount)})` : `Authorize Payment (${formatBDT(amount)})`}
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      );
    }

    // ==============================================================================
    // ENHANCED INVEST MODAL WITH DUAL PAYMENT SYSTEM & DIVERSIFICATION
    // ==============================================================================
    function InvestModal({ lang = 'bn', project, user, token: propToken, onClose, onSuccess, onDepositNeeded }) {
      const [amount, setAmount] = React.useState(project.minInvestment || 25000);
      const [paymentChannel, setPaymentChannel] = React.useState('gateway'); // 'wallet', 'gateway', 'bank_transfer'
      const [showGatewayModal, setShowGatewayModal] = React.useState(false);
      const [agreementAccepted, setAgreementAccepted] = React.useState(true);
      const [loading, setLoading] = React.useState(false);
      const [errorMessage, setErrorMessage] = React.useState('');

      // Bank Transfer Specific States
      const [corporateBank, setCorporateBank] = React.useState('Dutch-Bangla Bank PLC');
      const [transferType, setTransferType] = React.useState('NPSB Transfer');
      const [depositorBank, setDepositorBank] = React.useState('');
      const [depositorAccountName, setDepositorAccountName] = React.useState(user?.name || '');
      const [scrollNumber, setScrollNumber] = React.useState('');
      const [depositorBranch, setDepositorBranch] = React.useState('');
      const [depositDate, setDepositDate] = React.useState(new Date().toISOString().split('T')[0]);
      const [depositSlipUrl, setDepositSlipUrl] = React.useState('');
      const [depositorPhone, setDepositorPhone] = React.useState(user?.phone || '');
      const [remarks, setRemarks] = React.useState('');

      const token = propToken || localStorage.getItem('agro_token');
      const expectedProfit = (Number(amount || 0) * (project.expectedReturn || 0)) / 100;
      const totalPayout = Number(amount || 0) + expectedProfit;
      const hasWalletBalance = (user?.walletBalance || 0) >= Number(amount || 0);

      // Handle Image Voucher Upload
      const handleSlipFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
          alert(lang === 'bn' ? 'ফাইলের আকার সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।' : 'File size must be under 5MB.');
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setDepositSlipUrl(reader.result);
        };
        reader.readAsDataURL(file);
      };

      // Set Demo Voucher Slip
      const handleSetDemoSlip = () => {
        const randomScroll = `SLIP-DBBL-${Math.floor(100000 + Math.random() * 900000)}`;
        setScrollNumber(randomScroll);
        if (!depositorBank) setDepositorBank('Sonali Bank PLC');
        if (!depositorBranch) setDepositorBranch('Corporate Branch');
        // SVG Data URL representing a bank deposit slip voucher
        const demoSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="350" viewBox="0 0 600 350"><rect width="600" height="350" fill="%23f8fafc" stroke="%23059669" stroke-width="4" rx="12"/><rect x="20" y="20" width="560" height="60" fill="%23059669" rx="8"/><text x="40" y="58" font-family="sans-serif" font-size="20" font-weight="bold" fill="white">BANK DEPOSIT VOUCHER / SLIP</text><text x="40" y="110" font-family="sans-serif" font-size="14" fill="%23334155">Bank: ${encodeURIComponent(corporateBank)}</text><text x="40" y="140" font-family="sans-serif" font-size="14" fill="%23334155">A/C: AgroFinance Bangladesh Ltd (107.120.0048921)</text><text x="40" y="170" font-family="sans-serif" font-size="14" fill="%23334155">Depositor: ${encodeURIComponent(depositorAccountName || user?.name || 'Investor')}</text><text x="40" y="200" font-family="sans-serif" font-size="14" fill="%23334155">Amount: BDT ${Number(amount).toLocaleString('en-BD')}</text><text x="40" y="230" font-family="sans-serif" font-size="14" fill="%23334155">Scroll/Ref: ${randomScroll}</text><text x="40" y="260" font-family="sans-serif" font-size="14" fill="%23334155">Date: ${depositDate}</text><circle cx="500" cy="220" r="45" fill="%2310b981" opacity="0.2"/><text x="465" y="225" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23047857">CLEARED</text></svg>`;
        setDepositSlipUrl(demoSvg);
      };

      // Submit Investment API helper
      const submitInvestment = async (paymentPayload) => {
        setLoading(true);
        setErrorMessage('');
        try {
          const payload = {
            projectId: project._id || project.id,
            amount: Number(amount),
            agreementAccepted: true,
            ...paymentPayload
          };

          const res = await apiCall('/api/investments', 'POST', payload, token);
          if (res.success) {
            onSuccess(res.data);
          } else {
            setErrorMessage(res.message || (lang === 'bn' ? 'বিনিয়োগ ব্যর্থ হয়েছে।' : 'Investment failed.'));
          }
        } catch (err) {
          setErrorMessage(err.message || (lang === 'bn' ? 'নেটওয়ার্ক সংযোগ ত্রুটি।' : 'Network error.'));
        } finally {
          setLoading(false);
        }
      };

      // Form Submit (for Wallet or Bank Transfer)
      const handleInvestSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (Number(amount) < project.minInvestment) {
          setErrorMessage(
            lang === 'bn'
              ? `এই প্রকল্পের জন্য সর্বনিম্ন বিনিয়োগ ${formatBDT(project.minInvestment)}।`
              : `Minimum investment for this project is ${formatBDT(project.minInvestment)}.`
          );
          return;
        }

        if (!agreementAccepted) {
          setErrorMessage(
            lang === 'bn'
              ? 'অনুগ্রহ করে কৃষি অংশীদারিত্ব চুক্তিতে সম্মতি দিন।'
              : 'Please accept the agricultural partnership investment agreement.'
          );
          return;
        }

        if (paymentChannel === 'wallet') {
          if (!hasWalletBalance) {
            setErrorMessage(
              lang === 'bn'
                ? `ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই (${formatBDT(user?.walletBalance || 0)})। অনুগ্রহ করে অনলাইন গেটওয়ে বা ব্যাংক ট্রান্সফার বেছে নিন।`
                : `Insufficient wallet balance (${formatBDT(user?.walletBalance || 0)}). Please use Online Gateway or Bank Transfer.`
            );
            return;
          }
          submitInvestment({
            paymentMethod: 'Wallet',
            channelType: 'wallet'
          });
        } else if (paymentChannel === 'gateway') {
          setShowGatewayModal(true);
        } else if (paymentChannel === 'bank_transfer') {
          if (!scrollNumber) {
            setErrorMessage(
              lang === 'bn'
                ? 'অনুগ্রহ করে ব্যাংক স্ক্রোল / স্লিপ নম্বর দিন (অথবা ডেমো স্লিপ বাটনে ক্লিক করুন)।'
                : 'Please enter bank scroll / slip number (or click Demo Voucher).'
            );
            return;
          }

          submitInvestment({
            paymentMethod: 'Bank Transfer',
            channelType: 'bank_transfer',
            trxId: scrollNumber.trim(),
            senderAccount: depositorAccountName.trim() || depositorPhone.trim(),
            bankPaymentDetails: {
              corporateBank,
              transferType,
              depositorBank: depositorBank.trim(),
              depositorAccountName: depositorAccountName.trim(),
              depositorBranch: depositorBranch.trim(),
              scrollNumber: scrollNumber.trim(),
              depositDate,
              depositSlipUrl,
              depositorPhone: depositorPhone.trim(),
              remarks: remarks.trim()
            }
          });
        }
      };

      const prokolpos = project.prokolpos && project.prokolpos.length > 0 ? project.prokolpos : [];

      return (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto animate-fade-in relative">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>

              {/* PROJECT SUMMARY */}
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
                  {lang === 'bn' ? '🌾 সমন্বিত কৃষি বিনিয়োগ প্রকল্প' : '🌾 Integrated Agro Venture'}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-0.5">
                  {lang === 'bn' ? (project.titleBn || project.title) : project.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  📍 {lang === 'bn' ? (project.locationBn || project.location || 'বাংলাদেশ') : (project.location || 'Bangladesh')} • {lang === 'bn' ? 'মেয়াদ:' : 'Duration:'} <strong>{project.duration} {lang === 'bn' ? 'মাস' : 'Months'}</strong> • {lang === 'bn' ? 'প্রত্যাশিত মুনাফা:' : 'Expected ROI:'} <strong className="text-emerald-600 font-black">+{project.expectedReturn}%</strong>
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleInvestSubmit} className="space-y-5 text-xs">
                {/* INVESTMENT AMOUNT */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'bn' ? 'বিনিয়োগের পরিমাণ (টাকা) *' : 'Investment Amount (BDT) *'}
                  </label>
                  <input
                    type="number"
                    min={project.minInvestment}
                    max={project.maxInvestment}
                    step={1000}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-xl font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />

                  {/* QUICK AMOUNT PILLS */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[25000, 50000, 100000, 250000].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] font-bold transition"
                      >
                        +{formatBDT(val)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DYNAMIC PROKOLPO ALLOCATION BREAKDOWN */}
                {prokolpos.length > 0 && (
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                        <span>🌱</span>
                        <span>{lang === 'bn' ? 'উপ-প্রকল্প সমূহে সরাসরি মূলধন বণ্টন' : 'Sub-Unit Capital Diversification'}</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                        {prokolpos.length} {lang === 'bn' ? 'টি প্রকল্প ইউনিট' : 'Prokolpo Units'}
                      </span>
                    </div>
                    <div className="space-y-1.5 pt-1">
                      {prokolpos.map(pr => {
                        const pct = pr.allocationPercentage || pr.percentage || 0;
                        const prName = lang === 'bn' ? (pr.banglaName || pr.nameBn || pr.name) : pr.name;
                        const shareBDT = Math.round((Number(amount || 0) * pct) / 100);
                        return (
                          <div key={pr.name || pr.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-emerald-100 shadow-xs">
                            <div className="flex items-center gap-2.5">
                              <span className="text-xl">{pr.icon || '🌾'}</span>
                              <div>
                                <div className="font-bold text-slate-900 text-xs">{prName}</div>
                                <div className="text-[10px] text-slate-400">{pct}% {lang === 'bn' ? 'বরাদ্দ অংশ' : 'allocation'}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono font-black text-emerald-700 text-xs">{formatBDT(shareBDT)}</div>
                              <div className="text-[9px] text-slate-400 font-semibold">{pct}% share</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* RETURNS PROJECTION BOX */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">
                    {lang === 'bn' ? 'মুনাফা ও প্রত্যাশিত মোট রিটার্ন হিসাব' : 'Yield & Projected Payout Calculation'}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-slate-400 text-[10px] block">{lang === 'bn' ? 'বিনিয়োগকৃত মূলধন' : 'Capital Invested'}</span>
                      <span className="font-bold text-slate-900">{formatBDT(amount)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">{lang === 'bn' ? `প্রত্যাশিত লাভ (+${project.expectedReturn}%)` : `Expected Profit (+${project.expectedReturn}%)`}</span>
                      <span className="font-black text-emerald-700">+{formatBDT(expectedProfit)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">{lang === 'bn' ? 'মোট সমাপনী প্রাপ্তি' : 'Total Payout at Maturity'}</span>
                      <span className="font-black text-slate-900">{formatBDT(totalPayout)}</span>
                    </div>
                  </div>
                </div>

                {/* PAYMENT METHOD SELECTION (DUAL PAYMENT SYSTEM) */}
                <div className="space-y-3">
                  <label className="font-black text-slate-800 text-xs block">
                    {lang === 'bn' ? 'পেমেন্ট চ্যানেল ও পদ্ধতি নির্বাচন করুন *' : 'Select Payment Method & Channel *'}
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {/* OPTION 1: WALLET */}
                    <button
                      type="button"
                      onClick={() => setPaymentChannel('wallet')}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                        paymentChannel === 'wallet'
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-black text-slate-900 text-xs">💼 {lang === 'bn' ? 'ওয়ালেট ব্যালেন্স' : 'Wallet Balance'}</span>
                      <span className="text-[10px] text-slate-500 mt-1">{formatBDT(user?.walletBalance || 0)}</span>
                    </button>

                    {/* OPTION 2: INSTANT GATEWAY */}
                    <button
                      type="button"
                      onClick={() => setPaymentChannel('gateway')}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                        paymentChannel === 'gateway'
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-black text-pink-700 text-xs flex items-center gap-1">
                        <span>⚡</span>
                        <span>{lang === 'bn' ? 'ইনস্ট্যান্ট গেটওয়ে' : 'Instant PGW'}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1">bKash, Nagad, Card</span>
                    </button>

                    {/* OPTION 3: BANK TRANSFER */}
                    <button
                      type="button"
                      onClick={() => setPaymentChannel('bank_transfer')}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                        paymentChannel === 'bank_transfer'
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-black text-teal-800 text-xs flex items-center gap-1">
                        <span>🏛️</span>
                        <span>{lang === 'bn' ? 'ব্যাংক ট্রান্সফার' : 'Bank Transfer'}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1">DBBL, City, BRAC</span>
                    </button>
                  </div>
                </div>

                {/* PAYMENT CHANNEL 1: WALLET NOTICE */}
                {paymentChannel === 'wallet' && (
                  <div className={`p-4 rounded-2xl border ${
                    hasWalletBalance ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">
                        {hasWalletBalance
                          ? (lang === 'bn' ? '✓ আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স রয়েছে।' : '✓ You have sufficient wallet balance.')
                          : (lang === 'bn' ? '⚠️ ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই।' : '⚠️ Insufficient balance in wallet.')}
                      </span>
                      <span className="font-mono font-black">{formatBDT(user?.walletBalance || 0)}</span>
                    </div>
                    {!hasWalletBalance && (
                      <p className="text-[11px] text-amber-700 mt-1">
                        {lang === 'bn'
                          ? 'বিনিয়োগ নিশ্চিত করতে অনলাইন পেমেন্ট গেটওয়ে বা সরাসরি ব্যাংক ট্রান্সফার বেছে নিন।'
                          : 'Please choose Instant Gateway or Bank Transfer to complete your investment.'}
                      </p>
                    )}
                  </div>
                )}

                {/* PAYMENT CHANNEL 2: INSTANT GATEWAY INTERACTIVE LAUNCHER */}
                {paymentChannel === 'gateway' && (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="font-black text-sm text-emerald-400 flex items-center gap-1.5">
                          <span>⚡</span>
                          <span>{lang === 'bn' ? 'অনলাইন ইনস্ট্যান্ট পেমেন্ট গেটওয়ে' : 'Instant Online Payment Gateway'}</span>
                        </span>
                        <p className="text-[11px] text-slate-300">
                          {lang === 'bn' ? 'বিকাশ, নগদ, রকেট, ভিসা, মাস্টারকার্ড বা ইন্টারনেট ব্যাংকিং দিয়ে সরাসরি পেমেন্ট করুন' : 'Pay instantly via bKash, Nagad, Cards or Internet Banking'}
                        </p>
                      </div>
                      <span className="text-xl">💳 📱</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowGatewayModal(true)}
                      className="w-full py-3.5 rounded-xl gradient-agro text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
                    >
                      <span>⚡</span>
                      <span>{lang === 'bn' ? `পেমেন্ট গেটওয়ে চালু করুন (${formatBDT(amount)})` : `Launch Secure Gateway (${formatBDT(amount)})`}</span>
                    </button>
                  </div>
                )}

                {/* PAYMENT CHANNEL 3: DIRECT CORPORATE BANK TRANSFER & SLIP UPLOAD */}
                {paymentChannel === 'bank_transfer' && (
                  <div className="space-y-4 pt-1">
                    <CorporateBankAccountsCard
                      lang={lang}
                      selectedBank={corporateBank}
                      onSelectBank={(bId) => setCorporateBank(bId)}
                    />

                    {/* BANK TRANSFER DEPOSIT FORM */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <span className="font-black text-slate-900 text-xs">
                          {lang === 'bn' ? 'ব্যাংক ট্রান্সফার / ডিপোজিট স্লিপ তথ্য' : 'Bank Deposit Verification Details'}
                        </span>
                        <button
                          type="button"
                          onClick={handleSetDemoSlip}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow"
                        >
                          ⚡ {lang === 'bn' ? 'ডেমো স্লিপ ভাউচার বসান' : 'Fill Demo Voucher'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {lang === 'bn' ? 'ট্রান্সফার পদ্ধতি *' : 'Transfer Mode *'}
                          </label>
                          <select
                            value={transferType}
                            onChange={(e) => setTransferType(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          >
                            <option value="NPSB Transfer">NPSB Transfer (ইন্টারনেট বা অ্যাপ দিয়ে তাৎক্ষণিক)</option>
                            <option value="BEFTN Transfer">BEFTN Transfer (ইলেকট্রনিক ফান্ড ট্রান্সফার)</option>
                            <option value="RTGS Transfer">RTGS Transfer (১ লাখ+ দ্রুত ফান্ড ট্রান্সফার)</option>
                            <option value="Branch Cash Deposit">Branch Cash Deposit (কাউন্টারে ক্যাশ ভাউচার)</option>
                            <option value="Cheque / Pay Order">Cheque / Pay Order (চেক বা পে-অর্ডার জমা)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {lang === 'bn' ? 'প্রেরক ব্যাংকের নাম *' : 'Depositor / Sender Bank *'}
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Sonali Bank, EBL, Pubali Bank, City Bank"
                            value={depositorBank}
                            onChange={(e) => setDepositorBank(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {lang === 'bn' ? 'প্রেরক একাউন্ট নাম *' : 'Depositor Account Name *'}
                          </label>
                          <input
                            type="text"
                            placeholder="Full account name"
                            value={depositorAccountName}
                            onChange={(e) => setDepositorAccountName(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {lang === 'bn' ? 'ব্যাংক স্ক্রোল / স্লিপ নং (Ref) *' : 'Bank Scroll / Slip / Trx Ref *'}
                          </label>
                          <input
                            type="text"
                            placeholder="SLIP-DBBL-89210"
                            value={scrollNumber}
                            onChange={(e) => setScrollNumber(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {lang === 'bn' ? 'জমার তারিখ *' : 'Deposit Date *'}
                          </label>
                          <input
                            type="date"
                            value={depositDate}
                            onChange={(e) => setDepositDate(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {lang === 'bn' ? 'যোগাযোগ মোবাইল নম্বর *' : 'Contact Mobile *'}
                          </label>
                          <input
                            type="text"
                            placeholder="017XXXXXXXX"
                            value={depositorPhone}
                            onChange={(e) => setDepositorPhone(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* DEPOSIT SLIP / VOUCHER UPLOAD */}
                      <div className="pt-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                          {lang === 'bn' ? 'ব্যাংক জমা ভাউচার / স্লিপ ছবি সংযুক্ত করুন (Deposit Slip Upload)' : 'Attach Bank Deposit Slip / Voucher Photo'}
                        </label>
                        {depositSlipUrl ? (
                          <div className="p-3 rounded-xl bg-white border border-emerald-300 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={depositSlipUrl}
                                alt="Bank Voucher Slip"
                                className="w-16 h-12 object-cover rounded-lg border border-slate-200 shadow-xs"
                              />
                              <div>
                                <span className="font-bold text-slate-900 text-xs block">
                                  {lang === 'bn' ? '✓ ব্যাংক স্লিপ সংযুক্ত করা হয়েছে' : '✓ Bank Voucher Attached'}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {scrollNumber || 'Voucher Slip Photo'}
                                </span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setDepositSlipUrl('')}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px]"
                            >
                              ✕ {lang === 'bn' ? 'রিমুভ' : 'Remove'}
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-white cursor-pointer transition">
                            <span className="text-2xl mb-1">📄</span>
                            <span className="font-bold text-slate-700 text-xs">
                              {lang === 'bn' ? 'ব্যাংক ডিপোজিট স্লিপের ছবি আপলোড করুন' : 'Upload Bank Deposit Slip'}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG up to 5MB</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleSlipFileChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* AGREEMENT CHECKBOX */}
                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreementAccepted}
                    onChange={(e) => setAgreementAccepted(e.target.checked)}
                    className="mt-1 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="agree" className="text-[11px] text-slate-600 leading-normal cursor-pointer">
                    {lang === 'bn'
                      ? 'আমি সরাসরি কৃষি অংশীদারিত্ব ও লভ্যাংশ বণ্টন চুক্তিতে সম্মতি প্রদান করছি। আমি অবগত যে বিনিয়োগটি পূর্ণ ফসল বীমা দ্বারা সুরক্ষিত।'
                      : 'I agree to the direct agricultural partnership and profit-sharing agreement. I understand the investment is backed by comprehensive crop insurance.'}
                  </label>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl gradient-agro text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>{lang === 'bn' ? 'অনুরোধ সম্পন্ন হচ্ছে...' : 'Processing...'}</span>
                  ) : paymentChannel === 'gateway' ? (
                    <span>⚡ {lang === 'bn' ? `অনলাইন গেটওয়েতে পরিশোধ করুন (${formatBDT(amount)})` : `Pay via Online Gateway (${formatBDT(amount)})`}</span>
                  ) : paymentChannel === 'bank_transfer' ? (
                    <span>🏛️ {lang === 'bn' ? `ব্যাংক ডিপোজিট স্লিপ জমা দিন (${formatBDT(amount)})` : `Submit Bank Deposit Slip (${formatBDT(amount)})`}</span>
                  ) : (
                    <span>💼 {lang === 'bn' ? `ওয়ালেট থেকে বিনিয়োগ করুন (${formatBDT(amount)})` : `Invest from Wallet (${formatBDT(amount)})`}</span>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* DEDICATED ONLINE PAYMENT GATEWAY CHECKOUT MODAL */}
          <PaymentGatewayCheckoutModal
            lang={lang}
            isOpen={showGatewayModal}
            amount={Number(amount)}
            purpose="investment"
            itemTitle={project.title}
            userPhone={user?.phone}
            onClose={() => setShowGatewayModal(false)}
            onPaymentSuccess={(gatewayData) => {
              setShowGatewayModal(false);
              submitInvestment({
                paymentMethod: gatewayData.method,
                trxId: gatewayData.trxId,
                senderAccount: gatewayData.senderAccount,
                channelType: 'gateway'
              });
            }}
          />
        </>
      );
    }

    const InvestmentModal = InvestModal;

    // ==============================================================================
    // ENHANCED DEPOSIT MODAL WITH DUAL PAYMENT SYSTEM (GATEWAY & DIRECT BANK DEPOSIT)
    // ==============================================================================
    function DepositModal({ lang = 'bn', user, token, onClose, onSuccess }) {
      const [amount, setAmount] = React.useState(50000);
      const [channel, setChannel] = React.useState('gateway'); // 'gateway', 'bank_transfer'
      const [showGatewayModal, setShowGatewayModal] = React.useState(false);
      const [loading, setLoading] = React.useState(false);
      const [errorMessage, setErrorMessage] = React.useState('');

      // Bank Transfer Specific States
      const [corporateBank, setCorporateBank] = React.useState('Dutch-Bangla Bank PLC');
      const [transferType, setTransferType] = React.useState('NPSB Transfer');
      const [depositorBank, setDepositorBank] = React.useState('');
      const [depositorAccountName, setDepositorAccountName] = React.useState(user?.name || '');
      const [scrollNumber, setScrollNumber] = React.useState('');
      const [depositorBranch, setDepositorBranch] = React.useState('');
      const [depositDate, setDepositDate] = React.useState(new Date().toISOString().split('T')[0]);
      const [depositSlipUrl, setDepositSlipUrl] = React.useState('');
      const [depositorPhone, setDepositorPhone] = React.useState(user?.phone || '');
      const [remarks, setRemarks] = React.useState('');

      // Handle Image Voucher Upload
      const handleSlipFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
          alert(lang === 'bn' ? 'ফাইলের আকার সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।' : 'File size must be under 5MB.');
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          setDepositSlipUrl(reader.result);
        };
        reader.readAsDataURL(file);
      };

      // Set Demo Voucher Slip
      const handleSetDemoSlip = () => {
        const randomScroll = `DEP-DBBL-${Math.floor(100000 + Math.random() * 900000)}`;
        setScrollNumber(randomScroll);
        if (!depositorBank) setDepositorBank('Sonali Bank PLC');
        if (!depositorBranch) setDepositorBranch('Corporate Branch');
        const demoSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="350" viewBox="0 0 600 350"><rect width="600" height="350" fill="%23f8fafc" stroke="%230284c7" stroke-width="4" rx="12"/><rect x="20" y="20" width="560" height="60" fill="%230284c7" rx="8"/><text x="40" y="58" font-family="sans-serif" font-size="20" font-weight="bold" fill="white">BANK DEPOSIT VOUCHER / SLIP</text><text x="40" y="110" font-family="sans-serif" font-size="14" fill="%23334155">Bank: ${encodeURIComponent(corporateBank)}</text><text x="40" y="140" font-family="sans-serif" font-size="14" fill="%23334155">A/C: AgroFinance Bangladesh Ltd (107.120.0048921)</text><text x="40" y="170" font-family="sans-serif" font-size="14" fill="%23334155">Depositor: ${encodeURIComponent(depositorAccountName || user?.name || 'Investor')}</text><text x="40" y="200" font-family="sans-serif" font-size="14" fill="%23334155">Amount: BDT ${Number(amount).toLocaleString('en-BD')}</text><text x="40" y="230" font-family="sans-serif" font-size="14" fill="%23334155">Scroll/Ref: ${randomScroll}</text><text x="40" y="260" font-family="sans-serif" font-size="14" fill="%23334155">Date: ${depositDate}</text><circle cx="500" cy="220" r="45" fill="%230284c7" opacity="0.2"/><text x="465" y="225" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230369a1">CLEARED</text></svg>`;
        setDepositSlipUrl(demoSvg);
      };

      // API Helper
      const submitDeposit = async (payload) => {
        setLoading(true);
        setErrorMessage('');
        try {
          const res = await apiCall('/api/wallet/deposit', 'POST', {
            amount: Number(amount),
            ...payload
          }, token);

          if (res.success) {
            onSuccess();
          } else {
            setErrorMessage(res.message || (lang === 'bn' ? 'টাকা জমা ব্যর্থ হয়েছে।' : 'Deposit failed.'));
          }
        } catch (err) {
          setErrorMessage(err.message || (lang === 'bn' ? 'নেটওয়ার্ক ত্রুটি।' : 'Network error.'));
        } finally {
          setLoading(false);
        }
      };

      const handleDepositSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (Number(amount) < 500) {
          setErrorMessage(lang === 'bn' ? 'সর্বনিম্ন জমার পরিমাণ ৫০০ টাকা।' : 'Minimum deposit amount is ৳500.');
          return;
        }

        if (channel === 'gateway') {
          setShowGatewayModal(true);
        } else if (channel === 'bank_transfer') {
          if (!scrollNumber) {
            setErrorMessage(
              lang === 'bn'
                ? 'অনুগ্রহ করে ব্যাংক স্ক্রোল / স্লিপ নম্বর দিন (অথবা ডেমো স্লিপ বাটনে ক্লিক করুন)।'
                : 'Please enter bank scroll / slip number (or click Demo Voucher).'
            );
            return;
          }

          submitDeposit({
            channelType: 'bank_transfer',
            method: 'Bank Transfer',
            trxId: scrollNumber.trim(),
            senderAccount: depositorAccountName.trim() || depositorPhone.trim(),
            bankPaymentDetails: {
              corporateBank,
              transferType,
              depositorBank: depositorBank.trim(),
              depositorAccountName: depositorAccountName.trim(),
              depositorBranch: depositorBranch.trim(),
              scrollNumber: scrollNumber.trim(),
              depositDate,
              depositSlipUrl,
              depositorPhone: depositorPhone.trim(),
              remarks: remarks.trim()
            }
          });
        }
      };

      return (
        <>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative animate-fade-in max-h-[92vh] overflow-y-auto">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>

              <div className="space-y-1">
                <span className="text-3xl">💳</span>
                <h2 className="text-lg font-black text-slate-900">
                  {lang === 'bn' ? 'বিনিয়োগকারী ওয়ালেটে টাকা জমা (Deposit Funds)' : 'Deposit Funds to Investor Wallet'}
                </h2>
                <p className="text-xs text-slate-500">
                  {lang === 'bn'
                    ? 'অনলাইন পেমেন্ট গেটওয়ে অথবা সরাসরি কর্পোরেট ব্যাংকের মাধ্যমে ওয়ালেট রিচার্জ করুন'
                    : 'Recharge your wallet via Instant Online Gateway or Direct Corporate Bank Deposit'}
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'bn' ? 'জমার পরিমাণ (টাকা) *' : 'Deposit Amount (BDT) *'}
                  </label>
                  <input
                    type="number"
                    min={500}
                    step={500}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-xl font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {[10000, 25000, 50000, 100000].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setAmount(v)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-[11px] font-bold"
                      >
                        +{formatBDT(v)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DUAL PAYMENT CHANNELS */}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    {lang === 'bn' ? 'পেমেন্ট মাধ্যম বেছে নিন *' : 'Payment Method *'}
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setChannel('gateway')}
                      className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                        channel === 'gateway'
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-black text-xs text-pink-700 flex items-center gap-1.5">
                        <span>⚡</span>
                        <span>{lang === 'bn' ? 'অনলাইন গেটওয়ে (তাৎক্ষণিক)' : 'Instant Gateway'}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1">bKash, Nagad, Cards, NetBanking</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setChannel('bank_transfer')}
                      className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                        channel === 'bank_transfer'
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-black text-xs text-teal-800 flex items-center gap-1.5">
                        <span>🏛️</span>
                        <span>{lang === 'bn' ? 'সরাসরি ব্যাংক ডিপোজিট' : 'Direct Bank Deposit'}</span>
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1">DBBL, City Bank, BRAC Bank</span>
                    </button>
                  </div>
                </div>

                {/* OPTION 1: INSTANT GATEWAY BOX */}
                {channel === 'gateway' && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-black text-sm text-emerald-400 block">⚡ Instant Automated Credit</span>
                        <p className="text-[11px] text-slate-300">
                          {lang === 'bn' ? 'পেমেন্ট সম্পন্ন হওয়া মাত্রই ওয়ালেটে ব্যালেন্স যুক্ত হবে।' : 'Balance will be credited immediately to your wallet.'}
                        </p>
                      </div>
                      <span className="text-xl">💳 📱</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowGatewayModal(true)}
                      className="w-full py-3 rounded-xl gradient-agro text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition"
                    >
                      {lang === 'bn' ? `পেমেন্ট গেটওয়ে চালু করুন (${formatBDT(amount)})` : `Launch Secure Gateway (${formatBDT(amount)})`}
                    </button>
                  </div>
                )}

                {/* OPTION 2: BANK TRANSFER DETAILS & SLIP UPLOAD */}
                {channel === 'bank_transfer' && (
                  <div className="space-y-4 pt-1">
                    <CorporateBankAccountsCard
                      lang={lang}
                      selectedBank={corporateBank}
                      onSelectBank={(bId) => setCorporateBank(bId)}
                    />

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
                      <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                        <span className="font-black text-slate-900 text-xs">
                          {lang === 'bn' ? 'ডিপোজিট ভাউচার ও ট্রানজেকশন তথ্য' : 'Deposit Voucher & Transaction Info'}
                        </span>
                        <button
                          type="button"
                          onClick={handleSetDemoSlip}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] shadow"
                        >
                          ⚡ {lang === 'bn' ? 'ডেমো স্লিপ বসান' : 'Fill Demo Voucher'}
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {lang === 'bn' ? 'ট্রান্সফার পদ্ধতি *' : 'Transfer Mode *'}
                          </label>
                          <select
                            value={transferType}
                            onChange={(e) => setTransferType(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          >
                            <option value="NPSB Transfer">NPSB Transfer (ইন্টারনেট বা অ্যাপ দিয়ে তাৎক্ষণিক)</option>
                            <option value="BEFTN Transfer">BEFTN Transfer (ইলেকট্রনিক ফান্ড ট্রান্সফার)</option>
                            <option value="RTGS Transfer">RTGS Transfer (১ লাখ+ দ্রুত ফান্ড ট্রান্সফার)</option>
                            <option value="Branch Cash Deposit">Branch Cash Deposit (কাউন্টারে ক্যাশ ভাউচার)</option>
                            <option value="Cheque / Pay Order">Cheque / Pay Order (চেক বা পে-অর্ডার জমা)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {lang === 'bn' ? 'প্রেরক ব্যাংকের নাম *' : 'Depositor / Sender Bank *'}
                          </label>
                          <input
                            type="text"
                            placeholder="Sonali Bank, EBL, Pubali Bank"
                            value={depositorBank}
                            onChange={(e) => setDepositorBank(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {lang === 'bn' ? 'প্রেরক একাউন্ট নাম *' : 'Depositor Account Name *'}
                          </label>
                          <input
                            type="text"
                            placeholder="Full account name"
                            value={depositorAccountName}
                            onChange={(e) => setDepositorAccountName(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {lang === 'bn' ? 'ব্যাংক স্ক্রোল / স্লিপ নং (Ref) *' : 'Bank Scroll / Slip / Trx Ref *'}
                          </label>
                          <input
                            type="text"
                            placeholder="DEP-DBBL-89210"
                            value={scrollNumber}
                            onChange={(e) => setScrollNumber(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {lang === 'bn' ? 'জমার তারিখ *' : 'Deposit Date *'}
                          </label>
                          <input
                            type="date"
                            value={depositDate}
                            onChange={(e) => setDepositDate(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            {lang === 'bn' ? 'যোগাযোগ মোবাইল নম্বর *' : 'Contact Mobile *'}
                          </label>
                          <input
                            type="text"
                            placeholder="017XXXXXXXX"
                            value={depositorPhone}
                            onChange={(e) => setDepositorPhone(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* DEPOSIT SLIP UPLOAD */}
                      <div className="pt-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                          {lang === 'bn' ? 'ব্যাংক জমা ভাউচার / স্লিপ ছবি সংযুক্ত করুন (Deposit Slip Upload)' : 'Attach Bank Deposit Slip / Voucher Photo'}
                        </label>
                        {depositSlipUrl ? (
                          <div className="p-3 rounded-xl bg-white border border-emerald-300 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={depositSlipUrl}
                                alt="Bank Voucher Slip"
                                className="w-16 h-12 object-cover rounded-lg border border-slate-200 shadow-xs"
                              />
                              <div>
                                <span className="font-bold text-slate-900 text-xs block">
                                  {lang === 'bn' ? '✓ ব্যাংক স্লিপ সংযুক্ত করা হয়েছে' : '✓ Bank Voucher Attached'}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">{scrollNumber || 'Deposit Voucher'}</span>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setDepositSlipUrl('')}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[10px]"
                            >
                              ✕ {lang === 'bn' ? 'রিমুভ' : 'Remove'}
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-white cursor-pointer transition">
                            <span className="text-2xl mb-1">📄</span>
                            <span className="font-bold text-slate-700 text-xs">
                              {lang === 'bn' ? 'ব্যাংক ডিপোজিট স্লিপের ছবি আপলোড করুন' : 'Upload Bank Deposit Slip'}
                            </span>
                            <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG up to 5MB</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleSlipFileChange}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {channel === 'bank_transfer' && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl gradient-agro text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    {loading
                      ? (lang === 'bn' ? 'জমা অনুরোধ সম্পন্ন হচ্ছে...' : 'Submitting Deposit Slip...')
                      : (lang === 'bn' ? `🏛️ ব্যাংক ডিপোজিট স্লিপ জমা দিন (${formatBDT(amount)})` : `Submit Bank Deposit Slip (${formatBDT(amount)})`)}
                  </button>
                )}
              </form>
            </div>
          </div>

          <PaymentGatewayCheckoutModal
            lang={lang}
            isOpen={showGatewayModal}
            amount={Number(amount)}
            purpose="deposit"
            itemTitle="Wallet Recharge"
            userPhone={user?.phone}
            onClose={() => setShowGatewayModal(false)}
            onPaymentSuccess={(gatewayData) => {
              setShowGatewayModal(false);
              submitDeposit({
                channelType: 'gateway',
                method: gatewayData.method,
                trxId: gatewayData.trxId,
                senderAccount: gatewayData.senderAccount
              });
            }}
          />
        </>
      );
    }


    function WithdrawModal({ lang = 'bn', user, token, onClose, onSuccess }) {
      const [amount, setAmount] = React.useState(10000);
      const [destination, setDestination] = React.useState('Bank Account');
      const [accountDetails, setAccountDetails] = React.useState(user?.bankInfo?.accountNumber || user?.phone || '');
      const [loading, setLoading] = React.useState(false);
      const [errorMessage, setErrorMessage] = React.useState('');

      const handleWithdraw = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (Number(amount) > (user?.walletBalance || 0)) {
          setErrorMessage(
            lang === 'bn'
              ? `পর্যাপ্ত ব্যালেন্স নেই। বর্তমান ব্যালেন্স ${formatBDT(user?.walletBalance || 0)}।`
              : `Insufficient balance. Current balance is ${formatBDT(user?.walletBalance || 0)}.`
          );
          return;
        }

        if (Number(amount) < 1000) {
          setErrorMessage(
            lang === 'bn' ? 'সর্বনিম্ন উত্তোলনের পরিমাণ ১,০০০ টাকা।' : 'Minimum withdrawal amount is ৳1,000.'
          );
          return;
        }

        setLoading(true);
        try {
          const res = await apiCall('/api/wallet/withdraw', 'POST', {
            amount: Number(amount),
            destination,
            accountDetails
          }, token);

          if (res.success) {
            onSuccess();
          } else {
            setErrorMessage(res.message || (lang === 'bn' ? 'উত্তোলন অনুরোধ ব্যর্থ হয়েছে।' : 'Withdrawal request failed.'));
          }
        } catch (err) {
          setErrorMessage(err.message || (lang === 'bn' ? 'নেটওয়ার্ক ত্রুটি।' : 'Network error.'));
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 relative animate-fade-in">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-3xl">🏦</span>
              <h2 className="text-lg font-black text-slate-900">
                {lang === 'bn' ? 'মুনাফা ও মূলধন উত্তোলন' : 'Withdrawal Request'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'উত্তোলনযোগ্য ব্যালেন্স:' : 'Available Liquid Balance:'} <strong className="text-slate-800">{formatBDT(user?.walletBalance || 0)}</strong>
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'উত্তোলনের পরিমাণ (টাকা) *' : 'Withdrawal Amount (BDT) *'}
                </label>
                <input
                  type="number"
                  min={1000}
                  max={user?.walletBalance || 0}
                  step={500}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-base font-black focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'উত্তোলনের মাধ্যম *' : 'Payout Channel *'}
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
                >
                  <option value="Bank Account">Dutch-Bangla Bank / BEFTN / NPSB</option>
                  <option value="bKash">bKash Personal Wallet</option>
                  <option value="Nagad">Nagad Personal Wallet</option>
                  <option value="Rocket">Rocket Personal Wallet</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {lang === 'bn' ? 'প্রাপক একাউন্ট নম্বর / বিকাশ নম্বর *' : 'Destination Account Number / Mobile *'}
                </label>
                <input
                  type="text"
                  value={accountDetails}
                  onChange={(e) => setAccountDetails(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl gradient-agro text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
              >
                {loading
                  ? (lang === 'bn' ? 'অনুরোধ পাঠানো হচ্ছে...' : 'Submitting Request...')
                  : (lang === 'bn' ? 'উত্তোলন অনুরোধ সম্পন্ন করুন' : 'Submit Withdrawal Request')}
              </button>
            </form>
          </div>
        </div>
      );
    }

    function CertificateModal({ lang = 'bn', investment, onClose }) {
      const prokolpoAllocations = investment.prokolpoAllocations || [];

      return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border-4 border-amber-400 relative animate-fade-in space-y-6 max-h-[92vh] overflow-y-auto">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition"
            >
              ✕
            </button>

            {/* CERTIFICATE BANNER */}
            <div className="text-center space-y-2 border-b-2 border-amber-300 pb-5">
              <span className="text-4xl">🌾</span>
              <h2 className="text-2xl font-black text-slate-900 tracking-wide font-serif">
                {lang === 'bn' ? 'কৃষি বিনিয়োগ অংশীদারিত্ব সনদ' : 'AGRICULTURAL DIRECT INVESTMENT CERTIFICATE'}
              </h2>
              <p className="text-xs text-amber-800 font-bold uppercase tracking-widest">
                {lang === 'bn' ? 'এগ্রোফাইন্যান্স বাংলাদেশ • প্রাতিষ্ঠানিক কৃষি অংশীদারিত্ব চুক্তি' : 'AgroFinance BD Limited • Institutional Agricultural Direct Partnership'}
              </p>
              <div className="font-mono text-xs text-slate-500">
                {lang === 'bn' ? 'সনদ নম্বর:' : 'Certificate ID:'} <strong className="text-slate-900">{investment.certificateId}</strong>
              </div>
            </div>

            {/* CONTRACT DETAILS */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  {lang === 'bn' ? 'সমন্বিত কৃষি প্রকল্প' : 'Master Agro Project'}
                </span>
                <span className="font-black text-slate-900 text-sm">{investment.projectTitle}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  {lang === 'bn' ? 'মোট বিনিয়োগ মূলধন' : 'Investment Capital'}
                </span>
                <span className="font-black text-slate-900 text-sm">{formatBDT(investment.investedAmount)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  {lang === 'bn' ? 'প্রত্যাশিত মুনাফা হার' : 'Expected Profit Return'}
                </span>
                <span className="font-black text-emerald-600 text-sm">+{investment.expectedReturn}% ({formatBDT((investment.investedAmount * investment.expectedReturn) / 100)})</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  {lang === 'bn' ? 'পেমেন্ট চ্যানেল' : 'Payment Channel'}
                </span>
                <span className="font-bold text-slate-800 text-sm">{investment.paymentMethod || 'Wallet'}</span>
              </div>
            </div>

            {/* ALLOCATED PROKOLPOS BREAKDOWN */}
            {prokolpoAllocations.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2 text-xs">
                <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider block">
                  {lang === 'bn' ? '🌱 উপ-প্রকল্প সমূহে মূলধন বণ্টন তালিকা' : '🌱 Distributed Sub-Unit Allocation Schedule'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {prokolpoAllocations.map(pr => {
                    const pct = pr.percentage || pr.allocationPercentage || 0;
                    const prName = lang === 'bn' ? (pr.banglaName || pr.nameBn || pr.name || pr.prokolpoName) : (pr.prokolpoName || pr.name);
                    return (
                      <div key={pr.name || pr.prokolpoName || pr.id} className="flex justify-between items-center p-2 rounded-xl bg-white border border-amber-100">
                        <div>
                          <div className="font-bold text-slate-900 text-xs">
                            {prName}
                          </div>
                          <div className="text-[10px] text-slate-400">{pct}% share</div>
                        </div>
                        <div className="font-mono font-black text-emerald-700 text-xs">
                          {formatBDT(pr.allocatedAmount)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SEALS & ATTESTATION */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
              <div>
                <p className="text-[10px] text-slate-400">{lang === 'bn' ? 'ব্লকচেইন হ্যাশ সত্যয়ন' : 'Cryptographic Hash Attested'}</p>
                <div className="font-mono text-[9px] text-slate-600 break-all max-w-xs">
                  SHA256: 8f9b2c8a14e9f71d2b8471c264a9ef38b1d92a0149e
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full border-2 border-amber-500 flex items-center justify-center text-amber-700 font-bold text-[9px] mx-auto uppercase">
                  {lang === 'bn' ? 'যাচাইকৃত' : 'Verified'}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">{lang === 'bn' ? 'কৃষি অডিট ব্যুরো' : 'Compliance Bureau'}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => window.print()}
                className="px-6 py-2 rounded-xl gradient-agro text-white font-bold text-xs shadow hover:brightness-110"
              >
                🖨️ {lang === 'bn' ? 'সনদ প্রিন্ট করুন' : 'Print Certificate'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    const DigitalCertificateModal = CertificateModal;

    // ==========================================
    // ENHANCED INSTITUTIONAL FARM DETAIL MODAL
    // ==========================================
    function FarmDetailModal({ lang = 'bn', project, onClose, onInvest, onScheduleVisit }) {
      const isBn = lang === 'bn';
      const [activeTab, setActiveTab] = React.useState('units'); // 'units' | 'financial' | 'telemetry' | 'insurance'
      const [calcAmount, setCalcAmount] = React.useState(project.minInvestment || 50000);

      const imgSrc = getProjectImageUrl(project.image, project.category, project.title);
      const prokolpos = project.prokolpos && project.prokolpos.length > 0 ? project.prokolpos : [
        { id: 'prk_1', name: 'High-Yield Production Unit', banglaName: 'উচ্চফলনশীল ফসল উৎপাদন ইউনিট', allocationPercentage: 40, icon: '🌾' },
        { id: 'prk_2', name: 'Livestock & Dairy Unit', banglaName: 'উন্নত ডেইরি ও প্রাণিসম্পদ ইউনিট', allocationPercentage: 25, icon: '🐄' },
        { id: 'prk_3', name: 'Scientific Aquaculture Unit', banglaName: 'বায়োফ্লক আধুনিক মৎস্য ইউনিট', allocationPercentage: 20, icon: '🐟' },
        { id: 'prk_4', name: 'Greenhouse Horticulture', banglaName: 'নিয়ন্ত্রিত পরিবেশ গ্রিনহাউস বাগান', allocationPercentage: 15, icon: '🥦' }
      ];

      const pct = Math.min(100, Math.round(((project.raisedAmount || 0) / (project.totalFunding || 1)) * 100));
      const expectedROI = Number(project.expectedReturn) || 20;
      const calculatedProfit = Math.round(calcAmount * (expectedROI / 100));
      const calculatedTotal = calcAmount + calculatedProfit;

      const projectDesc = isBn
        ? (project.descriptionBn || project.description)
        : (project.descriptionEn || projectDescriptionsEn[project.id] || project.description);

      return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto relative flex flex-col justify-between">
            
            {/* Top Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-950 text-white flex items-center justify-center text-sm font-bold transition shadow-lg"
              title="Close"
            >
              ✕
            </button>

            <div className="space-y-6">
              {/* COVER BANNER */}
              <div className="relative h-56 sm:h-64 rounded-3xl overflow-hidden bg-slate-950 shadow-inner">
                <img
                  src={imgSrc}
                  alt={project.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />
                
                {/* Badges on Banner */}
                <div className="absolute top-4 left-4 right-14 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-600 text-white shadow-md">
                      {project.category || 'Agro Venture'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-black bg-amber-500 text-slate-950 shadow-md flex items-center gap-1">
                      <span>✨</span>
                      <span>{prokolpos.length} {isBn ? 'টি উপ-প্রকল্পে বন্টন' : 'Diversified Units'}</span>
                    </span>
                    <span className="px-3 py-1 rounded-full text-[11px] font-black bg-blue-600 text-white shadow-md flex items-center gap-1">
                      <span>🛡️</span>
                      <span>{isBn ? '১০০% ফসল বীমাকৃত' : '100% Crop Insured'}</span>
                    </span>
                  </div>
                </div>

                {/* Banner Bottom Info */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs text-emerald-300 font-semibold mb-1 flex items-center gap-1">
                    <span>📍</span>
                    <span>{project.location || (isBn ? 'বাংলাদেশ' : 'Bangladesh')}</span>
                    <span className="text-slate-400">•</span>
                    <span>{isBn ? 'খামার কো-অপারেটিভ: ' : 'Co-op: '}{project.manager || 'Green Valley AgroTech'}</span>
                  </p>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {isBn ? (project.banglaTitle || project.title) : project.title}
                  </h2>
                </div>
              </div>

              {/* QUICK KEY STATS STRIP */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{isBn ? 'সম্ভাব্য বার্ষিক লাভ' : 'Target Net ROI'}</span>
                  <span className="text-xl font-black text-emerald-700">+{project.expectedReturn}%</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{isBn ? 'ফসল চক্র সমাপ্তিতে' : 'Per Cycle Yield'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{isBn ? 'নূন্যতম বিনিয়োগ' : 'Min Investment'}</span>
                  <span className="text-xl font-black text-slate-900">{formatBDT(project.minInvestment || 50000, lang)}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{isBn ? '১ একক প্রদেয়' : '1 Unit Allotment'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{isBn ? 'প্রকল্পের মেয়াদ' : 'Cycle Duration'}</span>
                  <span className="text-xl font-black text-slate-900">{project.duration || 6} {isBn ? 'মাস' : 'Months'}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{isBn ? 'ফসল উত্তোলন চক্র' : 'Harvest Horizon'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{isBn ? 'সংগৃহীত তহবিল' : 'Funded Progress'}</span>
                  <span className="text-xl font-black text-emerald-700">{pct}%</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{formatBDT(project.raisedAmount || 0, lang)} / {formatBDT(project.totalFunding || 0, lang)}</span>
                </div>
              </div>

              {/* PROJECT BLUEPRINT DESCRIPTION */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-slate-700 space-y-1.5 leading-relaxed">
                <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
                  <span>🌾</span>
                  <span>{isBn ? 'সমন্বিত প্রকল্পের লক্ষ্য ও ঝুঁকি হ্রাস কৌশল:' : 'Master Venture Blueprint & Risk Mitigation Strategy:'}</span>
                </h4>
                <p className="text-slate-600 font-medium">
                  {projectDesc}
                </p>
              </div>

              {/* NAVIGATION TABS */}
              <div className="flex shrink-0 border-b border-slate-200 gap-1 sm:gap-2 overflow-x-auto custom-scrollbar text-xs font-bold">
                {[
                  { id: 'units', labelBn: '🌱 উপ-প্রকল্পসমূহ ও বন্টন', labelEn: '🌱 Sub-Units Breakdown' },
                  { id: 'financial', labelBn: '📈 আর্থিক মডেল ও সিমুলেটর', labelEn: '📈 Financial Model & Yield' },
                  { id: 'telemetry', labelBn: '🛰️ আইওটি ও স্যাটেলাইট লাইভ', labelEn: '🛰️ IoT & Satellite Telemetry' },
                  { id: 'insurance', labelBn: '🛡️ বীমা সুরক্ষা ও পরিচালনা', labelEn: '🛡️ Insurance & Governance' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 pb-3 px-3.5 transition whitespace-nowrap border-b-2 font-bold cursor-pointer ${
                      activeTab === tab.id
                        ? 'border-emerald-600 text-emerald-700'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {isBn ? tab.labelBn : tab.labelEn}
                  </button>
                ))}
              </div>

              {/* TAB 1: SUB-UNITS BREAKDOWN */}
              {activeTab === 'units' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <p className="text-slate-500">
                      {isBn
                        ? `প্রতিটি একক বিনিয়োগ স্বয়ংক্রিয়ভাবে নিম্নোক্ত ${prokolpos.length}টি খাতে বণ্টিত হয়:`
                        : `Every single investment is mathematically apportioned into ${prokolpos.length} production units:`}
                    </p>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                      100% {isBn ? 'সমন্বিত বরাদ্দ' : 'Diversified Split'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {prokolpos.map((pr, idx) => {
                      const allocPct = pr.allocationPercentage || 25;
                      const dedicatedCapital = Math.round(((project.totalFunding || 5000000) * allocPct) / 100);
                      const prTitle = isBn ? (pr.banglaName || pr.name) : (pr.name || pr.banglaName);
                      const prDesc = isBn
                        ? (pr.descriptionBn || pr.description || 'উন্নত কৃষি প্রযুক্তি ও বৈজ্ঞানিক নিবিড় পরিচর্যা।')
                        : (pr.descriptionEn || pr.description || 'High-efficiency cultivation with automated IoT monitoring.');

                      return (
                        <div key={pr.id || idx} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:border-emerald-300 transition">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                              <span className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-xl flex items-center justify-center shrink-0">
                                {pr.icon || '🌾'}
                              </span>
                              <div>
                                <h5 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
                                  {prTitle}
                                </h5>
                                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                                  {pr.location || (isBn ? 'খামার এলাকা' : 'Production Zone')}
                                </span>
                              </div>
                            </div>
                            <span className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-black text-xs shrink-0">
                              {allocPct}%
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {prDesc}
                          </p>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                            <span>{isBn ? 'বরাদ্দকৃত মূলধন:' : 'Capital Split:'} <strong className="text-slate-800">{formatBDT(dedicatedCapital, lang)}</strong></span>
                            <span className="text-emerald-700 font-bold">+{pr.expectedReturn || project.expectedReturn}% {isBn ? 'লক্ষ্যমাত্রা' : 'Target'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: FINANCIAL MODEL & YIELD SIMULATOR */}
              {activeTab === 'financial' && (
                <div className="space-y-6">
                  {/* Interactive Simulator */}
                  <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <h4 className="font-black text-sm text-white flex items-center gap-2">
                          <span>🧮</span>
                          <span>{isBn ? 'ইন্টারেক্টিভ লাভ ক্যালকুলেটর' : 'Interactive Returns Calculator'}</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {isBn ? 'আপনার প্রস্তাবিত বিনিয়োগের বিপরীতে সম্ভাব্য রিটার্ন যাচাই করুন' : 'Simulate your net projected payout based on cycle yields'}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-xs">
                        +{expectedROI}% {isBn ? 'সম্ভাব্য লাভ' : 'Net ROI'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>{isBn ? 'বিনিয়োগের পরিমাণ নির্বাচন করুন:' : 'Select Investment Capital:'}</span>
                        <span className="text-emerald-400 text-base font-black">{formatBDT(calcAmount, lang)}</span>
                      </div>
                      <input
                        type="range"
                        min={project.minInvestment || 25000}
                        max={project.maxInvestment || 1000000}
                        step={10000}
                        value={calcAmount}
                        onChange={(e) => setCalcAmount(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>{formatBDT(project.minInvestment || 25000, lang)}</span>
                        <span>{formatBDT(project.maxInvestment || 1000000, lang)}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-center text-xs">
                      <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{isBn ? 'মূলধন' : 'Principal'}</span>
                        <span className="text-base font-black text-white">{formatBDT(calcAmount, lang)}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/30">
                        <span className="text-[10px] text-emerald-400 uppercase font-bold block">{isBn ? 'প্রত্যাশিত মুনাফা' : 'Projected Profit'}</span>
                        <span className="text-base font-black text-emerald-400">+{formatBDT(calculatedProfit, lang)}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">{isBn ? 'মোট প্রাপ্তি' : 'Total Payout'}</span>
                        <span className="text-base font-black text-amber-300">{formatBDT(calculatedTotal, lang)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Harvest & Liquidation Milestones */}
                  <div className="space-y-3">
                    <h5 className="font-black text-slate-900 text-xs sm:text-sm">
                      {isBn ? 'অর্থায়ন ও মুনাফা বিতরণ সময়সূচী (৪টি পর্যায়):' : 'Harvest Liquidation & Payout Milestones (4 Phases):'}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-slate-400 font-mono font-bold text-[10px]">PHASE 01</span>
                        <h6 className="font-bold text-slate-900">{isBn ? 'বীজ বপন ও কাঁচামাল' : 'Sowing & Inputs'}</h6>
                        <p className="text-slate-500 text-[11px]">{isBn ? 'উন্নত বীজ, সার ও ডেইরি ফিড সংগ্রহ এবং সরাসরি মাঠে প্রয়োগ।' : 'Procurement of certified seeds, feeds, and bio-inputs.'}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-slate-400 font-mono font-bold text-[10px]">PHASE 02</span>
                        <h6 className="font-bold text-slate-900">{isBn ? 'আইওটি ও বৃদ্ধি নিরীক্ষা' : 'Telemetry & Growth'}</h6>
                        <p className="text-slate-500 text-[11px]">{isBn ? 'স্যাটেলাইট এনডিভিআই ও ড্রোন জরিপের মাধ্যমে ফসলের স্বাস্থ্য পরীক্ষা।' : 'Mid-cycle satellite and drone telemetry monitoring.'}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                        <span className="text-slate-400 font-mono font-bold text-[10px]">PHASE 03</span>
                        <h6 className="font-bold text-slate-900">{isBn ? 'ফসল কর্তন ও পাইকারি বিক্রয়' : 'Harvest Liquidation'}</h6>
                        <p className="text-slate-500 text-[11px]">{isBn ? 'স্বপ্ন, আড়ং ও সরকারি আড়তে চুক্তিভিত্তিক সরাসরি নগদ বিক্রি।' : 'Direct off-take sales to Shwapno, Aarong, and markets.'}</p>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                        <span className="text-emerald-700 font-mono font-bold text-[10px]">PHASE 04</span>
                        <h6 className="font-bold text-emerald-950">{isBn ? 'ওয়ালেটে সরাসরি মুনাফা' : 'Instant Disbursal'}</h6>
                        <p className="text-emerald-800 text-[11px]">{isBn ? 'মূলধন ও মুনাফা বিনিয়োগকারী ওয়ালেটে তাৎক্ষণিক জমা এবং ব্যাংক ট্রান্সফার।' : 'Principal and high returns credited directly to wallet.'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: IOT & SATELLITE TELEMETRY */}
              {activeTab === 'telemetry' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-2xl block mb-1">💧</span>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">{isBn ? 'মাটির আর্দ্রতা' : 'Soil Moisture'}</span>
                      <span className="text-base font-black text-slate-900">76%</span>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">{isBn ? 'আদর্শ স্তর' : 'Optimal Zone'}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-2xl block mb-1">☀️</span>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">{isBn ? 'তাপমাত্রা' : 'Ambient Temp'}</span>
                      <span className="text-base font-black text-slate-900">28.4°C</span>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">{isBn ? 'অনুকূল আবহাওয়া' : 'Favorable'}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-2xl block mb-1">🛰️</span>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">{isBn ? 'স্যাটেলাইট এনডিভিআই' : 'Satellite NDVI'}</span>
                      <span className="text-base font-black text-emerald-600">0.86</span>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">{isBn ? 'সতেজ ও সবুজ' : 'Vibrant Canopy'}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-2xl block mb-1">🧪</span>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">{isBn ? 'পানির পিএইচ ও ডিও' : 'Water pH & DO'}</span>
                      <span className="text-base font-black text-slate-900">pH 7.2</span>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">DO: 6.8 mg/L</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 text-white text-xs space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <span className="animate-pulse">🟢</span>
                      <span>{isBn ? 'রিয়েল-টাইম আইওটি সেন্সর নেটওয়ার্ক সক্রিয়' : 'Live IoT Automated Telemetry Active'}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {isBn
                        ? 'খামারের প্রতি একরে ৩টি সেন্সর নোড স্থাপিত রয়েছে যা প্রতি ১৫ মিনিট পরপর মাটির পুষ্টি, তাপমাত্রা ও পানির অম্লতা কেন্দ্রীয় সার্ভারে প্রেরণ করে।'
                        : 'Three autonomous IoT telemetry nodes per acre transmit canopy humidity, soil nitrogen balance, and dissolved oxygen to our servers every 15 minutes.'}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: INSURANCE & GOVERNANCE */}
              {activeTab === 'insurance' && (
                <div className="space-y-4 text-xs">
                  <div className="p-5 rounded-3xl bg-blue-50/80 border border-blue-200 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🛡️</span>
                      <div>
                        <h5 className="font-black text-blue-950 text-sm">
                          {isBn ? 'সাধারণ বীমা কর্পোরেশন কর্তৃক ১০০% মূলধন সুরক্ষা' : '100% Principal Protection by Sadharan Bima Corporation'}
                        </h5>
                        <p className="text-blue-700 text-[11px] font-mono">
                          Master Policy Ref: SBC-AGR-2025-9982 (National Agricultural Syndicate)
                        </p>
                      </div>
                    </div>
                    <p className="text-blue-900 leading-relaxed">
                      {isBn
                        ? 'হাওর বা উপকূলীয় অঞ্চলে আকস্মিক বন্যা, খরা, ঘূর্ণিঝড়, শিলাবৃষ্টি বা মহামারীতে ফসল কিংবা প্রাণিসম্পদের ক্ষতি হলে বীমা কোম্পানি কর্তৃক যাচাইকৃত ক্ষতিপূরণ সরাসরি বিনিয়োগকারীর অ্যাকাউন্টে জমা হবে।'
                        : 'Covers catastrophic flash floods, unseasonal hail, severe cyclones, droughts, and biological epidemics. Certified loss payouts are credited directly into investor wallets within 14 business days.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span>🚜</span>
                        <span>{isBn ? 'খামার পরিচালনাকারী প্রতিষ্ঠান:' : 'Operating Agricultural Co-op:'}</span>
                      </span>
                      <p className="text-slate-600 font-medium">
                        {project.manager || 'Green Valley Farmers Co-op Ltd.'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {isBn ? 'সমবায় অধিদপ্তর কর্তৃক নিবন্ধিত ও ১০+ বছরের বাণিজ্যিক অভিজ্ঞতা সম্পন্ন।' : 'Registered with Dept. of Cooperatives with 10+ years commercial track record.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span>🎓</span>
                        <span>{isBn ? 'প্রধান কৃষি পরামর্শক ও তদারকি:' : 'Chief Agronomist & Supervision:'}</span>
                      </span>
                      <p className="text-slate-600 font-medium">
                        {isBn ? 'ড. মাহফুজুর রহমান (বিএউ কৃষিবিদ)' : 'Dr. Mahfuzur Rahman (BAU Senior Agronomist)'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {isBn ? 'বাংলাদেশ কৃষি গবেষণা ইনস্টিটিউটের বৈজ্ঞানিক প্রটোকল অনুসারে পরিচালিত।' : 'Follows BARI scientific cultivation protocols and zero-toxic pest management.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* MODAL FOOTER ACTION BUTTONS */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>🛡️</span>
                <span>{isBn ? 'সুরক্ষিত ও বীমাকৃত প্রজেক্ট' : 'Verified & Insured Venture'}</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  {isBn ? 'বন্ধ করুন' : 'Close'}
                </button>
                <button
                  onClick={onInvest}
                  className="flex-1 sm:flex-none px-7 py-3 rounded-2xl gradient-agro text-white text-xs font-black shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <span>🌾</span>
                  <span>{isBn ? 'এই সমন্বিত প্রকল্পে বিনিয়োগ করুন' : 'Invest in this Integrated Project'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      );
    }

    // ==========================================
    // COMPREHENSIVE LEGAL & COMPLIANCE MODAL
    // ==========================================
    function LegalPolicyModal({ lang = 'bn', initialTab = 'terms', onClose }) {
      const isBn = lang === 'bn';
      const [currentTab, setCurrentTab] = React.useState(initialTab || 'terms');

      const tabs = [
        { id: 'terms', icon: '📜', labelBn: 'সেবার শর্তাবলী', labelEn: 'Terms of Service' },
        { id: 'privacy', icon: '🔒', labelBn: 'গোপনীয়তা নীতি', labelEn: 'Privacy Policy' },
        { id: 'security', icon: '🛡️', labelBn: 'নিরাপত্তা নীতিমালা', labelEn: 'Security & Compliance' },
        { id: 'insurance', icon: '📑', labelBn: 'বীমা ও নিরীক্ষা সনদ', labelEn: 'Insurance & Audit Cert' }
      ];

      return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col relative overflow-hidden">
            
            {/* Top Bar with Title and Close Button */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                    {isBn ? 'আইনি ও কমপ্লায়েন্স ফ্রেমওয়ার্ক' : 'Institutional Legal & Compliance Framework'}
                  </span>
                  <span className="text-slate-400 text-xs font-mono">v3.4 (2026)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                  {isBn ? 'নীতিমালা, শর্তাবলী ও সার্টিফিকেশন' : 'Policies, Legal Terms & Certifications'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold transition shadow-sm shrink-0"
              >
                ✕
              </button>
            </div>

            {/* TAB SELECTOR BUTTONS */}
            <div className="flex gap-2 overflow-x-auto py-3 border-b border-slate-200 shrink-0 custom-scrollbar">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
                    currentTab === tab.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{isBn ? tab.labelBn : tab.labelEn}</span>
                </button>
              ))}
            </div>

            {/* TAB CONTENT (SCROLLABLE CONTAINER) */}
            <div className="flex-1 overflow-y-auto py-4 space-y-5 custom-scrollbar pr-2 text-slate-700 text-xs sm:text-sm leading-relaxed">
              
              {/* 1. TERMS OF SERVICE */}
              {currentTab === 'terms' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
                    <h4 className="font-bold text-sm mb-1">
                      {isBn ? 'সেবার সাধারণ শর্তাবলী (Terms of Service)' : 'Platform Terms & Investor Agreement'}
                    </h4>
                    <p className="text-xs text-emerald-800">
                      {isBn
                        ? 'AgroFinance BD লিমিটেড প্ল্যাটফর্ম ব্যবহারের পূর্বে অনুগ্রহ করে এই শর্তাবলী মনোযোগ সহকারে পড়ুন। আমাদের প্ল্যাটফর্মে অ্যাকাউন্ট খোলার মাধ্যমে আপনি এই শর্তাবলীতে সম্মত হচ্ছেন।'
                        : 'Please review these institutional investment terms carefully before engaging on AgroFinance BD. By registering an investor account, you agree to enter this legally binding agreement.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <h5 className="font-bold text-slate-900">{isBn ? '১. প্ল্যাটফর্ম পরিচিতি ও কার্যক্রম' : '1. Scope of the Platform'}</h5>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {isBn
                          ? 'AgroFinance BD একটি প্রাতিষ্ঠানিক কৃষি-প্রযুক্তি আর্থিক প্ল্যাটফর্ম যা সাধারণ বিনিয়োগকারীদের সরাসরি মাঠপর্যায়ের লাভজনক কৃষি প্রকল্পে অর্থায়নের সুযোগ করে দেয়। একটি একক বিনিয়োগের অর্থ স্বয়ংক্রিয়ভাবে ধান, ডেইরি, মাছ ও সবজি খাতে বণ্টিত হয়।'
                          : 'AgroFinance BD operates an institutional agri-fintech infrastructure connecting retail and corporate capital directly with verified high-yield agricultural prokolpos. Capital is algorithmically allocated across multiple sectors to eliminate single-crop hazards.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <h5 className="font-bold text-slate-900">{isBn ? '২. বিনিয়োগকারীর যোগ্যতা ও কেওয়াইসি (KYC)' : '2. Investor Eligibility & KYC'}</h5>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {isBn
                          ? 'বিনিয়োগকারীকে অবশ্যই বাংলাদেশের নাগরিক অথবা বৈধ পাসপোর্টধারী অনাবাসী বাংলাদেশী (NRB) হতে হবে এবং বয়স ন্যূনতম ১৮ বছর হতে হবে। বাংলাদেশ ব্যাংকের এন্টি-মানি লন্ডারিং গাইডলাইন অনুযায়ী জাতীয় পরিচয়পত্র (NID) দ্বারা ই-কেওয়াইসি সম্পন্ন করা বাধ্যতামূলক।'
                          : 'Eligible investors must be at least 18 years of age, holding a valid Bangladeshi National Identity Card (NID) or foreign passport for Non-Resident Bangladeshis (NRBs). E-KYC verification is mandatory before deploying funds.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <h5 className="font-bold text-slate-900">{isBn ? '৩. মূলধন ব্যবস্থাপনা ও ফসল বিপণন' : '3. Capital Allocation & Crop Liquidation'}</h5>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {isBn
                          ? 'বিনিয়োগকৃত অর্থ কেবল নির্ধারিত প্রকল্পে আধুনিক বীজ, পশুখাদ্য ও বায়ো-টেকনোলজিতে ব্যয় হবে। ফসল কাটার পর তা সুপারশপ (যেমন স্বপ্ন, আগোরা) ও আড়তে সরাসরি পাইকারি দরে বিক্রি করে সংগৃহীত মুনাফা বিনিয়োগকারীর ওয়ালেটে জমা করা হবে।'
                          : 'Deployed capital is channeled strictly into designated production inputs (certified hybrid seeds, dairy silage, biofloc fingerlings). Wholesale liquidation agreements with major supermarket chains and distributors ensure fast, reliable capital return.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <h5 className="font-bold text-slate-900">{isBn ? '৪. মুনাফা ও উত্তোলন পদ্ধতি' : '4. Dividend Disbursal & Withdrawals'}</h5>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {isBn
                          ? 'প্রকল্পের মেয়াদ শেষে মূলধন ও মুনাফা বিনিয়োগকারীর প্ল্যাটফর্ম ওয়ালেটে জমা হবে। বিনিয়োগকারী যেকোনো সময় Dutch-Bangla Bank, City Bank, BRAC Bank কিংবা bKash, Nagad এর মাধ্যমে কোনো চার্জ ছাড়াই অর্থ উত্তোলন করতে পারবেন।'
                          : 'Upon harvest maturity, principal and yields credit automatically to the investor wallet. Withdrawals are processed seamlessly without platform fees via partner corporate banks and MFS channels.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <h5 className="font-bold text-slate-900">{isBn ? '৫. বিরোধ নিষ্পত্তি ও বিচারিক এখতিয়ার' : '5. Dispute Resolution & Governing Law'}</h5>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {isBn
                          ? 'এই শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশের প্রচলিত আইন দ্বারা পরিচালিত হবে। কোনো বিরোধ সৃষ্টি হলে তা সালিশি আইন ২০০১ (Arbitration Act 2001) অনুসারে ঢাকা অধিক্ষেত্রের মধ্যে নিষ্পত্তি হবে।'
                          : 'This agreement is governed by the laws of the People\'s Republic of Bangladesh. Any dispute arising hereunder shall be resolved through arbitration in Dhaka pursuant to the Bangladesh Arbitration Act 2001.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PRIVACY POLICY */}
              {currentTab === 'privacy' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-950">
                    <h4 className="font-bold text-sm mb-1">
                      {isBn ? 'গ্রাহক গোপনীয়তা নীতি (Privacy Policy)' : 'Institutional Data Privacy & Confidentiality'}
                    </h4>
                    <p className="text-xs text-blue-800">
                      {isBn
                        ? 'আপনার ব্যক্তিগত এবং আর্থিক তথ্যের সুরক্ষা আমাদের সর্বোচ্চ অগ্রাধিকার। বাংলাদেশ সাইবার সিকিউরিটি আইন ২০২৩ অনুযায়ী আমরা আপনার তথ্যের গোপনীয়তা রক্ষা করি।'
                        : 'AgroFinance BD upholds rigorous data protection standards in strict compliance with the Bangladesh Cyber Security Act 2023 and global privacy frameworks.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <h5 className="font-bold text-slate-900">{isBn ? '১. যেসকল তথ্য আমরা সংগ্রহ করি' : '1. Information We Collect'}</h5>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {isBn
                          ? 'নাম, ইমেইল, মোবাইল নম্বর, জাতীয় পরিচয়পত্র (NID) নম্বর ও ছবি, ব্যাংক হিসাব বিবরণী এবং লেনদেনের হিস্টোরি। এই তথ্য কেবল আপনার অ্যাকাউন্ট নিশ্চিতকরণ এবং লভ্যাংশ প্রেরণের উদ্দেশ্যে ব্যবহৃত হয়।'
                          : 'Full legal name, phone number, verified email address, NID or passport documentation, bank settlement account details, and transaction receipts required for automated AML and tax compliance.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <h5 className="font-bold text-slate-900">{isBn ? '২. তথ্য নিরাপত্তা ও এনক্রিপশন' : '2. Encryption & Zero Data Sale'}</h5>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {isBn
                          ? 'আমাদের ডাটাবেজে সংরক্ষিত সকল তথ্য AES-256 বিট এনক্রিপশনে সুরক্ষিত। আমরা তৃতীয় কোনো বাণিজ্যিক পক্ষের কাছে বিনিয়োগকারীর ব্যক্তিগত তথ্য বিক্রি, ভাড়া বা হস্তান্তর করি না।'
                          : 'All persistent data is safeguarded with military-grade AES-256 bit encryption at rest and TLS 1.3 in transit. We enforce an absolute zero data monetization policy; investor information is never sold or rented.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <h5 className="font-bold text-slate-900">{isBn ? '৩. ব্যাংকিং ও পেমেন্ট গেটওয়ে সুরক্ষা' : '3. Payment Gateway Discretion'}</h5>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {isBn
                          ? 'আপনার bKash পিন, কার্ডের সিভিভি কিংবা ইন্টারনেট ব্যাংকিং পাসওয়ার্ড আমাদের সার্ভারে কখনই সংরক্ষিত হয় না। লেনদেনগুলো সরাসরি বাংলাদেশ ব্যাংক অনুমোদিত পিএসপি (PSP) গেটওয়ের মাধ্যমে পরিচালিত হয়।'
                          : 'We never store sensitive payment instruments, card CVVs, or MFS PINs. Payment clearance executes directly through PCI-DSS Level 1 certified gateway switches licensed by Bangladesh Bank.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <h5 className="font-bold text-slate-900">{isBn ? '৪. গ্রাহকের অধিকার ও তথ্য সংশোধন' : '4. Investor Rights & Erasure'}</h5>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {isBn
                          ? 'বিনিয়োগকারী যেকোনো সময় তার অ্যাকাউন্টের তথ্যের অনুলিপি দেখতে পারেন এবং সংশোধন করতে পারেন। অ্যাকাউন্ট বন্ধের অনুরোধ জানালে আইনি নিরীক্ষা মেয়াদ শেষে সকল ডাটা স্থায়ীভাবে মুছে ফেলা হয়।'
                          : 'Investors retain the right to audit, amend, or request full closure of their profiles. Post statutory financial record audits, personal data records are purged upon request.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. SECURITY & COMPLIANCE */}
              {currentTab === 'security' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950">
                    <h4 className="font-bold text-sm mb-1">
                      {isBn ? 'সাইবার নিরাপত্তা ও কমপ্লায়েন্স কাঠামো' : 'Enterprise Cybersecurity & Threat Mitigation'}
                    </h4>
                    <p className="text-xs text-amber-800">
                      {isBn
                        ? 'আমাদের প্ল্যাটফর্ম সার্বক্ষণিক স্বয়ংক্রিয় এসআইইএম (SIEM) এবং ডিডস (DDoS) প্রতিরোধক শিল্ড দ্বারা সাইবার আক্রমণ থেকে সুরক্ষিত।'
                        : 'Our platform deploys SOC-2 Type II aligned architecture with continuous automated intrusion prevention and live SIEM event telemetry.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <h5 className="font-bold text-slate-900">{isBn ? '১. সার্বক্ষণিক এসআইইএম মনিটরিং (Live SIEM Active)' : '1. Continuous 24/7 SIEM Intrusion Defense'}</h5>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {isBn
                          ? 'আমাদের সেন্ট্রাল সিকিউরিটি ফ্রেমওয়ার্ক প্রতি সেকেন্ডে ইনকামিং ট্রাফিকের প্যাটার্ন পর্যবেক্ষণ করে। ক্ষতিকর এসকিউএল ইনজেকশন বা ব্রুট-ফোর্স আক্রমণ শনাক্ত হলে স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট আইপি ব্লকলিস্টে যুক্ত হয়।'
                          : 'Real-time threat monitoring flags SQL injection, cross-site scripting (XSS), and automated credential brute-forcing. Malicious endpoints are instantly isolated and quarantined.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <h5 className="font-bold text-slate-900">{isBn ? '২. টু-ফ্যাক্টর ও ওটিপি ভেরিফিকেশন' : '2. Dual-Factor Authentication & Dynamic OTP'}</h5>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {isBn
                          ? 'প্রতিটি আর্থিক লেনদেন, পাসওয়ার্ড রিসেট এবং প্রোফাইল তথ্য পরিবর্তনের ক্ষেত্রে গ্রাহকের নিবন্ধিত মোবাইল ও ইমেইলে ওয়ান-টাইম পাসওয়ার্ড (OTP) প্রেরণ করে দ্বৈত নিরাপত্তা নিশ্চিত করা হয়।'
                          : 'All high-risk actions—including withdrawals, password modifications, and KYC updates—require dynamic, time-sensitive OTP verification dispatched via authenticated SMS/SMTP gateways.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <h5 className="font-bold text-slate-900">{isBn ? '৩. নিয়মিত সিকিউরিটি অডিট ও পেন-টেস্টিং' : '3. Penetration Testing & Ethical Hacking'}</h5>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {isBn
                          ? 'প্রতি ত্রৈমাসিকে শীর্ষস্থানীয় সার্টিফায়েড এথিক্যাল হ্যাকার দ্বারা আমাদের সিস্টেমের ভালনারেবিলিটি অ্যাসেসমেন্ট এবং পেনিট্রেশন টেস্টিং (VAPT) সম্পন্ন করা হয়।'
                          : 'Quarterly third-party Vulnerability Assessment & Penetration Testing (VAPT) is executed by licensed cybersecurity auditors to guarantee enterprise-grade resilience.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. INSURANCE & AUDIT CERTIFICATION */}
              {currentTab === 'insurance' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-purple-950">
                    <h4 className="font-bold text-sm mb-1">
                      {isBn ? 'জাতীয় ফসল বীমা ও বার্ষিক নিরীক্ষা সনদ' : 'National Crop Insurance & Statutory Audit Certification'}
                    </h4>
                    <p className="text-xs text-purple-800">
                      {isBn
                        ? 'সাধারণ বীমা কর্পোরেশন এবং আইসিএবি তালিকাভুক্ত নিরীক্ষক দ্বারা আমাদের প্রতিটি প্রকল্প শতভাগ অডিটেড ও মূলধন সুরক্ষাপ্রাপ্ত।'
                        : 'Every project on AgroFinance BD is audited by ICAB chartered accountants and backed by Sadharan Bima Corporation principal underwriting.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <h5 className="font-bold text-slate-900">{isBn ? '১. সাধারণ বীমা কর্পোরেশন পার্টনারশিপ' : '1. Sadharan Bima Corporation Underwriting'}</h5>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {isBn
                          ? 'রাষ্ট্রায়ত্ত সাধারণ বীমা কর্পোরেশনের মাস্টার এগ্রিকালচারাল পলিসি (#SBC-AGR-2025-9982) এর অধীনে বন্যা, খরা, শিলাবৃষ্টি, নদীভাঙন ও মহামারীতে বিনিয়োগকারীর মূলধনের শতভাগ ক্ষতিপূরণ নিশ্চিত।'
                          : 'Underwritten under Master Agricultural Syndicate Policy #SBC-AGR-2025-9982 with state-owned Sadharan Bima Corporation. Protects 100% of investor capital against climate catastrophes.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <h5 className="font-bold text-slate-900">{isBn ? '২. ক্ষতি নিরূপণ ও ১৪ দিনের ক্লেইম সেটেলমেন্ট' : '2. 14-Day Claim Settlement SLA'}</h5>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {isBn
                          ? 'প্রাকৃতিক দুর্যোগ দেখা দিলে উপজেলা কৃষি কর্মকর্তা ও বীমা কোম্পানির যৌথ পরিদর্শনের ৭২ ঘণ্টার মধ্যে ক্ষতি নিরূপণ হয় এবং সর্বোচ্চ ১৪ কার্যদিবসের মধ্যে ক্লেইমের টাকা পরিশোধ করা হয়।'
                          : 'Joint field damage assessments with Upazila Agriculture Officers conclude within 72 hours of an event. Fully verified indemnity claims disburse within 14 business days.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <h5 className="font-bold text-slate-900">{isBn ? '৩. আইসিএবি অডিটেড বার্ষিক আর্থিক বিবরণী' : '3. ICAB Chartered Financial Audits'}</h5>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        {isBn
                          ? 'ইনস্টিটিউট অব চার্টার্ড অ্যাকাউন্ট্যান্টস অব বাংলাদেশ (ICAB) নিবন্ধিত স্বাধীন অডিট ফার্ম দ্বারা প্রতি অর্থবছরের আয়-ব্যয় এবং খামারের মজুদ স্টক পুঙ্খানুপুঙ্খ নিরীক্ষা করা হয়।'
                          : 'Annual financial balance sheets, harvest yields, and inventory reserves are audited by ICAB-registered statutory auditors according to International Financial Reporting Standards (IFRS).'}
                      </p>
                    </div>
                  </div>

                  {/* Certified Trust Badges */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl border border-emerald-500/30">
                        ✓
                      </div>
                      <div>
                        <div className="font-black text-xs text-white uppercase tracking-wider">
                          {isBn ? 'সনদপ্রাপ্ত ও নিবন্ধিত কৃষি প্ল্যাটফর্ম' : 'Certified & Insured Agri-Fintech'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {isBn ? 'রেজিস্ট্রার অব জয়েন্ট স্টক কোম্পানিজ (RJSC) নিবন্ধিত' : 'Registered under RJSC & Dept of Cooperatives'}
                        </div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs shrink-0">
                      VALID: 2025–2026
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* MODAL FOOTER */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between shrink-0 mt-auto">
              <span className="text-[11px] text-slate-400 font-medium">
                {isBn ? '© ২০২৬ AgroFinance BD Limited' : '© 2026 AgroFinance BD Limited'}
              </span>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold transition shadow"
              >
                {isBn ? 'পড়া সম্পন্ন (বন্ধ করুন)' : 'I Understand & Close'}
              </button>
            </div>

          </div>
        </div>
      );
    }

    function NewProjectModal({ lang = 'bn', token, onClose, onSuccess }) {
      const [title, setTitle] = React.useState('');
      const [category, setCategory] = React.useState('grain');
      const [totalFunding, setTotalFunding] = React.useState(500000);
      const [duration, setDuration] = React.useState(6);
      const [expectedReturn, setExpectedReturn] = React.useState(18);
      const [minInvestment, setMinInvestment] = React.useState(20000);
      const [location, setLocation] = React.useState('');
      const [farmerName, setFarmerName] = React.useState('');
      const [riskLevel, setRiskLevel] = React.useState('Low-Medium');
      const [description, setDescription] = React.useState('');
      const [image, setImage] = React.useState('');
      const [loading, setLoading] = React.useState(false);
      const [errorMessage, setErrorMessage] = React.useState('');

      const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        // Auto-assign default 3 integrated prokolpos for the newly launched project
        const defaultProkolpos = [
          { name: 'Core Agricultural Production', nameBn: 'মূল ফসল উৎপাদন', percentage: 50, icon: '🌾' },
          { name: 'Irrigation & Bio-Fertilizer', nameBn: 'সেচ ও জৈব সার ব্যবস্থাপনা', percentage: 30, icon: '💧' },
          { name: 'Post-Harvest Processing & Packaging', nameBn: 'ফসল প্রক্রিয়াজাতকরণ ও প্যাকেজিং', percentage: 20, icon: '📦' }
        ];

        try {
          const res = await apiCall('/api/projects', 'POST', {
            title,
            category,
            totalFunding: Number(totalFunding),
            duration: Number(duration),
            expectedReturn: Number(expectedReturn),
            minInvestment: Number(minInvestment),
            maxInvestment: Number(totalFunding),
            location,
            farmerName,
            riskLevel,
            description,
            image: image || 'crops',
            prokolpos: defaultProkolpos
          }, token);

          if (res.success) {
            onSuccess();
          } else {
            setErrorMessage(res.message || (lang === 'bn' ? 'প্রকল্প তৈরি করতে ব্যর্থ হয়েছে।' : 'Failed to create project.'));
          }
        } catch (err) {
          setErrorMessage(lang === 'bn' ? 'নেটওয়ার্ক ত্রুটি।' : 'Network error.');
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-fade-in relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold transition"
            >
              ✕
            </button>

            <div>
              <span className="text-2xl">➕</span>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                {lang === 'bn' ? 'নতুন সমন্বিত কৃষি প্রকল্প তৈরি' : 'Launch New Integrated Agricultural Venture'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'bn' ? 'প্ল্যাটফর্মে একটি নতুন বিনিয়োগযোগ্য কৃষি প্রকল্প যুক্ত করুন' : 'Add an institutional agro investment opportunity to the platform'}
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{lang === 'bn' ? 'প্রকল্পের শিরোনাম *' : 'Project Title *'}</label>
                <input
                  type="text"
                  placeholder={lang === 'bn' ? 'উদাঃ বৃহত্তর বগুড়া সমন্বিত আধুনিক কৃষি খামার' : 'e.g. Modern Integrated Agro Project'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{lang === 'bn' ? 'সেক্টর ক্যাটাগরি *' : 'Sector Category *'}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
                  >
                    <option value="grain">ধান ও খাদ্যশস্য (Paddy & Grain)</option>
                    <option value="fishery">আধুনিক মৎস্য চাষ (Fisheries)</option>
                    <option value="dairy">আধুনিক ডেইরি ও ডাল (Dairy & Livestock)</option>
                    <option value="vegetable">সবজি ও ফসল (Greenhouse Vegetables)</option>
                    <option value="fruit">রপ্তানিযোগ্য ফল (Fruit Orchards)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{lang === 'bn' ? 'ঝুঁকির মাত্রা *' : 'Risk Profile *'}</label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
                  >
                    <option value="Low">স্বল্প ঝুঁকি (Low Risk)</option>
                    <option value="Low-Medium">স্বল্প-মধ্যম ঝুঁকি (Low-Medium)</option>
                    <option value="Medium">মধ্যম ঝুঁকি (Medium Risk)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{lang === 'bn' ? 'মোট তহবিল লক্ষ্য (টাকা) *' : 'Funding Target (BDT) *'}</label>
                  <input
                    type="number"
                    value={totalFunding}
                    onChange={(e) => setTotalFunding(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{lang === 'bn' ? 'মেয়াদ (মাস) *' : 'Duration (Months) *'}</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{lang === 'bn' ? 'প্রত্যাশিত মুনাফা (% বার্ষিক) *' : 'ROI (% Annual) *'}</label>
                  <input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{lang === 'bn' ? 'অবস্থান (জেলা) *' : 'Location *'}</label>
                  <input
                    type="text"
                    placeholder="e.g. Bogura, Bangladesh"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{lang === 'bn' ? 'খামার সমবায় / পরিচালক *' : 'Farmer / Operator *'}</label>
                  <input
                    type="text"
                    placeholder="e.g. Bogura Agro Co-operative"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{lang === 'bn' ? 'প্রকল্পের বিবরণ *' : 'Description *'}</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder={lang === 'bn' ? 'ফসল উৎপাদন, মাটির গুণাগুণ, ফসল বিক্রয় ও বাজারজাতকরণের বিবরণ...' : 'Details regarding crop yield, soil testing, market off-take...'}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl gradient-agro text-white font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition"
              >
                {loading ? (lang === 'bn' ? 'তৈরি করা হচ্ছে...' : 'Creating...') : (lang === 'bn' ? 'প্রকল্পটি প্ল্যাটফর্মে প্রকাশ করুন' : 'Publish Project to Platform')}
              </button>
            </form>
          </div>
        </div>
      );
    }

    function ChatAdvisorModal({ lang = 'bn', onClose, onSelectProject, projects = [] }) {
      const [messages, setMessages] = React.useState([
        {
          sender: 'ai',
          text: lang === 'bn'
            ? "নমস্কার / আসসালামু আলাইকুম! আমি এগ্রোফাইন্যান্সের স্মার্ট এআই বিনিয়োগ উপদেষ্টা। আমি আপনার বিনিয়োগের মেয়াদ, ঝুঁকি বিশ্লেষণ, সমন্বিত উপ-প্রকল্প বণ্টন এবং প্রত্যাশিত মুনাফা নিরূপণে সাহায্য করতে প্রস্তুত। আপনার প্রশ্নটি লিখুন।"
            : "Greetings! I am your AI Agro Investment Advisor. I can analyze risks, calculate expected yields, explain multi-prokolpo diversification, and recommend the best projects for your horizon. How may I help you today?"
        }
      ]);
      const [input, setInput] = React.useState('');
      const [loadingAi, setLoadingAi] = React.useState(false);

      const handleSend = async (textToSend) => {
        const query = (textToSend || input).trim();
        if (!query) return;

        const newMessages = [...messages, { sender: 'user', text: query }];
        setMessages(newMessages);
        setInput('');
        setLoadingAi(true);

        try {
          // Live API Call to Backend OpenRouter AI Controller
          const token = localStorage.getItem('agro_token');
          const res = await apiCall('/api/ai/chat', 'POST', {
            message: query,
            language: lang,
            conversationHistory: newMessages.slice(-8).map(m => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text
            }))
          }, token);

          const replyText = (res && res.data && res.data.reply) || (res && res.reply);
          if (res && res.success && replyText) {
            setMessages(prev => [...prev, {
              sender: 'ai',
              text: replyText,
              suggestedProjects: (res.data && res.data.suggestedProjects) || res.suggestedProjects || []
            }]);
          } else {
            throw new Error(res.message || 'AI service unavailable');
          }
        } catch (err) {
          // Fallback smart response in case of network issue
          let fallbackReply = lang === 'bn'
            ? "আমাদের সকল কৃষি প্রকল্পে শতভাগ ফসল বীমা (Green Delta / সাধারণ বীমা) অন্তর্ভুক্ত এবং বিনিয়োগকৃত অর্থ স্বয়ংক্রিয়ভাবে ৩-৪টি উপ-প্রকল্পে বণ্টিত হয়ে ঝুঁকি হ্রাস করে। বার্ষিক ১৮% থেকে ২৪% প্রত্যাশিত মুনাফা অর্জিত হয়।"
            : "All AgroFinance BD projects feature 100% crop insurance and split your capital across multiple prokolpos to minimize risk, targeting 18% to 24% annual returns.";

          const lower = query.toLowerCase();
          if (lower.includes('rice') || lower.includes('ধান') || lower.includes('boro')) {
            fallbackReply = lang === 'bn'
              ? "সিলেট হাওর বোরো ধান ও সমন্বিত প্রকল্পটিতে বার্ষিক ১৮.৫% মুনাফা এবং ৬ মাসের ফসল চক্র রয়েছে। এটি অত্যন্ত জনপ্রিয় ও কম ঝুঁকির প্রকল্প।"
              : "Sylhet Haor Boro Rice project offers 18.5% projected return over a 6-month cycle backed by flood insurance.";
          } else if (lower.includes('fish') || lower.includes('মাছ') || lower.includes('hilsa')) {
            fallbackReply = lang === 'bn'
              ? "চাঁদপুর বৈজ্ঞানিক ইলিশ ও মৎস্য প্রকল্পে ২১.৫% বার্ষিক মুনাফা রয়েছে। এতে বায়োফ্লোক অক্সিজেনেশন প্রযুক্তি ব্যবহৃত হয়।"
              : "Chandpur Scientific Hilsa Fishery project yields 21.5% ROI over 5 months with IoT biofloc aeration.";
          }

          setMessages(prev => [...prev, { sender: 'ai', text: fallbackReply }]);
        } finally {
          setLoadingAi(false);
        }
      };

      return (
        <div className="fixed bottom-20 right-6 z-50 bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[520px] animate-fade-in">
          {/* HEADER */}
          <div className="p-4 gradient-agro text-white flex justify-between items-center shadow">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-black text-sm">
                  {lang === 'bn' ? 'স্মার্ট এআই এগ্রো উপদেষ্টা' : 'Smart AI Agri Advisor'}
                </h3>
                <span className="text-[10px] text-emerald-200 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
                  <span>{lang === 'bn' ? 'অনলাইন • ওপেনরাউটার চালিত' : 'Online • OpenRouter Powered'}</span>
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-white hover:text-emerald-200 font-bold text-sm">✕</button>
          </div>

          {/* CHAT LOG */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50/50">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'gradient-agro text-white rounded-tr-none shadow-sm'
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'
                }`}>
                  {m.text}

                  {/* SUGGESTED PROJECTS IF ANY */}
                  {m.suggestedProjects && m.suggestedProjects.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
                      <span className="text-[10px] font-bold text-emerald-700 block">
                        {lang === 'bn' ? 'প্রস্তাবিত প্রকল্প সমূহ:' : 'Recommended Projects:'}
                      </span>
                      {m.suggestedProjects.map((p, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => {
                            if (onSelectProject) onSelectProject(p);
                            onClose();
                          }}
                          className="w-full text-left p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-[11px] transition"
                        >
                          <div className="font-bold text-slate-900">{p.title}</div>
                          <div className="text-[10px] text-emerald-700">+{p.expectedReturn}% • {p.duration} Months</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loadingAi && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-500 rounded-2xl rounded-tl-none p-3 border border-slate-200 text-xs flex items-center gap-2">
                  <span className="inline-block animate-spin">⚙️</span>
                  <span>{lang === 'bn' ? 'উপদেষ্টা হিসাব করছে...' : 'Advisor calculating...'}</span>
                </div>
              </div>
            )}
          </div>

          {/* PROMPT PILLS */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[10px] no-scrollbar">
            <button
              onClick={() => handleSend(lang === 'bn' ? "সবচেয়ে কম ঝুঁকিপূর্ণ প্রকল্প কোনটি?" : "What are your safest low-risk projects?")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold whitespace-nowrap"
            >
              {lang === 'bn' ? '🛡️ নিরাপদ প্রকল্প?' : 'Safest Projects?'}
            </button>
            <button
              onClick={() => handleSend(lang === 'bn' ? "৫০,০০০ টাকা বিনিয়োগ করলে কোন প্রকল্পে কত যাবে?" : "If I invest 50,000 BDT, how is it split?")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold whitespace-nowrap"
            >
              {lang === 'bn' ? '💰 ৫০,০০০ টাকা বিনিয়োগ?' : '৳50k Investment?'}
            </button>
            <button
              onClick={() => handleSend(lang === 'bn' ? "ফসল বীমা কিভাবে কাজ করে?" : "How does crop insurance protect me?")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold whitespace-nowrap"
            >
              {lang === 'bn' ? '🌾 ফসল বীমা?' : 'Crop Insurance?'}
            </button>
          </div>

          {/* INPUT FORM */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              placeholder={lang === 'bn' ? 'কৃষি বিনিয়োগ সম্পর্কে প্রশ্ন লিখুন...' : 'Ask anything about agro ventures...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={loadingAi}
              className="px-3.5 py-2 rounded-xl gradient-agro text-white font-black text-xs shadow hover:brightness-110 active:scale-95 transition"
            >
              ➤
            </button>
          </form>
        </div>
      );
    }

    // ==============================================================================
    // FARM TOUR & IN-PERSON VISIT BOOKING MODAL
    // ==============================================================================
    function FarmTourBookingModal({ lang = 'bn', user, initialFarm = '', onClose, onSuccess, showToast }) {
      const isBn = lang === 'bn';
      const [farmLocation, setFarmLocation] = React.useState(initialFarm || 'Bogura Modern Dairy & Cattle Hub');
      const [name, setName] = React.useState(user?.name || '');
      const [email, setEmail] = React.useState(user?.email || '');
      const [phone, setPhone] = React.useState(user?.phone || '');
      
      // Default to 3 days from now
      const defaultDate = React.useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 3);
        return d.toISOString().split('T')[0];
      }, []);
      const [visitDate, setVisitDate] = React.useState(defaultDate);
      const [visitorsCount, setVisitorsCount] = React.useState(2);
      const [notes, setNotes] = React.useState('');
      const [loading, setLoading] = React.useState(false);
      const [errorMsg, setErrorMsg] = React.useState('');

      const farmOptions = [
        {
          id: 'bogura',
          nameEn: 'Bogura Modern Dairy & Cattle Hub',
          nameBn: 'বগুড়া আধুনিক ডেইরি ও মাংসল পশু খামার',
          icon: '🐄'
        },
        {
          id: 'mymensingh',
          nameEn: 'Mymensingh Biofloc Fishery Complex',
          nameBn: 'ময়মনসিংহ বায়োফ্লক মৎস্য প্রজনন ও চাষ প্রকল্প',
          icon: '🐟'
        },
        {
          id: 'rajshahi',
          nameEn: 'Rajshahi High-Density Mango & Malta Orchards',
          nameBn: 'রাজশাহী আম ও বারি মাল্টা বাগান প্রকল্প',
          icon: '🥭'
        },
        {
          id: 'sylhet',
          nameEn: 'Sylhet Integrated Mega Agro Complex',
          nameBn: 'সিলেট সমন্বিত মেগা কৃষি কমপ্লেক্স (ধান ও সবজি)',
          icon: '🌾'
        }
      ];

      const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (!name || !email || !phone || !farmLocation || !visitDate) {
          setErrorMsg(isBn ? 'অনুগ্রহ করে সকল আবশ্যকীয় তথ্য পূরণ করুন।' : 'Please fill in all required fields.');
          return;
        }

        setLoading(true);
        try {
          const res = await apiCall('/api/visits/book', 'POST', {
            name,
            email,
            phone,
            farmLocation,
            visitDate,
            visitorsCount: Number(visitorsCount),
            notes
          });

          if (res.success) {
            if (showToast) {
              showToast(isBn ? 'আপনার খামার পরিদর্শনের আবেদন জমা হয়েছে! কনফার্মেশন ইমেইল পাঠানো হবে।' : 'Farm tour request submitted! Confirmation email will be sent.');
            }
            if (onSuccess) onSuccess(res.visit);
            onClose();
          } else {
            setErrorMsg(res.message || (isBn ? 'আবেদন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'Failed to submit request.'));
          }
        } catch (err) {
          setErrorMsg(err.message || (isBn ? 'সার্ভার সংযোগ সমস্যা।' : 'Server connection error.'));
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-fadeIn">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-white/70 hover:text-white text-xl w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                ✕
              </button>
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shadow-inner">
                  🚜
                </span>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                    {isBn ? 'সরাসরি খামার পরিদর্শন' : 'In-Person Field Visit'}
                  </span>
                  <h3 className="text-xl font-black mt-1">
                    {isBn ? 'খামার পরিদর্শনের সিডিউল বুকিং' : 'Schedule Farm Tour'}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-emerald-100/90 mt-3 leading-relaxed">
                {isBn
                  ? 'আমাদের অডিটেড হাই-টেক কৃষি প্রকল্পগুলো সশরীরে ঘুরে দেখুন এবং খামারি ও কৃষি বিশেষজ্ঞদের সাথে সরাসরি পরিচিত হোন।'
                  : 'Tour our vetted commercial production facilities in person. Field agronomists will guide you across operations.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Farm Hub Picker */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {isBn ? 'কাঙ্ক্ষিত খামার নির্বাচন করুন *' : 'Choose Farm Hub Location *'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {farmOptions.map(f => (
                    <div
                      key={f.id}
                      onClick={() => setFarmLocation(f.nameEn)}
                      className={`p-3 rounded-2xl border cursor-pointer transition flex items-center gap-2.5 ${
                        farmLocation === f.nameEn
                          ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/30'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="text-xl">{f.icon}</span>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate text-[11px]">
                          {isBn ? f.nameBn : f.nameEn}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'আপনার নাম *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder={isBn ? 'যেমন: মোহাম্মদ আরিফ' : 'e.g. John Doe'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'মোবাইল / হোয়াটসঅ্যাপ নম্বর *' : 'Phone / WhatsApp *'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+880 1712-345678"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email (for dispatching confirmation/cancellation pass) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBn ? 'ইমেইল অ্যাড্রেস (কনফার্মেশন পাস পাঠানো হবে) *' : 'Email Address (For Tour Pass & Updates) *'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Date & Visitors Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'পরিদর্শনের সম্ভাব্য তারিখ *' : 'Preferred Visit Date *'}
                  </label>
                  <input
                    type="date"
                    value={visitDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setVisitDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isBn ? 'দর্শনার্থীর সংখ্যা' : 'Number of Visitors'}
                  </label>
                  <select
                    value={visitorsCount}
                    onChange={(e) => setVisitorsCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value={1}>{isBn ? '১ জন (একক)' : '1 Person (Solo)'}</option>
                    <option value={2}>{isBn ? '২ জন' : '2 Persons'}</option>
                    <option value={3}>{isBn ? '৩ জন' : '3 Persons'}</option>
                    <option value={4}>{isBn ? '৪ জন (পারিবারিক)' : '4 Persons (Family)'}</option>
                    <option value={5}>{isBn ? '৫+ জন (টিম)' : '5+ Persons (Group)'}</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isBn ? 'বিশেষ কোনো চাহিদা / নোট (ঐচ্ছিক)' : 'Special Requests or Notes (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={isBn ? 'যেমন: পরিবহন সহায়তা প্রয়োজন, অথবা সকাল ১০টায় পৌঁছাব...' : 'e.g., Arriving by private transport around 10:00 AM...'}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Notice */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-2 text-emerald-900 text-[11px]">
                <span className="text-base shrink-0">🛡️</span>
                <p className="leading-relaxed">
                  {isBn
                    ? 'আবেদন সম্পন্ন হওয়ার পর খামার কো-অর্ডিনেটর আপনার প্রদত্ত ইমেইলে খামার প্রবেশের পাস, নিরাপত্তা নির্দেশনা ও রুট ম্যাপ পাঠিয়ে নিশ্চিত করবেন।'
                    : 'Once submitted, our team reviews the schedule and sends an official confirmation tour pass with guidelines directly to your email.'}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/3 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  {isBn ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl gradient-agro text-white font-black shadow-lg shadow-emerald-950/20 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>🚜</span>
                  )}
                  <span>{isBn ? 'পরিদর্শন বুকিং নিশ্চিত করুন' : 'Confirm Tour Request'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }
