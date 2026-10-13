import { Logger } from '@nestjs/common';
import type { Connection } from 'mongoose';

// CONNECTION EVENTS
// nest hands us the connection right after it's created (before it opens),
// so we can hook up listeners and see what mongo is doing in the logs.
// it's a function that builds the callback so each connection gets its own log label

export function logConnectionEvents(name: string) {
  const logger = new Logger(`MongoDB:${name}`);

  return (connection: Connection) => {

    connection.on('connected', () => logger.log('connected'));
    connection.on('open', () => logger.log('connection open'));
    connection.on('disconnected', () => logger.warn('disconnected'));
    connection.on('reconnected', () => logger.log('reconnected'));
    connection.on('disconnecting', () => logger.log('disconnecting...'));

    return connection
  };
}
