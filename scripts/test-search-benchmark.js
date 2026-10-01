import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, '..', p);

const index = JSON.parse(fs.readFileSync(toAbsolute('public/search-index.json'), 'utf8'));

// Minimal implementation of searchEntities for testing in node
function clean(str) {
  return str ? str.toLowerCase().trim() : '';
}

function normalize(str) {
  return str ? str.toLowerCase().trim().replace(/ß/g, 'ss').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue') : '';
}

function testSearch(query) {
  const rawQ = query.trim();
  const q = rawQ.toLowerCase();
  const qNorm = normalize(rawQ);
  const qTokens = q.split(/[\s,/-]+/).filter(Boolean);

  const babMatch = q.match(/^(?:bab\s*|a\s*)?(\d{1,3})$/i);
  const targetBabNum = babMatch ? babMatch[1] : null;

  const matches = [];

  for (const doc of index) {
    let score = 0;
    const nameLower = clean(doc.name);
    const titleLower = clean(doc.title);
    const cityLower = clean(doc.city);
    const operatorLower = clean(doc.operator);
    const motorwayLower = clean(doc.motorway);

    if (targetBabNum && doc.category === 'motorways') {
      const docBabNum = doc.name.replace(/[^0-9]/g, '');
      if (docBabNum === targetBabNum) {
        score += 1500;
      }
    }

    if (nameLower === q || titleLower === q) {
      score += 1200;
    } else if (
      (doc.motorway && (motorwayLower === q || motorwayLower === `a${targetBabNum}`)) ||
      (doc.city && (cityLower === q || normalize(doc.city) === qNorm)) ||
      (doc.operator && (operatorLower === q || normalize(doc.operator) === qNorm))
    ) {
      score += 900;
    } else if (nameLower.startsWith(q) || titleLower.startsWith(q)) {
      score += 650;
    } else if ((doc.city && cityLower.startsWith(q)) || (doc.operator && operatorLower.startsWith(q)) || (doc.motorway && motorwayLower.startsWith(q))) {
      score += 550;
    } else {
      let allFound = true;
      let tokenBonus = 0;
      for (const token of qTokens) {
        const inName = nameLower.includes(token);
        const inTitle = titleLower.includes(token);
        const inCity = cityLower.includes(token);
        const inOp = operatorLower.includes(token);
        const inMw = motorwayLower.includes(token);
        const inKw = (doc.keywords || []).some(k => k.includes(token));
        const inPlz = clean(doc.plz).includes(token);
        const inConn = clean(doc.connectors).includes(token);

        if (inName || inTitle) tokenBonus += 150;
        else if (inCity || inMw || inOp) tokenBonus += 100;
        else if (inKw || inPlz || inConn) tokenBonus += 60;
        else {
          allFound = false;
          break;
        }
      }
      if (allFound) {
        score += 300 + tokenBonus;
      }
    }

    if (score > 0) {
      score += doc.priority || 0;
      matches.push({ doc, score });
    }
  }

  matches.sort((a, b) => b.score - a.score);

  // Group top 3 per category
  const groups = {};
  for (const m of matches) {
    groups[m.doc.category] = groups[m.doc.category] || [];
    if (groups[m.doc.category].length < 3) {
      groups[m.doc.category].push({
        title: m.doc.title,
        url: m.doc.url,
        score: m.score
      });
    }
  }

  return groups;
}

const testTerms = [
  'A3',
  'A7',
  'Frankfurt',
  'Kassel',
  'IONITY',
  'Aral',
  'MCS',
  'Lkw',
  'Rohrbrunn',
  'Ladekarten',
  '400 kW'
];

console.log('=== QA SEARCH BENCHMARK ===');
for (const term of testTerms) {
  const res = testSearch(term);
  console.log(`\n🔍 Query: "${term}"`);
  for (const [cat, items] of Object.entries(res)) {
    console.log(`  [${cat.toUpperCase()}] (${items.length} items)`);
    items.forEach(it => console.log(`    → ${it.title} (${it.url}) [score: ${it.score}]`));
  }
}
