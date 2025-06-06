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
  AddedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // who added resource
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  type: { type: String, enum: ['video', 'article', 'documentation', 'other'], default: 'other' },
});

// Virtual for upvotes count
resourceSchema.virtual('upvotes').get(function () {
  return this.upvotedBy.length;
});

// Ensure virtuals are included in JSON output
resourceSchema.set('toJSON', { virtuals: true });
resourceSchema.set('toObject', { virtuals: true });



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
  instructor: String,
  badge: String,
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
