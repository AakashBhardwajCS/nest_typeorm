import { ConfigService } from '@nestjs/config';

import { LocalDisk, type StorageModuleOptions } from '@nestjs/storage';

export function createStorageOptions(config: ConfigService): StorageModuleOptions {

  const appUrl = config.getOrThrow<string>('app.url');
  const root = config.getOrThrow<string>('storage.root');
  
  return {
    default: 'private',
    disks: {
      photos: new LocalDisk({ root: `${root}/photos`, publicUrl: `${appUrl}/photos` }),
      private: new LocalDisk({
        root: `${root}/private`,
        signedUrls: {
          baseUrl: `${appUrl}/files`,
          // multiple keys in rotation, first for new url signing
          keys: [config.getOrThrow<string>('storage.signingKey')],
        },
      }),
    },
  };
}
