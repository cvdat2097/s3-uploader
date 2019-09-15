import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

import { getPublicUrl } from '../utils/url';

const s3 = new S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
});

@Injectable()
export default class S3Service {
    getPresignedUrlGET(filename: string): string {
        const presignedUrlGET = s3.getSignedUrl('getObject', {
            Bucket: process.env.BUCKET,
            Key: filename,
            Expires: 1 * 24 * 3600,
        });

        return presignedUrlGET;
    }

    getPresignedUrlPUT(): string {
        const presignedUrlPUT = s3.getSignedUrl('putObject', {
            Bucket: process.env.BUCKET,
            Expires: 1 * 24 * 3600,
        });

        return presignedUrlPUT;
    }

    getPresignedUrlPOST(filename: string): S3.PresignedPost {
        const presignedUrlPOST = s3.createPresignedPost({
            Bucket: process.env.BUCKET,
            Expires: 1 * 24 * 3600,
            Fields: {
                key: `${filename}`,
            },
            Conditions: [
                { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
            ],
        });

        return presignedUrlPOST;
    }

    getPublicUrl(filename: string): string {
        const PUBLIC_URL = getPublicUrl(
            process.env.BUCKET,
            process.env.REGION,
            filename
        );

        return PUBLIC_URL;
    }
}
