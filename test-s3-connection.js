/**
 * AWS S3 Connection Test Script
 * ใช้สำหรับทดสอบการเชื่อมต่อกับ S3 bucket
 */

require('dotenv').config();
const { s3, bucket } = require('./config/s3');
const { ListObjectsCommand } = require('@aws-sdk/client-s3');

// สีสำหรับแสดงผลใน console
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
};

console.log(`${colors.blue}==============================================`);
console.log(`  AWS S3 Connection Test`);
console.log(`==============================================${colors.reset}\n`);

async function testS3Connection() {
    console.log(`${colors.yellow}Testing S3 connection...${colors.reset}\n`);

    // Test 1: List Buckets
    console.log('Test 1: Listing available buckets...');
    try {
        const listBucketsCommand = new ListBucketsCommand({});
        const listBucketsResponse = await s3Client.send(listBucketsCommand);
        
        if (listBucketsResponse.Buckets && listBucketsResponse.Buckets.length > 0) {
            console.log(`${colors.green}✓ Successfully connected to AWS S3${colors.reset}`);
            console.log(`  Found ${listBucketsResponse.Buckets.length} bucket(s):`);
            listBucketsResponse.Buckets.forEach(bucket => {
                const isTargetBucket = bucket.Name === bucketName;
                const mark = isTargetBucket ? `${colors.green}★${colors.reset}` : ' ';
                console.log(`  ${mark} - ${bucket.Name}`);
            });
            
            // Check if target bucket exists
            const targetBucketExists = listBucketsResponse.Buckets.some(b => b.Name === bucketName);
            if (!targetBucketExists) {
                console.log(`${colors.red}✗ Target bucket "${bucketName}" not found!${colors.reset}`);
                return false;
            }
        } else {
            console.log(`${colors.red}✗ No buckets found${colors.reset}`);
            return false;
        }
    } catch (error) {
        console.log(`${colors.red}✗ Failed to list buckets${colors.reset}`);
        console.error('Error:', error.message);
        return false;
    }

    console.log('');

    // Test 2: List Objects in Target Bucket
    console.log(`Test 2: Listing objects in bucket "${bucketName}"...`);
    try {
        const listObjectsCommand = new ListObjectsV2Command({
            Bucket: bucketName,
            Prefix: 'image/maintenance/',
            MaxKeys: 10
        });
        const listObjectsResponse = await s3Client.send(listObjectsCommand);
        
        if (listObjectsResponse.Contents && listObjectsResponse.Contents.length > 0) {
            console.log(`${colors.green}✓ Found ${listObjectsResponse.Contents.length} object(s) in image/maintenance/${colors.reset}`);
            listObjectsResponse.Contents.forEach((obj, index) => {
                const size = (obj.Size / 1024).toFixed(2);
                console.log(`  ${index + 1}. ${obj.Key} (${size} KB)`);
            });
        } else {
            console.log(`${colors.yellow}⚠ No objects found in image/maintenance/ (this is normal for a new bucket)${colors.reset}`);
        }
    } catch (error) {
        console.log(`${colors.red}✗ Failed to list objects${colors.reset}`);
        console.error('Error:', error.message);
        return false;
    }

    console.log('');

    // Test 3: Upload Test File
    console.log('Test 3: Uploading test file...');
    try {
        const testFileName = `image/maintenance/test-${Date.now()}.txt`;
        const testContent = `Test file uploaded at ${new Date().toISOString()}\nBucket: ${bucketName}\nRegion: ${process.env.AWS_REGION}`;
        
        const putObjectCommand = new PutObjectCommand({
            Bucket: bucketName,
            Key: testFileName,
            Body: Buffer.from(testContent),
            ContentType: 'text/plain',
            ACL: 'public-read'
        });
        
        await s3Client.send(putObjectCommand);
        
        const publicUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${testFileName}`;
        console.log(`${colors.green}✓ Successfully uploaded test file${colors.reset}`);
        console.log(`  File: ${testFileName}`);
        console.log(`  URL: ${publicUrl}`);
        console.log(`\n  ${colors.blue}You can test access by opening this URL in your browser:${colors.reset}`);
        console.log(`  ${publicUrl}\n`);
    } catch (error) {
        console.log(`${colors.red}✗ Failed to upload test file${colors.reset}`);
        console.error('Error:', error.message);
        
        if (error.name === 'AccessDenied') {
            console.log(`\n${colors.yellow}Possible causes:${colors.reset}`);
            console.log('  - IAM user does not have PutObject permission');
            console.log('  - Bucket policy does not allow uploads');
            console.log('  - AWS credentials are incorrect');
        }
        
        return false;
    }

    return true;
}

// Run the test
testS3Connection()
    .then(success => {
        console.log('');
        console.log(`${colors.blue}==============================================`);
        if (success) {
            console.log(`${colors.green}  ✓ All tests passed!${colors.reset}`);
            console.log(`${colors.blue}  Your S3 configuration is working correctly.`);
        } else {
            console.log(`${colors.red}  ✗ Some tests failed!${colors.reset}`);
            console.log(`${colors.blue}  Please check your AWS configuration.`);
        }
        console.log(`==============================================${colors.reset}\n`);
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error(`\n${colors.red}Unexpected error:${colors.reset}`, error);
        process.exit(1);
    });
