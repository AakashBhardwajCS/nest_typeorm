import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, type Connection } from 'mongoose';
import { Cat } from './schemas/cat.schema.js';
import { CreateCatDto, UpdateCatDto } from './dto/cat.dto.js';

@Injectable()
export class CatsService {
  constructor(
    //(@InjectModel) (Model Injection)
    @InjectModel(Cat.name) private readonly catModel: Model<Cat>,
    // docs: SESSIONS (injecting the connection nest manages, instead of using mongoose directly)
    @InjectConnection() private readonly connection: Connection,
  ) {}

  create(data: CreateCatDto) {
    const cat = new this.catModel(data);
    return cat.save()
  }

  // SESSIONS
  // saves a whole list of cats in one transaction, so either all of them get saved or none do.
  // mongo only supports transactions on a replica set, a plain standalone server will throw here
  async createMany(cats: CreateCatDto[]) {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      // passing the session is what puts these writes inside the transaction.
      // mongoose needs ordered: true when creating several docs with a session
      const created = await this.catModel.create(cats, { session, ordered: true });
      await session.commitTransaction();
      return created;

    } catch (error) {
      // something failed, so undo everything written so far
      await session.abortTransaction();
      throw error;
    } finally {
      // always close the session, whether it worked or not
      await session.endSession()
    }
  }

  findAll() {
    return this.catModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string) {
    const cat = await this.catModel.findById(id).exec();

    if (!cat) throw new NotFoundException(`Cat ${id} not found`);
    return cat;
  }

  async update(id: string, data: UpdateCatDto) {
    // by default mongoose gives back the old document, new: true makes it return the updated one
    const cat = await this.catModel
      .findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .exec();

    if (!cat) throw new NotFoundException(`Cat ${id} not found`);
    return cat;
  }

  async remove(id: string) {
    // thenable query as exec returns a promise
    const cat = await this.catModel.findByIdAndDelete(id).exec();
    if (!cat) throw new NotFoundException(`Cat ${id} not found`);

    return { deleted: true, id }
  }
}
