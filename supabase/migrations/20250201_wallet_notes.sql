-- Satu sticky note per dompet (hanya teks). Jalankan di SQL Editor jika tabel belum ada.

CREATE TABLE IF NOT EXISTS wallet_notes (
  wallet_id UUID PRIMARY KEY REFERENCES wallets(id) ON DELETE CASCADE,
  content TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE wallet_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "View wallet notes of joined wallets" ON wallet_notes;
CREATE POLICY "View wallet notes of joined wallets" ON wallet_notes
  FOR SELECT
  USING (is_wallet_member(wallet_id));

DROP POLICY IF EXISTS "Manage wallet notes if admin or editor" ON wallet_notes;
CREATE POLICY "Manage wallet notes if admin or editor" ON wallet_notes
  FOR ALL
  USING (get_wallet_role(wallet_id) IN ('admin', 'editor'))
  WITH CHECK (get_wallet_role(wallet_id) IN ('admin', 'editor'));
