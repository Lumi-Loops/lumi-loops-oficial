# 🏗️ Arquitectura de Componentes - Lumi Loops

## 📐 Estructura Visual de la Aplicación

Este documento muestra la arquitectura y jerarquía de componentes de la landing page.

---

## 🌳 Árbol de Componentes

```
App (page.tsx)
│
└── LandingPage
    │
    ├── Navbar
    │   ├── Logo (Next/Image)
    │   ├── NavigationItems
    │   │   └── ScrollToSection()
    │   ├── MobileMenu
    │   │   ├── Menu Icon (Lucide)
    │   │   └── X Icon (Lucide)
    │   └── ScrollProgressBar
    │       └── useScrollProgress()
    │
    ├── HeroSection
    │   ├── AnimatedGradients (Motion)
    │   ├── TrustBadge
    │   │   └── CheckCircle Icon
    │   ├── MainHeadline
    │   │   └── GradientText
    │   ├── Subtitle
    │   ├── CTAButtons
    │   │   ├── GetStartedButton
    │   │   │   └── ArrowRight Icon
    │   │   └── SeeExamplesButton
    │   │       └── Play Icon
    │   ├── VisualContent
    │   │   ├── AspectRatio
    │   │   ├── Image/Video
    │   │   └── PlayButtonOverlay
    │   ├── FloatingBadges (Motion)
    │   │   ├── LiveProductionBadge
    │   │   └── QualityFocusBadge
    │   └── ScrollIndicator (Motion)
    │
    ├── ZoomParallax
    │   ├── ParallaxContainer (useScroll)
    │   ├── Image1 (scale4)
    │   │   └── TextOverlay
    │   ├── Image2 (scale5)
    │   │   └── TextOverlay
    │   ├── Image3 (scale6)
    │   │   └── TextOverlay
    │   ├── Image4 (scale5)
    │   │   └── TextOverlay
    │   ├── Image5 (scale6)
    │   │   └── TextOverlay
    │   ├── Image6 (scale8)
    │   │   └── TextOverlay
    │   ├── Image7 (scale9)
    │   │   └── TextOverlay
    │   ├── CentralLogo (Motion)
    │   │   └── LogoAnimation
    │   └── GlassmorphismBackdrop (Motion)
    │
    ├── HowItWorks
    │   ├── SectionHeader
    │   ├── StepsGrid
    │   │   ├── Step1Card (Motion)
    │   │   │   ├── EmojiIcon
    │   │   │   ├── BackgroundNumber
    │   │   │   ├── Title
    │   │   │   ├── Description
    │   │   │   └── DecorativeBar
    │   │   ├── Arrow1 (Motion)
    │   │   │   ├── ArrowRight (desktop)
    │   │   │   └── ArrowDown (mobile)
    │   │   ├── Step2Card (Motion)
    │   │   │   └── [same structure]
    │   │   ├── Arrow2 (Motion)
    │   │   └── Step3Card (Motion)
    │   │       └── [same structure]
    │   ├── Separator
    │   ├── BentoGridSection
    │   │   └── BentoGrid1
    │   │       ├── GridItem1 (Bot)
    │   │       ├── GridItem2 (Zap)
    │   │       ├── GridItem3 (CheckCircle)
    │   │       ├── GridItem4 (Gift)
    │   │       ├── GridItem5 (Shield)
    │   │       └── GridItem6 (TrendingUp)
    │   └── BottomCTA
    │
    ├── WhyChooseUs
    │   ├── SectionHeader
    │   ├── ContentGrid
    │   │   ├── LeftColumn
    │   │   │   ├── BenefitsList
    │   │   │   │   ├── Benefit1 (numbered)
    │   │   │   │   ├── Benefit2
    │   │   │   │   ├── Benefit3
    │   │   │   │   ├── Benefit4
    │   │   │   │   ├── Benefit5
    │   │   │   │   └── Benefit6
    │   │   │   ├── TestimonialCard
    │   │   │   │   ├── Quote
    │   │   │   │   └── Author
    │   │   │   └── CheckmarksList
    │   │   │       ├── Checkmark1
    │   │   │       ├── Checkmark2
    │   │   │       └── Checkmark3
    │   │   └── RightColumn
    │   │       ├── VideoContainer
    │   │       │   └── Video (9:16)
    │   │       └── FloatingBadges (Motion)
    │   │           ├── HumanAIBadge
    │   │           └── DeliveryBadge
    │   └── ZoomParallaxBanner
    │       ├── GlassmorphismBackdrop (Motion)
    │       ├── BannerContent (Motion)
    │       │   ├── FirstSentence
    │       │   │   ├── Ban Icon (animated)
    │       │   │   └── Text with shadow
    │       │   ├── Separator
    │       │   └── SecondSentence
    │       │       ├── Clapperboard Icon (animated)
    │       │       └── Text with glow
    │       └── GlowEffect (Motion)
    │
    ├── PortfolioVideoShowcase
    │   ├── SectionHeader
    │   ├── VideoCarousel
    │   │   ├── VideoContainer
    │   │   │   ├── ActiveVideo
    │   │   │   │   ├── Video Element
    │   │   │   │   └── VideoRefs
    │   │   │   ├── PrevButton (Motion)
    │   │   │   │   └── ArrowLeft Icon
    │   │   │   ├── NextButton (Motion)
    │   │   │   │   └── ArrowRight Icon
    │   │   │   └── MuteButton
    │   │   │       ├── Volume2 Icon
    │   │   │       └── VolumeX Icon
    │   │   ├── VideoInfo
    │   │   │   ├── Title
    │   │   │   ├── Subtitle
    │   │   │   └── Description
    │   │   └── PlatformIcons
    │   │       ├── Instagram
    │   │       ├── Facebook
    │   │       ├── TikTok
    │   │       └── YouTube
    │   └── ResponsiveGapCalculation
    │
    ├── SocialPlatformsCarousel
    │   ├── IntroText
    │   ├── InfiniteSlider
    │   │   ├── Platform1 (YouTube)
    │   │   ├── Platform2 (Instagram)
    │   │   ├── Platform3 (TikTok)
    │   │   ├── Platform4 (LinkedIn)
    │   │   ├── Platform5 (Facebook)
    │   │   ├── Platform6 (Twitter)
    │   │   ├── Platform7 (Snapchat)
    │   │   └── Platform8 (Pinterest)
    │   └── ProgressiveBlur
    │       ├── LeftBlur
    │       └── RightBlur
    │
    ├── BenefitsSection
    │   ├── SectionHeader
    │   └── BenefitsGrid
    │       ├── BenefitCard1 (Zap)
    │       │   ├── IconContainer
    │       │   ├── Title
    │       │   └── Description
    │       ├── BenefitCard2 (Heart)
    │       ├── BenefitCard3 (Palette)
    │       ├── BenefitCard4 (Smartphone)
    │       ├── BenefitCard5 (DollarSign)
    │       └── BenefitCard6 (Clock)
    │
    ├── PricingSection
    │   ├── SectionHeader
    │   └── PricingGrid
    │       ├── StarterPlan
    │       │   ├── PlanName
    │       │   ├── Price
    │       │   ├── Description
    │       │   ├── FeaturesList
    │       │   │   ├── Feature1 (Check icon)
    │       │   │   ├── Feature2
    │       │   │   ├── Feature3
    │       │   │   └── Feature4
    │       │   └── CTAButton
    │       ├── GrowthPlan (Popular)
    │       │   ├── PopularBadge (Sparkles)
    │       │   └── [same structure]
    │       └── ProPlan
    │           └── [same structure]
    │
    ├── TestimonialsSection
    │   ├── SectionHeader
    │   └── TestimonialsGrid
    │       ├── Column1 (TestimonialsColumn)
    │       │   ├── Testimonial1
    │       │   │   ├── StarRating
    │       │   │   ├── Text
    │       │   │   ├── Avatar (Dicebear)
    │       │   │   ├── Name
    │       │   │   └── Role
    │       │   ├── Testimonial2
    │       │   ├── Testimonial3
    │       │   └── Testimonial4
    │       ├── Column2 (TestimonialsColumn)
    │       │   └── [4 testimonials]
    │       └── Column3 (TestimonialsColumn)
    │           └── [4 testimonials]
    │
    ├── ContactSection
    │   ├── BackgroundDecoration
    │   ├── SectionHeader
    │   │   ├── Badge (Sparkles)
    │   │   ├── Title (GradientText)
    │   │   └── Subtitle
    │   └── FormCard
    │       └── LeadForm
    │           ├── NameField
    │           │   ├── Label
    │           │   ├── Input
    │           │   └── ErrorMessage
    │           ├── EmailField
    │           │   └── [same structure]
    │           ├── CompanyField
    │           │   └── [same structure]
    │           ├── ServiceTypeField
    │           │   ├── Label
    │           │   ├── Select
    │           │   └── ErrorMessage
    │           ├── MessageField
    │           │   ├── Label
    │           │   ├── Textarea
    │           │   └── ErrorMessage
    │           ├── TurnstileWidget
    │           │   └── CloudflareCaptcha
    │           ├── SubmitButton
    │           │   └── LoadingState
    │           └── FormStates
    │               ├── SuccessMessage
    │               └── ErrorMessage
    │
    └── Footer
        ├── FooterGrid
        │   ├── CompanyInfo
        │   │   ├── Logo
        │   │   ├── Description
        │   │   └── SocialLinks
        │   │       ├── Instagram
        │   │       ├── LinkedIn
        │   │       ├── Twitter
        │   │       └── YouTube
        │   ├── CompanyLinks
        │   │   ├── Home
        │   │   ├── HowItWorks
        │   │   ├── WhyChooseUs
        │   │   └── Pricing
        │   ├── ResourcesLinks
        │   │   ├── Benefits
        │   │   ├── Testimonials
        │   │   └── Contact
        │   └── LegalLinks
        │       ├── Privacy
        │       ├── Terms
        │       └── Cookies
        ├── Separator
        ├── BottomBar
        │   ├── Copyright
        │   ├── ContactInfo
        │   │   ├── Email (Mail icon)
        │   │   └── Location (MapPin icon)
        │   └── ThemeToggle
        └── BackToTop (optional)
```

