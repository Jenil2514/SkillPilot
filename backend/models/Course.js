import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const resourceSchema = new mongoose.Schema({
  title: String,
  url: String,
  description: String,
  tags: [String],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who added resource
  upvotes: { type: Number, default: 0 },
  comments: [commentSchema]
});
const checkpointSchema = new mongoose.Schema({
  title: String,
  resources: [{ type: mongoose.Schema.Types.ObjectId }]  // resource IDs
});
const courseSchema = new mongoose.Schema({
  name: String,
  image: String,
  views: { type: Number, default: 0 },
  description: String,
  resources: [resourceSchema],
  checkpoints: [checkpointSchema],
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
