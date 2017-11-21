# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).


## [Unreleased]
### Added
- added prettier-eslint to format code in pre-commit script
- Save source-image metadata along with the resized images as JSON in S3 (#21)
- Parsed EXIF data in JSON metadata (#21)
- Middleware for handling metadata, return false to skip saving output image to S3

### Changed
- migrated from webpack 1 to webpack 3.3.0 and serverless-webpack 2.0
- upgraded dependencies:  serverless@1.18.0, ava@0.21.0
- **BREAKING:** converted the user `/config.json` file to JS format `/config.js` (#41)


## [0.11.0] - 2017-07-23
### Changed
- add output image's ContentType to S3 Object's parameters (previously defaulted to `application/octet-stream`) (#43, #44)


## [0.10.0] - 2017-07-02
### Added
- added this CHANGELOG
- added new prebuilt sharp@0.18.2 binary for Lambda

### Changed
- upgraded dependencies: sharp@0.18.2, serverless@0.16.1
