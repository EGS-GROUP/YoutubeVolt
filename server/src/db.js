const mysql = require('mysql2/promise');

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Rey de las hamburguesas a la parrilla',
    category: 'A la Parrilla',
    badge: 'Doble Carne XXL * 380g',
    price: 14.99,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    description: 'Carne 100% Angus flameada a la leña de roble, queso cheddar añejo fundido, cebolla caramelizada al bourbon y panceta crocante en pan brioche artesanal.'
  },
  {
    id: 2,
    name: 'Hamburgueza Real',
    category: 'A la Parrilla',
    badge: 'Clásica Imperial * 240g',
    price: 11.50,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80',
    description: 'Doble medallón smash con costra caramelizada, queso americano fundido, pepinillos agridulces caseros y aderezo imperial secreto.'
  },
  {
    id: 3,
    name: 'Hamburgueza Royal Crispy',
    category: 'Pollo Crispy',
    badge: 'Crispy Gold Pechuga * 260g',
    price: 12.99,
    stock: 38,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&auto=format&fit=crop&q=80',
    description: 'Pechuga marinada en suero de leche 24h y 11 especias secretas con rebozado extra crujiente, ensalada coleslaw fresca con manzana y salsa honey mustard.'
  },
  {
    id: 4,
    name: 'Hamburgueza Double Whopper',
    category: 'Gigantes XXL',
    badge: 'Fuego Parrillero * 420g',
    price: 15.50,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    description: 'Doble medallón gigante asado a la parrilla sobre brasas vivas, lechuga romana crujiente, tomate maduro, aros de cebolla morada y mayonesa ahumada especial.'
  },
  {
    id: 5,
    name: 'Smash Burger Trufada Supreme',
    category: 'Smash Burgers',
    badge: 'Doble Smash Angus * 220g',
    price: 13.75,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&auto=format&fit=crop&q=80',
    description: 'Técnica smash en plancha de cromo con costra crujiente, queso suizo fundido, reducción de hongos silvestres y mayonesa de trufa negra.'
  },
  {
    id: 6,
    name: 'Bacon Monster Cheddar Melt',
    category: 'Gigantes XXL',
    badge: 'Triple Bacon Ahumado * 350g',
    price: 14.50,
    stock: 42,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&auto=format&fit=crop&q=80',
    description: 'Cascada de queso cheddar líquido fundido al momento sobre carne Angus jugosa y seis tiras crujientes de bacon glaseado con miel de maple.'
  },
  {
    id: 7,
    name: 'Volcán Criollo Chimichurri',
    category: 'A la Parrilla',
    badge: 'Corte de Asado * 300g',
    price: 13.90,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&auto=format&fit=crop&q=80',
    description: 'Homenaje al asado tradicional con medallón grueso sazonado a las finas hierbas, queso provolone fundido, pimientos asados y chimichurri casero ahumado.'
  },
  {
    id: 8,
    name: 'Chili Pepper Jack Picante',
    category: 'Especiales del Chef',
    badge: 'Spicy Jalapeño Crunch * 280g',
    price: 12.50,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1582196016295-f8c8bd4b3e99?w=800&auto=format&fit=crop&q=80',
    description: 'Para los amantes del fuego: queso pepper jack picante, rodajas de jalapeños encurtidos a mano, guacamole cremoso y salsa chipotle brava.'
  },
  {
    id: 9,
    name: 'Black Angus BBQ Ribs Glazed',
    category: 'Especiales del Chef',
    badge: 'Costilla Desmechada * 340g',
    price: 16.20,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1549611016-3a70d82b5040?w=800&auto=format&fit=crop&q=80',
    description: 'Medallón Black Angus coronado con tierna carne de costilla de cerdo desmechada cocida a fuego lento por 8 horas en salsa BBQ dulce de bourbon.'
  },
  {
    id: 10,
    name: 'Mushroom Swiss Gourmet',
    category: 'Gourmet',
    badge: 'Hongos Salteados & Emmental * 250g',
    price: 13.20,
    stock: 32,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80',
    description: 'Elegante combinación de carne de res selecta con champiñones Portobello salteados en mantequilla de romero y queso suizo Emmental derretido.'
  }
];

let inMemoryProducts = [...INITIAL_PRODUCTS];
let pool = null;
let isConnectedToMySQL = false;
let lastDbError = null;

