const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { scryptSync, randomBytes } = require('node:crypto');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText, file);
const auth = require('../lib/admin-auth.ts');
const store = require('../lib/prices.ts');

test('admin credentials, signed sessions, rotation and throttling', async () => {
  const salt = randomBytes(16).toString('hex');
  process.env.ADMIN_USERNAME = 'test-admin';
  process.env.ADMIN_PASSWORD_HASH = `${salt}:${scryptSync('test-password', salt, 64).toString('hex')}`;
  process.env.ADMIN_SESSION_SECRET = randomBytes(48).toString('hex');
  assert.equal(auth.verifySession(), false);
  assert.equal(await auth.checkCredentials('wrong-user', 'test-password'), 'invalid');
  assert.equal(await auth.checkCredentials('test-admin', 'wrong-password'), 'invalid');
  assert.equal(await auth.checkCredentials('test-admin', 'test-password'), 'ok');
  const token = auth.createSession();
  assert.equal(auth.verifySession(token), true);
  assert.equal(auth.verifySession(token + 'a'), false);
  assert.equal(auth.verifySession('0.' + token.split('.').slice(1).join('.')), false);
  const realNow = Date.now;
  try { Date.now = () => realNow() + auth.SESSION_SECONDS * 1000 + 1; assert.equal(auth.verifySession(token), false); }
  finally { Date.now = realNow; }
  process.env.ADMIN_SESSION_SECRET = randomBytes(48).toString('hex');
  assert.equal(auth.verifySession(token), false);
  for (let i = 0; i < 10; i++) assert.equal(await auth.checkCredentials('test-admin', 'wrong'), 'invalid');
  assert.equal(await auth.checkCredentials('test-admin', 'test-password'), 'limited');
  delete process.env.ADMIN_SESSION_SECRET;
  assert.equal(auth.authConfigured(), false);
  assert.throws(() => auth.createSession());
});

test('prices persist, starting price is the minimum, invalid and conflicting writes cannot overwrite data', async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'sp-steel-test-'));
  process.env.PRICE_DATA_DIR = directory;
  try {
    const initial = await store.getCatalog();
    const product = initial.products[0];
    for (const invalid of [[1], [-1,2,3,4], [NaN,2,3,4], [Infinity,2,3,4], [1.001,2,3,4], ['1',2,3,4], [100000001,2,3,4]]) {
      await assert.rejects(store.savePrices(product.slug, invalid, initial.revision));
    }
    await assert.rejects(store.savePrices('../escape', [1,2,3,4], initial.revision));
    const revision = await store.savePrices(product.slug, [800, 123.45, 900, 0], initial.revision);
    const updated = await store.getCatalog();
    assert.equal(updated.products[0].price, 0);
    assert.equal(updated.products[0].options[1].price, 123.45);
    assert.deepEqual(updated.products[1], initial.products[1]);
    assert.equal(JSON.parse(fs.readFileSync(path.join(directory,'prices.json'),'utf8')).revision, revision);
    // Reloading the module simulates a fresh process reading the same persisted file.
    delete require.cache[require.resolve('../lib/prices.ts')];
    assert.equal((await require('../lib/prices.ts').getCatalog()).products[0].options[1].price, 123.45);
    await assert.rejects(store.savePrices(product.slug, [1,2,3,4], initial.revision), /หน้าต่างอื่น/);
    const writes = await Promise.allSettled([store.savePrices(product.slug,[10,20,30,40],revision), store.savePrices(product.slug,[50,60,70,80],revision)]);
    assert.equal(writes.filter(r => r.status === 'fulfilled').length, 1);
    fs.writeFileSync(path.join(directory, 'prices.json'), '{broken');
    await assert.rejects(store.getCatalog());
    await assert.rejects(store.savePrices(product.slug, [1,2,3,4], revision));
    assert.equal(fs.readFileSync(path.join(directory,'prices.json'),'utf8'), '{broken');
  } finally { fs.rmSync(directory, { recursive: true, force: true }); delete process.env.PRICE_DATA_DIR; }
});
