import React, { useState, useEffect } from 'react';

const FALLBACK_BURGERS = [
  {
    id: 1,
    name: 'Rey de las hamburguesas a la parrilla',
    category: 'A la Parrilla',
    badge: 'Doble Carne XXL * 380g',
    price: 14.99,
    stock: 45,
    active: true,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80',
    description: 'Carne 100% Angus flameada a la leña de roble, queso cheddar añejo fundido, cebolla al bourbon y panceta crocante.'
  },
  {
    id: 2,
    name: 'Hamburgueza Real',
    category: 'A la Parrilla',
    badge: 'Clásica Imperial * 240g',
    price: 11.50,
    stock: 60,
    active: true,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&auto=format&fit=crop&q=80',
    description: 'Doble medallón smash con costra caramelizada, queso americano fundido, pepinillos agridulces y aderezo imperial.'
  },
  {
    id: 3,
    name: 'Hamburgueza Royal Crispy',
    category: 'Pollo Crispy',
    badge: 'Crispy Gold Pechuga * 260g',
    price: 12.99,
    stock: 38,
    active: true,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=400&auto=format&fit=crop&q=80',
    description: 'Pechuga marinada 24h con triple rebozado crujiente, ensalada coleslaw de manzana verde y salsa honey mustard.'
  },
  {
    id: 4,
    name: 'Hamburgueza Double Whopper',
    category: 'Gigantes XXL',
    badge: 'Fuego Parrillero * 420g',
    price: 15.50,
    stock: 28,
    active: true,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&auto=format&fit=crop&q=80',
    description: 'Doble medallón gigante a la parrilla sobre carbón vivo, lechuga romana, tomate maduro, aros de cebolla y mayo ahumada.'
  },
  {
    id: 5,
    name: 'Smash Burger Trufada Supreme',
    category: 'Smash Burgers',
    badge: 'Doble Smash Angus * 220g',
    price: 13.75,
    stock: 35,
    active: true,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&auto=format&fit=crop&q=80',
    description: 'Técnica smash en plancha de cromo con costra crujiente, queso suizo fundido y mayonesa de trufa negra.'
  },
  {
    id: 6,
    name: 'Bacon Monster Cheddar Melt',
    category: 'Gigantes XXL',
    badge: 'Triple Bacon Ahumado * 350g',
    price: 14.50,
    stock: 42,
    active: true,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&auto=format&fit=crop&q=80',
    description: 'Cascada de queso cheddar líquido fundido y 6 tiras crujientes de bacon ahumado con miel de maple.'
  },
  {
    id: 7,
    name: 'Volcán Criollo Chimichurri',
    category: 'A la Parrilla',
    badge: 'Corte de Asado * 300g',
    price: 13.90,
    stock: 30,
    active: true,
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&auto=format&fit=crop&q=80',
    description: 'Medallón grueso sazonado al punto con provolone fundido al fuego, pimientos morrones y chimichurri criollo.'
  },
  {
    id: 8,
    name: 'Chili Pepper Jack Picante',
    category: 'Especiales del Chef',
    badge: 'Spicy Jalapeño Crunch * 280g',
    price: 12.50,
    stock: 25,
    active: true,
    image: 'https://images.unsplash.com/photo-1582196016295-f8c8bd4b3e99?w=400&auto=format&fit=crop&q=80',
    description: 'Pepper jack picante, jalapeños dorados en hierro, guacamole cremoso y suave alioli de chipotle.'
  },
  {
    id: 9,
    name: 'Black Angus BBQ Ribs Glazed',
    category: 'Especiales del Chef',
    badge: 'Costilla Desmechada * 340g',
    price: 16.20,
    stock: 20,
    active: true,
    image: 'https://images.unsplash.com/photo-1549611016-3a70d82b5040?w=400&auto=format&fit=crop&q=80',
    description: 'Medallón Black Angus coronado con costilla desmechada ahumada 8h y salsa BBQ dulce de bourbon.'
  },
  {
    id: 10,
    name: 'Mushroom Swiss Gourmet',
    category: 'Gourmet',
    badge: 'Hongos Salteados & Emmental * 250g',
    price: 13.20,
    stock: 32,
    active: true,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&auto=format&fit=crop&q=80',
    description: 'Carne selecta con mezcla de portobellos salteados en mantequilla con romero y queso suizo Emmental derretido.'
  }
];

