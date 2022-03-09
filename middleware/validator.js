import password_Validator from 'password-validator';
import {pg} from '../config/database';
import  {INTERNAL_SERVER_ERROR,BAD_REQUEST} from '../helpers/responseHelper'

module.exports = {

    PasswordValidator: async(password,res,req,next) => { 
      try{

         //for password validation with table password_configuration....
       
         var special_format = /[!@#$%^&*`()_+\-=\[\]{};':"\\|,.<>\/?]/;
       
         var schema = new password_Validator();var passerror=null
          let isspecialcharecter = special_format.test(password)//true or false
 
         let passwordConfiger = await pg.query(`select * from password_configuration limit 1`);
         let{length,islowercase,isuppercase,isnumber,is_special_charecter} = passwordConfiger[0][0]
        
         let customeMessage = {
           "min":`password length must be ${length} or more`,
           "lowercase":`password contain lowercase charecter `,
           "uppercase":`password contain uppercase charecter `,
           "digits":`password contain digits `,
           "isspecialcharecter":'password must have contain special charecter'
         }
 
        length?(schema.is().min(length)):null
        islowercase?(schema.has().lowercase()):null
        isuppercase?(schema.has().uppercase()):null
        isnumber?(schema.has().digits()):null
 
        passerror = schema.validate(password, { list: true })
 
       if(passerror.length){  
         
        return res.status(400).send(BAD_REQUEST(null, customeMessage[passerror[0]] , req));
        
      }
         else{
           //             passerror =   true?!true?'error message':false:false
           passerror = is_special_charecter? !isspecialcharecter?customeMessage.isspecialcharecter :false :false
           if(passerror){

            return res.status(400).send(BAD_REQUEST(null, passerror , req));
         }
          else{

            next()
          }

         }

      }catch(e){

        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
    	

    },

    UserCreateValidator: async(req,res,next) => { 
      try{

        let {mobile=null,full_name=null} = req.body
        
        if(!mobile){

          return res.status(400).send(BAD_REQUEST(null, req.i18n.__('mobile_no_required') , req));
        }
        else if(!full_name){

          return res.status(400).send(BAD_REQUEST(null, req.i18n.__('full_name_required') , req));
        }

        else{

          next()
        }


      }catch(e){

        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }

    },


}