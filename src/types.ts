export type ItemType = 'lost' | 'found';
export type ItemStatus = 'open' | 'solved';

export interface ItemReport {
  id: number;
  type: ItemType;
  name: string;
  desc: string;
  location: string;
  date: string;
  phone: string;
  emoji: string;
  status: ItemStatus;
  user: string; // user email
  userId?: string;
  userName?: string;
  imageData?: string | null;
  solvePhoto?: string | null;
  solveDate?: string | null;
  submittedAt: string;
}

export type RecommendationOption = 'definitely' | 'maybe' | 'not_likely' | '';

export interface ReportFeedback {
  id: number;
  itemId: number;
  itemName: string;
  itemType: ItemType;
  userId?: string;
  userEmail: string;
  userName: string;
  rating: number; // 1 to 5
  tags: string[];
  comment: string;
  recommendation: RecommendationOption;
  submittedAt: string;
  adminReviewed?: boolean;
}

export interface UserProfile {
  uid?: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export type PageType = 'home' | 'login' | 'signup' | 'admin-login' | 'user-dash' | 'admin-dash';

export type UserTabType =
  | 'overview'
  | 'report-lost'
  | 'report-found'
  | 'my-items'
  | 'browse'
  | 'profile';

export type AdminTabType =
  | 'overview'
  | 'unsolved'
  | 'solved'
  | 'feedbacks'
  | 'all-items'
  | 'settings';