async function initDB() {
  const databaseUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  const host = process.env.DB_HOST || process.env.MYSQL_HOST;
  const user = process.env.DB_USER || process.env.MYSQL_USER || 'root';
  const password = process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '';
  const database = process.env.DB_NAME || process.env.MYSQL_DATABASE || 'demo';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  if (!databaseUrl && !host) {
    lastDbError = 'Variables DB_HOST ni DATABASE_URL configuradas en el entorno.';
    console.log(`ℹ️ [DB] ${lastDbError} Operando en modo In-Memory para demostración.`);
    return;
  }

  try {
    if (databaseUrl) {
      console.log(`🔄 [DB] Intentando conectar a MySQL vía DATABASE_URL...`);
      pool = mysql.createPool(databaseUrl);
    } else {
      console.log(`🔄 [DB] Intentando conectar a MySQL en ${host}:${port} con usuario "${user}" a la BD "${database}"...`);
      pool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 8000
      });
    }

    const connection = await pool.getConnection();
    console.log(`✅ [DB] Conectado exitosamente a MySQL (${host || 'URL'} - BD: ${database})`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        badge VARCHAR(100) DEFAULT '',
        price DECIMAL(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        image VARCHAR(500),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [rows] = await connection.query('SELECT COUNT(*) as count FROM products');
    if (rows[0].count === 0) {
      console.log('🌱 [DB] Inicializando 10 hamburguesas maestras en MySQL...');
      for (const p of INITIAL_PRODUCTS) {
        await connection.query(
          'INSERT INTO products (name, category, badge, price, stock, image, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [p.name, p.category, p.badge, p.price, p.stock, p.image, p.description]
        );
      }
    }

    connection.release();
    isConnectedToMySQL = true;
    lastDbError = null;
  } catch (error) {
    console.warn(`⚠️ [DB] Conexión directa falló: ${error.message}. Escaneando red interna...`);
    try {
      const candidates = [];
      for (let i = 2; i <= 30; i++) candidates.push(`172.18.0.${i}`);
      for (let i = 1; i <= 254; i++) candidates.push(`10.0.1.${i}`);
      candidates.push('172.18.0.1', '172.17.0.1');

      const net = require('net');
      const check = (ip) => new Promise((resolve) => {
        const s = new net.Socket();
        s.setTimeout(250);
        s.once('connect', () => { s.destroy(); resolve(ip); });
        s.once('timeout', () => { s.destroy(); resolve(null); });
        s.once('error', () => { resolve(null); });
        s.connect(3306, ip);
      });

      const found = (await Promise.all(candidates.map(check))).filter(Boolean);
      if (found.length > 0) {
        const discoveredIp = found[0];
        console.log(`🎯 [DB Discovery] ¡MySQL encontrado automáticamente en IP ${discoveredIp}! Conectando...`);
        pool = mysql.createPool({
          host: discoveredIp,
          user,
          password,
          database,
          port: 3306,
          waitForConnections: true,
          connectionLimit: 10,
          connectTimeout: 5000
        });
        const conn = await pool.getConnection();
        console.log(`✅ [DB] Conectado exitosamente a MySQL en ${discoveredIp}`);
        await conn.query(`
          CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            category VARCHAR(100) NOT NULL,
            badge VARCHAR(100) DEFAULT '',
            price DECIMAL(10,2) NOT NULL,
            stock INT NOT NULL DEFAULT 0,
            image VARCHAR(500),
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        conn.release();
        isConnectedToMySQL = true;
        lastDbError = null;
        return;
      }
    } catch (discoveryErr) {
      console.warn('Error en escaneo de red:', discoveryErr.message);
    }

    lastDbError = error.message;
    console.warn(`⚠️ [DB] No se pudo conectar a MySQL: ${error.message}. Operando en modo In-Memory.`);
    isConnectedToMySQL = false;
  }
}

async function getProducts() {
  if (!isConnectedToMySQL && (process.env.DB_HOST || process.env.DATABASE_URL)) {
    await initDB();
  }

  if (isConnectedToMySQL && pool) {
    try {
      const [rows] = await pool.query('SELECT * FROM products ORDER BY id ASC');
      return rows;
    } catch (err) {
      console.error('Error consultando MySQL, recurriendo a memoria temporal:', err.message);
      lastDbError = err.message;
    }
  }
  return inMemoryProducts;
}

async function addProduct({ name, category, badge, price, stock, image, description }) {
  if (!isConnectedToMySQL && (process.env.DB_HOST || process.env.DATABASE_URL)) {
    await initDB();
  }

  if (isConnectedToMySQL && pool) {
    const [result] = await pool.query(
      'INSERT INTO products (name, category, badge, price, stock, image, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, category, badge || 'Especial * 250g', parseFloat(price) || 0, parseInt(stock, 10) || 0, image || '', description || '']
    );
    return { id: result.insertId, name, category, badge: badge || 'Especial * 250g', price: parseFloat(price) || 0, stock: parseInt(stock, 10) || 0, image, description };
  }

  const newProduct = {
    id: Date.now(),
    name,
    category: category || 'Especialidades',
    badge: badge || 'Especial * 250g',
    price: parseFloat(price) || 0,
    stock: parseInt(stock, 10) || 0,
    image: image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    description: description || 'Nueva creación artesanal de NextCollege Burger Rapid.'
  };
  inMemoryProducts.unshift(newProduct);
  return newProduct;
}

async function deleteProduct(id) {
  const numId = parseInt(id, 10);
  if (isConnectedToMySQL && pool) {
    await pool.query('DELETE FROM products WHERE id = ?', [numId]);
    return true;
  }
  inMemoryProducts = inMemoryProducts.filter(p => p.id !== numId);
  return true;
}

async function resetProducts() {
  if (isConnectedToMySQL && pool) {
    await pool.query('TRUNCATE TABLE products');
    for (const p of INITIAL_PRODUCTS) {
      await pool.query(
        'INSERT INTO products (name, category, badge, price, stock, image, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [p.name, p.category, p.badge, p.price, p.stock, p.image, p.description]
      );
    }
    return;
  }
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
  initDB,
  getProducts,
  addProduct,
  deleteProduct,
  resetProducts,
  getDbStatus
};
