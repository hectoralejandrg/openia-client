import 'dotenv/config';

// TODO: Move to .env file

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const MCP_SERVER_COMMAND = process.env.MCP_SERVER_COMMAND!;
const MCP_SERVER_ARGS = JSON.parse(process.env.MCP_SERVER_ARGS || "[]")!;
const DEBUG = process.env.DEBUG === "true";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "http://localhost:8080";
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID!;
const FIREBASE_PRIVATE_KEY_ID = process.env.FIREBASE_PRIVATE_KEY_ID!;
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY!;
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL!;
const PORT = process.env.PORT!;

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

if (!MCP_SERVER_COMMAND) {
  throw new Error("MCP_SERVER_COMMAND is not set");
}

if (!MCP_SERVER_ARGS) {
  throw new Error("MCP_SERVER_ARGS is not set");
}

export {
  OPENAI_API_KEY,
  MCP_SERVER_COMMAND,
  MCP_SERVER_ARGS,
  DEBUG,
  OPENAI_MODEL,
  MCP_SERVER_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  PORT,
};
