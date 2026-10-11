import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { ItemReport, ReportFeedback, UserProfile } from '../types';
import { INITIAL_ITEMS } from '../data/initialData';

const ITEMS_COLLECTION = 'items';
const FEEDBACKS_COLLECTION = 'feedbacks';
const USERS_COLLECTION = 'users';

function getItemDocId(id: number | string): string {
  return `item_${id}`;
}

function getFeedbackDocId(id: number | string): string {
  return `fb_${id}`;
}

/**
 * Seed initial sample items if the database has zero items and a user is signed in.
 */
export async function seedInitialItemsIfEmpty(): Promise<void> {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  try {
    const snap = await getDocs(collection(db, ITEMS_COLLECTION));
    if (snap.empty) {
      console.log('Database items collection empty. Seeding initial items...');
      for (const item of INITIAL_ITEMS) {
        const docId = getItemDocId(item.id);
        const payload: Record<string, any> = {
          id: String(item.id),
          type: item.type,
          name: item.name,
          desc: item.desc,
          location: item.location,
          date: item.date,
          status: item.status,
          user: currentUser.email || item.user,
          userId: currentUser.uid,
          submittedAt: item.submittedAt || new Date().toISOString(),
        };
        if (item.phone) payload.phone = item.phone;
        if (item.emoji) payload.emoji = item.emoji;
        if (item.userName) payload.userName = item.userName;
        if (item.imageData) payload.imageData = item.imageData;
        if (item.solvePhoto) payload.solvePhoto = item.solvePhoto;
        if (item.solveDate) payload.solveDate = item.solveDate;

        await setDoc(doc(db, ITEMS_COLLECTION, docId), payload);
      }
    }
  } catch (error) {
    console.warn('Initial seeding note (non-fatal):', error);
  }
}

/**
 * Real-time listener for all lost & found items in Firestore.
 */
export function subscribeToItems(
  onData: (items: ItemReport[]) => void,
  onError?: (error: unknown) => void
): () => void {
  const colRef = collection(db, ITEMS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: ItemReport[] = snapshot.docs.map((d) => {
        const raw = d.data();
        const numericId = Number(raw.id);
        return {
          id: isNaN(numericId) ? raw.id : numericId,
          type: raw.type,
          name: raw.name,
          desc: raw.desc,
          location: raw.location,
          date: raw.date,
          phone: raw.phone || '',
          emoji: raw.emoji || '📦',
          status: raw.status || 'open',
          user: raw.user,
          userId: raw.userId,
          userName: raw.userName,
          imageData: raw.imageData || null,
          solvePhoto: raw.solvePhoto || null,
          solveDate: raw.solveDate || null,
          submittedAt: raw.submittedAt,
        } as ItemReport;
      });

      // Sort with newest first
      items.sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, ITEMS_COLLECTION);
    }
  );
}

/**
 * Real-time listener for user feedbacks in Firestore.
 */
export function subscribeToFeedbacks(
  onData: (feedbacks: ReportFeedback[]) => void,
  onError?: (error: unknown) => void
): () => void {
  const colRef = collection(db, FEEDBACKS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const feedbacks: ReportFeedback[] = snapshot.docs.map((d) => {
        const raw = d.data();
        const numericId = Number(raw.id);
        const numericItemId = Number(raw.itemId);
        return {
          id: isNaN(numericId) ? raw.id : numericId,
          itemId: isNaN(numericItemId) ? raw.itemId : numericItemId,
          itemName: raw.itemName,
          itemType: raw.itemType,
          userId: raw.userId,
          userEmail: raw.userEmail,
          userName: raw.userName || 'Community Member',
          rating: raw.rating,
          tags: raw.tags || [],
          comment: raw.comment || '',
          recommendation: raw.recommendation || '',
          submittedAt: raw.submittedAt,
          adminReviewed: raw.adminReviewed ?? false,
        } as ReportFeedback;
      });

      feedbacks.sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      onData(feedbacks);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, FEEDBACKS_COLLECTION);
    }
  );
}

/**
 * Create a new item report in Firestore.
 */
