-- Create disputes table
CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id TEXT NOT NULL,
    job_description TEXT NOT NULL,
    job_amount TEXT NOT NULL,
    client TEXT NOT NULL,
    freelancer TEXT NOT NULL,
    client_evidence TEXT,
    freelancer_evidence TEXT,
    votes JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'ACTIVE',
    winner TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_job_id ON disputes(job_id);
CREATE INDEX IF NOT EXISTS idx_disputes_client ON disputes(client);
CREATE INDEX IF NOT EXISTS idx_disputes_freelancer ON disputes(freelancer);

-- Enable Row Level Security
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo)
CREATE POLICY "Allow all operations on disputes" ON disputes
    FOR ALL
    USING (true)
    WITH CHECK (true);
