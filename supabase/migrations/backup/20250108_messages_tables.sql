-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT,
    type TEXT NOT NULL CHECK (type IN ('group', 'direct')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_participants table
CREATE TABLE IF NOT EXISTS chat_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(chat_id, user_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'image', 'file')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create message_reads table to track read status
CREATE TABLE IF NOT EXISTS message_reads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_chats_project_id ON chats(project_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_chat_id ON chat_participants(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_participants_user_id ON chat_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_message_reads_message_id ON message_reads(message_id);
CREATE INDEX IF NOT EXISTS idx_message_reads_user_id ON message_reads(user_id);

-- Add RLS policies
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;

-- Chats policies
CREATE POLICY "Users can view chats they are part of" ON chats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_participants
            WHERE chat_id = id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Project members can create chats" ON chats
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM project_members
            WHERE project_id = project_id AND user_id = auth.uid()
        )
    );

-- Chat participants policies
CREATE POLICY "Users can view chat participants" ON chat_participants
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_participants cp
            WHERE cp.chat_id = chat_id AND cp.user_id = auth.uid()
        )
    );

CREATE POLICY "Chat admins can manage participants" ON chat_participants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM chat_participants
            WHERE chat_id = chat_id AND user_id = auth.uid() AND role = 'admin'
        )
    );

-- Messages policies
CREATE POLICY "Users can view messages in their chats" ON messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_participants
            WHERE chat_id = chat_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can send messages to their chats" ON messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_participants
            WHERE chat_id = chat_id AND user_id = auth.uid()
        )
        AND sender_id = auth.uid()
    );

-- Message reads policies
CREATE POLICY "Users can manage their own read status" ON message_reads
    FOR ALL USING (user_id = auth.uid());

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_chat_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chats SET updated_at = NOW()
    WHERE id = NEW.chat_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updating timestamps
CREATE TRIGGER update_chat_timestamp_on_message
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_timestamp();

-- Function to get unread count
CREATE OR REPLACE FUNCTION get_unread_count(p_chat_id UUID, p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    last_read TIMESTAMPTZ;
    unread_count INTEGER;
BEGIN
    SELECT last_read_at INTO last_read
    FROM chat_participants
    WHERE chat_id = p_chat_id AND user_id = p_user_id;

    SELECT COUNT(*) INTO unread_count
    FROM messages m
    WHERE m.chat_id = p_chat_id
    AND m.created_at > COALESCE(last_read, '1970-01-01'::TIMESTAMPTZ)
    AND m.sender_id != p_user_id;

    RETURN unread_count;
END;
$$ LANGUAGE plpgsql;
