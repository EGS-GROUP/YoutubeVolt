const mysql = require('mysql2/promise');

// Utilidad para extraer el ID de YouTube
function extractYouTubeId(url) {
  if (!url) return null;
  const str = String(url).trim();
  const matchWatch = str.match(/(?:youtube\.com\/watch\?.*v=)([^&]+)/i);
  if (matchWatch && matchWatch[1]) return matchWatch[1];
  const matchShort = str.match(/youtu\.be\/([^?&#]+)/i);
  if (matchShort && matchShort[1]) return matchShort[1];
  const matchShorts = str.match(/youtube\.com\/shorts\/([^?&#]+)/i);
  if (matchShorts && matchShorts[1]) return matchShorts[1];
  const matchEmbed = str.match(/youtube\.com\/embed\/([^?&#]+)/i);
  if (matchEmbed && matchEmbed[1]) return matchEmbed[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
  return null;
}

const INITIAL_COLLECTIONS = [
  {
    id: 'ia-agentes',
    name: 'Inteligencia Artificial & Agentes',
    description: 'LLMs, Agentes Autónomos, Modelos de Lenguaje y RAG.',
    icon: 'Sparkles',
    color: '#8b5cf6'
  },
  {
    id: 'cloud-devops',
    name: 'Cloud, Docker & Dokploy',
    description: 'Despliegues continuos, contenedores y self-hosting.',
    icon: 'Cloud',
    color: '#06b6d4'
  },
  {
    id: 'desarrollo-web-mobile',
    name: 'Desarrollo Web & Mobile (PWA/Kotlin)',
    description: 'Frontend reactivo, PWAs, Compose y arquitecturas móviles.',
    icon: 'Smartphone',
    color: '#ef4444'
  },
  {
    id: 'arquitectura-clean',
    name: 'Arquitectura Limpia & Clean Code',
    description: 'Patrones de diseño, SOLID, MVI y buenas prácticas.',
    icon: 'Layers',
    color: '#f59e0b'
  },
  {
    id: 'data-bi',
    name: 'Data Engineering & Big Data',
    description: 'Pipelines de datos, Analytics, SQL y Machine Learning.',
    icon: 'Database',
    color: '#10b981'
  }
];

const INITIAL_VIDEOS = [
  {
    id: 1,
    youtubeVideoId: '5sLYA38pX4s',
    originalUrl: 'https://www.youtube.com/watch?v=5sLYA38pX4s',
    canonicalUrl: 'https://www.youtube.com/watch?v=5sLYA38pX4s',
    title: '¿Qué son los Agentes de IA y cómo transformarán el software?',
    channelName: 'DotCSV',
    thumbnailUrl: 'https://img.youtube.com/vi/5sLYA38pX4s/hqdefault.jpg',
    duration: '22:15',
    durationSeconds: 1335,
    description: 'Introducción conceptual profunda a los agentes autónomos de IA, bucles de razonamiento (ReAct) y herramientas.',
    personalNotes: 'Concepto clave: Los agentes no solo predicen texto, ejecutan acciones en el mundo real mediante APIs y Tools.',
    watchStatus: 'in_progress',
    isFavorite: true,
    collectionId: 'ia-agentes',
    collectionName: 'Inteligencia Artificial & Agentes',
    tags: ['AI', 'Agentes', 'LLMs', 'Autonomía'],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 2,
    youtubeVideoId: '31ieHmcTUOk',
    originalUrl: 'https://www.youtube.com/watch?v=31ieHmcTUOk',
    canonicalUrl: 'https://www.youtube.com/watch?v=31ieHmcTUOk',
    title: 'Curso de Docker desde cero para principiantes',
    channelName: 'Midudev',
    thumbnailUrl: 'https://img.youtube.com/vi/31ieHmcTUOk/hqdefault.jpg',
    duration: '45:30',
    durationSeconds: 2730,
    description: 'Aprende contenedores, Dockerfiles, docker-compose y cómo desplegar aplicaciones web completas.',
    personalNotes: 'Revisar la configuración multi-stage build para optimizar el peso de imágenes en Dokploy.',
    watchStatus: 'watched',
    isFavorite: true,
    collectionId: 'cloud-devops',
    collectionName: 'Cloud, Docker & Dokploy',
    tags: ['Docker', 'Containers', 'DevOps', 'Dokploy'],
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  },
  {
    id: 3,
    youtubeVideoId: 'd3k5fH4u_0Y',
    originalUrl: 'https://www.youtube.com/watch?v=d3k5fH4u_0Y',
    canonicalUrl: 'https://www.youtube.com/watch?v=d3k5fH4u_0Y',
    title: 'Arquitectura Limpia (Clean Architecture) explicada con ejemplos',
    channelName: 'MoureDev by Brais Moure',
    thumbnailUrl: 'https://img.youtube.com/vi/d3k5fH4u_0Y/hqdefault.jpg',
    duration: '38:40',
    durationSeconds: 2320,
    description: 'Separación por capas: Dominio, Casos de Uso, Datos y Presentación con ejemplos prácticos.',
    personalNotes: 'El dominio nunca debe depender del framework de interfaz ni del driver de base de datos.',
    watchStatus: 'pending',
    isFavorite: false,
    collectionId: 'arquitectura-clean',
    collectionName: 'Arquitectura Limpia & Clean Code',
    tags: ['Clean Architecture', 'Software Design', 'SOLID', 'Buenas Prácticas'],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 4,
    youtubeVideoId: 'T_wKhn5xNfA',
    originalUrl: 'https://www.youtube.com/watch?v=T_wKhn5xNfA',
    canonicalUrl: 'https://www.youtube.com/watch?v=T_wKhn5xNfA',
    title: 'PWA (Progressive Web Apps) Tutorial Práctico con React y Vite',
    channelName: 'Fazt Code',
    thumbnailUrl: 'https://img.youtube.com/vi/T_wKhn5xNfA/hqdefault.jpg',
    duration: '28:10',
    durationSeconds: 1690,
    description: 'Cómo transformar una aplicación React en una PWA instalable con Service Workers y caché offline.',
    personalNotes: 'Utilizar el manifest.json con display standalone y theme-color oscuro #0b0f17.',
    watchStatus: 'watched',
    isFavorite: true,
    collectionId: 'desarrollo-web-mobile',
    collectionName: 'Desarrollo Web & Mobile (PWA/Kotlin)',
    tags: ['PWA', 'React', 'ServiceWorker', 'Offline'],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 5,
    youtubeVideoId: 'NWONeJKn6kc',
    originalUrl: 'https://www.youtube.com/watch?v=NWONeJKn6kc',
    canonicalUrl: 'https://www.youtube.com/watch?v=NWONeJKn6kc',
    title: 'Machine Learning & Big Data Analytics - Curso Completo',
    channelName: 'NextCollege Tech',
    thumbnailUrl: 'https://img.youtube.com/vi/NWONeJKn6kc/hqdefault.jpg',
    duration: '1:15:00',
    durationSeconds: 4500,
    description: 'Fundamentos de analítica avanzada, procesamiento de datos masivos y modelos predictivos.',
    personalNotes: 'Excelente para el módulo de ciencia de datos del máster.',
    watchStatus: 'pending',
    isFavorite: true,
    collectionId: 'data-bi',
    collectionName: 'Data Engineering & Big Data',
    tags: ['Machine Learning', 'Big Data', 'Python', 'Analytics'],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 6,
    youtubeVideoId: 't2Pz0Wz7Z2Y',
    originalUrl: 'https://www.youtube.com/watch?v=t2Pz0Wz7Z2Y',
    canonicalUrl: 'https://www.youtube.com/watch?v=t2Pz0Wz7Z2Y',
    title: 'Kotlin Multiplatform: Comparte lógica de negocio entre iOS y Android',
    channelName: 'AristiDevs',
    thumbnailUrl: 'https://img.youtube.com/vi/t2Pz0Wz7Z2Y/hqdefault.jpg',
    duration: '32:45',
    durationSeconds: 1965,
    description: 'Estructura de proyectos KMP, Koin para inyección de dependencias y SQLDelight para persistencia nativa.',
    personalNotes: 'Mapear este flujo con la versión PWA para la comparativa arquitectónica de la clase.',
    watchStatus: 'pending',
    isFavorite: true,
    collectionId: 'desarrollo-web-mobile',
    collectionName: 'Desarrollo Web & Mobile (PWA/Kotlin)',
    tags: ['Kotlin', 'KMP', 'Compose', 'Mobile'],
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
  }
];

// Fallback legacy products for backward compatibility
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'YouTubeVolt Bóveda Pro Edition',
    category: 'Software',
    price: 0,
    stock: 999,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    description: 'Acceso ilimitado a la bóveda personal offline-first de videos de YouTube.'
  }
];

let inMemoryVideos = JSON.parse(JSON.stringify(INITIAL_VIDEOS));
let inMemoryCollections = JSON.parse(JSON.stringify(INITIAL_COLLECTIONS));
let inMemoryProducts = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
let pool = null;
let isConnectedToMySQL = false;
let lastDbError = null;

async function initDB() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const user = process.env.DB_USER || 'pablovaldivia';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'demo';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  if (!process.env.DB_HOST && !process.env.DATABASE_URL) {
    console.log('⚡ [DB] Sin variables de MySQL detectadas. Operando en modo In-Memory ultrarrápido.');
    isConnectedToMySQL = false;
    return;
  }

  try {
    console.log(`🔌 [DB] Conectando a MySQL en ${host}:${port}...`);
    pool = mysql.createPool({
      host,
      user,
      password,
      database,
      port,
      waitForConnections: true,
      connectionLimit: 10,
      connectTimeout: 4000
    });

    const conn = await pool.getConnection();
    console.log(`✅ [DB] Conexión establecida exitosamente con MySQL (${database})`);

    // Crear tablas necesarias
    await conn.query(`
      CREATE TABLE IF NOT EXISTS collections (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description VARCHAR(500),
        icon VARCHAR(50) DEFAULT 'folder',
        color VARCHAR(50) DEFAULT '#ef4444',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS videos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        youtubeVideoId VARCHAR(64) NOT NULL,
        originalUrl VARCHAR(500) NOT NULL,
        canonicalUrl VARCHAR(500) NOT NULL,
        title VARCHAR(255) NOT NULL,
        channelName VARCHAR(255) NOT NULL,
        thumbnailUrl VARCHAR(500) NOT NULL,
        duration VARCHAR(50) DEFAULT '10:00',
        durationSeconds INT DEFAULT 600,
        description TEXT,
        personalNotes TEXT,
        watchStatus VARCHAR(50) DEFAULT 'pending',
        isFavorite BOOLEAN DEFAULT FALSE,
        collectionId VARCHAR(100) DEFAULT 'general',
        collectionName VARCHAR(100) DEFAULT 'General',
        tags JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Seed inicial si está vacía
    const [existing] = await conn.query('SELECT COUNT(*) as count FROM videos');
    if (existing[0].count === 0) {
      console.log('🌱 [DB] Sembrando datos iniciales de YouTubeVolt en MySQL...');
      for (const c of INITIAL_COLLECTIONS) {
        await conn.query(
          'INSERT IGNORE INTO collections (id, name, description, icon, color) VALUES (?, ?, ?, ?, ?)',
          [c.id, c.name, c.description, c.icon, c.color]
        );
      }
      for (const v of INITIAL_VIDEOS) {
        await conn.query(
          `INSERT INTO videos (youtubeVideoId, originalUrl, canonicalUrl, title, channelName, thumbnailUrl, duration, durationSeconds, description, personalNotes, watchStatus, isFavorite, collectionId, collectionName, tags)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            v.youtubeVideoId,
            v.originalUrl,
            v.canonicalUrl,
            v.title,
            v.channelName,
            v.thumbnailUrl,
            v.duration,
            v.durationSeconds,
            v.description,
            v.personalNotes,
            v.watchStatus,
            v.isFavorite,
            v.collectionId,
            v.collectionName,
            JSON.stringify(v.tags)
          ]
        );
      }
    }

    conn.release();
    isConnectedToMySQL = true;
    lastDbError = null;
  } catch (error) {
    lastDbError = error.message;
    console.warn(`⚠️ [DB] No se pudo conectar a MySQL: ${error.message}. Continuando en modo In-Memory.`);
    isConnectedToMySQL = false;
  }
}

// -------------------------------------------------------------
// Operaciones de Bóveda: Videos
// -------------------------------------------------------------
async function getVideos(filters = {}) {
  let list = [];
  if (isConnectedToMySQL && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM videos ORDER BY id DESC');
      list = rows.map(r => ({
        ...r,
        isFavorite: Boolean(r.isFavorite),
        tags: typeof r.tags === 'string' ? JSON.parse(r.tags) : (r.tags || [])
      }));
    } catch (err) {
      console.error('Error consultando MySQL videos:', err.message);
      list = inMemoryVideos;
    }
  } else {
    list = inMemoryVideos;
  }

  // Filtrado local
  if (filters.search) {
    const q = filters.search.toLowerCase().trim();
    list = list.filter(v => 
      v.title.toLowerCase().includes(q) ||
      v.channelName.toLowerCase().includes(q) ||
      (v.personalNotes && v.personalNotes.toLowerCase().includes(q)) ||
      (v.tags && v.tags.some(t => t.toLowerCase().includes(q))) ||
      v.collectionName.toLowerCase().includes(q)
    );
  }

  if (filters.collection && filters.collection !== 'all') {
    list = list.filter(v => v.collectionId === filters.collection);
  }

  if (filters.status && filters.status !== 'all') {
    list = list.filter(v => v.watchStatus === filters.status);
  }

  if (filters.favorite === true || filters.favorite === 'true') {
    list = list.filter(v => v.isFavorite === true);
  }

  return list;
}

async function getVideoById(id) {
  const numId = parseInt(id, 10);
  if (isConnectedToMySQL && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM videos WHERE id = ?', [numId]);
      if (rows.length > 0) {
        const r = rows[0];
        return {
          ...r,
          isFavorite: Boolean(r.isFavorite),
          tags: typeof r.tags === 'string' ? JSON.parse(r.tags) : (r.tags || [])
        };
      }
    } catch (err) {
      console.error('Error buscando video en MySQL:', err.message);
    }
  }
  return inMemoryVideos.find(v => v.id === numId) || null;
}

async function addVideo(videoData) {
  const youtubeVideoId = extractYouTubeId(videoData.url || videoData.originalUrl) || 'dQw4w9WgXcQ';
  const originalUrl = videoData.url || videoData.originalUrl || `https://www.youtube.com/watch?v=${youtubeVideoId}`;
  const canonicalUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
  const thumbnailUrl = videoData.thumbnailUrl || `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
  const title = videoData.title || `Video YouTube ${youtubeVideoId}`;
  const channelName = videoData.channelName || 'Canal de YouTube';
  const duration = videoData.duration || '15:00';
  const durationSeconds = videoData.durationSeconds || 900;
  const description = videoData.description || '';
  const personalNotes = videoData.personalNotes || '';
  const watchStatus = videoData.watchStatus || 'pending';
  const isFavorite = Boolean(videoData.isFavorite);
  const collectionId = videoData.collectionId || 'ia-agentes';
  
  const foundCol = inMemoryCollections.find(c => c.id === collectionId);
  const collectionName = foundCol ? foundCol.name : (videoData.collectionName || 'General');
  const tags = Array.isArray(videoData.tags) ? videoData.tags : (typeof videoData.tags === 'string' ? videoData.tags.split(',').map(t => t.trim()).filter(Boolean) : ['YouTube']);

  if (isConnectedToMySQL && pool) {
    try {
      const [result] = await pool.query(
        `INSERT INTO videos (youtubeVideoId, originalUrl, canonicalUrl, title, channelName, thumbnailUrl, duration, durationSeconds, description, personalNotes, watchStatus, isFavorite, collectionId, collectionName, tags)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          youtubeVideoId,
          originalUrl,
          canonicalUrl,
          title,
          channelName,
          thumbnailUrl,
          duration,
          durationSeconds,
          description,
          personalNotes,
          watchStatus,
          isFavorite,
          collectionId,
          collectionName,
          JSON.stringify(tags)
        ]
      );
      return {
        id: result.insertId,
        youtubeVideoId,
        originalUrl,
        canonicalUrl,
        title,
        channelName,
        thumbnailUrl,
        duration,
        durationSeconds,
        description,
        personalNotes,
        watchStatus,
        isFavorite,
        collectionId,
        collectionName,
        tags,
        createdAt: new Date().toISOString()
      };
    } catch (err) {
      console.error('Error insertando en MySQL, fallback a memoria:', err.message);
    }
  }

  const newVideo = {
    id: Date.now(),
    youtubeVideoId,
    originalUrl,
    canonicalUrl,
    title,
    channelName,
    thumbnailUrl,
    duration,
    durationSeconds,
    description,
    personalNotes,
    watchStatus,
    isFavorite,
    collectionId,
    collectionName,
    tags,
    createdAt: new Date().toISOString()
  };

  inMemoryVideos.unshift(newVideo);
  return newVideo;
}