---

## 🔄 Flujo de Datos y Estado

```
┌─────────────────────────────────────────┐
│         Global State / Context          │
│  - Theme (dark/light)                   │
│  - Scroll position                      │
└─────────────────────────────────────────┘
                    │
                    ├──────────────────────┐
                    ▼                      ▼
         ┌──────────────────┐   ┌──────────────────┐
         │     Navbar       │   │  Other Components│
         │  - useScrollNavbar│   │  - useScroll     │
         │  - isScrolled    │   │  - animations    │
         └──────────────────┘   └──────────────────┘
                    │
                    ▼
         ┌──────────────────┐
         │  Scroll Events   │
         │  - smooth scroll │
         │  - section IDs   │
         └──────────────────┘
                    │
                    ▼
         ┌──────────────────┐
         │   Form State     │
         │  - React Hook    │
         │    Form          │
         │  - Validation    │
         │  - Submission    │
         └──────────────────┘
```

---

## 📦 Dependencias entre Componentes

### Componentes Independientes (Sin dependencias)

- `hero-section.tsx`
- `benefits-section.tsx`
- `pricing-section.tsx`
- `social-platforms-carousel.tsx`

### Componentes con Dependencias Internas

#### `landing-page.tsx` → Importa TODOS

```typescript
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing/hero-section";
import { ZoomParallax } from "@/components/zoom-parallax";
import { HowItWorks } from "@/components/landing/how-it-works";
import { WhyChooseUs } from "@/components/landing/why-choose-us";
import { PortfolioVideoShowcase } from "@/components/landing/portfolio-video-showcase";
import { SocialPlatformsCarousel } from "@/components/landing/social-platforms-carousel";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { ContactSection } from "@/components/landing/contact-section";
```

