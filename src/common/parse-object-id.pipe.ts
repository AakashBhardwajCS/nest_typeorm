import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

// checks the id looks like a real mongo ObjectId before it hits the db.
// without this, a bad id like "abc" makes mongoose throw a CastError and the client gets a 500
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string> {
  transform(value: string) {

    if (!isValidObjectId(value)) {
      throw new BadRequestException(`"${value}" is not a valid ObjectId`);
    }
    
    return value;
  }
}
