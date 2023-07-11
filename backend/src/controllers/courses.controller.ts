import express, { NextFunction, Request, Response } from 'express';
import LectureModel from '../models/courses.model';
import cloudinary from '../config/cloudinary.config';
import CourseInterface from '../interface/course.interface';
import fs from 'fs';
import mongoose from 'mongoose';

export const getCourses = async (req: Request, res: any, next: NextFunction) => {
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