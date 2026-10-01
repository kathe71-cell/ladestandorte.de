# Feasibility-Audit: BNetzA-Daten als CPO-/Betreiber-Datenlayer

## 1. Source Fields (Tatsächliche BNetzA-Felder)

In der amtlichen CSV `bnetza_api_ladestation000.csv` (117.043 Standorte, 210.185 Ladepunkte im Snapshot 01.10.2026) existieren folgende betreiberbezogene Spalten:

| Spaltenname | Index | Datentyp | Befüllung | Unique Values | Beschreibung / Zweck |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `betreiber` | 1 | String | 100 % (117.043/117.043) | 11.750 | Vollständiger, unbereinigter Firmen-/Personenname laut Registermeldung |
| `betreiber_anzeigename` | 2 | String | 100 % (117.043/117.043) | 11.750 | Identisch mit Feld 1, teils gekürzt |
| `betreiber_bereinigt` | 3 | String | 100 % (117.043/117.043) | 11.677 | Amtlich bereinigter Name (ohne Rechtsformzusätze wie `GmbH`, `AG & Co. KG`) |
| `betreiber_kategorie` | 4 | String | 100 % (117.043/117.043) | 10 Kategorien | Amtliche Branchenklassifikation (`Sonstiges`, `privates Energieunternehmen`, etc.) |

---

## 2. Semantik & Register-Realität

- **Keine einheitliche CPO-Rolle**: Das Feld `betreiber` erfasst den meldepflichtigen Betreiber der Ladeeinrichtung gemäß Ladesäulenverordnung (LSV). Es unterscheidet **nicht** zwischen Roaming-EMP, CPO-Infrastruktureigentümer, Pächter oder Parkplatzinhaber.
- **Unternehmen vs. Arbeitgeber/Autohäuser**: In Stuttgart ist z. B. `Mercedes-Benz` mit 1.218 Ladepunkten der größte Registereintrag (Werks-/Mitarbeiter- und Niederlassungs-Ladeinfrastruktur mit öffentlicher Zugänglichkeit). Ein reiner „CPO“-Begriff würde diesen Kontext verzerren.
- **Empfohlene Semantik**: Stets als **„Betreiber laut amtlichem Ladesäulenregister“** bezeichnen, niemals als „CPO-Marktanteil“.

---

## 3. Coverage & Marktkonzentration

- **Erfassungsquote**: 100 % aller Ladepunkte und Standorte haben einen dokumentierten Betreibernamen. Es gibt 0 Null- oder Leerwerte.
- **Long-Tail vs. Konzentration**:
  - Insgesamt existieren **11.677 verschiedene bereinigte Betreibernamen**.
  - Die **Top 10 Betreiber** vereinen **38.808 Ladepunkte (18,5 % des gesamten Registers)** auf sich.
  - Die **Top 1 Betreiber** (`EnBW mobility+`) führt mit **11.334 Ladepunkten (5,4 %)** bundesweit.
  - Bei High-Power-Charging (**≥150 kW**) ist die Konzentration deutlich höher: Die Top 5 Betreiber (`EnBW`, `Tesla`, `BP Europa / Aral pulse`, `Shell`, `EWE Go`) halten **49,5 % aller bundesweit erfassten HPC-Ladepunkte** (20.126 von 40.654 HPC-Ladepunkten).

---

## 4. Raw Name Quality & Normalisierungs-Risiken

### A. Rechtsformbereinigung ist weitgehend gelöst
Das amtliche Feld `betreiber_bereinigt` entfernt bereits automatisch Rechtsformen (`EnBW mobility+ AG und Co.KG` → `EnBW mobility+`).

### B. Das „Over-Merging“-Risiko (Unternehmensgruppen)
In der BNetzA-Rohdatei treten Konzernteile als getrennte juristische Personen auf:
- `E.ON Drive Germany GmbH` (3.187 Stationen, Schwerpunkt Normalladen/AC)
- `E.ON Drive Infrastructure GmbH` (794 Stationen, Schwerpunkt High-Power-Charging/HPC)
- `Tesla Germany GmbH` (3.950 Stationen) vs. `Tesla Manufacturing Brandenburg SE` (567 Stationen)
- `BP Europa SE` (1.579 Stationen) vs. kein direkter Eintrag namens „Aral pulse“ im Betreiberfeld (wird über BP gemeldet)

**Konsequenz**: Ein automatisches Zusammenführen ohne manuelle Entity-Zuordnung ist methodisch unzulässig und führt zu irreführenden Kennzahlen.

