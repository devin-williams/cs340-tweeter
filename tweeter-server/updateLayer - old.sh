# Use this file to update the lambda layers for each lambda.
# First create the new lambda layer, or lambda layer version in aws by uploading the new lambda layer code.
# Then copy the arn for the lambda layer from aws to the .server LAMBDALAYER_ARN variable.
# Then run this script.

source .server

# Specify the AWS profile to use
AWS_PROFILE="school"

# Dynamically retrieve the latest version of the Lambda layer
LATEST_LAYER_VERSION=$(aws lambda list-layer-versions \
    --layer-name tweeter-lambda-layer \
    --profile $AWS_PROFILE \
    --query 'LayerVersions[0].LayerVersionArn' \
    --output text)

if [ -z "$LATEST_LAYER_VERSION" ]; then
    echo "Error: Could not retrieve the latest Lambda layer version."
    exit 1
fi

echo "Using Lambda Layer ARN: $LATEST_LAYER_VERSION"

i=1
PID=0
pids=()
IFS=$'\n' # Set IFS to newline to handle function name and handler pairs properly
for lambda_info in $EDIT_LAMBDALIST
do
    # Extract function name and handler from lambda_info and trim whitespace
    function_name=$(echo "$lambda_info" | cut -d '|' -f 1 | tr -d '[:space:]')

    # Check if function_name is empty
    if [ -z "$function_name" ]; then
        continue
    fi

    aws lambda update-function-configuration --function-name "$function_name" --layer "$LATEST_LAYER_VERSION" --profile $AWS_PROFILE 1>>/dev/null & 
    echo lambda $i, $function_name, updating lambda layer...
    pids[${i-1}]=$!
    ((i=i+1))
done

# Wait for each process to finish
for pid in "${pids[@]}"; do
    wait "$pid"
done

echo Lambda layers updated for all lambdas in .source