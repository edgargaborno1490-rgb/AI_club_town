// Browser smoke test for the town page. Run: node tests/smoke.js [screenshot-dir]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = 8765;
const SHOTS = process.argv[2] || null;
const sizes = [['desktop', 1280, 800], ['phone', 390, 844]];
const IGNORED = /fonts\.(googleapis|gstatic)|ERR_TUNNEL|ERR_FAILED/;

function check(cond, msg) { if (!cond) throw new Error(msg); console.log('  ok -', msg); }

(async () => {
  const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 800));
  const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
  let failed = false;
  try {
    for (const [name, width, height] of sizes) {
      console.log(name);
      const run = async (url, setup) => {
        const page = await browser.newPage({ viewport: { width, height } });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('console', m => { if (m.type() === 'error' && !IGNORED.test(m.text())) errors.push(m.text()); });
        await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
        if (setup) await setup(page);
        await page.goto(`http://127.0.0.1:${PORT}${url}`);
        await page.waitForTimeout(2500);
        return { page, errors };
      };

      let { page, errors } = await run('/');
      check(errors.length === 0, `real mode has no page errors (${errors.join(' | ')})`);
      check(/Updated/.test(await page.textContent('#status')), 'real mode shows the "Updated" line');
      check(!(await page.isVisible('#badge')), 'real mode hides the Example data badge');
      check(/\d+ birds?: one for each TikTok follower/.test(await page.textContent('#flock')), 'real mode shows the follower birds line');
      if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `real-${name}.png`) });
      await page.close();

      ({ page, errors } = await run('/?demo'));
      check(errors.length === 0, `demo mode has no page errors (${errors.join(' | ')})`);
      check(await page.isVisible('#badge'), 'demo mode shows the Example data badge');
      check((await page.$$('.tag[data-s="working"]')).length > 0, 'demo mode has a working agent');
      if (SHOTS) await page.screenshot({ path: path.join(SHOTS, `demo-${name}.png`) });
      await page.close();

      ({ page, errors } = await run('/', p => p.route('**/town.json*', r => r.abort())));
      check(errors.length === 0, `missing data has no page errors (${errors.join(' | ')})`);
      check(/No activity data yet/.test(await page.textContent('#status')), 'missing data says "No activity data yet"');
      check((await page.$$('.tag[data-s="working"]')).length === 0, 'missing data shows nobody working');
      await page.close();

      const noTask = JSON.stringify({ agents: { chief: { status: 'working', task: '' } } });
      ({ page, errors } = await run('/', p => p.route('**/town.json*', r => r.fulfill({ contentType: 'application/json', body: noTask }))));
      check(await page.isVisible('.tag[data-id="chief"][data-s="working"] .chip'), 'working agent with no task still shows its name');
      check(!(await page.isVisible('.tag[data-id="chief"] .bubble')), 'working agent with no task shows no empty bubble');
      await page.close();
    }
  } catch (e) {
    failed = true;
    console.error('FAIL:', e.message);
  } finally {
    await browser.close();
    server.kill();
  }
  console.log(failed ? 'SMOKE FAIL' : 'SMOKE PASS');
  process.exit(failed ? 1 : 0);
})();
