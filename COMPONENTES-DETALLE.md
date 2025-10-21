# Detalle Técnico de Componentes - Lumi Loops

## 📋 Índice de Componentes por Sección

Este documento complementa el `PLAN-IMPLEMENTACION-UI.md` con detalles técnicos específicos de cada componente.

---

## 🎯 1. NAVBAR (Navegación)

### Archivo: `src/components/layout/navbar.tsx`

**Características:**

- Navegación fija con backdrop blur
- Scroll progress bar en la parte inferior
- Menú responsive con hamburger en mobile
- Smooth scroll a secciones con offset para navbar fijo
- Cambio de estilo al hacer scroll (transparente → sólido)

**Dependencias:**

- `framer-motion` - Animaciones
- `lucide-react` - Iconos (Menu, X)
- `next/image` - Logo optimizado
- `next/link` - Navegación
- Hook personalizado: `useScrollNavbar`

**Items de navegación:**

```typescript
[
  { href: "#inicio", label: "Home" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#beneficios", label: "Benefits" },
];
```

**Assets necesarios:**

- `/public/logo/lumiloops-logo-name.png`

---

## 🎬 2. HERO SECTION

### Archivo: `src/components/landing/hero-section.tsx`

**Características:**

- Layout de 2 columnas (contenido + visual)
- Gradientes animados de fondo
- Badge de confianza con icono
- Título con gradient text
- 2 CTAs principales (Get Started, See Examples)
- Imagen/video placeholder con overlay
- Badges flotantes animados
- Scroll indicator en la parte inferior

**Animaciones:**

- `fadeInUp` - Entrada desde abajo
- `fadeInLeft` - Entrada desde izquierda
- `fadeInRight` - Entrada desde derecha
- `stagger` - Animación escalonada de elementos
- Gradientes rotando continuamente
- Badges con movimiento vertical (y-axis)

**Funcionalidades:**

- `scrollToContact()` - Scroll a sección de contacto
- `scrollToExamples()` - Scroll a testimonios

**Assets necesarios:**

- Imagen de Unsplash para el hero visual

---

## 🔄 3. ZOOM PARALLAX

### Archivo: `src/components/zoom-parallax.tsx`

**Características:**

- Efecto parallax con 7 imágenes
- Zoom progresivo basado en scroll
- Logo central que aparece al final
- Textos overlay en cada imagen
- Diferentes escalas de zoom por imagen
- Glassmorphism backdrop al final

**Configuración de escalas:**

```typescript
scale4 = [1, 4]; // Imagen 1
scale5 = [1, 5]; // Imágenes 2, 4
scale6 = [1, 6]; // Imágenes 3, 5
scale8 = [1, 8]; // Imagen 6
scale9 = [1, 9]; // Imagen 7
```

**Posicionamiento:**

- Imagen 1 (centro): 25vh x 25vw
- Imagen 2 (top-left): 30vh x 35vw
- Imagen 3 (top-left): 45vh x 20vw
- Imagen 4 (center): 25vh x 25vw
- Imagen 5 (center-left): 25vh x 22vw
- Imagen 6 (left): 25vh x 22vw
- Imagen 7 (center-right): 25vh x 22vw

**Assets necesarios:**

- `/public/images/imagen01.jpg`
- `/public/images/imagen-02.jpg`
- URLs de Unsplash (4 imágenes)
- `/public/logo/` para logo central

---

## 📝 4. HOW IT WORKS

### Archivo: `src/components/landing/how-it-works.tsx`

**Características:**

- 3 pasos del proceso en cards
- Animaciones de entrada escalonadas
- Flechas direccionales entre pasos (horizontal en desktop, vertical en mobile)
- Números grandes de fondo en cada card
- Patrón de fondo decorativo
- Barra decorativa inferior con gradiente
- Bento Grid integrado al final
- CTA al final de la sección

**Pasos:**

1. **Describe Your Idea** 📝
2. **We Create Magic** ✨
3. **Get It in 48h** 🚀

**Componente integrado:**

- `BentoGrid1` - Grid de características

**Animaciones:**

- Cards con efecto spring
- Hover con elevación (y: -8px)
- Flechas con pulse animation
- Stagger children con delay

---

## 🌟 5. WHY CHOOSE US

### Archivo: `src/components/landing/why-choose-us.tsx`

**Características:**

- Layout de 2 columnas (contenido + video)
- Lista de 6 beneficios numerados
- Testimonial destacado con gradiente
- Triple checkmarks
- Video vertical (9:16) con autoplay
- 2 badges flotantes animados
- Banner parallax con zoom al final de la sección
- Glassmorphism backdrop para el banner
- Iconos animados (Ban, Clapperboard)

