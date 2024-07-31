import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './library';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ always: true, transform: true }));

  // Cors Middleware
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Apply Session Request
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  // Docs
  const config = new DocumentBuilder()
    .setTitle('Tote API')
    .setDescription('Tote API')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const OpenApiSpecification =
  app.use(
    '/api-docs',
    apiReference({
      spec: {
        content: document,
      },
    }),
  )

  app.use(cookieParser());
  await app.listen(process.env.PORT);
  Logger.log(`APP RUN ON PORT ${process.env.PORT}`);
}
bootstrap();