async function updateVideo(id, updates) {
  const numId = parseInt(id, 10);
  if (isConnectedToMySQL && pool) {
    try {
      const current = await getVideoById(numId);
      if (!current) return null;
      const updated = { ...current, ...updates };
      await pool.query(
        `UPDATE videos SET title=?, channelName=?, personalNotes=?, watchStatus=?, isFavorite=?, collectionId=?, collectionName=?, tags=? WHERE id=?`,
        [
          updated.title,
          updated.channelName,
          updated.personalNotes,
          updated.watchStatus,
          Boolean(updated.isFavorite),
          updated.collectionId,
          updated.collectionName,
          JSON.stringify(updated.tags),
          numId
        ]
      );
      return updated;
    } catch (err) {
      console.error('Error actualizando video en MySQL:', err.message);
    }
  }

  const index = inMemoryVideos.findIndex(v => v.id === numId);
  if (index === -1) return null;
  inMemoryVideos[index] = { ...inMemoryVideos[index], ...updates };
  return inMemoryVideos[index];
}

async function deleteVideo(id) {
  const numId = parseInt(id, 10);
  if (isConnectedToMySQL && pool) {
    try {
      await pool.query('DELETE FROM videos WHERE id = ?', [numId]);
      return true;
    } catch (err) {
      console.error('Error eliminando video en MySQL:', err.message);
    }
  }
  inMemoryVideos = inMemoryVideos.filter(v => v.id !== numId);
  return true;
}

