import bcrypt from "bcryptjs";

const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 12);
};

const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const authService = {
  hashPassword,
  comparePassword,
};
