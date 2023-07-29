import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './core/filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NodeIdHelper } from './core/helper';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({ origin: '*' });
    const config = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Nestjs boilerplate project')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true
        })
    );
    app.useGlobalFilters(new AllExceptionFilter());
    await app.listen(3050);
    return app;
}
bootstrap()
    .then(async (app) => {
        console.log(`App is running on: ${await app.getUrl()} NodeId: ${NodeIdHelper.getNodeId()}`);
    })
    .catch((error: Error) => console.error(error.message));
