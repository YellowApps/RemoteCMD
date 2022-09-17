@echo off
pushd "%~dp0"

set "scriptPath=%~1"
set "scriptName=%~n1"
set "scriptFileName=%~nx1"

if not exist "%scriptName%" mkdir "%scriptName%"
echo ^@echo off > "%scriptName%\%scriptName%.bat"
echo ^cd /d ^%%^~dp0 >> "%scriptName%\%scriptName%.bat"
echo start wscript "%scriptFileName%" >> "%scriptName%\%scriptName%.bat"
echo exit >> "%scriptName%\%scriptName%.bat"

copy "%scriptPath%" "%scriptName%\%scriptFileName%" > nul

ypamc "%scriptName%" "%scriptName%.bat" "..\%scriptName%.exe" > nul