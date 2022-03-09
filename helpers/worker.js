
import nodemailer from 'nodemailer'
import {GenerateInvoiceAndSendInMail} from '../controller/invoiceController'
import {Mail} from './mail'
require('dotenv').config()
const cron = require("node-cron");

 const EveryMonthInvoiceMailCorn = ()=>{
  //GenerateInvoiceAndSendInMail()
    // generate invoice every first day of the month.
    cron.schedule('0 0 1 * *', () =>  {
      console.log('---------------------');
      console.log('Running Cron Job');
      //call for monthly invoices.......
      GenerateInvoiceAndSendInMail()
        
    },{scheduled: true,timezone:process.env.time_zone||"Asia/Dhaka"});

  }
/*
  const Mail = ({to,text,subject=null,html=null,attachments=null})=>{

    try{

          // create mail transporter
            let transporter = nodemailer.createTransport({


              service: 'gmail',//smtp.gmail.com //in place of service use host...
              secure: false,//true
              port: 587,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSOWRD
                  }, 
                tls: {
                    rejectUnauthorized: false
                    }
            })

            let mailOptions = {
                from: process.env.EMAIL,
                to: to, // list of receivers ...for multiple recever to:["mokbul15-469@diu.edu.bd","mokbul15-469@diu.edu.bd"]
                  subject: subject, // Subject line
                  text: text, // plain text body
                  //html: "<b>Hello world?</b>" // html body
              }
              //send file...
              if(attachments){

                mailOptions.attachments =attachments
              }

              transporter.sendMail(mailOptions, function(error, info) {

                  error ? console.log(error) : console.log("Email successfully sent! ID : ",info.messageId||null) 
                          //Email successfully sent! ID : <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

              })

    }catch(e){

      console.log(e)
    }

  }*/

module.exports = {Mail,EveryMonthInvoiceMailCorn}