#### `navbar.tsx` → Dependencias

```typescript
import { useScrollNavbar } from "@/hooks/use-scroll-navbar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
```

#### `how-it-works.tsx` → Dependencias

```typescript
import BentoGrid1 from "@/components/mvpblocks/bento-grid-1";
import { ArrowDown, ArrowRight } from "lucide-react";
```

#### `contact-section.tsx` → Dependencias

```typescript
import { LeadForm } from "@/components/forms/lead-form";
import { Sparkles } from "lucide-react";
```

#### `lead-form.tsx` → Dependencias

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TurnstileWidget } from "@/components/ui/turnstile-widget";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
```

#### `testimonials-section.tsx` → Dependencias

```typescript
import { TestimonialsColumn } from "@/components/testimonials-columns-1";
import { Star } from "lucide-react";
```

#### `social-platforms-carousel.tsx` → Dependencias

```typescript
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
```

---

## 🎨 Patrones de Diseño Utilizados

### 1. **Composition Pattern**

Los componentes se componen de componentes más pequeños:

```
LandingPage
  └── Compuesto de múltiples secciones
      └── Cada sección compuesta de elementos UI
```

### 2. **Container/Presentational Pattern**

```
ContactSection (Container)
  └── LeadForm (Presentational)
      └── Maneja lógica de formulario
