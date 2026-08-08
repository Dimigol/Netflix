import { z } from 'zod';

export const createProfileSchema = z.object({
  name: z.string({ error: 'Nome do perfil é obrigatório' }).trim().min(1, 'Nome do perfil é obrigatório').max(50, 'Nome do perfil muito longo'),
  avatar: z.string().trim().min(1).optional()
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, 'Nome do perfil é obrigatório').max(50, 'Nome do perfil muito longo').optional(),
  avatar: z.string().trim().min(1).optional()
});
