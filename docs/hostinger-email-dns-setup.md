# Documentación: Configuración DNS para correo empresarial en Hostinger

## Dominio: `lumiloops.com`

### ✅ Objetivo

Configurar el dominio para usar el servicio de correo de Hostinger con los registros MX, SPF, DKIM y DMARC correctamente aplicados, garantizando envío y recepción de correos, autenticación y buena entregabilidad.  
(Referencia: Guía oficial “Set up a domain for Hostinger Email manually”) :contentReference[oaicite:1]{index=1}

---

## 🧩 Registros DNS aplicados

| Tipo                                     | Nombre                       | Contenido / Valor                                                                                                   | Estado |
| ---------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------ |
| **MX**                                   | `@`                          | `mx1.hostinger.com` (Prioridad 5)                                                                                   | ✓      |
| **MX**                                   | `@`                          | `mx2.hostinger.com` (Prioridad 10)                                                                                  | ✓      |
| **TXT (Verificación dominio)**           | `@`                          | `d3764efbfedcc69f78b2eefd6957b2cc`                                                                                  | ✓      |
| **TXT (SPF raiz)**                       | `@`                          | `v=spf1 include:_spf.mail.hostinger.com ~all`                                                                       | ✓      |
| **TXT (SPF adicional / envíos por SES)** | `send`                       | `v=spf1 include:_spf.mail.hostinger.com include:amazonses.com ~all`                                                 | ✓      |
| **TXT (DMARC)**                          | `_dmarc`                     | `v=DMARC1; p=quarantine; rua=mailto:postmaster@lumiloops.com; ruf=mailto:postmaster@lumiloops.com; adkim=s; aspf=s` | ✓      |
| **CNAME (DKIM-a)**                       | `hostingermail-a._domainkey` | `hostingermail-a.dkim.mail.hostinger.com`                                                                           | ✓      |
| **CNAME (DKIM-b)**                       | `hostingermail-b._domainkey` | `hostingermail-b.dkim.mail.hostinger.com`                                                                           | ✓      |
| **CNAME (DKIM-c)**                       | `hostingermail-c._domainkey` | `hostingermail-c.dkim.mail.hostinger.com`                                                                           | ✓      |
| **CNAME (Autoconfig)**                   | `autoconfig`                 | `autoconfig.mail.hostinger.com`                                                                                     | ✓      |
| **CNAME (Autodiscover)**                 | `autodiscover`               | `autodiscover.mail.hostinger.com`                                                                                   | ✓      |

---

## ✅ Estado actual e instrucciones

- Todos los registros relevantes (MX, DKIM, DMARC, verificación dominio) ya están aplicados y propagados.
- Se añadió el registro SPF en la raíz (`@`) como lo requería Hostinger, por lo que el indicador de **SPF** debería cambiar en el panel de Hostinger a verde (✓).
- Ahora solo queda esperar la propagación completa (normalmente 30-60 min, hasta 24 h) y luego ir al panel de Hostinger: _Emails → lumiloops.com → Overview_ y confirmar el cambio.
- Una vez confirmé, podrás acceder al buzón vía: [https://webmail.hostinger.com](https://webmail.hostinger.com) usando tu cuenta (`usuario@lumiloops.com`) y contraseña.

---

## 🎯 Buenas prácticas y próximos pasos

- Verifica que no existan **registros MX antiguos** que puedan interferir. Solo deben estar los dos de Hostinger.
- No dupliques registros SPF en `@`. Si tienes varios, **combínalos** en uno solo (como hiciste). :contentReference[oaicite:2]{index=2}
- Mantén los proxies de Cloudflare en **DNS only** para todos los registros de correo (MX, CNAME DKIM, autoconfig/autodiscover) para evitar problemas de entrega.
- Después de 24 h, haz una prueba de envío/recepción de correo para confirmar que funciona sin errores.
- Guarda esta guía en tu documentación interna (Notion, repo, etc.) para referencia futura al migrar dominio o cambiar configuraciones.

---

Si quieres, puedo generar **una versión imprimible (PDF)** de este documento y subirla a tu carpeta de documentación para que la tengas archivada. ¿Te preparo ese PDF también?
::contentReference[oaicite:3]{index=3}
