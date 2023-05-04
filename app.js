const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://fpoint:fpoint@cluster0.mt3kix1.mongodb.net/Fahasa_point', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});


app.use('/api', require("./routes/usersRouter"))

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
