const express = require('express');
const router = express.Router();
const db = require('../db');

// Health Check Endpoint (For Dokploy Health Checks)
router.get('/health', (req, res) => {
  const dbStatus = db.getDbStatus();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    app: 'YouTubeVolt Bóveda de Videos',
    platform: 'Dokploy CI/CD Live MasterClass',
    database: dbStatus
  });
});

// -------------------------------------------------------------
// YouTubeVolt API: Videos
// -------------------------------------------------------------

// List videos with filters: ?search=..., ?collection=..., ?status=..., ?favorite=true
router.get('/videos', async (req, res) => {
  try {
    const { search, collection, status, favorite } = req.query;
    const videos = await db.getVideos({ search, collection, status, favorite });
    res.json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single video by ID
router.get('/videos/:id', async (req, res) => {
  try {
    const video = await db.getVideoById(req.params.id);
    if (!video) {
      return res.status(404).json({ success: false, error: 'Video no encontrado en la bóveda.' });
    }
    res.json({ success: true, data: video });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new video to vault
router.post('/videos', async (req, res) => {
  try {
    const { url, originalUrl, title, channelName, collectionId, collectionName, tags, personalNotes, watchStatus, isFavorite } = req.body;
    const targetUrl = url || originalUrl;

    if (!targetUrl) {
      return res.status(400).json({ success: false, error: 'La URL de YouTube es requerida.' });
    }

    const video = await db.addVideo({
      url: targetUrl,
      title,
      channelName,
      collectionId,
      collectionName,
      tags,
      personalNotes,
      watchStatus,
      isFavorite
    });

    res.status(201).json({
      success: true,
      message: 'Video guardado exitosamente en tu bóveda YouTubeVolt.',
      data: video
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update video (e.g. notes, watch status, favorite, collection)
router.put('/videos/:id', async (req, res) => {
  try {
    const updated = await db.updateVideo(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Video no encontrado.' });
    }
    res.json({
      success: true,
      message: 'Video actualizado en la bóveda.',
      data: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete video from vault
router.delete('/videos/:id', async (req, res) => {
  try {
    await db.deleteVideo(req.params.id);
    res.json({ success: true, message: `Video ${req.params.id} eliminado de la bóveda.` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -------------------------------------------------------------
// YouTubeVolt API: Colecciones
// -------------------------------------------------------------
router.get('/collections', async (req, res) => {
  try {
    const collections = await db.getCollections();
    res.json({
      success: true,
      count: collections.length,
      data: collections
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/collections', async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'El nombre de la colección es obligatorio.' });
    }
    const col = await db.addCollection({ name, description, icon, color });
    res.status(201).json({ success: true, data: col });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -------------------------------------------------------------
// YouTubeVolt API: Estadísticas & Métricas
// -------------------------------------------------------------
router.get('/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -------------------------------------------------------------
// YouTubeVolt API: Respaldo / Exportación & Importación
// -------------------------------------------------------------
router.get('/videos/export/json', async (req, res) => {
  try {
    const backup = await db.exportVault();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=youtubevolt-backup.json');
    res.json(backup);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/videos/import/json', async (req, res) => {
  try {
    const result = await db.importVault(req.body);
    res.json({ success: true, message: `Bóveda restaurada con éxito. (${result.importedVideos} videos nuevos importados)` });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Reset demo data
router.post('/reset', async (req, res) => {
  try {
    await db.resetVideos();
    res.json({ success: true, message: 'Bóveda YouTubeVolt restablecida con videos demo de alta calidad.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// -------------------------------------------------------------
// Legacy Products Support
// -------------------------------------------------------------
router.get('/products', async (req, res) => {
  const products = await db.getProducts();
  res.json({ success: true, count: products.length, data: products });
});

router.post('/products', async (req, res) => {
  const product = await db.addProduct(req.body);
  res.status(201).json({ success: true, data: product });
});

router.delete('/products/:id', async (req, res) => {
  await db.deleteProduct(req.params.id);
  res.json({ success: true, message: `Producto ${req.params.id} eliminado.` });
});

module.exports = router;
