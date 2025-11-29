export interface StatItem {
  label: string;
  value: number;
  subValue?: string;
  trend?: string;
  color?: string;
}

export interface RecentSpace {
  id: number;
  name: string;
  type: string;
  rating: number;
  location: string;
  status: 'active' | 'pending';
  reviews: number;
}

export interface RecentMessage {
  id: number;
  user: string;
  subject: string;
  time: string;
  unread: boolean;
}

export interface RecentActivity {
  id: number;
  action: string;
  item: string;
  time: string;
}