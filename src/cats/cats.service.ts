import { Injectable, NotFoundException } from '@nestjs/common';
import { CatDto } from './dto/cat.dto.js';
import { CreateCatDto } from './dto/create-cat.dto.js';
import { ListCatsQueryDto } from './dto/list-cats-query.dto.js';
import { PaginatedDto } from './dto/paginated.dto.js';
import { RenameCatDto } from './dto/rename-cat.dto.js';
import { UpdateCatDto } from './dto/update-cat.dto.js';

// Kept in memory on purpose
@Injectable()
export class CatsService {
  private readonly cats: CatDto[] = [];
  private nextId = 1;

  create(data: CreateCatDto): CatDto {
    const cat = { ...data, id: this.nextId++ };
    this.cats.push(cat);
    return cat;
  }

  createMany(data: CreateCatDto[]): CatDto[] {
    return data.map((cat) => this.create(cat));
  }

  findAll({ breed, page, limit }: ListCatsQueryDto): PaginatedDto<CatDto> {
    const matching = breed ? this.cats.filter((cat) => cat.breed === breed) : this.cats;
    const start = (page - 1) * limit;

    return {
      total: matching.length,
      page,
      limit,
      results: matching.slice(start, start + limit),
    };
  }

  findOne(id: number): CatDto {
    const cat = this.cats.find((c) => c.id === id);
    if (!cat) {
      throw new NotFoundException(`Cat ${id} not found`);
    }
    return cat;
  }

  update(id: number, data: UpdateCatDto): CatDto {
    return Object.assign(this.findOne(id), data);
  }

  rename(id: number, { name }: RenameCatDto): CatDto {
    const cat = this.findOne(id);
    cat.name = name;
    return cat;
  }
}
