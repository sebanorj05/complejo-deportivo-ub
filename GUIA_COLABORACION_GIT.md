# 🤝 Guía Práctica de Git y GitHub para el Equipo
### Proyecto: Complejo Deportivo UB (TP1 - Construcción de Software)

Esta guía está diseñada paso a paso para que cualquier miembro del equipo, aunque no tenga experiencia previa con Git o GitHub, pueda clonar el proyecto, trabajar sin romper nada y enviar sus cambios de forma ordenada.

---

## 📌 Conceptos Básicos en 1 Minuto

* **Repositorio (Repo):** La carpeta del proyecto guardada en la nube (GitHub).
* **Clonar (`git clone`):** Descargar una copia idéntica del repositorio a tu computadora por primera vez.
* **Rama (`branch`):** Una línea de trabajo paralela. Trabajamos en ramas para no pisar el código de los demás ni romper la rama principal (`main`).
* **Commit (`git commit`):** Una "foto" o guardado de los cambios que hiciste, con un mensaje que explica qué cambiaste.
* **Push (`git push`):** Enviar tus commits locales a GitHub para que los demás los vean.
* **Pull (`git pull`):** Traer a tu computadora los cambios más recientes que otros subieron a GitHub.
* **Pull Request (PR):** Una solicitud formal en GitHub para pedir que tus cambios de una rama se unan a la rama principal (`main`).

---

## 🛠️ Parte 1: Lo que debe hacer el Dueño del Repositorio (Seba)

Para que tus compañeros puedan subir ramas sin problemas de permisos:

