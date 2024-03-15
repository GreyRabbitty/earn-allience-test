import { registerAs } from '@nestjs/config';

export default registerAs('youtube', () => ({
  apiKey: process.env.GOOGLE_API_KEY,
}));
