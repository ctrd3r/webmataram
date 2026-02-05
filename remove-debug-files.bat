@echo off
REM Script to remove debug and test files from production
REM Run this script to clean up security vulnerabilities

echo Removing debug and test files for security...

REM Remove test HTML files
if exist "test-*.html" del /q "test-*.html"
if exist "debug-*.html" del /q "debug-*.html"

REM Remove admin test files
if exist "admin\test-*.html" del /q "admin\test-*.html"
if exist "admin\debug-*.html" del /q "admin\debug-*.html"

REM Remove API test files
if exist "api\test_*.php" del /q "api\test_*.php"
if exist "api\debug_*.php" del /q "api\debug_*.php"

REM Remove specific debug files
if exist "api\check_config.php" del /q "api\check_config.php"
if exist "api\quick_test.html" del /q "api\quick_test.html"

REM Remove backup config files
if exist "api\config_new.php" del /q "api\config_new.php"
if exist "api\config_fixed.php" del /q "api\config_fixed.php"

REM Remove development files
if exist "admin\admin-backup-broken.js" del /q "admin\admin-backup-broken.js"

echo.
echo Security cleanup completed!
echo.
echo Files removed:
echo - All test-*.html files
echo - All debug-*.html files  
echo - All admin test/debug files
echo - All API test/debug files
echo - Development backup files
echo.
echo IMPORTANT: Test your application after cleanup!
echo.
pause