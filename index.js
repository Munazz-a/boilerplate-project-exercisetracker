const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let userName = "";
app.post("/api/users", (req, res) => {
  userName = req.body.username;
  res.json({
    username : userName,
    _id : Math.floor(Math.random() * 1000000)
  })
});

app.post("/api/users/:_id/exercises", (req, res) => {
  const userId = req.params._id;
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date;
  //const name = req.body.username;

  res.json({
    _id : userId,
    username : userName,
    date : date ? new Date(date).toDateString() : new Date().toDateString(),
    duration : duration,
    description : description
    
  })
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
