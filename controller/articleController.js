import express from 'express'
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST,UNAUTHORIZED} from '../helpers/responseHelper'
import {Articles, Users } from '../models'
import Sequelize, { where } from 'sequelize'
import {isEditor, isAdministrator} from '../middleware'
const router = express.Router()
const Op = Sequelize.Op



router.post('/create_article',isEditor,async(req,res)=>{

    try{

        let {article_header,article_body} = req.body

        let { user_id, name } = req.user_info
        
       

        const create_article = await Articles.create({ article_header, article_body, created_by:name })

        return res.status(200).send(OK( create_article, 'article posted', req));


    }catch(e){
        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
}

})

router.post('/edit_article',isEditor,async(req,res)=>{

    try{

        let {article_header,article_body, article_id} = req.body

        let {user_id,name} =req.user_info
        console.log(req.user_info)

        const update_article = await Articles.update({ article_header, article_body }, { where: { id: article_id } })
        
        
        return res.status(200).send(OK( 'article updated', 'article updated', req));


    }catch(e){
        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
}

})

router.get('/read_all_Articles',async(req,res)=>{

    try{

        

        const articles = await Articles.findAll({order: [['id', 'DESC']]})
        
        
        return res.status(200).send(OK( articles, 'article list', req));


    }catch(e){
        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
}

})


router.post('/read_one_Article_details',async(req,res)=>{

    try{

        let {article_id}=req.body

        const article = await Articles.findOne({ where: { id: article_id } })
        
        if (!article) {
            return res.status(400).send(BAD_REQUEST( null, 'article does not exist', req));    
        }
        
        
        return res.status(200).send(OK( article, 'article details', req));


    }catch(e){
        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
}

})



router.post('/delete_Article_by_administrator',isAdministrator,async(req,res)=>{

    try{

        let {article_id}=req.body

        const deleted_article = await Articles.destroy({ where: { id: article_id } })
        
        if (!deleted_article) {
            return res.status(400).send(BAD_REQUEST( null, 'article does not exist', req));    
        }
        
        
        return res.status(200).send(OK( null, 'article deleted', req));


    }catch(e){
        console.log(e)
        return  res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
}

})




module.exports = router;