import { Request, Response, NextFunction } from "express";
import { auth } from "./firebase";

// Extiende la interfaz Request para incluir 'user'
declare global {
  namespace Express {
    interface Request {
      token?: String;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("Token no proporcionado");
    }

    const idToken = authHeader.split("Bearer ")[1];
    await auth.verifyIdToken(idToken);

    req.token = idToken; // Agrega la información del usuario al request
    next();
  } catch (error) {
    // Manejar diferentes tipos de errores
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    const statusCode =
      error instanceof Error && error.message.includes("token expired")
        ? 401
        : 403;

    res.status(statusCode).json({
      error: "Acceso no autorizado",
      details: errorMessage,
    });
  }
};
