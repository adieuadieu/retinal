# Serverless Sharp Image
[Serverless-based](https://www.github.com/serverless/serverless) Lambda function to resize images based on S3 events with the awesome Sharp library

## Todo
- [ ] make it actually work/do something
- [ ] clean up dev-dependencies as there's shit in there we don't need
- [ ] add postinstall hook to create config.json from sample


## Configuration

```json
{
  "sourceBucket": "something",
  "sourcePrefix": "ok/",
  "destinationBucket": "changeme",
  "destinationPrefix": "yup/",
  "all": [
    ["toFormat", "webp"]
  ],
  "outputs": [
    [
      ["resize", 200, 200],
      ["max"],
      ["withoutEnlargement"],
      ["toFormat", "jpeg"]
    ],
    [
      ["resize", 100, 100],
      ["max"],
      ["withoutEnlargement"],
      ["toFormat", "jpeg"]
    ]
  ]
}
```

*all* - applied to the image before creating all the outputs
*outputs* - define the files you wish to generate from the source