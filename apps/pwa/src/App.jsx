import React, { useState, useEffect } from 'react';
import {
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
  Sparkles,
  Zap,
  Download,
  Upload,
  RotateCcw,
  X,
  Compass,
  Home,
  Check,
  Tag,
  Wifi,
  WifiOff
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
  const [activeTab, setActiveTab] = useState('home'); // home | explore | pending | vault
  const [videos, setVideos] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all | pending | in_progress | watched | favorites | [collectionId]
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Formulario nuevo video
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newChannel, setNewChannel] = useState('');
  const [newCollection, setNewCollection] = useState('salsa');
  const [newTags, setNewTags] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Notas del video seleccionado
  const [activeNotes, setActiveNotes] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    fetchData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resVideos, resCols] = await Promise.all([
        fetch('/api/videos'),
        fetch('/api/collections')
      ]);

      if (resVideos.ok && resCols.ok) {
        const vData = await resVideos.json();
        const cData = await resCols.json();
        setVideos(vData.data || []);
        setCollections(cData.data || []);
        localStorage.setItem('youtubevolt_cache_videos', JSON.stringify(vData.data || []));
        localStorage.setItem('youtubevolt_cache_cols', JSON.stringify(cData.data || []));
      } else {
        fallbackToCache();
      }
    } catch (err) {
      console.warn('Usando caché local por desconexión:', err);
      fallbackToCache();
    } finally {
      setLoading(false);
    }
  };

  const fallbackToCache = () => {
    const cachedV = localStorage.getItem('youtubevolt_cache_videos');
    const cachedC = localStorage.getItem('youtubevolt_cache_cols');
    if (cachedV) setVideos(JSON.parse(cachedV));
    if (cachedC) setCollections(JSON.parse(cachedC));
  };

  // Autocompletar cuando pega una URL
  useEffect(() => {
    const ytid = extractYouTubeId(newUrl);
    if (ytid && !newTitle) {
      setNewTitle(`Video YouTube [${ytid}]`);
      if (!newChannel) setNewChannel('Canal de YouTube');
    }
  }, [newUrl]);

  const handleSaveVideo = async (e) => {
    e.preventDefault();
    if (!newUrl) {
      alert('Por favor introduce una URL válida de YouTube.');
      return;
    }

    const ytid = extractYouTubeId(newUrl);
    if (!ytid) {
      alert('No se pudo reconocer un enlace válido de YouTube.');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        url: newUrl,
        title: newTitle || `Video ${ytid}`,
        channelName: newChannel || 'Canal Guardado',
        collectionId: newCollection,
        tags: newTags ? newTags.split(',').map(t => t.trim()).filter(Boolean) : ['YouTube'],
        personalNotes: newNotes,
        watchStatus: 'pending',
        isFavorite: false
      };

      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        setVideos(prev => [result.data, ...prev]);
        showToast('✅ ¡Video guardado exitosamente en tu bóveda!');
        setShowAddModal(false);
        setNewUrl('');
        setNewTitle('');
        setNewChannel('');
        setNewTags('');
        setNewNotes('');
      } else {
        alert('Error al guardar el video en el servidor.');
      }
    } catch (err) {
      // Guardado offline en localStorage
      const offlineVideo = {
        id: Date.now(),
        youtubeVideoId: ytid,
        originalUrl: newUrl,
        canonicalUrl: `https://www.youtube.com/watch?v=${ytid}`,
        title: newTitle || `Video ${ytid}`,
        channelName: newChannel || 'Canal Offline',
        thumbnailUrl: `https://img.youtube.com/vi/${ytid}/hqdefault.jpg`,
        duration: '15:00',
        personalNotes: newNotes,
        watchStatus: 'pending',
        isFavorite: false,
        collectionId: newCollection,
        collectionName: 'General',
        tags: newTags ? newTags.split(',') : ['Offline'],
        createdAt: new Date().toISOString()
      };
      setVideos(prev => [offlineVideo, ...prev]);
      showToast('📱 Video guardado localmente (Offline)');
      setShowAddModal(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFavorite = async (video, e) => {
    if (e) e.stopPropagation();
    const newStatus = !video.isFavorite;
    const updated = { ...video, isFavorite: newStatus };
    setVideos(prev => prev.map(v => v.id === video.id ? updated : v));
    if (selectedVideo && selectedVideo.id === video.id) {
      setSelectedVideo(updated);
    }

    try {
      await fetch(`/api/videos/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: newStatus })
      });
      showToast(newStatus ? '⭐ Agregado a favoritos' : 'Eliminado de favoritos');
    } catch (err) {
      console.warn('Error sincronizando favorito:', err);
    }
  };

  const handleStatusChange = async (video, newStatus) => {
    const updated = { ...video, watchStatus: newStatus };
    setVideos(prev => prev.map(v => v.id === video.id ? updated : v));
    if (selectedVideo && selectedVideo.id === video.id) {
      setSelectedVideo(updated);
    }

    try {
      await fetch(`/api/videos/${video.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watchStatus: newStatus })
      });
      showToast(`Estado actualizado: ${newStatus === 'watched' ? 'Visto ✅' : newStatus === 'in_progress' ? 'En Progreso 🎧' : 'Pendiente ⏳'}`);
    } catch (err) {
      console.warn('Error actualizando estado:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedVideo) return;
    const updated = { ...selectedVideo, personalNotes: activeNotes };
    setSelectedVideo(updated);
    setVideos(prev => prev.map(v => v.id === selectedVideo.id ? updated : v));

    try {
      await fetch(`/api/videos/${selectedVideo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ personalNotes: activeNotes })
      });
      showToast('📝 Notas guardadas en tu bóveda');
    } catch (err) {
      console.warn('Error guardando notas:', err);
    }
  };

  const handleDeleteVideo = async (id, e) => {
    if (e) e.stopPropagation();
    if (!confirm('¿Deseas eliminar este video de tu bóveda personal?')) return;

    setVideos(prev => prev.filter(v => v.id !== id));
    if (selectedVideo && selectedVideo.id === id) {
      setSelectedVideo(null);
    }

    try {
      await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      showToast('🗑️ Video eliminado');
    } catch (err) {
      console.warn('Error eliminando video:', err);
    }
  };

  const handleResetData = async () => {
    if (!confirm('¿Restablecer los videos de demostración originales?')) return;
    try {
      await fetch('/api/reset', { method: 'POST' });
      await fetchData();
      showToast('🔄 Bóveda restablecida con videos demo');
    } catch (err) {
      alert('Error restableciendo datos');
    }
  };

  // Filtrado de videos
  const filteredVideos = videos.filter(v => {
    // Búsqueda
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        v.title.toLowerCase().includes(q) ||
        v.channelName.toLowerCase().includes(q) ||
        (v.personalNotes && v.personalNotes.toLowerCase().includes(q)) ||
        (v.tags && v.tags.some(t => t.toLowerCase().includes(q))) ||
        (v.collectionName && v.collectionName.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Filtros de navegación
    if (activeTab === 'pending') {
      return v.watchStatus === 'pending';
    }

    // Filtros por píldoras
    if (selectedFilter === 'pending') return v.watchStatus === 'pending';
    if (selectedFilter === 'in_progress') return v.watchStatus === 'in_progress';
    if (selectedFilter === 'watched') return v.watchStatus === 'watched';
    if (selectedFilter === 'favorites') return v.isFavorite;
    if (selectedFilter !== 'all') return v.collectionId === selectedFilter;

    return true;
  });

  const pendingVideosCount = videos.filter(v => v.watchStatus === 'pending').length;
  const favoriteVideosCount = videos.filter(v => v.isFavorite).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '76px' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          background: 'rgba(244, 63, 94, 0.95)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '9999px',
          fontWeight: '600',
          fontSize: '0.85rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Top Mobile Header */}
      <header className="glass-header" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '14px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #ff0033 0%, #b91c1c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 0, 51, 0.4)'
            }}>
              <Zap size={18} color="white" fill="white" />
            </div>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: '800', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: 'white' }}>YouTube</span>
                <span style={{ color: '#f43f5e' }}>Volt</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '0.72rem',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: isOnline ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.15)',
              color: isOnline ? '#10b981' : '#ef4444',
              border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`
            }}>
              {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Search Bar with AI Look (inspired by Screenshot 2) */}
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: '#161e2e',
          borderRadius: '12px',
          border: '1px solid #243048',
          padding: '0 12px'
        }}>
          <Search size={16} color="#64748b" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Buscar por título, canal, notas o tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              padding: '10px 10px',
              color: 'white',
              fontSize: '0.86rem',
              outline: 'none'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ padding: '16px', flex: 1 }}>
        {/* Category Filter Pills (inspired by screenshots) */}
        <div className="no-scrollbar" style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '14px',
          marginBottom: '10px'
        }}>
          <button
            onClick={() => setSelectedFilter('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: selectedFilter === 'all' ? '#f43f5e' : '#172033',
              color: selectedFilter === 'all' ? 'white' : '#94a3b8'
            }}
          >
            Todos ({videos.length})
          </button>
          <button
            onClick={() => setSelectedFilter('pending')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: selectedFilter === 'pending' ? '#f43f5e' : '#172033',
              color: selectedFilter === 'pending' ? 'white' : '#94a3b8'
            }}
          >
            ⏳ Pendientes ({pendingVideosCount})
          </button>
          <button
            onClick={() => setSelectedFilter('in_progress')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: selectedFilter === 'in_progress' ? '#f43f5e' : '#172033',
              color: selectedFilter === 'in_progress' ? 'white' : '#94a3b8'
            }}
          >
            🎧 En progreso
          </button>
          <button
            onClick={() => setSelectedFilter('favorites')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: selectedFilter === 'favorites' ? '#f43f5e' : '#172033',
              color: selectedFilter === 'favorites' ? 'white' : '#94a3b8'
            }}
          >
            ⭐ Favoritos ({favoriteVideosCount})
          </button>
          {collections.map(col => (
            <button
              key={col.id}
              onClick={() => setSelectedFilter(col.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: selectedFilter === col.id ? '#f43f5e' : '#172033',
                color: selectedFilter === col.id ? 'white' : '#94a3b8'
              }}
            >
              {col.name}
            </button>
          ))}
        </div>

        {/* Tab: HOME */}
        {activeTab === 'home' && (
          <div className="fade-in">
            {/* Attention Card: Unread / Pending Saves (Screenshot 2 Inspiration) */}
            {pendingVideosCount > 0 && selectedFilter === 'all' && !searchQuery && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(244,63,94,0.18) 0%, rgba(18,24,38,0.9) 100%)',
                border: '1px solid rgba(244,63,94,0.3)',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <div style={{
                  background: '#f43f5e',
                  color: 'white',
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '1.1rem',
                  flexShrink: 0
                }}>
                  {pendingVideosCount}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'white', marginBottom: '2px' }}>
                    Videos Pendientes en tu Bóveda
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Aún tienes contenido clave por estudiar o revisar.
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFilter('pending')}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Ver Todos
                </button>
              </div>
            )}

            {/* Video Cards Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {filteredVideos.map(video => (
                <div
                  key={video.id}
                  onClick={() => {
                    setSelectedVideo(video);
                    setActiveNotes(video.personalNotes || '');
                  }}
                  style={{
                    background: '#131b2c',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid #1e293f',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  {/* Thumbnail Container */}
                  <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#0a0e17' }}>
                    <img
                      src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeVideoId}/hqdefault.jpg`}
                      alt={video.title}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      loading="lazy"
                    />

                    {/* Play Overlay Button */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(244, 63, 94, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                      }}>
                        <Play size={20} color="white" fill="white" style={{ marginLeft: '2px' }} />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: 'rgba(0,0,0,0.85)',
                      color: 'white',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {video.duration || '15:00'}
                    </div>

                    {/* Watch Status Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.68rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: video.watchStatus === 'watched' ? 'rgba(16, 185, 129, 0.9)' :
                        video.watchStatus === 'in_progress' ? 'rgba(56, 189, 248, 0.9)' : 'rgba(245, 158, 11, 0.9)',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                    }}>
                      {video.watchStatus === 'watched' ? '✓ Visto' : video.watchStatus === 'in_progress' ? '🎧 En Progreso' : '⏳ Pendiente'}
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => handleToggleFavorite(video, e)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(0,0,0,0.65)',
                        border: 'none',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      <Heart
                        size={16}
                        color={video.isFavorite ? '#f43f5e' : 'white'}
                        fill={video.isFavorite ? '#f43f5e' : 'transparent'}
                      />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                      <h3 style={{ fontSize: '0.96rem', fontWeight: '700', color: 'white', lineHeight: '1.35', flex: 1 }}>
                        {video.title}
                      </h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: '#f43f5e',
                          color: 'white',
                          fontSize: '0.6rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800'
                        }}>
                          {video.channelName ? video.channelName[0] : 'Y'}
                        </div>
                        <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '500' }}>
                          {video.channelName}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {video.collectionName}
                      </span>
                    </div>

                    {/* Tags */}
                    {video.tags && video.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {video.tags.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: '#1c2638',
                              color: '#cbd5e1',
                              fontSize: '0.68rem',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontWeight: '500'
                            }}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quick indicator if has personal notes */}
                    {video.personalNotes && (
                      <div style={{
                        marginTop: '10px',
                        padding: '6px 10px',
                        background: 'rgba(56, 189, 248, 0.08)',
                        borderRadius: '8px',
                        borderLeft: '3px solid #38bdf8',
                        fontSize: '0.74rem',
                        color: '#93c5fd'
                      }}>
                        💡 <em>"{video.personalNotes.slice(0, 70)}..."</em>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filteredVideos.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '50px 20px',
                  background: '#131b2c',
                  borderRadius: '16px',
                  border: '1px solid #1e293f'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔍</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '6px' }}>No hay videos que coincidan</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '18px' }}>
                    Prueba con otra palabra clave o agrega un nuevo video con el botón '+'.
                  </p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    style={{
                      background: '#f43f5e',
                      color: 'white',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    ➕ Agregar Video a la Bóveda
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: EXPLORE / COLECCIONES */}
        {activeTab === 'explore' && (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} color="#f43f5e" />
              Colecciones Temáticas
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
              {collections.map(col => {
                const colVideos = videos.filter(v => v.collectionId === col.id);
                return (
                  <div
                    key={col.id}
                    onClick={() => {
                      setSelectedFilter(col.id);
                      setActiveTab('home');
                    }}
                    style={{
                      background: '#131b2c',
                      border: '1px solid #1e293f',
                      borderRadius: '14px',
                      padding: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: col.color || '#f43f5e',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        <Folder size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'white' }}>{col.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{col.description}</div>
                      </div>
                    </div>
                    <span style={{
                      background: '#1e293f',
                      color: '#f43f5e',
                      fontWeight: '700',
                      fontSize: '0.8rem',
                      padding: '4px 10px',
                      borderRadius: '9999px'
                    }}>
                      {colVideos.length} videos
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab: VAULT / BIBLIOTECA & CONFIG */}
        {activeTab === 'vault' && (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bookmark size={20} color="#f43f5e" />
              Mi Bóveda Personal
            </h2>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#131b2c', border: '1px solid #1e293f', borderRadius: '14px', padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Total Videos</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'white' }}>{videos.length}</div>
              </div>
              <div style={{ background: '#131b2c', border: '1px solid #1e293f', borderRadius: '14px', padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Pendientes</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f59e0b' }}>{pendingVideosCount}</div>
              </div>
              <div style={{ background: '#131b2c', border: '1px solid #1e293f', borderRadius: '14px', padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Vistos / Aprendidos</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981' }}>
                  {videos.filter(v => v.watchStatus === 'watched').length}
                </div>
              </div>
              <div style={{ background: '#131b2c', border: '1px solid #1e293f', borderRadius: '14px', padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Favoritos</div>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#f43f5e' }}>{favoriteVideosCount}</div>
              </div>
            </div>

            {/* Tools and Actions */}
            <div style={{ background: '#131b2c', border: '1px solid #1e293f', borderRadius: '14px', padding: '18px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '14px', color: 'white' }}>
                Gestión de Bóveda & Respaldo
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href="/api/videos/export/json"
                  download="youtubevolt-backup.json"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#1a243a',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    border: '1px solid #24324f'
                  }}
                >
                  <Download size={16} color="#38bdf8" />
                  Descargar Copia de Seguridad (JSON)
                </a>

                <button
                  onClick={handleResetData}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#1a243a',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    color: '#f87171',
                    border: '1px solid #24324f',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    textAlign: 'left'
                  }}
                >
                  <RotateCcw size={16} />
                  Restablecer Contenido Demo del Masterclass
                </button>
              </div>
            </div>

            {/* Portal & Studio links */}
            <div style={{ background: '#131b2c', border: '1px solid #1e293f', borderRadius: '14px', padding: '18px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '12px', color: 'white' }}>
                Navegación del Ecosistema
              </h3>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a
                  href="/"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    background: '#1e293b',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '600'
                  }}
                >
                  🌐 Portal Videos
                </a>
                <a
                  href="/admin"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    background: '#2563eb',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: '600'
                  }}
                >
                  ⚙️ Panel Studio
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button (+) */}
      <button
        onClick={() => setShowAddModal(true)}
        className="pulse-glow"
        style={{
          position: 'fixed',
          bottom: '86px',
          right: '20px',
          zIndex: 40,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff0033 0%, #be123c 100%)',
          color: 'white',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(255, 0, 51, 0.45)',
          cursor: 'pointer'
        }}
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {/* Fixed Bottom Navigation (Screenshot 1 Design) */}
      <nav className="glass-nav" style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        height: '68px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom, 6px)'
      }}>
        <button
          onClick={() => setActiveTab('home')}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: activeTab === 'home' ? '#f43f5e' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: activeTab === 'home' ? '700' : '500'
          }}
        >
          <Home size={22} />
          <span>Inicio</span>
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: activeTab === 'explore' ? '#f43f5e' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: activeTab === 'explore' ? '700' : '500'
          }}
        >
          <Compass size={22} />
          <span>Explorar</span>
        </button>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            background: '#ff0033',
            border: 'none',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(255, 0, 51, 0.4)'
          }}
        >
          <Plus size={22} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => {
            setActiveTab('home');
            setSelectedFilter('pending');
          }}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: selectedFilter === 'pending' && activeTab === 'home' ? '#f43f5e' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: selectedFilter === 'pending' ? '700' : '500'
          }}
        >
          <Clock size={22} />
          <span>Pendientes</span>
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            color: activeTab === 'vault' ? '#f43f5e' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: activeTab === 'vault' ? '700' : '500'
          }}
        >
          <Bookmark size={22} />
          <span>Bóveda</span>
        </button>
      </nav>

      {/* Modal: GUARDAR NUEVO VIDEO */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <div className="fade-in" style={{
            background: '#121826',
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90vh',
            overflowY: 'auto',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            border: '1px solid #243048',
            padding: '24px',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={20} color="#f43f5e" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'white' }}>Guardar en Bóveda</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveVideo} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                  Enlace de YouTube *
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=... o shorts"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#1a243a',
                    border: '1px solid #2b3a58',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              {/* Live Preview if ID detected */}
              {extractYouTubeId(newUrl) && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  background: 'rgba(244, 63, 94, 0.08)',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid rgba(244, 63, 94, 0.25)',
                  alignItems: 'center'
                }}>
                  <img
                    src={`https://img.youtube.com/vi/${extractYouTubeId(newUrl)}/hqdefault.jpg`}
                    alt="Preview"
                    style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '6px' }}
                  />
                  <div style={{ fontSize: '0.78rem', color: '#f43f5e', fontWeight: '600' }}>
                    ✓ Video reconocido (ID: {extractYouTubeId(newUrl)})
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                  Título del Video
                </label>
                <input
                  type="text"
                  placeholder="Título para tu biblioteca"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#1a243a',
                    border: '1px solid #2b3a58',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                  Canal / Creador
                </label>
                <input
                  type="text"
                  placeholder="Ej: Midudev, DotCSV, Platzi"
                  value={newChannel}
                  onChange={(e) => setNewChannel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#1a243a',
                    border: '1px solid #2b3a58',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                  Colección
                </label>
                <select
                  value={newCollection}
                  onChange={(e) => setNewCollection(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#1a243a',
                    border: '1px solid #2b3a58',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                >
                  {collections.map(col => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                  Etiquetas (separadas por comas)
                </label>
                <input
                  type="text"
                  placeholder="AI, Agentes, Tutorial, Masterclass"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#1a243a',
                    border: '1px solid #2b3a58',
                    color: 'white',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
                  Notas de Aprendizaje Iniciales
                </label>
                <textarea
                  placeholder="¿Por qué guardaste este video? Puntos clave a recordar..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: '#1a243a',
                    border: '1px solid #2b3a58',
                    color: 'white',
                    fontSize: '0.85rem',
                    resize: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                style={{
                  background: 'linear-gradient(135deg, #ff0033 0%, #be123c 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  marginTop: '10px',
                  boxShadow: '0 8px 20px rgba(255, 0, 51, 0.4)'
                }}
              >
                {isSaving ? 'Guardando...' : '💾 Guardar en YouTubeVolt'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: REPRODUCTOR & DETALLES DEL VIDEO */}
      {selectedVideo && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.92)',
          backdropFilter: 'blur(10px)',
          zIndex: 110,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          <div className="fade-in" style={{
            background: '#0d131f',
            width: '100%',
            maxWidth: '480px',
            maxHeight: '95vh',
            overflowY: 'auto',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            border: '1px solid #243048',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Embedded Official YouTube Player */}
            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeVideoId}?autoplay=1&rel=0`}
                title={selectedVideo.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Video Info and Controls */}
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'white', lineHeight: '1.3' }}>
                  {selectedVideo.title}
                </h2>
                <button
                  onClick={() => setSelectedVideo(null)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={22} />
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.85rem', color: '#f43f5e', fontWeight: '600' }}>
                  {selectedVideo.channelName}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Duración: {selectedVideo.duration || '15:00'}
                </div>
              </div>

              {/* Status Selectors */}
              <div style={{
                display: 'flex',
                gap: '8px',
                background: '#151d2c',
                padding: '6px',
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                <button
                  onClick={() => handleStatusChange(selectedVideo, 'pending')}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.76rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    background: selectedVideo.watchStatus === 'pending' ? '#f59e0b' : 'transparent',
                    color: selectedVideo.watchStatus === 'pending' ? 'white' : '#94a3b8'
                  }}
                >
                  ⏳ Pendiente
                </button>
                <button
                  onClick={() => handleStatusChange(selectedVideo, 'in_progress')}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.76rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    background: selectedVideo.watchStatus === 'in_progress' ? '#38bdf8' : 'transparent',
                    color: selectedVideo.watchStatus === 'in_progress' ? 'white' : '#94a3b8'
                  }}
                >
                  🎧 En Curso
                </button>
                <button
                  onClick={() => handleStatusChange(selectedVideo, 'watched')}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '0.76rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    background: selectedVideo.watchStatus === 'watched' ? '#10b981' : 'transparent',
                    color: selectedVideo.watchStatus === 'watched' ? 'white' : '#94a3b8'
                  }}
                >
                  ✅ Visto
                </button>
              </div>

              {/* Learning Notepad */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8' }}>
                    📝 Notas Personales de Aprendizaje
                  </label>
                  <button
                    onClick={handleSaveNotes}
                    style={{
                      background: '#2563eb',
                      color: 'white',
                      border: 'none',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Guardar Notas
                  </button>
                </div>
                <textarea
                  value={activeNotes}
                  onChange={(e) => setActiveNotes(e.target.value)}
                  placeholder="Anota aquí ideas clave, marcas de tiempo (ej: 04:20), comandos o reflexiones..."
                  rows={4}
                  style={{
                    width: '100%',
                    background: '#151d2c',
                    border: '1px solid #243048',
                    borderRadius: '10px',
                    padding: '10px',
                    color: 'white',
                    fontSize: '0.82rem',
                    resize: 'none'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                <a
                  href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: '#ff0033',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    fontWeight: '700'
                  }}
                >
                  <ExternalLink size={14} /> Abrir en YouTube
                </a>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${selectedVideo.youtubeVideoId}`);
                    showToast('📋 Enlace copiado al portapapeles');
                  }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: '#1e293f',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '700'
                  }}
                >
                  <Share2 size={14} /> Compartir
                </button>

                <button
                  onClick={(e) => handleDeleteVideo(selectedVideo.id, e)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
