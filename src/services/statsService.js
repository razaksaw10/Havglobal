const prisma = require('../config/prisma');

const statsService = {
  async getDashboardStats() {
    const [
      totalProducts,
      totalCategories,
      totalInquiries,
      newInquiries,
      inProgressInquiries,
      resolvedInquiries,
      categories,
      recentInquiries,
      recentProducts,
      recentActivities
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: 'new' } }),
      prisma.inquiry.count({ where: { status: 'in_progress' } }),
      prisma.inquiry.count({ where: { status: 'resolved' } }),
      prisma.category.findMany({
        select: {
          id: true,
          slug: true,
          name: true,
          icon: true,
          _count: {
            select: { products: true }
          }
        },
        orderBy: { orderIndex: 'asc' }
      }),
      prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          subject: true,
          status: true,
          createdAt: true
        }
      }),
      prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          categorySlug: true,
          price: true,
          currency: true,
          stock: true,
          isFeatured: true,
          createdAt: true
        }
      }),
      prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          admin: {
            select: { name: true, email: true }
          }
        }
      })
    ]);

    const categoryDistribution = categories.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      count: c._count.products
    }));

    return {
      kpis: {
        totalProducts,
        totalCategories,
        totalInquiries,
        newInquiries,
        inProgressInquiries,
        resolvedInquiries
      },
      categoryDistribution,
      recentInquiries: recentInquiries.map(i => ({
        ...i,
        created_at: i.createdAt
      })),
      recentProducts: recentProducts.map(p => ({
        ...p,
        category_slug: p.categorySlug,
        is_featured: p.isFeatured,
        created_at: p.createdAt
      })),
      recentActivities
    };
  }
};

module.exports = statsService;
