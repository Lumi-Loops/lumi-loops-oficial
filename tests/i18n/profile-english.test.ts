import { describe, it, expect } from "bun:test";
import { readFileSync } from "fs";

function read(path: string): string {
  return readFileSync(path, "utf8");
}

// Files to verify for English-only content in the profile page
const files = [
  "src/components/client/ClientProfile.tsx",
  "src/app/dashboard/profile/page.tsx",
  "src/app/api/profile/route.ts",
];

// Spanish phrases that must NOT appear in the profile-related code
const spanishPhrases = [
  "Por favor",
  "Nombre",
  "Apellido",
  "Teléfono",
  "País",
  "Ciudad",
  "Próximamente",
  "Datos de la empresa",
  "Datos personales",
  "Dirección",
  "Código Postal",
  "Estado/Provincia",
  "Datos inválidos",
];

describe("Profile i18n – English only", () => {
  it("does not contain Spanish phrases in profile component and page", () => {
    for (const file of files) {
      const content = read(file);
      for (const phrase of spanishPhrases) {
        expect(content.includes(phrase)).toBeFalse();
      }
    }
  });

  it("has English labels for name and phone fields", () => {
    const clientProfile = read("src/components/client/ClientProfile.tsx");
    expect(clientProfile.includes("First Name")).toBeTrue();
    expect(clientProfile.includes("Last Name")).toBeTrue();
    expect(clientProfile.includes("Phone")).toBeTrue();
    expect(clientProfile.includes("Company Name")).toBeTrue();
  });

  it("Zod backend messages are in English", () => {
    const route = read("src/app/api/profile/route.ts");
    expect(route.includes("First name is required")).toBeTrue();
    expect(route.includes("Last name is required")).toBeTrue();
    expect(route.includes("Nombre requerido")).toBeFalse();
    expect(route.includes("Apellido requerido")).toBeFalse();
  });

  it("does not use Spanish locale in the profile files", () => {
    for (const file of files) {
      const content = read(file);
      expect(/es-ES/.test(content)).toBeFalse();
    }
  });
});
