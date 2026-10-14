import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from './api-paginated-response.decorator.js';
import { CatsService } from './cats.service.js';
import { CatDto } from './dto/cat.dto.js';
import { CreateCatDto } from './dto/create-cat.dto.js';
import { ListCatsQueryDto } from './dto/list-cats-query.dto.js';
import { RenameCatDto } from './dto/rename-cat.dto.js';
import { UpdateCatDto } from './dto/update-cat.dto.js';

// Matches the 'cats' tag added in main.ts, so these routes are grouped under it.
@ApiTags('cats')
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @ApiCreatedResponse({ type: CatDto })
  create(@Body() cat: CreateCatDto) {
    return this.catsService.create(cat);
  }

  // The body is CreateCatDto[], but at runtime TypeScript only reports "Array", so Swagger
  // can't tell what's inside. @ApiBody({ type: [CreateCatDto] }) spells it out.
  // Same story for validation: the global ValidationPipe skips arrays, so ParseArrayPipe
  // validates each item as a CreateCatDto.
  @Post('bulk')
  @ApiBody({ type: [CreateCatDto] })
  @ApiCreatedResponse({ type: [CatDto] })
  createMany(
    @Body(new ParseArrayPipe({ items: CreateCatDto, whitelist: true }))
    cats: CreateCatDto[],
  ) {
    return this.catsService.createMany(cats);
  }

  @Get()
  @ApiPaginatedResponse(CatDto)
  findAll(@Query() query: ListCatsQueryDto) {
    return this.catsService.findAll(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: CatDto })
  @ApiNotFoundResponse({ description: 'No cat with that id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
  }

  // Body is UpdateCatDto: every CreateCatDto field except `name`, all optional.
  @Patch(':id')
  @ApiOkResponse({ type: CatDto })
  @ApiNotFoundResponse({ description: 'No cat with that id' })
  update(@Param('id', ParseIntPipe) id: number, @Body() changes: UpdateCatDto) {
    return this.catsService.update(id, changes);
  }

  // Body is RenameCatDto: just `name`, with the same rules as when creating a cat.
  @Patch(':id/name')
  @ApiOkResponse({ type: CatDto })
  @ApiNotFoundResponse({ description: 'No cat with that id' })
  rename(@Param('id', ParseIntPipe) id: number, @Body() body: RenameCatDto) {
    return this.catsService.rename(id, body);
  }
}
