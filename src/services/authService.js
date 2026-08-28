const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const env = require('../config/env');
const AppError = require('../utils/appError');
const HttpStatus = require('../constants/httpStatusCodes');

const authService = {
  async login(email, password, ipAddress = '127.0.0.1') {
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!admin) {
      throw new AppError('Identifiants de connexion invalides.', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = bcrypt.compareSync(password, admin.password);
    if (!isMatch) {
      throw new AppError('Identifiants de connexion invalides.', HttpStatus.UNAUTHORIZED);
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    // Enregistrement dans les logs d'activité
    await prisma.activityLog.create({
      data: {
        adminId: admin.id,
        action: 'ADMIN_LOGIN',
        details: `Connexion réussie depuis ${ipAddress}`,
        ipAddress
      }
    });

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    };
  },

  async getMe(adminId) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    if (!admin) {
      throw new AppError('Administrateur non trouvé.', HttpStatus.NOT_FOUND);
    }

    return admin;
  },

  async changePassword(adminId, currentPassword, newPassword) {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId }
    });

    if (!admin) {
      throw new AppError('Administrateur non trouvé.', HttpStatus.NOT_FOUND);
    }

    const isMatch = bcrypt.compareSync(currentPassword, admin.password);
    if (!isMatch) {
      throw new AppError('Le mot de passe actuel est incorrect.', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword }
    });

    await prisma.activityLog.create({
      data: {
        adminId,
        action: 'PASSWORD_CHANGE',
        details: 'Mot de passe modifié avec succès'
      }
    });

    return true;
  }
};

module.exports = authService;
