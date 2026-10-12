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
    id: 'salsa',
    name: 'Salsa Brava & Fania',
    description: 'Brunella Torpoco, Grupo Niche, Héctor Lavoe, Marc Anthony y leyendas salseras.',
    icon: 'Music',
    color: '#ef4444'
  },
  {
    id: 'pop-latino',
    name: 'Cumbia & Fiesta Latina',
    description: 'Corazón Serrano, Grupo 5, Mauricio Mesones y éxitos de la cumbia bailable.',
    icon: 'Headphones',
    color: '#06b6d4'
  },
  {
    id: 'rock-espanol',
    name: 'Rock en Español Clásico',
    description: 'Los Enanitos Verdes y los himnos inolvidables del rock de los 80s y 90s.',
    icon: 'Radio',
    color: '#8b5cf6'
  },
  {
    id: 'baladas-charlie-zaa',
    name: 'Baladas & Boleros de Charlie Zaa',
    description: 'Nuestro Juramento, boleros acústicos y duetos inolvidables del recuerdo.',
    icon: 'Heart',
    color: '#f59e0b'
  }
];

const INITIAL_VIDEOS = [
  {
    id: 1,
    youtubeVideoId: 'SiVq_x_lfxE',
    originalUrl: 'https://www.youtube.com/watch?v=SiVq_x_lfxE',
    canonicalUrl: 'https://www.youtube.com/watch?v=SiVq_x_lfxE',
    title: 'Brunella Torpoco - Mix Héctor Lavoe (Live Session)',
    channelName: 'Brunella Torpoco Oficial',
    thumbnailUrl: 'https://img.youtube.com/vi/SiVq_x_lfxE/hqdefault.jpg',
    duration: '6:49',
    durationSeconds: 409,
    description: 'Potente sesión en vivo rindiendo tributo a Héctor Lavoe con toda la fuerza y sentimiento de Brunella Torpoco.',
    personalNotes: 'Salsa perucha en vivo con arreglos excepcionales de metales y percusión.',
    watchStatus: 'watched',
    isFavorite: true,
    collectionId: 'salsa',
    collectionName: 'Salsa Brava & Fania',
    tags: ['Brunella Torpoco', 'Mix Hector Lavoe', 'Salsa', 'Live Session'],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 2,
    youtubeVideoId: 'a4Z5HRiN3rc',
    originalUrl: 'https://www.youtube.com/watch?v=a4Z5HRiN3rc',
    canonicalUrl: 'https://www.youtube.com/watch?v=a4Z5HRiN3rc',
    title: 'Corazón Serrano - Te Vas Y No Volverás (Estadio San Marcos)',
    channelName: 'Corazón Serrano',
    thumbnailUrl: 'https://img.youtube.com/vi/a4Z5HRiN3rc/hqdefault.jpg',
    duration: '3:04',
    durationSeconds: 184,
    description: 'Interpretación en vivo en el Estadio San Marcos durante el 32 Aniversario de Corazón Serrano - Camino a un Sueño.',
    personalNotes: 'Éxito rotundo de cumbia sanjuanera ante más de 40 mil personas.',
    watchStatus: 'watched',
    isFavorite: true,
    collectionId: 'pop-latino',
    collectionName: 'Cumbia & Fiesta Latina',
    tags: ['Corazon Serrano', 'Te Vas Y No Volveras', 'Cumbia', 'Estadio San Marcos'],
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  },
  {
    id: 3,
    youtubeVideoId: '7KxkMLAZlzw',
    originalUrl: 'https://www.youtube.com/watch?v=7KxkMLAZlzw',
    canonicalUrl: 'https://www.youtube.com/watch?v=7KxkMLAZlzw',
    title: 'Grupo Niche - Cali Pachanguero (Video Oficial)',
    channelName: 'Codiscos / Grupo Niche',
    thumbnailUrl: 'https://img.youtube.com/vi/7KxkMLAZlzw/hqdefault.jpg',
    duration: '4:50',
    durationSeconds: 290,
    description: 'El himno absoluto de la salsa colombiana compuesto por el gran maestro Jairo Varela e interpretado por Grupo Niche.',
    personalNotes: 'Arreglos de metales y percusión insuperables. Clave para animar la clase.',
    watchStatus: 'in_progress',
    isFavorite: true,
    collectionId: 'salsa',
    collectionName: 'Salsa Brava & Fania',
    tags: ['Grupo Niche', 'Cali Pachanguero', 'Salsa', 'Jairo Varela'],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 4,
    youtubeVideoId: 'hReAuaAuJOE',
    originalUrl: 'https://www.youtube.com/watch?v=hReAuaAuJOE',
    canonicalUrl: 'https://www.youtube.com/watch?v=hReAuaAuJOE',
    title: 'Los Enanitos Verdes - Lamento Boliviano (Video Oficial)',
    channelName: 'EnanitosVerdesVEVO',
    thumbnailUrl: 'https://img.youtube.com/vi/hReAuaAuJOE/hqdefault.jpg',
    duration: '3:44',
    durationSeconds: 224,
    description: 'Uno de los clásicos más grandes e históricos del rock en español, lanzado en 1994 con la voz inolvidable de Marciano Cantero.',
    personalNotes: 'El coro y solo de guitarra más coreado de la música en español.',
    watchStatus: 'pending',
    isFavorite: false,
    collectionId: 'rock-espanol',
    collectionName: 'Rock en Español Clásico',
    tags: ['Los Enanitos Verdes', 'Lamento Boliviano', 'Latin Rock', 'Marciano Cantero'],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 5,
    youtubeVideoId: 'YIbMejfd9KE',
    originalUrl: 'https://www.youtube.com/watch?v=YIbMejfd9KE',
    canonicalUrl: 'https://www.youtube.com/watch?v=YIbMejfd9KE',
    title: 'Charlie Zaa ft. Leslie Grace - Nuestro Juramento (En Vivo)',
    channelName: 'CharlieZaaVEVO',
    thumbnailUrl: 'https://img.youtube.com/vi/YIbMejfd9KE/hqdefault.jpg',
    duration: '4:06',
    durationSeconds: 246,
    description: 'Versión acústica en vivo de Nuestro Juramento de Charlie Zaa en colaboración con Leslie Grace del álbum Celebración.',
    personalNotes: 'Bolero moderno inolvidable con guitarras románticas y gran armonía vocal.',
    watchStatus: 'pending',
    isFavorite: true,
    collectionId: 'baladas-charlie-zaa',
    collectionName: 'Baladas & Boleros de Charlie Zaa',
    tags: ['Charlie Zaa', 'Leslie Grace', 'Nuestro Juramento', 'Bolero', 'Celebracion'],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 6,
    youtubeVideoId: 'BNo0vkEYWRc',
    originalUrl: 'https://www.youtube.com/watch?v=BNo0vkEYWRc',
    canonicalUrl: 'https://www.youtube.com/watch?v=BNo0vkEYWRc',
    title: 'Héctor Lavoe - El Cantante (Video Oficial Fania)',
    channelName: 'Fania Records',
    thumbnailUrl: 'https://img.youtube.com/vi/BNo0vkEYWRc/hqdefault.jpg',
    duration: '10:52',
    durationSeconds: 652,
    description: 'La obra maestra de la salsa dura por Héctor Lavoe con Fania Records, compuesta por Rubén Blades y producida por Willie Colón.',
    personalNotes: 'Himno legendario: "Yo soy el cantante, que hoy han venido a escuchar..."',
    watchStatus: 'in_progress',
    isFavorite: true,
    collectionId: 'salsa',
    collectionName: 'Salsa Brava & Fania',
    tags: ['Hector Lavoe', 'El Cantante', 'Fania Records', 'Salsa Dura'],
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 7,
    youtubeVideoId: 'IBlqPAkwKfY',
    originalUrl: 'https://www.youtube.com/watch?v=IBlqPAkwKfY',
    canonicalUrl: 'https://www.youtube.com/watch?v=IBlqPAkwKfY',
    title: 'Mix Cumbias Pegaditas (Grupo 5, Rossy War, Chane Meza)',
    channelName: 'Luis Rodriguez DJ',
    thumbnailUrl: 'https://img.youtube.com/vi/IBlqPAkwKfY/hqdefault.jpg',
    duration: '17:03',
    durationSeconds: 1023,
    description: 'Enganchado festivo de cumbias peruanas y colombianas con los mejores temas de Grupo 5, Rossy War y Chane Meza.',
    personalNotes: 'Mix bailable de 17 minutos cargado de alegría y ritmo para festejar.',
    watchStatus: 'pending',
    isFavorite: false,
    collectionId: 'pop-latino',
    collectionName: 'Cumbia & Fiesta Latina',
    tags: ['Grupo 5', 'Rossy War', 'Cumbia Peruana', 'Mix', 'Bailable'],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 8,
    youtubeVideoId: 'YXnjy5YlDwk',
    originalUrl: 'https://www.youtube.com/watch?v=YXnjy5YlDwk',
    canonicalUrl: 'https://www.youtube.com/watch?v=YXnjy5YlDwk',
    title: 'Marc Anthony - Vivir Mi Vida (Video Oficial)',
    channelName: 'marcanthonyVEVO',
    thumbnailUrl: 'https://img.youtube.com/vi/YXnjy5YlDwk/hqdefault.jpg',
    duration: '5:26',
    durationSeconds: 326,
    description: 'Video oficial de Vivir Mi Vida por Marc Anthony, uno de los himnos de salsa moderna más populares del mundo producido por Sergio George.',
    personalNotes: 'Cierre lleno de energía y optimismo para la sesión y el auditorio.',
    watchStatus: 'watched',
    isFavorite: true,
    collectionId: 'salsa',
    collectionName: 'Salsa Brava & Fania',
    tags: ['Marc Anthony', 'Vivir Mi Vida', 'Salsa', 'Sergio George'],
    createdAt: new Date().toISOString()
  }
];

