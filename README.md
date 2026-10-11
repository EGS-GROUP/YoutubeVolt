# ⚡ YouTubeVolt - Bóveda de Videos Multiplataforma

**YouTubeVolt** es una plataforma completa de 3 capas para crear, organizar y consultar una biblioteca y bóveda audiovisual privada de YouTube, diseñada con una estética **Ultra-Premium Dark** (estilo YouTube Dark y LifeFeed AI) y lista para despliegues automatizados en **Dokploy CI/CD**.

---

## 🏛️ Arquitectura de las 3 Capas Unificadas

La plataforma corre sobre un único puerto (`PORT: 3000`) coordinado por Express, sirviendo las tres capas y una API REST unificada:

```
                                  ┌────────────────────────┐
                                  │   YouTubeVolt Engine   │
                                  │   Node.js (Puerto 3000) │
                                  └───────────┬────────────┘
                                              │
         ┌────────────────────────────────────┼────────────────────────────────────┐
         │                                    │                                    │
         ▼                                    ▼                                    ▼
┌──────────────────┐                 ┌──────────────────┐                 ┌──────────────────┐
│   PORTAL WEB     │                 │   BÓVEDA PWA     │                 │  STUDIO ADMIN    │
│   (Astro)        │                 │   (React + PWA)  │                 │  (React + Vite)  │
│   Ruta: /        │                 │   Ruta: /app     │                 │  Ruta: /admin    │
└──────────────────┘                 └──────────────────┘                 └──────────────────┘
```

1. **📱 Capa 1: Bóveda Mobile PWA (`/app`)**
   - **Tecnología**: React 18 + Vite + Service Worker (PWA Instalable).
   - **Diseño**: Basado en las maquetas móviles de YouTube Dark y LifeFeed AI.
   - **Funcionalidades**:
     - Barra de navegación inferior móvil (Inicio, Explorar, Guardar `+`, Pendientes, Bóveda).
     - Buscador inteligente y filtro de "Videos Pendientes de Ver" (Atención requerida).
     - Tarjetas con miniaturas de alta definición, duración, avatar del canal, tags y estado de estudio (⏳ Pendiente, 🎧 En Progreso, ✅ Visto).
     - **Reproductor Interactivo Embebido**: Visualización directa con iframe oficial de YouTube.
     - **Bloc de Notas Personales**: Editor de apuntes de aprendizaje persistente por video.
     - Botón flotante `+` con autocompletado y previsualización instantánea de enlaces de YouTube.
     - Soporte Offline mediante LocalStorage y Service Worker.

2. **⚙️ Capa 2: Panel de Administración Studio (`/admin`)**
   - **Tecnología**: React 18 + Vite.
   - **Diseño**: Dashboard glassmorphic con métricas en tiempo real.
   - **Funcionalidades**:
     - KPIs de la bóveda: Total de videos, pendientes, completados, favoritos y horas estimadas.
     - Indicador dinámico de base de datos (🐬 MySQL Conectado o ⚡ Modo In-Memory ultra veloz).
     - Tabla de gestión de videos con filtrado en tiempo real, cambio de estado en un clic y favoritos.
     - Modal de agregar videos con reconocimiento automático del ID de YouTube.
     - Gestor de colecciones temáticas (IA & Agentes, Cloud & Dokploy, Mobile, Clean Architecture, etc.).
     - Copias de seguridad: Exportación (JSON) e Importación (JSON) en 1 clic.
     - Botón **"Restablecer Demo"** ideal para demostraciones en vivo.

