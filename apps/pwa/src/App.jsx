import React, { useState, useEffect } from 'react';

// Official Burger Catalog for PWA
const BURGER_CATALOG = [
  {
    id: 1,
    name: 'Rey de las hamburguesas a la parrilla',
    category: 'A la Parrilla',
    badge: 'Doble Carne XXL * 380g',
    price: 14.99,
    rating: 4.98,
    cookTime: '12 min',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    description: 'Carne 100% Angus flameada a la leña viva, doble cheddar inglés fundido, panceta crocante y cebolla al bourbon.'
  },
  {
    id: 2,
    name: 'Hamburgueza Real',
    category: 'A la Parrilla',
    badge: 'Clásica Imperial * 240g',
    price: 11.50,
    rating: 4.92,
    cookTime: '10 min',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    description: 'Doble medallón smash con costra caramelizada, queso americano fundido, pepinillos y aderezo imperial secreto.'
  },
  {
    id: 3,
    name: 'Hamburgueza Royal Crispy',
    category: 'Pollo Crispy',
    badge: 'Crispy Gold Pechuga * 260g',
    price: 12.99,
    rating: 4.95,
    cookTime: '14 min',
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&auto=format&fit=crop&q=80',
    description: 'Pechuga marinada 24h en buttermilk y 11 especias, coleslaw fresco de manzana verde y honey mustard.'
  },
  {
    id: 4,
    name: 'Hamburgueza Double Whopper',
    category: 'Gigantes XXL',
    badge: 'Fuego Parrillero * 420g',
    price: 15.50,
    rating: 4.96,
    cookTime: '15 min',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    description: 'Doble medallón gigante a la brasa de quebracho, lechuga romana, tomate maduro, cebolla morada y mayo ahumada.'
  },
  {
    id: 5,
    name: 'Smash Burger Trufada Supreme',
    category: 'Smash Burgers',
    badge: 'Doble Smash Angus * 220g',
    price: 13.75,
    rating: 4.94,
    cookTime: '9 min',
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&auto=format&fit=crop&q=80',
    description: 'Golpe térmico smash con costra crocante, queso suizo, reducción de hongos y mayonesa de trufa negra.'
  },
  {
    id: 6,
    name: 'Bacon Monster Cheddar Melt',
    category: 'Gigantes XXL',
    badge: 'Triple Bacon Ahumado * 350g',
    price: 14.50,
    rating: 4.97,
    cookTime: '12 min',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&auto=format&fit=crop&q=80',
    description: 'Cascada de queso cheddar líquido fundido al instante y 6 tiras crujientes de bacon ahumado al manzano.'
  },
  {
    id: 7,
    name: 'Volcán Criollo Chimichurri',
    category: 'A la Parrilla',
    badge: 'Corte de Asado * 300g',
    price: 13.90,
    rating: 4.89,
    cookTime: '13 min',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&auto=format&fit=crop&q=80',
    description: 'Medallón grueso sazonado al punto con provolone fundido al fuego, pimientos morrones y chimichurri criollo.'
  },
  {
    id: 8,
    name: 'Chili Pepper Jack Picante',
    category: 'Especiales',
    badge: 'Spicy Jalapeño Crunch * 280g',
    price: 12.50,
    rating: 4.91,
    cookTime: '11 min',
    image: 'https://images.unsplash.com/photo-1582196016295-f8c8bd4b3e99?w=600&auto=format&fit=crop&q=80',
    description: 'Pepper jack picante, jalapeños encurtidos a mano, guacamole fresco con lima y aderezo chipotle.'
  },
  {
    id: 9,
    name: 'Black Angus BBQ Ribs Glazed',
    category: 'Especiales',
    badge: 'Costilla Desmechada * 340g',
    price: 16.20,
    rating: 4.99,
    cookTime: '15 min',
    image: 'https://images.unsplash.com/photo-1549611016-3a70d82b5040?w=600&auto=format&fit=crop&q=80',
    description: 'Medallón Angus con costilla tierna desmechada tras 8 horas de ahumado y salsa barbacoa dulce de bourbon.'
  },
  {
    id: 10,
    name: 'Mushroom Swiss Gourmet',
    category: 'Gourmet',
    badge: 'Hongos Salteados & Emmental * 250g',
    price: 13.20,
    rating: 4.93,
    cookTime: '11 min',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80',
    description: 'Champiñones portobello salteados en mantequilla con romero y queso suizo Emmental fundido.'
  }
];

