# 🚀 NextCollege MasterClass Scaffold & Template Repository

Repositorio plantilla profesional diseñado específicamente para demostraciones en vivo de **Desarrollo Acelerado con Inteligencia Artificial** y **Continuous Delivery (CI/CD)** con **GitHub**, **Docker Multi-Stage** y **Dokploy**.

---

## 🎯 El Concepto de la MasterClass (De Cero a Cien con IA)

Este Scaffold es un **lienzo limpio de alta ingeniería**. Inicialmente, tanto el **Portal E-commerce**, la **PWA Mobile** como el **Panel Admin** muestran únicamente:

> ### *"Bienvenidos a NextCollege"*

Bajo el capó, toda la arquitectura de tuberías, compilación multi-stage, service worker y conexión a MySQL ya está 100% cableada y activa en Dokploy.

### 🪄 La Dinámica del Webinar:
1. **Punto de Partida:** Muestras el proyecto desplegado en vivo en Dokploy con el mensaje base *"Bienvenidos a NextCollege"*.
2. **El Primer Prompt con IA:** Frente a tus alumnos, le pides a la IA (Antigravity / Gemini) que construya la primera versión del e-commerce, el catálogo de la PWA y el dashboard de administración.
3. **El Live Push de CI/CD:** Haces `git commit` y `git push origin main`.
4. **La Transformación:** Dokploy captura el webhook, compila las 3 capas en ~25 segundos, y la audiencia ve cómo *"Bienvenidos a NextCollege"* se transforma en vivo en una plataforma completa sin tiempo de caída (*Zero Downtime*).
5. **Prompts Subsiguientes:** Continúas refinando la UI, agregando funcionalidades y demostrando la velocidad del flujo de trabajo moderno.

---

## 🏛️ Arquitectura Técnica Unificada

Las 4 capas corren en un **único contenedor Docker** exponiendo un **único puerto (3000)**:

| Capa / Servicio | Ruta | Tecnología | Estado Inicial |
| :--- | :--- | :--- | :--- |
| **Portal E-commerce** | `/` | **Astro 4 (SSG)** | Pantalla limpia *"Bienvenidos a NextCollege"* con SEO y Core Web Vitals listos. |
| **PWA Mobile** | `/app` | **React 18 + Vite** | Pantalla móvil *"Bienvenidos a NextCollege"* con PWA Manifest y Service Worker listos. |
| **Panel Admin** | `/admin` | **React 18 + Vite** | Pantalla limpia *"Bienvenidos a NextCollege"* con monitor de conexión a MySQL. |
| **Backend REST API** | `/api/...` | **Node.js + Express + MySQL** | Capa de datos con reintento automático y fallback resiliente. |

---

## ⚙️ Cómo convertir este repositorio en "Template Repository" en GitHub

1. Entra a tu repositorio en GitHub: [https://github.com/PabloValdiviaM/webinar-02-ia-pnp](https://github.com/PabloValdiviaM/webinar-02-ia-pnp) (o el repositorio asignado a tu webinar).
2. Haz clic en la pestaña **Settings** (Configuración del repositorio).
3. En la primera sección (**General**), marca la casilla:  
   ✅ **Template repository**.
4. ¡Listo! A partir de ese momento, cualquier participante o tú mismo podrán pulsar el botón verde **"Use this template"** $\rightarrow$ **"Create a new repository"**.

---

## 🐳 Despliegue Inicial en Dokploy

1. **Crear MySQL:** En Dokploy $\rightarrow$ *Create Service* $\rightarrow$ *Database* $\rightarrow$ *MySQL* (base: `demo`, usuario: `pablovaldivia`, puerto externo: `3306`).
2. **Crear Aplicación:** En el mismo proyecto $\rightarrow$ *Create Service* $\rightarrow$ *Application* $\rightarrow$ *Git* $\rightarrow$ Rama `main` $\rightarrow$ Build Type: `Dockerfile` $\rightarrow$ Puerto: `3000`.
3. **Environment Variables:**
   ```env
   NODE_ENV=production
   PORT=3000
   DB_HOST=172.18.0.1
   DB_PORT=3306
   DB_USER=pablovaldivia
   DB_PASSWORD=tu_password
   DB_NAME=demo
   ```
4. **Auto Deploy:** Activa el Webhook de GitHub (Content Type: `application/json`).
