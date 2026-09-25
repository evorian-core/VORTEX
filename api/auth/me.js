import {
  getSessionToken,
  getUserFromSession,
} from "../_lib/auth.js";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");

    return response.status(405).json({
      message: "Método não permitido.",
    });
  }

  try {
    const token = getSessionToken(request);

    if (!token) {
      return response.status(401).json({
        authenticated: false,
        message: "Usuário não autenticado.",
      });
    }

    const user = await getUserFromSession(token);

    if (!user) {
      return response.status(401).json({
        authenticated: false,
        message: "Sessão inválida ou expirada.",
      });
    }

    return response.status(200).json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        email_verified: user.email_verified,
      },
    });
  } catch (error) {
    console.error("VORTEX session verification error:", error);

    return response.status(500).json({
      authenticated: false,
      message: "Não foi possível verificar a sessão.",
    });
  }
}