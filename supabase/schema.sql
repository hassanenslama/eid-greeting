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
    visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_visitors_visited_at ON visitors(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_country ON visitors(country);
CREATE INDEX IF NOT EXISTS idx_visitors_device_type ON visitors(device_type);

-- Disable Row Level Security completely
ALTER TABLE visitors DISABLE ROW LEVEL SECURITY;

-- Grant permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON visitors TO anon;
GRANT SELECT ON visitors TO public;