
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity.js';
import { CreateReportDto } from './dto/create-report.dto.js';
import { User } from '../users/entities/user.entity.js';


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
}