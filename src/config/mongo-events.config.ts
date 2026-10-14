import { registerAs } from '@nestjs/config';
import type { MongooseModuleFactoryOptions } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';
import { autopopulate } from '../database/autopopulate.js';
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

    // PLUGINS (plugin for every schema on this connection)
    // connectionFactory runs before any model is compiled, so the plugin reaches all the event schemas.
    // none of them have ref fields yet, but any ref with autopopulate: true added later just works
    connectionFactory: (connection: Connection) => {
      connection.plugin(autopopulate);
      return connection;
    },
  }),
);
