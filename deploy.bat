@echo off
cd /d "%~dp0"
set ts=%DATE% %TIME%
echo Deploying at %ts% ...
git add .
git commit -m "update"
git push
echo Done!
pause
