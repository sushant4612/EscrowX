-- Create escrow_keys table
CREATE TABLE IF NOT EXISTS escrow_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id TEXT UNIQUE NOT NULL,
    escrow_account TEXT NOT NULL,
    escrow_secret TEXT NOT NULL,
    client_address TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_escrow_keys_job_id ON escrow_keys(job_id);
CREATE INDEX IF NOT EXISTS idx_escrow_keys_client ON escrow_keys(client_address);

-- Enable Row Level Security
ALTER TABLE escrow_keys ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo)
CREATE POLICY "Allow all operations on escrow_keys" ON escrow_keys
    FOR ALL
    USING (true)
    WITH CHECK (true);
