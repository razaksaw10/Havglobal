const { z } = require('zod');

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email('Adresse email invalide'),
    password: z.string().min(1, 'Le mot de passe est obligatoire')
  })
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Le mot de passe actuel est requis'),
    newPassword: z.string().min(6, 'Le nouveau mot de passe doit comporter au moins 6 caractères')
  })
});

module.exports = {
  loginSchema,
  changePasswordSchema
};
