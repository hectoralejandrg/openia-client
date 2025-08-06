import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import {
  StreamableHTTPClientTransport,
  StreamableHTTPClientTransportOptions,
} from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { MCP_SERVER_ARGS, MCP_SERVER_COMMAND, MCP_SERVER_URL } from "./env";

const transport = new StreamableHTTPClientTransport(new URL(MCP_SERVER_URL));

const mcpClient = new Client(
  {
    name: "example-client",
    version: "1.0.0",
  },
  {
    capabilities: {},
  }
);

const initClient = async (authToken: string) => {
  const transport = new StreamableHTTPClientTransport(new URL(MCP_SERVER_URL), {
    requestInit: {
      headers: {
        "Authorization": `Bearer ${authToken}`,
        "Content-Type": "application/json"
      }
    },
  } as StreamableHTTPClientTransportOptions);

  await mcpClient.connect(transport);
  return mcpClient;
};
//disconnect the client
const disconnectClient = async () => {
  await mcpClient.close();
  await transport.close();
};

export { mcpClient, initClient, disconnectClient };
