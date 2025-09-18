# Guía de Publicación

Esta aplicación está configurada para ser desplegada en Firebase App Hosting.

## Proceso de Publicación

Para publicar tu aplicación, necesitas tener la [Firebase CLI](https://firebase.google.com/docs/cli) instalada y configurada en tu máquina local.

Una vez que tengas la CLI lista, sigue estos pasos desde la terminal en el directorio de tu proyecto:

1.  **Inicia sesión en Firebase:**
    ```bash
    firebase login
    ```

2.  **Construye tu aplicación para producción:**
    Este comando creará una versión optimizada de tu aplicación en la carpeta `.next`.
    ```bash
    npm run build
    ```

3.  **Despliega en Firebase Hosting:**
    Este comando subirá los archivos de tu aplicación a los servidores de Firebase y la hará pública.
    ```bash
    firebase deploy
    ```

La CLI te proporcionará la URL donde tu aplicación estará disponible públicamente.

## Realizar más modificaciones

Puedes continuar haciendo cambios en tu aplicación usando Firebase Studio. Una vez que hayas terminado de hacer tus modificaciones y quieras actualizarlas en la versión pública, simplemente repite los pasos 2 y 3 de esta guía.