```

### 3. **Render Props Pattern**

```typescript
<motion.div
  variants={fadeInUp}
  initial="hidden"
  whileInView="visible"
>
  {children}
</motion.div>
```

### 4. **Custom Hooks Pattern**

```typescript
// Encapsula lógica reutilizable
const { isScrolled } = useScrollNavbar();
```

### 5. **Compound Components Pattern**

```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

---

## 🔌 Integración de Librerías Externas

### Framer Motion (Animaciones)

```
Usado en:
├── hero-section.tsx (fadeIn, stagger)
├── how-it-works.tsx (cardVariants, spring)
├── why-choose-us.tsx (parallax, zoom)
├── zoom-parallax.tsx (scroll-based)
├── benefits-section.tsx (whip effect)
├── pricing-section.tsx (card animations)
├── testimonials-section.tsx (fade)
├── contact-section.tsx (entrance)
├── navbar.tsx (hover, scroll progress)
└── footer.tsx (entrance)
```

### Lucide React (Iconos)

```
Iconos utilizados:
├── Navigation: Menu, X, ArrowRight, ArrowLeft
├── Actions: Play, CheckCircle, Sparkles
├── Features: Zap, Heart, Palette, Smartphone, DollarSign, Clock
├── Social: Instagram, Linkedin, Twitter, Youtube, Facebook
├── Other: Bot, Gift, Shield, TrendingUp, Ban, Clapperboard
├── Contact: Mail, MapPin
└── Audio: Volume2, VolumeX
```

### React Hook Form + Zod

```
lead-form.tsx
├── useForm (hook)
├── zodResolver (validation)
├── Schema definition
└── Error handling
```

### Next.js Features

```
Utilizados:
├── Image (optimización)
├── Link (navegación)
├── App Router (routing)
└── Metadata (SEO)
```

---

## 🎯 Puntos de Entrada y Navegación

### Scroll Navigation Flow

```
User clicks Navbar link
        │
        ▼
scrollToSection(href)
        │
        ▼
document.querySelector(href)
        │
        ▼
Calculate offset (navbar height)
        │
        ▼
window.scrollTo({ behavior: 'smooth' })
        │
        ▼
Section appears in viewport
        │
        ▼
Animations trigger (whileInView)
```

### Form Submission Flow

```
User fills form
        │
        ▼
React Hook Form validation
        │
        ▼
Zod schema validation
        │
        ▼
Turnstile verification
        │
        ▼
API call (POST /api/contact)
        │
        ├── Success → Show success message
        │
        └── Error → Show error message
```

---

## 🔄 Ciclo de Vida de Animaciones

### Scroll-based Animations

```
Component enters viewport
        │
        ▼
whileInView="visible" triggers
        │
        ▼
Animation variants execute
        │
        ├── fadeInUp
        ├── fadeInLeft
        ├── fadeInRight
        └── stagger (children)
        │
        ▼
Animation completes
        │
        ▼
viewport={{ once: true }} → No repeat
```

### Continuous Animations

```
Component mounts
        │
        ▼
animate={{ ... }} with repeat: Infinity
        │
        ▼
Animation loops continuously
        │
        ├── Gradient rotation (Hero)
        ├── Badge floating (Hero, Why Choose Us)
        ├── Arrow pulse (How It Works)
        └── Glow effect (Why Choose Us banner)
```

---

## 📊 Jerarquía de Estilos

```
globals.css (base styles)
        │
        ├── CSS Variables (theme)
        ├── Custom classes (.gradient-text-*)
        └── Tailwind directives
        │
        ▼
Tailwind Config (tailwind.config.ts)
        │
        ├── Colors
        ├── Fonts
        ├── Spacing
        └── Breakpoints
        │
        ▼
Component-level Tailwind classes
        │
        ├── Utility classes
        ├── Responsive modifiers
        └── State modifiers (hover, focus)
        │
        ▼
Inline styles (Motion values)
        │
        └── Dynamic animations
```

---

## 🎭 Estados de la Aplicación

### Navbar States

