import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true
        })
    );
    await app.listen(3050);
    return app;
}
bootstrap()
    .then(async (app) => {
        console.log(`App is running on: ${await app.getUrl()}`);
    })
    .catch((error: Error) => console.error(error.message));
