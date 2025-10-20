# Guía de Desarrollo - Lumi Loops

## 🛠️ Herramientas de Desarrollo

Este proyecto utiliza las siguientes herramientas para mantener la calidad del código y facilitar el trabajo en equipo:

### ESLint

Analizador de código estático para identificar y corregir problemas en JavaScript/TypeScript.

### Prettier

Formateador de código automático que garantiza un estilo consistente.

### Husky

Gestiona Git hooks para ejecutar scripts automáticamente en eventos de Git.

### Lint-staged

Ejecuta linters solo en archivos staged de Git, optimizando el proceso de pre-commit.

---

## 📜 Scripts Disponibles

### Desarrollo

```bash
bun dev              # Inicia el servidor de desarrollo con Turbopack
bun build            # Construye la aplicación para producción
bun start            # Inicia el servidor de producción
```

### Linting y Formateo

```bash
bun lint             # Ejecuta ESLint en todo el proyecto
bun lint:fix         # Ejecuta ESLint y corrige automáticamente los problemas
bun format           # Formatea todos los archivos con Prettier
bun format:check     # Verifica el formato sin modificar archivos
bun type-check       # Verifica los tipos de TypeScript sin compilar
```

---

## 🔄 Flujo de Trabajo

### 1. Antes de Hacer Commit

Cuando hagas commit de tus cambios, **Husky ejecutará automáticamente**:

- **lint-staged**: Analiza y formatea solo los archivos modificados
- **ESLint**: Corrige problemas de código automáticamente
- **Prettier**: Formatea el código según las reglas establecidas

Si hay errores que no se pueden corregir automáticamente, el commit será rechazado.

### 2. Comandos Recomendados

Antes de hacer push, ejecuta:

```bash
bun lint:fix         # Corrige problemas de linting
bun format           # Formatea todo el código
bun type-check       # Verifica tipos de TypeScript
```

---

## ⚙️ Configuración

### ESLint (`eslint.config.mjs`)

- Extiende las configuraciones de Next.js y TypeScript
- Integración con Prettier
- Reglas personalizadas para React, TypeScript y calidad de código
- Advertencias para `console.log` (permite `console.warn` y `console.error`)

### Prettier (`.prettierrc.json`)

- **Semi**: Punto y coma al final de las declaraciones
- **Single Quote**: Comillas dobles (false)
- **Print Width**: 80 caracteres
- **Tab Width**: 2 espacios
- **Trailing Comma**: ES5
- **End of Line**: LF (Unix)

### Lint-staged

Configurado en `package.json` para ejecutar:

- **Archivos JS/TS**: ESLint + Prettier
- **Archivos JSON/MD/CSS**: Prettier

---

## 🚀 Mejores Prácticas

### 1. Estructura de Código

- Usa el directorio `src/` para todo el código fuente
- Sigue la estructura de App Router de Next.js
- Utiliza alias `@/` para imports absolutos

### 2. TypeScript

- Evita usar `any` cuando sea posible
- Define tipos explícitos para props y funciones
- Usa prefijo `_` para variables no utilizadas

### 3. React/Next.js

- Usa `next/image` en lugar de `<img>`
- Usa `next/link` para navegación interna
- Implementa Server Components cuando sea posible
- Usa Client Components solo cuando sea necesario

### 4. Commits

- Escribe mensajes de commit descriptivos
- Haz commits pequeños y frecuentes
- Verifica que el código pase todas las validaciones antes de hacer push

### 5. Code Review

- Ejecuta `bun lint` y `bun type-check` antes de solicitar revisión
- Asegúrate de que el código esté formateado correctamente
- Prueba tu código localmente antes de hacer push

---

## 🔧 Solución de Problemas

### El pre-commit hook falla

```bash
# Corrige manualmente los problemas
bun lint:fix
bun format

# Verifica los cambios
git add .
git commit -m "tu mensaje"
```

### Desactivar temporalmente los hooks (NO RECOMENDADO)

```bash
git commit --no-verify -m "mensaje"
```

### Actualizar Husky después de clonar

```bash
bun install
```

---

## 📚 Recursos

- [Next.js Documentation](https://nextjs.org/docs)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Husky Documentation](https://typicode.github.io/husky/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 👥 Contribuir

1. Clona el repositorio
2. Instala las dependencias: `bun install`
3. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
4. Realiza tus cambios siguiendo las mejores prácticas
5. Haz commit de tus cambios (los hooks se ejecutarán automáticamente)
6. Push a tu rama: `git push origin feature/nueva-funcionalidad`
7. Abre un Pull Request

---

**¡Feliz desarrollo! 🎉**
