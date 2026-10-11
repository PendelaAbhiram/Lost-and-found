import React, { useState, useEffect } from 'react';
import {
  ItemReport,
  ReportFeedback,
  UserProfile,
  PageType,
} from './types';
import { INITIAL_ITEMS, INITIAL_FEEDBACKS, getRandomEmoji } from './data/initialData';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { AuthPages } from './components/AuthPages';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { FeedbackModal } from './components/FeedbackModal';
import { SolveModal } from './components/SolveModal';
import { ViewItemModal } from './components/ViewItemModal';
import { UserPasswordModal } from './components/UserPasswordModal';
import { AdminPasswordModal } from './components/AdminPasswordModal';
import { ChangeEmailModal } from './components/ChangeEmailModal';
import { Toast } from './components/Toast';
import { auth, testConnection, logOut, signInWithGoogle } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  subscribeToItems,
  subscribeToFeedbacks,
  createItemInFirestore,
  updateItemInFirestore,
  deleteItemInFirestore,
  createFeedbackInFirestore,
  syncUserProfileToFirestore,
  seedInitialItemsIfEmpty,
} from './services/firestoreService';

export default function App() {
  // Page state
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  // User state
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: 'Community Member',
    email: 'member@example.com',
    phone: '+91 98765 43210',
  });

  // Admin credentials state
  const [adminEmail, setAdminEmail] = useState<string>('abhirampendela3@gmail.com');
  const [adminPassword, setAdminPassword] = useState<string>('admin123');

  // Items and Feedbacks stored state
  const [items, setItems] = useState<ItemReport[]>(() => {
    const saved = localStorage.getItem('relief_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ITEMS;
      }
    }
    return INITIAL_ITEMS;
  });

  const [feedbacks, setFeedbacks] = useState<ReportFeedback[]>(() => {
    const saved = localStorage.getItem('relief_feedbacks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_FEEDBACKS;
      }
    }
    return INITIAL_FEEDBACKS;
  });

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Modals state
  const [selectedViewItem, setSelectedViewItem] = useState<ItemReport | null>(null);
  const [itemForSolve, setItemForSolve] = useState<ItemReport | null>(null);
  const [itemForFeedback, setItemForFeedback] = useState<ItemReport | null>(null);
  const [isUserPwModalOpen, setIsUserPwModalOpen] = useState<boolean>(false);
  const [isAdminPwModalOpen, setIsAdminPwModalOpen] = useState<boolean>(false);
  const [isChangeEmailModalOpen, setIsChangeEmailModalOpen] = useState<boolean>(false);

  // Sync to localStorage as backup cache
  useEffect(() => {
    localStorage.setItem('relief_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('relief_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  // Firebase connection test & Auth listener
  useEffect(() => {
    // 1. Connection check as required by Firestore skill
    testConnection();

    // 2. Auth state observer
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userProfile: UserProfile = {
          uid: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Community Member',
          email: fbUser.email || 'user@example.com',
          phone: fbUser.phoneNumber || '+91 98765 43210',
        };
        setCurrentUser(userProfile);
        syncUserProfileToFirestore(userProfile);

        // Seed sample database items if cloud database is fresh
        seedInitialItemsIfEmpty();
      }
    });

    // 3. Realtime Items listener from Firestore
    const unsubscribeItems = subscribeToItems(
      (remoteItems) => {
        if (remoteItems && remoteItems.length > 0) {
          setItems(remoteItems);
        }
      },
      (err) => {
        console.warn('Realtime items sync notice:', err);
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeItems();
    };
  }, []);

  // Subscribe to Feedbacks when user is authenticated
  useEffect(() => {
    if (!currentUser.uid) return;

    const unsubscribeFeedbacks = subscribeToFeedbacks(
      (remoteFeedbacks) => {
        if (remoteFeedbacks && remoteFeedbacks.length > 0) {
          setFeedbacks(remoteFeedbacks);
        }
      },
      (err) => {
        console.warn('Realtime feedback sync notice:', err);
      }
    );

    return () => {
      unsubscribeFeedbacks();
    };
  }, [currentUser.uid]);

  // Navigation handlers
  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollTo = (elementId: string) => {
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById(elementId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(elementId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Google sign-in from Navbar or anywhere
  const handleGoogleSignInPrompt = async () => {
    try {
      const result = await signInWithGoogle();
      const fbUser = result.user;
      const profile: UserProfile = {
        uid: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Community Member',
        email: fbUser.email || 'user@example.com',
        phone: fbUser.phoneNumber || '+91 98765 43210',
      };
      setCurrentUser(profile);
      await syncUserProfileToFirestore(profile);
      showToast(`Welcome, ${profile.name}!`);
      handleNavigate('user-dash');
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        showToast(err?.message || 'Google sign-in cancelled or unavailable.', 'error');
      }
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (err) {
      console.warn('Sign out notice:', err);
    }
    setCurrentUser({
      name: 'Guest User',
      email: '',
      phone: '',
    });
    handleNavigate('home');
    showToast('Signed out successfully.');
  };

  // Report Submission -> Writes to Firestore and opens Feedback Modal!
  const handleReportSubmit = async (
    reportData: Omit<ItemReport, 'id' | 'status' | 'submittedAt'>
  ) => {
    // If not signed in with Firebase, prompt Google login first
    if (!auth.currentUser && !currentUser.uid) {
      showToast('Please sign in with Google to submit reports.', 'info');
      handleNavigate('login');
      return;
    }

    const newId = items.length > 0 ? Math.max(...items.map((i) => Number(i.id) || 0)) + 1 : 1;
    const newItem: ItemReport = {
      ...reportData,
      id: newId,
      status: 'open',
      emoji: reportData.emoji || getRandomEmoji(),
      submittedAt: new Date().toISOString(),
      user: auth.currentUser?.email || currentUser.email,
      userId: auth.currentUser?.uid || currentUser.uid,
      userName: auth.currentUser?.displayName || currentUser.name,
    };

    // Optimistic UI update
    setItems((prev) => [newItem, ...prev]);

    // Firestore persistence
    try {
      await createItemInFirestore(newItem);
    } catch (err) {
      console.error('Failed to persist item report to Firestore:', err);
    }

    showToast(
      `${newItem.type === 'lost' ? 'Lost' : 'Found'} item reported! Please share your feedback below.`,
      'success'
    );

    // OPEN FEEDBACK MODAL IMMEDIATELY!
    setItemForFeedback(newItem);
    setCurrentPage('user-dash');
  };

  // Feedback Submission -> Writes to Firestore
  const handleFeedbackSubmit = async (
    feedbackData: Omit<ReportFeedback, 'id' | 'submittedAt'>
  ) => {
    const newFeedbackId =
      feedbacks.length > 0 ? Math.max(...feedbacks.map((f) => Number(f.id) || 0)) + 1 : 1;
    const newFeedback: ReportFeedback = {
      ...feedbackData,
      id: newFeedbackId,
      submittedAt: new Date().toISOString(),
      userId: auth.currentUser?.uid || currentUser.uid,
      userEmail: auth.currentUser?.email || currentUser.email,
      userName: auth.currentUser?.displayName || currentUser.name,
    };

    setFeedbacks((prev) => [newFeedback, ...prev]);

    try {
      await createFeedbackInFirestore(newFeedback);
    } catch (err) {
      console.error('Failed to persist feedback to Firestore:', err);
    }

    setItemForFeedback(null);
    showToast('Thank you for your feedback! It was saved securely to Firestore.', 'success');
  };

  // Solve item handler -> Updates Firestore
  const handleSolveConfirm = async (itemId: number, photoData: string | null) => {
    const solveDate = new Date().toISOString().split('T')[0];
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: 'solved',
              solvePhoto: photoData,
              solveDate,
            }
          : item
      )
    );

    try {
      await updateItemInFirestore(itemId, {
        status: 'solved',
        solvePhoto: photoData,
        solveDate,
      });
    } catch (err) {
      console.error('Failed to update solve state in Firestore:', err);
    }

    showToast('Item successfully marked as solved & reunited!');
  };

  // Delete item handler -> Deletes from Firestore
  const handleDeleteItem = async (itemId: number) => {
    if (window.confirm('Are you sure you want to remove this report?')) {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      try {
        await deleteItemInFirestore(itemId);
      } catch (err) {
        console.error('Failed to delete item from Firestore:', err);
      }
      showToast('Report removed from Firestore.');
    }
  };

  // Toggle feedback reviewed status (for admin)
  const handleToggleFeedbackReviewed = (feedbackId: number) => {
    setFeedbacks((prev) =>
      prev.map((f) =>
        f.id === feedbackId ? { ...f, adminReviewed: !f.adminReviewed } : f
      )
    );
    showToast('Feedback status updated.');
  };

  return (
    <div className="min-h-screen bg-[#efe9d9] text-[#1a1a17] relative">
      {/* Background grain texture */}
      <div className="grain" />

      {/* Global Toast */}
      <Toast message={toastMessage} type={toastType} />

      {/* Navbar for Home page */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onScrollTo={handleScrollTo}
        user={currentUser}
        onLogout={handleLogout}
        onGoogleSignIn={handleGoogleSignInPrompt}
      />

      {/* Page Router */}
      {currentPage === 'home' && (
        <HomePage
          items={items}
          onNavigate={handleNavigate}
          onViewItem={(item) => setSelectedViewItem(item)}
        />
      )}

      {(currentPage === 'login' ||
        currentPage === 'signup' ||
        currentPage === 'admin-login') && (
        <AuthPages
          page={currentPage}
          onNavigate={handleNavigate}
          onUserLogin={(userObj) => {
            setCurrentUser(userObj);
            syncUserProfileToFirestore(userObj);
            handleNavigate('user-dash');
          }}
          onAdminLogin={() => {
            handleNavigate('admin-dash');
          }}
          adminEmail={adminEmail}
          adminPassword={adminPassword}
          onShowToast={showToast}
        />
      )}

      {currentPage === 'user-dash' && (
        <UserDashboard
          user={currentUser}
          items={items}
          feedbacks={feedbacks}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          onSubmitReport={handleReportSubmit}
          onDeleteReport={handleDeleteItem}
          onViewItem={(item) => setSelectedViewItem(item)}
          onOpenFeedbackModal={(item) => setItemForFeedback(item)}
          onOpenPasswordModal={() => setIsUserPwModalOpen(true)}
          onUpdateProfile={(updated) => {
            setCurrentUser(updated);
            syncUserProfileToFirestore(updated);
            showToast('Profile updated successfully.');
          }}
        />
      )}

      {currentPage === 'admin-dash' && (
        <AdminDashboard
          items={items}
          feedbacks={feedbacks}
          adminEmail={adminEmail}
          onNavigate={handleNavigate}
          onLogout={() => {
            handleNavigate('home');
            showToast('Admin signed out.');
          }}
          onOpenSolveModal={(item) => setItemForSolve(item)}
          onViewItem={(item) => setSelectedViewItem(item)}
          onDeleteItem={handleDeleteItem}
          onOpenChangeEmailModal={() => setIsChangeEmailModalOpen(true)}
          onOpenAdminPasswordModal={() => setIsAdminPwModalOpen(true)}
          onToggleFeedbackReviewed={handleToggleFeedbackReviewed}
        />
      )}

      {/* ================= MODALS ================= */}
      {/* 1. Post-Report Feedback Modal */}
      <FeedbackModal
        item={itemForFeedback}
        isOpen={!!itemForFeedback}
        onClose={() => {
          setItemForFeedback(null);
          showToast('Report published! You can share feedback anytime from My Items.');
        }}
        onSubmitFeedback={handleFeedbackSubmit}
      />

      {/* 2. Solve Modal */}
      <SolveModal
        item={itemForSolve}
        isOpen={!!itemForSolve}
        onClose={() => setItemForSolve(null)}
        onConfirmSolve={handleSolveConfirm}
      />

      {/* 3. View Item Modal */}
      <ViewItemModal
        item={selectedViewItem}
        feedback={feedbacks.find((f) => f.itemId === selectedViewItem?.id)}
        isOpen={!!selectedViewItem}
        onClose={() => setSelectedViewItem(null)}
        onRequestFeedback={(item) => setItemForFeedback(item)}
        isOwner={Boolean(
          selectedViewItem?.user.toLowerCase() === currentUser.email?.toLowerCase() ||
          (selectedViewItem?.userId && selectedViewItem.userId === currentUser.uid)
        )}
      />

      {/* 4. User Password OTP Modal */}
      <UserPasswordModal
        isOpen={isUserPwModalOpen}
        userEmail={currentUser.email}
        onClose={() => setIsUserPwModalOpen(false)}
        onSuccess={() => {
          showToast('User password updated successfully.');
        }}
      />

      {/* 5. Admin Password OTP Modal */}
      <AdminPasswordModal
        isOpen={isAdminPwModalOpen}
        adminEmail={adminEmail}
        onClose={() => setIsAdminPwModalOpen(false)}
        onSuccess={(newPw) => {
          setAdminPassword(newPw);
          showToast('Admin password updated successfully.');
        }}
      />

      {/* 6. Admin Email Change OTP Modal */}
      <ChangeEmailModal
        isOpen={isChangeEmailModalOpen}
        currentEmail={adminEmail}
        onClose={() => setIsChangeEmailModalOpen(false)}
        onSuccess={(newEm) => {
          setAdminEmail(newEm);
          showToast(`Admin email updated to ${newEm}.`);
        }}
      />
    </div>
  );
}
