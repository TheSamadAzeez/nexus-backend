import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Nexus E-commerce API')
    .setDescription(
      `
## E-commerce Backend API

This API provides endpoints for:
- **Authentication**: Register, Login, Logout with JWT tokens
- **Users**: User management (Admin only)
- **Products**: CRUD operations with cursor-based pagination
- **Cart**: Shopping cart management
- **Orders**: Order creation and history
- **Checkout**: Mock payment processing

### Authentication
All endpoints except public ones require a valid JWT token.
Use the Bearer token format: \`Authorization: Bearer <token>\`

### Roles
- **ADMIN**: Full access to all endpoints
- **USER**: Limited access (read products, manage own cart/orders)
    `,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('products', 'Product catalog')
    .addTag('cart', 'Shopping cart')
    .addTag('orders', 'Order management')
    .addTag('checkout', 'Payment processing')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();
