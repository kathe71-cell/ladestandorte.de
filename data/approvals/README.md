# Data Approvals (Human-in-the-Loop Sign-off)

Dieses Verzeichnis dient der formalen, revisionssicheren Dokumentation manueller Freigaben bei Datenprüfungen, die den Status `REVIEW_REQUIRED` ausgelöst haben.

## Wann wird eine Freigabe benötigt?

Das **Datenintegritäts-Gate** (`scripts/gate/data-integrity-gate.mjs`) prüft bei jedem Build und Datenimport:
1. Upstream-Schema der Bundesnetzagentur (Hard `FAIL` bei Schema-Bruch)
2. Relationale Konsistenz zwischen Rohdaten, Aggregaten und SSR-HTML (Hard `FAIL` bei Inkonsistenz)
3. Statistische Plausibilität und Schwellenwerte:
   - Ungewöhnlicher Rückgang/Anstieg bundesweiter Ladepunkte
   - Punktverlust bei Kernbetreibern (EnBW, Tesla, Aral pulse, etc.) > 1,5 %
   - Punktverlust in Großstädten > 2,0 %

Wird eine statistische Anomalie erkannt (z. B. Stilllegungen oder amtliche Bereinigungen im Register), wechselt das Gate auf:
`🟡 REVIEW_REQUIRED (Exit-Code 2)`.

In diesem Status ist ein automatischer Build und Vercel-Deploy blockiert, bis eine stichtagsbezogene Freigabe vorliegt.

## Dateikonvention

Dateiname: `data/approvals/approval-YYYY-MM-DD.json`  
(Beispiel: `data/approvals/approval-2026-10-01.json`)

## Schema der Freigabedatei

```json
{
  "snapshotDate": "2026-10-01",
  "reviewedAt": "2026-10-12T13:00:00Z",
  "reviewedBy": "Vorname Nachname / Rolle",
  "rationale": "Detaillierte fachliche Begründung, warum die gemeldete Abweichung fachlich korrekt ist.",
  "approvedWarnings": [
    "ALL"
  ]
}
```

## Sicherheitsregeln

1. **Kein Überstimmen von `FAIL`:**  
   Eine Freigabe kann niemals einen technischen oder mathematischen Fehler (z. B. HPC > Gesamtpunkte, defektes Schema) überstimmen. Solche Fehler führen immer zu `FAIL` (Exit 1).
2. **Strikte Stichtagsbindung:**  
   Die Freigabe gilt ausschließlich für das in `snapshotDate` angegebene Datum. Veraltete Freigaben für frühere Monate werden vom Gate abgewiesen.
