import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './src/lib/drizzle/schema/*',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL as string,
  },
  verbose: true,
  strict: true,
});
