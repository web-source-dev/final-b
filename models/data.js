// models/userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
  },
  work_email: {
    type: String,
  },
  organization: {
    type: String,
  },
  phone: {
  type: Number,
},
  street: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zip: {
    type: String,
  },
  youtube_url: {
    type: String,
  },
  facebook_url:{
    type: String,
  },
  linkden_url: {
    type: String,
},
  twitter_url: {
    type: String,
  },
   instagram_url: {
    type: String,
  },
  isAllowed :{
    type: Boolean,
    default : true
  },
  user_image :{
    type: String,
  }
});

module.exports = mongoose.model('User', userSchema);


