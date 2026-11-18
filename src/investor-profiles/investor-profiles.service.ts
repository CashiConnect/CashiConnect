import { Injectable } from '@nestjs/common';
import { CreateInvestorProfileDto } from './dto/create-investor-profile.dto.js';
import { UpdateInvestorProfileDto } from './dto/update-investor-profile.dto.js';

@Injectable()
export class InvestorProfilesService {
  create(createInvestorProfileDto: CreateInvestorProfileDto) {
    return 'This action adds a new investorProfile';
  }

  findAll() {
    return `This action returns all investorProfiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} investorProfile`;
  }

  update(id: number, updateInvestorProfileDto: UpdateInvestorProfileDto) {
    return `This action updates a #${id} investorProfile`;
  }

  remove(id: number) {
    return `This action removes a #${id} investorProfile`;
  }
}