### C. Keine Fuzzy-Matching-Automation
Tippfehler und leichte Namensabweichungen dürfen **niemals** unüberwacht per Levenshtein-Distanz o. ä. aggregiert werden. Es ist zwingend eine Mapping-Tabelle (`operatorEntityId`) mit Review-Prozess erforderlich.

---

## 5. Privacy & Datenschutz (DSGVO-Risiko)

- **Natürliche Personen im Datensatz**: Im Snapshot wurden **3.802 Standorte** identifiziert, bei denen der Betreibername dem Muster einer **natürlichen Person** entspricht (z. B. Einzelunternehmer, Freiberufler, Vermieter, Privatärzte ohne juristische Firmenbezeichnung).
- **Klassifikation**: Die BNetzA führt diese unter der Kategorie `Sonstiges`.
- **Datenschutz-Vorgabe für ein Datenprodukt**:
  - **Keine ungeprüfte Veröffentlichung von Personenlisten**: Ein Betreiber-Monitor darf **nur** juristische Personen / gewerbliche Marken mit Mindestbestand darstellen (z. B. Schwellenwert: Mindestens 20 Ladepunkte oder redaktionell verifizierte Organisation).
  - Kleinbetreiber mit Personennamen müssen im aggregierten Layer unter *„Sonstige / Private Betreiber“* zusammengefasst werden.

---

## 6. Klassifikation der Betreiber-Kennzahlen

| Kennzahl | Machbarkeit | Status | Begründung / Methodik |
| :--- | :---: | :---: | :--- |
| **Ladepunkte pro Register-Betreiber** | Hoch | **SAFE** | Deterministisch zählbar aus `bnetza_api_ladepunkt000.csv` |
| **Ladepunkte ≥150 kW (HPC-Klasse)** | Hoch | **SAFE** | Deterministisch zählbar über `nennleistung >= 150` |
| **Anteil ≥150 kW am Betreiberbestand** | Hoch | **SAFE** | Formel: `hpc / gesamt * 100` |
| **Geografische Präsenz (Bundesländer / Städte)** | Hoch | **SAFE** | Zählbar über Standort-Koordinaten und ARS/Gemeindeschlüssel |
| **Durchschnittliche & mediane Ladeleistung** | Hoch | **SAFE** | Mathematisch eindeutig ableitbar |
| **City × Betreiber Matrix** | Hoch | **SAFE** | Auf die 50 Städte deterministisch aggregierbar |
| **Marktanteil am Gesamtmarkt** | Keine | **UNSAFE** | Unzulässig; BNetzA-Register bildet keine Roaming-/Umsatzdaten ab |
| **CPO-Ranking über Konzerngrenzen** | Mittel | **CONDITIONAL** | Nur mit manuell gepflegtem Entity-Mapping (`operator-mapping.json`) |

---

## 7. Historische Vergleichbarkeit (Time Series)

- **Betreiber-Übertragungen (Operator Transfer)**: Bei Fusionen oder Standortverkäufen wechseln Stationen den Betreibernamen in der BNetzA. Ohne Entity-Historie würde ein Zeitreihen-Monitor fälschlicherweise „Rückbau“ bei Betreiber A und „Ausbau“ bei Betreiber B ausweisen.
- **Umbenennungen**: Änderungen des amtlichen Namens führen im Register zu neuen Keys.

---

## 8. Empfehlung & Architektur-Design

1. **Kein öffentlicher CPO-Monitor ohne Entity-Mapping**: Ein rein automatisierter CPO-Monitor auf Basis von Rohtexten würde Unternehmensgruppen zerreißen (E.ON, BP/Aral) und Datenschutzprobleme bei Einzelpersonen aufwerfen.
2. **Machbarer Zwischenschritt (Stufe 1)**:
   - Die bestehenden `topBetreiber` in den 50 Stadtdossiers werden bereits auf Basis von `betreiber_bereinigt` gebildet – dies ist datenanalytisch stabil und nützlich.
3. **Ausbau zu einem Betreiber-Datenprodukt (Stufe 2)**:
   - Erstellung einer verifizierten Mapping-Datei `src/data/mappings/operators.json` für die Top 30 CPOs (EnBW, Tesla, Aral pulse / BP, Ionity, EWE Go, Allego, Fastned, Pfalzwerke, E.ON, Shell).
   - Filterung von Betreibern mit < 20 Ladepunkten zum Schutz natürlicher Personen.
   - Kennzeichnung als *„Registerbestand des Anbieters laut Bundesnetzagentur“* (kein Marktanteil).

---

## 9. Finales CPO-Urteil

**`CPO DATA LAYER READY WITH MANUAL ENTITY MAPPING`**
