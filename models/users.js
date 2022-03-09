

import DataTypes from 'sequelize'
import {pg as sequelize} from '../config/database'


const users = sequelize.define('Users', {
    user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    mobile: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: true
    },
 
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
 
    user_type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
 
    created_by: {
        type: DataTypes.BIGINT      
    },

    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue:sequelize.literal("(now() at time zone 'utc')")
        
    },

    user_token : {
        type: DataTypes.TEXT
    },
    login_datetime : {
        type: DataTypes.DATE,
    },
 
}, {
    tableName: 'Users',
    freezeTableName: true,
    timestamps: false
});

module.exports = users;
