@echo off
set "In=%userprofile%\Downloads"
set "Out=%userprofile%\Downloads\archive"

if not exist "%Out%" md "%Out%"
for /r "%In%" %%a in (personal*.json) do (
    move /y "%%a" "%Out%\"
)
pause