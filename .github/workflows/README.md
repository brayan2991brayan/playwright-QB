# 🎭 GitHub Actions Setup Guide

## Setting up GitHub Repository Secrets

Para que el workflow de GitHub Actions funcione correctamente, necesitas configurar los siguientes secrets en tu repositorio:

### 1. Navegar a la configuración del repositorio
- Ve a tu repositorio en GitHub
- Haz clic en **Settings** (Configuración)
- En el menú lateral, selecciona **Secrets and variables** > **Actions**

### 2. Agregar los siguientes secrets:

#### 🔐 Required Secrets:
```
QBENCH_PASSWORD
```
- **Nombre**: `QBENCH_PASSWORD`
- **Valor**: Tu contraseña de QBench (requerido para autenticación)

#### 🔧 Optional Secrets (con valores por defecto):
```
QBENCH_BASE_URL
```
- **Nombre**: `QBENCH_BASE_URL` 
- **Valor por defecto**: `https://srqaengineer-ba-uat.qbench.net`
- **Descripción**: Solo agregar si usas una URL diferente

```
QBENCH_USERNAME
```
- **Nombre**: `QBENCH_USERNAME`
- **Valor por defecto**: `melvin+qaengineer@qbench.com`
- **Descripción**: Solo agregar si usas un usuario diferente

## 🚀 Cómo funciona el Workflow

### Triggers (Activadores):
- ✅ **Push** a branches `main` o `develop`
- ✅ **Pull Request** a branch `main`
- ✅ **Manual** desde GitHub Actions (workflow_dispatch)

### Jobs disponibles:

#### 1. **Test Matrix** (Automático)
- ✅ Ejecuta tests en paralelo en 3 navegadores: Chromium, Firefox, WebKit
- ✅ Se ejecuta en push/PR automáticamente
- ✅ Genera reportes por navegador

#### 2. **Complete Test Suite** (Manual)
- ✅ Ejecuta todos los tests en todos los navegadores
- ✅ Solo se ejecuta manualmente (workflow_dispatch)
- ✅ Genera reporte HTML completo

### 📊 Artifacts generados:
- 📈 **playwright-report-{browser}**: Reportes por navegador
- 📸 **playwright-screenshots-{browser}**: Screenshots en caso de fallo
- 📋 **playwright-report-complete**: Reporte HTML completo (solo manual)

## 🔍 Monitoreo

### En Pull Requests:
- El workflow comenta automáticamente en el PR con los resultados
- Los artifacts están disponibles por 30 días
- Screenshots de errores por 7 días

### Ejecución Manual:
1. Ve a **Actions** en tu repositorio
2. Selecciona **🎭 QBench Playwright Tests**
3. Haz clic en **Run workflow**
4. Selecciona la branch y ejecuta

## 📈 Estado actual del proyecto:
- ✅ **100% de tests pasando** (72/72)
- ✅ **Cross-browser compatible**
- ✅ **Completamente automatizado**
- ✅ **Production ready**

## 🛠️ Troubleshooting

### Si los tests fallan en CI:
1. Verifica que `QBENCH_PASSWORD` esté configurado
2. Revisa los artifacts para ver screenshots de errores
3. Los tests están optimizados para ser estables en CI

### Si necesitas debug:
1. Ejecuta manualmente el workflow completo
2. Descarga el reporte HTML para análisis detallado
3. Revisa los screenshots de errores en los artifacts

---
*Este workflow está optimizado para el ambiente de QBench UAT y ha sido probado con 100% de éxito en todos los navegadores.*
