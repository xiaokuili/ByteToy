import { drizzle } from 'drizzle-orm/node-postgres';


// Create postgres connection
export const db = drizzle(process.env.DATABASE_URL!);




