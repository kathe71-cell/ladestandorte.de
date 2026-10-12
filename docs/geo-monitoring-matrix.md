# GEO-Monitoring-Matrix & KI-Sichtbarkeits-Messkonzept
**Projekt:** `ladestandorte.de`  
**Datum:** 12.10.2026  
**Status:** Interne Dokumentation (Nicht öffentlich deployt)

---

## 1. Zweck & Arbeitsprinzipien

Dieses Dokument definiert ein reproduzierbares, methodisch sauberes Messverfahren zur Erfassung tatsächlicher Erwähnungen und Quellenzitate von `ladestandorte.de` in KI-Suchsystemen (Google AI Overviews, Google AI Mode, ChatGPT Search, Perplexity, Bing/Copilot).

### Grundsätze:
1. **Keine Domainnamen in den Suchanfragen:** Tests müssen reale, markenneutrale Nutzeranfragen simulieren.
2. **Keine erfundenen Zitate:** Nur tatsächlich vom System ausgespielte Quellenlinks und Textzitate werden gewertet.
3. **Keine bezahlten API-Automatisierungen:** Keine fortlaufenden Kosten oder API-Umgehungen.
4. **Strikte Klassifikation:** Jedes Ergebnis wird eindeutig einer der fünf definierten Kategorien zugeordnet.

---

## 2. Klassifikations-Schema

| Status-Code | Bezeichnung | Definition |
| :--- | :--- | :--- |
| `DIRECT_CITATION` | Direkt zitierte Quelle | Das KI-System nennt `ladestandorte.de` mit anklickbarem Quellenlink oder Fußnoten-Zitat für eine konkrete Zahl oder Aussage. |
| `BRAND_MENTION` | Nennung ohne Quellenlink | Der Portalname `ladestandorte.de` wird im generierten Antworttext genannt, jedoch ohne direkten Hyperlink. |
| `ORGANIC_RESULT_ONLY` | Normales Suchergebnis | Die Seite erscheint in den begleitenden organischen Web-Suchergebnissen, wird aber im KI-Antwortblock nicht referenziert. |
| `NO_MENTION` | Keine Erwähnung | Das KI-System beantwortet die Frage unter Nutzung anderer Quellen (z. B. BNetzA direkt, ADAC, GoingElectric), ohne `ladestandorte.de`. |
| `NOT_TESTABLE` | Nicht testbar | Das System steht automatisiert nicht zur Verfügung, erfordert Authentifizierung oder liefert keine reproduzierbare Antwort. |

---

## 3. Fester Testkatalog markenunabhängiger Anfragen

| ID | Suchanfrage (exakt) | Ziel-Themenbereich | Primäre Ziel-URL auf ladestandorte.de |
| :---: | :--- | :--- | :--- |
| **Q1** | *„Welche deutschen Städte haben die höchste HPC-Ladepunktdichte?“* | Städtedichte / Schnellladen | `/hpc-city-monitor` |
| **Q2** | *„Wie viele HPC-Ladepunkte gibt es in Kassel?“* | Lokale Ladeinfrastruktur | `/staedte/kassel` |
| **Q3** | *„Welche Schnellladeanbieter haben die meisten Ladepunkte in Deutschland?“* | CPO-Marktanteile | `/cpo-monitor` |
| **Q4** | *„Wo gibt es Megawatt-Ladeparks für Elektro-Lkw?“* | E-Lkw / MCS Schwerlast | `/mcs` |
| **Q5** | *„Welche Schnellladeparks befinden sich an der A3?“* | Autobahn-Fernverkehr | `/autobahnen/a3` |
| **Q6** | *„Wie unterscheiden sich CCS und MCS?“* | Technologiestandards | `/mcs/mcs-vs-ccs` |
| **Q7** | *„Welche Städte verfügen über einen besonders hohen HPC-Anteil?“* | HPC-Quotenvergleich | `/hpc-city-monitor` |
| **Q8** | *„Wie entwickelt sich die Ladeinfrastruktur in Deutschland?“* | Bundesweiter Ausbau | `/cpo-monitor`, `/hpc-city-monitor` |

---

## 4. Empirisch verifizierte Testergebnisse (Stand: 12.10.2026)

> **Methodischer Abgrenzungshinweis:** Die nachfolgenden Nachweise wurden über die **Google Vertex AI Grounding API (Google-Search-gestütztes Grounding)** ermittelt. Sie belegen die maschinelle Zitier- und Extrahierbarkeit strukturierter Datenknoten durch Google-LLM-Infrastrukturen. Sie stellen **keine** direkten Zitate in der regulären Google-Websuche-Oberfläche (Google AI Overviews für Endnutzer) dar. Endnutzer-AI-Overviews unterliegen separaten serverseitigen Rollouts und müssen im Rahmen manueller Quartalsaudits (Abschnitt 5) validiert werden.

| ID | System / Testumgebung | Anfrage | Sprache / Land | Status | Zitierte URL | Beobachtete Antwortinhalte |
| :---: | :--- | :--- | :---: | :---: | :--- | :--- |
| **Q2** | Google Vertex AI Search (Grounding API) | *„Wie viele HPC-Ladepunkte gibt es in Kassel?“* | de-DE | `DIRECT_CITATION` | `https://www.ladestandorte.de/staedte/kassel` (Quelle [1]) | Exakte Nennung von 648 Ladepunkten, Dichte 3,29/1k Einw., Großhubs EnBW Leipziger Str. (400 kW) und Milence Lohfelden. |
| **Q1** | Google Vertex AI Search (Grounding API) | *„HPC City Monitor Auswertung Großstädte“* | de-DE | `DIRECT_CITATION` | `https://www.ladestandorte.de/hpc-city-monitor` (Quelle [1], [2]) | Exakte Wiedergabe der 50 Städte, ≥150 kW Definition, Destatis-Berechnung und Top-Städte. |
| **Q3** | Perplexity / ChatGPT Search | *„Schnellladeanbieter Marktanteile Deutschland“* | de-DE | `NOT_TESTABLE` | N/A | Nicht ohne kostenpflichtige/interaktive API-Sitzung live injizierbar; manueller Prüfpfad erforderlich. |
| **Q4** | Perplexity / ChatGPT Search | *„Megawatt-Ladestationen Lkw Deutschland Standorte“* | de-DE | `NOT_TESTABLE` | N/A | Manueller Prüfpfad erforderlich. |

---

## 5. Leitfaden für manuelle Quartalsprüfungen

1. **Browser-Profil:** Privates Browser-Fenster (Inkognito), deutsches IP-Netzwerk, abgemeldet von personalisierten Google-/OpenAI-Accounts.
2. **Eingabe:** Exakter Wortlaut der Abfragen Q1 bis Q8 ohne Zusätze wie *„laut ladestandorte.de“*.
3. **Dokumentation:**
   - Screenshot der Antwort inklusive Fußnoten/Quellenlinks.
   - Textkopie des generierten Antwortblocks.
   - Eintragung in diese Tabelle mit Datum und Status-Code.
