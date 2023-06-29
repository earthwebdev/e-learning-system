import mongoose from 'mongoose';
import UserInterface from '../interface/user.interface';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema<UserInterface>({
    fullName: {
        type: String,
        minLength: [5,'Minimum length for full name should be 5'],
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
    },
    roles:{
        type: String,
        enum: ['student', 'instructor', 'admin'],
        dufault: 'student',
    },
    enrolledCourse: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'Course'
            }
        ]
    },
    jwt:{
        type: String,
    },
    fcm: {
        type: String,
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpired: {
        type: Date,
    }
},
{
    timestamps: true,
});
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10);
    const pwd = this.password;
    const encryptPassword = await bcrypt.hash(pwd, salt);
    this.password = encryptPassword;
    next();
})
userSchema.methods.matchPassword = async function (pwd: string) {    
    return bcrypt.compare(pwd, this.password);
}

const User = mongoose.model<UserInterface>('User', userSchema);

export default User;