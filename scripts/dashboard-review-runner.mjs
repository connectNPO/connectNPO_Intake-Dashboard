#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const ENV_FILE = process.env.CONNECTNPO_REVIEWER_ENV || '/root/.connectnpo-reviewer.env';
const OUT_DIR = process.env.CONNECTNPO_REVIEW_OUT_DIR || '/root/connectNPO_Intake-Dashboard/.review-output';
const SENSITIVE_KEYS = [
  'contact_email',
  'contact_name',
  'intake_token',
  'private intake',
  'service_role',
  'service-role',
  'jwt',
  'password',
  'api_key',
  'apikey',
  'secret',
];

function parseEnvFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const result = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

function ensureRequired(config, key) {
  if (!config[key]) throw new Error(`Missing ${key} in ${ENV_FILE}`);
  return config[key];
}

function sameOriginUrl(baseUrl, pathname) {
  const url = new URL(baseUrl);
  return `${url.origin}${pathname}`;
}

async function safeText(locator) {
  try {
    return (await locator.innerText({ timeout: 3000 })).trim();
  } catch {
    return null;
  }
}

async function checkConsole(page, consoleMessages, pageErrors) {
  return {
    console_error_count: consoleMessages.filter((m) => ['error'].includes(m.type)).length,
    page_error_count: pageErrors.length,
  };
}

function evaluateSensitivePresence(text) {
  const lower = text.toLowerCase();
  return Object.fromEntries(SENSITIVE_KEYS.map((key) => [key, lower.includes(key.toLowerCase())]));
}

