const { randomBytes, scryptSync } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const filename = path.join(__dirname, '..', '.env.local');
const existing = fs.existsSync(filename) ? fs.readFileSync(filename, 'utf8') : '';
if (/^\s*ADMIN_(USERNAME|PASSWORD_HASH|SESSION_SECRET)\s*=/m.test(existing)) {
  console.error('Admin settings already exist in .env.local. To reset, remove the three ADMIN_* settings and run this command again. Existing sessions will be invalidated.');
  process.exit(1);
}
const username = process.argv[2] || 'admin';
if (!/^[a-zA-Z0-9._-]{1,100}$/.test(username)) throw new Error('Use 1–100 letters, digits, dots, underscores or hyphens for the username.');
const password = randomBytes(18).toString('base64url');
const salt = randomBytes(16).toString('hex');
const hash = scryptSync(password, salt, 64).toString('hex');
fs.writeFileSync(filename, `${existing}\nADMIN_USERNAME=${username}\nADMIN_PASSWORD_HASH=${salt}:${hash}\nADMIN_SESSION_SECRET=${randomBytes(48).toString('hex')}\n`, { mode: 0o600 });
console.log(`Admin configured. Store this password securely; it is shown only now.\nUsername: ${username}\nPassword: ${password}\nRestart Next.js, then open /admin.`);
