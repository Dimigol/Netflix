import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string({ error: 'Email inválido' }).trim().toLowerCase().email('Email inválido'),
  password: z.string({ error: 'A senha precisa ter no mínimo 6 caracteres' }).min(6, 'A senha precisa ter no mínimo 6 caracteres'),
  username: z.string({ error: 'Nome de usuário é obrigatório' }).trim().min(1, 'Nome de usuário é obrigatório').max(50, 'Nome de usuário muito longo')
});

export const loginSchema = z.object({
  email: z.string({ error: 'Email inválido' }).trim().toLowerCase().email('Email inválido'),
  password: z.string({ error: 'Senha é obrigatória' }).min(1, 'Senha é obrigatória')
});
