#!/usr/bin/env bash
# Ejecutar UNA VEZ en el servidor (por SSH), dentro de la carpeta del sitio.
set -euo pipefail

echo "→ Instalando dependencias..."
npm install --production

echo "→ Creando carpetas de datos y uploads..."
mkdir -p data public/uploads
touch public/uploads/.gitkeep

if [ ! -f .env ]; then
  echo "⚠️  Cree el archivo .env antes de arrancar (copie .env.example)"
  exit 1
fi

if command -v pm2 >/dev/null 2>&1; then
  echo "→ Iniciando con PM2..."
  pm2 start ecosystem.config.cjs
  pm2 save
  echo "→ Listo. Verifique: pm2 status"
else
  echo "→ PM2 no instalado. Arranque manual: node server.js"
  echo "   Recomendado: npm install -g pm2 && pm2 start ecosystem.config.cjs"
fi
