@echo off
REM BMKG News CMS - Deployment Helper Script (Windows)
REM Usage: deploy.bat [local|hosting]

setlocal enabledelayedexpansion

REM Colors (Windows 10+)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo %RED%Error: Git is not installed%NC%
    exit /b 1
)

REM Main logic
if "%1"=="" (
    call :show_usage
    exit /b 0
)

if /i "%1"=="local" (
    call :deploy_local
    exit /b %errorlevel%
)

if /i "%1"=="hosting" (
    call :deploy_hosting
    exit /b %errorlevel%
)

if /i "%1"=="help" (
    call :show_usage
    exit /b 0
)

echo %RED%Error: Unknown command: %1%NC%
call :show_usage
exit /b 1

REM Functions
:deploy_local
echo.
echo ========================================
echo Local Deployment - Push to GitHub
echo ========================================
echo.

REM Check status
git status --porcelain >nul
if %errorlevel% equ 0 (
    echo %GREEN%Git status OK%NC%
) else (
    echo %RED%Error checking git status%NC%
    exit /b 1
)

REM Get commit message
set /p commit_msg="Enter commit message: "
if "!commit_msg!"=="" (
    echo %RED%Error: Commit message cannot be empty%NC%
    exit /b 1
)

REM Stage changes
echo.
echo Staging changes...
git add .
if %errorlevel% neq 0 (
    echo %RED%Error staging changes%NC%
    exit /b 1
)
echo %GREEN%Changes staged%NC%

REM Commit
echo Committing...
git commit -m "!commit_msg!"
if %errorlevel% neq 0 (
    echo %RED%Error creating commit%NC%
    exit /b 1
)
echo %GREEN%Commit created%NC%

REM Push
echo Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo %RED%Error pushing to GitHub%NC%
    exit /b 1
)
echo %GREEN%Pushed to GitHub%NC%

REM Show latest commit
echo.
echo Latest commit:
git log --oneline -1

echo.
echo %GREEN%Local deployment completed!%NC%
exit /b 0

:deploy_hosting
echo.
echo ========================================
echo Hosting Deployment - Pull from GitHub
echo ========================================
echo.

REM Check .env
if exist ".env" (
    echo %GREEN%.env file exists%NC%
) else (
    echo %YELLOW%Warning: .env file not found%NC%
    echo Create .env file with database credentials
)

REM Pull
echo.
echo Pulling from GitHub...
git pull origin main
if %errorlevel% neq 0 (
    echo %RED%Error pulling from GitHub%NC%
    exit /b 1
)
echo %GREEN%Pulled from GitHub%NC%

REM Show latest commit
echo.
echo Latest commit:
git log --oneline -1

echo.
echo %GREEN%Hosting deployment completed!%NC%
exit /b 0

:show_usage
echo BMKG News CMS - Deployment Helper
echo.
echo Usage: deploy.bat [command]
echo.
echo Commands:
echo   local      Push changes to GitHub
echo   hosting    Pull changes from GitHub on hosting
echo   help       Show this help message
echo.
echo Examples:
echo   deploy.bat local      # Push to GitHub
echo   deploy.bat hosting    # Pull on hosting
exit /b 0
