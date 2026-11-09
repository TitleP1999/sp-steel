// Run after npm run build. Uses its own server, random credentials and temporary data.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { randomBytes, scryptSync } = require('node:crypto');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, file);
const { defaultSiteContent } = require('../data/site-content.ts');

async function main() {
  const root = path.resolve(__dirname, '..');
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sp-steel-http-'));
  const socket = net.createServer();
  socket.listen(0, '127.0.0.1'); await once(socket, 'listening');
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  const base = `http://127.0.0.1:${port}`;
  const password = randomBytes(18).toString('hex');
  const salt = randomBytes(16).toString('hex');
  const env = { ...process.env, NODE_ENV: 'production', PRICE_DATA_DIR: directory, SITE_CONTENT_DATA_DIR: directory, QUOTE_REQUEST_DATA_DIR: directory, ADMIN_USERNAME: 'http-test', ADMIN_PASSWORD_HASH: `${salt}:${scryptSync(password, salt, 64).toString('hex')}`, ADMIN_SESSION_SECRET: randomBytes(48).toString('hex') };
  let server;
  let logs = '';
  async function start() {
    server = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'start', '-p', String(port), '-H', '127.0.0.1'], { cwd: root, env, windowsHide: true, stdio: ['ignore','pipe','pipe'] });
    server.stdout.on('data', data => { logs += data; }); server.stderr.on('data', data => { logs += data; });
    for (let i = 0; i < 100; i++) {
      if (server.exitCode !== null) throw new Error(logs);
      try { if ((await fetch(base + '/admin/login')).ok) return; } catch {}
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    throw new Error('Server startup timed out: ' + logs);
  }
  async function stop() { if (server && server.exitCode === null) { const exit = once(server, 'exit'); server.kill(); await exit; } }
  const decode = text => text.replaceAll('&quot;', '"').replaceAll('&#x27;', "'").replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
  async function signIn(candidate) {
    const html = await (await fetch(base + '/admin/login')).text();
    const form = new FormData();
    for (const input of html.matchAll(/<input\b[^>]*>/g)) {
      const name = input[0].match(/name="([^"]+)"/)?.[1];
      if (name?.startsWith('$ACTION')) form.append(decode(name), decode(input[0].match(/value="([^"]*)"/)?.[1] || ''));
    }
    assert.ok([...form.keys()].length, 'Server-rendered action fields exist');
    form.set('username', 'http-test'); form.set('password', candidate);
    return fetch(base + '/admin/login', { method: 'POST', body: form, headers: { Origin: base }, redirect: 'manual' });
  }
  const manifest = JSON.parse(fs.readFileSync(path.join(root, '.next/server/server-reference-manifest.json'), 'utf8'));
  const serverDir = path.join(root, '.next/server');
  const compiled = [
    path.join(serverDir, 'app/admin/page.js'),
    ...fs.readdirSync(path.join(serverDir, 'chunks'))
      .filter(file => file.endsWith('.js'))
      .map(file => path.join(serverDir, 'chunks', file)),
  ].map(file => fs.readFileSync(file, 'utf8'));
  function actionId(name) {
    const id = Object.keys(manifest.node).find(id =>
      manifest.node[id].workers['app/admin/page'] &&
      compiled.some(source => {
        const index = source.indexOf(id);
        return index >= 0 && source.slice(index, index + 180).match(/\.then\(\w+=>\w+\.(\w+)\)/)?.[1] === name;
      })
    );
    assert.ok(id, `Built action ${name} found`); return id;
  }
  const saveId = actionId('updatePrices');
  async function adminAction(id, args, cookie) {
    return fetch(base + '/admin', {
      method: 'POST', redirect: 'manual',
      headers: { 'Next-Action': id, 'Content-Type': 'text/plain;charset=UTF-8', Accept: 'text/x-component', Origin: base, ...(cookie ? { Cookie: cookie } : {}) },
      body: JSON.stringify(args),
    });
  }
  async function save(cookie, values, revision, origin = base) {
    return fetch(base + '/admin', { method: 'POST', redirect: 'manual', headers: { 'Next-Action': saveId, 'Content-Type': 'text/plain;charset=UTF-8', Accept: 'text/x-component', Origin: origin, ...(cookie ? { Cookie: cookie } : {}) }, body: JSON.stringify(['c-channel', values, revision]) });
  }
  try {
    await start();
    const denied = await fetch(base + '/admin', { redirect: 'manual' });
    assert.equal(denied.status, 307); assert.equal(denied.headers.get('location'), '/admin/login');
    const unauthorized = await save('', [1,2,3,4], 'initial'); await unauthorized.text();
    assert.equal(fs.existsSync(path.join(directory, 'prices.json')), false);
    assert.ok(unauthorized.status === 303 || unauthorized.headers.get('x-action-redirect'));
    const wrong = await signIn('wrong');
    assert.equal(wrong.headers.get('set-cookie'), null);
    assert.match(await wrong.text(), /ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง/);
    const loggedIn = await signIn(password);
    assert.equal(loggedIn.status, 303);
    const setCookie = loggedIn.headers.get('set-cookie');
    assert.match(setCookie, /HttpOnly/i); assert.match(setCookie, /Secure/i); assert.match(setCookie, /SameSite=strict/i);
    const cookie = setCookie.split(';')[0];
    const admin = await fetch(base + '/admin', { headers: { Cookie: cookie } });
    assert.equal(admin.status, 200); assert.match(await admin.text(), /จัดการราคาเหล็ก/);
    const siteFile = path.join(directory, 'site-content.json');
    const siteAction = actionId('updateSiteContent');
    const site = structuredClone(defaultSiteContent);
    site.home.heading = 'Editable Homepage Banner';
    site.contact.title = 'Editable Contact Page';
    site.branches[0].phone = '089-555-1234';
    await (await adminAction(siteAction, [site, 'initial'])).text();
    assert.equal(fs.existsSync(siteFile), false);
    const badSite = structuredClone(site);
    badSite.branches[0].embed = 'https://example.com/maps/embed';
    await (await adminAction(siteAction, [badSite, 'initial'], cookie)).text();
    assert.equal(fs.existsSync(siteFile), false);
    const contentSaved = await adminAction(siteAction, [site, 'initial'], cookie);
    assert.equal(contentSaved.status, 200);
    await contentSaved.text();
    assert.equal(JSON.parse(fs.readFileSync(siteFile, 'utf8')).content.contact.title, site.contact.title);
    for (const [route, heading] of [['/', site.home.heading], ['/contact', site.contact.title]]) {
      const response = await fetch(base + route);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.ok(html.includes(heading), `${route} displays the saved heading`);
      assert.ok(html.includes('tel:0895551234'), `${route} displays the shared phone`);
    }
    const quoteFile = path.join(directory, 'quote-requests.json');
    const quoteId = '21a2c4de-cc56-4d17-9729-238b95a5229b';
    fs.writeFileSync(quoteFile, JSON.stringify([{ id: quoteId, name: 'Test request', phone: '', product: 'Steel', details: '', status: 'new', createdAt: new Date().toISOString() }]));
    const readAction = actionId('readQuoteRequest');
    await (await adminAction(readAction, [quoteId])).text();
    assert.equal(JSON.parse(fs.readFileSync(quoteFile, 'utf8'))[0].status, 'new');
    await (await adminAction(readAction, [quoteId], cookie)).text();
    assert.equal(JSON.parse(fs.readFileSync(quoteFile, 'utf8'))[0].status, 'contacted');
    assert.match(await (await fetch(base + '/admin', { headers: { Cookie: cookie } })).text(), /ดูแล้ว/);
    const csrf = await save(cookie, [1,2,3,4], 'initial', 'https://attacker.invalid'); await csrf.text();
    assert.equal(fs.existsSync(path.join(directory, 'prices.json')), false);
    await (await save(cookie, [-1,2,3,4], 'initial')).text();
    assert.equal(fs.existsSync(path.join(directory, 'prices.json')), false);
    const saved = await save(cookie, [12345.67,null,34567,45678], 'initial');
    assert.equal(saved.status, 200); await saved.text();
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(directory,'prices.json'),'utf8')).prices['c-channel'], [12345.67,null,34567,45678]);
    for (const route of ['/', '/products', '/products/c-channel', '/steel-prices']) {
      const response = await fetch(base + route); assert.equal(response.status, 200);
      assert.match(await response.text(), /12,345\.67/, `${route} renders updated price`);
    }
    await (await save(cookie, [1,2,3,4], 'initial')).text();
    assert.equal(JSON.parse(fs.readFileSync(path.join(directory,'prices.json'),'utf8')).prices['c-channel'][0], 12345.67);
    const logout = await fetch(base + '/admin', { method: 'POST', redirect: 'manual', headers: { 'Next-Action': actionId('logout'), 'Content-Type': 'text/plain;charset=UTF-8', Accept: 'text/x-component', Origin: base, Cookie: cookie }, body: '[]' });
    await logout.text(); assert.match(logout.headers.get('set-cookie'), /sp-steel-admin=;/);
    await stop(); await start();
    assert.match(await (await fetch(base + '/products/c-channel')).text(), /12,345\.67/);
    console.log('PASS: admin auth, price publishing, shared homepage/contact content, quote read status, conflict handling, logout and restart.');
  } finally { await stop(); fs.rmSync(directory, { recursive: true, force: true }); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
