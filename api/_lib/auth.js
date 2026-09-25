import crypto from "node:crypto";
import { getDb } from "./db.js";

const SESSION_DURATION_DAYS = 30;

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!storedHash || !storedHash.includes(":")) {
    return false;
  }

  const [salt, originalHash] = storedHash.split(":");

  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  const originalBuffer = Buffer.from(originalHash, "hex");
  const hashBuffer = Buffer.from(hash, "hex");

  if (originalBuffer.length !== hashBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(originalBuffer, hashBuffer);
}

export function generateSessionToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashSessionToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function createSession(userId) {
  const sql = getDb();

  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);

  const expiresAt = new Date(
    Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000
  );

  await sql`
    INSERT INTO sessions (
      user_id,
      token_hash,
      expires_at
    )
    VALUES (
      ${userId},
      ${tokenHash},
      ${expiresAt.toISOString()}
    )
  `;

  return {
    token,
    expiresAt,
  };
}

export async function getUserFromSession(token) {
  if (!token) {
    return null;
  }

  const sql = getDb();
  const tokenHash = hashSessionToken(token);

  const rows = await sql`
    SELECT
      users.id,
      users.name,
      users.email,
      users.avatar_url,
      users.email_verified
    FROM sessions
    INNER JOIN users
      ON users.id = sessions.user_id
    WHERE sessions.token_hash = ${tokenHash}
      AND sessions.expires_at > NOW()
    LIMIT 1
  `;

  if (rows.length === 0) {
    return null;
  }

  await sql`
    UPDATE sessions
    SET last_used_at = NOW()
    WHERE token_hash = ${tokenHash}
  `;

  return rows[0];
}

export async function deleteSession(token) {
  if (!token) {
    return;
  }

  const sql = getDb();
  const tokenHash = hashSessionToken(token);

  await sql`
    DELETE FROM sessions
    WHERE token_hash = ${tokenHash}
  `;
}

export function setSessionCookie(response, token, expiresAt) {
  const maxAge = Math.max(
    0,
    Math.floor((expiresAt.getTime() - Date.now()) / 1000)
  );

  response.setHeader(
    "Set-Cookie",
    [
      `vortex_session=${token}`,
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      `Max-Age=${maxAge}`,
      process.env.NODE_ENV === "production" ? "Secure" : "",
    ]
      .filter(Boolean)
      .join("; ")
  );
}

export function clearSessionCookie(response) {
  response.setHeader(
    "Set-Cookie",
    [
      "vortex_session=",
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      "Max-Age=0",
      process.env.NODE_ENV === "production" ? "Secure" : "",
    ]
      .filter(Boolean)
      .join("; ")
  );
}

export function getSessionToken(request) {
  const cookieHeader = request.headers.cookie || "";

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());

  const sessionCookie = cookies.find((cookie) =>
    cookie.startsWith("vortex_session=")
  );

  if (!sessionCookie) {
    return null;
  }

  return decodeURIComponent(
    sessionCookie.substring("vortex_session=".length)
  );
}