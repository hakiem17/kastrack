-- ============================================================================
-- KASBIDANG - DDL AWAL (INITIAL DATABASE SETUP)
-- ============================================================================
-- Satu file ini cukup untuk membuat database dari awal.
-- Jalankan di Supabase: SQL Editor → paste isi file ini → Run.
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. TABLES
-- ============================================================================

-- 2.1 Wallets Table
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  currency TEXT DEFAULT 'IDR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.2 Wallet Members Table
CREATE TABLE IF NOT EXISTS wallet_members (
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (wallet_id, user_id)
);

-- 2.3 Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2.4 Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount NUMERIC(15, 2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 3. INDEXES (for performance)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_wallet_members_user ON wallet_members(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_categories_wallet ON categories(wallet_id);

-- ============================================================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. HELPER FUNCTIONS
-- ============================================================================

-- 5.1 Check if current user is a member of the wallet
CREATE OR REPLACE FUNCTION is_wallet_member(_wallet_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM wallet_members
    WHERE wallet_id = _wallet_id
      AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5.2 Get current user's role in a wallet
CREATE OR REPLACE FUNCTION get_wallet_role(_wallet_id UUID)
RETURNS TEXT AS $$
DECLARE
  _role TEXT;
BEGIN
  SELECT role INTO _role
  FROM wallet_members
  WHERE wallet_id = _wallet_id
    AND user_id = auth.uid();
  RETURN _role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5.3 Create wallet with member and default categories (SECURITY DEFINER)
-- This function handles atomic wallet creation, bypassing RLS for initial setup
CREATE OR REPLACE FUNCTION create_wallet_with_member(
  _name TEXT,
  _currency TEXT DEFAULT 'IDR'
) 
RETURNS UUID AS $$
DECLARE
  _wallet_id UUID;
BEGIN
  -- 1. Insert Wallet
  INSERT INTO wallets (name, currency)
  VALUES (_name, _currency)
  RETURNING id INTO _wallet_id;

  -- 2. Insert Member (Owner/Admin)
  INSERT INTO wallet_members (wallet_id, user_id, role)
  VALUES (_wallet_id, auth.uid(), 'admin');

  -- 3. Insert Default Categories
  INSERT INTO categories (wallet_id, name, type) VALUES
  (_wallet_id, 'Gaji', 'income'),
  (_wallet_id, 'Bonus', 'income'),
  (_wallet_id, 'Makan', 'expense'),
  (_wallet_id, 'Transport', 'expense'),
  (_wallet_id, 'Hiburan', 'expense'),
  (_wallet_id, 'Belanja', 'expense'),
  (_wallet_id, 'Tagihan', 'expense'),
  (_wallet_id, 'Lainnya', 'expense');

  RETURN _wallet_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- 6.1 Wallets Policies
-- Users can see wallets they belong to (using helper function to avoid recursion)
DROP POLICY IF EXISTS "Users can view joined wallets" ON wallets;
CREATE POLICY "Users can view joined wallets" ON wallets
  FOR SELECT
  USING (is_wallet_member(id));

-- Users can create wallets
DROP POLICY IF EXISTS "Users can create wallets" ON wallets;
CREATE POLICY "Users can create wallets" ON wallets
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 6.2 Wallet Members Policies
-- Members see other members of the same wallet (using helper function to avoid recursion)
DROP POLICY IF EXISTS "View members of joined wallets" ON wallet_members;
CREATE POLICY "View members of joined wallets" ON wallet_members
  FOR SELECT
  USING (is_wallet_member(wallet_id));

-- Users can insert their own membership (necessary for wallet creation flow)
DROP POLICY IF EXISTS "Users can insert their own membership" ON wallet_members;
CREATE POLICY "Users can insert their own membership" ON wallet_members
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- 6.3 Categories Policies
-- Read: Any member can view categories
DROP POLICY IF EXISTS "View categories of joined wallets" ON categories;
CREATE POLICY "View categories of joined wallets" ON categories
  FOR SELECT
  USING (is_wallet_member(wallet_id));

-- Write: Only admin or editor can manage categories
DROP POLICY IF EXISTS "Manage categories if admin or editor" ON categories;
CREATE POLICY "Manage categories if admin or editor" ON categories
  FOR ALL
  USING (get_wallet_role(wallet_id) IN ('admin', 'editor'))
  WITH CHECK (get_wallet_role(wallet_id) IN ('admin', 'editor'));

-- 6.4 Transactions Policies
-- Read: Any member can view transactions
DROP POLICY IF EXISTS "View transactions of joined wallets" ON transactions;
CREATE POLICY "View transactions of joined wallets" ON transactions
  FOR SELECT
  USING (is_wallet_member(wallet_id));

-- Write: Only admin or editor can manage transactions
DROP POLICY IF EXISTS "Manage transactions if admin or editor" ON transactions;
CREATE POLICY "Manage transactions if admin or editor" ON transactions
  FOR ALL
  USING (get_wallet_role(wallet_id) IN ('admin', 'editor'))
  WITH CHECK (get_wallet_role(wallet_id) IN ('admin', 'editor'));

-- ============================================================================
-- 2.5 Wallet Invites (untuk Pengaturan / undangan anggota)
-- ============================================================================
CREATE TABLE IF NOT EXISTS wallet_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  invited_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_wallet_invites_wallet ON wallet_invites(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_invites_token ON wallet_invites(token);
ALTER TABLE wallet_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin can manage wallet invites" ON wallet_invites;
CREATE POLICY "Admin can manage wallet invites" ON wallet_invites
  FOR ALL
  USING (get_wallet_role(wallet_id) = 'admin')
  WITH CHECK (get_wallet_role(wallet_id) = 'admin');

DROP POLICY IF EXISTS "Admin can update member role" ON wallet_members;
CREATE POLICY "Admin can update member role" ON wallet_members
  FOR UPDATE
  USING (get_wallet_role(wallet_id) = 'admin')
  WITH CHECK (get_wallet_role(wallet_id) = 'admin');

DROP POLICY IF EXISTS "Admin can remove member" ON wallet_members;
CREATE POLICY "Admin can remove member" ON wallet_members
  FOR DELETE
  USING (get_wallet_role(wallet_id) = 'admin');

-- Jadikan user saat ini admin di semua wallet yang ia ikuti (satu kali, untuk koreksi data)
CREATE OR REPLACE FUNCTION set_self_admin_all_wallets()
RETURNS JSONB AS $$
DECLARE
  _updated INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  UPDATE wallet_members SET role = 'admin' WHERE user_id = auth.uid();
  GET DIAGNOSTICS _updated = ROW_COUNT;
  RETURN jsonb_build_object('success', true, 'updated', _updated);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION accept_wallet_invite(_token UUID, _user_email TEXT)
RETURNS JSONB AS $$
DECLARE
  _invite RECORD;
  _user_id UUID;
BEGIN
  _user_id := auth.uid();
  IF _user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  SELECT id, wallet_id, email, role INTO _invite
  FROM wallet_invites
  WHERE token = _token AND expires_at > now()
  LIMIT 1;
  IF _invite.id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Undangan tidak valid atau sudah kadaluarsa');
  END IF;
  IF lower(trim(_invite.email)) <> lower(trim(_user_email)) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Email tidak sesuai dengan undangan');
  END IF;
  INSERT INTO wallet_members (wallet_id, user_id, role)
  VALUES (_invite.wallet_id, _user_id, _invite.role)
  ON CONFLICT (wallet_id, user_id) DO UPDATE SET role = _invite.role;
  DELETE FROM wallet_invites WHERE id = _invite.id;
  RETURN jsonb_build_object('success', true, 'wallet_id', _invite.wallet_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================
-- Database setup selesai!
-- 
-- Struktur yang dibuat:
-- - 5 tables: wallets, wallet_members, wallet_invites, categories, transactions
-- - Indexes untuk performa
-- - Helper functions dengan SECURITY DEFINER (termasuk accept_wallet_invite)
-- - RLS policies untuk keamanan data
--
-- Untuk membuat wallet pertama, gunakan function:
-- SELECT create_wallet_with_member('Nama Dompet');
-- ============================================================================
