@echo off
cd /d "%~dp0"
for /f %%i in ('wmic os get localtime ^| findstr ^[0-9]') do set dt=%%i
set ts=%dt:~0,4%-%dt:~4,2%-%dt:~6,2% %dt:~8,2%:%dt:~10,2%
echo Deploying at %ts% ...
git add .
git commit -m "update %ts%"
git push
echo Done!
pause
