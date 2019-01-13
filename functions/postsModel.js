import mongoose from 'mongoose'

// Set Posts Schema
const schema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: {
    type: String,
    required: [true, 'Username field is required'],
  },
  profile_image: {
    type: String,
    required: [true, 'Profile Image field is required'],
  },
  content: {
    type: String,
    required: [true, 'Content field is required'],
  },
}, {
    timestamps: true
  }),
  Posts = mongoose.model('posts', schema)

export default Posts
