import mongoose, { Document } from "mongoose"
interface CourseInterface extends Document {
    title: string;
    description: string;
    instructorId: mongoose.Schema.Types.ObjectId;
    price: number;
    durutaion: number;
    enrolledStudent: mongoose.Schema.Types.ObjectId[];
    section: mongoose.Schema.Types.ObjectId[];
    categories: string[];
    content: string[];
}
export default CourseInterface;