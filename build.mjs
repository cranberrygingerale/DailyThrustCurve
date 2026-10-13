// Builds index.html from template.html + the thrustcurve-db npm package (data from ThrustCurve.org).
// Usage: npm install thrustcurve-db && node build.mjs
import fs from 'node:fs';
const db = JSON.parse(fs.readFileSync(new URL('./node_modules/thrustcurve-db/thrustcurve-db.json', import.meta.url), 'utf8'));

const MAX_POINTS = 40;
const sig = (n, d = 3) => Number(Number(n).toPrecision(d));

// Ramer-Douglas-Peucker on normalized coordinates, tightened until the curve fits MAX_POINTS.
function simplify(pts) {
  const tmax = pts[pts.length - 1][0] || 1, fmax = Math.max(...pts.map(p => p[1])) || 1;
  const n = pts.map(([t, f]) => [t / tmax, f / fmax]);
  const rdp = (eps) => {
    const keep = new Uint8Array(n.length); keep[0] = keep[n.length - 1] = 1;
    const stack = [[0, n.length - 1]];
    while (stack.length) {
      const [a, b] = stack.pop();
      let best = -1, bd = eps;
      const [x1, y1] = n[a], [x2, y2] = n[b], dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1e-9;
      for (let i = a + 1; i < b; i++) {
        const d = Math.abs(dy * n[i][0] - dx * n[i][1] + x2 * y1 - y2 * x1) / len;
        if (d > bd) { bd = d; best = i; }
      }
      if (best > 0) { keep[best] = 1; stack.push([a, best], [best, b]); }
    }
    return pts.filter((_, i) => keep[i]);
  };
  let eps = 0.002, out = pts;
  while ((out = rdp(eps)).length > MAX_POINTS) eps *= 1.4;
  return out;
}

const pool = db.filter(m => m.samples && m.samples.length > 3 && m.availability === 'regular' && m.type !== 'hybrid');

// Short display name: the common name (J350) plus propellant suffix where the designation has one.
const short = m => /^[A-O]\d/.test(m.designation) || /^1\/[24]A/.test(m.designation) ? m.designation : m.commonName;
const count = {};
for (const m of pool) { const k = m.manufacturerAbbrev + ' ' + short(m); count[k] = (count[k] || 0) + 1; }

let motors = pool.map(m => {
  let s = m.samples.map(([t, f]) => [t, Math.max(0, f)]);
  if (s[0][0] > 0) s.unshift([0, 0]);
  s = simplify(s);
  const k = m.manufacturerAbbrev + ' ' + short(m);
  return [
    m.manufacturerAbbrev,
    count[k] > 1 ? m.designation : short(m),
    m.impulseClass,
    sig(m.totImpulseNs, 4), sig(m.avgThrustN, 4), sig(m.burnTimeS, 3), m.diameter,
    m.propInfo || '',
    m.source_url.replace(/^https?:\/\/www\.thrustcurve\.org\/motors\//, ''),
    s.map(p => sig(p[0])), s.map(p => sig(p[1])),
  ];
});

// Fixed-seed shuffle: this order is the daily schedule. Rebuilding with new data reshuffles it.
let seed = 0x7C0FFEE;
const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
motors.sort((a, b) => (a[0] + a[1]).localeCompare(b[0] + b[1]));
for (let i = motors.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [motors[i], motors[j]] = [motors[j], motors[i]]; }

const body = fs.readFileSync(new URL('./template.html', import.meta.url), 'utf8').replace('/*__MOTORS__*/[]', () => JSON.stringify(motors));
const titleEnd = body.indexOf('</style>') + '</style>'.length;
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="A daily guessing game: name the rocket motor from its thrust curve.">
<style>body{margin:0}[hidden]{display:none!important}</style>
${body.slice(0, titleEnd)}
</head>
<body>
${body.slice(titleEnd)}
</body>
</html>
`;
fs.writeFileSync(new URL('./index.html', import.meta.url), page);
if (process.argv[2]) fs.writeFileSync(process.argv[2], body);
const names = new Set(motors.map(m => m[0] + ' ' + m[1]));
console.log(`${motors.length} motors, ${names.size} unique names, index.html ${(page.length / 1024).toFixed(0)} KB`);
