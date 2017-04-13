# Cherrydoor

Cherrydoor is a real estate web application developed in MEAN(MongoDB, Express, AngularJS, Node.js).

## Before You Begin
Before you begin we recommend you read about the basic building blocks that assemble a MEAN.JS application:
* MongoDB - Go through [MongoDB Official Website](http://mongodb.org/) and proceed to their [Official Manual](http://docs.mongodb.org/manual/), which should help you understand NoSQL and MongoDB better.
* Express - The best way to understand express is through its [Official Website](http://expressjs.com/), which has a [Getting Started](http://expressjs.com/starter/installing.html) guide, as well as an [ExpressJS](http://expressjs.com/en/guide/routing.html) guide for general express topics. You can also go through this [StackOverflow Thread](http://stackoverflow.com/questions/8144214/learning-express-for-node-js) for more resources.
* AngularJS - Angular's [Official Website](http://angularjs.org/) is a great starting point. You can also use [Thinkster Popular Guide](http://www.thinkster.io/), and [Egghead Videos](https://egghead.io/).
* Node.js - Start by going through [Node.js Official Website](http://nodejs.org/) and this [StackOverflow Thread](http://stackoverflow.com/questions/2353818/how-do-i-get-started-with-node-js), which should get you going with the Node.js platform in no time.


## Prerequisites
Make sure you have installed all of the following prerequisites on your development machine:
* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* MongoDB - [Download & Install MongoDB](http://www.mongodb.org/downloads), and make sure it's running on the default port (27017).
* Bower - You're going to use the [Bower Package Manager](http://bower.io/) to manage your front-end packages. Make sure you've installed Node.js and npm first, then install bower globally using npm:
* Gulp - [Install gulp](http://gulpjs.com/). gulp is a toolkit that helps you automate painful or time-consuming tasks in your development workflow.

```bash
$ npm install -g bower
```

```bash
$ npm install --global gulp-cli
```

### Cloning The GitHub Repository
The recommended way to get Cherrydoor app is to use git to directly clone the cherrydoor repository:

```bash
$ git clone https://yash_sharma9091@bitbucket.org/cherrydoordev/cherrydoor.git
```
```bash
$ cd cherrydoor
```

## Quick Install
To install the dependencies, run this in the application folder from the command-line:

```bash
$ npm install
```

This command does a few things:
* First it will install the dependencies needed for the application to run.
* Create a `.env` file in the root folder in prject and paste this `NODE_ENV=cherrydoor-local` for local environment
* When the npm packages install process is over, npm will initiate a bower install command to install all the front-end modules needed for the application
* To update these packages later on, just run `npm update`

## Running Your Application

Run your application using npm:

```bash
$ npm start or gulp
```

## To resize images you need to install

Run this command in your terminal (For ubuntu)

```bash
$ sudo apt-get install imagemagick
```

Run this command in your terminal (For centos)

```bash
$ wget ftp://ftp.graphicsmagick.org/pub/GraphicsMagick/1.3/GraphicsMagick-1.3.23.tar.gz

$ tar zxvf GraphicsMagick-1.3.23.tar.gz

$ cd GraphicsMagick-1.3.23

$ ./configure --enable-shared

$ make

$ make install
```

Your application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)