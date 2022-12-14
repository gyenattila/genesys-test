import { hash, compare } from 'bcryptjs';

export const hashPassword = async (rawPassword: string): Promise<string> => {
  return await hash(rawPassword, 12);
};

export const comparePasswords = async (
  providedPassword: string,
  userPasswordFromDb: string
): Promise<boolean> => {
  try {
    return await compare(providedPassword, userPasswordFromDb);
  } catch (error) {
    throw error;
  }
};
