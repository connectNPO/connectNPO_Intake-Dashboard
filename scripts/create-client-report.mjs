#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const result = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const idx = trimmed.indexOf('=');
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    result[key] = value;
  }
  return result;
}

function arg(name) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return null;
  return process.argv[idx + 1] ?? null;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function inlineMarkdown(value) {
  return escapeHtml(value).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function markdownToHtml(markdown) {
  const blocks = [];
  const lines = markdown.split(/\r?\n/);
  let list = [];
  const flushList = () => {
    if (list.length) {
      blocks.push(`<ul>${list.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('')}</ul>`);
      list = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (line.startsWith('# ')) {
      flushList();
      blocks.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`);
    } else if (line.startsWith('## ')) {
      flushList();
      blocks.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
    } else if (line.startsWith('### ')) {
      flushList();
      blocks.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`);
    } else if (line.startsWith('- ')) {
      list.push(line.slice(2));
    } else {
      flushList();
      blocks.push(`<p>${inlineMarkdown(line)}</p>`);
    }
  }
  flushList();
  return blocks.join('\n');
}

function extractReportHtml(html) {
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) return articleMatch[1].trim();

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1].trim();

  return html.trim();
}

const localEnv = parseEnvFile(path.join(process.cwd(), '.env.local'));
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || localEnv.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || localEnv.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const title = arg('title');
const htmlPath = arg('html');
const markdownPath = arg('markdown');
const organizationId = arg('organization-id');
const tokenArg = arg('token');
const status = arg('status') || 'client_ready';

if (!title || (!htmlPath && !markdownPath)) {
  console.error('Usage: node scripts/create-client-report.mjs --title "Report Title" [--organization-id UUID] [--html path] [--markdown path] [--token token]');
  process.exit(1);
}

const reportMarkdown = markdownPath ? fs.readFileSync(markdownPath, 'utf8') : null;
const reportHtml = htmlPath
  ? extractReportHtml(fs.readFileSync(htmlPath, 'utf8'))
  : markdownToHtml(reportMarkdown ?? '');
const secureToken = tokenArg || `rpt_${crypto.randomBytes(18).toString('base64url')}`;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const payload = {
  organization_id: organizationId || null,
  secure_token: secureToken,
  title,
  report_html: reportHtml,
  report_markdown: reportMarkdown,
  status,
  approved_at: ['approved', 'client_ready'].includes(status) ? new Date().toISOString() : null,
  disabled_at: null,
};

const { data, error } = await supabase
  .from('client_reports')
  .upsert(payload, { onConflict: 'secure_token' })
  .select('id, secure_token, title, status')
  .single();

if (error) {
  console.error(`Failed to save client report: ${error.message}`);
  process.exit(1);
}

const origin = process.env.NEXT_PUBLIC_SITE_URL || process.env.CONNECTNPO_SITE_URL || 'https://connectnpo-web-6we2.vercel.app';
console.log(JSON.stringify({
  id: data.id,
  title: data.title,
  status: data.status,
  token: data.secure_token,
  url: `${origin}/reports/${data.secure_token}`,
}, null, 2));