let inMemoryVideos = JSON.parse(JSON.stringify(INITIAL_VIDEOS));
let inMemoryCollections = JSON.parse(JSON.stringify(INITIAL_COLLECTIONS));
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

    conn.release();
    isConnectedToMySQL = true;
    lastDbError = null;
  } catch (error) {
    lastDbError = error.message;
    console.warn(`⚠️ [DB] No se pudo conectar a MySQL: ${error.message}. Continuando en modo In-Memory.`);
    isConnectedToMySQL = false;
  }
}

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
  const youtubeVideoId = extractYouTubeId(videoData.url || videoData.originalUrl) || 'HbGIN3GwD8s';
  const originalUrl = videoData.url || videoData.originalUrl || `https://www.youtube.com/watch?v=${youtubeVideoId}`;
  const canonicalUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`;
  const thumbnailUrl = videoData.thumbnailUrl || `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
  const title = videoData.title || `Video Musical ${youtubeVideoId}`;
  const channelName = videoData.channelName || 'Artista de YouTube';
  const duration = videoData.duration || '4:00';
  const durationSeconds = videoData.durationSeconds || 240;
  const description = videoData.description || '';
  const personalNotes = videoData.personalNotes || '';
  const watchStatus = videoData.watchStatus || 'pending';
  const isFavorite = Boolean(videoData.isFavorite);
  const collectionId = videoData.collectionId || 'salsa';
  
  const foundCol = inMemoryCollections.find(c => c.id === collectionId);
  const collectionName = foundCol ? foundCol.name : (videoData.collectionName || 'General');
  const tags = Array.isArray(videoData.tags) ? videoData.tags : (typeof videoData.tags === 'string' ? videoData.tags.split(',').map(t => t.trim()).filter(Boolean) : ['Música']);

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

async function getStats() {
  const videos = await getVideos();
  const collections = await getCollections();

  const totalVideos = videos.length;
  const pendingCount = videos.filter(v => v.watchStatus === 'pending').length;
  const inProgressCount = videos.filter(v => v.watchStatus === 'in_progress').length;
  const watchedCount = videos.filter(v => v.watchStatus === 'watched').length;
  const favoriteCount = videos.filter(v => v.isFavorite).length;

  const totalSeconds = videos.reduce((acc, v) => acc + (v.durationSeconds || 240), 0);
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

async function exportVault() {
  const videos = await getVideos();
  const collections = await getCollections();
  return {
    app: 'YouTubeVolt',
    theme: 'MusicVault (Salsa, Rock en Español, Charlie Zaa)',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    stats: await getStats(),
    collections,
    videos
  };
}

async function importVault(data) {
  if (!data || !Array.isArray(data.videos)) {
    throw new Error('Formato de exportación inválido.');
  }

  let importedCount = 0;
  for (const v of data.videos) {
    const existing = inMemoryVideos.find(ev => ev.youtubeVideoId === v.youtubeVideoId);
    if (!existing) {
      await addVideo(v);
      importedCount++;
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
  getDbStatus
};
