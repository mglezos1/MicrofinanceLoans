const { Sequelize, DataTypes } = require('sequelize');

//Connection URI
let connectionString = "mysql://root:@localhost:3306/bcmloan"
const sequelize = new Sequelize(connectionString);

module.exports = function(){
  return new Promise((resolve, reject)=>{


    try {
      sequelize.authenticate().then( ()  => {
      console.log('Connection has been established successfully.');
      let borrower = sequelize.define('borrower', {
          // Model attributes are defined here
          borrowerfirstName: {
            type: DataTypes.STRING,
            allowNull: false
          },
          borrowerlastName: {
            type: DataTypes.STRING,
            allowNull: false
          },
          borrowerEmail: {
              type: DataTypes.STRING,
              allowNull: false
          }},{
              // Other model options go here
  
        });      
      let lender = sequelize.define('lender', {
          // Model attributes are defined here
          lenderfirstName: {
            type: DataTypes.STRING,
            allowNull: false
          },
          lenderlastName: {
            type: DataTypes.STRING,
            allowNull: false
          },
          lenderEmail: {
              type: DataTypes.STRING,
              allowNull: false
          }},{
          // Other model options go here
        });  
        //borrower.sync({force: true})
        //lender.sync({force: true})
        //sequelize.close();
  
        resolve( {
          sequelize,
          borrower,
          lender,
          DataTypes,
          Sequelize
  
        })
      })
  }catch (error) {
      console.error('Unable to connect to the database:', error);
  }
  

  })




}


