#!/bin/bash

# Use set -e to terminate the script on error
set -e

# Define paths
SHARED_FOLDER="../tweeter-shared"
LAYER_FOLDER="nodejs/node_modules"
LAYER_ZIP="nodejs.zip"
AWS_PROFILE="school"
LAYER_NAME="tweeter-lambda-layer"

# Check if the tweeter-shared folder exists
if [ ! -d "$SHARED_FOLDER" ]; then
  echo "Error: $SHARED_FOLDER folder does not exist. Please ensure the path is correct."
  exit 1
fi

# Create the nodejs/node_modules folder if it doesn't exist
echo "Preparing the Lambda layer folder..."
mkdir -p "$LAYER_FOLDER"

# Remove any existing tweeter-shared folder in node_modules
if [ -d "$LAYER_FOLDER/tweeter-shared" ]; then
  echo "Removing old tweeter-shared folder from $LAYER_FOLDER..."
  rm -rf "$LAYER_FOLDER/tweeter-shared"
fi

# Copy the tweeter-shared folder into node_modules
echo "Copying $SHARED_FOLDER into $LAYER_FOLDER..."
cp -rL "$SHARED_FOLDER" "$LAYER_FOLDER/"

# Remove the old nodejs.zip if it exists
if [ -f "$LAYER_ZIP" ]; then
  echo "Removing old $LAYER_ZIP..."
  rm "$LAYER_ZIP"
fi

# Zip the contents of the nodejs folder into nodejs.zip
echo "Creating $LAYER_ZIP from the nodejs folder..."
zip -r "$LAYER_ZIP" nodejs > /dev/null

# Upload the new Lambda layer to AWS
echo "Uploading the new Lambda layer to AWS..."
LAYER_ARN=$(aws lambda publish-layer-version \
  --layer-name "$LAYER_NAME" \
  --description "Updated tweeter-shared layer" \
  --zip-file "fileb://$LAYER_ZIP" \
  --compatible-runtimes "nodejs20.x" \
  --compatible-architectures "x86_64" \
  --profile "$AWS_PROFILE" \
  --query 'LayerVersionArn' \
  --output text)

if [ -z "$LAYER_ARN" ]; then
  echo "Error: Failed to upload the Lambda layer."
  exit 1
fi

echo "New Lambda Layer ARN: $LAYER_ARN"

# # Dynamically retrieve the latest version of the Lambda layer
# LAYER_ARN=$(aws lambda list-layer-versions \
#     --layer-name tweeter-lambda-layer \
#     --profile $AWS_PROFILE \
#     --query 'LayerVersions[0].LayerVersionArn' \
#     --output text)

# if [ -z "$LAYER_ARN" ]; then
#     echo "Error: Could not retrieve the latest Lambda layer version."
#     exit 1
# fi

# echo "Using Lambda Layer ARN: $LAYER_ARN"


# Update all Lambda functions to use the new layer
echo "Updating Lambda functions to use the new layer..."
source .server

i=1
IFS=$'\n' # Set IFS to newline to handle function name and handler pairs properly
for lambda_info in $EDIT_LAMBDALIST
do
  # Extract function name and handler from lambda_info and trim whitespace
  function_name=$(echo "$lambda_info" | cut -d '|' -f 1 | tr -d '[:space:]')

  # Check if function_name is empty
  if [ -z "$function_name" ]; then
    continue
  fi

  aws lambda update-function-configuration \
    --function-name "$function_name" \
    --layers "$LAYER_ARN" \
    --profile "$AWS_PROFILE" \
    1>>/dev/null
  echo "Lambda $i: $function_name updated with new layer."
  ((i=i+1))
done

echo "All Lambda functions updated with the new layer."