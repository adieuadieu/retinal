# Set some variables
SHARP_VERSION=$(npm show sharp version)
SHARP_DIRECTORY=sharp-$SHARP_VERSION
TARBALL=sharp-$SHARP_VERSION-aws-lambda-linux-x64-node-6.10.1.tar.gz

# Make a working directory
mkdir $SHARP_DIRECTORY
cd $SHARP_DIRECTORY

# NPM install sharp
npm init -y
npm install sharp@$SHARP_VERSION

# tarball the resulting node_modules
tar --no-xattrs --hard-dereference -cznshf $TARBALL node_modules

mv $TARBALL ../tarballs

# Clean up
cd ../
rm -Rf $SHARP_DIRECTORY
