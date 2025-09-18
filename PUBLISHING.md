# Guía de Publicación

Esta aplicación está configurada para ser desplegada en Firebase App Hosting.

## Proceso de Publicación

Para publicar tu aplicación, necesitas tener la [Firebase CLI](https://firebase.google.com/docs/cli) instalada y configurada en tu ordenador. Como hemos eliminado las funciones de IA que requerían un plan de pago, puedes desplegar tu proyecto de forma segura en el **plan gratuito de Firebase (Spark)**.

Sigue estos pasos desde tu terminal:

1.  **Inicia sesión en Firebase:**
    Si es la primera vez que usas la CLI, necesitarás iniciar sesión en tu cuenta de Google.
    ```bash
    firebase login
    ```

2.  **Construye tu aplicación para producción:**
    Este comando creará una versión optimizada de tu aplicación en la carpeta `.next`, que es lo que se subirá a Firebase.
    ```bash
    npm run build
    ```

3.  **Despliega en Firebase Hosting:**
    Este comando subirá los archivos de tu aplicación a los servidores de Firebase y la hará pública.
    ```bash
    firebase deploy
    ```

Una vez finalizado, la CLI te proporcionará la URL donde tu aplicación estará disponible públicamente (por ejemplo, `https://tu-proyecto.web.app`).

## Realizar más modificaciones

Puedes continuar haciendo cambios en tu aplicación usando Firebase Studio. Una vez que hayas terminado y quieras actualizar la versión pública, simplemente repite los pasos 2 y 3.
