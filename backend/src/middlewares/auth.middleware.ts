import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import UserModel from '../models/users.model';
import UserInterface from "../interface/user.interface";

interface CustomRequest extends Request{
    user: {
        roles: string,
    };
}
interface CustomRequest2 extends Request{
    user: object;
}
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){        
        const token: string = req.headers.authorization.split(' ')[1];
        const secret_key: string = process.env.JWT_SECRT_KEY ?? "";
        //console.log(token, secret_key);
        //const verifyUser: any = jwt.verify(token, secret_key);    
        //const user = await UserModel.findOne({jwt: token});
        //console.log(verifyUser);
        try {
            jwt.verify(token, secret_key, async (err, decode: any) => {
                //console.log(decode);
                if (err) { 
                    //console.log('not worked');
                    return res.status(401).json({ staus:false, message: err.message}); 
                }
                const user: any = await UserModel.findOne({email: decode.email}).select('-password');
                req.user = user;
                return next(); 
            })
        } catch (error: any) {
            //console.log('not workingssss');
            return res.status(401).json({
                status: false,
                message: error.message
            });
        }
        /* if(verifyUser){
            const user: any = await UserModel.findOne({email: verifyUser.email}).select('-password');
            req.user = user;
            //console.log(req.user);
            next();
        }else{
            res.status(401).json({
                status: false,
                message: 'You are not authorised to access this resource.'
            })
        } */
    }
}


export const authorize = (...roles: any) => async (req: Request, res: Response, next: NextFunction) => {
    //console.log(datas, req.user.roles);
    const reqUser: any = req.user ?? '';
    //const email = reqUser.email ?? '';
    //const user: any = await UserModel.findOne({email}).select('roles');
    //console.log(reqUser?.roles, roles);return;
    if(! roles.includes(reqUser?.roles)){
        res.status(401).json({
            status: false,
            message: 'You are not authorized to access this resource.',
        })
    } else {
        next();
    }
    
} 