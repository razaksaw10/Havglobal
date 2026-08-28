import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

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
      recentActivities,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.category.count(),
      this.prisma.inquiry.count(),
      this.prisma.inquiry.count({ where: { status: 'new' } }),
      this.prisma.inquiry.count({ where: { status: 'in_progress' } }),
      this.prisma.inquiry.count({ where: { status: 'resolved' } }),
      this.prisma.category.findMany({
        select: {
          id: true,
          slug: true,
          name: true,
          icon: true,
          _count: {
            select: { products: true },
          },
        },
        orderBy: { orderIndex: 'asc' },
      }),
      this.prisma.inquiry.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          subject: true,
          status: true,
          createdAt: true,
        },
      }),
      this.prisma.product.findMany({
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
          createdAt: true,
        },
      }),
      this.prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          admin: {
            select: { name: true, email: true },
          },
        },
      }),
    ]);

    const categoryDistribution = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      count: c._count.products,
    }));

    return {
      kpis: {
        totalProducts,
        totalCategories,
        totalInquiries,
        newInquiries,
        inProgressInquiries,
        resolvedInquiries,
      },
      categoryDistribution,
      recentInquiries: recentInquiries.map((i) => ({
        ...i,
        created_at: i.createdAt,
      })),
      recentProducts: recentProducts.map((p) => ({
        ...p,
        category_slug: p.categorySlug,
        is_featured: p.isFeatured,
        created_at: p.createdAt,
      })),
      recentActivities,
    };
  }
}
