import express, { Request, Response } from 'express';
import CourseModel from '../models/courses.model';
import SectionModel from  '../models/section.model';
import LectureModel from  '../models/lecture.model';
import UserModel from "../models/users.model"
import cloudinary from '../config/cloudinary.config';
import CourseInterface from '../interface/course.interface';
import fs from 'fs';
import mongoose from 'mongoose';
import LectureInterface from '../interface/lectures.interface';
import Section from '../models/section.model';

import sendNotification from '../firebase/sendNotification';

export const getCourses = async (req: Request, res: any) => {
    //console.log(req.body);
    try {
        //console.log('aaaaa goes heres');
        return res.status(200).json(res?.filteredResults);
    
    } catch (error: any) {
        res.status(400).json({
            status: false,
            message: error.message,
        });
    }
    
}

export const getCourseById = async (req: any, res: Response) => {
    try {
        const id = req.params.id;
        const course = await CourseModel.findById(id);
        if (!course) {
            res.status(400).json({
                status: false,
                message: 'Not found course',
            });
        } else {

            res.status(200).json({
                status: true,
                message: 'Course fetched successfully',
                data: course
            })
        }
    } catch (error: any) {
        console.log(error);
        res.status(400).json({
            status: false,
            message: error.message,
        });
    }
}

export const addCourses = async (req: Request, res: Response) => {
    try{
        const files: any = req.files;
        //console.log(req.body, files[1]);//return;
        const {title, description, price, duration, sections, categories, content} = req.body;
        if(!title || !description || !duration || !price){
            return res.status(400).json({
                status: false,
                message: 'Please enter title, description, price and duration.'
            });
        }
        const usersData: any = req.user;
        const instructorId = usersData?._id ?? 0;
        //console.log(sections, sections.length, sections[0].lectures.length);return;
        const course = new CourseModel({
            title,
            description,
            instructorId,
            price,
            duration,
            sections: [],
            categories,
            content
        });
        await course.save();
        
        if(!course){
            res.status(400).json({
                status: false,
                message: 'Course creation failed.'
            });
        } 

        if(sections.length > 0){
            //let courseDataForSections = [];
            for(let i=0; i< sections.length;i++){
                //console.log(sections[i], sections[i].lectures);return;
                //console.log(sections[i]);
                const sectionTitle = sections[i].title;
                const sectData = {
                    title: sectionTitle,
                    lectures: []
                }                
                const section = new SectionModel(sectData);
                await section.save();                
                if(!section){
                    res.status(400).json({
                        status: false,
                        message: 'Section creation failed.'
                    });
                }
                //courseDataForSections.push(section._id);
                let cloudinaryData;
                let secure_url, public_id;
                const lectures: any = sections[i].lectures;
                //console.log(lectures);
                
                if(lectures.length > 0){
                    for(let y=0; y< lectures.length;y++){
                        const lectureTitle = lectures[y].title;
                        const lectureContent = lectures[y].content;
                        const lectureDuration = Number(lectures[y].duration);
                        const photos: any = files;
                        if (photos.length > 0) {
                            const pathVideo = photos[y]?.path ?? '' ;
                            const uploadFileType = photos[y]?.mimetype.split("/")[0];
                            if(uploadFileType === 'video'){
                                cloudinaryData = await cloudinary.v2.uploader.upload( pathVideo, {
                                    resource_type: 'video',
                                    folder: 'videos',
                                } );
                            } else{
                                cloudinaryData = await cloudinary.v2.uploader.upload( pathVideo );
                            }
                            secure_url = cloudinaryData.secure_url;
                            public_id = cloudinaryData.public_id;
                        }
                                                                
                        const lectureData = {
                            title: lectureTitle,
                            content: lectureContent,
                            duration: lectureDuration,
                            lectureUrl: secure_url,
                            public_id
                        }
                        console.log(lectureData);
                        const lecture = new LectureModel(lectureData);
                        section.lectures.push(lecture._id);
                        
                        await lecture.save();
                        if(!lecture){
                            res.status(400).json({
                                status: false,
                                message: 'Lecture creation failed.'
                            });
                        }
                        
                        
                    }
                                       
                    course.sections.push(section._id);
                    await section.save();

                    
                }
                
            }
            await course.save();
            /* if(courseDataForSections.length > 0)
                await CourseModel.findOneAndUpdate({_id: course._id}, {$set: {sections: courseDataForSections}}, {new: true}); */
        }

        const users = await UserModel.find({roles: "student"});
        if(users.length > 0){
            users.forEach( async (user) => {
                if (user.fcm) {
                    const notif = await sendNotification(user.fcm, `There is a new course available ${course.title}. Please check you app to add to cart.`);
                }
            });
        }
        res.status(200).json({
            status: true,
            data: course,
            message: 'Course creation successfully.'
        });
    } catch(error: any){
        res.status(400).json({
            status: false,
            message: error.message,
        });
    }

}

//update the course by id
export const updateCourses =async (req: Request, res: Response) => {
    try {
        console.log(req.params.id);
        const {id} = req.params;
         if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                status: false,
                message: 'Please enter the valid id.'
            });
        };

         const course = await CourseModel.findById(id);
        if(!course){
            return res.status(400).json({
                status: false,
                message: 'Course not found.'
            });
        }
        //console.log(req.body);return;
        const {title, description, duration, price} = req.body;
        if(!title || !description || !duration || !price){
            return res.status(400).json({
                status: false,
                message: 'Please enter title, description, price and duration.'
            });
        }

        const data = {
            title, description, duration, price
        };

        const courseData = await CourseModel.findByIdAndUpdate(id, data, {new: true});

        return res.status(200).json({
            status: true,
            data: courseData,
            message: 'Course updated successfully.'
        }); 
    } catch (error: any) {
        console.log(error);
        /* return res.status(400).json({
            status: false,
            message: error.message
        }); */
    }
}

//delete the course with section and lectures
export const deleteCourses = async (req: Request, res: Response) => {
    try {
        console.log(req.params.id);
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                status: false,
                message: 'Please enter the valid id.'
            }) 
        }
        const course = await CourseModel.findOne({_id:id});
        if(!course){
            return res.status(400).json({
                status: false,
                message: 'Course not found',
            })
        }
        console.log(course);
        const sections = await SectionModel.find({_id: {$in: course.sections} });
        console.log(sections);
        if(!sections){

        }

        if(sections.length > 0){
            sections.map( async (section) => {
                console.log(section);
                const lectures = await LectureModel.find({_id: {$in: section.lectures}});
                if(!lectures){                
                }
                
                if(lectures.length > 0){
                    lectures.map(async(lecture) => {
                        console.log(lecture);
                        const public_id = lecture.public_id;
                        console.log(public_id);
                        if(public_id.startsWith('video')){
                            await cloudinary.v2.uploader.destroy(public_id, { resource_type: 'video'});
                        }else{
                            await cloudinary.v2.uploader.destroy(public_id);
                        }
                    })
                    await LectureModel.deleteMany({_id: {$in: section.lectures}});
                }
            })
            await SectionModel.deleteMany({_id: {$in: course.sections}});
        }

        await CourseModel.findByIdAndDelete(id);

        return res.status(200).json({
            status: true,
            message: 'Course deleted successfully.'
        });
    } catch (error: any) {
        return res.status(400).json({
            status: false,
            message: error.message,
        });
    }
}