# OpenAI MCP Client

This project is an OpenAI-based client application designed to interact with users through a conversational interface. It leverages OpenAI's API to process and respond to user inputs, and it integrates with Firebase Firestore to manage conversation histories.

## Project Structure

- **src/index.ts**: The main entry point of the application. It sets up the Express server and handles incoming API requests.
- **src/messages.ts**: Manages message handling, including loading, storing, and processing messages.
- **src/server.ts**: Configures and starts the Express server, defining API endpoints for health checks and message processing.
- **src/cli.ts**: Provides command-line interface utilities for interacting with the application.
- **src/services/conversationService.ts**: Handles interactions with Firebase Firestore, managing conversation histories and message storage.
- **src/types/types.ts**: Defines TypeScript types used throughout the application, ensuring type safety and consistency.
- **src/env.ts**: Manages environment variables and configuration settings.
- **src/client.ts**: Initializes and configures the OpenAI client.
- **src/openai-utils.ts**: Contains utility functions for interacting with the OpenAI API.
- **src/prompts.ts**: Stores system prompts used in conversations.

## Features

- **Conversational Interface**: Interact with users through a chat-like interface, processing inputs and generating responses using OpenAI's API.
- **Firestore Integration**: Store and retrieve conversation histories using Firebase Firestore, ensuring persistence and continuity.
- **Tool and Function Calls**: Integrate external tools and functions into conversations, enhancing capabilities and automating tasks.
- **Express Server**: Serve the application through an Express server, handling API requests and managing sessions.

## Setup and Installation

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd openai-mcp-client
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Set up your `.env` file with necessary environment variables, including OpenAI API keys and Firebase configuration.

4. **Run the Application**:
   ```bash
   npm run dev
   ```

## Usage

- **API Endpoints**:
  - `/api/input`: Accepts user input and processes it through the OpenAI API.
  - `/health`: Returns the health status of the server.

- **Command-Line Interface**: Use the CLI to interact with the application directly from the terminal.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.

This README provides an overview of the project, its structure, features, and setup instructions. Adjust the content as needed to fit any additional details or specific instructions relevant to your project.
