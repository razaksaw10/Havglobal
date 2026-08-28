const prisma = require('../config/prisma');
const AppError = require('../utils/appError');
const HttpStatus = require('../constants/httpStatusCodes');

function formatProduct(product) {
  if (!product) return null;
  let specs = [];
  try {
    specs = typeof product.specsJson === 'string' ? JSON.parse(product.specsJson || '[]') : (product.specsJson || []);
  } catch (e) {
    specs = [];
  }

  return {
    ...product,
    specs,
    specs_json: product.specsJson,
    category_slug: product.categorySlug,
    image_url: product.imageUrl,
    min_order_qty: product.minOrderQty,
    is_featured: product.isFeatured,
    created_at: product.createdAt,
    updated_at: product.updatedAt,
    category_name: product.category ? product.category.name : undefined,
    category_icon: product.category ? product.category.icon : undefined
  };
}

const productService = {
  async getProducts(params = {}) {
    const { category, search, featured, sort, page = 1, limit = 20 } = params;

    const where = {};

    if (category && category !== 'all') {
      where.categorySlug = category;
    }

    if (featured === 'true' || featured === '1' || featured === true) {
      where.isFeatured = true;
    }

    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { name: { contains: term } },
        { description: { contains: term } }
      ];
    }

    // Gestion du Tri
    let orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
    if (sort === 'price_asc') {
      orderBy = [{ price: 'asc' }];
    } else if (sort === 'price_desc') {
      orderBy = [{ price: 'desc' }];
    } else if (sort === 'name_asc') {
      orderBy = [{ name: 'asc' }];
    } else if (sort === 'name_desc') {
      orderBy = [{ name: 'desc' }];
    } else if (sort === 'newest') {
      orderBy = [{ createdAt: 'desc' }];
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          category: {
            select: {
              name: true,
              icon: true
            }
          }
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      products: products.map(formatProduct),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages
      }
    };
  },

  async getProductById(id) {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        category: {
          select: {
            name: true,
            icon: true,
            slug: true
          }
        }
      }
    });

    if (!product) {
      throw new AppError('Produit non trouvé.', HttpStatus.NOT_FOUND);
    }

    return formatProduct(product);
  },

  async createProduct(data, adminId) {
    const specsJson = Array.isArray(data.specs)
      ? JSON.stringify(data.specs)
      : (typeof data.specs === 'string' ? data.specs : '[]');

    const product = await prisma.product.create({
      data: {
        name: data.name.trim(),
        categorySlug: data.categorySlug,
        description: data.description || '',
        price: data.price !== undefined ? Number(data.price) : 0,
        currency: data.currency || 'EUR',
        minOrderQty: data.minOrderQty !== undefined ? Number(data.minOrderQty) : 1,
        specsJson,
        imageUrl: data.imageUrl,
        stock: data.stock !== undefined ? Number(data.stock) : 100,
        isFeatured: Boolean(data.isFeatured)
      },
      include: {
        category: {
          select: {
            name: true,
            icon: true
          }
        }
      }
    });

    if (adminId) {
      await prisma.activityLog.create({
        data: {
          adminId,
          action: 'PRODUCT_CREATE',
          details: `Création du produit #${product.id} : ${product.name}`
        }
      });
    }

    return formatProduct(product);
  },

  async updateProduct(id, data, adminId) {
    const existing = await prisma.product.findUnique({
      where: { id: Number(id) }
    });

    if (!existing) {
      throw new AppError('Produit introuvable.', HttpStatus.NOT_FOUND);
    }

    const updatePayload = {};
    if (data.name !== undefined) updatePayload.name = data.name.trim();
    if (data.categorySlug !== undefined) updatePayload.categorySlug = data.categorySlug;
    if (data.description !== undefined) updatePayload.description = data.description;
    if (data.price !== undefined) updatePayload.price = Number(data.price);
    if (data.currency !== undefined) updatePayload.currency = data.currency;
    if (data.minOrderQty !== undefined) updatePayload.minOrderQty = Number(data.minOrderQty);
    if (data.specs !== undefined) {
      updatePayload.specsJson = Array.isArray(data.specs)
        ? JSON.stringify(data.specs)
        : (typeof data.specs === 'string' ? data.specs : '[]');
    }
    if (data.imageUrl !== undefined) updatePayload.imageUrl = data.imageUrl.trim();
    if (data.stock !== undefined) updatePayload.stock = Number(data.stock);
    if (data.isFeatured !== undefined) updatePayload.isFeatured = Boolean(data.isFeatured);

    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: updatePayload,
      include: {
        category: {
          select: {
            name: true,
            icon: true
          }
        }
      }
    });

    if (adminId) {
      await prisma.activityLog.create({
        data: {
          adminId,
          action: 'PRODUCT_UPDATE',
          details: `Mise à jour du produit #${updated.id} : ${updated.name}`
        }
      });
    }

    return formatProduct(updated);
  },

  async deleteProduct(id, adminId) {
    const existing = await prisma.product.findUnique({
      where: { id: Number(id) }
    });

    if (!existing) {
      throw new AppError('Produit introuvable.', HttpStatus.NOT_FOUND);
    }

    await prisma.product.delete({
      where: { id: Number(id) }
    });

    if (adminId) {
      await prisma.activityLog.create({
        data: {
          adminId,
          action: 'PRODUCT_DELETE',
          details: `Suppression du produit #${id} : ${existing.name}`
        }
      });
    }

    return true;
  }
};

module.exports = productService;