// -------------------------------------------------------------
// Operaciones de Bóveda: Colecciones
// -------------------------------------------------------------
async function getCollections() {
  if (isConnectedToMySQL && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM collections');
      if (rows.length > 0) return rows;
    } catch (err) {
      console.error('Error obteniendo colecciones en MySQL:', err.message);
    }
  }
  return inMemoryCollections;
}

async function addCollection(data) {
  const newCol = {
    id: data.id || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: data.name,
    description: data.description || '',
    icon: data.icon || 'Folder',
    color: data.color || '#ef4444'
  };

  if (isConnectedToMySQL && pool) {
    try {
      await pool.query(
        'INSERT INTO collections (id, name, description, icon, color) VALUES (?, ?, ?, ?, ?)',
        [newCol.id, newCol.name, newCol.description, newCol.icon, newCol.color]
      );
    } catch (err) {
      console.error('Error agregando coleccion a MySQL:', err.message);
    }
  }
  inMemoryCollections.push(newCol);
  return newCol;
}

// -------------------------------------------------------------
// Métricas y Estadísticas de la Bóveda
// -------------------------------------------------------------
async function getStats() {
  const videos = await getVideos();
  const collections = await getCollections();

  const totalVideos = videos.length;
  const pendingCount = videos.filter(v => v.watchStatus === 'pending').length;
  const inProgressCount = videos.filter(v => v.watchStatus === 'in_progress').length;
  const watchedCount = videos.filter(v => v.watchStatus === 'watched').length;
  const favoriteCount = videos.filter(v => v.isFavorite).length;

  const totalSeconds = videos.reduce((acc, v) => acc + (v.durationSeconds || 600), 0);
  const totalHours = (totalSeconds / 3600).toFixed(1);

  return {
    totalVideos,
    pendingCount,
    inProgressCount,
    watchedCount,
    favoriteCount,
    totalCollections: collections.length,
    totalHours,
    dbStatus: getDbStatus()
  };
}

