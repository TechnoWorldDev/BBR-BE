import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { RedisStore } from 'connect-redis';
import * as session from 'express-session';
import * as passport from 'passport';
import { AppModule } from './app.module';
import { RedisService } from './shared/cache/redis.service';
import { RestExceptionFilter } from './shared/error/handler/rest.exception.handler';
import { HttpResponseInterceptor } from './shared/interceptors/http-response-interceptor';
import { swaggerConfig } from './shared/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
    bodyParser: true,
  });

  const redisService = app.get(RedisService);
  const redisClient = redisService.getClient();

  app.setGlobalPrefix('api/v1');

  app.useGlobalInterceptors(new HttpResponseInterceptor());

  app.useGlobalFilters(new RestExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://bbr.local:3001',
      'http://bbr.local:3000',
      'https://bbradmin.inity.space',
      'https://bbr-admin.vercel.app',
      'https://bbrweb.inity.space',
      'https://www.bestbrandedresidences.com',
      'https://bestbrandedresidences.com',
      'https://admin.bestbrandedresidences.com',
      'https://brr-fe-web.vercel.app/',
      'https://pvd3n7dn-3000.inc1.devtunnels.ms'
    ],
    credentials: true,
  });

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      name: process.env.SESSION_NAME || 'my-api-session',
      secret: process.env.SESSION_SECRET || 'supersecretkey',
      resave: false,
      saveUninitialized: false,
      cookie: {
        domain: process.env.COOKIE_DOMAIN,
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24h session expiration
      },
    })
  );

  // ✅ Initialize Passport.js
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up Swagger using the imported configuration
  if (process.env.NODE_ENV === 'development') {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-docs', app, document);
  }

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
