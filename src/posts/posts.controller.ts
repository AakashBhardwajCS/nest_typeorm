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

// custom decorators, guards, pipes, interceptors and dtos
import { Roles } from '../common/roles.decorator.js';
import { RolesGuard } from '../common/roles.guard.js';
import { PostPipe } from '../common/post.pipe.js';
import { RequestIdInterceptor } from '../common/request-id.interceptor.js';
import { PostDto } from './post.dto.js';

// service
import { PostService } from './post.service.js';


@Controller('posts')
@UseGuards(RolesGuard)
@UseInterceptors(RequestIdInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostService) {}

  @Post()
  // postpipe is inside body decorator so it will transform the body before passing it to the service (and also provide custom validation)
  // postdto is used to define the shape of the data and provide validation decorators
  // but without global validation pipe it will not validate the data automatically
  create(@Body(PostPipe) post: PostDto) {
    return this.postsService.create(post);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  @Roles(['admin'])
  update(@Param('id', ParseIntPipe) id: number, @Body(PostPipe) post: PostDto) {
    return this.postsService.update(id, post);
  }

  @Delete(':id')
  @Roles(['admin'])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}
