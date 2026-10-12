import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../posts/post.entity.js';
import { SeedService } from './seed.service.js';

@Module({
  // Registers the Post repository so SeedService can inject it
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
