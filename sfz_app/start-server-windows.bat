@echo off
setlocal

REM Startet einen einfachen lokalen Webserver fuer den Salesforce-Zertifizierungs-Trainer
REM und oeffnet die App automatisch im Standardbrowser.
REM
REM Warum noetig: Die App laedt ihre Lerninhalte (data/*.json) und Module per JavaScript-fetch().
REM Browser blockieren das aus Sicherheitsgruenden, wenn man index.html per Doppelklick oeffnet
REM (file://-Protokoll). Ueber einen lokalen Webserver (http://localhost) funktioniert es normal.
REM
REM Nutzung: Doppelklick auf diese Datei im Explorer.
REM Falls Windows SmartScreen eine Warnung zeigt: "Weitere Informationen" -> "Trotzdem ausfuehren".
REM Voraussetzung: Python 3 muss installiert sein (https://www.python.org/downloads/),
REM beim Installieren die Option "Add python.exe to PATH" aktivieren.

cd /d "%~dp0"

set PORT=8000

REM Ohne Portwechsel bleibt der Lernstand unter derselben Browseradresse erreichbar.
netstat -ano -p TCP | findstr /R /C:":%PORT% .*:0 .*" >nul
if not errorlevel 1 (
    echo Port %PORT% ist bereits belegt. Wenn der Trainer schon laeuft, oeffne http://localhost:%PORT%.
    echo Andernfalls beende den Dienst auf Port %PORT% und starte dieses Skript erneut.
    pause
    exit /b 1
)

echo Starte lokalen Server fuer den Salesforce-Zertifizierungs-Trainer...
echo Ordner: %cd%
echo URL:    http://localhost:%PORT%
echo.
echo Zum Beenden: dieses Fenster schliessen oder Strg+C druecken.
echo.

REM Browser mit kurzer Verzoegerung oeffnen, damit der Server sicher schon laeuft.
start "" cmd /c "timeout /t 1 >nul & start http://localhost:%PORT%"

REM Python-Befehl ermitteln (python oder py-Launcher) und Server starten.
where python >nul 2>nul
if %errorlevel%==0 (
    python -m http.server %PORT% --bind 127.0.0.1
    goto :eof
)

where py >nul 2>nul
if %errorlevel%==0 (
    py -3 -m http.server %PORT% --bind 127.0.0.1
    goto :eof
)

echo ============================================================
echo  Python wurde nicht gefunden.
echo ============================================================
echo.
echo  Diese App braucht Python 3, um den lokalen Server zu starten.
echo  So installierst du es:
echo   1. Gehe zu https://www.python.org/downloads/
echo   2. Lade die neueste Version fuer Windows herunter und starte sie.
echo   3. WICHTIG: Setze im ersten Installations-Fenster unten links
echo      den Haken bei "Add python.exe to PATH".
echo   4. Nach der Installation diesen Rechner ggf. neu starten.
echo   5. Danach diese Datei (start-server-windows.bat) erneut
echo      per Doppelklick oeffnen.
echo.
echo  Falls du kein Python installieren kannst oder willst, sieh in
echo  der README.md unter "Alternative: manueller Start" nach.
echo ============================================================
pause
