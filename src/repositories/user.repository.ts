import { query } from '../database/pool';
import { CreateUserData, User, UserRow, UserWithPasswordHash } from '../types/user.types';
import { ConflictError } from '../errors';

const PG_UNIQUE_VIOLATION = '23505';

function isPgError(err: unknown): err is { code: string } {
  return typeof err === 'object' && err !== null && 'code' in err;
}

function toUser(row: UserRow): User {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toUserWithPasswordHash(row: UserRow): UserWithPasswordHash {
  return {
    ...toUser(row),
    passwordHash: row.password_hash,
    failedAttempts: row.failed_attempts,
    lockedUntil: row.locked_until,
  };
}

async function create(data: CreateUserData): Promise<User> {
  try {
    const result = await query<UserRow>(
      `INSERT INTO users (full_name, email, password_hash, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, email, password_hash, phone, role,
                 status, created_at, updated_at`,
      [
        data.fullName,
        data.email,
        data.passwordHash,
        data.phone,
        data.role ?? 'admin',
      ]
    );

    return toUser(result.rows[0] as UserRow);
  } catch (err) {
    if (isPgError(err) && err.code === PG_UNIQUE_VIOLATION) {
      throw new ConflictError(`Já existe uma conta com o email "${data.email}".`);
    }
    throw err;
  }
}

async function findByEmail(email: string): Promise<UserWithPasswordHash | null> {
  const result = await query<UserRow>(
    `SELECT id, full_name, email, password_hash, phone, role,
            status, created_at, updated_at
     FROM users
     WHERE email = $1`,
    [email]
  );

  const row = result.rows[0];
  return row ? toUserWithPasswordHash(row) : null;
}

async function findById(id: string): Promise<User | null> {
  const result = await query<UserRow>(
    `SELECT id, full_name, email, password_hash, phone, role,
            status, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [id]
  );

  const row = result.rows[0];
  return row ? toUser(row) : null;
}

async function incrementFailedAttempts(id: string): Promise<void> {
  await query(
    `UPDATE users
     SET failed_attempts = failed_attempts + 1,
         locked_until = CASE
           WHEN failed_attempts + 1 >= 3 THEN NOW() + INTERVAL '30 minutes'
           ELSE locked_until
         END
     WHERE id = $1`,
    [id]
  );
}

async function resetFailedAttempts(id: string): Promise<void> {
  await query(
    `UPDATE users
     SET failed_attempts = 0,
         locked_until = NULL
     WHERE id = $1`,
    [id]
  );
}

export const userRepository = {
  create,
  findByEmail,
  findById,
  incrementFailedAttempts,
  resetFailedAttempts,
};
