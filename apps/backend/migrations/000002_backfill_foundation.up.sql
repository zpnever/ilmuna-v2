DO $$ BEGIN
    CREATE TYPE post_visibility AS ENUM ('public', 'followers', 'private');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE like_type AS ENUM ('like', 'dislike');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE group_role AS ENUM ('ustadz', 'moderator', 'student');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE task_type AS ENUM ('hafalan', 'catatan', 'bacaan', 'lainnya');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE submission_status AS ENUM ('submitted', 'reviewed', 'accepted', 'revision');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

DO $$
DECLARE
    user_id_type TEXT;
BEGIN
    SELECT data_type
    INTO user_id_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'id';

    IF user_id_type IS NULL THEN
        RAISE EXCEPTION 'users.id column not found';
    END IF;

    EXECUTE format($sql$
        CREATE TABLE IF NOT EXISTS oauth_accounts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id %s NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          provider VARCHAR(50) NOT NULL,
          provider_account_id TEXT NOT NULL,
          access_token TEXT,
          refresh_token TEXT,
          expires_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE (provider, provider_account_id)
        )
    $sql$, user_id_type);

    EXECUTE format($sql$
        CREATE TABLE IF NOT EXISTS sessions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id %s NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          refresh_token TEXT UNIQUE NOT NULL,
          expires_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
    $sql$, user_id_type);

    EXECUTE format($sql$
        CREATE TABLE IF NOT EXISTS follows (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          follower_id %s NOT NULL REFERENCES users(id),
          following_id %s NOT NULL REFERENCES users(id),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE (follower_id, following_id),
          CHECK (follower_id <> following_id)
        )
    $sql$, user_id_type, user_id_type);

    EXECUTE format($sql$
        CREATE TABLE IF NOT EXISTS user_posts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          author_id %s NOT NULL REFERENCES users(id),
          content JSONB NOT NULL DEFAULT '{}'::jsonb,
          images TEXT[] DEFAULT '{}',
          visibility post_visibility DEFAULT 'public',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          deleted_at TIMESTAMPTZ
        )
    $sql$, user_id_type);

    EXECUTE format($sql$
        CREATE TABLE IF NOT EXISTS post_likes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          post_id UUID NOT NULL REFERENCES user_posts(id) ON DELETE CASCADE,
          user_id %s NOT NULL REFERENCES users(id),
          type like_type NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE (post_id, user_id)
        )
    $sql$, user_id_type);

    EXECUTE format($sql$
        CREATE TABLE IF NOT EXISTS post_comments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          post_id UUID NOT NULL REFERENCES user_posts(id) ON DELETE CASCADE,
          author_id %s NOT NULL REFERENCES users(id),
          parent_id UUID REFERENCES post_comments(id),
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          deleted_at TIMESTAMPTZ
        )
    $sql$, user_id_type);

    EXECUTE format($sql$
        CREATE TABLE IF NOT EXISTS groups (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL,
          slug VARCHAR(100) UNIQUE NOT NULL,
          description TEXT,
          image_url TEXT,
          is_public BOOLEAN DEFAULT TRUE,
          invite_code VARCHAR(20) UNIQUE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
    $sql$);

    EXECUTE format($sql$
        CREATE TABLE IF NOT EXISTS group_members (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
          user_id %s NOT NULL REFERENCES users(id),
          group_role group_role DEFAULT 'student',
          joined_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE (group_id, user_id)
        )
    $sql$, user_id_type);

    EXECUTE format($sql$
        CREATE TABLE IF NOT EXISTS forum_posts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
          author_id %s NOT NULL REFERENCES users(id),
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          is_pinned BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          deleted_at TIMESTAMPTZ
        )
    $sql$, user_id_type);

    EXECUTE format($sql$
        CREATE TABLE IF NOT EXISTS forum_comments (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          post_id UUID NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
          author_id %s NOT NULL REFERENCES users(id),
          parent_id UUID REFERENCES forum_comments(id),
          content TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          deleted_at TIMESTAMPTZ
        )
    $sql$, user_id_type);

    EXECUTE format($sql$
        CREATE TABLE IF NOT EXISTS materials (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
          author_id %s NOT NULL REFERENCES users(id),
          title VARCHAR(255) NOT NULL,
          description TEXT,
          content TEXT,
          file_url TEXT,
          file_type VARCHAR(20),
          external_url TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
    $sql$, user_id_type);

    EXECUTE format($sql$
        CREATE TABLE IF NOT EXISTS tasks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          type task_type NOT NULL,
          surah_ref VARCHAR(100),
          due_date TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        )
    $sql$);

    EXECUTE format($sql$
        CREATE TABLE IF NOT EXISTS task_submissions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          task_id UUID NOT NULL REFERENCES tasks(id),
          user_id %s NOT NULL REFERENCES users(id),
          content TEXT,
          file_url TEXT,
          status submission_status DEFAULT 'submitted',
          note TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE (task_id, user_id)
        )
    $sql$, user_id_type);

    EXECUTE format($sql$
        CREATE TABLE IF NOT EXISTS quran_bookmarks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id %s NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          surah_number INT NOT NULL,
          surah_name VARCHAR(50) NOT NULL,
          ayah_number INT NOT NULL,
          arabic_text TEXT NOT NULL,
          translation TEXT NOT NULL,
          note TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE (user_id, surah_number, ayah_number)
        )
    $sql$, user_id_type);

    EXECUTE format($sql$
        CREATE TABLE IF NOT EXISTS hadist_bookmarks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id %s NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          book_slug VARCHAR(50) NOT NULL,
          book_name VARCHAR(100) NOT NULL,
          hadist_number INT NOT NULL,
          arab_text TEXT NOT NULL,
          translation TEXT NOT NULL,
          narrator TEXT,
          note TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE (user_id, book_slug, hadist_number)
        )
    $sql$, user_id_type);

    EXECUTE format($sql$
        CREATE TABLE IF NOT EXISTS notifications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id %s NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          actor_id %s REFERENCES users(id),
          type VARCHAR(50) NOT NULL,
          message TEXT NOT NULL,
          link TEXT,
          is_read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
    $sql$, user_id_type, user_id_type);
END $$;

CREATE INDEX IF NOT EXISTS idx_user_posts_author ON user_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_user_posts_created ON user_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_comments_post ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_quran_bookmarks_user ON quran_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_hadist_bookmarks_user ON hadist_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
