
require('dotenv').config()
import express from 'express';
import debug from 'debug';
import {readdir} from 'fs' ;
import cors from 'cors';
import i18n from 'i18n-2';
import morgan from 'morgan';

import {localize,checkAuthorizaion,checkInvalidInput} from './middleware';
import authenticationController from './controller/authentication'

const https = require('https');


const app = express();
const PORT = process.env.PORT|| 2000;
const [ info, errorLog, debugLog ]= [ debug('info'), debug('warning'), debug('warnning') ];

app.use(express.static(__dirname+'/public'));
app.use(express.json({limit:'1024mb',strict:false}));
app.use (checkInvalidInput);
app.use(express.urlencoded({limit: '1024mb', extended: true}));

app.use(morgan('dev'));
app.use(cors())


i18n.expressBind(app, {locales: [ 'en' ] })

app.use(localize);


app.use("/api/auth/",authenticationController)

app.use(checkAuthorizaion);

readdir('./routes', (err, files) => {

    files.forEach(file => {

        app.use(`/`, require(`./routes/` + file));

    });

});





app.listen(PORT, () => {

    info(`🚀 Magic happens at port number ${PORT}`);

});



