import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, ipAddress: string = '127.0.0.1') {
    const email = loginDto.email.toLowerCase().trim();
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedException('Identifiants de connexion invalides.');
    }

    const isMatch = bcrypt.compareSync(loginDto.password, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException('Identifiants de connexion invalides.');
    }

    const payload = {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };

    const token = this.jwtService.sign(payload);

    // Audit log
    await this.prisma.activityLog.create({
      data: {
        adminId: admin.id,
        action: 'ADMIN_LOGIN',
        details: `Connexion réussie depuis ${ipAddress}`,
        ipAddress,
      },
    });

    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    };
  }

  async getMe(adminId: number) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Administrateur non trouvé.');
    }

    return { admin };
  }

  async changePassword(adminId: number, dto: ChangePasswordDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Administrateur non trouvé.');
    }

    const isMatch = bcrypt.compareSync(dto.currentPassword, admin.password);
    if (!isMatch) {
      throw new BadRequestException('Le mot de passe actuel est incorrect.');
    }

    const hashedPassword = bcrypt.hashSync(dto.newPassword, 10);
    await this.prisma.admin.update({
      where: { id: adminId },
      data: { password: hashedPassword },
    });

    await this.prisma.activityLog.create({
      data: {
        adminId,
        action: 'PASSWORD_CHANGE',
        details: 'Mot de passe modifié avec succès',
      },
    });

    return { message: 'Mot de passe mis à jour avec succès.' };
  }
}
