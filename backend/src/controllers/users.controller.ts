import { Request, Response } from "express"
import UserModel from "../models/users.model";
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const userLoginController = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        //console.log(email, password);
        const user: any = await UserModel.findOne({email});
        if(!user){
            return res.status(401).json({
                status:false,
                message: 'Invalid user or password'
            });
        }else{
            const validPassword = await user.matchPassword(password);
            if(!validPassword){
                return res.status(401).json({
                    status:false,
                    message: 'Invalid user or password'
                });
            }
            const JWT_SECRT_KEY: string = process.env.JWT_SECRT_KEY ?? '';
            const token = jwt.sign({email:user.email}, JWT_SECRT_KEY, { expiresIn: '3d'});

            const updatedUser = await UserModel.findOneAndUpdate(
                { _id: user._id },
                { $set: { jwt: token } },
                { new: true }
              );
      
            return res.status(200).json({
                success: true,
                token: token,
                message: "User  logged in successfully.",
              });
        }
    } catch (error: any) {
        return res.status(400).json({
            status: false,
            message: error.message,
          });
    }   
}

export const userRegisteredController = async (req: Request, res: Response) => {
    try {
        const {fullName, email, password} = req.body;
        console.log(fullName, email, password);
        if(!fullName || !email || !password){
            return res.status(400).json({
                status:false,
                message: 'Please enter the required fields.'
            });
        }
        const user = await UserModel.findOne({email});
        if(user){
            return res.status(400).json({
                status:false,
                message: 'The user has already registered.'
            });
        }else{
            const user = new UserModel(req.body);
            await user.save();
            return res.status(200).json({
                success: true,
                data: user,
                message: "User successfully registered",
            });
        }
    } catch (error: any) {
        return res.status(400).json({
            status: false,
            message: error.message,
          });
    }
    
    
}