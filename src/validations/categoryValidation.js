const { z } = require('zod');

const createCategorySchema = z.object({
  body: z.object({
    slug: z.string().trim().min(2, 'Le slug doit contenir au moins 2 caractères').regex(/^[a-z0-9-]+$/, 'Format de slug invalide (minuscules, chiffres et tirets uniquement)'),
    name: z.string().trim().min(2, 'Le nom est obligatoire'),
    icon: z.string().optional().default('📦'),
    description: z.string().optional(),
    orderIndex: z.number().int().optional().default(0)
  })
});

module.exports = {
  createCategorySchema
};
