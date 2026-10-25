    // ==============================================================================
    // 04_PROFILE_KYC.JSX
    // Investor Profile, Document Upload Center (NID Front/Back, TIN, Bank, Nominee)
    // ==============================================================================

    function ProfileView({ lang = 'bn', user, notifications = [], onUserUpdate, showToast }) {
      const isBn = lang === 'bn';
      const [activeTab, setActiveTab] = React.useState('kyc');
      const [submitting, setSubmitting] = React.useState(false);

      // KYC Form State initialized from user profile
      const [nidNumber, setNidNumber] = React.useState(user?.nid || '');
      const [nidFrontPreview, setNidFrontPreview] = React.useState(user?.nidFront || '');
      const [nidBackPreview, setNidBackPreview] = React.useState(user?.nidBack || '');
      const [tinNumber, setTinNumber] = React.useState(user?.tin || '');
      const [tinPreview, setTinPreview] = React.useState('');

      // Nominee State
      const [nomineeName, setNomineeName] = React.useState(user?.nominee?.name || '');
      const [nomineeRelation, setNomineeRelation] = React.useState(user?.nominee?.relation || (isBn ? 'স্ত্রী / স্বামী' : 'Spouse'));
      const [nomineePhone, setNomineePhone] = React.useState(user?.nominee?.phone || '');
      const [nomineeNid, setNomineeNid] = React.useState(user?.nominee?.nid || '');

      // Bank Payout State
      const [bankName, setBankName] = React.useState(user?.bankDetails?.bankName || 'Dutch Bangla Bank Ltd.');
      const [branchName, setBranchName] = React.useState(user?.bankDetails?.branch || '');
      const [accountName, setAccountName] = React.useState(user?.bankDetails?.accountName || user?.name || '');
      const [accountNumber, setAccountNumber] = React.useState(user?.bankDetails?.accountNo || '');
      const [routingNumber, setRoutingNumber] = React.useState(user?.bankDetails?.routingNo || '');
      const [bkashNumber, setBkashNumber] = React.useState(user?.bankDetails?.bkashNo || user?.phone || '');

      // Personal Settings & Password State
      const [profileName, setProfileName] = React.useState(user?.name || '');
      const [profilePhone, setProfilePhone] = React.useState(user?.phone || '');
      const [currentPassword, setCurrentPassword] = React.useState('');
      const [newPassword, setNewPassword] = React.useState('');
      const [confirmPassword, setConfirmPassword] = React.useState('');
      const [settingsSubmitting, setSettingsSubmitting] = React.useState(false);
      const [passwordSubmitting, setPasswordSubmitting] = React.useState(false);

      const handleUpdatePersonalInfo = async (e) => {
        e.preventDefault();
        if (!profileName.trim()) {
          showToast(isBn ? 'অনুগ্রহ করে আপনার পুরো নাম লিখুন।' : 'Please enter your full name.', 'error');
          return;
        }
        setSettingsSubmitting(true);
        try {
          const token = localStorage.getItem('agro_token');
          const res = await apiCall('/api/auth/profile', 'PUT', {
            name: profileName.trim(),
            phone: profilePhone.trim()
          }, token);
          if (res.success) {
            showToast(isBn ? 'ব্যক্তিগত তথ্য সফলভাবে আপডেট হয়েছে!' : 'Personal profile information updated successfully!');
            if (onUserUpdate) onUserUpdate();
          } else {
            showToast(res.message || (isBn ? 'তথ্য আপডেট করতে ব্যর্থ।' : 'Failed to update personal profile.'), 'error');
          }
        } catch (err) {
          showToast(err.message || (isBn ? 'নেটওয়ার্ক ত্রুটি।' : 'Network error updating profile.'), 'error');
        } finally {
          setSettingsSubmitting(false);
        }
      };

      const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (!currentPassword) {
          showToast(isBn ? 'বর্তমান পাসওয়ার্ড লিখুন।' : 'Please enter your current password.', 'error');
          return;
        }
        if (newPassword.length < 6) {
          showToast(isBn ? 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'New password must be at least 6 characters.', 'error');
          return;
        }
        if (newPassword !== confirmPassword) {
          showToast(isBn ? 'নতুন পাসওয়ার্ড দুটি মিলছে না।' : 'New passwords do not match.', 'error');
          return;
        }
        setPasswordSubmitting(true);
        try {
          const token = localStorage.getItem('agro_token');
          const res = await apiCall('/api/auth/profile', 'PUT', {
            currentPassword,
            newPassword
          }, token);
          if (res.success) {
            showToast(isBn ? 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!' : 'Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
          } else {
            showToast(res.message || (isBn ? 'পাসওয়ার্ড পরিবর্তন ব্যর্থ।' : 'Failed to change password.'), 'error');
          }
        } catch (err) {
          showToast(err.message || 'Error updating password.', 'error');
        } finally {
          setPasswordSubmitting(false);
        }
      };

      const handleFileUpload = (e, targetSetter) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
          showToast(isBn ? 'ফাইলের আকার ৫ এমবি এর কম হতে হবে।' : 'File size must be under 5MB.', 'error');
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          targetSetter(reader.result);
          showToast(isBn ? 'নথি সফলভাবে লোড হয়েছে!' : 'Document preview loaded successfully!');
        };
        reader.readAsDataURL(file);
      };

      const handleSubmitKyc = async (e) => {
        e.preventDefault();
        if (!nidNumber.trim()) {
          showToast(isBn ? 'অনুগ্রহ করে জাতীয় পরিচয়পত্র (NID) নম্বর দিন।' : 'National ID number is mandatory.', 'error');
          return;
        }
        setSubmitting(true);
        try {
          const token = localStorage.getItem('agro_token');
          const res = await apiCall('/api/auth/kyc', 'POST', {
            nid: nidNumber.trim(),
            nidFront: nidFrontPreview,
            nidBack: nidBackPreview,
            tin: tinNumber.trim()
          }, token);
          if (res.success) {
            showToast(isBn ? 'কেওয়াইসি নথি পর্যালোচনার জন্য জমা হয়েছে!' : 'KYC documents submitted for compliance review!');
            if (onUserUpdate) onUserUpdate();
          } else {
            showToast(res.message || (isBn ? 'নথি জমা ব্যর্থ হয়েছে।' : 'KYC submission failed.'), 'error');
          }
        } catch (err) {
          showToast(err.message || 'Error submitting KYC.', 'error');
        } finally {
          setSubmitting(false);
        }
      };

      const handleSaveNominee = async (e) => {
        e.preventDefault();
        if (!nomineeName.trim() || !nomineePhone.trim()) {
          showToast(isBn ? 'নমিনির নাম ও মোবাইল নম্বর পূরণ করুন।' : 'Nominee name and phone number are required.', 'error');
          return;
        }
        setSubmitting(true);
        try {
          const token = localStorage.getItem('agro_token');
          const res = await apiCall('/api/auth/profile', 'PUT', {
            nominee: {
              name: nomineeName.trim(),
              relation: nomineeRelation,
              phone: nomineePhone.trim(),
              nid: nomineeNid.trim()
            }
          }, token);
          if (res.success) {
            showToast(isBn ? 'নমিনির তথ্য সফলভাবে সংরক্ষিত হয়েছে!' : 'Nominee declaration saved successfully!');
            if (onUserUpdate) onUserUpdate();
          } else {
            showToast(res.message || 'Failed to save nominee details.', 'error');
          }
        } catch (err) {
          showToast(err.message || 'Error saving nominee.', 'error');
        } finally {
          setSubmitting(false);
        }
      };

      const handleSaveBank = async (e) => {
        e.preventDefault();
        if (!accountNumber.trim()) {
          showToast(isBn ? 'অনুগ্রহ করে ব্যাংক অ্যাকাউন্ট বা বিকাশ নম্বর দিন।' : 'Please enter bank account number.', 'error');
          return;
        }
        setSubmitting(true);
        try {
          const token = localStorage.getItem('agro_token');
          const res = await apiCall('/api/auth/profile', 'PUT', {
            bankDetails: {
              bankName,
              branch: branchName.trim(),
              accountName: accountName.trim(),
              accountNo: accountNumber.trim(),
              routingNo: routingNumber.trim(),
              bkashNo: bkashNumber.trim()
            }
          }, token);
          if (res.success) {
            showToast(isBn ? 'পেআউট ব্যাংক ও বিকাশ তথ্য সংরক্ষিত হয়েছে!' : 'Payout details saved successfully!');
            if (onUserUpdate) onUserUpdate();
          } else {
            showToast(res.message || 'Failed to save payout bank details.', 'error');
          }
        } catch (err) {
          showToast(err.message || 'Error saving bank.', 'error');
        } finally {
          setSubmitting(false);
        }
      };

      return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
          
          {/* PROFILE DOSSIER HEADER */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl gradient-agro text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-950/20">
                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900">{user.name}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    user.kycStatus === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {user.kycStatus === 'verified' ? (isBn ? '✓ ভেরিফাইড বিনিয়োগকারী' : '✓ Verified Investor') : (isBn ? '⏳ কেওয়াইসি অপেক্ষমাণ' : '⏳ KYC Pending')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email} • {user.phone || (isBn ? 'ফোন নম্বর যুক্ত নেই' : 'No phone linked')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                ID: <span className="font-mono text-slate-800">{user._id || user.id}</span>
              </span>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs">
            {[
              { id: 'kyc', icon: '🪪', labelBn: 'জাতীয় পরিচয়পত্র ও কেওয়াইসি', labelEn: 'National ID & KYC' },
              { id: 'bank', icon: '🏦', labelBn: 'ব্যাংক ও পেআউট একাউন্ট', labelEn: 'Bank & Payout Accounts' },
              { id: 'nominee', icon: '👨‍👩‍👧', labelBn: 'নমিনি ও উত্তরাধিকারী', labelEn: 'Nominee Declaration' },
              { id: 'security', icon: '🔒', labelBn: 'ব্যক্তিগত তথ্য ও পাসওয়ার্ড', labelEn: 'Profile & Security' },
              { id: 'notifs', icon: '🔔', labelBn: 'নোটিফিকেশন ও বার্তা', labelEn: 'Notifications' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'gradient-agro text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{isBn ? tab.labelBn : tab.labelEn}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: KYC VERIFICATION */}
          {activeTab === 'kyc' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-black text-slate-900 text-lg">{isBn ? 'জাতীয় পরিচয়পত্র (NID) ও কর সনাক্তকরণ (TIN)' : 'National Identity & TIN Verification'}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBn 
                    ? 'বাংলাদেশ সরকারের নিয়ম অনুযায়ী বৈধ বিনিয়োগের জন্য আপনার এনআইডি ও প্রযোজ্য ক্ষেত্রে টিন নম্বর যাচাই করা হয়।'
                    : 'Mandatory verification to unlock high-value agricultural syndicate investments.'}
                </p>
              </div>

              <form onSubmit={handleSubmitKyc} className="space-y-6 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'জাতীয় পরিচয়পত্র (NID) নম্বর *' : 'National ID (NID) Number *'}</label>
                    <input
                      type="text"
                      placeholder="e.g. 19902692015000123"
                      value={nidNumber}
                      onChange={(e) => setNidNumber(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ই-টিন (TIN) নম্বর (ঐচ্ছিক)' : 'e-TIN Number (Optional)'}</label>
                    <input
                      type="text"
                      placeholder="e.g. 123456789012"
                      value={tinNumber}
                      onChange={(e) => setTinNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* NID FRONT & BACK UPLOAD */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                  <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-500 transition text-center space-y-3">
                    <span className="text-3xl block">🪪</span>
                    <div>
                      <div className="font-bold text-slate-800">{isBn ? 'এনআইডি সামনের অংশ (Front Page)' : 'NID Card Front Page'}</div>
                      <span className="text-[10px] text-slate-400">JPG, PNG, PDF (Max 5MB)</span>
                    </div>
                    {nidFrontPreview && (
                      <div className="h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={nidFrontPreview} alt="NID Front" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="inline-block px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer">
                      {isBn ? 'ছবি নির্বাচন করুন' : 'Select Photo'}
                      <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, setNidFrontPreview)} className="hidden" />
                    </label>
                  </div>

                  <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-emerald-500 transition text-center space-y-3">
                    <span className="text-3xl block">🪪</span>
                    <div>
                      <div className="font-bold text-slate-800">{isBn ? 'এনআইডি পেছনের অংশ (Back Page)' : 'NID Card Back Page'}</div>
                      <span className="text-[10px] text-slate-400">JPG, PNG, PDF (Max 5MB)</span>
                    </div>
                    {nidBackPreview && (
                      <div className="h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={nidBackPreview} alt="NID Back" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="inline-block px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer">
                      {isBn ? 'ছবি নির্বাচন করুন' : 'Select Photo'}
                      <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, setNidBackPreview)} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl gradient-agro text-white font-bold text-xs shadow hover:brightness-110 disabled:opacity-50 transition"
                  >
                    {submitting ? (isBn ? 'জমা হচ্ছে...' : 'Submitting...') : (isBn ? 'কেওয়াইসি নথি জমা দিন' : 'Submit for Compliance Review')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: BANK & PAYOUT DETAILS */}
          {activeTab === 'bank' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-black text-slate-900 text-lg">{isBn ? 'ব্যাংক ও মোবাইল ব্যাংকিং পেআউট চ্যানেল' : 'Bank & Mobile Banking Payout Channels'}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBn 
                    ? 'আপনার অর্জিত লভ্যাংশ এবং বিনিয়োগকৃত মূলধন ফেরত নেওয়ার ব্যাংক অ্যাকাউন্ট বা বিকাশ নম্বর দিন।'
                    : 'Designate your verified commercial bank or mobile wallet for automatic harvest return settlements.'}
                </p>
              </div>

              <form onSubmit={handleSaveBank} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'ব্যাংকের নাম *' : 'Bank Name *'}</label>
                    <input
                      type="text"
                      placeholder="e.g. Dutch Bangla Bank Ltd. / City Bank"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'শাখা (Branch Name)' : 'Branch Name'}</label>
                    <input
                      type="text"
                      placeholder="e.g. Gulshan Branch, Dhaka"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'হিসাবধারীর নাম (Account Title) *' : 'Account Title *'}</label>
                    <input
                      type="text"
                      placeholder="Name as per Bank Record"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'অ্যাকাউন্ট নম্বর *' : 'Account Number *'}</label>
                    <input
                      type="text"
                      placeholder="e.g. 115.120.985678"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'রাউটিং নম্বর (Routing Number)' : 'Routing Number'}</label>
                    <input
                      type="text"
                      placeholder="9-digit Routing Code"
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'বিকাশ / নগদ নম্বর (বিকল্প পেআউট)' : 'bKash / Nagad Wallet No'}</label>
                    <input
                      type="text"
                      placeholder="01712345678"
                      value={bkashNumber}
                      onChange={(e) => setBkashNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl gradient-agro text-white font-bold text-xs shadow hover:brightness-110 disabled:opacity-50 transition"
                  >
                    {submitting ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'পেআউট তথ্য সংরক্ষণ করুন' : 'Save Payout Details')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: NOMINEE */}
          {activeTab === 'nominee' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-black text-slate-900 text-lg">{isBn ? 'নমিনি ও উত্তরাধিকারী ঘোষণা' : 'Nominee & Beneficiary Declaration'}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isBn 
                    ? 'বিনিয়োগকারীর অবর্তমানে বিনিয়োগের মুনাফা ও মূলধনের বৈধ দাবিদার হিসেবে নমিনির তথ্য আবশ্যক।'
                    : 'Legal declaration designating your primary beneficiary in accordance with Bangladeshi securities law.'}
                </p>
              </div>

              <form onSubmit={handleSaveNominee} className="space-y-5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'নমিনির পুরো নাম *' : 'Nominee Full Name *'}</label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={nomineeName}
                      onChange={(e) => setNomineeName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'সম্পর্ক (Relationship) *' : 'Relationship *'}</label>
                    <select
                      value={nomineeRelation}
                      onChange={(e) => setNomineeRelation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white font-medium"
                    >
                      <option value="Spouse">{isBn ? 'স্ত্রী / স্বামী (Spouse)' : 'Spouse'}</option>
                      <option value="Father">{isBn ? 'পিতা (Father)' : 'Father'}</option>
                      <option value="Mother">{isBn ? 'মাতা (Mother)' : 'Mother'}</option>
                      <option value="Son">{isBn ? 'পুত্র (Son)' : 'Son'}</option>
                      <option value="Daughter">{isBn ? 'কন্যা (Daughter)' : 'Daughter'}</option>
                      <option value="Brother">{isBn ? 'ভাই (Brother)' : 'Brother'}</option>
                      <option value="Sister">{isBn ? 'বোন (Sister)' : 'Sister'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'নমিনির মোবাইল নম্বর *' : 'Nominee Phone *'}</label>
                    <input
                      type="text"
                      placeholder="017XXXXXXXX"
                      value={nomineePhone}
                      onChange={(e) => setNomineePhone(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{isBn ? 'নমিনির এনআইডি নম্বর (ঐচ্ছিক)' : 'Nominee NID (Optional)'}</label>
                    <input
                      type="text"
                      placeholder="NID Number"
                      value={nomineeNid}
                      onChange={(e) => setNomineeNid(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl gradient-agro text-white font-bold text-xs shadow hover:brightness-110 disabled:opacity-50 transition"
                  >
                    {submitting ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'নমিনির তথ্য সংরক্ষণ করুন' : 'Save Nominee Declaration')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: PERSONAL PROFILE & PASSWORD */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-black text-slate-900 text-lg">{isBn ? 'ব্যক্তিগত তথ্য আপডেট' : 'Personal Information'}</h3>
                </div>

                <form onSubmit={handleUpdatePersonalInfo} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">{isBn ? 'আপনার পুরো নাম *' : 'Full Name *'}</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">{isBn ? 'মোবাইল নম্বর' : 'Phone Number'}</label>
                      <input
                        type="text"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={settingsSubmitting}
                      className="px-6 py-2.5 rounded-xl gradient-agro text-white font-bold text-xs shadow hover:brightness-110 disabled:opacity-50 transition"
                    >
                      {settingsSubmitting ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'তথ্য আপডেট করুন' : 'Update Profile')}
                    </button>
                  </div>
                </form>
              </div>

              {/* Password Change */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="font-black text-slate-900 text-lg">{isBn ? 'পাসওয়ার্ড পরিবর্তন' : 'Change Password'}</h3>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">{isBn ? 'বর্তমান পাসওয়ার্ড *' : 'Current Password *'}</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">{isBn ? 'নতুন পাসওয়ার্ড *' : 'New Password *'}</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">{isBn ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন *' : 'Confirm New Password *'}</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={passwordSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow disabled:opacity-50 transition"
                    >
                      {passwordSubmitting ? (isBn ? 'আপডেট হচ্ছে...' : 'Updating...') : (isBn ? 'পাসওয়ার্ড সংরক্ষণ করুন' : 'Change Password')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeTab === 'notifs' && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="font-black text-slate-900 text-lg">{isBn ? 'সকল নোটিফিকেশন ও অ্যালার্ট' : 'Platform Notifications & Alerts'}</h3>

              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">{isBn ? 'কোনো নতুন নোটিফিকেশন নেই।' : 'No notifications found.'}</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notifications.map(n => (
                    <div key={n._id || n.id} className="py-4 flex items-start gap-3">
                      <span className="text-xl">
                        {n.icon === 'money' ? '💰' : n.icon === 'check' ? '✓' : n.icon === 'verify' ? '🪪' : '📢'}
                      </span>
                      <div className="space-y-1">
                        <div className="font-black text-slate-900 text-xs">{n.title}</div>
                        <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-slate-400 font-mono block">{n.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      );
    }
