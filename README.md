# OpenAI MCP Client

Este proyecto es una aplicación cliente basada en OpenAI, diseñada para interactuar con los usuarios mediante una interfaz conversacional. Utiliza la API de OpenAI para procesar y responder a las entradas de los usuarios y se integra con Firebase Firestore para gestionar el historial de conversaciones.

## Features

- **Interfaz conversacional**: Interactúe con los usuarios mediante una interfaz similar a un chat, procesando entradas y generando respuestas mediante la API de OpenAI.
- **Integración con Firestore**: Almacene y recupere historiales de conversaciones mediante Firestore de Firebase, lo que garantiza la persistencia y la continuidad.
- **Llamadas a herramientas y funciones**: Integre herramientas y funciones externas en las conversaciones, optimizando las capacidades y automatizando tareas.
- **Servidor Express**: Sirva la aplicación a través de un servidor Express, gestionando las solicitudes de API y las sesiones.

## Setup and Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd openai-
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
  Configure su archivo `.env` con las variables de entorno necesarias, incluidas las claves de API de OpenAI y la configuración de Firebase.

4. **Run the Application**:
   ```bash
   npm run dev
   ```

## Usage

- **API Endpoints**:
  - `/api/input`: Acepta la entrada del usuario y la procesa a través de la API OpenAI.
