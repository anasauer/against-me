# Guía de Publicación

Esta aplicación está configurada para ser desplegada en Firebase App Hosting.

## ¿Por qué se necesita una cuenta de facturación?

Es una duda muy válida. Tu proyecto utiliza funciones de Inteligencia Artificial a través de Genkit, las cuales dependen de servicios avanzados de Google Cloud. Para habilitar estas funciones, tu proyecto de Firebase debe estar en el **plan Blaze (pago por uso)**.

**¡Importante! Esto no significa que empezarás a pagar inmediatamente.**

*   **Capa gratuita incluida:** El plan Blaze incluye la misma capa gratuita generosa que el plan gratuito (Spark). Para una aplicación como esta, es muy probable que tu uso se mantenga dentro de los límites gratuitos durante mucho tiempo, por lo que no tendrías costos.
*   **Requisito para escalar:** Vincular una cuenta de facturación es el requisito para poder superar la capa gratuita si tu app crece mucho en el futuro y para usar servicios avanzados como las APIs de IA.
*   **Tú tienes el control:** La facturación se gestiona en tu cuenta de Google Cloud. Puedes y deberías configurar **alertas de presupuesto** para recibir notificaciones y evitar cualquier costo inesperado. Firebase Studio no almacena ni gestiona tu información de facturación.

## Proceso de Publicación

Para publicar tu aplicación, necesitas tener la [Firebase CLI](https://firebase.google.com/docs/cli) instalada y configurada.

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

Puedes continuar haciendo cambios en tu aplicación usando Firebase Studio. Una vez que hayas terminado y quieras actualizar la versión pública, simplemente repite los pasos 2 y 3.