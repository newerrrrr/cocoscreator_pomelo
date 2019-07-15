@ECHO OFF

:: 当前路径
SET CUR_PATH=%~dp0.

:: 场景文件路径
SET SOURCE_DIR=%CUR_PATH:~0,-1%assets/scene
SET OUT_PATH=%CUR_PATH:~0,-1%out.txt


Echo Please input image file name: 
set /p option=

 
Echo find result: 

FOR /R %SOURCE_DIR% %%i IN (*.fire) DO (
	findstr /m "%option%" %%i 
	if "!errorlevel!"=="0" echo %%i
)


PAUSE 


