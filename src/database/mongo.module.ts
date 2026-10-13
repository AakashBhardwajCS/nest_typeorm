import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoConfig from '../config/mongo.config.js';
import mongoEventsConfig from '../config/mongo-events.config.js';
import { EVENTS_CONNECTION } from './mongo.constants.js'

@Module({
  imports: [
    // only this module needs the mongo config, so we load it here instead of globally
    ConfigModule.forFeature(mongoConfig),
    ConfigModule.forFeature(mongoEventsConfig),

    // MONGO + ASYNC CONFIGURATION
    // same idea as DatabaseModule, just connecting to mongo instead of postgres
    MongooseModule.forRootAsync(mongoConfig.asProvider()),

    // MULTIPLE DATABASES
    // a second, named connection. anything that wants to use it has to pass
    // EVENTS_CONNECTION to forFeature / @InjectModel / @InjectConnection
    MongooseModule.forRootAsync({
      ...mongoEventsConfig.asProvider(),
      connectionName: EVENTS_CONNECTION,
    }),
  ],
})
export class MongoModule {}
