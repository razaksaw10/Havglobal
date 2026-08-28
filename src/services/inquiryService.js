const prisma = require('../config/prisma');
const emailService = require('./emailService');
const AppError = require('../utils/appError');
const HttpStatus = require('../constants/httpStatusCodes');

const inquiryService = {
  async createInquiry(data) {
    const inquiry = await prisma.inquiry.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        phone: data.phone ? data.phone.trim() : null,
        company: data.company ? data.company.trim() : null,
        country: data.country ? data.country.trim() : null,
        subject: data.subject ? data.subject.trim() : 'Demande d’information / Devis',
        categorySlug: data.categorySlug || null,
        message: data.message.trim(),
        status: 'new'
      }
    });

    // Envoi des emails asynchrones (non bloquant)
    emailService.sendInquiryNotification(inquiry).catch(() => {});

    return inquiry;
  },

  async getInquiries(params = {}) {
    const { status, search, page = 1, limit = 50 } = params;

    const where = {};

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
        { message: { contains: term } }
      ];
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const [total, inquiries] = await Promise.all([
      prisma.inquiry.count({ where }),
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: 'desc' },
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
      inquiries,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages
      }
    };
  },

  async getInquiryById(id) {
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: Number(id) },
      include: {
        category: true
      }
    });

    if (!inquiry) {
      throw new AppError('Demande introuvable.', HttpStatus.NOT_FOUND);
    }

    return inquiry;
  },

  async updateInquiryStatus(id, status, notes = null, adminId = null) {
    const existing = await prisma.inquiry.findUnique({
      where: { id: Number(id) }
    });

    if (!existing) {
      throw new AppError('Demande introuvable.', HttpStatus.NOT_FOUND);
    }

    const updated = await prisma.inquiry.update({
      where: { id: Number(id) },
      data: {
        status,
        notes: notes !== null ? notes : existing.notes
      }
    });

    if (adminId) {
      await prisma.activityLog.create({
        data: {
          adminId,
          action: 'INQUIRY_STATUS_UPDATE',
          details: `Statut du devis #${id} passé à "${status}"`
        }
      });
    }

    return updated;
  },

  async deleteInquiry(id, adminId = null) {
    const existing = await prisma.inquiry.findUnique({
      where: { id: Number(id) }
    });

    if (!existing) {
      throw new AppError('Demande introuvable.', HttpStatus.NOT_FOUND);
    }

    await prisma.inquiry.delete({
      where: { id: Number(id) }
    });

    if (adminId) {
      await prisma.activityLog.create({
        data: {
          adminId,
          action: 'INQUIRY_DELETE',
          details: `Suppression du devis #${id} (${existing.name})`
        }
      });
    }

    return true;
  },

  async exportToCsv() {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const headers = ['ID', 'Date', 'Nom', 'Email', 'Téléphone', 'Société', 'Pays', 'Secteur', 'Objet', 'Statut', 'Message'];
    const rows = inquiries.map(i => [
      i.id,
      i.createdAt.toISOString().slice(0, 10),
      `"${(i.name || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.company || '').replace(/"/g, '""')}"`,
      `"${(i.country || '').replace(/"/g, '""')}"`,
      `"${(i.categorySlug || '').replace(/"/g, '""')}"`,
      `"${(i.subject || '').replace(/"/g, '""')}"`,
      i.status,
      `"${(i.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);

    const csvContent = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    return csvContent;
  }
};

module.exports = inquiryService;
