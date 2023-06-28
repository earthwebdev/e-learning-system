import mongoose, { Document } from "mongoose"
interface LectureInterface extends Document {
    title: string;
    content: string;
    duration: number;
    lectureUrl: string;
}
export default LectureInterface;