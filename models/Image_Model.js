const fs = require('fs');
const path = require('path');
const { s3, bucket } = require('../config/s3');
const { GetObjectCommand, HeadObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

class ImageModel {
    constructor() {}

    async imageExists(key) {
        try {
            await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
            return true;
        } catch {
            return false;
        }
    }

    async getImageObject(key) {
        return s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    }

    async listImages(prefix = '') {
        const res = await s3.send(new ListObjectsV2Command({
            Bucket: bucket,
            Prefix: prefix ? `${prefix.replace(/^\/+/, '')}` : undefined
        }));
        const items = res.Contents?.map(o => o.Key).filter(Boolean) || [];
        return items;
    }
}

module.exports = new ImageModel();