/*
  # Fix Database User Granting Error

  This migration addresses the "Database error granting user" issue by:

  1. Database Trigger Fix
     - Creates a SECURITY DEFINER function that can bypass RLS
     - Adds proper error handling and logging
     - Ensures the trigger has necessary permissions

  2. Row Level Security Updates
     - Adds service role policies for profile creation
     - Maintains user security while allowing system operations
     - Fixes permission issues during user signup

  3. Table Schema Verification
     - Ensures user_profiles table exists with correct structure
     - Adds proper constraints and defaults
     - Creates necessary indexes for performance
*/

-- Drop existing trigger and function to recreate with proper permissions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  preferences jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role can manage profiles" ON public.user_profiles;

-- Create RLS policies for users
CREATE POLICY "Users can read own profile"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
  ON public.user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Create service role policies to allow system operations
CREATE POLICY "Service role can manage profiles"
  ON public.user_profiles
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create the trigger function with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email text;
  display_name text;
BEGIN
  -- Get user email from auth.users
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
  
  -- Extract display name from metadata or use email prefix
  display_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(user_email, '@', 1)
  );

  -- Insert user profile with proper error handling
  BEGIN
    INSERT INTO public.user_profiles (
      id,
      email,
      full_name,
      created_at,
      updated_at,
      last_login,
      is_active,
      preferences
    ) VALUES (
      NEW.id,
      user_email,
      display_name,
      NOW(),
      NOW(),
      NOW(),
      true,
      '{}'::jsonb
    );
    
    -- Log successful profile creation
    RAISE LOG 'Successfully created profile for user: %', NEW.id;
    
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating user profile for %: % %', NEW.id, SQLSTATE, SQLERRM;
    
    -- Re-raise the exception to prevent user creation if profile creation fails
    -- This ensures data consistency
    RAISE;
  END;

  RETURN NEW;
END;
$$;

-- Grant necessary permissions to the function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON public.user_profiles(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Grant necessary table permissions
GRANT ALL ON public.user_profiles TO service_role;
GRANT ALL ON public.user_profiles TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;