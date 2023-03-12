const Sequelize = require("sequelize");
const db = require("../config/configDb.js");

const CellPhone = db.define("cellphones", {
    imei: {
        type: Sequelize.STRING(15),
        primaryKey: true,
        allowNull: false
    },
    observations: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    sold: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    price: {
        type: Sequelize.DECIMAL,
        allowNull: true
    },
    modelId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

const Model = db.define("models", {
    model: {
        type: Sequelize.STRING,
        allownull: false,
    },
    storage: {
        type: Sequelize.INTEGER,
        allownull: false
    },
    ram: {
        type: Sequelize.INTEGER,
        allownull: false
    }
});

Model.hasMany(CellPhone, { foreignKey: 'modelId', as: 'cellphones' });
CellPhone.belongsTo(Model, { foreignKey: 'modelId', as: 'models' });

// Model.sync({ force: true });
// CellPhone.sync({ force: true });

module.exports = { CellPhone, Model }; 
