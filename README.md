# Serverless Sharp Image
[Serverless-based](https://www.github.com/serverless/serverless) Lambda function to resize images based on S3 trigger events with the awesome [Sharp](https://github.com/lovell/sharp) library. It's behaviour can be controlled entirely by configuration.

## Todo
- [x] make it actually work/do something
- [ ] clean up dev-dependencies as there's shit in there we don't need
- [ ] add postinstall hook to create config.json, event.json from samples
- [ ] documentation

## Issues
- [ ] objects with spaces in their key name results in "NoSuchKey: The specified key does not exist.]" error
- [ ] serverless stuff doesn't work correctly: bucket access policies, and auto-setup of trigger events

## Installation

`npm install`

Write something here about about the need to compile sharp on an AWS AMI that matches the one run by lambda cuz Sharp adds a node Addon

## Test

`export AWS_PROFILE=<your-profile-name>`
`npm test`

## Configuration

```json
{
  "sourceBucket": "something",
  "sourcePrefix": "ok/",
  "destinationBucket": "changeme",
  "destinationPrefix": "yup/",
  "s3": {
    "params": {}
  },
  "all": [
    ["rotate"],
    ["toFormat", "jpeg"],
    ["quality", 80]
  ],
  "outputs": [
    {
      "key": "%(filename)s-200x200.jpg",
      "params": {
        "ACL": "public-read"
      },
      "operations": [
        ["resize", 200, 200],
        ["max"],
        ["withoutEnlargement"]
      ]
    },
    {
      "key": "%(filename)s-100x100.jpg",
      "operations": [
        ["resize", 100, 100],
        ["max"],
        ["withoutEnlargement"]
      ]
    }
  ]
}


```

*all* - applied to the image before creating all the outputs

*outputs* - define the files you wish to generate from the source

Outputs are lists of Sharp's [resizing](http://sharp.readthedocs.io/en/stable/api/#resizing) and [operations](http://sharp.readthedocs.io/en/stable/api/#operations) methods you want performed on your image. For example if you want to perform the Sharp method `sharp(image).resize(200, 300)` you would define this in your configuration as `["resize", 200, 300]`
Note that method's are performed in order they appear in the configuration, and differing order can produce different results.

key: uses [sprintf](https://github.com/alexei/sprintf.js) internally
