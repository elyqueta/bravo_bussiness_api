import { userRepository } from '../../repositories/user.repository';
import { hashPassword } from '../../utils/password.util';
import { SEED_PASSWORD } from './data';

export async function seedAdmin(): Promise<void> {
  const existing = await userRepository.findByEmail('admin@bravo.co.ao');

  if (existing) {
    console.warn(`Admin "admin@bravo.co.ao" já existe (id: ${existing.id}). Nada a fazer.`);
    return;
  }

  const passwordHash = await hashPassword(SEED_PASSWORD);

  const created = await userRepository.create({
    fullName: 'Admin Bravo',
    email: 'admin@bravo.co.ao',
    passwordHash,
    phone: '923000000',
    role: 'admin',
  });

  console.warn(`Admin criado: ${created.email} (id: ${created.id})`);
  console.warn(`Senha: ${SEED_PASSWORD}`);
}
