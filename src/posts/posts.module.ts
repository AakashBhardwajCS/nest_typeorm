import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity.js';
import { PostService } from './post.service.js';
import { PostsController } from './posts.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostService],
  exports: [PostService],
})
export class PostsModule {}
