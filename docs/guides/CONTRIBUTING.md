# Guía de Contribución

¡Gracias por contribuir a Lumi Loops! 🎉

## 🚀 Inicio Rápido

### 1. Configuración Inicial

```bash
# Clona el repositorio
git clone <repository-url>
cd lumiloops-oficial

# Instala las dependencias
bun install

# Inicia el servidor de desarrollo
bun dev
```

### 2. Extensiones de VS Code Recomendadas

Al abrir el proyecto, VS Code te sugerirá instalar las siguientes extensiones:

- **ESLint**: Análisis de código en tiempo real
- **Prettier**: Formateo automático de código
- **Tailwind CSS IntelliSense**: Autocompletado para Tailwind
- **TypeScript**: Soporte mejorado para TypeScript

## 📝 Proceso de Contribución

### 1. Crea una Rama

```bash
git checkout -b feature/nombre-de-tu-feature
# o
git checkout -b fix/descripcion-del-bug
```

### 2. Desarrolla tu Feature

- Escribe código limpio y bien documentado
- Sigue las convenciones de código del proyecto
- Asegúrate de que tu código pase todas las validaciones

### 3. Verifica tu Código

```bash
# Ejecuta el linter
bun lint

# Corrige problemas automáticamente
bun lint:fix

# Formatea el código
bun format

# Verifica los tipos
bun type-check
```

### 4. Haz Commit

```bash
git add .
git commit -m "feat: descripción clara de tu cambio"
```

**Nota**: Los hooks de pre-commit ejecutarán automáticamente ESLint y Prettier en tus archivos modificados.

### 5. Push y Pull Request

```bash
git push origin feature/nombre-de-tu-feature
```

Luego crea un Pull Request en GitHub con:

- Título descriptivo
- Descripción detallada de los cambios
- Screenshots si aplica
- Referencias a issues relacionados

## 🎯 Convenciones de Código

### Nombres de Archivos

- Componentes: `PascalCase.tsx` (ej: `Button.tsx`)
- Utilidades: `camelCase.ts` (ej: `formatDate.ts`)
- Páginas: `kebab-case` o `[dynamic]` (Next.js App Router)

### Estructura de Componentes

```typescript
// 1. Imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

// 3. Component
export function MyComponent({ title, onAction }: MyComponentProps) {
  // 4. Hooks
  const [state, setState] = useState(false);

  // 5. Handlers
  const handleClick = () => {
    setState(true);
    onAction?.();
  };

  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>Click me</Button>
    </div>
  );
}
```

### Mensajes de Commit

Usa [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: añade nueva funcionalidad
fix: corrige un bug
docs: actualiza documentación
style: cambios de formato (no afectan el código)
refactor: refactorización de código
test: añade o modifica tests
chore: tareas de mantenimiento
```

## 🔍 Revisión de Código

### Checklist antes de solicitar revisión:

- [ ] El código compila sin errores
- [ ] Todos los tests pasan
- [ ] El código está formateado correctamente
- [ ] No hay warnings de ESLint
- [ ] Los tipos de TypeScript son correctos
- [ ] La funcionalidad ha sido probada manualmente
- [ ] Se ha actualizado la documentación si es necesario

### Durante la revisión:

- Responde a los comentarios de manera constructiva
- Realiza los cambios solicitados
- Marca las conversaciones como resueltas cuando corresponda

## 🐛 Reportar Bugs

Al reportar un bug, incluye:

1. **Descripción**: ¿Qué está pasando?
2. **Pasos para reproducir**: ¿Cómo se puede replicar el bug?
3. **Comportamiento esperado**: ¿Qué debería pasar?
4. **Screenshots**: Si aplica
5. **Entorno**: Navegador, OS, versión de Node, etc.

## 💡 Sugerir Features

Al sugerir una nueva funcionalidad:

1. **Problema**: ¿Qué problema resuelve?
2. **Solución propuesta**: ¿Cómo lo resolverías?
3. **Alternativas**: ¿Consideraste otras opciones?
4. **Contexto adicional**: Mockups, ejemplos, referencias

## 📚 Recursos Útiles

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## ❓ ¿Necesitas Ayuda?

- Revisa la documentación en `DEVELOPMENT.md`
- Busca en issues existentes
- Pregunta en el canal de desarrollo del equipo

---

**¡Gracias por contribuir a Lumi Loops! 🌟**
