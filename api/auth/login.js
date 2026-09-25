import { getDb } from "../_lib/db.js";
import {
  verifyPassword,
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
    const { email, password } = request.body || {};

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return response.status(400).json({
        message: "Informe seu e-mail e sua senha.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      return response.status(400).json({
        message: "Informe seu e-mail e sua senha.",
      });
    }

    const sql = getDb();

    const users = await sql`
      SELECT
        id,
        name,
        email,
        password_hash,
        avatar_url,
        email_verified
      FROM users
      WHERE LOWER(email) = ${cleanEmail}
      LIMIT 1
    `;

    if (users.length === 0) {
      return response.status(401).json({
        message: "E-mail ou senha incorretos.",
      });
    }

    const user = users[0];

    if (!user.password_hash) {
      return response.status(401).json({
        message: "Esta conta utiliza outro método de login.",
      });
    }

    const passwordIsValid = verifyPassword(
      password,
      user.password_hash
    );

    if (!passwordIsValid) {
      return response.status(401).json({
        message: "E-mail ou senha incorretos.",
      });
    }

    const session = await createSession(user.id);

    setSessionCookie(
      response,
      session.token,
      session.expiresAt
    );

    return response.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        email_verified: user.email_verified,
      },
    });
  } catch (error) {
    console.error("VORTEX login error:", error);

    return response.status(500).json({
      message: "Não foi possível entrar na sua conta.",
    });
  }
}