function status(name, ok, details = '') {
  return { name, status: ok ? 'PASS' : 'FAIL', details };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const config = parseEnvFile(ENV_FILE);
  const email = ensureRequired(config, 'CONNECTNPO_REVIEWER_EMAIL');
  const password = ensureRequired(config, 'CONNECTNPO_REVIEWER_PASSWORD');
  const loginUrl = ensureRequired(config, 'CONNECTNPO_LOGIN_URL');

  const report = {
    generated_at: new Date().toISOString(),
    target_origin: new URL(loginUrl).origin,
    checks: [],
    metrics: {},
    issues: [],
  };

  const consoleMessages = [];
  const pageErrors = [];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    permissions: ['clipboard-read', 'clipboard-write'],
  });
  const page = await context.newPage();
  page.on('console', (msg) => {
    if (['error', 'warning'].includes(msg.type())) {
      consoleMessages.push({ type: msg.type(), text: msg.text().slice(0, 500), url: page.url() });
    }
  });
  page.on('pageerror', (error) => pageErrors.push({ message: error.message, url: page.url() }));

  try {
    // Logged-out auth protection check first.
    const adminUrl = sameOriginUrl(loginUrl, '/admin');
    await page.goto(adminUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    report.checks.push(status('Logged-out /admin redirects to login', page.url().includes('/login'), `final_url=${page.url()}`));

    // Sign in.
    await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
    await page.locator('input[name="email"]').fill(email);
    await page.locator('input[name="password"]').fill(password);
    await Promise.all([
      page.waitForURL(/\/admin(?:\?|$|\/)/, { timeout: 30000 }),
      page.locator('button[type="submit"]').click(),
    ]).catch(async (error) => {
      const bodyText = await page.locator('body').innerText().catch(() => '');
      throw new Error(`Login failed or did not reach admin. ${error.message}. Page text: ${bodyText.slice(0, 300)}`);
    });
    report.checks.push(status('Reviewer login reaches admin', page.url().includes('/admin'), `final_url=${page.url()}`));

    // Admin dashboard.
    await page.goto(adminUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
    const adminTitle = await safeText(page.locator('h1').first());
    const organizationHrefs = await page.locator('a[href^="/admin/organizations/"]').evaluateAll((links) =>
      links
        .map((link) => link.getAttribute('href'))
        .filter((href) => Boolean(href && /^\/admin\/organizations\/[0-9a-f-]{36}$/i.test(href))),
    );
    const orgRows = organizationHrefs.length;
    report.metrics.organization_link_count = orgRows;
    report.checks.push(status('Admin dashboard loads', Boolean(adminTitle?.includes('Organizations')) || orgRows > 0, `title=${adminTitle ?? 'missing'}, organization_links=${orgRows}`));

    if (orgRows === 0) {
      report.issues.push({ severity: 'Medium', title: 'No organizations available for packet preview review' });
    } else {
      const firstOrgHref = organizationHrefs[0];
      const orgDetailUrl = sameOriginUrl(loginUrl, firstOrgHref);
      await page.goto(orgDetailUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
      const detailTitle = await safeText(page.locator('h1').first());
      const previewHref = await page.locator('a[href$="/agent-packet"]').first().getAttribute('href').catch(() => null);
      report.checks.push(status('Organization detail loads', Boolean(detailTitle), `title=${detailTitle ?? 'missing'}`));
      report.checks.push(status('Preview packet link exists', Boolean(previewHref), previewHref ?? 'missing'));

      if (previewHref) {
        const previewUrl = sameOriginUrl(loginUrl, previewHref);
        await page.goto(previewUrl, { waitUntil: 'domcontentloaded' });
        await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
        const previewText = await page.locator('body').innerText();
        const answeredText = await safeText(page.locator('text=Answered questions').locator('..'));
        const missingText = await safeText(page.locator('text=Missing required').locator('..'));
        const rawJsonText = await page.locator('pre').first().innerText({ timeout: 5000 }).catch(() => '');
        report.metrics.answered_questions = answeredText;
        report.metrics.missing_required = missingText;
        report.metrics.raw_json_present = rawJsonText.trim().startsWith('{');
        report.checks.push(status('Agent packet preview loads', previewText.includes('Raw JSON preview') && rawJsonText.trim().startsWith('{'), `answered=${answeredText ?? 'unknown'}, missing=${missingText ?? 'unknown'}`));

        let parsedPacket = null;
        try {
          parsedPacket = JSON.parse(rawJsonText);
          report.metrics.packet_version = parsedPacket.packet_version ?? null;
          report.checks.push(status('Raw JSON parses', true, `packet_version=${parsedPacket.packet_version ?? 'missing'}`));
        } catch (error) {
          report.checks.push(status('Raw JSON parses', false, error.message));
        }

        const sensitivePresence = evaluateSensitivePresence(rawJsonText);
        report.metrics.sensitive_field_presence = sensitivePresence;
        const hasSensitive = Object.values(sensitivePresence).some(Boolean);
        report.checks.push(status('Sensitive field names absent from packet JSON', !hasSensitive, JSON.stringify(sensitivePresence)));
        if (hasSensitive) {
          report.issues.push({ severity: 'High', title: 'Sensitive field name appeared in packet JSON', evidence: sensitivePresence });
        }

        const copyButton = page.getByRole('button', { name: /copy json/i });
        const hasCopyButton = await copyButton.count();
        report.checks.push(status('Copy JSON button exists', hasCopyButton > 0));
        if (hasCopyButton > 0) {
          await copyButton.first().click();
          await page.getByRole('button', { name: /copied/i }).first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
          const copiedText = await safeText(page.getByRole('button', { name: /copied/i }).first());
          report.checks.push(status('Copy JSON shows copied state', Boolean(copiedText?.includes('Copied')), copiedText ?? 'missing'));
        }

        const exportUrl = orgDetailUrl.replace('/admin/organizations/', '/api/admin/organizations/') + '/export';
        const response = await context.request.get(exportUrl);
        const contentType = response.headers()['content-type'] ?? '';
        const exportBody = await response.text();
        let exportPacketVersion = null;
        try {
          const parsedExport = JSON.parse(exportBody);
          exportPacketVersion = parsedExport.packet_version ?? null;
        } catch {}
        report.checks.push(status('Download/export JSON route works', response.ok() && Boolean(exportPacketVersion), `status=${response.status()}, content_type=${contentType}, packet_version=${exportPacketVersion ?? 'missing'}`));
      }
    }

    const consoleStatus = await checkConsole(page, consoleMessages, pageErrors);
    report.metrics.console = consoleStatus;
    report.checks.push(status('No browser console/page errors captured', consoleStatus.console_error_count === 0 && consoleStatus.page_error_count === 0, JSON.stringify(consoleStatus)));
  } finally {
    await browser.close();
  }

  const failed = report.checks.filter((c) => c.status !== 'PASS');
  report.overall_status = failed.length === 0 ? 'PASS' : 'PASS WITH ISSUES';
  report.failed_check_count = failed.length;
  report.console_messages = consoleMessages.map((m) => ({ ...m, text: m.text.replace(email, '[REDACTED]') }));
  report.page_errors = pageErrors;

  const reportPath = path.join(OUT_DIR, `dashboard-review-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log(`Overall: ${report.overall_status}`);
  console.log(`Report: ${reportPath}`);
  for (const check of report.checks) {
    console.log(`${check.status}: ${check.name}${check.details ? ` — ${check.details}` : ''}`);
  }

  if (failed.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  const message = String(error?.message ?? error).replace(/CONNECTNPO_REVIEWER_PASSWORD=.*/g, 'CONNECTNPO_REVIEWER_PASSWORD=[REDACTED]');
  console.error(`Runner failed: ${message}`);
  process.exit(1);
});
