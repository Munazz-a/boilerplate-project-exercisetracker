const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username : {
    type : String,
    required : true
  }
});

const exerciseSchema = new mongoose.Schema({
  userId : {
    type : String,
    required : true
  },
  description : {
    type : String,
    required : true
  },
  duration : {
    type : Number,
    required : true
  },
  date : {
    type : Date,
    default : Date.now
  }
});
const Exercise = mongoose.model('Exercise', exerciseSchema);
const User = mongoose.model('User', userSchema);

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let userName;
let Users = [];
app.post("/api/users", async (req, res) => {
  userName = req.body.username;
  try {
    const newUser = new User({ username: userName });
    const savedUser = await newUser.save();
    res.json({
      username: savedUser.username,
      _id: savedUser._id
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/api/users", (req, res) => {
  res.json(Users);
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const userId = req.params._id;
  const { description, duration, date } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const exercise = new Exercise({
      userId,
      description,
      duration,
      date: date ? new Date(date) : new Date()
    });

    const savedExercise = await exercise.save();

    res.json({
      _id: user._id,
      username: user.username,
      description: savedExercise.description,
      duration: savedExercise.duration,
      date: savedExercise.date.toDateString()
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to save exercise" });
  }
});


app.get("/api/users/:_id/logs", async (req, res) => {
  const userId = req.params._id;
  const userName = req.body.username;

  try{
    const user = await User.findById(userId);
    const logs = await Exercise.find({ userId: userId });

    const log = logs.map( ex => ({
      description : ex.description,
      duration : ex.duration,
    date : ex.date.toDateString()
  }));

  res.json({
    _id : userId,
    username : userName,
    count : log.length,
    logs : log
  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
