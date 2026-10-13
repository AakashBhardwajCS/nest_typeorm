import { registerAs } from '@nestjs/config';
import type { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { logConnectionEvents } from '../database/connection-events.js';

//  ASYNC CONFIGURATION
// settings for the default mongo connection (cats live here), kept in their own namespace
// like the database and mail ones. returning the options as-is means we can just pass
// mongoConfig.asProvider() to forRootAsync
export default registerAs(
  'mongo',
  (): MongooseModuleFactoryOptions => ({
    uri: process.env.MONGO_URI,
    // if mongo isn't running, give up after 5 seconds instead of hanging forever
    serverSelectionTimeoutMS: 5000,

    // NESTJS MONGO DOCS: CONNECTION EVENTS
    onConnectionCreate: logConnectionEvents('cats'),
  }),
);
