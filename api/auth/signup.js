import { getDb } from "../_lib/db.js";
import {
  hashPassword,
  createSession,
  setSessionCookie,
} from "../_lib/auth.js";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");

    return response.status(405).json({
      message: "Método não permitido.",
    });
  }

  try {
    const { name, email, password } = request.body || {};

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return response.status(400).json({
        message: "Preencha todos os campos.",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) {
      return response.status(400).json({
        message: "Digite um nome válido.",
      });
    }

    if (cleanName.length > 120) {
      return response.status(400).json({
        message: "O nome é muito longo.",
      });
    }

    if (cleanEmail.length < 3 || cleanEmail.length > 320) {
      return response.status(400).json({
        message: "Digite um e-mail válido.",
      });
    }

    if (password.length < 6) {
      return response.status(400).json({
        message: "A senha precisa ter pelo menos 6 caracteres.",
      });
    }

    if (password.length > 200) {
      return response.status(400).json({
        message: "A senha é muito longa.",
      });
    }

    const sql = getDb();

    const existingUsers = await sql`
      SELECT id
      FROM users
      WHERE LOWER(email) = ${cleanEmail}
      LIMIT 1
    `;

    if (existingUsers.length > 0) {
      return response.status(409).json({
        message: "Este e-mail já está cadastrado.",
      });
    }

    const passwordHash = hashPassword(password);

    const users = await sql`
      INSERT INTO users (
        name,
        email,
        password_hash
      )
      VALUES (
        ${cleanName},
        ${cleanEmail},
        ${passwordHash}
      )
      RETURNING
        id,
        name,
        email,
        avatar_url,
        email_verified
    `;

    const user = users[0];

    const session = await createSession(user.id);

    setSessionCookie(
      response,
      session.token,
      session.expiresAt
    );

    return response.status(201).json({
      user,
    });
  } catch (error) {
    console.error("VORTEX signup error:", error);

    return response.status(500).json({
      message: "Não foi possível criar sua conta.",
    });
  }
}