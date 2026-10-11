import React, { useState, useEffect } from 'react';
import {
  Zap,
  Play,
  Plus,
  Search,
  Bookmark,
  Heart,
  CheckCircle,
  Clock,
  ExternalLink,
  Trash2,
  Share2,
  Folder,
  Layers,
  Database,
  Download,
  Upload,
  RotateCcw,
  X,
  FileText,
  Smartphone,
  Globe,
  Activity,
  Filter,
  Check,
  Edit3
} from 'lucide-react';

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

export default function App() {
  const [videos, setVideos] = useState([]);
  const [collections, setCollections] = useState([]);
  const [stats, setStats] = useState(null);
  const [serverHealth, setServerHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState('');
  const [filterCollection, setFilterCollection] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [playerVideo, setPlayerVideo] = useState(null);
  const [editingNotesVideo, setEditingNotesVideo] = useState(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [toast, setToast] = useState(null);

  // Formulario nuevo video
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [channelName, setChannelName] = useState('');
  const [collectionId, setCollectionId] = useState('salsa');
  const [tags, setTags] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulario nueva colección
  const [colName, setColName] = useState('');
  const [colDesc, setColDesc] = useState('');
  const [colColor, setColColor] = useState('#f43f5e');

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [vRes, cRes, sRes, hRes] = await Promise.all([
        fetch('/api/videos'),
        fetch('/api/collections'),
        fetch('/api/stats'),
        fetch('/api/health')
      ]);

      if (vRes.ok) {
        const vData = await vRes.json();
        setVideos(vData.data || []);
      }
      if (cRes.ok) {
        const cData = await cRes.json();
        setCollections(cData.data || []);
      }
      if (sRes.ok) {
        const sData = await sRes.json();
        setStats(sData.data || null);
      }
      if (hRes.ok) {
        const hData = await hRes.json();
        setServerHealth(hData);
      }
    } catch (err) {
      console.error('Error cargando datos de la API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Autodetectar video ID al pegar URL
  useEffect(() => {
    const ytid = extractYouTubeId(url);
    if (ytid && !title) {
      setTitle(`Video de YouTube [${ytid}]`);
      if (!channelName) setChannelName('Canal de YouTube');
    }
  }, [url]);

  const handleAddVideo = async (e) => {
    e.preventDefault();
    const ytid = extractYouTubeId(url);
    if (!ytid) {
      alert('Por favor ingresa una URL válida de YouTube');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          title: title || `Video ${ytid}`,
          channelName: channelName || 'Canal Guardado',
          collectionId,
          tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : ['YouTube'],
          personalNotes,
          watchStatus: 'pending'
        })
      });

      if (res.ok) {
        showNotification('✅ Video agregado a la bóveda con éxito.');
        setShowAddModal(false);
        setUrl('');
        setTitle('');
        setChannelName('');
        setTags('');
        setPersonalNotes('');
        await loadData();
      } else {
        alert('Error al agregar el video.');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con la API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (videoId, newStatus) => {
    try {
      const res = await fetch(`/api/videos/${videoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watchStatus: newStatus })
      });
      if (res.ok) {
        setVideos(prev => prev.map(v => v.id === videoId ? { ...v, watchStatus: newStatus } : v));
        showNotification('Estado de visualización actualizado.');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFavorite = async (video) => {
    try {
      const newFav = !video.isFavorite;
      const res = await fetch(`/api/videos/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: newFav })
      });
      if (res.ok) {
        setVideos(prev => prev.map(v => v.id === video.id ? { ...v, isFavorite: newFav } : v));
        showNotification(newFav ? 'Marcado como favorito ⭐' : 'Removido de favoritos');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este video de la bóveda?')) return;
    try {
      const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVideos(prev => prev.filter(v => v.id !== id));
        showNotification('Video eliminado de la bóveda.');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async () => {
    if (!editingNotesVideo) return;
    try {
      const res = await fetch(`/api/videos/${editingNotesVideo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personalNotes: editingNotesVideo.personalNotes })
      });
      if (res.ok) {
        setVideos(prev => prev.map(v => v.id === editingNotesVideo.id ? editingNotesVideo : v));
        showNotification('Notas guardadas exitosamente.');
        setEditingNotesVideo(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCollection = async (e) => {
    e.preventDefault();
    if (!colName) return;
    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: colName,
          description: colDesc,
          color: colColor
        })
      });
      if (res.ok) {
        showNotification('Nueva colección creada.');
        setShowCollectionModal(false);
        setColName('');
        setColDesc('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetDemoData = async () => {
    if (!confirm('¿Restablecer los videos demo del Masterclass? Se sobreescribirán los registros existentes.')) return;
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      if (res.ok) {
        showNotification('🔄 Datos de demostración restablecidos con éxito.');
        await loadData();
      }
    } catch (err) {
      alert('Error al restablecer datos.');
    }
  };

  const handleImportFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await fetch('/api/videos/import/json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json)
      });
      if (res.ok) {
        showNotification('Copia de seguridad restaurada correctamente.');
        await loadData();
      } else {
        alert('El archivo no tiene el formato requerido de YouTubeVolt.');
      }
    } catch (err) {
      alert('Archivo JSON inválido.');
    }
  };

  // Filtrado
  const filtered = videos.filter(v => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const m =
        v.title.toLowerCase().includes(q) ||
        v.channelName.toLowerCase().includes(q) ||
        (v.personalNotes && v.personalNotes.toLowerCase().includes(q)) ||
        (v.tags && v.tags.some(t => t.toLowerCase().includes(q)));
      if (!m) return false;
    }
    if (filterCollection !== 'all' && v.collectionId !== filterCollection) return false;
    if (filterStatus !== 'all' && v.watchStatus !== filterStatus) return false;
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f19', color: '#f8fafc', padding: '24px 32px' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '30px',
          background: 'rgba(244,63,94,0.95)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '10px',
          fontWeight: '700',
          fontSize: '0.9rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
          zIndex: 9999
        }}>
          {toast}
        </div>
      )}

      {/* Top Navbar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '16px',
        padding: '16px 24px',
        marginBottom: '28px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #ff0033 0%, #be123c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(255, 0, 51, 0.4)'
          }}>
            <Zap size={24} color="white" fill="white" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'white' }}>YouTube</span>
              <span style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#f43f5e' }}>Volt</span>
              <span style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(56, 189, 248, 0.3)'
              }}>
                STUDIO ADMIN
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Panel de Administración y Curaduría de Bóveda
            </div>
          </div>
        </div>

        {/* Database & Navigation Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            background: '#172033',
            border: '1px solid #1f2937',
            padding: '6px 14px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8rem'
          }}>
            <Database size={15} color={serverHealth?.database?.connected ? '#10b981' : '#f59e0b'} />
            <span style={{ color: '#94a3b8' }}>Base de Datos:</span>
            <strong style={{ color: serverHealth?.database?.connected ? '#10b981' : '#f59e0b' }}>
              {serverHealth?.database?.mode === 'mysql' ? 'MySQL Activo' : 'Modo In-Memory'}
            </strong>
          </div>

          <a
            href="/app"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#1e293b',
              color: 'white',
              textDecoration: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '600',
              border: '1px solid #334155'
            }}
          >
            <Smartphone size={15} color="#38bdf8" />
            PWA Mobile
          </a>

          <a
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#1e293b',
              color: 'white',
              textDecoration: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '600',
              border: '1px solid #334155'
            }}
          >
            <Globe size={15} color="#f43f5e" />
            Portal de Videos
          </a>
        </div>
      </header>

      {/* KPI Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.82rem', marginBottom: '8px' }}>
            <span>Total en Bóveda</span>
            <Layers size={18} color="#f43f5e" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white' }}>{videos.length}</div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>Videos curados registrados</div>
        </div>

        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.82rem', marginBottom: '8px' }}>
            <span>Pendientes de Ver</span>
            <Clock size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b' }}>
            {videos.filter(v => v.watchStatus === 'pending').length}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>Contenido por estudiar</div>
        </div>

        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.82rem', marginBottom: '8px' }}>
            <span>En Progreso</span>
            <Activity size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#38bdf8' }}>
            {videos.filter(v => v.watchStatus === 'in_progress').length}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>Sesiones de estudio activas</div>
        </div>

        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.82rem', marginBottom: '8px' }}>
            <span>Vistos / Completados</span>
            <CheckCircle size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>
            {videos.filter(v => v.watchStatus === 'watched').length}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>Material dominado</div>
        </div>

        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8', fontSize: '0.82rem', marginBottom: '8px' }}>
            <span>Horas Estimadas</span>
            <Play size={18} color="#a855f7" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'white' }}>
            {stats?.totalHours || '3.5'}h
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '4px' }}>Tiempo total de reproducción</div>
        </div>
      </div>

      {/* Main Action Bar */}
      <div style={{
        background: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '16px',
        padding: '18px 24px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '320px', flexWrap: 'wrap' }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: '#1a2234',
            borderRadius: '10px',
            border: '1px solid #26334d',
            padding: '0 12px',
            minWidth: '240px',
            flex: 1
          }}>
            <Search size={16} color="#64748b" />
            <input
              type="text"
              placeholder="Buscar videos por título, canal, notas o tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '10px',
                color: 'white',
                fontSize: '0.85rem',
                outline: 'none',
                width: '100%'
              }}
            />
          </div>

          <select
            value={filterCollection}
            onChange={(e) => setFilterCollection(e.target.value)}
            style={{
              background: '#1a2234',
              border: '1px solid #26334d',
              color: 'white',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          >
            <option value="all">Todas las Colecciones</option>
            {collections.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              background: '#1a2234',
              border: '1px solid #26334d',
              color: 'white',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          >
            <option value="all">Todos los Estados</option>
            <option value="pending">⏳ Pendiente</option>
            <option value="in_progress">🎧 En Progreso</option>
            <option value="watched">✅ Visto</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: 'linear-gradient(135deg, #ff0033 0%, #be123c 100%)',
              color: 'white',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(255, 0, 51, 0.4)'
            }}
          >
            <Plus size={16} /> Agregar Video
          </button>

          <button
            onClick={() => setShowCollectionModal(true)}
            style={{
              background: '#1e293b',
              color: 'white',
              border: '1px solid #334155',
              padding: '10px 14px',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Folder size={15} color="#f43f5e" /> Colecciones
          </button>

          <a
            href="/api/videos/export/json"
            download="youtubevolt-backup.json"
            style={{
              background: '#1e293b',
              color: 'white',
              border: '1px solid #334155',
              padding: '10px 14px',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none'
            }}
          >
            <Download size={15} color="#38bdf8" /> Exportar
          </a>

          <label style={{
            background: '#1e293b',
            color: 'white',
            border: '1px solid #334155',
            padding: '10px 14px',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}>
            <Upload size={15} color="#10b981" /> Importar
            <input type="file" accept=".json" onChange={handleImportFile} style={{ display: 'none' }} />
          </label>

          <button
            onClick={handleResetDemoData}
            title="Restablece la biblioteca con los videos de demostración oficiales"
            style={{
              background: '#1e293b',
              color: '#f87171',
              border: '1px solid #334155',
              padding: '10px 14px',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={15} /> Demo Reset
          </button>
        </div>
      </div>

      {/* Videos Data Table */}
      <div style={{
        background: '#111827',
        border: '1px solid #1f2937',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#161f30', borderBottom: '1px solid #1f2937', color: '#94a3b8' }}>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Video / Miniatura</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Canal & Colección</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Tags</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Estado de Estudio</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Favorito</th>
                <th style={{ padding: '14px 18px', fontWeight: '700' }}>Notas</th>
                <th style={{ padding: '14px 18px', fontWeight: '700', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(video => (
                <tr key={video.id} style={{ borderBottom: '1px solid #1a2333', transition: 'background 0.2s' }}>
                  {/* Thumbnail & Title */}
                  <td style={{ padding: '14px 18px', maxWidth: '340px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div
                        onClick={() => setPlayerVideo(video)}
                        style={{
                          position: 'relative',
                          width: '90px',
                          height: '50px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          cursor: 'pointer',
                          background: '#0a0e17'
                        }}
                      >
                        <img
                          src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(0,0,0,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Play size={14} color="white" fill="white" />
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          background: 'rgba(0,0,0,0.8)',
                          fontSize: '0.62rem',
                          padding: '1px 3px',
                          borderRadius: '2px',
                          fontWeight: '700'
                        }}>
                          {video.duration || '15:00'}
                        </div>
                      </div>
                      <div>
                        <div
                          onClick={() => setPlayerVideo(video)}
                          style={{ fontWeight: '700', color: 'white', lineHeight: '1.3', cursor: 'pointer', marginBottom: '2px' }}
                        >
                          {video.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          ID: {video.youtubeVideoId}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Channel & Collection */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: '600', color: '#cbd5e1' }}>{video.channelName}</div>
                    <div style={{ fontSize: '0.74rem', color: '#f43f5e', fontWeight: '500' }}>
                      {video.collectionName}
                    </div>
                  </td>

                  {/* Tags */}
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '180px' }}>
                      {video.tags && video.tags.map((t, idx) => (
                        <span key={idx} style={{
                          background: '#1a2438',
                          color: '#94a3b8',
                          fontSize: '0.68rem',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Status Dropdown */}
                  <td style={{ padding: '14px 18px' }}>
                    <select
                      value={video.watchStatus}
                      onChange={(e) => handleUpdateStatus(video.id, e.target.value)}
                      style={{
                        background: video.watchStatus === 'watched' ? 'rgba(16, 185, 129, 0.15)' :
                          video.watchStatus === 'in_progress' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: video.watchStatus === 'watched' ? '#10b981' :
                          video.watchStatus === 'in_progress' ? '#38bdf8' : '#f59e0b',
                        border: `1px solid ${video.watchStatus === 'watched' ? 'rgba(16, 185, 129, 0.3)' :
                          video.watchStatus === 'in_progress' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                        borderRadius: '8px',
                        padding: '6px 10px',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="pending" style={{ background: '#111827', color: 'white' }}>⏳ Pendiente</option>
                      <option value="in_progress" style={{ background: '#111827', color: 'white' }}>🎧 En Progreso</option>
                      <option value="watched" style={{ background: '#111827', color: 'white' }}>✅ Visto</option>
                    </select>
                  </td>

                  {/* Favorite Toggle */}
                  <td style={{ padding: '14px 18px' }}>
                    <button
                      onClick={() => handleToggleFavorite(video)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '6px'
                      }}
                    >
                      <Heart
                        size={20}
                        color={video.isFavorite ? '#f43f5e' : '#64748b'}
                        fill={video.isFavorite ? '#f43f5e' : 'transparent'}
                      />
                    </button>
                  </td>

                  {/* Notes Button */}
                  <td style={{ padding: '14px 18px' }}>
                    <button
                      onClick={() => setEditingNotesVideo({ ...video })}
                      style={{
                        background: video.personalNotes ? 'rgba(56, 189, 248, 0.15)' : '#1e293b',
                        border: '1px solid #334155',
                        color: video.personalNotes ? '#38bdf8' : '#94a3b8',
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Edit3 size={12} />
                      {video.personalNotes ? 'Ver Notas' : '+ Agregar'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => setPlayerVideo(video)}
                        title="Ver Video"
                        style={{
                          background: '#1e293b',
                          border: '1px solid #334155',
                          color: '#f43f5e',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Play size={14} fill="#f43f5e" />
                      </button>

                      <a
                        href={`https://www.youtube.com/watch?v=${video.youtubeVideoId}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Abrir en YouTube oficial"
                        style={{
                          background: '#1e293b',
                          border: '1px solid #334155',
                          color: '#38bdf8',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <ExternalLink size={14} />
                      </a>

                      <button
                        onClick={() => handleDeleteVideo(video.id)}
                        title="Eliminar de Bóveda"
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    No se encontraron videos coincidentes con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: AGREGAR VIDEO */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '20px',
            maxWidth: '560px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Zap size={22} color="#f43f5e" />
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'white' }}>
                  Registrar Video en la Bóveda
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddVideo} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                  URL de YouTube *
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#1a2234',
                    border: '1px solid #26334d',
                    color: 'white',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              {/* Instant Preview */}
              {extractYouTubeId(url) && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  background: 'rgba(244,63,94,0.08)',
                  padding: '12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(244,63,94,0.25)',
                  alignItems: 'center'
                }}>
                  <img
                    src={`https://img.youtube.com/vi/${extractYouTubeId(url)}/hqdefault.jpg`}
                    alt="Preview"
                    style={{ width: '100px', height: '56px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div>
                    <div style={{ color: '#f43f5e', fontWeight: '700', fontSize: '0.82rem' }}>
                      ✓ Video reconocido: ID [{extractYouTubeId(url)}]
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.74rem', marginTop: '2px' }}>
                      Miniatura oficial generada automáticamente.
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                  Título del Video
                </label>
                <input
                  type="text"
                  placeholder="Ej: Masterclass de Agentes de IA y Arquitectura"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#1a2234',
                    border: '1px solid #26334d',
                    color: 'white',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                    Canal / Autor
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Midudev, DotCSV"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      background: '#1a2234',
                      border: '1px solid #26334d',
                      color: 'white',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                    Colección
                  </label>
                  <select
                    value={collectionId}
                    onChange={(e) => setCollectionId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      background: '#1a2234',
                      border: '1px solid #26334d',
                      color: 'white',
                      fontSize: '0.88rem'
                    }}
                  >
                    {collections.map(col => (
                      <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                  Etiquetas (Tags)
                </label>
                <input
                  type="text"
                  placeholder="AI, Agentes, Python, Dokploy"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#1a2234',
                    border: '1px solid #26334d',
                    color: 'white',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                  Notas Personales
                </label>
                <textarea
                  placeholder="Anotaciones clave que motivaron guardar este video..."
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#1a2234',
                    border: '1px solid #26334d',
                    color: 'white',
                    fontSize: '0.88rem',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    background: '#1e293b',
                    color: 'white',
                    border: '1px solid #334155',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #ff0033 0%, #be123c 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(255, 0, 51, 0.4)'
                  }}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REPRODUCTOR EMBEBIDO */}
      {playerVideo && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '16px',
            maxWidth: '850px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #1f2937'
            }}>
              <div style={{ fontWeight: '700', fontSize: '1rem', color: 'white' }}>
                {playerVideo.title}
              </div>
              <button
                onClick={() => setPlayerVideo(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
              <iframe
                src={`https://www.youtube.com/embed/${playerVideo.youtubeVideoId}?autoplay=1&rel=0`}
                title={playerVideo.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Canal: <strong style={{ color: '#f43f5e' }}>{playerVideo.channelName}</strong> &bull; Colección: {playerVideo.collectionName}
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${playerVideo.youtubeVideoId}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#38bdf8',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}
              >
                <ExternalLink size={14} /> Abrir en YouTube
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR NOTAS */}
      {editingNotesVideo && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '16px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'white' }}>
                📝 Notas de Estudio: {editingNotesVideo.title}
              </h3>
              <button
                onClick={() => setEditingNotesVideo(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <textarea
              value={editingNotesVideo.personalNotes || ''}
              onChange={(e) => setEditingNotesVideo({ ...editingNotesVideo, personalNotes: e.target.value })}
              rows={6}
              placeholder="Escribe tus notas, timestamps o resúmenes clave de este video..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: '#1a2234',
                border: '1px solid #26334d',
                color: 'white',
                fontSize: '0.88rem',
                resize: 'none',
                marginBottom: '16px'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setEditingNotesVideo(null)}
                style={{ background: '#1e293b', border: '1px solid #334155', color: 'white', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNotes}
                style={{ background: '#2563eb', border: 'none', color: 'white', padding: '10px 18px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
              >
                Guardar Notas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GESTIONAR COLECCIONES */}
      {showCollectionModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '16px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Folder size={20} color="#f43f5e" /> Colecciones Temáticas
              </h3>
              <button
                onClick={() => setShowCollectionModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* List of collections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto', marginBottom: '20px' }}>
              {collections.map(col => {
                const count = videos.filter(v => v.collectionId === col.id).length;
                return (
                  <div key={col.id} style={{
                    background: '#1a2234',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontWeight: '600', color: 'white', fontSize: '0.85rem' }}>{col.name}</span>
                    <span style={{ background: '#26334d', color: '#f43f5e', fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', borderRadius: '999px' }}>
                      {count} videos
                    </span>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleAddCollection} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: '700' }}>Crear Nueva Colección</h4>
              <input
                type="text"
                placeholder="Nombre de la colección (ej: Algoritmos & Grafos)"
                value={colName}
                onChange={(e) => setColName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: '#1a2234',
                  border: '1px solid #26334d',
                  color: 'white',
                  fontSize: '0.85rem'
                }}
              />
              <input
                type="text"
                placeholder="Breve descripción"
                value={colDesc}
                onChange={(e) => setColDesc(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: '#1a2234',
                  border: '1px solid #26334d',
                  color: 'white',
                  fontSize: '0.85rem'
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#f43f5e',
                  border: 'none',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                + Crear Colección
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
