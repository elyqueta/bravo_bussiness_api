import { userRepository } from '../repositories/user.repository';
import { User, UserWithPasswordHash } from '../types/user.types';
import { LoginInput } from '../validators/auth.validator';
import { comparePassword, hashPassword } from '../utils/password.util';
import { generateAccessToken } from '../utils/token.util';
import { UnauthorizedError } from '../errors';

function toSafeUser(user: UserWithPasswordHash): User {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function issueTokens(user: User): { user: User; accessToken: string } {
  const accessToken = generateAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });

  return { user, accessToken };
}

async function login(input: LoginInput): Promise<{ user: User; accessToken: string }> {
  const userWithHash = await userRepository.findByEmail(input.email);

  if (!userWithHash) {
    throw new UnauthorizedError('Credenciais inválidas.');
  }

  const isPasswordValid = await comparePassword(input.password, userWithHash.passwordHash);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Credenciais inválidas.');
  }

  if (userWithHash.status !== 'active') {
    throw new UnauthorizedError('Esta conta não está ativa. Contacte o suporte.');
  }

  const user = toSafeUser(userWithHash);

  return issueTokens(user);
}

async function registerAdmin(
  fullName: string,
  email: string,
  plainPassword: string
): Promise<User> {
  const passwordHash = await hashPassword(plainPassword);

  return userRepository.create({
    fullName,
    email,
    passwordHash,
    phone: '',
    role: 'admin',
  });
}

export const authService = {
  login,
  registerAdmin,
};
