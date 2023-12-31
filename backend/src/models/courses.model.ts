import mongoose, { Mongoose } from 'mongoose';
import CourseInterface from '../interface/course.interface';

const courseSchema = new mongoose.Schema<CourseInterface>({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    instructorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    enrolledStudent: {
        type:
            [
                {
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'User',
                }
            ],
    },
    sections:  
        [
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Section',
            }
        ],
    categories: [{tye: String}],
    content: [{type: String}]

},
{
    timestamps: true,
});

const Course = mongoose.model<CourseInterface>('Course', courseSchema);

export default Course;