// -------------------------------------------------------------
// Backup: Export / Import / Reset
// -------------------------------------------------------------
async function exportVault() {
  const videos = await getVideos();
  const collections = await getCollections();
  return {
    app: 'YouTubeVolt',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    stats: await getStats(),
    collections,
    videos
  };
}

async function importVault(data) {
  if (!data || !Array.isArray(data.videos)) {
    throw new Error('Formato de exportación inválido: debe contener un array de videos.');
  }

  let importedCount = 0;
  for (const v of data.videos) {
    const existing = inMemoryVideos.find(ev => ev.youtubeVideoId === v.youtubeVideoId);
    if (!existing) {
      await addVideo(v);
      importedCount++;
    }
  }

  if (Array.isArray(data.collections)) {
    for (const c of data.collections) {
      const existing = inMemoryCollections.find(ec => ec.id === c.id);
      if (!existing) {
        await addCollection(c);
      }
    }
  }

  return { success: true, importedVideos: importedCount };
}

async function resetVideos() {
  inMemoryVideos = JSON.parse(JSON.stringify(INITIAL_VIDEOS));
  inMemoryCollections = JSON.parse(JSON.stringify(INITIAL_COLLECTIONS));

  if (isConnectedToMySQL && pool) {
    try {
      await pool.query('TRUNCATE TABLE videos');
      await pool.query('TRUNCATE TABLE collections');
      for (const c of INITIAL_COLLECTIONS) {
        await pool.query(
          'INSERT INTO collections (id, name, description, icon, color) VALUES (?, ?, ?, ?, ?)',
          [c.id, c.name, c.description, c.icon, c.color]
        );
      }
      for (const v of INITIAL_VIDEOS) {
        await pool.query(
          `INSERT INTO videos (youtubeVideoId, originalUrl, canonicalUrl, title, channelName, thumbnailUrl, duration, durationSeconds, description, personalNotes, watchStatus, isFavorite, collectionId, collectionName, tags)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            v.youtubeVideoId,
            v.originalUrl,
            v.canonicalUrl,
            v.title,
            v.channelName,
            v.thumbnailUrl,
            v.duration,
            v.durationSeconds,
            v.description,
            v.personalNotes,
            v.watchStatus,
            v.isFavorite,
            v.collectionId,
            v.collectionName,
            JSON.stringify(v.tags)
          ]
        );
      }
    } catch (err) {
      console.error('Error reseteando MySQL:', err.message);
    }
  }
}

// -------------------------------------------------------------
// Legacy Products Support (Compatibilidad)
// -------------------------------------------------------------
async function getProducts() {
  return inMemoryProducts;
}
async function addProduct(p) {
  inMemoryProducts.unshift({ id: Date.now(), ...p });
  return inMemoryProducts[0];
}
async function deleteProduct(id) {
  inMemoryProducts = inMemoryProducts.filter(p => p.id !== parseInt(id, 10));
  return true;
}
async function resetProducts() {
  inMemoryProducts = [...INITIAL_PRODUCTS];
}

function getDbStatus() {
  return {
    mode: isConnectedToMySQL ? 'mysql' : 'in-memory',
    connected: isConnectedToMySQL,
    host: process.env.DB_HOST || (process.env.DATABASE_URL ? 'via-database-url' : 'no-configurado'),
    database: process.env.DB_NAME || 'demo',
    user: process.env.DB_USER || 'pablovaldivia',
    error: lastDbError
  };
}

module.exports = {
  extractYouTubeId,
  initDB,
  getVideos,
  getVideoById,
  addVideo,
  updateVideo,
  deleteVideo,
  getCollections,
  addCollection,
  getStats,
  exportVault,
  importVault,
  resetVideos,
  getProducts,
  addProduct,
  deleteProduct,
  resetProducts,
  getDbStatus
};
