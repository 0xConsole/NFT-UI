zip -r function.zip . 
aws lambda update-function-code --function-name apr-calculator-test --zip-file fileb://function.zip
rm function.zip