const SPECIAL_OFFERS = [
  {
    id: 'off-1',
    code: 'RAPIDBURGER20',
    title: 'Super Descuento 20% OFF',
    subtitle: 'En compras superiores a $25 en cualquiera de las 10 variantes',
    badge: 'POPULAR 🔥',
    discountPercent: 20,
    expiry: 'Vence en 04:32:15'
  },
  {
    id: 'off-2',
    code: 'COMBO-DUO-REAL',
    title: 'Combo Dúo Real $19.99',
    subtitle: '2 Hamburguesas Reales + 2 Papas Rústicas + 2 Bebidas',
    badge: 'COMBO 🍔🍔',
    discountAmount: 6.00,
    expiry: 'Solo por hoy'
  },
  {
    id: 'off-3',
    code: 'ENVIO-GRATIS',
    title: 'Delivery Rapid Bonificado',
    subtitle: 'Envío sin costo a tu domicilio con entrega promedio en 25 min',
    badge: 'DELIVERY 🛵',
    freeDelivery: true,
    expiry: 'Cupón disponible'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'ofertas' | 'ordenes' | 'perfil'
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Active simulated orders with progression state
  const [orders, setOrders] = useState([
    {
      id: 'NKB-1042',
      date: 'Hoy, 20:12',
      items: [
        { name: 'Rey de las hamburguesas a la parrilla', qty: 2, price: 14.99 },
        { name: 'Papas Rústicas Trufadas', qty: 1, price: 4.50 }
      ],
      total: 34.48,
      status: 'En Camino 🛵',
      stepIndex: 3, // 0: Recibido, 1: Parrilla, 2: Empacado, 3: En Camino, 4: Entregado
      address: 'Calle Las Brasas 450, Miraflores',
      eta: 'Llegando en 9 min'
    }
  ]);

  // Online / Offline listener & PWA install prompt
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert('Para instalar la PWA: En tu navegador presiona el menú de 3 puntos y selecciona "Instalar aplicación" o "Añadir a pantalla de inicio".');
      return;
    }
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  // Cart operations
  const addToCart = (burger) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === burger.id);
      if (existing) {
        return prev.map((item) =>
          item.id === burger.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...burger, qty: 1 }];
    });
    showToast(`🍔 ¡${burger.name} agregada al carrito!`);
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Apply Coupon Calculation
  let discountValue = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discountValue = (subtotalPrice * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountAmount) {
      discountValue = appliedCoupon.discountAmount;
    }
  }
  const deliveryFee = appliedCoupon && appliedCoupon.freeDelivery ? 0 : (subtotalPrice > 0 ? 2.50 : 0);
  const finalTotal = Math.max(0, subtotalPrice - discountValue + deliveryFee);

  const applyCoupon = (codeToApply) => {
    const code = (codeToApply || couponCode).toUpperCase().trim();
    const found = SPECIAL_OFFERS.find((o) => o.code === code);
    if (found) {
      setAppliedCoupon(found);
      setCouponCode(found.code);
      showToast(`🎉 ¡Cupón ${found.code} aplicado con éxito!`);
    } else {
      showToast('❌ Cupón no válido o expirado');
    }
  };

  // Simulate Purchase Checkout
  const handleSimulateCheckout = () => {
    if (cart.length === 0) return;

    const newOrderNumber = Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: `NKB-${newOrderNumber}`,
      date: 'Hace un instante',
      items: cart.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
      total: finalTotal,
      status: 'En la Parrilla 🔥',
      stepIndex: 1,
      address: 'Calle Las Brasas 450, Miraflores',
      eta: 'Llegando en 22 min'
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsCartOpen(false);
    setActiveTab('ordenes');
    showToast(`✅ ¡Orden #${newOrder.id} confirmada! Cocinando a fuego vivo.`);
  };

  // Filter burgers for menu
  const categories = ['Todas', 'A la Parrilla', 'Smash Burgers', 'Gigantes XXL', 'Pollo Crispy', 'Especiales', 'Gourmet'];
  const filteredBurgers = BURGER_CATALOG.filter((b) => {
    const matchesCat = selectedCategory === 'Todas' || b.category === selectedCategory;
    const matchesQuery = searchQuery === '' ||
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      
      {/* Top Header */}
      <header style={{
        background: 'rgba(19, 27, 46, 0.95)',
        borderBottom: '1px solid #1e293b',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem' }}>🍔</span>
          <div>
            <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#f8fafc', lineHeight: 1.1 }}>
              NextCollege Burger Rapid
            </div>
            <div style={{ fontSize: '0.68rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase' }}>
              App Móvil PWA &bull; Brasas Vivas
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {deferredPrompt && (
            <button
              onClick={handleInstallClick}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.72rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              📲 Instalar
            </button>
          )}

          <span style={{
            fontSize: '0.68rem',
            padding: '3px 8px',
            borderRadius: '999px',
            fontWeight: '700',
            background: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            color: isOnline ? '#10b981' : '#ef4444',
            border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}>
            {isOnline ? '● Online' : '○ Offline'}
          </span>
        </div>
      </header>

      {/* Main Tab View Area */}
      <main style={{ flex: 1, overflowY: 'auto', paddingBottom: totalCartCount > 0 ? '135px' : '75px' }} className="fade-in">
        
        {/* ==================================================== */}
        {/* TAB 1: MENÚ                                         */}
        {/* ==================================================== */}
        {activeTab === 'menu' && (
          <div style={{ padding: '16px' }}>
            {/* Search Input */}
            <div style={{ marginBottom: '14px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }}>🔍</span>
              <input
                type="text"
                placeholder="Buscar tu hamburguesa o gramaje..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: '#131b2e',
                  border: '1px solid #1e293b',
                  borderRadius: '12px',
                  padding: '9px 12px 9px 36px',
                  color: '#f8fafc',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Categories horizontal list */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', scrollbarWidth: 'none' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    background: selectedCategory === cat ? '#2563eb' : '#131b2e',
                    color: selectedCategory === cat ? '#ffffff' : '#94a3b8',
                    border: `1px solid ${selectedCategory === cat ? '#2563eb' : '#1e293b'}`,
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Catalog List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
              {filteredBurgers.map((burger) => {
                const inCartItem = cart.find((c) => c.id === burger.id);
                return (
                  <div
                    key={burger.id}
                    style={{
                      background: '#131b2e',
                      border: '1px solid #1e293b',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ position: 'relative', height: '140px', width: '100%', background: '#0a0f1d' }}>
                      <img
                        src={burger.image}
                        alt={burger.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                      />
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(9, 13, 22, 0.85)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#38bdf8',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.68rem',
                        fontWeight: '700'
                      }}>
                        {burger.category}
                      </span>
                      <span style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(9, 13, 22, 0.85)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#f59e0b',
                        padding: '2px 7px',
                        borderRadius: '999px',
                        fontSize: '0.72rem',
                        fontWeight: '800'
                      }}>
                        ★ {burger.rating}
                      </span>
                    </div>

                    <div style={{ padding: '12px 14px' }}>
                      {/* Specialty Level Badge */}
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(245, 158, 11, 0.12)',
                        border: '1px solid rgba(245, 158, 11, 0.35)',
                        color: '#fbbf24',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        marginBottom: '6px'
                      }}>
                        <span>⚖️</span> {burger.badge}
                      </div>

                      <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#f8fafc', marginBottom: '4px', lineHeight: 1.2 }}>
                        {burger.name}
                      </h3>
                      <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.4, marginBottom: '10px' }}>
                        {burger.description}
                      </p>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                            Precio Online
                          </div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#38bdf8' }}>
                            ${burger.price.toFixed(2)}
                          </div>
                        </div>

                        {inCartItem ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e293b', borderRadius: '10px', padding: '4px 8px' }}>
                            <button
                              onClick={() => updateQty(burger.id, -1)}
                              style={{ background: '#334155', color: 'white', border: 'none', width: '26px', height: '26px', borderRadius: '6px', cursor: 'pointer', fontWeight: '900' }}
                            >
                              -
                            </button>
                            <span style={{ fontWeight: '800', fontSize: '0.9rem', minWidth: '18px', textAlign: 'center' }}>
                              {inCartItem.qty}
                            </span>
                            <button
                              onClick={() => updateQty(burger.id, 1)}
                              style={{ background: '#2563eb', color: 'white', border: 'none', width: '26px', height: '26px', borderRadius: '6px', cursor: 'pointer', fontWeight: '900' }}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(burger)}
                            style={{
                              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '10px',
                              fontWeight: '700',
                              fontSize: '0.82rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)'
                            }}
                          >
                            <span>+</span> Agregar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: OFERTAS                                      */}
        {/* ==================================================== */}
        {activeTab === 'ofertas' && (
          <div style={{ padding: '16px' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.25) 0%, rgba(37, 99, 235, 0.2) 100%)',
              border: '1px solid rgba(234, 88, 12, 0.4)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '2rem' }}>⚡</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#f8fafc', margin: '6px 0 2px' }}>
                Cupones & Promos Flash
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                Descuentos exclusivos para usuarios de nuestra app móvil PWA
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {SPECIAL_OFFERS.map((offer) => {
                const isSelected = appliedCoupon?.code === offer.code;
                return (
                  <div
                    key={offer.id}
                    style={{
                      background: '#131b2e',
                      border: `1px solid ${isSelected ? '#38bdf8' : '#1e293b'}`,
                      borderRadius: '14px',
                      padding: '16px',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{
                        background: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#38bdf8',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: '800'
                      }}>
                        {offer.badge}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        ⏱️ {offer.expiry}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f8fafc', marginBottom: '4px' }}>
                      {offer.title}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4, marginBottom: '14px' }}>
                      {offer.subtitle}
                    </p>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#090d16',
                      border: '1px dashed #334155',
                      padding: '8px 12px',
                      borderRadius: '10px'
                    }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#fbbf24', fontSize: '0.9rem' }}>
                        {offer.code}
                      </span>
                      <button
                        onClick={() => applyCoupon(offer.code)}
                        style={{
                          background: isSelected ? '#10b981' : '#2563eb',
                          color: 'white',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        {isSelected ? '✓ Aplicado' : 'Canjear'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: ÓRDENES                                      */}
        {/* ==================================================== */}
        {activeTab === 'ordenes' && (
          <div style={{ padding: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#f8fafc', marginBottom: '12px' }}>
              Seguimiento de Órdenes
            </h2>

            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px', background: '#131b2e', borderRadius: '16px' }}>
                <span style={{ fontSize: '3rem' }}>🛵</span>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '8px' }}>
                  No tienes pedidos activos. ¡Prueba el menú y simula una compra!
                </p>
                <button
                  onClick={() => setActiveTab('menu')}
                  style={{
                    marginTop: '14px',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Ir al Menú
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      background: '#131b2e',
                      border: '1px solid #1e293b',
                      borderRadius: '16px',
                      padding: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '800' }}>
                          ORDEN #{ord.id}
                        </span>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{ord.date}</div>
                      </div>
                      <span style={{
                        background: 'rgba(234, 88, 12, 0.15)',
                        border: '1px solid rgba(234, 88, 12, 0.35)',
                        color: '#fb923c',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: '800'
                      }}>
                        {ord.status}
                      </span>
                    </div>

                    {/* Tracking Timeline Bar */}
                    <div style={{ background: '#090d16', padding: '12px', borderRadius: '12px', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginBottom: '6px', fontWeight: '700' }}>
                        <span style={{ color: ord.stepIndex >= 0 ? '#38bdf8' : '#475569' }}>1. Recibido</span>
                        <span style={{ color: ord.stepIndex >= 1 ? '#38bdf8' : '#475569' }}>2. Parrilla 🔥</span>
                        <span style={{ color: ord.stepIndex >= 2 ? '#38bdf8' : '#475569' }}>3. Empacado</span>
                        <span style={{ color: ord.stepIndex >= 3 ? '#38bdf8' : '#475569' }}>4. En Camino 🛵</span>
                      </div>
                      <div style={{ height: '6px', background: '#1e293b', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: ord.stepIndex === 1 ? '50%' : ord.stepIndex === 3 ? '85%' : '25%',
                          background: 'linear-gradient(90deg, #2563eb, #38bdf8)',
                          borderRadius: '999px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: '700', marginTop: '6px' }}>
                        ⏱️ {ord.eta} &bull; Destino: {ord.address}
                      </div>
                    </div>

                    {/* Order Items list */}
                    <div style={{ borderTop: '1px solid #1e293b', paddingTop: '10px', marginBottom: '10px' }}>
                      {ord.items.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>
                          <span>{it.qty}x {it.name}</span>
                          <span>${(it.qty * it.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1e293b', paddingTop: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>Total Pagado</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: '900', color: '#38bdf8' }}>
                        ${ord.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: PERFIL                                       */}
        {/* ==================================================== */}
        {activeTab === 'perfil' && (
          <div style={{ padding: '16px' }}>
            {/* User Card */}
            <div style={{
              background: '#131b2e',
              border: '1px solid #1e293b',
              borderRadius: '16px',
              padding: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #38bdf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: '900',
                color: 'white'
              }}>
                PV
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc' }}>
                  Pablo Valdivia
                </h3>
                <span style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fbbf24',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: '800'
                }}>
                  ⭐ Socio Gourmet Platinum
                </span>
              </div>
            </div>

            {/* Loyalty points card */}
            <div style={{
              background: 'linear-gradient(135deg, #172033 0%, #0d1527 100%)',
              border: '1px solid #1f2937',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
                  NextCollege BurgerPoints
                </span>
                <span style={{ fontSize: '1.3rem' }}>🍔</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#fbbf24', lineHeight: 1 }}>
                1,850 pts
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                Te faltan 150 pts para canjear 1 <em>Hamburgueza Real</em> gratis.
              </p>
            </div>

            {/* Simulated preferences */}
            <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: '600' }}>📍 Dirección Favorita</span>
                <span style={{ fontSize: '0.78rem', color: '#38bdf8' }}>Calle Las Brasas 450</span>
              </div>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: '600' }}>💳 Método de Pago</span>
                <span style={{ fontSize: '0.78rem', color: '#38bdf8' }}>RapidPay (•••• 8821)</span>
              </div>
              <div style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: '600' }}>🔔 Notificaciones en Vivo</span>
                <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: '700' }}>Activadas</span>
              </div>
            </div>

            {/* Quick links to Ecommerce and Admin */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="/"
                style={{
                  flex: 1,
                  background: '#1e293b',
                  color: '#38bdf8',
                  textDecoration: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  border: '1px solid #334155'
                }}
              >
                🌐 Ir al E-commerce
              </a>
              <a
                href="/admin"
                style={{
                  flex: 1,
                  background: '#1e293b',
                  color: '#38bdf8',
                  textDecoration: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  border: '1px solid #334155'
                }}
              >
                ⚙️ Panel Admin
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Floating Cart Button Pill (Visible when cart has items) */}
      {totalCartCount > 0 && !isCartOpen && (
        <div style={{
          position: 'fixed',
          bottom: '72px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 32px)',
          maxWidth: '448px',
          zIndex: 35
        }}>
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(234, 88, 12, 0.45)',
              fontWeight: '800',
              fontSize: '0.9rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 8px', borderRadius: '6px', fontSize: '0.8rem' }}>
                {totalCartCount}
              </span>
              <span>Ver Carrito de Hamburguesas</span>
            </div>
            <span>${subtotalPrice.toFixed(2)} &rarr;</span>
          </button>
        </div>
      )}

      {/* Cart Drawer / Modal for Checkout Simulation */}
      {isCartOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3, 7, 18, 0.8)',
          backdropFilter: 'blur(6px)',
          zIndex: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}>
          <div style={{
            background: '#111827',
            borderTop: '1px solid #1f2937',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            width: '100%',
            maxWidth: '480px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            boxShadow: '0 -15px 40px rgba(0,0,0,0.7)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#f8fafc' }}>
                🍔 Tu Orden ({totalCartCount} {totalCartCount === 1 ? 'item' : 'items'})
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            {/* Cart Items */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#172033',
                    border: '1px solid #1f2937',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '10px' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#f8fafc' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: '700' }}>
                      {item.badge}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '800' }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      style={{ background: '#334155', color: 'white', border: 'none', width: '26px', height: '26px', borderRadius: '6px', cursor: 'pointer', fontWeight: '800' }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: '800', fontSize: '0.85rem', minWidth: '18px', textAlign: 'center' }}>
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      style={{ background: '#2563eb', color: 'white', border: 'none', width: '26px', height: '26px', borderRadius: '6px', cursor: 'pointer', fontWeight: '800' }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Box */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                placeholder="Código de cupón (Ej: RAPIDBURGER20)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                style={{
                  flex: 1,
                  background: '#090d16',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  color: '#f8fafc',
                  fontSize: '0.8rem',
                  outline: 'none',
                  textTransform: 'uppercase'
                }}
              />
              <button
                onClick={() => applyCoupon(couponCode)}
                style={{
                  background: '#1e293b',
                  color: '#38bdf8',
                  border: '1px solid #334155',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Aplicar
              </button>
            </div>

            {/* Price breakdown */}
            <div style={{ background: '#090d16', borderRadius: '12px', padding: '12px', marginBottom: '14px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '4px' }}>
                <span>Subtotal</span>
                <span>${subtotalPrice.toFixed(2)}</span>
              </div>
              {discountValue > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', marginBottom: '4px' }}>
                  <span>Descuento ({appliedCoupon?.code})</span>
                  <span>-${discountValue.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '6px' }}>
                <span>Delivery Express (25 min)</span>
                <span>{deliveryFee === 0 ? 'GRATIS' : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#f8fafc', fontWeight: '900', fontSize: '1.05rem', borderTop: '1px solid #1e293b', paddingTop: '6px' }}>
                <span>Total a Pagar</span>
                <span style={{ color: '#38bdf8' }}>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleSimulateCheckout}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                padding: '14px',
                fontWeight: '900',
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)'
              }}
            >
              🚀 Confirmar y Simular Compra (${finalTotal.toFixed(2)})
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '64px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(9, 13, 22, 0.95)',
          border: '1px solid #38bdf8',
          color: '#f8fafc',
          padding: '8px 16px',
          borderRadius: '999px',
          fontSize: '0.8rem',
          fontWeight: '700',
          boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
          zIndex: 100,
          whiteSpace: 'nowrap'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Fixed Native-Style Bottom Navigation Tabs (Requirement 2) */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        height: '64px',
        background: 'rgba(19, 27, 46, 0.98)',
        borderTop: '1px solid #1e293b',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        zIndex: 40,
        backdropFilter: 'blur(10px)'
      }}>
        {/* Tab 1: Menú */}
        <button
          onClick={() => setActiveTab('menu')}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeTab === 'menu' ? '#38bdf8' : '#64748b',
            cursor: 'pointer',
            gap: '2px',
            transition: 'color 0.2s'
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>🍔</span>
          <span style={{ fontSize: '0.72rem', fontWeight: activeTab === 'menu' ? '800' : '600' }}>
            Menú
          </span>
        </button>

        {/* Tab 2: Ofertas */}
        <button
          onClick={() => setActiveTab('ofertas')}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeTab === 'ofertas' ? '#38bdf8' : '#64748b',
            cursor: 'pointer',
            gap: '2px',
            position: 'relative',
            transition: 'color 0.2s'
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>🏷️</span>
          <span style={{ fontSize: '0.72rem', fontWeight: activeTab === 'ofertas' ? '800' : '600' }}>
            Ofertas
          </span>
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '25px',
            width: '6px',
            height: '6px',
            background: '#ea580c',
            borderRadius: '50%'
          }} />
        </button>

        {/* Tab 3: Órdenes */}
        <button
          onClick={() => setActiveTab('ordenes')}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeTab === 'ordenes' ? '#38bdf8' : '#64748b',
            cursor: 'pointer',
            gap: '2px',
            position: 'relative',
            transition: 'color 0.2s'
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>🛵</span>
          <span style={{ fontSize: '0.72rem', fontWeight: activeTab === 'ordenes' ? '800' : '600' }}>
            Órdenes
          </span>
          {orders.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '6px',
              right: '24px',
              background: '#2563eb',
              color: 'white',
              fontSize: '0.6rem',
              fontWeight: '900',
              padding: '1px 5px',
              borderRadius: '999px'
            }}>
              {orders.length}
            </span>
          )}
        </button>

        {/* Tab 4: Perfil */}
        <button
          onClick={() => setActiveTab('perfil')}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: activeTab === 'perfil' ? '#38bdf8' : '#64748b',
            cursor: 'pointer',
            gap: '2px',
            transition: 'color 0.2s'
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>👤</span>
          <span style={{ fontSize: '0.72rem', fontWeight: activeTab === 'perfil' ? '800' : '600' }}>
            Perfil
          </span>
        </button>
      </nav>

    </div>
  );
}
