@echo off
cd /d "%~dp0"

echo ========================================================
echo Pushing The Borderbound to GitHub: AYUSH20-sahu/the-borderbound
echo (All 5 Phases Built & Ready)
echo ========================================================

git init
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/AYUSH20-sahu/the-borderbound.git
git add .
git commit -m "feat: complete The Borderbound digital platform - all 5 phases (Foundation, 32 Contestants Gallery, Application Wizard, Admin Dashboard, Polish & Integrations)"
git push -u origin main

echo.
echo ========================================================
echo Done! Code pushed to https://github.com/AYUSH20-sahu/the-borderbound
echo ========================================================
pause
