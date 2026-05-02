#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const DOCS = path.join(process.cwd(), 'content', 'docs');

function extractH1(body, fallback) {
  for (const line of body.split('\n')) {
    const t = line.trim();
    if (t.startsWith('# ')) return t.slice(2).trim();
  }
  return fallback;
}

function escapeYaml(s) {
  return s.replace(/"/g, '\\"');
}

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.mdx')) fix(p);
  }
}

function fix(file) {
  const content = fs.readFileSync(file, 'utf-8');
  const fallback = path.basename(file, '.mdx');
  if (content.startsWith('---\n')) {
    const end = content.indexOf('\n---\n', 4);
    if (end < 0) return;
    const fm = content.slice(4, end);
    const body = content.slice(end + 5);
    if (/^title\s*:/m.test(fm)) return;
    const title = extractH1(body, fallback);
    const newFm = `title: "${escapeYaml(title)}"\n${fm}`;
    fs.writeFileSync(file, `---\n${newFm}\n---\n${body}`);
  }
}

walk(DOCS);
console.log('Titles fixed.');
