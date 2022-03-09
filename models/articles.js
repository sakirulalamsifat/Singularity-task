import DataTypes from 'sequelize'
import {pg as sequelize} from '../config/database'

const articles = sequelize.define('articles', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    article_header: {
        type: DataTypes.STRING,
        allowNull: false
    },
    article_body: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_by: {
        type: DataTypes.STRING,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue:sequelize.literal("(now() at time zone 'utc')")
    }
}, {
    tableName: 'articles',
    freezeTableName: true,
    timestamps: false
});

module.exports = articles;
