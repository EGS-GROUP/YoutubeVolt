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
    name: 'Salsa Brava & Clásica',
    description: 'Héctor Lavoe, Grupo Niche, Marc Anthony, Frankie Ruiz y leyendas de Fania.',
    icon: 'Music',
    color: '#ef4444'
  },
  {
    id: 'rock-espanol',
    name: 'Rock en Español Clásico',
    description: 'Soda Stereo, Enanitos Verdes, Hombres G, Los Prisioneros y los 80s/90s.',
    icon: 'Radio',
    color: '#8b5cf6'
  },
  {
    id: 'baladas-charlie-zaa',
    name: 'Baladas & Boleros de Charlie Zaa',
    description: 'Nuestro Juramento, Flor Sin Retoño, Rondando Tu Esquina y boleros del recuerdo.',
    icon: 'Heart',
    color: '#f59e0b'
  },
  {
    id: 'pop-latino',
    name: 'Grandes Éxitos Latinos',
    description: 'Joyas inolvidables de la música hispana y conciertos en vivo.',
    icon: 'Headphones',
    color: '#06b6d4'
  }
];

const INITIAL_VIDEOS = [
  {
    id: 1,
    youtubeVideoId: 'HbGIN3GwD8s',
    originalUrl: 'https://www.youtube.com/watch?v=HbGIN3GwD8s',
    canonicalUrl: 'https://www.youtube.com/watch?v=HbGIN3GwD8s',
    title: 'Charlie Zaa - Nuestro Juramento (Sentimientos)',
    channelName: 'Charlie Zaa',
    thumbnailUrl: 'https://img.youtube.com/vi/HbGIN3GwD8s/hqdefault.jpg',
    duration: '4:15',
    durationSeconds: 255,
    description: 'El clásico bolero inolvidable interpretado por Charlie Zaa de su álbum más galardonado Sentimientos.',
    personalNotes: 'Interpretación de bolero magistral. Canción imprescindible para la bóveda romántica.',
    watchStatus: 'watched',
    isFavorite: true,
    collectionId: 'baladas-charlie-zaa',
    collectionName: 'Baladas & Boleros de Charlie Zaa',
    tags: ['Charlie Zaa', 'Bolero', 'Baladas', 'Romántico'],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    id: 2,
    youtubeVideoId: 'jsek2g2lh-c',
    originalUrl: 'https://www.youtube.com/watch?v=jsek2g2lh-c',
    canonicalUrl: 'https://www.youtube.com/watch?v=jsek2g2lh-c',
    title: 'Soda Stereo - De Música Ligera (Video Oficial)',
    channelName: 'Soda Stereo',
    thumbnailUrl: 'https://img.youtube.com/vi/jsek2g2lh-c/hqdefault.jpg',
    duration: '3:35',
    durationSeconds: 215,
    description: 'Himno absoluto del rock en español grabado en Canción Animal (1990) por Gustavo Cerati y Soda Stereo.',
    personalNotes: 'El riff de guitarra más influyente de la historia del rock latinoamericano.',
    watchStatus: 'watched',
    isFavorite: true,
    collectionId: 'rock-espanol',
    collectionName: 'Rock en Español Clásico',
    tags: ['Soda Stereo', 'Gustavo Cerati', 'Rock en Español', 'Himno'],
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  },
  {
    id: 3,
    youtubeVideoId: '7KxkMLAZlzw',
    originalUrl: 'https://www.youtube.com/watch?v=7KxkMLAZlzw',
    canonicalUrl: 'https://www.youtube.com/watch?v=7KxkMLAZlzw',
    title: 'Grupo Niche - Cali Pachanguero (Oficial)',
    channelName: 'Grupo Niche',
    thumbnailUrl: 'https://img.youtube.com/vi/7KxkMLAZlzw/hqdefault.jpg',
    duration: '5:12',
    durationSeconds: 312,
    description: 'La composición legendaria del maestro Jairo Varela que recorrió el mundo y definió la salsa colombiana.',
    personalNotes: 'Arreglos de metales y percusión insuperables. Clave para animar la clase.',
    watchStatus: 'in_progress',
    isFavorite: true,
    collectionId: 'salsa',
    collectionName: 'Salsa Brava & Clásica',
    tags: ['Grupo Niche', 'Salsa', 'Cali', 'Jairo Varela'],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 4,
    youtubeVideoId: 'hReAuaAuJOE',
    originalUrl: 'https://www.youtube.com/watch?v=hReAuaAuJOE',
    canonicalUrl: 'https://www.youtube.com/watch?v=hReAuaAuJOE',
    title: 'Los Enanitos Verdes - Lamento Boliviano (Oficial)',
    channelName: 'Los Enanitos Verdes',
    thumbnailUrl: 'https://img.youtube.com/vi/hReAuaAuJOE/hqdefault.jpg',
    duration: '3:45',
    durationSeconds: 225,
    description: 'El tema más coreado y emblemático del rock en español con la voz inolvidable de Marciano Cantero.',
    personalNotes: 'Solo de guitarra perfecto para cantar con los alumnos en el descanso.',
    watchStatus: 'pending',
    isFavorite: false,
    collectionId: 'rock-espanol',
    collectionName: 'Rock en Español Clásico',
    tags: ['Enanitos Verdes', 'Marciano Cantero', 'Rock Latino', 'Guitarra'],
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 5,
    youtubeVideoId: 'YIbMejfd9KE',
    originalUrl: 'https://www.youtube.com/watch?v=YIbMejfd9KE',
    canonicalUrl: 'https://www.youtube.com/watch?v=YIbMejfd9KE',
    title: 'Charlie Zaa - Flor Sin Retoño (Video Oficial)',
    channelName: 'Charlie Zaa',
    thumbnailUrl: 'https://img.youtube.com/vi/YIbMejfd9KE/hqdefault.jpg',
    duration: '3:48',
    durationSeconds: 228,
    description: 'Hermoso bolero rítmico de desamor con requintos acústicos y trompeta.',
    personalNotes: 'Arreglo de guitarras acústicas impecable, excelente para relajarse tras una sesión de código.',
    watchStatus: 'pending',
    isFavorite: true,
    collectionId: 'baladas-charlie-zaa',
    collectionName: 'Baladas & Boleros de Charlie Zaa',
    tags: ['Charlie Zaa', 'Bolero', 'Flor Sin Retoño', 'Acústico'],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 6,
    youtubeVideoId: 'BNo0vkEYWRc',
    originalUrl: 'https://www.youtube.com/watch?v=BNo0vkEYWRc',
    canonicalUrl: 'https://www.youtube.com/watch?v=BNo0vkEYWRc',
    title: 'Héctor Lavoe - El Cantante (Video Oficial Fania)',
    channelName: 'Héctor Lavoe & Fania',
    thumbnailUrl: 'https://img.youtube.com/vi/BNo0vkEYWRc/hqdefault.jpg',
    duration: '10:20',
    durationSeconds: 620,
    description: 'La obra cumbre de la salsa dura neoyorquina escrita por Rubén Blades y producida por Willie Colón.',
    personalNotes: 'Himno de la salsa. "Yo soy el cantante, que hoy han venido a escuchar..."',
    watchStatus: 'in_progress',
    isFavorite: true,
    collectionId: 'salsa',
    collectionName: 'Salsa Brava & Clásica',
    tags: ['Hector Lavoe', 'Fania Records', 'Salsa Dura', 'Willie Colon'],
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 7,
    youtubeVideoId: 'zzIOxHIZEis',
    originalUrl: 'https://www.youtube.com/watch?v=zzIOxHIZEis',
    canonicalUrl: 'https://www.youtube.com/watch?v=zzIOxHIZEis',
    title: 'Hombres G - Devuélveme a mi chica (Video Oficial)',
    channelName: 'Hombres G',
    thumbnailUrl: 'https://img.youtube.com/vi/zzIOxHIZEis/hqdefault.jpg',
    duration: '3:15',
    durationSeconds: 195,
    description: 'El clásico pop rock de los 80s conocido popularmente como "Sufre Mamón".',
    personalNotes: 'Un clásico divertido y enérgico que todos en el auditorio conocen y cantan.',
    watchStatus: 'pending',
    isFavorite: false,
    collectionId: 'rock-espanol',
    collectionName: 'Rock en Español Clásico',
    tags: ['Hombres G', 'Pop Rock', '80s', 'Espana'],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 8,
    youtubeVideoId: 'YXnjy5YlDwk',
    originalUrl: 'https://www.youtube.com/watch?v=YXnjy5YlDwk',
    canonicalUrl: 'https://www.youtube.com/watch?v=YXnjy5YlDwk',
    title: 'Marc Anthony - Vivir Mi Vida (Video Oficial)',
    channelName: 'Marc Anthony',
    thumbnailUrl: 'https://img.youtube.com/vi/YXnjy5YlDwk/hqdefault.jpg',
    duration: '4:14',
    durationSeconds: 254,
    description: 'Uno de los temas de salsa más reproducidos de la historia moderna, producido por Sergio George.',
    personalNotes: 'Ritmo contagioso para mantener la energía alta en la clase.',
    watchStatus: 'watched',
    isFavorite: true,
    collectionId: 'salsa',
    collectionName: 'Salsa Brava & Clásica',
    tags: ['Marc Anthony', 'Salsa', 'Vivir Mi Vida', 'Energía'],
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
