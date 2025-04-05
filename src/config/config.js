import { CLIENT_VERSION, HOST, PORT } from '../constants/env.js';
import {
  DB1_NAME,
  DB1_USER,
  DB1_PASSWORD,
  DB1_HOST,
  DB1_PORT,
  REDIS_NAME,
  REDIS_HOST,
  REDIS_PORT,
} from './env.js';

export const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  databases: {
    USER_DB: {
      name: DB1_NAME || 'game_db',
      user: DB1_USER || 'root',
      password: DB1_PASSWORD || '1234',
      host: DB1_HOST || 'localhost',
      port: parseInt(DB1_PORT) || 3306,
    },
  },
  redis: {
    name: REDIS_NAME,
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
};
