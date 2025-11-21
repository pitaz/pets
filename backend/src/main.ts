import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3001;
  const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:3000';
  const nodeEnv = configService.get('NODE_ENV') || 'development';

  // CORS - Allow multiple origins for development and production
  const allowedOrigins = [
    frontendUrl,
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    // Allow all Vercel preview deployments
    /^https:\/\/.*\.vercel\.app$/,
    // Allow specific Vercel domains if needed
    'https://pets-wcc5.vercel.app',
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // In development, allow all origins
      if (nodeEnv === 'development') {
        return callback(null, true);
      }

      // Check if origin matches any allowed origin
      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        if (typeof allowedOrigin === 'string') {
          return origin === allowedOrigin;
        }
        if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return false;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        // Log the blocked origin for debugging
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  await app.listen(port);
  // console.log(`🚀 Backend running on ${configService.get('API_URL')}/api`);
}

bootstrap();
