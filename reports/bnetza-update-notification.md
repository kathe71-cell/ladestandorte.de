# BNetzA Update Notification Report

### NOTIFICATION METHOD
- **GitHub-native (Reviewer-Zuweisung & PR-Notification)**
- **Begründung**: Durch `reviewers: kathe71-cell` und Labels (`needs-review`, `data-update`, `automated-pr`) in `peter-evans/create-pull-request@v6` wird bei PR-Erstellung/Aktualisierung automatisch eine Review-Request-Benachrichtigung an den Inhaber ausgelöst (Web-Notification + E-Mail laut GitHub-Account-Settings). Keine externen SMTP-Credentials erforderlich.

---

### TRIGGER
- **Wann ausgelöst**: Ausschließlich, wenn:
  1. der BNetzA-Download neue Daten liefert,
  2. Aggregation, Historical Layer und CPO Layer fehlerfrei durchlaufen,
  3. alle 12 Testsuiten und der SSG-Build bestanden sind,
  4. ein tatsächlicher Git-Diff existiert und ein PR erstellt/aktualisiert wird.
- **Wann ausdrücklich NICHT ausgelöst**:
  - Bei unveränderten Rohdaten (Zero-Diff-Lauf).
  - Wenn vor Abschluss der Tests ein Fehler auftritt (Build/Test bricht ab, kein PR).
  - Es erfolgt kein Auto-Merge und kein automatisches Deployment.

---

### REQUIRED SECRETS
- **Keine zusätzlichen Secrets erforderlich**. Der Workflow nutzt ausschließlich das standardmäßige `GITHUB_TOKEN` mit den Rechten `contents: write` und `pull-requests: write`.

---

### TESTS
- **Zero Diff**: Idempotenz-Prüfung bestätigt (Pipeline erzeugt bei unveränderten Daten keinen Commit und keinen PR).
- **Erfolgreicher PR**: Script `scripts/generate-pr-summary.mjs` generiert den PR-Titel `data: BNetzA Monatsupdate YYYY-MM-DD` und den strukturierten Body in `reports/data/bnetza-pr-summary.md`.
- **Failure**: Standardmäßige GitHub-Workflow-Failure-Notifications greifen automatisch bei Job-Abbrüchen.

---

### USER ACTION
1. Bei Eintreffen der Notification den Pull Request `data: BNetzA Monatsupdate YYYY-MM-DD` auf GitHub öffnen.
2. Den strukturierten PR-Body und den Differenzbericht (`reports/data/cities/YYYY-MM-DD.md`) prüfen.
3. Den Pull Request manuell in `main` mergen.
4. Nach dem Merge wird das Vercel Production Deployment automatisch ausgeführt.

---

### RESULT
**BNetzA UPDATE NOTIFICATION VERIFIED**
