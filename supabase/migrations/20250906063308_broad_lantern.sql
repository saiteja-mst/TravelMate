/*
  # Fix Row Level Security Policies for User Profiles

  1. Security Updates
    - Drop existing restrictive policies that prevent profile creation
    - Add proper INSERT policy for authenticated users during signup
    - Add SELECT policy for users to read their own profiles
    - Add UPDATE policy for users to modify their own profiles

  2. Changes
    - Allow authenticated users to insert their own profile during signup
    - Maintain security by ensuring users can only access their own data
    - Fix the RLS violation that prevents new user registration
*/

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

-- Create new policies that allow proper user registration
CREATE POLICY "Enable insert for authenticated users during signup"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable select for users on own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable update for users on own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;