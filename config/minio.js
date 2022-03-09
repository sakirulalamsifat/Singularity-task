var Minio = require('minio')
require('dotenv').config()

const minioClient = new Minio.Client({
    endPoint: process.env.minioHost,
    port: +process.env.minioPort,
    useSSL: false,
    accessKey: process.env.minioAccessKey,
    secretKey: process.env.minioSecretKey
});


module.exports = {
    minioClient,
    allowedFileTypes: [ 'jpg', 'png', 'jpeg' ],

    minioBucketName:process.env.minioBucketName,
    minioHost:process.env.minioHost,
    minioPort:+process.env.minioPort,

    makeBucket: async () => {

        try {

            await minioClient.makeBucket(process.env.minioBucketName);
            //await minioClient.setBucketPolicy('pms', JSON.stringify('download'));
           // await minioClient.setBucketPolicy('voucher-images', JSON.stringify('download'));
            console.log('bucket initialized');

        }
        catch (e) {

            console.log('Minio :', e);

        }

    },

    getObject: async () => {

        await minioClient.fGetObject(process.env.minioBucketName, 'photo.jpg', '/tmp/photo.jpg');

    },
    removeObject: async (objectName=null) => { console.log(' objectName ',objectName)
       
       if(objectName){
        
          await minioClient.removeObject(process.env.minioBucketName, objectName);
       }
        

    },
    clearBucket: () => {

        return new Promise((resolve, reject) => {

            const objectsList = [];

            const objectsStream = minioClient.listObjects(process.env.minioBucketName, '', true);

            objectsStream.on('data', function (obj) {

                objectsList.push(obj.name);

            });

            objectsStream.on('error', function (e) {

                console.log(e);
                reject(e);

            });

            objectsStream.on('end', function () {

                minioClient.removeObjects(process.env.minioBucketName, objectsList, function (e) {

                    if (e) {

                        console.log('Unable to remove Objects ', e);
                        reject(e);

                    }
                    console.log('Removed the objects successfully');
                    resolve();

                });

            });

        });

    }

};
