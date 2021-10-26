zip -r function.zip . 
aws lambda update-function-code --function-name apr-calculator --zip-file fileb://function.zip
rm function.zip
