import { ItemReport, ReportFeedback } from '../types';

export const ITEM_EMOJIS = ['🎒', '🔑', '👓', '☂️', '📱', '💍', '🧣', '👜', '🎧', '📚', '💻', '⌚', '🎮', '📷', '🪪', '🧮', '💧'];

export function getRandomEmoji(): string {
  return ITEM_EMOJIS[Math.floor(Math.random() * ITEM_EMOJIS.length)];
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff > 1 && diff < 7) return `${diff} days ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateString;
  }
}

export const INITIAL_ITEMS: ItemReport[] = [
  {
    id: 1,
    type: 'lost',
    name: 'Scientific Calculator (Casio fx-991EX)',
    desc: 'Black Casio scientific calculator with a small barcode sticker on the back casing.',
    location: 'Room 204, Science Block',
    date: new Date().toISOString().split('T')[0],
    phone: '+91 98765 43210',
    emoji: '🧮',
    status: 'open',
    user: 'arjun@example.com',
    userName: 'Arjun Kumar',
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    type: 'lost',
    name: 'Student ID Card',
    desc: 'University student identification card with navy blue lanyard, Department of Computer Science.',
    location: 'Central Library, 2nd Floor',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    phone: '+91 98123 45678',
    emoji: '🪪',
    status: 'open',
    user: 'priya.sharma@example.com',
    userName: 'Priya Sharma',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    type: 'found',
    name: 'Insulated Water Bottle',
    desc: 'Olive green stainless steel hydro flask bottle with slight dent near base.',
    location: 'Cafeteria table 12',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    phone: '+91 98450 11223',
    emoji: '💧',
    status: 'solved',
    user: 'rahul.v@example.com',
    userName: 'Rahul Verma',
    solveDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 4,
    type: 'lost',
    name: 'Apple AirPods Pro 2',
    desc: 'AirPods in a matte brown silicone protective sleeve, left earbud has low battery.',
    location: 'Gym locker area',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    phone: '+91 97788 99001',
    emoji: '🎧',
    status: 'open',
    user: 'arjun@example.com',
    userName: 'Arjun Kumar',
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 5,
    type: 'lost',
    name: 'Navy Backpack with Laptop',
    desc: 'Navy blue canvas daypack with Dell 14-inch charger, notebooks, and blue umbrella inside.',
    location: 'City Transit Hub, Platform 2',
    date: new Date().toISOString().split('T')[0],
    phone: '+91 96543 21098',
    emoji: '🎒',
    status: 'open',
    user: 'siddharth@example.com',
    userName: 'Siddharth M.',
    submittedAt: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: 6,
    type: 'found',
    name: 'Prescription Glasses (Tortoiseshell)',
    desc: 'Round tortoiseshell frame reading glasses found on window counter in a black hardcase.',
    location: 'Cedar Ave Coffee House',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    phone: '+91 94321 87654',
    emoji: '👓',
    status: 'open',
    user: 'anita.deshmukh@example.com',
    userName: 'Anita Deshmukh',
    submittedAt: new Date(Date.now() - 90000000).toISOString(),
  },
  {
    id: 7,
    type: 'found',
    name: 'Silver Hoop Earring',
    desc: 'Single fine sterling silver engraved hoop earring picked up near organic fruit stall.',
    location: 'Riverside Farmers Market',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    phone: '+91 91234 56789',
    emoji: '💍',
    status: 'solved',
    user: 'kavita.r@example.com',
    userName: 'Kavita Roy',
    solveDate: new Date(Date.now() - 43200000).toISOString().split('T')[0],
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 8,
    type: 'lost',
    name: 'Blue Windproof Umbrella',
    desc: 'Navy blue compact automatic umbrella with carved light wood handle.',
    location: 'Oakview Library entrance stand',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    phone: '+91 95555 44433',
    emoji: '☂️',
    status: 'open',
    user: 'vikram.singh@example.com',
    userName: 'Vikram Singh',
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
  }
];

export const INITIAL_FEEDBACKS: ReportFeedback[] = [
  {
    id: 1,
    itemId: 1,
    itemName: 'Scientific Calculator (Casio fx-991EX)',
    itemType: 'lost',
    userEmail: 'arjun@example.com',
    userName: 'Arjun Kumar',
    rating: 5,
    tags: ['Quick process', 'Easy to report', 'Clear questions'],
    comment: 'The form took less than 45 seconds to submit. Really appreciated having simple location and date fields!',
    recommendation: 'definitely',
    submittedAt: new Date(Date.now() - 3500000).toISOString(),
    adminReviewed: true,
  },
  {
    id: 2,
    itemId: 3,
    itemName: 'Insulated Water Bottle',
    itemType: 'found',
    userEmail: 'rahul.v@example.com',
    userName: 'Rahul Verma',
    rating: 5,
    tags: ['Smooth photo upload', 'Clear instructions'],
    comment: 'Great initiative. Uploading the found photo was effortless and the owner messaged me within 6 hours.',
    recommendation: 'definitely',
    submittedAt: new Date(Date.now() - 170000000).toISOString(),
    adminReviewed: true,
  },
  {
    id: 3,
    itemId: 5,
    itemName: 'Navy Backpack with Laptop',
    itemType: 'lost',
    userEmail: 'siddharth@example.com',
    userName: 'Siddharth M.',
    rating: 4,
    tags: ['Quick process', 'Helpful categories'],
    comment: 'Good interface. Would be even better if we could pin exact spots on an interactive campus map.',
    recommendation: 'definitely',
    submittedAt: new Date(Date.now() - 17000000).toISOString(),
    adminReviewed: false,
  },
  {
    id: 4,
    itemId: 7,
    itemName: 'Silver Hoop Earring',
    itemType: 'found',
    userEmail: 'kavita.r@example.com',
    userName: 'Kavita Roy',
    rating: 5,
    tags: ['Easy to report', 'Smooth photo upload', 'Clear questions'],
    comment: 'Loved how simple it was to post something I found without having to create a long profile.',
    recommendation: 'definitely',
    submittedAt: new Date(Date.now() - 171000000).toISOString(),
    adminReviewed: true,
  }
];
