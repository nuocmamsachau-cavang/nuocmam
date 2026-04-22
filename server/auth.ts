import crypto from 'crypto';

/**
 * Simple password hashing using PBKDF2 (no external dependency)
 * In production, consider using bcrypt or argon2
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hash: string): boolean {
  const [salt, storedHash] = hash.split(':');
  if (!salt || !storedHash) return false;
  
  const computedHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return computedHash === storedHash;
}

/**
 * Generate a simple JWT-like token for admin session
 * In production, use proper JWT library
 */
export function generateAdminToken(adminId: number): string {
  const payload = {
    adminId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 7, // 7 days
  };
  
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'secret')
    .update(`${header}.${body}`)
    .digest('base64url');
  
  return `${header}.${body}.${signature}`;
}

export function verifyAdminToken(token: string): { adminId: number } | null {
  try {
    const [header, body, signature] = token.split('.');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.JWT_SECRET || 'secret')
      .update(`${header}.${body}`)
      .digest('base64url');
    
    if (signature !== expectedSignature) return null;
    
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    
    return { adminId: payload.adminId };
  } catch {
    return null;
  }
}