1. Entrá a tu repositorio en GitHub: [https://github.com/sebanorj05/complejo-deportivo-ub](https://github.com/sebanorj05/complejo-deportivo-ub).
2. Hacé clic en la pestaña **Settings** ⚙️ arriba a la derecha.
3. En el menú de la izquierda, hacé clic en **Collaborators** (en la sección *Access*).
4. Hacé clic en el botón verde **Add people**.
5. Escribí el usuario de GitHub o el correo de cada uno de tus compañeros y enviales la invitación.
6. **Tus compañeros deben aceptar la invitación** desde su correo electrónico o desde las notificaciones de su cuenta de GitHub.

---

## 💻 Parte 2: Configuración Inicial en la PC de cada Compañero (Sólo se hace 1 vez)

### 1. Programas necesarios instalados
* **Git:** Descargar e instalar desde [https://git-scm.com](https://git-scm.com) (dejar todas las opciones por defecto del instalador).
* **Node.js (versión 20 o superior):** Descargar e instalar la versión LTS desde [https://nodejs.org](https://nodejs.org).
* **Editor de código:** Recomendado **Visual Studio Code** ([https://code.visualstudio.com](https://code.visualstudio.com)).

### 2. Identificarse en Git (en la terminal / PowerShell)
Abrí la terminal de tu computadora y ejecutá:
```bash
git config --global user.name "Tu Nombre y Apellido"
git config --global user.email "tu-email-de-github@ejemplo.com"
```

---

## 📥 Parte 3: Descargar y Levantar el Proyecto por Primera Vez

Abrí una terminal (PowerShell o Git Bash) en la carpeta donde guardás tus proyectos de la facultad (por ejemplo en `Documentos` o `Desktop`):

```bash
# 1. Clonar el repositorio
git clone https://github.com/sebanorj05/complejo-deportivo-ub.git

# 2. Entrar a la carpeta del proyecto
cd complejo-deportivo-ub

# 3. Instalar las dependencias de la raíz
npm install

# 4. Entrar a la carpeta frontend e instalar sus librerías
cd frontend
npm install

# 5. Iniciar la aplicación en modo desarrollo
npm run dev
```

Una vez que diga `Local: http://localhost:5173/`, abrís ese enlace en tu navegador y ya vas a ver el sistema funcionando.

---

## 🚀 Parte 4: Flujo de Trabajo Diario (El paso a paso para hacer cambios)

> [!IMPORTANT]
> **REGLA DE ORO DEL EQUIPO:**  
> **NUNCA** trabajes ni hagas `commit` directamente sobre la rama `main`. Siempre creá una rama para tu tarea.

### Paso 4.1: Antes de empezar a programar, actualizarte con lo último
Antes de escribir cualquier línea de código, asegurate de tener lo último que hayan subido tus compañeros:

```bash
# Asegurate de estar en la rama main
git checkout main

# Descargá lo más nuevo de GitHub
git pull origin main
```

---

### Paso 4.2: Crear una rama propia para tu tarea
Creá una rama con un nombre claro que describa lo que vas a hacer:

```bash
# Ejemplo: si vas a ajustar estilos de las tarjetas de canchas
git checkout -b feature/estilos-tarjetas-canchas

# O si vas a arreglar un bug:
git checkout -b fix/error-modal-reserva
```
*(El comando `checkout -b` crea la rama y te posiciona dentro de ella).*

---

### Paso 4.3: Hacé tus cambios y probalos
Modificá los archivos en VS Code y verificá en `http://localhost:5173` que todo funcione correctamente.

---

### Paso 4.4: Guardar los cambios (Commit)
Cuando tu cambio esté listo y funcionando:

```bash
# 1. Ver qué archivos modificaste
git status

# 2. Agregar todos los archivos modificados
git add .

# 3. Guardar el commit con un mensaje claro
git commit -m "feat: mejorar diseño visual de tarjetas de canchas y turnos"
```

---

### Paso 4.5: Subir tu rama a GitHub (Push)
Subí tu rama local a GitHub:

```bash
# Subir la rama con el mismo nombre que creaste
git push -u origin feature/estilos-tarjetas-canchas
```

*(Si es la primera vez que hacés push, GitHub puede abrirte una ventanita en el navegador para iniciar sesión y autorizar a Git. Solo le das a "Sign in with your browser" y confirmás).*

---

## 🔀 Parte 5: Crear el Pull Request (PR) y Unir los Cambios a `main`

1. Entrá al repositorio en GitHub: [https://github.com/sebanorj05/complejo-deportivo-ub](https://github.com/sebanorj05/complejo-deportivo-ub).
2. Vas a ver un banner amarillo arriba que dice:  
   **`feature/tu-rama had recent pushes...`** con un botón verde que dice **"Compare & pull request"**. Hacé clic en ese botón.
3. Escribí un título claro y una breve descripción de lo que agregaste o arreglaste.
4. Hacé clic en el botón verde **"Create pull request"**.
5. Avisale a tus compañeros (por WhatsApp/Discord) que abriste un PR.
6. El dueño del repo o cualquiera de los colaboradores puede revisar el código y hacer clic en **"Merge pull request"** y luego en **"Confirm merge"**.
7. ¡Listo! Tus cambios ya forman parte oficial de la rama `main`.

---

## 🔄 Parte 6: ¿Qué hago después de que mi PR fue aprobado y unido?

Una vez que tu rama se unió a `main`, volvés a tu terminal para prepararte para la siguiente tarea:

```bash
# 1. Volver a la rama main
git checkout main

# 2. Traer a tu máquina local los cambios recién unidos
git pull origin main

# 3. (Opcional) Borrar la rama vieja de tu máquina ya que ya se unió
git branch -d feature/estilos-tarjetas-canchas
```

Y para la próxima tarea, volvés al **Paso 4.2** creando una rama nueva.

---

## 🧭 Resumen de Comandos Más Usados (Machete Rápido)

| Qué quiero hacer | Comando |
| :--- | :--- |
| **Saber en qué rama estoy y qué toqué** | `git status` |
| **Ver todas las ramas locales** | `git branch` |
| **Actualizar mi rama main con lo de GitHub** | `git checkout main` luego `git pull origin main` |
| **Crear una rama nueva y pasarme a ella** | `git checkout -b feature/nombre-tarea` |
| **Cambiarme a una rama existente** | `git checkout nombre-rama` |
| **Guardar mis cambios** | `git add .` luego `git commit -m "explicación"` |
| **Subir mi rama a GitHub** | `git push -u origin feature/nombre-tarea` |

---

## 🛡️ Buenas Prácticas para Evitar Dolores de Cabeza

1. **Hacé commits chicos y frecuentes:** Es mucho más fácil entender y arreglar 5 commits pequeños que uno gigante con 40 archivos cambiados.
2. **Coordinen qué archivo toca cada uno:** Si dos personas editan las mismas líneas del mismo archivo al mismo tiempo, Git va a pedir resolver un conflicto. Es mejor avisar: *"Yo voy a estar tocando `AdminCanchas.tsx`, vos agarrá `AdminTorneo.tsx`"*.
3. **Nunca subas carpetas pesadas:** La carpeta `node_modules` y `dist` ya están en el `.gitignore`. **Nunca** las fuerces a subirse.
4. **Si tenés dudas antes de hacer algo:** Preguntá en el grupo de WhatsApp antes de tirar comandos que no conozcas.
