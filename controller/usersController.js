import express from 'express'
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST,UNAUTHORIZED} from '../helpers/responseHelper'
import { Users } from '../models'
import Sequelize, { where } from 'sequelize'
import {isEditor, isAdministrator,hassPasswordGenerate} from '../middleware'
const router = express.Router()
const Op = Sequelize.Op



router.post('/create_editor',isAdministrator,async(req,res)=>{

    try{

        let { name, password, email, mobile } = req.body
        
        const existing_editor =await Users.findOne({ where: { user_type: 2 } })
        
        if (existing_editor) {
            await existing_editor.destroy()
        }

        const hashPassword=await hassPasswordGenerate(password)

        const updated_administrator_profile = await Users.create({ name, password: hashPassword, email, mobile, user_type: 2, created_by: req.user_info.name })
        
        const response = {
            id:updated_administrator_profile.user_id,
            name: updated_administrator_profile.name,
            mobile: updated_administrator_profile.mobile,
            email: updated_administrator_profile.email,
            created_by: updated_administrator_profile.created_by,
            user_type:updated_administrator_profile.user_type
        }
        
        return res.status(200).send(OK( response, 'new Editor created', req));


    }catch(e){
        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
}

})


router.post('/update_administrator_profile',isAdministrator,async(req,res)=>{

    try{

        let { name, email, mobile } = req.body
        


        const updated_administrator_profile = await Users.update({ name,  email, mobile},{where:{user_type:1}})
        
       
        
        return res.status(200).send(OK( 'administrator profile updated', 'administrator profile updated', req));


    }catch(e){
        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
}

})

router.post('/update_editor_profile',isEditor,async(req,res)=>{

    try{

        let { name, email, mobile } = req.body
        


        const updated_editor_profile = await Users.update({ name,  email, mobile},{where:{user_type:2}})
        
       
        
        return res.status(200).send(OK( 'editor profile updated', 'editor profile updated', req));


    }catch(e){
        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
}

})


router.post('/delete_editor_profile',isAdministrator,async(req,res)=>{

    try{

        const { user_id } = req.body
        
        const delete_editor_profile = await Users.destroy({where: {
            [Op.and]: [
              { user_id: user_id } ,
              { user_type: 2 }
            ]
        }
        })
        
        
       
        
        return res.status(200).send(OK( 'editor profile Deleted', 'editor profile Deleted', req));


    }catch(e){
        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
}

})






module.exports = router;