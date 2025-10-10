# Next.js Starter for Firebase Studio

This is a Next.js starter project designed to be used within Firebase Studio.

## Initial Setup: Authorizing Your Domain

**This is a required step to enable login.**

To allow Firebase Authentication to work in your development environment, you must add your unique app domain to the list of authorized domains in your Firebase project.

1.  **Find your app's domain:**
    Run the following command in the terminal to display the exact domain you need to authorize.

    ```bash
    npm run show-domain
    ```

2.  **Authorize the domain in Firebase:**
    *   Copy the domain provided by the command (it will look like `https://[...].web.app`).
    *   Go to the [Firebase Console](https://console.firebase.google.com/).
    *   Select your project.
    *   Navigate to **Authentication** > **Settings** > **Authorized domains**.
    *   Click **Add domain** and paste the domain you copied.

After adding the domain, wait a minute, then refresh your app. The login should now work correctly.

## Getting Started

To get started with coding, take a look at `src/app/page.tsx`.
