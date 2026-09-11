@echo off
cd /d "%~dp0"

echo ========================================================
echo Pushing The Borderbound to GitHub: AYUSH20-sahu/the-borderbound
echo ========================================================

git init
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/AYUSH20-sahu/the-borderbound.git
git add .
git commit -m "feat: complete Phase 1 & Phase 2 - Foundation, Design System, and 32 Contestants Gallery"
git push -u origin main

echo.
echo ========================================================
echo Done! Please check https://github.com/AYUSH20-sahu/the-borderbound
echo ========================================================
pause
