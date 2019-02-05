const request = require('./DBFunctions')
const sqlite3 = require('sqlite3').verbose()

module.exports = () => {
  let db = new sqlite3.Database('./db/database.db', (err, msg)=>{
    if(err){
      return console.log(err.message)
    }

    let sql = `CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        time INTEGER NOT NULL,
        comment TEXT
      )`

    db.get(sql, (err, row)=>{
      if(err) return console.log(err.message)
      console.log("database connection successful")
    })
  })
  return db
}
