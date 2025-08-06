import { ServiceAccount } from "firebase-admin";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import "dotenv/config";

// Configura tu proyecto de Firebase aquí:

async function main() {
  const app = initializeApp({
    credential: cert({
      type: process.env.FIREBASE_TYPE,
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    } as ServiceAccount),
  });
  const auth = getAuth(app);

  try {
    const customToken = await auth.createCustomToken('ABu0AuP8gjbJboBoxZJVdqrZPiy2', {})
    
    console.log("ID Token:", customToken);
  } catch (error: any) {
    console.error("Error al iniciar sesión:", error.message);
  }
}

main();
