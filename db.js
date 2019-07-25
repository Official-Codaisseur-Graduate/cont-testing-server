const Sequelize = require('sequelize');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5432/postgres'
const sequelize = new Sequelize(connectionString, {define: { timestamps: false }})

// Heroku DATABASE_URL: postgres://uprirxcxkbrpkr:b238047354a4f0263aefbce4feccd3a4701cb9bda07d0cad427060b330da7466@ec2-54-246-84-100.eu-west-1.compute.amazonaws.com:5432/d98eep4745c0lc

sequelize.sync(
{ force:false }
)
  .then(() => {
    console.log('Sequelize updated database schema')
  })
  .catch(console.error)

module.exports = sequelize