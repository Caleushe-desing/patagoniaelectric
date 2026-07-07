const bcrypt = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

const AUTH_FILE = path.join(__dirname, '..', 'data', 'auth.json');

async function initAuth() {
  try {
    await fs.access(AUTH_FILE);
  } catch {
    const password = process.env.ADMIN_PASSWORD || 'patagonia2026';
    const hash = await bcrypt.hash(password, 10);
    await fs.mkdir(path.dirname(AUTH_FILE), { recursive: true });
    await fs.writeFile(
      AUTH_FILE,
      JSON.stringify(
        {
          username: process.env.ADMIN_USER || 'admin',
          passwordHash: hash,
        },
        null,
        2
      )
    );
    console.log('Admin creado → usuario:', process.env.ADMIN_USER || 'admin');
  }
}

async function getAuth() {
  const raw = await fs.readFile(AUTH_FILE, 'utf8');
  return JSON.parse(raw);
}

async function verifyLogin(username, password) {
  const auth = await getAuth();
  if (username !== auth.username) return false;
  return bcrypt.compare(password, auth.passwordHash);
}

function requireAuth(req, res, next) {
  if (req.session?.admin) return next();
  if (req.path.startsWith('/admin/api')) {
    return res.status(401).json({ ok: false, error: 'No autorizado' });
  }
  return res.redirect('/admin/login');
}

module.exports = { initAuth, verifyLogin, requireAuth };
