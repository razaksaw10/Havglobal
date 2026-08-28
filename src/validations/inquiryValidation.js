const { z } = require('zod');

const createInquirySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Le nom complet est obligatoire'),
    email: z.string().trim().email('Format d’adresse email invalide'),
    phone: z.string().trim().optional().default(''),
    company: z.string().trim().optional().default(''),
    country: z.string().trim().optional().default(''),
    subject: z.string().trim().min(2).optional().default('Demande d’information / Devis'),
    categorySlug: z.string().trim().optional().nullable(),
    message: z.string().trim().min(5, 'Le message doit contenir au moins 5 caractères')
  })
});

const updateInquiryStatusSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('Identifiant de devis invalide')
  }),
  body: z.object({
    status: z.enum(['new', 'in_progress', 'resolved', 'archived'], {
      errorMap: () => ({ message: 'Statut invalide. Utilisez: new, in_progress, resolved ou archived' })
    }),
    notes: z.string().optional()
  })
});

const getInquiriesQuerySchema = z.object({
  query: z.object({
    status: z.string().optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(200).default(50)
  })
});

module.exports = {
  createInquirySchema,
  updateInquiryStatusSchema,
  getInquiriesQuerySchema
};
