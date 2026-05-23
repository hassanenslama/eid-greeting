-- Create visitors table for tracking
CREATE TABLE IF NOT EXISTS visitors (
    id BIGSERIAL PRIMARY KEY,
    ip VARCHAR(45),
    country VARCHAR(100),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    device_type VARCHAR(20),
    os VARCHAR(50),
    browser VARCHAR(50),
    language VARCHAR(20),
    referrer TEXT,
    user_agent TEXT,
    sheep_clicks INT DEFAULT 0, -- عدد نقرات الخروف تفاعلياً
    gift_clicks INT DEFAULT 0,  -- عدد نقرات صندوق الهدايا تفاعلياً
    visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- دمج الأعمدة ديناميكياً في حال تشغيل السكريبت على جدول منشأ مسبقاً (لمسة احترافية)
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS sheep_clicks INT DEFAULT 0;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS gift_clicks INT DEFAULT 0;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_visitors_visited_at ON visitors(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_country ON visitors(country);
CREATE INDEX IF NOT EXISTS idx_visitors_device_type ON visitors(device_type);

-- Enable Row Level Security (RLS) for privacy protection
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Drop policies if they already exist to prevent errors on rerun
DROP POLICY IF EXISTS "Allow anonymous inserts" ON visitors;
DROP POLICY IF EXISTS "Allow anonymous updates" ON visitors;

-- Allow anyone (including anonymous) to insert data
CREATE POLICY "Allow anonymous inserts" ON visitors 
    FOR INSERT TO anon 
    WITH CHECK (true);

-- Allow anyone (including anonymous) to update click numbers حياً أثناء التصفح
CREATE POLICY "Allow anonymous updates" ON visitors
    FOR UPDATE TO anon
    USING (true)
    WITH CHECK (true);

-- Ensure anonymous role can use the autoincrement sequence
GRANT USAGE, SELECT ON SEQUENCE visitors_id_seq TO anon;

-- Revoke direct select permissions on visitors table from public/anonymous roles
REVOKE SELECT ON visitors FROM public, anon;

-- Grant select permission ONLY on the id column to allow PostgREST to return the representation of the inserted row
GRANT SELECT (id) ON visitors TO anon;

-- Create secure RPC function for dashboard to retrieve visitors data using a password
CREATE OR REPLACE FUNCTION get_visitors(auth_pass TEXT)
RETURNS SETOF visitors
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with owner privileges to bypass table SELECT restrictions
AS $$
BEGIN
    IF auth_pass = 'eid2026' THEN
        RETURN QUERY SELECT * FROM visitors ORDER BY visited_at DESC;
    ELSE
        RAISE EXCEPTION 'Unauthorized: Invalid password';
    END IF;
END;
$$;

-- Grant execution permission on the RPC function to anon
GRANT EXECUTE ON FUNCTION get_visitors(TEXT) TO anon;