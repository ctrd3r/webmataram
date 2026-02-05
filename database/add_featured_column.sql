-- Add featured column to berita table
-- Run this if the column doesn't exist yet

-- Check if column exists first (MySQL 5.7+)
SET @dbname = DATABASE();
SET @tablename = 'berita';
SET @columnname = 'featured';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  'SELECT 1',
  CONCAT('ALTER TABLE ', @tablename, ' ADD COLUMN ', @columnname, ' TINYINT(1) DEFAULT 0 AFTER status')
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add index for better performance
ALTER TABLE berita ADD INDEX idx_featured (featured);
ALTER TABLE berita ADD INDEX idx_status_featured (status, featured);

-- Optional: Mark some existing news as featured
-- UPDATE berita SET featured = 1 WHERE id_berita IN (1, 2, 3) LIMIT 3;

SELECT 'Featured column added successfully!' as message;
