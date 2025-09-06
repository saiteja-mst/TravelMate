export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  last_login: string;
  is_active: boolean;
  preferences: Record<string, any>;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_token?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  expires_at?: string;
  is_active: boolean;
}

export interface TravelPreferences {
  id: string;
  user_id: string;
  budget_range?: string;
  preferred_destinations?: string[];
  travel_style?: string;
  accommodation_type?: string;
  transportation_mode?: string;
  dietary_restrictions?: string[];
  accessibility_needs?: string[];
  language_preference: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: UserProfile | null;
  session: UserSession | null;
  error: string | null;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}