import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ParseObjectIdPipe } from '../common/parse-object-id.pipe.js';
import { CreateCatDto, CreateCatsDto, UpdateCatDto } from './dto/cat.dto.js';
import { CatsService } from './cats.service.js'

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  create(@Body() cat: CreateCatDto) {
    return this.catsService.create(cat);
  }

  // saves all the cats in one transaction (see CatsService.createMany)
  @Post('bulk')
  createMany(@Body() body: CreateCatsDto) {
    return this.catsService.createMany(body.cats);
  }

  @Get()
  findAll() {
    return this.catsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.catsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseObjectIdPipe) id: string, @Body() cat: UpdateCatDto) {
    return this.catsService.update(id, cat);
  }

  @Delete(':id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.catsService.remove(id);
  }
}
