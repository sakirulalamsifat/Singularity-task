import DataTypes from 'sequelize'
import {pg as sequelize} from '../config/database'

const user_types = sequelize.define('users_types', {
    user_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    user_type_name: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
}, {
    tableName: 'user_types',
    freezeTableName: true,
    timestamps: false
});

module.exports = user_types;
