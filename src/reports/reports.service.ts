import { BadRequestException, Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity.js';
import { CreateReportDto } from './dto/create-report.dto.js';
import { ReportQueryDto } from './dto/report-query.dto.js';
import { User } from '../users/entities/user.entity.js';
import { APP_ROLES } from '../common/decorators/roles.decorator.js';
import {UpdateReportStatusDto } from './dto/update-report-status.dto.js'




@Injectable()
export class ReportsService {

  constructor(
    @InjectRepository(Report)  private readonly reportRepository: Repository<Report>,
    @InjectRepository(User)    private readonly userRepository: Repository<User>,
  ) {}


  async create(dto: CreateReportDto, reporterId: number) {
    const { reportedUserID , project_id, subject, description } = dto;

    let hasUser = false;
    let hasProject = false;
    if (reportedUserID !== undefined) hasUser = true;
    if (project_id !== undefined) hasProject = true;

    if(hasUser === hasProject) {
      throw new BadRequestException('Report must be about either a user (reportedUserID) or a project (project_id), not both', );
    }

    if(hasUser) {
      if (reportedUserID === reporterId) {
        throw new BadRequestException('You cannot report yourself');
      }

      const exists = await this.userRepository.exists({
        where: { id: reportedUserID },
      });

      if (!exists) {
        throw new NotFoundException( `User with id ${reportedUserID} not found`, );
      }
    }

    const reportData = this.reportRepository.create({
      reporter: { id: reporterId },
      ...(hasUser && { reported_user: { id: reportedUserID } }),
      ...(hasProject && { project: { id: project_id } }),
      subject,
      description,
      status: 'pending',
    });
    const report = await this.reportRepository.save(reportData);

    return {
      id: report.id,
      reportedUserID: reportedUserID ?? null,
      project_id: project_id ?? null,
      subject: report.subject,
      description: report.description,
      status: report.status,
      created_at: report.created_at,
    };
  }


  async findAll({ status }: ReportQueryDto, userId: number, role: string) {
  const isAdmin = role === APP_ROLES.ADMIN;

  const data = await this.reportRepository.find({
    where: {
      ...(status && { status }),
      ...(!isAdmin && { reporter: { id: userId } }),
    },
    relations: { reporter: true, reported_user: true, project: true },
    select: {
      id: true, 
      subject: true, 
      description: true, 
      status: true,
      admin_note: true, 
      created_at: true,
      reporter: { id: true, full_name: true },
      reported_user: { id: true, full_name: true },
      project: { id: true },
    },
    order: { id: 'DESC' },
  });

  return { total: data.length, data };
}

  
  async updateStatus(id: number, dto: UpdateReportStatusDto) {
    const report = await this.reportRepository.findOne({ where: { id },  select: { id: true, status: true } });

    if (!report) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }

    if (report.status === 'solved' || report.status === 'rejected') {
      throw new ConflictException(`Report is already ${report.status}`);
    }

    await this.reportRepository.update(id, {
      status: dto.status,
      ...(dto.admin_note !== undefined && { admin_note: dto.admin_note }),
    });

    return { id, status: dto.status };
  }

}