export async function createItemInFirestore(
  reportData: Omit<ItemReport, 'submittedAt'>
): Promise<ItemReport> {
  const currentUser = auth.currentUser;
  const docId = getItemDocId(reportData.id);
  const submittedAt = new Date().toISOString();

  const payload: Record<string, any> = {
    id: String(reportData.id),
    type: reportData.type,
    name: reportData.name,
    desc: reportData.desc,
    location: reportData.location,
    date: reportData.date,
    status: 'open',
    user: currentUser?.email || reportData.user,
    userId: currentUser?.uid || 'community_user',
    submittedAt,
  };

  if (reportData.userName) payload.userName = reportData.userName;
  if (reportData.phone) payload.phone = reportData.phone;
  if (reportData.emoji) payload.emoji = reportData.emoji;
  if (reportData.imageData) payload.imageData = reportData.imageData;
  if (reportData.solvePhoto) payload.solvePhoto = reportData.solvePhoto;
  if (reportData.solveDate) payload.solveDate = reportData.solveDate;

  try {
    await setDoc(doc(db, ITEMS_COLLECTION, docId), payload);
    return {
      ...reportData,
      status: 'open',
      submittedAt,
      userId: payload.userId,
      user: payload.user,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${ITEMS_COLLECTION}/${docId}`);
  }
}

/**
 * Update an existing item report in Firestore (e.g. solve, update contact).
 */
export async function updateItemInFirestore(
  itemId: number | string,
  updates: Partial<ItemReport>
): Promise<void> {
  const docId = getItemDocId(itemId);
  const updatePayload: Record<string, any> = {};

  if (updates.status !== undefined) updatePayload.status = updates.status;
  if (updates.name !== undefined) updatePayload.name = updates.name;
  if (updates.desc !== undefined) updatePayload.desc = updates.desc;
  if (updates.location !== undefined) updatePayload.location = updates.location;
  if (updates.date !== undefined) updatePayload.date = updates.date;
  if (updates.phone !== undefined) updatePayload.phone = updates.phone;
  if (updates.emoji !== undefined) updatePayload.emoji = updates.emoji;
  if (updates.solvePhoto !== undefined) updatePayload.solvePhoto = updates.solvePhoto;
  if (updates.solveDate !== undefined) updatePayload.solveDate = updates.solveDate;
  if (updates.imageData !== undefined) updatePayload.imageData = updates.imageData;

  try {
    await updateDoc(doc(db, ITEMS_COLLECTION, docId), updatePayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ITEMS_COLLECTION}/${docId}`);
  }
}

/**
 * Delete an item report in Firestore.
 */
export async function deleteItemInFirestore(itemId: number | string): Promise<void> {
  const docId = getItemDocId(itemId);
  try {
    await deleteDoc(doc(db, ITEMS_COLLECTION, docId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${ITEMS_COLLECTION}/${docId}`);
  }
}

/**
 * Submit report feedback to Firestore.
 */
export async function createFeedbackInFirestore(
  feedbackData: Omit<ReportFeedback, 'submittedAt'>
): Promise<ReportFeedback> {
  const currentUser = auth.currentUser;
  const docId = getFeedbackDocId(feedbackData.id);
  const submittedAt = new Date().toISOString();

  const payload: Record<string, any> = {
    id: String(feedbackData.id),
    itemId: String(feedbackData.itemId),
    itemName: feedbackData.itemName,
    itemType: feedbackData.itemType,
    userId: currentUser?.uid || feedbackData.userId || 'community_user',
    userEmail: currentUser?.email || feedbackData.userEmail,
    rating: Number(feedbackData.rating),
    submittedAt,
  };

  if (feedbackData.userName) payload.userName = feedbackData.userName;
  if (feedbackData.tags && feedbackData.tags.length > 0) payload.tags = feedbackData.tags;
  if (feedbackData.comment) payload.comment = feedbackData.comment;
  if (feedbackData.recommendation) payload.recommendation = feedbackData.recommendation;
  if (feedbackData.adminReviewed !== undefined) payload.adminReviewed = feedbackData.adminReviewed;

  try {
    await setDoc(doc(db, FEEDBACKS_COLLECTION, docId), payload);
    return {
      ...feedbackData,
      submittedAt,
      userId: payload.userId,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${FEEDBACKS_COLLECTION}/${docId}`);
  }
}

/**
 * Sync user profile to Firestore `/users/{uid}`.
 */
export async function syncUserProfileToFirestore(profile: UserProfile): Promise<void> {
  if (!profile.uid) return;
  const docId = profile.uid;
  const payload: Record<string, any> = {
    uid: profile.uid,
    email: profile.email,
  };
  if (profile.name) payload.name = profile.name;
  if (profile.phone) payload.phone = profile.phone;

  try {
    await setDoc(doc(db, USERS_COLLECTION, docId), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${USERS_COLLECTION}/${docId}`);
  }
}
