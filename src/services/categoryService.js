const prisma = require('../config/prisma');
const AppError = require('../utils/appError');
const HttpStatus = require('../constants/httpStatusCodes');

const categoryService = {
  async getAllCategories() {
    return prisma.category.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  },

  async getCategoryBySlug(slug) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      throw new AppError(`Catégorie introuvable pour le slug "${slug}".`, HttpStatus.NOT_FOUND);
    }

    return category;
  },

  async createCategory(data) {
    return prisma.category.create({
      data
    });
  }
};

module.exports = categoryService;
