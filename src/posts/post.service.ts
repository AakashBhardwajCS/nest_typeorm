import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity.js';
import { PostDto } from './post.dto.js';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly posts: Repository<Post>,
  ) {}

  create(data: PostDto) {
    const post = this.posts.create(data);
    return this.posts.save(post);
  }

  findAll() {
    return this.posts.find({ order: { createdAt: 'DESC' } });
  }

  // Throws EntityNotFoundError when missing, NotFoundFilter turns it into a 404.
  findOne(id: number) {
    return this.posts.findOneByOrFail({ id });
  }

  async update(id: number, data: PostDto) {
    const post = await this.findOne(id);
    this.posts.merge(post, data);
    return this.posts.save(post);
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    await this.posts.remove(post);
    return { deleted: true, id };
  }
}
