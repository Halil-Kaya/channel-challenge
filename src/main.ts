import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './core/interceptor';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true
        })
    );
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.listen(3050);
    return app;
}
bootstrap()
    .then(async (app) => {
        console.log(`App is running on: ${await app.getUrl()}`);
    })
    .catch((error: Error) => console.error(error.message));
