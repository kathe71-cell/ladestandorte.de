# Redaktionelle Evergreen-SEO- & Inhaltskonventionen
**Projekt:** `ladestandorte.de`  
**Geltungsbereich:** Gesamtes Portal (Seotitel, H1, Zwischenüberschriften, Fließtext, strukturierte Daten)  
**Status:** Verbindliche redaktionelle Richtlinie

---

## 1. Grundsatz: Evergreen vor Jahreszahlen

Jahreszahlen werden auf `ladestandorte.de` **nicht dekorativ oder automatisch** in SEO-Titeln, Hauptüberschriften (`<h1>`), Zwischenüberschriften oder redaktionellen Evergreen-Texten verwendet.

Eine Jahreszahl ist ausschließlich dann zulässig, wenn sie für das Verständnis der fachlichen Aussage, gesetzliche Fristen oder die reale Suchintention des Nutzers zwingend erforderlich ist.

---

## 2. Die drei Kategorien zur Klassifikation von Jahreszahlen

### Kategorie A: Dekorative Jahreszahl (STRIKT UNZULÄSSIG)
* **Definition:** Reine Anhängsel wie `„2026“`, `„2027“` in Titeln, Metatags oder Headings, die künstliche Aktualität vortäuschen oder jährliche manuelle Wartung erzwingen, ohne dass das behandelte Thema an ein Kalenderjahr gebunden ist.
* **Beispiele (nicht verwenden):**
  - ❌ *„Ladebordstein: Funktion, Kosten & Bordsteinlader 2026“*
  - ❌ *„MCS-Ratgeber: Megawatt Charging 2026“*
  - ❌ *„Ladekarten-Vergleich 2026“*
  - ❌ *„Elektroauto schnellladen 2026“*
* **Regel:** Jahreszahl streichen. Zeitlose, fachlich präzise Formulierung wählen.

### Kategorie B: Fachlich notwendige Jahreszahl (ZULÄSSIG & ERFORDERLICH)
* **Definition:** Die Jahreszahl ist integraler Bestandteil des fachlichen Sachverhalts, der behördlichen Frist oder des gesetzlichen Anspruchs.
* **Beispiele (beibehalten):**
  - ✅ *„THG-Prämie 2026“* (spezifisches Verpflichtungs- und Meldejahr nach 38. BImSchV)
  - ✅ *„THG-Prämie 2027“* (zukünftiges Antragsjahr mit eigener Marktpreisentwicklung)
  - ✅ *„UBA-Meldeschluss zum 15. November 2026“* (konkrete behördliche Frist)
  - ✅ *„Nachrüstpflicht für bestehende TEN-V-Schnelllader zum 1. Januar 2027 nach AFIR“*
  - ✅ *„Verordnung (EU) 2023/1804“* (amtliche Gesetzesbezeichnung)
* **Regel:** Jahreszahl exakt beibehalten. Nicht pauschal oder automatisiert verändern.

### Kategorie C: Historische Angaben & amtliche Datenstände (ZULÄSSIG)
* **Definition:** Zeitstempel, Veröffentlichungsdaten oder historische Projektdaten, die der wissenschaftlichen und journalistischen Nachprüfbarkeit dienen.
* **Beispiele (beibehalten):**
  - ✅ *„Kölner Pilotprojekt Herbert-Lewin-Straße (April 2024 bis Frühjahr 2025)“*
  - ✅ *„BNetzA-Datenstand: 01.10.2026“*
  - ✅ *`datePublished`*, *`dateModified`* und *`sitemap.xml <lastmod>`*
  - ✅ *„Destatis Zensus 2022 Fortschreibung zum 31.12.2024“*
* **Regel:** Datenstände und Provenienzangaben sachlich korrekt dokumentieren.

---

## 3. Verbot automatischer Jahresrotation

Es darf **keine Laufzeitlogik** implementiert werden, die Jahreszahlen in Titeln, Überschriften oder Texten dynamisch oder zeitgesteuert rotiert:
- ❌ **Kein `new Date().getFullYear()`** in SEO-Titeln, Headings oder Fachinhalten.
- **Begründung:** Automatisierte Jahresrotation erzeugt fachlich falsche Aussagen (z. B. würde eine THG-Prämie 2026 unbeabsichtigt zu 2027 werden, bevor Quotenpreise oder UBA-Fristen geregelt sind).

---

## 4. Handhabung von Sitemap und Strukturierten Daten

1. **`lastmod` in `sitemap.xml`:**
   - Wird nur aktualisiert, wenn eine Seite tatsächlich eine wesentliche inhaltliche, redaktionelle oder datenbasierte Änderung erfahren hat.
   - Keine pauschale Massenaktualisierung aller URLs bei reinen Build- oder Code-Deployments.
2. **`datePublished` & `dateModified`:**
   - `datePublished` dokumentiert den Tag der Erstveröffentlichung.
   - `dateModified` wird nur bei echten, substanziellen Text- oder Datenaktualisierungen angepasst.
