import mongoose, { Document } from "mongoose"
interface LectureInterface extends Document {
    title: string;
    content: string;
    duration: number;
    lectureUrl: string;
    public_id: string;
}
export default LectureInterface;