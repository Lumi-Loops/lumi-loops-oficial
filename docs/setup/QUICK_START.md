# 🚀 Guía Rápida - Lumi Loops

## ⚡ Inicio Rápido (5 minutos)

### 1. Instala las Dependencias

```bash
bun install
```

### 2. Inicia el Servidor de Desarrollo

```bash
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 3. Instala las Extensiones de VS Code

Cuando abras el proyecto, VS Code te sugerirá instalar las extensiones recomendadas. **¡Acéptalas!**

## 🎯 Comandos Esenciales

```bash
# Desarrollo
bun dev              # Inicia el servidor de desarrollo

# Calidad de Código (ejecuta antes de hacer commit)
bun lint:fix         # Corrige problemas de código
bun format           # Formatea todo el código
bun type-check       # Verifica tipos TypeScript
```

## ✅ Antes de Hacer Commit

**Los hooks de Git se ejecutarán automáticamente**, pero puedes ejecutar manualmente:

```bash
bun lint:fix && bun format && bun type-check
```

## 📚 Documentación Completa

- **`DEVELOPMENT.md`** - Guía completa de desarrollo
- **`.github/CONTRIBUTING.md`** - Cómo contribuir al proyecto
- **`SETUP_SUMMARY.md`** - Resumen de la configuración

## 🆘 Problemas Comunes

### El commit fue rechazado

```bash
# Corrige los problemas automáticamente
bun lint:fix
bun format

# Intenta el commit nuevamente
git add .
git commit -m "tu mensaje"
```

### Errores de ESLint

```bash
# Ve los errores
bun lint

# Corrígelos automáticamente
bun lint:fix
```

### Errores de TypeScript

```bash
# Verifica los errores
bun type-check
```

## 🎓 Aprende Más

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

---

**¡Listo para empezar! 🎉**
