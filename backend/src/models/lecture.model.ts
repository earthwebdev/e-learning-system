import mongoose, { Mongoose } from 'mongoose';
import LectureInterface from '../interface/lectures.interface';

const lectureSchema = new mongoose.Schema<LectureInterface>({
    title:{
        type: String,
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    lectureUrl:{
        type: String,
    },
    public_id: {
        type: String,
    }

},
{
    timestamps: true,
});

const Lecture = mongoose.model<LectureInterface>('Lecture', lectureSchema);

export default Lecture;