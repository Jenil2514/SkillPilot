// models/Semester.js
import mongoose from 'mongoose';

const semesterSchema = new mongoose.Schema({
  number: { type: Number, required: true }, // e.g., 1, 2, 3 ...
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const Semester = mongoose.model('Semester', semesterSchema);
export default Semester;
