import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { autopopulate } from '../database/autopopulate.js';
import { Cat, CatSchema } from './schemas/cat.schema.js';
import { CatsController } from './cats.controller.js';
import { CatsService } from './cats.service.js';

const logger = new Logger('CatSchema')

@Module({
  imports: [
    // NESTJS MONGO DOCS: MODEL INJECTION (registering the model)
    // register the Cat model here, otherwise @InjectModel(Cat.name) won't find it in the service.
    // we use forFeatureAsync instead of forFeature because hooks and plugins have to be
    // attached to the schema before mongoose compiles it into a model
    MongooseModule.forFeatureAsync([
      {
        name: Cat.name,
        // ConfigService is global (see AppConfigModule) so we can inject it straight away
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const schema = CatSchema;

          // NESTJS MONGO DOCS: HOOKS (MIDDLEWARE)
          // runs right before every cat is saved, the factory lets the hook use injected services
          schema.pre('save', function () {
            logger.log(
              `[${configService.get('NODE_ENV')}] saving cat "${this.name}"`,
            );
          });

          // NESTJS MONGO DOCS: PLUGINS (plugin for just this schema)
          // has to be registered here, before the model is compiled, or it won't do anything
          schema.plugin(autopopulate);

          return schema
        },
      },
    ]),
  ],
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
