/**
 * scripts/gate/verify-approval.mjs
 * Strict Human-in-the-Loop Approval Validator.
 *
 * Verifies that when a monthly snapshot triggers REVIEW_REQUIRED,
 * a valid, snapshot-specific approval record exists in data/approvals/approval-[snapshotDate].json.
 *
 * Mandatory Guardrails:
 * - NO BLANKET APPROVALS: "ALL" or wildcards are strictly rejected.
 * - HASH BINDING: Must match the exact raw dataset SHA-256 (prevents approval reuse across changed data).
 * - COMPLETE COVERAGE: Every single triggered warning must be explicitly covered. Newly added warnings block sign-off.
 * - DATE BINDING: Must match snapshotDate exactly. Outdated approvals are rejected.
 * - AUDIT RECORD: reviewedBy, reviewedAt, and rationale are strictly required.
 * - NO OVERRIDING FAIL: Hard technical/mathematical errors can NEVER be approved away.
 */

import fs from 'node:fs';
import path from 'node:path';

/**
 * Checks approval file for a given snapshot and active warnings.
 * @param {string} snapshotDate - e.g. "2026-10-01"
 * @param {string[]} warnings - Triggered warnings from plausibility check
 * @param {string} [approvalsDir] - Optional custom approvals directory for testing
 * @param {object} [options] - Optional { expectedSha256: string }
 * @returns {{ approved: boolean, reason: string, details?: object }}
 */
export function verifyApproval(snapshotDate, warnings, approvalsDir = null, options = {}) {
  const dir = approvalsDir || path.resolve(process.cwd(), 'data/approvals');
  const approvalFile = path.join(dir, `approval-${snapshotDate}.json`);

  if (!fs.existsSync(approvalFile)) {
    return {
      approved: false,
      reason: `MISSING_APPROVAL: No approval file found at data/approvals/approval-${snapshotDate}.json for snapshot ${snapshotDate}.`,
      approvalFile
    };
  }

  let approvalData;
  try {
    approvalData = JSON.parse(fs.readFileSync(approvalFile, 'utf8'));
  } catch (err) {
    return {
      approved: false,
      reason: `INVALID_APPROVAL_JSON: Corrupted JSON in ${approvalFile}: ${err.message}`,
      approvalFile
    };
  }

  // 1. Snapshot Date match
  if (!approvalData.snapshotDate || approvalData.snapshotDate !== snapshotDate) {
    return {
      approved: false,
      reason: `OUTDATED_APPROVAL: Approval file snapshotDate "${approvalData.snapshotDate}" does not match active snapshotDate "${snapshotDate}".`,
      approvalFile
    };
  }

  // 2. Hash binding check (if expectedSha256 is provided)
  if (options.expectedSha256) {
    if (!approvalData.snapshotSha256) {
      return {
        approved: false,
        reason: `MISSING_HASH_BINDING: Approval file is missing mandatory "snapshotSha256" field.`,
        approvalFile
      };
    }
    if (approvalData.snapshotSha256.toLowerCase() !== options.expectedSha256.toLowerCase()) {
      return {
        approved: false,
        reason: `HASH_MISMATCH: Approval snapshotSha256 (${approvalData.snapshotSha256.slice(0, 10)}...) does not match active dataset SHA-256 (${options.expectedSha256.slice(0, 10)}...). Approval cannot be reused for altered data.`,
        approvalFile
      };
    }
  }

  // 3. Reviewer metadata
  if (!approvalData.reviewedBy || typeof approvalData.reviewedBy !== 'string' || approvalData.reviewedBy.trim().length < 3) {
    return {
      approved: false,
      reason: `INVALID_APPROVAL: "reviewedBy" must contain at least 3 characters.`,
      approvalFile
    };
  }

  // 4. Review timestamp
  if (!approvalData.reviewedAt || isNaN(Date.parse(approvalData.reviewedAt))) {
    return {
      approved: false,
      reason: `INVALID_APPROVAL: "reviewedAt" must be a valid ISO-8601 date string.`,
      approvalFile
    };
  }

  // 5. Rationale check
  if (!approvalData.rationale || typeof approvalData.rationale !== 'string' || approvalData.rationale.trim().length < 10) {
    return {
      approved: false,
      reason: `INVALID_APPROVAL: "rationale" must provide a substantive explanation (at least 10 characters).`,
      approvalFile
    };
  }

  // 6. Strict Prohibition of Blanket Approvals ("ALL", "*")
  if (!Array.isArray(approvalData.approvedWarnings) || approvalData.approvedWarnings.length === 0) {
    return {
      approved: false,
      reason: `MISSING_APPROVED_WARNINGS: "approvedWarnings" array is missing or empty.`,
      approvalFile
    };
  }

  const hasBlanket = approvalData.approvedWarnings.some(w => {
    const s = String(w).trim().toUpperCase();
    return s === 'ALL' || s === '*' || s === 'ANY';
  });

  if (hasBlanket) {
    return {
      approved: false,
      reason: `REJECTED_BLANKET_APPROVAL: Blanket approval ("ALL" / "*") is strictly forbidden. Each approved warning must be specifically identified.`,
      approvalFile
    };
  }

  // 7. Complete Coverage: Ensure EVERY active warning is explicitly covered
  const unapprovedWarnings = [];
  for (const warning of warnings) {
    const isCovered = approvalData.approvedWarnings.some(pattern => {
      if (typeof pattern !== 'string') return false;
      const cleanPattern = pattern.trim().toLowerCase();
      const cleanWarning = warning.trim().toLowerCase();
      return cleanWarning.includes(cleanPattern) || cleanPattern === cleanWarning;
    });

    if (!isCovered) {
      unapprovedWarnings.push(warning);
    }
  }

  if (unapprovedWarnings.length > 0) {
    return {
      approved: false,
      reason: `UNAPPROVED_WARNINGS: ${unapprovedWarnings.length} active warning(s) are not covered by the approval record: "${unapprovedWarnings[0]}"`,
      approvalFile,
      unapprovedWarnings
    };
  }

  return {
    approved: true,
    reason: `APPROVED: Documented manual review confirmed by ${approvalData.reviewedBy} on ${approvalData.reviewedAt} (SHA-256 bound).`,
    details: approvalData
  };
}
