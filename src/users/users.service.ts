import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

	constructor(
		@InjectRepository(Users)
		private repo: Repository<Users>,
	) {}

  async create(createUserDto: CreateUserDto) {
			const user = this.repo.save(createUserDto)
			return user
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOneBy({id: id})
  }

	async update(id: string, updateUserDto: UpdateUserDto) {
		const user = await this.repo.findOneBy({ id });

		Object.assign(user, updateUserDto);
		return this.repo.save(user);
	}

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
