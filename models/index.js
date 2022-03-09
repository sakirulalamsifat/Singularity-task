import {pg as Sequelize} from '../config/database'


import UserTypes from './user_types'
import Users from './users'
import Articles from './articles'


const Op = Sequelize.Op

//one to one relationship...users table has user_type...
UserTypes.hasOne(Users,{targetKey: 'user_type_id', foreignKey: 'user_type', as: 'users'})//work
Users.belongsTo(UserTypes,{foreignKey: 'user_type',as:'usertype'})//work


module.exports = {UserTypes,Users,Articles};