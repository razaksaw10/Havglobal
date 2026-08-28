const { z } = require('zod');

const createProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Le nom du produit est obligatoire'),
    categorySlug: z.string().trim().min(1, 'La catégorie est obligatoire'),
    description: z.string().optional().default(''),
    price: z.coerce.number().min(0, 'Le prix ne peut pas être négatif').default(0),
    currency: z.string().default('EUR'),
    minOrderQty: z.coerce.number().int().min(1, 'La quantité minimale doit être au moins de 1').default(1),
    specs: z.union([
      z.array(z.object({
        label: z.string(),
        value: z.string()
      })),
      z.string()
    ]).optional().default([]),
    imageUrl: z.string().trim().min(1, 'L’image du produit est obligatoire'),
    stock: z.coerce.number().int().min(0).default(100),
    isFeatured: z.coerce.boolean().optional().default(false)
  })
});

const updateProductSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive('Identifiant produit invalide')
  }),
  body: z.object({
    name: z.string().trim().min(2).optional(),
    categorySlug: z.string().trim().min(1).optional(),
    description: z.string().optional(),
    price: z.coerce.number().min(0).optional(),
    currency: z.string().optional(),
    minOrderQty: z.coerce.number().int().min(1).optional(),
    specs: z.union([
      z.array(z.object({
        label: z.string(),
        value: z.string()
      })),
      z.string()
    ]).optional(),
    imageUrl: z.string().trim().min(1).optional(),
    stock: z.coerce.number().int().min(0).optional(),
    isFeatured: z.coerce.boolean().optional()
  })
});

const getProductsQuerySchema = z.object({
  query: z.object({
    category: z.string().optional(),
    search: z.string().optional(),
    featured: z.enum(['true', 'false', '1', '0']).optional(),
    sort: z.enum(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest']).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20)
  })
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema
};
