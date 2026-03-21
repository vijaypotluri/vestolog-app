#!/bin/bash

# Update script for vestolog-app - just upload new build files
set -e

echo "🔄 Updating vestolog-app..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

echo "📦 Building React application..."
npm run build

echo "📁 Getting S3 bucket name..."
BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name vestolog-app-stack --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' --output text)

echo "⬆️  Uploading build files to S3 bucket: $BUCKET_NAME"
aws s3 sync build/ s3://$BUCKET_NAME/ --delete

echo "🌍 Invalidating CloudFront cache..."
DISTRIBUTION_ID="E1IHED8QTORFD7"
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "✅ Update complete!"
echo "📱 Your app is available at: https://$(aws cloudformation describe-stacks --stack-name vestolog-app-stack --query 'Stacks[0].Outputs[?OutputKey==`WebURL`].OutputValue' --output text)"
echo "⏳ It may take a few minutes for CloudFront to propagate changes."
