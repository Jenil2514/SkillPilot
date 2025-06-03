// models/University.js
import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  semesters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Semester' }]
});

const University = mongoose.model('University', universitySchema);
export default University;
