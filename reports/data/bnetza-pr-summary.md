## ⚡ BNetzA Monatsupdate (2026-10-01)

Der automatisierte Datenaktualisierungs-Workflow hat einen neuen amtlichen BNetzA-Registerstand erfolgreich heruntergeladen, validiert und aggregiert.

---

### 📊 Zentrale Kennzahlen des Datenstands

| Metrik | Neuer Stand (2026-10-01) | Anmerkung |
| :--- | :--- | :--- |
| **BNetzA-Stichtag / Snapshot** | `2026-10-01` | Amtliches Register (CC BY 4.0) |
| **Vorgänger-Snapshot** | `Kein Vorgänger-Snapshot (Initialbestand)` | Raw Data Archiv |
| **Ladepunkte bundesweit (gesamt)** | **210.185** | 100 % registererfasst |
| **High-Power-Charging (≥150 kW)** | **40.654** (19.3 %) | Leistungsklasse ≥150 kW |
| **Ausgewertete Großstädte** | **50 Städte** | Destatis Zensus-Fortschreibung 2024 |
| **Verifizierte Betreiber (CPOs)** | **30 CPOs** | DSGVO-konform ohne Einzelpersonen |

---

### 📂 Aktualisierte Datenendpunkte & Artefakte

- `src/data/generated/cities.generated.json` (Top 50 Städte)
- `src/data/generated/cpo-monitor.generated.json` (30 verifizierte CPOs)
- `src/data/generated/hpc-history.generated.json` (Zeitreihen & Deltas)
- `public/data/hpc-city-monitor.json` & `.csv`
- `public/data/cpo-monitor.json` & `.csv`
- `public/data/hpc-history.json`
- `reports/data/cities/2026-10-01.md` (Detaillierter Differenzbericht)

---

### ✅ Qualitäts- & Regressionsprüfung

- **Unit- & Integritätstests**: 12/12 Testsuiten erfolgreich bestanden
- **SSG-Prerendering**: 210 statische HTML-Routen fehlerfrei vorgerendert
- **DSGVO-Datenschutzfilter**: 0 natürliche Personen veröffentlicht
- **UWG- & Siegel-Compliance**: 0 unzulässige Siegel oder unbegründete Superlative
- **Idempotenz**: Verifiziert (Zero-Diff bei unveränderten Daten)

---

> [!IMPORTANT]
> **Manuelles Review und Merge erforderlich!**  
> Die neuen Daten sind noch **nicht** live. Dieser Pull Request erfordert ein manuelles Review und wird **nicht automatisch** gemergt. Nach dem Merge wird das Vercel Production Deployment angestoßen.
