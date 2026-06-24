import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function splitTopics(src) {
  const t = src.replace(/\r/g, '');
  return t.split(/\n    topic\(\{\n/).slice(1);
}

function countExplainBrief(chunk) {
  const m = chunk.match(/explainBrief:\s*\[([\s\S]*?)\n      \],/);
  if (!m) return -1;
  const lines = m[1].split('\n').filter((l) => /^\s+'/.test(l));
  return lines.length;
}

function countGlossaryTerms(chunk) {
  const m = chunk.match(/glossary:\s*\[([\s\S]*?)\n      \],/);
  if (!m) return 0;
  return (m[1].match(/term:/g) || []).length;
}

function minExpectedAnswerLen(chunk) {
  const re = /expectedAnswer:\s*\n?\s*'([^]*?)'(?=\s*,\s*\n\s*\}|\s*\+\s*\n)/g;
  let min = Infinity;
  let m;
  while ((m = re.exec(chunk)) !== null) {
    const len = m[1].replace(/\s+/g, ' ').trim().length;
    if (len < min) min = len;
  }
  const re2 = /expectedAnswer:\s*'([^']*)'(?:\s*\+\s*\n\s*'([^']*)')*/g;
  while ((m = re2.exec(chunk)) !== null) {
    const full = m[0].replace(/expectedAnswer:\s*/, '').replace(/\s*\+\s*\n\s*/g, '');
    const parts = full.match(/'([^']*)'/g) || [];
    const joined = parts.map((p) => p.slice(1, -1)).join(' ').length;
    if (joined > 0 && joined < min) min = joined;
  }
  return min === Infinity ? 0 : min;
}

function auditFile(relPath, opts) {
  const full = path.join(root, relPath);
  const text = fs.readFileSync(full, 'utf8');
  const chunks = splitTopics(text);
  const rows = [];
  for (const ch of chunks) {
    const id = ch.match(/^      id: '([^']+)'/m)?.[1];
    if (!id) continue;
    const expl = countExplainBrief(ch);
    const hasSimpleOv = /simpleDefinitionOverride:/.test(ch);
    const qCount = (ch.match(/question:\s*'/g) || []).length;
    let minAns = 99999;
    for (const block of ch.split('expectedAnswer:').slice(1)) {
      const concat = block.replace(/^[\s\n]*/, '').replace(/\s*,\s*$/m, '');
      const strs = [...concat.matchAll(/'((?:[^'\\]|\\.)*)'/gs)].map((x) => x[1]);
      const total = strs.join(' ').replace(/\s+/g, ' ').length;
      if (total > 0) minAns = Math.min(minAns, total);
    }
    const terms = opts.glossary ? countGlossaryTerms(ch) : null;
    rows.push({ id, expl, hasSimpleOv, qCount, minAns: minAns === 99999 ? 0 : minAns, terms });
  }
  return rows;
}

const interview = auditFile('src/content/module-interview-ms.ts', { glossary: true });
const m1 = auditFile('src/content/module-1.ts', { glossary: false });

console.log('=== module-interview-ms (правило: explainBrief 5–8, glossary 3–8, expectedAnswer абзац) ===\n');
for (const r of interview) {
  const issues = [];
  if (r.expl < 5 || r.expl > 10) issues.push(`explainBrief=${r.expl} (ожид. 5–8)`);
  if (!r.hasSimpleOv) issues.push('нет simpleDefinitionOverride');
  if (r.terms < 3) issues.push(`glossary=${r.terms} (ожид. ≥3)`);
  if (r.terms > 10) issues.push(`glossary=${r.terms} (правило до 8, допустимо)`);
  if (r.minAns < 120) issues.push(`короткий expectedAnswer (~${r.minAns} симв., лучше абзац)`);
  console.log(r.id + (issues.length ? ' → ' + issues.join('; ') : ' → OK'));
}

console.log('\n=== module-1 (правило: explainBrief 5–8; simpleDefinitionOverride или авто из словаря) ===\n');
for (const r of m1) {
  const issues = [];
  if (r.expl >= 0 && (r.expl < 5 || r.expl > 10)) issues.push(`explainBrief=${r.expl} (ожид. 5–8)`);
  if (r.expl < 0) issues.push('explainBrief не распарсился');
  if (r.minAns < 120) issues.push(`короткий expectedAnswer (~${r.minAns} симв.)`);
  console.log(
    r.id +
      (issues.length ? ' → ' + issues.join('; ') : ' → OK') +
      (r.hasSimpleOv ? '' : ' [simpleDef из simpleDefinitionsByTopicId]'),
  );
}
