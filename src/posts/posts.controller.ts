import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import * as z from 'zod';

// custom decorators, guards, interceptors and dtos
import { Roles } from '../common/roles.decorator.js';
import { RolesGuard } from '../common/roles.guard.js';
import { RequestIdInterceptor } from '../common/request-id.interceptor.js';
import { postResponseSchema, postSchema, type PostDto } from './post.dto.js';

// service
import { PostService } from './post.service.js';


@Controller('posts')
@UseGuards(RolesGuard)
@UseInterceptors(RequestIdInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostService) {}

  @Post()
  // the zod schema is attached to the parameter; the global StandardSchemaValidationPipe
  // validates (and trims) the body with it, and Swagger documents the request body from it
  @ApiResponse({ status: 201, standardSchema: postResponseSchema })
  create(@Body({ schema: postSchema }) post: PostDto) {
    return this.postsService.create(post);
  }

  @Get()
  @ApiResponse({ status: 200, standardSchema: z.array(postResponseSchema) })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 200, standardSchema: postResponseSchema })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  @Roles(['admin'])
  // Marks the route with the 'user-role' scheme from main.ts (a lock icon in Swagger UI).
  @ApiSecurity('user-role')
  @ApiForbiddenResponse({ description: 'x-user-role is missing or not "admin"' })
  @ApiResponse({ status: 200, standardSchema: postResponseSchema })
  update(@Param('id', ParseIntPipe) id: number, @Body({ schema: postSchema }) post: PostDto) {
    return this.postsService.update(id, post);
  }

  @Delete(':id')
  @Roles(['admin'])
  @ApiSecurity('user-role')
  @ApiForbiddenResponse({ description: 'x-user-role is missing or not "admin"' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}
