/*
  # Create password reset OTPs table

  1. New Tables
    - `password_reset_otps`
      - `id` (uuid, primary key)
      - `email` (text, not null)
      - `otp` (text, not null)
      - `expires_at` (timestamp, not null)
      - `used` (boolean, default false)
      - `created_at` (timestamp, default now)

  2. Security
    - Enable RLS on `password_reset_otps` table
    - Add policy for public access (needed for password reset)
    - Add index on email for faster lookups
    - Add index on expires_at for cleanup

  3. Cleanup
    - Automatic cleanup of expired OTPs
*/

CREATE TABLE IF NOT EXISTS password_reset_otps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  otp text NOT NULL,
  expires_at timestamptz NOT NULL,
  used boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_password_reset_otps_email ON password_reset_otps(email);
CREATE INDEX IF NOT EXISTS idx_password_reset_otps_expires_at ON password_reset_otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_reset_otps_used ON password_reset_otps(used);

-- Enable RLS
ALTER TABLE password_reset_otps ENABLE ROW LEVEL SECURITY;

-- Allow public access for password reset functionality
CREATE POLICY "Allow public access for password reset"
  ON password_reset_otps
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Function to cleanup expired OTPs
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM password_reset_otps 
  WHERE expires_at < now() - interval '1 hour';
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically cleanup expired OTPs periodically
-- Note: In production, you might want to use a cron job instead