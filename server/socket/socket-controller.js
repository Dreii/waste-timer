let serv = require('http').createServer()
let io = require('socket.io')(serv)
const DBFunctions = require('../db/DBFunctions')

/**
 * [SocketController A controller for handling all of the incoming and outgoing requests for logged in users using wordswap]
 */

//A class of socket helpers
class SocketController{
  constructor(){
    this.PORT = 3231
    this.io = io

    this.connect = (db) => {

      this.io.on('connection', (socket)=>{
        console.log("new connection")
        SendCallbackList(socket, db)

        socket.on('NEW_CALLBACK', (comment) => {
          console.log("new callback")
          let insert = `INSERT INTO entries (time, comment) VALUES (datetime('now'), ${comment})`
          console.log(insert)
          DBFunctions.get(db, insert)
          .then(()=>{
            SendCallbackList(io.sockets, db)
          })
        })

        socket.on('disconnect', () => {
          console.log("disconnected")
        })
      })

      serv.listen(this.PORT, ()=>{
        console.log("CONNECTED to port: "+this.PORT);
      })
    }
  }
}

// SocketController.io = io

module.exports = new SocketController();

function SendCallbackList(socket, db){
  let select = `SELECT count(*) FROM entries WHERE time >= datetime('now', '-5 days')`
  DBFunctions.get(db, select)
  .then(res => {
    console.log("this many callbacks", res)
    socket.emit("CALLBACK_UPDATE", res['count(*)'])
  })
}