**Beneficios:**

1. Truly Custom
2. AI + Human Creativity
3. Zero Tech Hassle
4. Platform-Ready
5. Fast Turnaround
6. Strategic Approach

**Banner Parallax:**

- Aparece desde abajo con zoom
- Texto: "No more robotic AI videos" + "Only human-crafted magic"
- Efecto de resplandor pulsante
- Sombras pronunciadas en texto

**Assets necesarios:**

- `/public/why-choose/video-01.mp4`

---

## 🎥 6. PORTFOLIO VIDEO SHOWCASE

### Archivo: `src/components/landing/portfolio-video-showcase.tsx`

**Características:**

- Carrusel personalizado de videos
- Navegación prev/next con hover effects
- Control de mute/unmute global
- Indicadores de plataformas sociales por video
- Autoplay del video activo
- Cálculo dinámico de gap responsive
- Transiciones suaves entre videos
- Información de cada video (título, subtítulo, descripción)

**Funcionalidades:**

- `calculateGap()` - Cálculo responsive del espaciado
- Control de reproducción automática
- Gestión de refs para múltiples videos
- Hover states en botones de navegación

**Datos del portfolio:**

```typescript
interface PortfolioItem {
  videoSrc: string;
  title: string;
  subtitle: string;
  description: string;
  platforms: SocialPlatform[];
}
```

**Iconos de plataformas:**

- Instagram, Facebook, TikTok, YouTube

**Assets necesarios:**

- Videos en `/public/portfolio/` o URLs externas

---

## 🌐 7. SOCIAL PLATFORMS CAROUSEL

### Archivo: `src/components/landing/social-platforms-carousel.tsx`

**Características:**

- Infinite slider horizontal
- 8 plataformas sociales con iconos SVG
- Progressive blur en los bordes
- Velocidad ajustable (normal y hover)
- Iconos con colores de marca

**Plataformas incluidas:**

