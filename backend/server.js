const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./models/user');
const Room = require('./models/room');
const Message = require('./models/message');
const authmiddleware = require('./middleware/authmiddleware');

const app = express();
const port = 1300;

app.use(express.json());

const dbURI = 'mongodb+srv://group-chat-dev:9xpq1hZKrPsf2kA9@cluster0.odbpktp.mongodb.net/'
mongoose.connect(dbURI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server only after successful database connection
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => console.log('MongoDB connection error:', err));


// const users = [];

app.get('/', (req, res) => {
    res.send(`Hello world this is your chat server`);
});

app.post('/users', async (req, res) => {
    const {username, password} = req.body;
    /*
    if (users.find((user) => user.username === username)) {
        return res.status(409).json({ message: 'Username already exists' });
    }
    */
   try{
    const newUser = new User({username, password});
    const savedUser = await newUser.save();

    console.log(`User registered: ${savedUser.username} (Saved to DB with ID: ${savedUser._id})`);
    res.status(201).json({ message: 'User registered successfully', user: { username: savedUser.username, id: savedUser._id } });
   }catch (error) {
    // Handle potential validation errors (e.g., duplicate username)
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
    //users.push(newUser);
});

app.post('/login', async(req, res) => {
    const {username, password} = req.body;

    try{
      const user = await User.findOne({username});
      if(!user){
        return res.status(401).json({message: 'invalid username or password'});
      }
      const isPasswordValid = await user.comparePassword(password);
      if (isPasswordValid){
        const token = jwt.sign(
          {userId: user._id},
          'b7c4a1e6f9d385b2a8e1c7f0a3d9e5b8c2a6f1e9d4c7b3a8e2c5f0a1d9e3b8c',
          {expiresIn: '1h'}
        );
        res.status(200).json({message: 'login successful', token: token, user: {username: user.username, id: user._id}})
      }else{
        res.status(401).json({message: 'invalid username or password'})
      }
    }catch(error){
      console.error(`error occured: ${error}`)
      res.status(500).json({messsage: 'login failed'})
    }

    
    /*
    const user = users.find((u) => u.username === username && u.password === password);

    if(user){
        const token = 'dummy-jwt-token';
        res.status(200).json({ message: 'Login successful', token: token, user: { username: user.username, id: user.id } });
    }else{
        res.status(401).json({ message: 'Invalid username or password' });
    }
    */
});

app.post('/rooms', authmiddleware, async(req, res) => {
  const {name} = req.body;
  const creator = req.userId;
  if(!name){
    return res.status(400).json({message: 'Room name is required'});
  }
  try{
    const newRoom = new Room({name, creator});
    const savedRoom = await newRoom.save();
    const populatedRoom = await savedRoom.populate({ path: 'creator', select: 'username' });
    console.log(`Room created: ${populatedRoom.name} by user ${populatedRoom.creator.username} (ID: ${populatedRoom._id})`);
    res.status(201).json({ message: 'Room created successfully', room: populatedRoom });
  }catch(error){
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Room name already exists' });
    }
    console.error('Error creating room:', error);
    res.status(500).json({ message: 'Failed to create room' });
  }
});

app.get('/rooms', authmiddleware, async(req, res) => {
  try{
    const rooms = await Room.find().populate('creator', 'username');
    res.status(200).json({ message: 'Rooms retrieved successfully', rooms: rooms });
    console.log('rooms retrieved successfully')
  }catch(error){
    console.error('Error retrieving rooms:', error);
    res.status(500).json({ message: 'Failed to retrieve rooms' });
  }
});

app.post('/rooms/:roomId/messages', authmiddleware, async(req, res) => {
  const { content } = req.body;
  const sender = req.userId;
  const { roomId } = req.params;

  if (!content) {
    return res.status(400).json({ message: 'Message content is required' });
  }
  try{
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    const newMessage = new Message({ content, sender, room: roomId });
    const savedMessage = await newMessage.save();
    await savedMessage.populate('sender', 'username');
    console.log(`Message sent by user ${savedMessage.sender.username} in room ${roomId} (ID: ${savedMessage._id})`);
    res.status(201).json({ message: 'Message sent successfully', message: savedMessage });
  }catch(error){
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

app.get('/rooms/:roomId/messages', authmiddleware, async(req, res) => {
  const {roomId} = req.params;
  try{
     const room = await Room.findById(roomId);
     if(!room){
      return res.status(404).json({message: 'Room not found'});
     }
     const messages = await Message.find({room: roomId}).populate('sender', 'username').sort({createdAt :1});
     res.status(200).json({message: 'message retrieved successfully', messages: messages});
  }catch(error){
    console.error('Error retrieving messages:', error);
    res.status(500).json({message: 'Failed to retrieve messages'});
  }
});