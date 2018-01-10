const mysql = require('mysql');
const fs = require('fs');
const config = require('../src/config/config.test');

function initDb() {
  const connection = mysql.createConnection(config.db.mysql);

  connection.connect((err) => {
    if (!err) {
      console.log('Database is connected ... \n\n');
    } else {
      console.log('Error connecting database ... \n\n');
      console.log(err);
    }
  });

  const initQuery = fs.readFileSync('./dumps/Airborne_test.sql').toString();

  connection.query(initQuery, (error) => {
    if (error) throw error;
    console.log('DB is dropped and created');
  });
  connection.end();
}

initDb();
