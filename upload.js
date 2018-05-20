//pass in some data and get back a url
const upload = (data, S3, bucketName) => {
  let Key;
  const Bucket = {
    Bucket: bucketName
  };
  return S3.createBucketAsync(Bucket)
    .then(()=> {
      const extensions = data.split(';')[0].split('/');
      const extension = extensions[extensions.length - 1];
      const Body = new Buffer(data.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      Key = `${Math.random()}.${extension}`;

      return S3.putObjectAsync({
        Bucket: bucketName,
        ACL: 'public-read',
        Body,
        ContentType: `image/${extension}`,
        Key
      })
    })
    .then( result => {
      console.log(result);
      return `https://s3.amazonaws.com/${bucketName}/${Key}`
    });
}

module.exports = upload;
