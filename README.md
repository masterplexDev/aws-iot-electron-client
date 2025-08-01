# AWS IoT Electron Client

This is a desktop application built with Electron, React, TypeScript, and shadcn/ui for connecting to AWS IoT Core using certificate-based authentication and publishing MQTT messages.

## Features

- Connect to AWS IoT Core using Endpoint, Certificate, Private Key, and Root CA files.
- Publish MQTT messages to a specified topic with a JSON payload.
- Real-time logs for connection status and message publishing.
- Modern UI with shadcn/ui and Tailwind CSS.

## Setup

1.  **Clone the repository (or create the project manually as guided):**

    ```bash
    git clone <repository-url>
    cd aws-iot-electron-client
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Prepare your AWS IoT Core Certificates:**

    You will need the following files from your AWS IoT Core setup:
    -   `certificate.pem.crt`
    -   `private.pem.key`
    -   `root-CA.pem` (Amazon Root CA 1 or 3, depending on your region and setup)

    Make sure you have the correct paths to these files.

## Running the Application

To run the application in development mode:

```bash
npm run dev
```

This will start the Vite development server for the React frontend and then launch the Electron application. The Electron app will load the React app from the development server.

## Building the Application

To build the application for production:

```bash
npm run build
```

This will create a distributable package in the `release` directory (e.g., `.dmg` for macOS, `.exe` for Windows, `.AppImage` for Linux).

## Usage

1.  **Enter AWS IoT Endpoint:** Provide your AWS IoT Core endpoint (e.g., `xxxxxxxxxxxxxx.iot.us-east-1.amazonaws.com`).
2.  **Enter Certificate File Paths:** Provide the absolute paths to your `certificate.pem.crt`, `private.pem.key`, and `root-CA.pem` files.
3.  **Connect:** Click the "Connect" button. The status will change to "Connected" if successful, and logs will appear.
4.  **Publish Message:** Enter the desired MQTT Topic and a JSON Payload. Click the "Publish" button to send the message.
5.  **Disconnect:** Click the "Disconnect" button to close the MQTT connection.

## Troubleshooting

-   **`tailwindcss` command not found:** If you encounter issues with `tailwindcss` not being found during setup, ensure all `npm install` commands completed successfully. Sometimes, clearing `npm` cache (`npm cache clean --force`) and reinstalling dependencies (`rm -rf node_modules package-lock.json && npm install`) can resolve this.
-   **File Permissions:** Ensure the Electron application has read permissions for your certificate files.
-   **AWS IoT Core Policy:** Verify that your AWS IoT Core policy attached to your certificate grants the necessary `iot:Connect`, `iot:Publish`, `iot:Receive` permissions for the topics you are using.
