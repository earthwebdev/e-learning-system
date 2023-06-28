import mongoose, { Document } from "mongoose"
interface UserInterface extends Document {
    fullName: string;
    email: string;
    password: string;
    roles: string;
    enrolledCourse: mongoose.Schema.Types.ObjectId[];
    resetPasswordToken: string;
    resetPasswordExpired: Date;
    jwt: string;
    fcm: string;
}
export default UserInterface;