1. YouTube (#FF0000)
2. Instagram (#E4405F)
3. TikTok (#000000)
4. LinkedIn (#0077B5)
5. Facebook (#1877F2)
6. Twitter (#1DA1F2)
7. Snapchat (#FFFC00)
8. Pinterest (#BD081C)

**Componentes UI necesarios:**

- `InfiniteSlider` - Slider infinito
- `ProgressiveBlur` - Blur gradual en bordes

---

## ✨ 8. BENEFITS SECTION

### Archivo: `src/components/landing/benefits-section.tsx`

**Características:**

- Grid de 6 beneficios (2 columnas en desktop)
- Cada card con icono, título y descripción
- Colores y gradientes únicos por beneficio
- Animaciones de entrada con efecto whip
- Hover effects en cards

**Beneficios con iconos:**

1. **Zero Learning Curve** - Zap ⚡ (yellow/orange)
2. **Human-Curated** - Heart ❤️ (pink/rose)
3. **Brand-Aligned** - Palette 🎨 (purple/indigo)
4. **Platform-Perfect** - Smartphone 📱 (blue/cyan)
5. **Save Time + Money** - DollarSign 💲 (green/emerald)
6. **Fast & Reliable** - Clock ⏰ (slate/gray)

**Estructura de card:**

```typescript
{
  icon: LucideIcon,
  title: string,
  description: string,
  color: string,        // Gradiente
  bgColor: string,      // Fondo del icono
  iconColor: string     // Color del icono
}
```

---

## 💰 9. PRICING SECTION

### Archivo: `src/components/landing/pricing-section.tsx`

**Características:**

- 3 planes de precios en grid
- Plan destacado (Growth) con badge "Most Popular"
- Lista de features por plan
- CTAs que scroll a contacto
- Animaciones de entrada y hover
- Efectos de elevación en hover

**Planes:**

### Starter - $97 (one-time)

- 1 video (up to 30 sec)
- 1 round of revisions
- Platform optimized
- Delivery in 72h

### Growth - $247 (one-time) ⭐ POPULAR

- 3 videos
- Multi-platform formats
- 2 rounds of revisions
- Delivery in 48h

### Pro Monthly - $597/mo

- 8 videos/month
- Strategy consultation
- Priority support
- 24h rush option

**Funcionalidad:**

- `handleCTAClick()` - Scroll a sección de contacto

---

## 💬 10. TESTIMONIALS SECTION

### Archivo: `src/components/landing/testimonials-section.tsx`

**Características:**

- 3 columnas de testimonios
- 12 testimonios totales (4 por columna)
- Scroll vertical automático por columna
- Avatares generados con Dicebear API
- Rating de 5 estrellas
- Animaciones de entrada

**Componente auxiliar:**

- `TestimonialsColumn` - Columna individual con scroll

**Estructura de testimonial:**

```typescript
{
  text: string,
  image: string,      // URL de Dicebear
  name: string,
  role: string
}
```

**Distribución:**

- Columna 1: 4 testimonios
- Columna 2: 4 testimonios
- Columna 3: 4 testimonios

---

## 📧 11. CONTACT SECTION

### Archivo: `src/components/landing/contact-section.tsx`

**Características:**

- Formulario de contacto centrado
- Badge "Let's Get Started" con icono
- Título con gradient
- Card con border y shadow
- Fondo con gradientes decorativos

**Componente integrado:**

- `LeadForm` - Formulario completo

---

## 📝 12. LEAD FORM

### Archivo: `src/components/forms/lead-form.tsx`

**Características:**

- Validación con React Hook Form + Zod
- Cloudflare Turnstile (captcha)
- Estados: idle, loading, success, error
- Campos del formulario:
  - Nombre (requerido)
  - Email (requerido, validación)
  - Empresa (opcional)
  - Tipo de servicio (select)
  - Mensaje (textarea, requerido)
- Botón con loading state
- Mensajes de éxito/error

**Validaciones:**

- Email válido
- Campos requeridos
- Longitud mínima/máxima
- Turnstile token válido

**Integración:**

- Endpoint API para envío
- Variables de entorno para Turnstile

---

## 🦶 13. FOOTER

### Archivo: `src/components/layout/footer.tsx`

**Características:**

- Grid de 4 columnas en desktop
- Información de la empresa con logo
- Enlaces de navegación
- Enlaces de recursos
- Enlaces legales
- Redes sociales con iconos
- Información de contacto
- Copyright y año actual
- Theme toggle integrado

**Secciones:**

### Company Info

- Logo
- Descripción breve
- Redes sociales (Instagram, LinkedIn, Twitter, YouTube)

### Company Links

- Home
- How It Works
- Why Choose Us
- Pricing

### Resources Links

- Benefits
- Testimonials
- Contact

### Legal Links

- Privacy Policy
- Terms of Service
- Cookies

**Funcionalidad:**

- `scrollToSection()` - Scroll suave a secciones

---

## 🎨 14. BENTO GRID

### Archivo: `src/components/mvpblocks/bento-grid-1.tsx`

**Características:**

- Grid de características en formato bento
- Cards con iconos grandes de fondo
- Patrón decorativo de fondo
- Hover effects
- Diferentes tamaños de cards

**Items del grid:**

1. **AI-Powered** - Bot 🤖
2. **Fast Delivery** - Zap ⚡
3. **Quality Guaranteed** - CheckCircle ✓
4. **Affordable** - Gift 🎁
5. **Secure** - Shield 🛡️
6. **Growth Focused** - TrendingUp 📈

---

## 🎭 15. COMPONENTES AUXILIARES

### circular-testimonials.tsx

- Testimonios en disposición circular
- Animaciones rotatorias
- (Puede no estar en uso en la landing principal)

### testimonials-columns-1.tsx

- Componente de columna individual de testimonios
- Scroll vertical automático
- Animaciones de fade

### zoom-parallax.tsx

- Ya documentado arriba (componente principal)

---

## 🔧 16. HOOKS PERSONALIZADOS

### use-scroll-navbar.ts

**Funcionalidad:**

- Detecta scroll de la página
- Retorna estado `isScrolled` (boolean)
- Threshold: 50px
- Usado por Navbar para cambiar estilos

```typescript
export function useScrollNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    // ...
  }, []);

  return { isScrolled };
}
```

---

## 🎨 17. ESTILOS GLOBALES

### src/app/globals.css

**Clases personalizadas necesarias:**

```css
.gradient-text-main {
  background: linear-gradient(to right, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-primary {
  background: linear-gradient(
    to right,
    var(--primary),
    var(--primary-foreground)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Fuentes necesarias:**

- DM Sans (sans-serif principal)
- Lora (serif)
- IBM Plex Mono (monospace)

---

## 📦 18. COMPONENTES UI (shadcn/ui)

### Componentes críticos necesarios:

**Ya presentes en destino:**

- `button.tsx`
- `input.tsx`
- `textarea.tsx`
- `label.tsx`
- `card.tsx`
- `badge.tsx`
- `separator.tsx`
- `form.tsx`

**Necesarios del fuente:**

- `infinite-slider.tsx` ⚠️
- `progressive-blur.tsx` ⚠️
- `aspect-ratio.tsx` ⚠️
- `turnstile-widget.tsx` ⚠️

---

## 🎯 19. CONFIGURACIÓN DE IDs PARA NAVEGACIÓN

**IDs de secciones (en orden):**

```typescript
const sectionIds = {
  inicio: "#inicio", // Hero Section
  howItWorks: "#how-it-works", // How It Works
  whyChooseUs: "#why-choose-us", // Why Choose Us (opcional)
  pricing: "#pricing", // Pricing Section
  beneficios: "#beneficios", // Benefits Section
  testimonios: "#testimonios", // Testimonials Section
  contacto: "#contacto", // Contact Section
};
```

**Offset para scroll:**

- Navbar height: 64px
- Aplicar offset en todas las funciones de scroll

---

## 🎬 20. ANIMACIONES FRAMER MOTION

### Variantes comunes:

```typescript
// Fade in desde abajo
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// Fade in desde izquierda
const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

// Fade in desde derecha
const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
};

// Stagger children
const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};
```

### Configuración de viewport:

```typescript
viewport={{ once: true, margin: "-100px" }}
```

---

## 📊 21. DATOS Y CONTENIDO

### Portfolio Data (ejemplo)

```typescript
export const portfolioData: PortfolioItem[] = [
  {
    videoSrc: "/portfolio/video-1.mp4",
    title: "Brand Campaign",
    subtitle: "Social Media",
    description: "Engaging content for Instagram and TikTok",
    platforms: [
      { name: "Instagram", icon: <Instagram /> },
      { name: "TikTok", icon: <TiktokIcon /> }
    ]
  },
  // ... más items
];
```

### Parallax Images Data

```typescript
const parallaxImages = [
  {
    src: "url-or-path",
    alt: "Description",
    title: "Title",
    description: "Description",
    orientation: "horizontal" | "vertical",
  },
  // ... 7 imágenes total
];
```

---

## 🔐 22. VARIABLES DE ENTORNO

**Necesarias:**

```env
# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key

# Email/Form submission
RESEND_API_KEY=your_resend_key
CONTACT_EMAIL=contact@lumiloops.com

# Other
NEXT_PUBLIC_SITE_URL=https://lumiloops.com
```

---

## 🎨 23. THEME CONFIGURATION

### Colores del tema (Tailwind)

Verificar en `tailwind.config.ts`:

```typescript
colors: {
  primary: "hsl(var(--primary))",
  accent: "hsl(var(--accent))",
  // ... otros colores
}
```

### CSS Variables

En `globals.css`:

```css
:root {
  --primary: ...;
  --accent: ...;
  --background: ...;
  --foreground: ...;
  /* etc */
}
```

---

## 📱 24. RESPONSIVE BREAKPOINTS

**Tailwind breakpoints utilizados:**

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Patrones comunes:**

```tsx
className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
className = "text-base md:text-lg lg:text-xl";
className = "px-4 md:px-8 lg:px-12";
```

---

## 🚀 25. OPTIMIZACIONES

### Imágenes

- Usar Next.js `<Image>` component
- Configurar `priority` para hero images
- Lazy load para imágenes below the fold
- WebP format cuando sea posible

### Videos

- Usar atributos: `autoPlay`, `loop`, `muted`, `playsInline`
- Preload="metadata" para videos no críticos
- Considerar poster images

### Animaciones

- Usar `viewport={{ once: true }}` para animaciones que solo se ejecutan una vez
- Reducir motion para usuarios con preferencias de accesibilidad

---

## 📝 26. NOTAS DE IMPLEMENTACIÓN

### Orden de implementación sugerido:

1. **Primero:** Layout (Navbar, Footer)
2. **Segundo:** Componentes simples (Hero, Benefits, Pricing)
3. **Tercero:** Componentes complejos (Portfolio, Parallax, Why Choose Us)
4. **Cuarto:** Formularios y validaciones
5. **Quinto:** Optimizaciones y testing

### Consideraciones:

- Mantener imports organizados (React, Next, Third-party, Local)
- Usar TypeScript para todas las interfaces
- Comentar código complejo
- Mantener componentes bajo 300 líneas cuando sea posible
- Extraer lógica compleja a hooks personalizados
- Usar constantes para datos estáticos

---

## 🔍 27. DEBUGGING Y TESTING

### Puntos de verificación:

- [ ] Scroll suave funcionando en todos los navegadores
- [ ] Videos reproduciéndose en mobile
- [ ] Formulario enviando correctamente
- [ ] Animaciones no causando layout shift
- [ ] Imágenes cargando con lazy load
- [ ] Menú móvil cerrándose al navegar
- [ ] Theme toggle persistiendo preferencia
- [ ] Links externos abriendo en nueva pestaña

### Herramientas:

- React DevTools
- Lighthouse
- Chrome DevTools Performance
- Mobile device testing
- Cross-browser testing

---

**Última actualización:** 2025-01-21  
**Versión:** 1.0
