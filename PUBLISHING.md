# Guía de Publicación

Esta aplicación está configurada para ser desplegada en Firebase Hosting.

## Proceso de Publicación

Para publicar tu aplicación, necesitas tener la [Firebase CLI](https://firebase.google.com/docs/cli) instalada y configurada en tu ordenador. Puedes desplegar tu proyecto de forma segura en el **plan gratuito de Firebase (Spark)**.

Sigue estos pasos desde tu terminal, **dentro de la carpeta de tu proyecto**:

1.  **Inicia sesión en Firebase:**
    Si es la primera vez que usas la CLI, necesitarás iniciar sesión en tu cuenta de Google. Si el comando normal no funciona, usa la segunda opción.
    ```bash
    npx firebase login
    ```
    O bien:
    ```bash
    npx firebase login --no-localhost
    ```

2.  **Construye tu aplicación para producción:**
    Este comando creará una versión optimizada de tu aplicación en la carpeta `.next`, que es lo que se subirá a Firebase.
    ```bash
    npm run build
    ```

3.  **Despliega en Firebase Hosting:**
    Este comando subirá los archivos de tu aplicación a los servidores de Firebase y la hará pública.
    ```bash
    npx firebase deploy --only hosting
    ```

Una vez finalizado, la CLI te proporcionará la URL donde tu aplicación estará disponible públicamente (por ejemplo, `https://tu-proyecto.web.app`).

## Realizar más modificaciones

Puedes continuar haciendo cambios en tu aplicación usando Firebase Studio. Una vez que hayas terminado y quieras actualizar la versión pública, simplemente repite los pasos 2 y 3.

## Desinstalar la Firebase CLI

Si en algún momento ya no necesitas la Firebase CLI en tu ordenador, puedes desinstalarla fácilmente ejecutando el siguiente comando en tu terminal:

```bash
npm uninstall -g firebase-tools
```
