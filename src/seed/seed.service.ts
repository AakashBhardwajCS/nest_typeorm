import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from "../posts/post.entity.js"

// Seeding logic will go here. Any script outside can call this service to seed the database with initial data. This is useful for development and testing purposes.
@Injectable()
export class SeedService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>
    ) {}

    // method for seeding the database with initial data

    async seed () {

        const users = [
            {
            title: 'First Post',
            content: 'This is the content of the first post.'
            },
            {
            title: 'Second Post',
            content: 'This is the content of the first post.'
            },
            {
            title: 'Third Post',
            content: 'This is the content of the first post.'
            },
            {
            title: 'Fourth Post',
            content: 'This is the content of the first post.'
            },
        ]

        await this.postRepository.clear() // clear the table before seeding

        await this.postRepository.save(users)
    }
}
