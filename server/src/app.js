const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Endpoints
app.use('/api', apiRoutes);

// Define paths for the 3 compiled frontends
const pwaPath = path.join(__dirname, '../public/pwa');
const adminPath = path.join(__dirname, '../public/admin');
const ecommercePath = path.join(__dirname, '../public/ecommerce');

function hasBuild(dir) {
  return fs.existsSync(path.join(dir, 'index.html'));
}

// 1. Mobile PWA under /app
if (hasBuild(pwaPath)) {
  app.use('/app', express.static(pwaPath, {
    setHeaders: (res, filePath) => {
      // index.html y sw.js no deben cachearse para permitir actualizaciones inmediatas en Dokploy/Cloudflare
      if (filePath.endsWith('index.html') || filePath.endsWith('sw.js')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      } else if (filePath.includes(path.sep + 'assets' + path.sep) || filePath.includes('/assets/')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }));

  // SPA fallback para rutas internas de la PWA
  app.get('/app*', (req, res) => {
    // Si la petición es por un asset JS/CSS faltante, devolver 404 estricto para evitar MIME type error (text/html)
    if (req.path.startsWith('/app/assets/') || path.extname(req.path)) {
      return res.status(404).type('text/plain').send('Asset not found');
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(pwaPath, 'index.html'));
  });
} else {
  app.get('/app*', (req, res) => {
    res.send(`
      <div style="font-family:system-ui,sans-serif;text-align:center;padding:50px;background:#090d16;color:#f8fafc;min-height:100vh;">
        <div style="font-size:3.5rem;">⚡</div>
        <h2 style="color:#f43f5e;">📱 YouTubeVolt PWA Mobile aún no compilada</h2>
        <p style="color:#94a3b8;">Ejecuta <code>npm run build:pwa</code> o compila con Docker para generar los archivos en <code>server/public/pwa</code>.</p>
        <p style="margin-top:20px;"><a style="color:#38bdf8;" href="/">Ir al Portal Web</a> | <a style="color:#38bdf8;" href="/admin">Panel Studio</a></p>
      </div>
    `);
  });
}

// 2. Control Panel under /admin
if (hasBuild(adminPath)) {
  app.use('/admin', express.static(adminPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      } else if (filePath.includes(path.sep + 'assets' + path.sep) || filePath.includes('/assets/')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }));

  app.get('/admin*', (req, res) => {
    if (req.path.startsWith('/admin/assets/') || path.extname(req.path)) {
      return res.status(404).type('text/plain').send('Asset not found');
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(adminPath, 'index.html'));
  });
} else {
  app.get('/admin*', (req, res) => {
    res.send(`
      <div style="font-family:system-ui,sans-serif;text-align:center;padding:50px;background:#090d16;color:#f8fafc;min-height:100vh;">
        <div style="font-size:3.5rem;">⚙️</div>
        <h2 style="color:#38bdf8;">⚙️ YouTubeVolt Studio aún no compilado</h2>
        <p style="color:#94a3b8;">Ejecuta <code>npm run build:admin</code> o compila con Docker para generar los archivos en <code>server/public/admin</code>.</p>
        <p style="margin-top:20px;"><a style="color:#f43f5e;" href="/app">PWA Mobile</a> | <a style="color:#38bdf8;" href="/">Portal de Videos</a></p>
      </div>
    `);
  });
}

// 3. Personalized YouTube Portal on Root /
if (hasBuild(ecommercePath)) {
  app.use(express.static(ecommercePath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(ecommercePath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <title>YouTubeVolt - Bóveda Personal de Videos</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0b0f17; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
          .card { background: #111827; padding: 2.5rem; border-radius: 1rem; max-width: 650px; text-align: center; border: 1px solid #1f2937; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
          h1 { color: #f43f5e; margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: center; gap: 8px; }
          .badge { display: inline-block; background: rgba(244,63,94,0.15); border: 1px solid rgba(244,63,94,0.3); color: #f43f5e; padding: 0.35rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; margin-bottom: 1.5rem; font-weight: 600; }
          .links { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; flex-wrap: wrap; }
          .btn { background: #e11d48; color: white; text-decoration: none; padding: 0.75rem 1.25rem; border-radius: 0.5rem; font-weight: 600; transition: background 0.2s; }
          .btn:hover { background: #be123c; }
          .status { text-align: left; background: #090d16; padding: 1rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; margin-top: 1.5rem; border: 1px solid #1f2937; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>⚡ YouTubeVolt</h1>
          <div class="badge">Bóveda Inteligente de Videos &bull; MasterClass Dokploy</div>
          <p style="color:#94a3b8;">Servidor backend activo. Para ver las interfaces compiladas ejecuta <code>npm run build:all</code> o despliega con Docker.</p>
          <div class="links">
            <a class="btn" href="/app">📱 Bóveda PWA Mobile</a>
            <a class="btn" style="background:#2563eb;" href="/admin">⚙️ Studio / Admin</a>
            <a class="btn" style="background:#10b981;" href="/api/health">🩺 Health Check</a>
            <a class="btn" style="background:#6366f1;" href="/api/videos">🎬 API Videos</a>
          </div>
          <div class="status">
            <div>• Puerto: ${PORT}</div>
            <div>• Estado DB: ${db.getDbStatus().mode}</div>
            <div>• Entorno: ${process.env.NODE_ENV || 'development'}</div>
          </div>
        </div>
      </body>
      </html>
    `);
  });
}

// Start server and initialize DB
async function start() {
  await db.initDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`⚡ YouTubeVolt Platform ejecutándose en puerto ${PORT}`);
    console.log(`   - Portal Videos: http://localhost:${PORT}/`);
    console.log(`   - Bóveda PWA:    http://localhost:${PORT}/app`);
    console.log(`   - Studio Admin:  http://localhost:${PORT}/admin`);
    console.log(`   - API Health:    http://localhost:${PORT}/api/health`);
    console.log(`   - API Videos:    http://localhost:${PORT}/api/videos`);
    console.log(`=======================================================`);
  });
}

start();
