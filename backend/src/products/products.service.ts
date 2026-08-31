import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';

export function formatProduct(product: any) {
  if (!product) return null;
  let specs = [];
  try {
    specs =
      typeof product.specsJson === 'string'
        ? JSON.parse(product.specsJson || '[]')
        : product.specsJson || [];
  } catch (e) {
    specs = [];
  }

  return {
    ...product,
    specs,
    specs_json: typeof product.specsJson === 'string' ? product.specsJson : JSON.stringify(product.specsJson || []),
    category_slug: product.categorySlug,
    image_url: product.imageUrl,
    min_order_qty: product.minOrderQty,
    is_featured: product.isFeatured,
    created_at: product.createdAt,
    updated_at: product.updatedAt,
    category_name: product.category ? product.category.name : undefined,
    category_icon: product.category ? product.category.icon : undefined,
  };
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProducts(params: FilterProductsDto) {
    const { category, search, featured, sort, page = 1, limit = 20 } = params;

    const where: any = {};

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
        { description: { contains: term } },
      ];
    }

    let orderBy: any[] = [{ isFeatured: 'desc' }, { createdAt: 'desc' }];
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

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;
    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

    const [total, products] = await Promise.all([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          category: {
            select: {
              name: true,
              icon: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      products: products.map(formatProduct),
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasMore: pageNum < totalPages,
      },
    };
  }

  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Produit #${id} non trouvé.`);
    }

    return formatProduct(product);
  }

  async createProduct(dto: CreateProductDto) {
    let specsJsonStr = '[]';
    if (dto.specsJson) {
      specsJsonStr =
        typeof dto.specsJson === 'string'
          ? dto.specsJson
          : JSON.stringify(dto.specsJson);
    }

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        categorySlug: dto.categorySlug,
        description: dto.description || null,
        price: Number(dto.price) || 0,
        currency: dto.currency || 'EUR',
        minOrderQty: Number(dto.minOrderQty) || 1,
        specsJson: specsJsonStr,
        imageUrl: dto.imageUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
        stock: Number(dto.stock) || 100,
        isFeatured: Boolean(dto.isFeatured),
      },
      include: {
        category: true,
      },
    });

    return formatProduct(product);
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      throw new NotFoundException(`Produit #${id} non trouvé.`);
    }

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.categorySlug !== undefined) data.categorySlug = dto.categorySlug;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.price !== undefined) data.price = Number(dto.price);
    if (dto.currency !== undefined) data.currency = dto.currency;
    if (dto.minOrderQty !== undefined) data.minOrderQty = Number(dto.minOrderQty);
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.stock !== undefined) data.stock = Number(dto.stock);
    if (dto.isFeatured !== undefined) data.isFeatured = Boolean(dto.isFeatured);

    if (dto.specsJson !== undefined) {
      data.specsJson =
        typeof dto.specsJson === 'string'
          ? dto.specsJson
          : JSON.stringify(dto.specsJson);
    }

    const updated = await this.prisma.product.update({
      where: { id: Number(id) },
      data,
      include: {
        category: true,
      },
    });

    return formatProduct(updated);
  }

  async deleteProduct(id: number) {
    const existing = await this.prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      throw new NotFoundException(`Produit #${id} non trouvé.`);
    }

    await this.prisma.product.delete({
      where: { id: Number(id) },
    });

    return { message: 'Produit supprimé avec succès.', id: Number(id) };
  }
}
