const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/User');

const UserSchema = new mongoose.Schema({
  username: String,

});

const User = mongoose.model('User', UserSchema);

app.post('/api/signup', async (req, res) => {
  try {
    const  {username} = req.body;
    console.log("Usename is"+req.body.username);
    
    const newUser = new User({ username });
    await newUser.save();
    res.json({ message: 'Username inserted successfully.' });
  } catch (error) {
    res.json({ error: 'An error occurred.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const {username} = req.body;
    const user = await User.findOne({ username });

    if (user) {
      return res.json({ error: 'User restore from database' });
   }
  console.log("User not registered")
  }
   catch (error) {
    res.json({ error: 'Aa error aave che.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
