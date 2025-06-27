// models/Category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true , unique: true }, // e.g., "Universities", "Business", "Technology"
  type: { type: String, enum: ['university', 'general'], required: true }, // 'university' or 'general'
  universities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'University' }], // only if type is 'university'
  icon: { type: String,default:"Briefcase"}, // e.g., 'university', 'business', 'technology'
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] // only if type is 'general'
});

const Category = mongoose.model('Category', categorySchema);
export default Category;
