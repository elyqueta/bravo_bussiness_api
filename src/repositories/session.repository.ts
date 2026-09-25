import { query } from '../database/pool';

export interface Session {
  id: string;
  userId: string;
  tokenHash: string;
  device: string | null;
  ip: string | null;
  expiresAt: Date;
  createdAt: Date;
}

export interface CreateSessionData {
  userId: string;
  tokenHash: string;
  device?: string | null;
  ip?: string | null;
  expiresAt: Date;
}

export interface SessionRepository {
  create(data: CreateSessionData): Promise<Session>;
  findByTokenHash(tokenHash: string): Promise<Session | null>;
  remove(id: string): Promise<boolean>;
  removeAllByUserId(userId: string): Promise<void>;
}

function toSession(row: {
  id: string;
  user_id: string;
  token_hash: string;
  device: string | null;
  ip: string | null;
  expires_at: Date;
  created_at: Date;
}): Session {
  return {
    id: row.id,
    userId: row.user_id,
    tokenHash: row.token_hash,
    device: row.device,
    ip: row.ip,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
  };
}

async function create(data: CreateSessionData): Promise<Session> {
  const result = await query<{
    id: string;
    user_id: string;
    token_hash: string;
    device: string | null;
    ip: string | null;
    expires_at: Date;
    created_at: Date;
  }>(
    `INSERT INTO sessions (user_id, token_hash, device, ip, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, token_hash, device, ip, expires_at, created_at`,
    [data.userId, data.tokenHash, data.device ?? null, data.ip ?? null, data.expiresAt]
  );

  const row = result.rows[0];

  if (!row) {
    throw new Error('Falha ao criar sessão: nenhuma linha retornada.');
  }

  return toSession(row);
}

async function findByTokenHash(tokenHash: string): Promise<Session | null> {
  const result = await query<{
    id: string;
    user_id: string;
    token_hash: string;
    device: string | null;
    ip: string | null;
    expires_at: Date;
    created_at: Date;
  }>(
    `SELECT id, user_id, token_hash, device, ip, expires_at, created_at
     FROM sessions
     WHERE token_hash = $1`,
    [tokenHash]
  );

  const row = result.rows[0];
  return row ? toSession(row) : null;
}

async function remove(id: string): Promise<boolean> {
  const result = await query('DELETE FROM sessions WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

async function removeAllByUserId(userId: string): Promise<void> {
  await query('DELETE FROM sessions WHERE user_id = $1', [userId]);
}

export const sessionRepository: SessionRepository = {
  create,
  findByTokenHash,
  remove,
  removeAllByUserId,
};