```
┌─────────────┐
│   Initial   │ (transparent, no shadow)
└──────┬──────┘
       │ scroll > 50px
       ▼
┌─────────────┐
│  Scrolled   │ (solid, shadow, backdrop-blur)
└─────────────┘
```

### Form States

```
┌─────────────┐
│    Idle     │
└──────┬──────┘
       │ user starts typing
       ▼
┌─────────────┐
│   Editing   │
└──────┬──────┘
       │ submit clicked
       ▼
┌─────────────┐
│  Validating │
└──────┬──────┘
       │
       ├── Valid → Loading
       │           └──┬──→ Success
       │              └──→ Error
       │
       └── Invalid → Show errors
```

### Video States (Portfolio)

```
┌─────────────┐
│   Paused    │
└──────┬──────┘
       │ becomes active
       ▼
┌─────────────┐
│   Playing   │ (autoplay, muted)
└──────┬──────┘
       │
       ├── User clicks mute toggle
       │   └──→ Muted ⟷ Unmuted
       │
       └── Carousel changes
           └──→ Paused
```

---

## 🔐 Seguridad y Validación

### Form Validation Layers

```
1. Client-side (React Hook Form)
   └── Field-level validation
       └── Required, email format, min/max length

2. Schema Validation (Zod)
   └── Type checking
       └── Data structure validation

3. Captcha (Turnstile)
   └── Bot protection
       └── Token verification

4. Server-side (API endpoint)
   └── Final validation
       └── Sanitization, rate limiting
```

---

## 🚀 Performance Optimizations

### Image Optimization

```
Next.js <Image>
├── Automatic WebP conversion
├── Responsive sizes
├── Lazy loading (below fold)
├── Priority loading (above fold)
└── Blur placeholder
```

### Code Splitting

```
Landing Page
├── Dynamic imports (if needed)
├── Component-level splitting
└── Route-based splitting (Next.js automatic)
```

### Animation Performance

```
Framer Motion
├── GPU-accelerated properties (transform, opacity)
├── will-change CSS hints
├── Reduced motion support
└── viewport={{ once: true }} (no re-animation)
```

---

## 📱 Responsive Behavior

### Breakpoint Strategy

```
Mobile First Approach
├── Base: 320px - 767px (mobile)
├── md: 768px - 1023px (tablet)
├── lg: 1024px - 1279px (desktop)
└── xl: 1280px+ (large desktop)
```

### Component Adaptations

```
Navbar
├── Mobile: Hamburger menu
└── Desktop: Horizontal links

Hero Section
├── Mobile: Stacked (1 column)
└── Desktop: Side-by-side (2 columns)

How It Works
├── Mobile: Vertical arrows
└── Desktop: Horizontal arrows

Testimonials
├── Mobile: 1 column
├── Tablet: 2 columns
└── Desktop: 3 columns
```

---

## 🎯 Métricas de Componentes

### Complejidad por Componente

| Componente                    | Líneas | Complejidad | Dependencias |
| ----------------------------- | ------ | ----------- | ------------ |
| hero-section.tsx              | ~274   | Media       | 3            |
| how-it-works.tsx              | ~297   | Alta        | 4            |
| why-choose-us.tsx             | ~415   | Muy Alta    | 3            |
| portfolio-video-showcase.tsx  | ~785   | Muy Alta    | 5            |
| social-platforms-carousel.tsx | ~113   | Baja        | 2            |
| benefits-section.tsx          | ~246   | Media       | 6            |
| pricing-section.tsx           | ~266   | Media       | 2            |
| testimonials-section.tsx      | ~194   | Media       | 2            |
| contact-section.tsx           | ~67    | Baja        | 2            |
| lead-form.tsx                 | ~300+  | Alta        | 8+           |
| navbar.tsx                    | ~193   | Media       | 4            |
| footer.tsx                    | ~230   | Media       | 5            |
| zoom-parallax.tsx             | ~236   | Alta        | 2            |
| bento-grid-1.tsx              | ~155   | Media       | 7            |

---

## 🔍 Testing Strategy

### Component Testing Hierarchy

```
Unit Tests
├── Individual components
├── Utility functions
└── Custom hooks

Integration Tests
├── Component interactions
├── Form submissions
└── Navigation flow

E2E Tests
├── Full user journeys
├── Cross-browser
└── Responsive testing
```

---

**Última actualización:** 2025-01-21  
**Versión:** 1.0