const CONSUMER_SEGMENTS = [
  {
    id: 'vip',
    name: 'VIP Diamond (> 10 burgers/mes)',
    badge: 'DIAMOND 👑',
    count: 84,
    percent: 13,
    revenueShare: '42% del total',
    avgTicket: '$38.50',
    color: '#38bdf8'
  },
  {
    id: 'recurrent',
    name: 'Gourmet Recurrentes (4-9 burgers/mes)',
    badge: 'GOLD ⭐',
    count: 192,
    percent: 29,
    revenueShare: '36% del total',
    avgTicket: '$24.20',
    color: '#f59e0b'
  },
  {
    id: 'casual',
    name: 'Ocasionales / Nuevos (1-3 burgers/mes)',
    badge: 'SILVER 🥈',
    count: 340,
    percent: 51,
    revenueShare: '22% del total',
    avgTicket: '$15.10',
    color: '#10b981'
  },
  {
    id: 'churn',
    name: 'En Riesgo (> 30 días sin ordenar)',
    badge: 'ATENCIÓN ⚠️',
    count: 45,
    percent: 7,
    revenueShare: 'Reactivar',
    avgTicket: '$18.00',
    color: '#ef4444'
  }
];

const TOP_CONSUMERS = [
  { rank: 1, name: 'Pablo Valdivia', avatar: 'PV', tier: 'VIP Diamond', burgersMonth: 14, totalSpend: 218.40, favorite: 'Rey de las hamburguesas a la parrilla', points: 1850 },
  { rank: 2, name: 'Valeria Mendoza', avatar: 'VM', tier: 'VIP Diamond', burgersMonth: 12, totalSpend: 174.90, favorite: 'Smash Burger Trufada Supreme', points: 1540 },
  { rank: 3, name: 'Rodrigo Gómez', avatar: 'RG', tier: 'VIP Diamond', burgersMonth: 10, totalSpend: 155.00, favorite: 'Hamburgueza Double Whopper', points: 1390 },
  { rank: 4, name: 'Sofía Carranza', avatar: 'SC', tier: 'Gourmet Recurrente', burgersMonth: 8, totalSpend: 103.92, favorite: 'Hamburgueza Royal Crispy', points: 980 },
  { rank: 5, name: 'Carlos Benítez', avatar: 'CB', tier: 'Gourmet Recurrente', burgersMonth: 7, totalSpend: 98.50, favorite: 'Volcán Criollo Chimichurri', points: 890 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'consumers' | 'database'
  const [burgers, setBurgers] = useState(FALLBACK_BURGERS);
  const [dbHealth, setDbHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusNotification, setStatusNotification] = useState(null);

  // Form state for creating a new burger variant
  const [newBurger, setNewBurger] = useState({
    name: '',
    category: 'A la Parrilla',
    badge: 'Doble Carne * 300g',
    price: 13.50,
    stock: 30,
    description: '',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80'
  });

  const notify = (msg) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3000);
  };

  // Fetch products and DB health
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // 1. Health & DB Status
      const healthRes = await fetch('/api/health');
      if (healthRes.ok) {
        const healthData = await healthRes.json();
        setDbHealth(healthData);
      }
    } catch (err) {
      console.warn('API health check error:', err);
    }

    try {
      // 2. Products
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.data && prodData.data.length > 0) {
          const mapped = prodData.data.map((p) => ({
            ...p,
            active: p.active !== undefined ? p.active : true,
            badge: p.badge || 'Especial * 250g'
          }));
          setBurgers(mapped);
        }
      }
    } catch (err) {
      console.warn('API products fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Stock and Availability modifications
  const toggleAvailability = (id) => {
    setBurgers((prev) =>
      prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
    );
    notify('Estado de disponibilidad actualizado');
  };

  const adjustStock = (id, delta) => {
    setBurgers((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const newStock = Math.max(0, (b.stock || 0) + delta);
          return { ...b, stock: newStock };
        }
        return b;
      })
    );
  };

  // Add new burger variant
  const handleCreateBurger = async (e) => {
    e.preventDefault();
    if (!newBurger.name || !newBurger.price) return;

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBurger)
      });
      if (res.ok) {
        const result = await res.json();
        notify(`🍔 ¡Variante "${newBurger.name}" guardada en la base de datos!`);
        setShowAddModal(false);
        fetchData();
        return;
      }
    } catch (err) {
      console.warn('Error creating burger in API, using local state:', err);
    }

    // Local fallback addition
    const localCreated = {
      ...newBurger,
      id: Date.now(),
      active: true,
      price: parseFloat(newBurger.price),
      stock: parseInt(newBurger.stock, 10)
    };
    setBurgers([localCreated, ...burgers]);
    setShowAddModal(false);
    notify(`🍔 ¡Variante "${newBurger.name}" agregada exitosamente!`);
  };

  // Filtered burgers
  const filteredBurgers = burgers.filter((b) => {
    const matchCat = categoryFilter === 'Todas' || b.category === categoryFilter;
    const matchSearch = searchFilter === '' ||
      b.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (b.badge && b.badge.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0b0f19', color: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Navbar */}
      <header style={{
        background: '#111827',
        borderBottom: '1px solid #1f2937',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.75rem' }}>⚙️</span>
          <div>
            <div style={{ fontWeight: '900', fontSize: '1.2rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>NextCollege Burger Rapid</span>
              <span style={{
                background: 'rgba(37, 99, 235, 0.2)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: '800'
              }}>
                ADMIN DASHBOARD
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Panel de Control Central &bull; Gestión Comercial & Base de Datos
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#172033',
            border: '1px solid #1f2937',
            padding: '6px 12px',
            borderRadius: '10px',
            fontSize: '0.8rem'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: dbHealth?.database?.connected ? '#10b981' : '#f59e0b'
            }} />
            <span style={{ fontWeight: '700', color: '#cbd5e1' }}>
              {dbHealth?.database?.mode === 'mysql' ? 'MySQL: Conectado' : 'DB: In-Memory'}
            </span>
          </div>

          <a
            href="/"
            style={{
              background: '#1f2937',
              color: '#38bdf8',
              border: '1px solid #374151',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '700',
              textDecoration: 'none'
            }}
          >
            🌐 E-commerce
          </a>
          <a
            href="/app"
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: '700',
              textDecoration: 'none'
            }}
          >
            📱 App PWA
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1360px', width: '100%', margin: '0 auto', padding: '24px', flex: 1 }}>
        
        {/* KPI Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {/* Card 1: Ventas Hoy */}
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
                Ventas del Día
              </span>
              <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '800' }}>
                +18.4%
              </span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#f8fafc', letterSpacing: '-0.02em' }}>
              $4,892.50
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
              384 hamburguesas servidas a fuego vivo hoy
            </div>
          </div>

          {/* Card 2: Variantes Disponibles */}
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
                Catálogo de Hamburguesas
              </span>
              <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '800' }}>
                10 VARIANTES
              </span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#38bdf8', letterSpacing: '-0.02em' }}>
              {burgers.filter(b => b.active).length} / {burgers.length} Activas
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
              100% con gramaje y nivel de especialidad
            </div>
          </div>

          {/* Card 3: Clientes Segmentados */}
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
                Comensales Registrados
              </span>
              <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '800' }}>
                LEALTAD ORO
              </span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '900', color: '#fbbf24', letterSpacing: '-0.02em' }}>
              661 Clientes
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
              84 clientes en segmento VIP Diamond (&gt;10 burgers)
            </div>
          </div>

          {/* Card 4: Base de Datos */}
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
                Estado Base de Datos
              </span>
              <span style={{
                background: dbHealth?.database?.connected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: dbHealth?.database?.connected ? '#10b981' : '#f59e0b',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: '800'
              }}>
                {dbHealth?.database?.connected ? 'CONECTADA' : 'IN-MEMORY'}
              </span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#f8fafc' }}>
              {dbHealth?.database?.mode === 'mysql' ? '🐬 MySQL Pool' : '⚡ En Memoria Demo'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>
              Latencia: &lt; 9ms &bull; Dokploy CI/CD Live
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid #1f2937',
          paddingBottom: '12px',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => setActiveTab('inventory')}
            style={{
              background: activeTab === 'inventory' ? '#2563eb' : '#111827',
              color: activeTab === 'inventory' ? 'white' : '#94a3b8',
              border: `1px solid ${activeTab === 'inventory' ? '#2563eb' : '#1f2937'}`,
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: '800',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>🍔</span> Hamburguesas Disponibles ({burgers.length})
          </button>

          <button
            onClick={() => setActiveTab('consumers')}
            style={{
              background: activeTab === 'consumers' ? '#2563eb' : '#111827',
              color: activeTab === 'consumers' ? 'white' : '#94a3b8',
              border: `1px solid ${activeTab === 'consumers' ? '#2563eb' : '#1f2937'}`,
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: '800',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>👥</span> Métricas de Consumidores por Consumo
          </button>

          <button
            onClick={() => setActiveTab('database')}
            style={{
              background: activeTab === 'database' ? '#2563eb' : '#111827',
              color: activeTab === 'database' ? 'white' : '#94a3b8',
              border: `1px solid ${activeTab === 'database' ? '#2563eb' : '#1f2937'}`,
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: '800',
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>🗄️</span> Estado de la Base de Datos
          </button>
        </div>

        {/* ==================================================== */}
        {/* TAB 1: HAMBURGUESAS DISPONIBLES                      */}
        {/* ==================================================== */}
        {activeTab === 'inventory' && (
          <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#f8fafc' }}>
                  Inventario de Hamburguesas & Disponibilidad
                </h2>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Control de stock en cocina, precios, estado en carta y especialidades
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Filtrar por nombre o peso..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  style={{
                    background: '#172033',
                    border: '1px solid #1f2937',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    color: 'white',
                    fontSize: '0.82rem',
                    outline: 'none',
                    width: '220px'
                  }}
                />

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  style={{
                    background: '#172033',
                    border: '1px solid #1f2937',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: 'white',
                    fontSize: '0.82rem',
                    outline: 'none'
                  }}
                >
                  <option value="Todas">Todas las Categorías</option>
                  <option value="A la Parrilla">A la Parrilla</option>
                  <option value="Smash Burgers">Smash Burgers</option>
                  <option value="Gigantes XXL">Gigantes XXL</option>
                  <option value="Pollo Crispy">Pollo Crispy</option>
                  <option value="Especiales del Chef">Especiales del Chef</option>
                  <option value="Gourmet">Gourmet</option>
                </select>

                <button
                  onClick={() => setShowAddModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '800',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>+</span> Nueva Variante
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1f2937', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '12px 14px' }}>Hamburguesa</th>
                    <th style={{ padding: '12px 14px' }}>Nivel de Especialidad</th>
                    <th style={{ padding: '12px 14px' }}>Categoría</th>
                    <th style={{ padding: '12px 14px' }}>Precio</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Stock Cocina</th>
                    <th style={{ padding: '12px 14px', textAlign: 'center' }}>Estado</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBurgers.map((b) => (
                    <tr
                      key={b.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        opacity: b.active ? 1 : 0.6,
                        transition: 'opacity 0.2s'
                      }}
                    >
                      <td style={{ padding: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={b.image}
                          alt={b.name}
                          style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #1f2937' }}
                        />
                        <div>
                          <div style={{ fontWeight: '800', color: '#f8fafc', fontSize: '0.9rem' }}>{b.name}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {b.description}
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px' }}>
                        <span style={{
                          background: 'rgba(245, 158, 11, 0.15)',
                          border: '1px solid rgba(245, 158, 11, 0.35)',
                          color: '#fbbf24',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: '800'
                        }}>
                          ⚖️ {b.badge}
                        </span>
                      </td>

                      <td style={{ padding: '14px', color: '#cbd5e1' }}>
                        {b.category}
                      </td>

                      <td style={{ padding: '14px', fontWeight: '900', color: '#38bdf8', fontSize: '1rem' }}>
                        ${parseFloat(b.price).toFixed(2)}
                      </td>

                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#172033', padding: '2px 6px', borderRadius: '8px' }}>
                          <button
                            onClick={() => adjustStock(b.id, -1)}
                            style={{ background: '#334155', color: 'white', border: 'none', width: '22px', height: '22px', borderRadius: '4px', cursor: 'pointer', fontWeight: '900' }}
                          >
                            -
                          </button>
                          <span style={{ fontWeight: '800', minWidth: '28px', textAlign: 'center' }}>
                            {b.stock}
                          </span>
                          <button
                            onClick={() => adjustStock(b.id, 1)}
                            style={{ background: '#2563eb', color: 'white', border: 'none', width: '22px', height: '22px', borderRadius: '4px', cursor: 'pointer', fontWeight: '900' }}
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        <span style={{
                          background: b.active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: b.active ? '#10b981' : '#ef4444',
                          border: `1px solid ${b.active ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: '800'
                        }}>
                          {b.active ? 'En Menú' : 'Pausado'}
                        </span>
                      </td>

                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <button
                          onClick={() => toggleAvailability(b.id)}
                          style={{
                            background: b.active ? '#1f2937' : '#10b981',
                            color: b.active ? '#cbd5e1' : 'white',
                            border: '1px solid #374151',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          {b.active ? 'Pausar' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: MÉTRICAS DE CONSUMIDORES POR CONSUMO         */}
        {/* ==================================================== */}
        {activeTab === 'consumers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Segmentation Cards */}
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#f8fafc', marginBottom: '6px' }}>
                Segmentación de Consumidores por Nivel de Consumo
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '18px' }}>
                Análisis de frecuencia de pedidos, ticket medio y participación en la facturación total
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px'
              }}>
                {CONSUMER_SEGMENTS.map((seg) => (
                  <div
                    key={seg.id}
                    style={{
                      background: '#111827',
                      border: '1px solid #1f2937',
                      borderTop: `4px solid ${seg.color}`,
                      borderRadius: '16px',
                      padding: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: seg.color, fontWeight: '800' }}>
                        {seg.badge}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {seg.percent}% de la base
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f8fafc', marginBottom: '8px' }}>
                      {seg.name}
                    </h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #1f2937' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Consumidores</div>
                        <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#f8fafc' }}>{seg.count} clientes</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Ticket Medio</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#38bdf8' }}>{seg.avgTicket}</div>
                      </div>
                    </div>

                    <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#94a3b8', background: '#090d16', padding: '6px 10px', borderRadius: '6px' }}>
                      Aporte a Facturación: <strong style={{ color: '#f8fafc' }}>{seg.revenueShare}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Volume Bar */}
            <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#f8fafc', marginBottom: '10px' }}>
                Distribución Proporcional de Ingresos por Segmento de Consumo
              </h3>
              <div style={{ height: '14px', width: '100%', background: '#1e293b', borderRadius: '999px', display: 'flex', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ width: '42%', background: '#38bdf8' }} title="VIP Diamond: 42%" />
                <div style={{ width: '36%', background: '#f59e0b' }} title="Gourmet Recurrentes: 36%" />
                <div style={{ width: '22%', background: '#10b981' }} title="Ocasionales: 22%" />
              </div>
              <div style={{ display: 'flex', gap: '20px', fontSize: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ color: '#38bdf8' }}>● VIP Diamond: 42%</span>
                <span style={{ color: '#f59e0b' }}>● Gourmet Recurrentes: 36%</span>
                <span style={{ color: '#10b981' }}>● Ocasionales: 22%</span>
              </div>
            </div>

            {/* Top Consumer Leaderboard */}
            <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f8fafc' }}>
                    Top Comensales de Mayor Consumo del Mes
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    Clientes con mayor frecuencia de recompra y mayor gasto acumulado
                  </p>
                </div>
                <span style={{ background: '#172033', padding: '6px 12px', borderRadius: '8px', fontSize: '0.78rem', color: '#fbbf24', fontWeight: '800' }}>
                  👑 Club de Hamburguesas
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #1f2937', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '10px 12px' }}>Pos</th>
                      <th style={{ padding: '10px 12px' }}>Cliente</th>
                      <th style={{ padding: '10px 12px' }}>Nivel</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Hamburguesas / Mes</th>
                      <th style={{ padding: '10px 12px' }}>Variante Favorita</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Gasto Acumulado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOP_CONSUMERS.map((c) => (
                      <tr key={c.rank} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '12px', fontWeight: '900', color: c.rank === 1 ? '#fbbf24' : '#94a3b8' }}>
                          #{c.rank}
                        </td>
                        <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: '#2563eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: '800',
                            fontSize: '0.75rem'
                          }}>
                            {c.avatar}
                          </div>
                          <div>
                            <div style={{ fontWeight: '800', color: '#f8fafc' }}>{c.name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#fbbf24' }}>{c.points} BurgerPoints</div>
                          </div>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            background: c.tier.includes('VIP') ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: c.tier.includes('VIP') ? '#38bdf8' : '#fbbf24',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: '800'
                          }}>
                            {c.tier}
                          </span>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center', fontWeight: '800', color: '#f8fafc', fontSize: '0.95rem' }}>
                          🔥 {c.burgersMonth}
                        </td>
                        <td style={{ padding: '12px', color: '#cbd5e1', fontSize: '0.82rem' }}>
                          {c.favorite}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: '900', color: '#10b981', fontSize: '0.95rem' }}>
                          ${c.totalSpend.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: ESTADO DE LA BASE DE DATOS                   */}
        {/* ==================================================== */}
        {activeTab === 'database' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#f8fafc' }}>
                    Diagnóstico en Vivo de la Base de Datos
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    Monitoreo de conexión a MySQL, latencia de consultas y pool de conexiones
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={fetchData}
                    style={{
                      background: '#1f2937',
                      color: '#38bdf8',
                      border: '1px solid #374151',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    🔄 Refrescar Estado
                  </button>
                  <button
                    onClick={async () => {
                      if (confirm('¿Restablecer las 10 hamburguesas maestras a los valores por defecto?')) {
                        await fetch('/api/reset', { method: 'POST' });
                        fetchData();
                        notify('🌱 Datos de demostración restablecidos');
                      }
                    }}
                    style={{
                      background: 'rgba(234, 88, 12, 0.15)',
                      color: '#fb923c',
                      border: '1px solid rgba(234, 88, 12, 0.3)',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    🌱 Restablecer Catálogo Demo
                  </button>
                </div>
              </div>

              {/* Status Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div style={{ background: '#172033', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
                    Modo de Operación
                  </div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '900', color: dbHealth?.database?.connected ? '#10b981' : '#f59e0b', marginTop: '4px' }}>
                    {dbHealth?.database?.mode === 'mysql' ? '🐬 Conectado a MySQL' : '⚡ Modo In-Memory Activo'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                    Respaldo automático con conmutación por fallo transparente
                  </div>
                </div>

                <div style={{ background: '#172033', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
                    Host / Instancia
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#f8fafc', marginTop: '4px', fontFamily: 'monospace' }}>
                    {dbHealth?.database?.host || 'Auto-descubrimiento activo'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                    Base de datos: <strong style={{ color: '#cbd5e1' }}>{dbHealth?.database?.database || 'demo'}</strong>
                  </div>
                </div>

                <div style={{ background: '#172033', border: '1px solid #1f2937', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
                    Tiempo de Actividad (Uptime)
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#38bdf8', marginTop: '4px' }}>
                    {dbHealth?.uptime ? `${Math.floor(dbHealth.uptime)} seg` : 'Activo'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>
                    Plataforma: Dokploy CI/CD Live
                  </div>
                </div>
              </div>

              {/* Raw JSON Debug Box */}
              <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Respuesta en Tiempo Real (/api/health)
                </div>
                <pre style={{ color: '#38bdf8', fontSize: '0.8rem', overflowX: 'auto', fontFamily: 'monospace', margin: 0 }}>
                  {JSON.stringify(dbHealth || { status: 'Consultando...' }, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Crear Nueva Variante de Hamburguesa */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(6px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#111827',
            border: '1px solid #1f2937',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#f8fafc' }}>
                🍔 Crear Nueva Hamburguesa
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateBurger} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', marginBottom: '4px' }}>
                  Nombre de la Hamburguesa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Hamburguesa Vikinga Ahumada"
                  value={newBurger.name}
                  onChange={(e) => setNewBurger({ ...newBurger, name: e.target.value })}
                  style={{ width: '100%', background: '#172033', border: '1px solid #1f2937', borderRadius: '8px', padding: '9px 12px', color: 'white', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', marginBottom: '4px' }}>
                    Nivel de Especialidad *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Doble Carne XXL * 380g"
                    value={newBurger.badge}
                    onChange={(e) => setNewBurger({ ...newBurger, badge: e.target.value })}
                    style={{ width: '100%', background: '#172033', border: '1px solid #1f2937', borderRadius: '8px', padding: '9px 12px', color: 'white', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', marginBottom: '4px' }}>
                    Categoría
                  </label>
                  <select
                    value={newBurger.category}
                    onChange={(e) => setNewBurger({ ...newBurger, category: e.target.value })}
                    style={{ width: '100%', background: '#172033', border: '1px solid #1f2937', borderRadius: '8px', padding: '9px 12px', color: 'white', fontSize: '0.85rem', outline: 'none' }}
                  >
                    <option value="A la Parrilla">A la Parrilla</option>
                    <option value="Smash Burgers">Smash Burgers</option>
                    <option value="Gigantes XXL">Gigantes XXL</option>
                    <option value="Pollo Crispy">Pollo Crispy</option>
                    <option value="Especiales del Chef">Especiales del Chef</option>
                    <option value="Gourmet">Gourmet</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', marginBottom: '4px' }}>
                    Precio ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="14.50"
                    value={newBurger.price}
                    onChange={(e) => setNewBurger({ ...newBurger, price: e.target.value })}
                    style={{ width: '100%', background: '#172033', border: '1px solid #1f2937', borderRadius: '8px', padding: '9px 12px', color: 'white', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', marginBottom: '4px' }}>
                    Stock Inicial Cocina
                  </label>
                  <input
                    type="number"
                    value={newBurger.stock}
                    onChange={(e) => setNewBurger({ ...newBurger, stock: e.target.value })}
                    style={{ width: '100%', background: '#172033', border: '1px solid #1f2937', borderRadius: '8px', padding: '9px 12px', color: 'white', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', marginBottom: '4px' }}>
                  Descripción Gastronómica
                </label>
                <textarea
                  rows="3"
                  placeholder="Detalles de la carne, cocción, salsas e ingredientes..."
                  value={newBurger.description}
                  onChange={(e) => setNewBurger({ ...newBurger, description: e.target.value })}
                  style={{ width: '100%', background: '#172033', border: '1px solid #1f2937', borderRadius: '8px', padding: '9px 12px', color: 'white', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ background: '#1f2937', color: '#cbd5e1', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer' }}
                >
                  Guardar Hamburguesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Status Notification */}
      {statusNotification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'rgba(9, 13, 22, 0.95)',
          border: '1px solid #38bdf8',
          color: '#f8fafc',
          padding: '10px 20px',
          borderRadius: '12px',
          fontSize: '0.85rem',
          fontWeight: '700',
          boxShadow: '0 10px 30px rgba(0,0,0,0.7)',
          zIndex: 100
        }}>
          {statusNotification}
        </div>
      )}

    </div>
  );
}
