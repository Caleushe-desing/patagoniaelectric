const path = require('path');
const fs = require('fs').promises;

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.svg']);
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/x-png',
  'image/svg+xml',
  'image/svg',
]);

function normalizeExt(filename = '') {
  return path.extname(filename).toLowerCase();
}

function isAllowedImage(file) {
  if (!file) return false;
  const ext = normalizeExt(file.originalname || file.filename || '');
  const mime = String(file.mimetype || '').toLowerCase().trim();

  if (!ALLOWED_EXTENSIONS.has(ext)) return false;

  // Algunos navegadores envían SVG sin MIME o con application/octet-stream
  if (ext === '.svg') {
    return !mime || mime === 'application/octet-stream' || ALLOWED_MIME_TYPES.has(mime);
  }

  return ALLOWED_MIME_TYPES.has(mime);
}

function sanitizeSvgBuffer(buffer) {
  let text = buffer.toString('utf8');

  if (!/<svg[\s\S]*?>/i.test(text)) {
    throw new Error('El archivo SVG no es válido');
  }

  // Quitar contenido peligroso habitual en SVG subidos por CMS
  text = text
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<foreignObject\b[\s\S]*?<\/foreignObject>/gi, '')
    .replace(/<!ENTITY[\s\S]*?>/gi, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:\s*text\s*\/\s*html/gi, '')
    .replace(/xlink:href\s*=\s*(["'])\s*javascript:[^"']*\1/gi, 'xlink:href=$1#$1');

  if (!/<svg[\s\S]*?>/i.test(text)) {
    throw new Error('El SVG quedó inválido tras la limpieza de seguridad');
  }

  return Buffer.from(text, 'utf8');
}

async function finalizeUploadedImage(file) {
  if (!file?.path) return file;
  const ext = normalizeExt(file.filename || file.originalname || '');
  if (ext !== '.svg') return file;

  const raw = await fs.readFile(file.path);
  const clean = sanitizeSvgBuffer(raw);
  await fs.writeFile(file.path, clean);
  return file;
}

module.exports = {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  isAllowedImage,
  sanitizeSvgBuffer,
  finalizeUploadedImage,
  normalizeExt,
};
