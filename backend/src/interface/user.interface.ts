import mongoose, { Document } from "mongoose"
import { FlowNode } from "typescript";
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
    matchPassword: Function;
}
export default UserInterface;