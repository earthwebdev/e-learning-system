import express, { NextFunction, Request, Response } from 'express';
import LectureModel from '../models/lecture.model';
import cloudinary from '../config/cloudinary.config';
import LectureInterface from '../interface/lectures.interface';
import fs from 'fs';
import mongoose from 'mongoose';

export const getLectures = async (req: Request, res: any, next: NextFunction) => {
    //console.log(req.body);
    try {
        //console.log('aaaaa goes heres');
        return res.status(200).json(res.filteredResults);
    
    } catch (error: any) {
        res.status(400).json({
            status: false,
            message: error.message,
        });
    }
    
} 

//add lectures
export const addLectures = async (req: Request, res: Response) => {
    /* console.log(req.body);
    console.log(req?.file); */
    
    let cloudinaryData;
    try {
        const {title, content, duration} = req.body;
        if(!title || !content || !duration){
            return res.status(400).json({
                status: false,
                message: 'Please enter title, content and duration.'
            })
        }

        if (!req?.file) {
            return res.status(400).json({
                status: false,
                message: 'Please upload image or video.'
            });
        }
        const pathVideo = req?.file?.path ?? '' ;
        const uploadFileType = req?.file?.mimetype.split("/")[0];
        if(uploadFileType === 'video'){
            cloudinaryData = await cloudinary.v2.uploader.upload( pathVideo, {
                resource_type: 'video',
                folder: 'videos',
            } );
        } else{
            cloudinaryData = await cloudinary.v2.uploader.upload( pathVideo );
        }
        if(cloudinaryData){
            fs.unlink(pathVideo, function(err) {
                if (err) {
                    console.log(err);
                }
                console.log("File deleted successfully!");
             });
        }
        
        const secure_url = cloudinaryData.secure_url;
        const public_id = cloudinaryData.public_id;

        

        /* const data: LectureInterface = {
            title, content, duration, lectureUrl: secure_url, public_id: public_id
        }; */
        req.body.lectureUrl = secure_url;
        req.body.public_id = public_id;

        const lecture = new LectureModel(req.body);
        await lecture.save();
        res.status(200).json({
            status: true,
            data: lecture,
            message: 'Lecture added successfully.'
        })

    } catch (error: any) {
        console.log(error.message);
        return res.status(400).json({
            status: false,
            message: error.message
        })
    }
    /* const cloudinaryData = await cloudinary.v2.uploader.upload( pathVideo, {
        chunk_size: 7000000
      }, (error, result) => {console.log(error)}); */
}

export const updateLectures = async (req: Request, res: Response) => {
    try{
        const id: string = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                status: false,
                message: 'Please enter the valid id.'
            }) 
        }

        const lecture: any = await LectureModel.findOne({_id:id}) ;

        if(!lecture){
            return res.status(400).json({
                status: false,
                message: 'Please enter the valid id.'
            });
        }

        const {title, content, duration, isSubmitted} = req.body;
        if(!title || !content || !duration){
            return res.status(400).json({
                status: false,
                message: 'Please enter title, content and duration.'
            })
        }
        let cloudinaryData;
        
        if (req?.file && isSubmitted) {
            const pathVideo = req?.file?.path ?? '' ;
            const uploadFileType = req?.file?.mimetype.split("/")[0];
            if(uploadFileType === 'video'){
                cloudinaryData = await cloudinary.v2.uploader.upload( pathVideo, {
                    resource_type: 'video',
                    folder: 'videos',
                } );
            } else{
                cloudinaryData = await cloudinary.v2.uploader.upload( pathVideo );
            }
            if(cloudinaryData){
                //local public folder data deleted
                fs.unlink(pathVideo, function(err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("File deleted successfully!");
                });

                if(lecture?.public_id.startsWith('videos')){
                    //console.log(lecture.public_id, 'starts');                                
                    await cloudinary.v2.uploader.destroy( lecture?.public_id, { resource_type: 'video'});                
                }
                else{
                    await cloudinary.v2.uploader.destroy( lecture.public_id);                
                }
            }
            
            const secure_url = cloudinaryData.secure_url;
            const public_id = cloudinaryData.public_id; 
            req.body.lectureUrl = secure_url;
            req.body.public_id = public_id;
        }

        const updateData = await LectureModel.findOneAndUpdate({_id:id}, {$set: req.body}, { new: true});
        return res.status(200).json({
            status: true,
            data: updateData,
            message: 'Lecture updated successfully.'
        });                     
    }
    catch(error:any){
        return res.status(400).json({
            status: false,
            message: error.message,
        }) 
    }
}

//delete lectures 
export const deleteLectures = async (req: Request, res: Response) => {
    try{
        //console.log(req.params);
        const id: string = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                status: false,
                message: 'Please enter the valid id.'
            }) 
        }

        const lecture = await LectureModel.findOne({_id:id});
        if(lecture){
            //res.user.id === lecture.userId
            //console.log(lecture.public_id);
            if(lecture.public_id.startsWith('videos')){
                //console.log(lecture.public_id, 'starts');                                
                await cloudinary.v2.uploader.destroy( lecture.public_id, { resource_type: 'video'});                
            }
            else{
                await cloudinary.v2.uploader.destroy( lecture.public_id);                
            }
            await lecture.deleteOne();
            return res.status(200).json({
                status: true,
                message: 'Lecture deleted successfully.'
            })
        } else {
            return res.status(400).json({
                status: false,
                message: 'Please enter the valid id.'
            });
        }
    } catch(error: any){
        return res.status(400).json({
            status: false,
            message: error.message,
        }) 
    }

}