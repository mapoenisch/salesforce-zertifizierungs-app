#!/usr/bin/env python3
"""Lokaler Server für den Salesforce-Zertifizierungs-Trainer.

Wie `python3 -m http.server`, sendet aber `Cache-Control: no-store`,
damit aktualisierte App-Dateien und Lerninhalte sofort sichtbar sind
(der Standardserver lässt Browser die Dateien heuristisch cachen).

Nutzung: python3 serve.py [PORT]   (Standard: 8000)
"""

import functools
import http.server
import pathlib
import sys


class NoStoreHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    root = str(pathlib.Path(__file__).resolve().parent)
    handler = functools.partial(NoStoreHandler, directory=root)
    print(f"Lokaler Server: http://127.0.0.1:{port} ({root})")
    http.server.ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
