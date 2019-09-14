const express = require('express');
const app = express();
app.use(express.json());

const s3 = require('./services/s3');

app.use(express.static(__dirname + '/public'));

app.get('/getPresignedUrlGET', (req, res) => {
    const presignedUrlGET = s3.getSignedUrl('getObject', {
        Bucket: process.env.BUCKET,
        Expires: 1 * 24 * 3600,
    });

    res.send(presignedUrlGET);
});

app.get('/getPresignedUrlPUT', (req, res) => {
    const presignedUrlPUT = s3.getSignedUrl('putObject', {
        Bucket: process.env.BUCKET,
        Expires: 1 * 24 * 3600,
    });

    res.send(presignedUrlPUT);
});

app.post('/getPresignedUrlPOST', (req, res) => {
    const { filename } = req.body;

    if (!filename) {
        throw new Error('Filename is missing.');
    }

    const presignedUrlPOST = s3.createPresignedPost({
        Bucket: process.env.BUCKET,
        Expires: 1 * 24 * 3600,
        Fields: {
            key: `${filename}`,
        },
        conditions: [
            { acl: 'private' },
            { success_action_status: '201' },
            ['starts-with', '$key', ''][('content-length-range', 0, 100000)],
            { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
        ],
    });

    res.json(presignedUrlPOST);
});

app.get('/getPublicUrl', (req, res) => {
    const { filename } = req.query;

    if (!filename) {
        throw new Error('Filename is missing');
    }

    const PUBLIC_URL = `https://${process.env.BUCKET}.s3-${process.env.REGION}.amazonaws.com/${filename}`;

    res.json(PUBLIC_URL);
});

app.use((err, req, res, next) => {
    res.send(err.message);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[PORT:${PORT}] Server is running...`);
});
