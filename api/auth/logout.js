import {
  getSessionToken,
  deleteSession,
  clearSessionCookie,
} from "../_lib/auth.js";

export default async function handler(request, response) { 
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({
      message: "Método não permitido.",
    });
  }

  try {
    const token = getSessionToken(request);

    if (token) {
      await deleteSession(token);
    }

    clearSessionCookie(response);

    return response.status(200).json({
      success: true,
      message: "Logout realizado com sucesso.",
    });
  } catch (error) {
    console.error("VORTEX logout error:", error);

    // Mesmo se houver erro no banco, removemos o cookie do navegador.
    clearSessionCookie(response);

    return response.status(200).json({
      success: true,
      message: "Logout realizado.",
    });
  }
}