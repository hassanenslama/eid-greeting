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

-- Enable Row Level Security (RLS)
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Create policy to allow insert from anyone (anonymous)
CREATE POLICY "Allow insert from anyone"
ON visitors
FOR INSERT
TO anon
WITH CHECK (true);

-- Create policy to allow select for authenticated users only
CREATE POLICY "Allow select from authenticated users"
ON visitors
FOR SELECT
TO authenticated
USING (true);

-- Create function to automatically update visited_at timestamp
CREATE OR REPLACE FUNCTION update_visited_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.visited_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update visited_at
DROP TRIGGER IF EXISTS update_visitors_visited_at ON visitors;
CREATE TRIGGER update_visitors_visited_at
    BEFORE UPDATE ON visitors
    FOR EACH ROW
    EXECUTE FUNCTION update_visited_at_column();