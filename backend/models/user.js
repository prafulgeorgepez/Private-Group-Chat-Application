const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
    maxlength: 30,
    },
    password: {
        type: String,
    required: true,
    minlength: 6,
    }
}, {timestamps: true});

UserSchema.pre('save', async function(next){
    if (this.isModified('password')){
      try{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
      }catch(error){
        next(error);
      }
    }else{
        next();
    }
  });

UserSchema.methods.comparePassword = async function(candidatePassword){
  try{
    return await bcrypt.compare(candidatePassword, this.password);
  }catch (error){
    throw new Error(error);
  }
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
