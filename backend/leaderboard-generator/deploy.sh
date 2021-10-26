zip -r function.zip . 
aws lambda update-function-code --function-name leaderboard-generator --zip-file fileb://function.zip
rm function.zip
