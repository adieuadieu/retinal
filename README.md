# Serverless Sharp Image
[Serverless Framework-based](https://www.github.com/serverless/serverless) Lambda function triggered by S3 events to resize images with the awesome [Sharp](https://github.com/lovell/sharp) library. It's behaviour can be controlled entirely by configuration.

1. [What is it?](#what-is-it)
1. [Installation](#installation)
1. [Testing](#testing)
1. [Configuration](#configuration)


## What is it?
A tool to take images uploaded to an S3 bucket and produce one or more images of varying sizes, optimisations and other operations all controlled from a simple configuration file. It does this by creating an AWS Lambda function with the help of the [Serverless Framework](https://www.github.com/serverless/serverless).


## Installation
Installation can be achieved with the following commands

```bash
git clone https://github.com/adieuadieu/serverless-sharp-image
cd serverless-sharp-image
npm install
```

Then, modify the `config.json` and `event.json` files, adapting them to your needs. More on configuration [below](#configuration)


## Deployment

```bash
npm deploy
```
Write something here about about the need to compile sharp on an AWS AMI that matches the one run by lambda cuz Sharp adds a node Addon

When deploying into production, it would be prudent to deploy from an environment which is similar to that of AWS Lambda. More on that is available [here](http://sharp.readthedocs.io/en/stable/install/#aws-lambda).


## Testing

```bash
export AWS_PROFILE=<your-profile-name>
npm test
```


## Configuration
The lambda service is designed to be controlled by configuration. From the configuration you can setup how one or more images will be manipulated, with direct access to the underlying methods of Sharp for full control.

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

Outputs are lists of Sharp's [methods](http://sharp.readthedocs.io/en/stable/api/#resizing) you want performed on your image. For example if you want to perform the Sharp method `sharp(image).resize(200, 300)` you would define this in your configuration as `["resize", 200, 300]`
Note that method's are performed in order they appear in the configuration, and differing order can produce different results.

- key: uses [sprintf](https://github.com/alexei/sprintf.js) internally
- params: set some specific S3 options for the image when uploaded to the destination S3 bucket. See more about the param options on the [AWS S3's upload method documentation](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property)

### Available arguments for use in the output object key

- **key** -
  The full object key with which the service was invoked
  
  *Example*:
  - Given object key: `unicorns/and/pixie/sticks/omg.jpg`  
    `%(key)s` - "unicorns/and/pixie/sticks/omg.jpg"
    
- **type** -
  The Content-Type of the object, as returned by S3
  
  *Example*:
  - Given Content-Type: `image/jpeg`  
    `%(type)s` - "image/jpeg"

- **crumbs** -
  The crumbs of the S3 object as an array (e.g. the object key split by "/", not including the filename)
  
  *Example*:
   - Given object key: `unicorns/and/pixie/sticks/omg.jpg`  
    `%(crumbs[0])s` - "unicorns"  
    `%(crumbs[2])s` - "pixies"  
 
- **directory** -
  The "directory" of the S3 object
  
  *Example*:  
  - Given object key: `unicorns/and/pixie/sticks/omg.jpg`  
    `%(directory)s` - "unicorns/and/pixie/sticks" 
    
- **filename** -
  The file name (minus the last extension)

  *Example*:  
  - Given object key: `unicorns/and/pixie/sticks/omg.jpg`  
    `%(filename)s` - "omg"

- **extension** -
  The file's extension determined by the Content-Type returned by S3
  
  *Example*:  
  - Given Content-Type: `image/png`  
    `%(extension)s` - "png"  


## Todo
- [x] make it actually work/do something
- [ ] clean up dev-dependencies as there's shit in there we don't need
- [ ] add postinstall hook to create config.json, event.json from samples
- [ ] documentation
- [ ] fail gracefully when the S3 event is for a non-image object


## Issues
- [ ] objects with spaces in their key name results in "NoSuchKey: The specified key does not exist.]" error
- [ ] serverless stuff doesn't work correctly: bucket access policies, and auto-setup of trigger events

