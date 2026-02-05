-- Jalankan jika database sudah ada dan belum punya tabel transaction_notes.
-- Table: catatan / log transaksi sebelum dimasukkan ke aplikasi.

CREATE TABLE IF NOT EXISTS transaction_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_transaction_notes_wallet ON transaction_notes(wallet_id);
ALTER TABLE transaction_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View notes of joined wallets" ON transaction_notes;
CREATE POLICY "View notes of joined wallets" ON transaction_notes
  FOR SELECT
  USING (is_wallet_member(wallet_id));

DROP POLICY IF EXISTS "Manage notes if admin or editor" ON transaction_notes;
CREATE POLICY "Manage notes if admin or editor" ON transaction_notes
  FOR ALL
  USING (get_wallet_role(wallet_id) IN ('admin', 'editor'))
  WITH CHECK (get_wallet_role(wallet_id) IN ('admin', 'editor'));
