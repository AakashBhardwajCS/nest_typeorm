import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../posts/post.entity.js';

@Injectable()
export class PostStatsService {
  constructor(
    @InjectRepository(Post) private readonly posts: Repository<Post>,
  ) {}

  async getStats() {
    return { totalPosts: await this.posts.count() };
  }
}

// Not imported anywhere. ExampleController loads it on first use.
@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  providers: [PostStatsService],
})
export class LazyModule {}
