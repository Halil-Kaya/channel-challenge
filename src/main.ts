import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './core/interceptor';
import { AllExceptionFilter } from './core/filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const config = new DocumentBuilder().setTitle('Nestjs base project').setVersion('1.0').build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true
        })
    );
    app.useGlobalFilters(new AllExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.listen(3050);
    return app;
}
bootstrap()
    .then(async (app) => {
        console.log(`App is running on: ${await app.getUrl()}`);
    })
    .catch((error: Error) => console.error(error.message));
