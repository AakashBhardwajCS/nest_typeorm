import { registerAs } from '@nestjs/config';
import type { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import { logConnectionEvents } from '../database/connection-events.js';

// MULTIPLE DATABASES
// settings for the second connection, which points at a separate database for events.
// the connection name itself is set in MongoModule because the factory options can't carry it

export default registerAs(
  'mongoEvents',
  (): MongooseModuleFactoryOptions => ({

    uri: process.env.MONGO_EVENTS_URI,

    serverSelectionTimeoutMS: 5000,
    
    onConnectionCreate: logConnectionEvents('events'),
  }),
);
