import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryStatusDto } from './dto/update-inquiry-status.dto';
import { FilterInquiriesDto } from './dto/filter-inquiries.dto';

@Injectable()
export class InquiriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async createInquiry(dto: CreateInquiryDto) {
    const inquiry = await this.prisma.inquiry.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.toLowerCase().trim(),
        phone: dto.phone ? dto.phone.trim() : null,
        company: dto.company ? dto.company.trim() : null,
        country: dto.country ? dto.country.trim() : null,
        subject: dto.subject ? dto.subject.trim() : 'Demande d’information / Devis',
        categorySlug: dto.categorySlug || null,
        message: dto.message.trim(),
        status: 'new',
      },
    });

    // Envoi de notification par email asynchrone
    this.mailService.sendInquiryNotification(inquiry).catch(() => {});

    return {
      message: 'Votre demande a été transmise avec succès. Notre équipe vous répondra sous 24h ouvrées.',
      inquiry_id: inquiry.id,
      inquiry,
    };
  }

  async getInquiries(params: FilterInquiriesDto) {
    const { status, search, page = 1, limit = 50 } = params;

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { name: { contains: term } },
        { email: { contains: term } },
        { company: { contains: term } },
        { subject: { contains: term } },
        { message: { contains: term } },
      ];
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 50;
    const skip = (pageNum - 1) * limitNum;
    const take = limitNum;

    const [total, inquiries] = await Promise.all([
      this.prisma.inquiry.count({ where }),
      this.prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
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
      inquiries,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasMore: pageNum < totalPages,
      },
    };
  }

  async getInquiryById(id: number) {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
      },
    });

    if (!inquiry) {
      throw new NotFoundException(`Demande #${id} introuvable.`);
    }

    return inquiry;
  }

  async updateInquiryStatus(
    id: number,
    dto: UpdateInquiryStatusDto,
    adminId?: number,
  ) {
    const existing = await this.prisma.inquiry.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      throw new NotFoundException(`Demande #${id} introuvable.`);
    }

    const updated = await this.prisma.inquiry.update({
      where: { id: Number(id) },
      data: {
        status: dto.status,
        notes: dto.notes !== undefined ? dto.notes : existing.notes,
      },
      include: {
        category: true,
      },
    });

    if (adminId) {
      await this.prisma.activityLog.create({
        data: {
          adminId,
          action: 'INQUIRY_STATUS_CHANGE',
          details: `Statut du devis #${id} passé à "${dto.status}"`,
        },
      });
    }

    return updated;
  }

  async deleteInquiry(id: number, adminId?: number) {
    const existing = await this.prisma.inquiry.findUnique({
      where: { id: Number(id) },
    });

    if (!existing) {
      throw new NotFoundException(`Demande #${id} introuvable.`);
    }

    await this.prisma.inquiry.delete({
      where: { id: Number(id) },
    });

    if (adminId) {
      await this.prisma.activityLog.create({
        data: {
          adminId,
          action: 'INQUIRY_DELETE',
          details: `Devis #${id} (${existing.name} - ${existing.email}) supprimé`,
        },
      });
    }

    return { message: 'Demande supprimée avec succès.', id: Number(id) };
  }

  async exportCsv() {
    const inquiries = await this.prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });

    const headers = [
      'ID',
      'Date',
      'Statut',
      'Nom',
      'Email',
      'Téléphone',
      'Société',
      'Pays',
      'Secteur',
      'Objet',
      'Message',
      'Notes Internes',
    ];

    const escape = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = inquiries.map((inq) => [
      inq.id,
      inq.createdAt ? inq.createdAt.toISOString() : '',
      inq.status,
      escape(inq.name),
      escape(inq.email),
      escape(inq.phone || ''),
      escape(inq.company || ''),
      escape(inq.country || ''),
      escape(inq.category ? inq.category.name : inq.categorySlug || ''),
      escape(inq.subject || ''),
      escape(inq.message || ''),
      escape(inq.notes || ''),
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');

    return csvContent;
  }
}
