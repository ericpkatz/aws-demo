const aws = require('aws-sdk');

try {
  const env = require('./env');

  Object.assign(process.env, env);
}
catch(ex){
  console.log('set environment variables!!!!');
}

const S3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const data = require('./avatar');

/*
const bucket = {
  Bucket: process.env.AWS_BUCKET
};

S3.createBucket(bucket, (err, result)=> {
  if(err){
    console.log(err);
    return;
  }

  const extensions = data.split(';')[0].split('/');
  const extension = extensions[extensions.length - 1];
  const Body = new Buffer(data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const Key = `${Math.random()}.${extension}`;
  const Bucket = process.env.AWS_BUCKET;


  S3.putObject({
    Bucket,
    ACL: 'public-read',
    Body,
    ContentType: `image/${extension}`,
    Key
  }, (err, result)=> {
    if(err){
      console.log(err);
      return
    }
    const url = `https://s3.amazonaws.com/${Bucket}/${Key}`
    console.log(url);
  });
});
*/

const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/my_db');

const Image = conn.define('image', {
  url: Sequelize.STRING,
  name: Sequelize.STRING
});

Image.prototype.uploadToAWS = function(){
  return new Promise((resolve, reject)=> {
    const bucket = {
      Bucket: process.env.AWS_BUCKET
    };

    S3.createBucket(bucket, (err, result)=> {
      console.log(err);
      if(err){
        reject(err);
        return;
      }

      const extensions = data.split(';')[0].split('/');
      const extension = extensions[extensions.length - 1];
      const Body = new Buffer(data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const Key = `${Math.random()}.${extension}`;
      const Bucket = process.env.AWS_BUCKET;


      S3.putObject({
        Bucket,
        ACL: 'public-read',
        Body,
        ContentType: `image/${extension}`,
        Key
      }, (err, result)=> {
        if(err){
          reject(err);
          return
        }
        const url = `https://s3.amazonaws.com/${Bucket}/${Key}`
        this.url = url;
        resolve(this);
      });
    });

  });
  return this;
}

conn.sync({ force: true })
  .then(()=> {
    const image = Image.build({ name: 'profs avatar'});
    return image.uploadToAWS(data);
  })
  .then( image => {
    return image.save();
  });
