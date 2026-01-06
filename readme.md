# Control Captura v1.0 - Infraestructura Digital

Repositorio oficial para el despliegue de la plataforma logística de **clientedigital.me**.

## 🛠 Especificaciones Técnicas
* **Arquitectura de Layout:** Basada en CSS Grid (Z-pattern) para separación estricta de contenido y activos visuales.
* **Tipografía:** Implementación de Google Fonts (Archivo Black para títulos, Inter para cuerpo de texto).
* **Paleta de Colores:** Tema oscuro profesional con acento industrial (#ff5e14) y sombras de profundidad (vignette).
* **Imágenes:** Carga optimizada de activos industriales vía CDN de WordPress (Hostinger).

## 🚀 Flujo de Despliegue (VS Code a Producción)
Para subir cambios al sitio en vivo, utiliza los siguientes comandos en la terminal:

1. **Preparar cambios:**
   `git add .`

2. **Sellar versión:**
   `git commit -m "Descripción del ajuste realizado"`

3. **Lanzar al servidor:**
   `git push origin main`

## 🔗 Integraciones Externas
* **Hosting:** Hostinger (Despliegue automático vía GitHub).
* **Editor:** VS Code con soporte de Gemini Code Assist para refactorización.
* **Próxima Fase:** Conexión de Webhook vía n8n para el botón de "Solicitar Revisión Técnica".

---
© 2026 clientedigital.me | CDMX - México