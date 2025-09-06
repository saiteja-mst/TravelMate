/*
  # Fix Authentication Database Issues

  1. Database Structure
    - Ensure proper user_profiles table structure
    - Add necessary indexes for performance
    
  2. Security Policies
    - Simplified RLS policies that work with Supabase auth
    - Allow proper user profile creation and access
    
  3. Triggers and Functions
    - Remove problematic triggers that cause granting errors
    - Use simpler approach for profile creation
*/

-- Drop existing problematic triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_user_last_login ON user_sessions;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS update_last_login() CASCADE;

-- Ensure user_profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  preferences jsonb DEFAULT '{}'::jsonb
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;
DROP POLICY IF EXISTS "Service role can manage profiles" ON user_profiles;

-- Create simplified RLS policies
CREATE POLICY "Enable read access for users based on user_id"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable delete for users based on user_id"
  ON user_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Ensure user_sessions table exists
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  is_active boolean DEFAULT true
);

-- Create indexes for user_sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at);

-- Enable RLS for user_sessions
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing session policies
DROP POLICY IF EXISTS "Users can read own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON user_sessions;

-- Create simplified session policies
CREATE POLICY "Enable session access for users"
  ON user_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Ensure travel_preferences table exists
CREATE TABLE IF NOT EXISTS travel_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  budget_range text,
  preferred_destinations text[],
  travel_style text,
  accommodation_type text,
  transportation_mode text,
  dietary_restrictions text[],
  accessibility_needs text[],
  language_preference text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for travel_preferences
CREATE INDEX IF NOT EXISTS idx_travel_preferences_user_id ON travel_preferences(user_id);

-- Enable RLS for travel_preferences
ALTER TABLE travel_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing travel preferences policies
DROP POLICY IF EXISTS "Users can manage own travel preferences" ON travel_preferences;

-- Create simplified travel preferences policy
CREATE POLICY "Enable travel preferences access for users"
  ON travel_preferences FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create simple update trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add update triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_travel_preferences_updated_at ON travel_preferences;
CREATE TRIGGER update_travel_preferences_updated_at
  BEFORE UPDATE ON travel_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();