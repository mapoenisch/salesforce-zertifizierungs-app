#!/bin/bash
# Startet einen einfachen lokalen Webserver für den Salesforce-Zertifizierungs-Trainer
# und öffnet die App automatisch im Standardbrowser.
#
# Warum nötig: Die App lädt ihre Lerninhalte (data/*.json) und Module per JavaScript-fetch().
# Browser blockieren das aus Sicherheitsgründen, wenn man index.html per Doppelklick öffnet
# (file://-Protokoll). Über einen lokalen Webserver (http://localhost) funktioniert es normal.
#
# Nutzung: Doppelklick auf diese Datei im Finder.
# Falls macOS eine Sicherheitswarnung zeigt: Rechtsklick -> Öffnen -> Öffnen bestätigen.

cd "$(dirname "$0")"

if ! command -v python3 >/dev/null 2>&1; then
  echo "============================================================"
  echo " Python 3 wurde nicht gefunden."
  echo "============================================================"
  echo ""
  echo " Diese App braucht Python 3, um den lokalen Server zu starten."
  echo " So installierst du es:"
  echo "  1. Gehe zu https://www.python.org/downloads/"
  echo "  2. Lade die neueste Version fuer macOS herunter und installiere sie."
  echo "  3. Danach dieses Skript (start-server-mac.command) erneut starten."
  echo ""
  echo " Falls du kein Python installieren kannst oder willst, sieh in"
  echo " der README.md unter 'Alternative: manueller Start' nach."
  echo "============================================================"
  read -p "Zum Schließen Enter drücken..." _
  exit 1
fi

PORT=8000

# Freien Port suchen, falls 8000 schon belegt ist.
while lsof -i ":$PORT" >/dev/null 2>&1; do
  PORT=$((PORT + 1))
done

echo "Starte lokalen Server für den Salesforce-Zertifizierungs-Trainer..."
echo "Ordner: $(pwd)"
echo "URL:    http://localhost:$PORT"
echo ""
echo "Zum Beenden: dieses Fenster schließen oder Strg+C drücken."
echo ""

# Browser mit kurzer Verzögerung öffnen, damit der Server sicher schon läuft.
( sleep 1 && open "http://localhost:$PORT" ) &

python3 -m http.server "$PORT"
