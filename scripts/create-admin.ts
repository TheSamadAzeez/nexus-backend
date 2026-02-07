import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import * as readline from 'readline';
import 'dotenv/config';

import { users } from '../src/database/schemas';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function createAdmin() {
  console.log('\n🔐 Create Admin User\n');
  console.log('='.repeat(40));

  // Get user input
  const email = await prompt('Email: ');
  if (!validateEmail(email)) {
    console.error('❌ Invalid email format');
    rl.close();
    process.exit(1);
  }

  const name = await prompt('Name: ');
  if (!name.trim()) {
    console.error('❌ Name is required');
    rl.close();
    process.exit(1);
  }

  const password = await prompt('Password (min 8 characters): ');
  if (password.length < 8) {
    console.error('❌ Password must be at least 8 characters');
    rl.close();
    process.exit(1);
  }

  const confirmPassword = await prompt('Confirm Password: ');
  if (password !== confirmPassword) {
    console.error('❌ Passwords do not match');
    rl.close();
    process.exit(1);
  }

  rl.close();

  // Connect to database
  const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });

  const db = drizzle(pool);

  console.log('\n⏳ Creating admin user...');

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const [admin] = await db
      .insert(users)
      .values({
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        name: name.trim(),
        role: 'ADMIN',
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
      });

    console.log('\n✅ Admin user created successfully!');
    console.log('='.repeat(40));
    console.log(`ID:    ${admin.id}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Name:  ${admin.name}`);
    console.log(`Role:  ${admin.role}`);
    console.log('='.repeat(40));
  } catch (error: unknown) {
    const pgError = error as { code?: string; message?: string };
    if (pgError.code === '23505') {
      console.error('❌ A user with this email already exists');
    } else {
      console.error(
        '❌ Error creating admin user:',
        pgError.message || 'Unknown error',
      );
    }
    await pool.end();
    process.exit(1);
  }

  await pool.end();
  console.log('\n🎉 Done!\n');
}

createAdmin().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