3. **🌐 Capa 3: Portal de Videos Personalizado (`/`)**
   - **Tecnología**: Astro 4 (Static site generation ultrarrápido con sincronización reactiva a la API).
   - **Diseño**: Portal estilo YouTube cinematográfico oscuro (#090d16) con acento rojo coral (#ff0033).
   - **Funcionalidades**:
     - **Hero Spotlight**: Banner cinematográfico del video destacado con botón de reproducción.
     - **Píldoras de Categorías**: Filtros rápidos por colecciones temáticas y favoritos.
     - **Grid de Videos Curados**: Miniaturas 16:9, duración, creador y notas de la bóveda.
     - **Modal Player**: Reproducción inmediata al hacer clic en cualquier tarjeta.
     - Acceso directo a la versión móvil PWA (`/app`) y al panel administrativo (`/admin`).

4. **🔌 Backend API REST (`/api`)**
   - `/api/health`: Chequeo de salud del servicio y de la base de datos.
   - `/api/videos`: Listado (con búsqueda y filtros), alta, actualización y eliminación de videos.
   - `/api/collections`: Colecciones temáticas.
   - `/api/stats`: Métricas globales de la biblioteca.
   - `/api/videos/export/json`: Descarga de copia de seguridad.
   - `/api/videos/import/json`: Restauración de biblioteca.
   - `/api/reset`: Restablecimiento de datos de prueba para masterclasses.

---

## 🚀 Inicio Rápido (Local)

### 1. Instalar dependencias
```bash
npm run install:all
```

### 2. Compilar todas las capas y sincronizar
```bash
npm run build:all
```

### 3. Iniciar el servidor
```bash
npm start
```

Abre en tu navegador:
- 🌐 **Portal de Videos**: [http://localhost:3000/](http://localhost:3000/)
- 📱 **Bóveda Mobile PWA**: [http://localhost:3000/app](http://localhost:3000/app)
- ⚙️ **Panel Studio**: [http://localhost:3000/admin](http://localhost:3000/admin)
- 🩺 **API Health**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 🐳 Despliegue en Dokploy (CI/CD)

El repositorio incluye un `Dockerfile` optimizado en 4 etapas (*Multi-Stage Build*):
1. **builder-ecommerce**: Compila Astro.
2. **builder-pwa**: Compila la PWA móvil con Vite.
3. **builder-admin**: Compila el Panel Admin con Vite.
4. **runner**: Runtime ligero Node.js Alpine que unifica los 3 artefactos en `server/public`.

### Variables de Entorno Opcionales (para conectar MySQL):
- `DB_HOST`: Host del contenedor o servicio MySQL (ej: `mysql` o IP de red Dokploy).
- `DB_PORT`: Puerto (por defecto `3306`).
- `DB_USER`: Usuario de base de datos.
- `DB_PASSWORD`: Contraseña.
- `DB_NAME`: Nombre de la base de datos (ej: `demo` o `youtubevolt`).

> 💡 **Nota para la Masterclass:** Si no configuras variables de base de datos, el servidor opera de forma automática y transparente en **Modo In-Memory** con persistencia en caché, permitiendo que la demostración funcione inmediatamente sin requerir configuración previa de bases de datos.

---

## 🎓 Guía Didáctica para la MasterClass (Principiantes)

Para tu auditorio de principiantes, puedes estructurar la explicación en 3 momentos clave:

1. **El Problema que Resolvemos**: Los desarrolladores y estudiantes acumulan decenas de videos en YouTube, pero los pierden en listas interminables. **YouTubeVolt** crea un espacio privado enfocado en aprendizaje, notas y categorización personal.
2. **Comparativa de Arquitectura (Web vs Mobile)**:
   - *Enfoque Kotlin Multiplatform (KMP)*: Compila a binario nativo con Jetpack Compose y SQLDelight (ideal para apps que requieren acceso a hardware y distribución en App Store/Play Store).
   - *Enfoque 3 Capas Web/PWA*: Con HTML, CSS, React, Astro y Node.js, obtienes **3 productos funcionales desplegables al instante** en cualquier navegador, móvil o escritorio con una sola base de código y CI/CD en Dokploy.
3. **Flujo de la Bóveda en Vivo**:
   - Abrir el **Panel Studio (`/admin`)** y copiar un enlace de YouTube.
   - Ver cómo se autodetecta el ID y la miniatura al instante.
   - Guardar el video y escribir una nota de estudio.
   - Abrir la **PWA Mobile (`/app`)** para mostrar la experiencia táctil con el reproductor embebido.
   - Abrir el **Portal Público (`/`)** para ver cómo la biblioteca curada se publica para los usuarios.
