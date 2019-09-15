import { NestFactory } from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import S3Module from './core/S3/s3.module';

const bootstrap = async () => {
    const app = await NestFactory.create<NestExpressApplication>(S3Module);

    app.useStaticAssets(__dirname + '/../public');

    const PORT = process.env.PORT || 5000;
    await app.listen(PORT);

    console.log(`[PORT:${PORT}] Server is running...`);
};

bootstrap();
