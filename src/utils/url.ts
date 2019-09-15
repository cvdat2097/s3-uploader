export const getPublicUrl = (
    bucket: string,
    region: string,
    filename: string
): string => {
    return `https://${bucket}.s3-${region}.amazonaws.com/${filename}`;
};
