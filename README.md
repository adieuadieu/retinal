# Retinal

[Serverless Framework-based](https://www.github.com/serverless/serverless) AWS Lambda function triggered by S3 events to resize images with the excellent [Sharp](https://github.com/lovell/sharp) module. By using the Sharp module (which uses the libvips library), image processing can be 3x-5x faster than using ImageMagick, thus reducing the time your function spends running, which can potentially dramatically decrease your lambda function's cost. The function's behaviour can be controlled entirely with configuration.

[![CircleCI](https://img.shields.io/circleci/project/github/adieuadieu/serverless-sharp-image/master.svg?style=flat-square)](https://circleci.com/gh/adieuadieu/serverless-sharp-image)
[![Coveralls](https://img.shields.io/coveralls/adieuadieu/serverless-sharp-image/master.svg?style=flat-square)](https://coveralls.io/github/adieuadieu/serverless-sharp-image)
[![Codacy grade](https://img.shields.io/codacy/grade/cd743cc370104d49a508cc4b7689c1aa.svg?style=flat-square)](https://www.codacy.com/app/adieuadieu/serverless-sharp-image)
[![David](https://img.shields.io/david/adieuadieu/serverless-sharp-image.svg?style=flat-square)]()
[![David](https://img.shields.io/david/dev/adieuadieu/serverless-sharp-image.svg?style=flat-square)]()


## Contents
1. [What is it?](#what-is-it)
1. [Installation](#installation)
1. [Setup](#setup)
1. [Testing](#testing)
1. [Deployment](#deployment)
1. [Configuration](#configuration)
1. [Building](#building)
1. [Troubleshooting](#troubleshooting)
1. [Change log](#change-log)


## What is it?
A tool to take images uploaded to an S3 bucket and produce one or more images of varying sizes, optimizations and other operations all controlled from a simple configuration file. It does this by creating an AWS Lambda function with the help of the [Serverless Framework](https://www.github.com/serverless/serverless).


## Installation
Please note, currently the master branch is broken, please use [v0.11.0](https://github.com/adieuadieu/retinal/releases/tag/v0.11.0) instead. See [comment](https://github.com/adieuadieu/retinal/issues/57#issuecomment-355129305).

Installation can be achieved with the following commands

```bash
git clone https://github.com/adieuadieu/serverless-sharp-image
cd serverless-sharp-image
yarn install
```

(It is possible to exchange `yarn` for `npm` if `yarn` is too hipster for your taste. No problem.)

Or, if you have `serverless` installed globally:

```bash
serverless install -u https://github.com/adieuadieu/serverless-sharp-image
```

Then, modify the `config.js` and `event.json` files, adapting them to your needs. More on configuration [below](#configuration).


## Setup

### Credentials

You must configure your AWS credentials either by defining `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environmental variables, or using an AWS profile. You can read more about this on the [Serverless Credentials Guide](https://serverless.com/framework/docs/providers/aws/guide/credentials/). It's a bit of a pain in the ass if you have many projects/credentials.

In short, either:

```bash
export AWS_PROFILE=<your-profile-name>
```

or

```bash
export AWS_ACCESS_KEY_ID=<your-key-here>
export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>
```


## Testing

Make sure the bucket in `config.js` exists.

Then:

```bash
yarn test
```

You can also try out the service by invoking it. First deploy it with `yarn run deploy` and then you can invoke your function with `yarn run invoke`. This will invoke the function with the test event in `event.json`. You may need to tweak this file to match your setup.


## Deployment

```bash
serverless deploy -v
```

This package bundles a lambda-execution-environment-ready version of the Sharp library which allows you to deploy the lambda function from any OS.


## Configuration
The lambda service is designed to be controlled by configuration. From the configuration you can setup how one or more images will be manipulated, with direct access to the underlying methods of Sharp for full control.

```js
module.exports = {
  name: 'serverless-sharp-image',
  provider: {
    profile: 'CH-CH-CH-CHANGEME',
    stage: 'dev',
    region: 'us-east-1',
  },  
  sourceBucket: 'my-sweet-unicorn-media',
  sourcePrefix: 'originals/',
  destinationBucket: 'my-sweet-unicorn-media',
  destinationPrefix: 'web-ready/',
  all: [['rotate'], ['toFormat', 'jpeg', { quality: 80 }]],
  outputs: [
    {
      key: '%(filename)s-200x200.jpg',
      params: {
        ACL: 'public-read',
      },
      operations: [['resize', 200, 200], ['max'], ['withoutEnlargement']],
    },
    {
      key: '%(filename)s-100x100.jpg',
      operations: [['resize', 100, 100], ['max'], ['withoutEnlargement']],
    },
  ],
}
```


TODO: document configuration better/more detail


*all* - applied to the image before creating all the outputs

*outputs* - define the files you wish to generate from the source

- key: uses [sprintf](https://github.com/alexei/sprintf.js) internally
- params: set some specific S3 options for the image when uploaded to the destination S3 bucket. See more about the param options on the [AWS S3's upload method documentation](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property)
- operations: Lists of Sharp's [methods](http://sharp.readthedocs.io/en/stable/api/#resizing) you want performed on your image. For example if you want to perform the Sharp method `sharp(image).resize(200, 300)` you would define this in your configuration as `["resize", 200, 300]`
Note that method's are performed in order they appear in the configuration, and differing order can produce different results.

### Available placeholders for use in the output S3 object's key

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
    `%(crumbs[2])s` - "pixie"  

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


## Building

Although not necessary (it's pre-packaged/included), if you'd like, you can build the [sharp](https://github.com/lovell/sharp) module native binaries for Lambda yourself with:

```bash
yarn build:sharp
```

This requires that you have [Docker](https://www.docker.com/) installed and running. More info [here](https://github.com/adieuadieu/serverless-sharp-image/tree/master/lambda-sharp).


## Troubleshooting

<details id="EMTBwg">
  <summary>How can I use an existing bucket for my original images and processed output images?</summary>
  By default, Serverless tries to provision all the necessary resources required by the lambda function by creating a stack in AWS CloudFormation. To use existing buckets, first remove the `s3` event section from the `serverless.yml` configuration file in the `functions.sharpImage.events` configuration, then remove the entire `resources` section from the `serverless.yml` file. Alternatively, if you'd like to use an existing bucket for the original image, but have a new processed-images output bucket created, only remove the s3 event section in `serverless.yml`.
</details>

<details id="ZtsBwg">
  <summary>How can I use the same bucket for both the source and destination?</summary>
  To do this, remove the `imageDestinationBucket` section from the `resources` section in `serverless.yml`.
</details>

<details id="Jug">
  <summary>I keep getting a timeout error when deploying and it's really annoying.</summary>
  Indeed, that is annoying. I had the same problem, and so that's why it's now here in this troubleshooting section. This may be an issue in the underlying AWS SDK when using a slower Internet connection. Try changing the `AWS_CLIENT_TIMEOUT` environment variable to a higher value. For example, in your command prompt enter the following and try deploying again:

```bash
export AWS_CLIENT_TIMEOUT=3000000
```
</details>

<details id="MNnfYQ">
  <summary>Wait, doesn't Sharp use libvips and node-gyp and therefore need to be compiled in an environment similar to the Lambda execution environment?</summary>
  Yes; that is true. But, it's kind of annoying to have to log into an EC2 instance just to deploy this lambda function, so we've bundled a pre-built version of Sharp and add it to the deployment bundle right before deploying. It was built on an EC2 instance running *Amazon Linux AMI 2015.09.1 x86_64 HVM GP2* - amzn-ami-hvm-2016.03.3.x86_64-gp2 (ami-6869aa05 in us-east-1). You can take a look at it in `lib/sharp-*.tar.gz`.
</details>

<details id="sDT1nA">
  <summary>I got this error when installing: `Error: Python executable "/Users/**/miniconda3/bin/python" is v3.5.2, which is not supported by gyp.` What do I do?</summary>
  - Make sure you've got a recent version of `npm` installed.
  - Make sure you've got a recent version of node-gyp installed. You can do `npm install node-gyp -g` to make sure, but try the next steps first without doing this.
  - Set the path to python2 on your system. For example: `npm config set python /usr/bin/python2.7`
  - Having done the above, delete the `node_modules` directory in the project, and reinstall with `yarn install`
</details>

<details id="x3CH5Q">
  <summary>I got this error when deploying: `An error occurred while provisioning your stack: imageDestinationBucket`</summary>
  This means that the S3 bucket you configured for the `destinationBucket` (where processed images are uploaded) already exists in S3. To use an existing `imageDestinationBucket` simply remove the `imageDestinationBucket` section from the `resources` list in `serverless.yml`. See also [this question](#EMTBwg).
</details>

<details id="5It9SQ">
  <summary>Aaaaaarggghhhhhh!!!</summary>
  Uuurrrggghhhhhh! Have you tried [filing an Issue](https://github.com/adieuadieu/serverless-sharp-image/issues/new)?
</details>


## Change log

See the [CHANGELOG](https://github.com/adieuadieu/serverless-sharp-image/blob/master/CHANGELOG.md)
