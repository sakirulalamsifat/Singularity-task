import express from 'express'
import { pg } from '../config/database'
import {
  checkAuthorizaion,
  checkModule,
  verifyPassword,
  tokenGenerate,
  hassPasswordGenerate,
} from '../middleware'
import { PasswordValidator, UserCreateValidator } from '../middleware/validator'
import {
  OK,
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  UNAUTHORIZED,
} from '../helpers/responseHelper'
import {
  Users,UserTypes
} from '../models'

const router = express.Router()

const somePartOfLogin = async (user, req, res, use_temp_password = false) => {
  let { user_id, email, user_type, name, usertype, created_by } = user,
    login_datetime = new Date()

  let { user_type_name } = usertype
  console.log('user_type ', user_type)

  let token = await tokenGenerate({
    user_id,
    email,
    name,
    user_type,
    created_by,
    login_datetime,
  })

  Users.update(
    { user_token: token, login_datetime },
    { where: { mobile: req.body.mobile } }
  )

  return res
    .status(200)
    .send(
      OK(
        {
          user_info: { user_id, email, name, user_type, user_type_name },
          token,
        },
        null,
        req
      )
    )
}

router.post('/login', async (req, res) => {
  try {
      let { mobile, password } = req.body
    console.log(req.body)

    let user = await Users.findOne({
      where: { mobile: mobile },
      include: [
        { model: UserTypes, as: 'usertype', attributes: ['user_type_name'] },
      ],
    })

      console.log(req.user_info);
    if (user) {
      if (!user.password) {
        return res
          .status(400)
          .send(BAD_REQUEST(null, req.i18n.__('usernotregistered'), req))
      }

      let match = await verifyPassword(password, user.password)
      console.log(match)

      if (!match) {
        return res
          .status(400)
          .send(BAD_REQUEST(null, req.i18n.__('Password does not match'), req))
      } else {
        await somePartOfLogin(user, req, res)
      }
    } else {
      return res
        .status(400)
        .send(BAD_REQUEST(null, req.i18n.__('user_does_not_exist'), req))
    }
  } catch (e) {
    console.log(e)
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

router.post(
  '/change_password',
  async (req, res, next) => {
    await PasswordValidator(req.body.newpassword, res, req, next)
  },
  checkAuthorizaion,
  async (req, res) => {
    try {
      let { newpassword, password } = req.body
      let { mobile } = req.user_info

      let user = await Users.findOne({ where: { mobile: mobile } })
      let match = await verifyPassword(password, user.password)

      if (match) {
        //generate hasspass,update database with hass pass and then send login credintial...
        let hasspass = await hassPasswordGenerate(newpassword)
        Users.update({ password: hasspass }, { where: { mobile } })
          .then((d) => {
            return res
              .status(200)
              .send(OK(null, req.i18n.__('password_update'), req))
          })
          .catch((e) => {
            return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
          })
      } else {
        return res
          .status(401)
          .send(UNAUTHORIZED(req.i18n.__('invalid_password'), req))
      }
    } catch (e) {
      return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
    }
  }
)

router.post('/logout', checkAuthorizaion, async (req, res) => {
  try {
    let { user_id } = req.user_info

    await Users.update({ fcm: null, user_token: null }, { where: { user_id } })

    return res.status(200).send(OK(null, null, req))
  } catch (e) {
    console.log(e)
    return res.status(500).send(INTERNAL_SERVER_ERROR(null, req))
  }
})

module.exports = router
