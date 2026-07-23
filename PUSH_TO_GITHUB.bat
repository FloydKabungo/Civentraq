@echo off
setlocal
cd /d "%~dp0"

echo Publishing Civentraq to GitHub...

git remote remove origin >nul 2>&1
git remote add origin https://github.com/floydkabungo/civentraq.git
git branch -M main
git push -u origin main

if errorlevel 1 (
  echo.
  echo Upload failed. Confirm that the empty repository exists at:
  echo https://github.com/floydkabungo/civentraq
  echo Then sign in to GitHub when prompted and run this file again.
  pause
  exit /b 1
)

echo.
echo Upload complete.
echo Enable GitHub Pages from Settings ^> Pages ^> Deploy from branch ^> main ^> root.
pause
