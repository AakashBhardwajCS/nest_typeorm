import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PostDto } from '../posts/post.dto.js';

@Injectable()
export class PostPipe implements PipeTransform<PostDto> {

  transform(value: PostDto) {
    const title = value?.title?.trim();

    if (!title || title.length < 3) {
      throw new BadRequestException(
        'Title must contain at least 3 characters.',
      );
    }

    return { ...value, title };
  }
}
