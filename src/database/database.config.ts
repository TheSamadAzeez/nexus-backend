import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const databaseConfigSchema = z.object({
  host: z.string(),
  port: z.coerce.number(),
  user: z.string(),
  password: z.string(),
  database: z.string(),
});

export type DatabaseConfig = z.infer<typeof databaseConfigSchema>; // Export the DatabaseConfig type, z.infer is used to infer the type of the database configuration

export default registerAs('database', (): DatabaseConfig => {
  const config = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  };

  return databaseConfigSchema.parse(config); // Parse the config object to ensure it matches the schema, parse() is a Zod method that validates the config object against the schema, if the config is invalid, it will throw an error
});
