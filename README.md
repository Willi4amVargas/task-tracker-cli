# 🚀 Task Tracker CLI

Una herramienta de línea de comandos sencilla y eficiente para gestionar tus tareas diarias, construida con **Node.js** y **TypeScript**, sin dependencias externas.

## 🛠️ Instalación

Puedes instalar esta herramienta de forma local para usar el comando `task-cli` en tu terminal:

```bash
# Clonar el repositorio
git clone https://github.com/Willi4amVargas/task-tracker-cli
cd task-tracker-cli

# Instalar typescript
npm install

# Instalar globalmente en tu sistema
npm install -g ./

```

## 💻 Uso Sugerido

La aplicación utiliza argumentos posicionales para gestionar las tareas. Los datos se almacenan automáticamente en un archivo `data.json`

### Gestión de Tareas

| Acción | Comando |
| --- | --- |
| **Añadir** | `task-cli add "Comprar leche"` |
| **Actualizar** | `task-cli update 1 "Comprar leche y pan"` |
| **Eliminar** | `task-cli delete 1` |

### Estados de Tarea

Puedes cambiar el progreso de tus tareas rápidamente:

* `task-cli mark-in-progress <id>`
* `task-cli mark-done <id>`

### Listado y Filtros

* **Ver todas:** `task-cli list`
* **Por estado:** 
    * `task-cli list todo`
    * `task-cli list in-progress`
    * `task-cli list done`


## 📋 Estructura de Datos

Cada tarea se guarda con la siguiente estructura en el archivo JSON:

```json
{
  "id": 1,
  "description": "Ejemplo de tarea",
  "status": "todo",
  "createdAt": "2026-02-11T17:00:00.000Z",
  "updatedAt": "2026-02-11T17:05:00.000Z"
}

```


## 🛠️ Desarrollo

### Requisitos

* Node.js 22.22.0
* npm

### Ejecutar Tests

Este proyecto utiliza el test runner nativo de Node.js:

```bash
npm test

```

## 📜 Licencia

Este proyecto es de código abierto bajo la licencia MIT.