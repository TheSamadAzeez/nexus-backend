import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

import { users, products } from './src/database/schemas';

async function seed() {
  const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });

  const db = drizzle(pool);

  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const [admin] = await db
    .insert(users)
    .values({
      email: 'admin@nexus.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    })
    .onConflictDoNothing()
    .returning();

  if (admin) {
    console.log('✅ Created admin user: admin@nexus.com / admin123');
  }

  // Create test user
  const userPassword = await bcrypt.hash('user123', 10);
  const [testUser] = await db
    .insert(users)
    .values({
      email: 'user@nexus.com',
      password: userPassword,
      name: 'Test User',
      role: 'USER',
    })
    .onConflictDoNothing()
    .returning();

  if (testUser) {
    console.log('✅ Created test user: user@nexus.com / user123');
  }

  // Create sample products
  const sampleProducts = [
    {
      name: 'iPhone 15 Pro',
      description:
        'Latest Apple smartphone with A17 Pro chip and titanium design',
      price: '999.99',
      stock: 50,
      imageUrl: 'https://example.com/iphone15pro.jpg',
      category: 'Electronics',
    },
    {
      name: 'MacBook Pro 14"',
      description: 'Powerful laptop with M3 Pro chip',
      price: '1999.99',
      stock: 30,
      imageUrl: 'https://example.com/macbookpro.jpg',
      category: 'Electronics',
    },
    {
      name: 'AirPods Pro 2',
      description: 'Premium wireless earbuds with active noise cancellation',
      price: '249.99',
      stock: 100,
      imageUrl: 'https://example.com/airpodspro.jpg',
      category: 'Electronics',
    },
    {
      name: 'Nike Air Max 270',
      description: 'Comfortable running shoes with Air Max cushioning',
      price: '150.00',
      stock: 75,
      imageUrl: 'https://example.com/airmax270.jpg',
      category: 'Footwear',
    },
    {
      name: "Levi's 501 Jeans",
      description: 'Classic straight fit jeans',
      price: '79.99',
      stock: 200,
      imageUrl: 'https://example.com/levis501.jpg',
      category: 'Clothing',
    },
    {
      name: 'Sony WH-1000XM5',
      description: 'Industry-leading noise cancelling headphones',
      price: '349.99',
      stock: 45,
      imageUrl: 'https://example.com/sonywh1000xm5.jpg',
      category: 'Electronics',
    },
    {
      name: 'Kindle Paperwhite',
      description: 'E-reader with 6.8" display and adjustable warm light',
      price: '139.99',
      stock: 80,
      imageUrl: 'https://example.com/kindle.jpg',
      category: 'Electronics',
    },
    {
      name: 'Patagonia Nano Puff Jacket',
      description: 'Lightweight, windproof, and water-resistant jacket',
      price: '229.00',
      stock: 40,
      imageUrl: 'https://example.com/nanopuff.jpg',
      category: 'Clothing',
    },
    {
      name: 'Apple Watch Series 9',
      description: 'Advanced smartwatch with health and fitness tracking',
      price: '399.99',
      stock: 60,
      imageUrl: 'https://example.com/applewatch9.jpg',
      category: 'Electronics',
    },
    {
      name: 'Samsung QLED 65"',
      description: '4K smart TV with quantum dot technology',
      price: '1299.99',
      stock: 25,
      imageUrl: 'https://example.com/samsungqled.jpg',
      category: 'Electronics',
    },
    {
      name: 'Canon EOS R6',
      description: 'Professional mirrorless camera with full-frame sensor',
      price: '2499.99',
      stock: 15,
      imageUrl: 'https://example.com/canoneosr6.jpg',
      category: 'Electronics',
    },
    {
      name: 'DJI Mini 3 Pro',
      description: 'Compact drone with 4K camera and 38-minute flight time',
      price: '799.99',
      stock: 20,
      imageUrl: 'https://example.com/djimini3.jpg',
      category: 'Electronics',
    },
    {
      name: 'Adidas Ultraboost 22',
      description: 'Performance running shoes with boost cushioning',
      price: '180.00',
      stock: 90,
      imageUrl: 'https://example.com/adidasultraboost.jpg',
      category: 'Footwear',
    },
    {
      name: 'New Balance 990v6',
      description: 'Heritage running shoe with premium comfort',
      price: '175.00',
      stock: 85,
      imageUrl: 'https://example.com/newbalance990.jpg',
      category: 'Footwear',
    },
    {
      name: 'Puma RS-X',
      description: 'Retro-inspired lifestyle sneaker',
      price: '120.00',
      stock: 120,
      imageUrl: 'https://example.com/pumarsxj.jpg',
      category: 'Footwear',
    },
    {
      name: 'Converse Chuck Taylor',
      description: 'Classic canvas high-top sneaker',
      price: '65.00',
      stock: 150,
      imageUrl: 'https://example.com/chucktaylor.jpg',
      category: 'Footwear',
    },
    {
      name: 'The North Face Puffer Jacket',
      description: 'Insulated winter jacket with water resistance',
      price: '299.99',
      stock: 55,
      imageUrl: 'https://example.com/northfacepuffer.jpg',
      category: 'Clothing',
    },
    {
      name: 'Columbia Omni-Heat Jacket',
      description: 'Thermal reflective jacket for extreme cold',
      price: '249.99',
      stock: 50,
      imageUrl: 'https://example.com/columbiajacket.jpg',
      category: 'Clothing',
    },
    {
      name: 'Ralph Lauren Polo Shirt',
      description: 'Classic cotton polo in multiple colors',
      price: '89.99',
      stock: 180,
      imageUrl: 'https://example.com/ralphlaurenpolo.jpg',
      category: 'Clothing',
    },
    {
      name: 'Tommy Hilfiger T-Shirt',
      description: 'Premium cotton casual t-shirt',
      price: '54.99',
      stock: 220,
      imageUrl: 'https://example.com/tommyhilfiger.jpg',
      category: 'Clothing',
    },
    {
      name: 'Gucci Web Belt',
      description: 'Iconic leather and canvas belt with GG buckle',
      price: '449.99',
      stock: 30,
      imageUrl: 'https://example.com/guccibelt.jpg',
      category: 'Accessories',
    },
    {
      name: 'Rolex Submariner',
      description: 'Luxury diving watch with automatic movement',
      price: '9100.00',
      stock: 5,
      imageUrl: 'https://example.com/rolexsubmariner.jpg',
      category: 'Watches',
    },
    {
      name: 'Seiko Prospex',
      description: 'Durable sports watch with diving capabilities',
      price: '399.99',
      stock: 35,
      imageUrl: 'https://example.com/seikoprospex.jpg',
      category: 'Watches',
    },
    {
      name: 'Casio G-Shock',
      description: 'Shock-resistant digital watch',
      price: '129.99',
      stock: 140,
      imageUrl: 'https://example.com/casiogshock.jpg',
      category: 'Watches',
    },
    {
      name: 'Bose QuietComfort 45',
      description: 'Premium noise-cancelling headphones',
      price: '379.95',
      stock: 40,
      imageUrl: 'https://example.com/bosequietcomfort.jpg',
      category: 'Electronics',
    },
    {
      name: 'JBL Flip 6',
      description: 'Portable waterproof Bluetooth speaker',
      price: '129.99',
      stock: 95,
      imageUrl: 'https://example.com/jblflip6.jpg',
      category: 'Electronics',
    },
    {
      name: 'Ultimate Ears Boom 3',
      description: 'Compact wireless speaker with 360-degree sound',
      price: '149.99',
      stock: 85,
      imageUrl: 'https://example.com/uesboom3.jpg',
      category: 'Electronics',
    },
    {
      name: 'GoPro Hero 12 Black',
      description: 'Action camera with stunning 5.3K video',
      price: '499.99',
      stock: 28,
      imageUrl: 'https://example.com/goprohero12.jpg',
      category: 'Electronics',
    },
    {
      name: 'Insta360 X3',
      description: '8K 360-degree camera for immersive content',
      price: '899.99',
      stock: 18,
      imageUrl: 'https://example.com/insta360x3.jpg',
      category: 'Electronics',
    },
    {
      name: 'Nintendo Switch OLED',
      description: 'Hybrid gaming console with 7-inch OLED display',
      price: '349.99',
      stock: 45,
      imageUrl: 'https://example.com/nintendoswitch.jpg',
      category: 'Gaming',
    },
    {
      name: 'PlayStation 5',
      description: 'Next-generation gaming console with ultra-fast SSD',
      price: '499.99',
      stock: 20,
      imageUrl: 'https://example.com/ps5.jpg',
      category: 'Gaming',
    },
    {
      name: 'Xbox Series X',
      description: 'Most powerful gaming console with 4K support',
      price: '499.99',
      stock: 22,
      imageUrl: 'https://example.com/xboxseriesx.jpg',
      category: 'Gaming',
    },
    {
      name: 'Meta Quest 3',
      description: 'Standalone VR headset with mixed reality capabilities',
      price: '499.99',
      stock: 32,
      imageUrl: 'https://example.com/metaquest3.jpg',
      category: 'Electronics',
    },
  ];

  for (const product of sampleProducts) {
    await db.insert(products).values(product).onConflictDoNothing();
  }

  console.log(`✅ Created ${sampleProducts.length} sample products`);

  await pool.end();
  console.log('🎉 Database seeding completed!');
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
