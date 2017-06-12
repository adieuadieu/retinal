# What is this?

The tarballs here are created using the [lambci/docker-lambda](https://github.com/lambci/docker-lambda) images. They represent a containerised nearly-identical equivalent to the environment in which a real Lambda function gets invoked. This lets us build the sharp module locally, but targeting the [Lambda execution environment](http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html). The docker image produces the same tarball which contains the libvips library binaries if you were to build the sharp module on a Linux machine. We include it here so that it is possible to deploy the lambda function from any OS. The tarball is used during the Serverless deployment/packaging step to create the zip file for deploying the function to Lambda.

We dereference the symlinks when creating the tarball, which means a copy of many linux .so binaries are included in the tarball. We do this because, without the dereference, the symlinks would not be valid on MacOS or Windows systems causing the Serverless packaging step to fail.

It's also possible to create these tarballs directly on an AWS EC2 instance. To create the Lambda compatible archive, one can create an AWS EC2 instance using the Amazon Linux AMI on which Lambda is based (currently AMI amzn-ami-hvm-2016.03.3.x86_64-gp2). Then, set up the instance with all the necessary prerequisite dependencies:

```bash
sudo yum install -y gcc-c++ make
curl --silent --location https://rpm.nodesource.com/setup_6.x | sudo bash -
sudo yum install nodejs-6.10.1
sudo wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo
sudo yum install -y yarn
```

To create the Sharp tarball:

```bash
export SHARP_VERSION=0.17.3
mkdir sharp-$SHARP_VERSION
cd sharp-$SHARP_VERSION
yarn add sharp@$SHARP_VERSION
tar --no-xattrs --hard-dereference -cznshf sharp-$SHARP_VERSION-aws-lambda-linux-x64-node-6.10.1.tar.gz node_modules
```

Or, use the [`build.sh`](https://github.com/adieuadieu/serverless-sharp-image/blob/master/lambda-sharp/build.sh) script.
