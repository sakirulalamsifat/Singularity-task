import Sequelize from 'sequelize'
require('dotenv').config()

//read veriable from .env file.......
const  postgresIp = process.env.postgresIp     
const  postgresPort = +process.env.postgresPort
const  postgresUserName = process.env.postgresUserName
const  postgresPassword = process.env.postgresPassword
const  postgresDBName = process.env.postgresDBName 

//create a connection string....
const postgres_con = `postgres://${postgresUserName}:${postgresPassword}@${postgresIp}:${postgresPort}/${postgresDBName}`
//console.log('postgres_con ', postgres_con)
//connect postgresql DB......
const sequelize = new Sequelize(postgresDBName, postgresUserName, postgresPassword, {
    dialect: 'postgres',

    host: postgresIp,
    dialectOptions: {
        encrypt: true,
    },
    options: {
   packetSize: 32768
 },
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
});

//console.log('sequelize ',sequelize)
//Check connection establish or not......
sequelize.authenticate()
    .then(function () {
        console.log("Postgres CONNECTED! ");
    })
    .catch(function (err) {
        console.log("Postgres Connection Error !!");
    })

module.exports.pg = sequelize;