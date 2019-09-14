const getPublicUrl = (bucket, region, filename) => {
    return `https://${bucket}.s3-${region}.amazonaws.com/${filename}`;
};

module.exports = {
    getPublicUrl,
};
