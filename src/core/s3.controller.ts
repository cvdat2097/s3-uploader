import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import S3Service from './s3.service';

@Controller()
export default class S3Controller {
    constructor(private readonly s3Service: S3Service) {}

    @Get('/getPresignedUrlGET')
    getPresignedUrlGET(@Query('filename') filename: string): string {
        return this.s3Service.getPresignedUrlGET(filename);
    }

    @Get('/getPresignedUrlPUT')
    getPresignedUrlPUT(): string {
        return this.s3Service.getPresignedUrlPUT();
    }

    @Post('/getPresignedUrlPOST')
    getPresignedUrlPOST(@Body('filename') filename: string): S3.PresignedPost {
        if (!filename) {
            throw new Error('Filename is missing');
        }

        return this.s3Service.getPresignedUrlPOST(filename);
    }

    @Get('/getPublicUrl')
    getPublicUrl(@Query('filename') filename: string): string {
        if (!filename) {
            throw new Error('Filename is missing');
        }

        return this.s3Service.getPublicUrl(filename);
    }
}
