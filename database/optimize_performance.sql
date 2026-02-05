-- Performance Optimization for BMKG Database
-- Safe version: Skip indexes that already exist or are foreign keys

-- ============================================
-- 1. ADD INDEXES (ONLY IF NOT EXISTS)
-- ============================================

-- Check and add idx_status_publish
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
               WHERE TABLE_SCHEMA = 'db_berita' 
               AND TABLE_NAME = 'berita' 
               AND INDEX_NAME = 'idx_status_publish');
SET @sqlstmt := IF(@exist > 0, 
    'SELECT "Index idx_status_publish already exists" as message',
    'ALTER TABLE berita ADD INDEX idx_status_publish (status, tanggal_publish DESC)');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- idx_kategori and idx_penulis are foreign keys, skip them

-- Check and add idx_featured_status
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
               WHERE TABLE_SCHEMA = 'db_berita' 
               AND TABLE_NAME = 'berita' 
               AND INDEX_NAME = 'idx_featured_status');
SET @sqlstmt := IF(@exist > 0, 
    'SELECT "Index idx_featured_status already exists" as message',
    'ALTER TABLE berita ADD INDEX idx_featured_status (featured, status)');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- Check and add idx_slug
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
               WHERE TABLE_SCHEMA = 'db_berita' 
               AND TABLE_NAME = 'berita' 
               AND INDEX_NAME = 'idx_slug');
SET @sqlstmt := IF(@exist > 0, 
    'SELECT "Index idx_slug already exists" as message',
    'ALTER TABLE berita ADD INDEX idx_slug (slug)');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- Check and add idx_slug_kategori
SET @exist := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
               WHERE TABLE_SCHEMA = 'db_berita' 
               AND TABLE_NAME = 'kategori' 
               AND INDEX_NAME = 'idx_slug_kategori');
SET @sqlstmt := IF(@exist > 0, 
    'SELECT "Index idx_slug_kategori already exists" as message',
    'ALTER TABLE kategori ADD INDEX idx_slug_kategori (slug_kategori)');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;

-- ============================================
-- 2. OPTIMIZE TABLES
-- ============================================

OPTIMIZE TABLE berita;
OPTIMIZE TABLE kategori;
OPTIMIZE TABLE penulis;

-- ============================================
-- 3. ANALYZE TABLES
-- ============================================

ANALYZE TABLE berita;
ANALYZE TABLE kategori;
ANALYZE TABLE penulis;

-- ============================================
-- 4. SHOW RESULTS
-- ============================================

SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    SEQ_IN_INDEX,
    INDEX_TYPE
FROM INFORMATION_SCHEMA.STATISTICS 
WHERE TABLE_SCHEMA = 'db_berita' 
  AND TABLE_NAME = 'berita'
ORDER BY INDEX_NAME, SEQ_IN_INDEX;

SELECT 
    '✅ Optimization completed successfully!' as message,
    NOW() as timestamp;
