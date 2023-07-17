import express, { Request, Response} from 'express';
import mongoose from 'mongoose';
import SectionModel from '../models/section.model';
import LectureModel from '../models/lecture.model';
import cloudinary from '../config/cloudinary.config';

export const getSections = async (req: Request, res: any) => {
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

export const getSectionsById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                status: false,
                message: 'No valid id exists.'
            });        
        }
        const section = await SectionModel.findById(id).populate('lectures');
        if (!section) {
            res.status(400).json({
                status: false,
                message: 'Not found section',
            });
        } else {
            res.status(200).json({
                status: true,
                message: 'Section fetched successfully',
                data: section
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

export const addSections = async (req: Request, res: Response) => {
    try{
        const files: any = req.files;
        //console.log(req.body, files[1]);//return;
        const {title, lectures} = req.body;
        if(!title || !lectures){
            return res.status(400).json({
                status: false,
                message: 'Please enter title, lectures.'
            });
        }
        const usersData: any = req.user;
        const instructorId = usersData?._id ?? 0;
        //console.log(lectures.length, 'datass');
        //console.log(sections, sections.length, sections[0].lectures.length);return;
        const sectData = {
            title,
            lectures: []
        }                
        const section = new SectionModel(sectData);
        await section.save();
        //console.log(section.lectures, 'lectures ==== ', section._id);    
        if(!section){
            res.status(400).json({
                status: false,
                message: 'Section creation failed.'
            });
        } 
        
        let cloudinaryData;
        let secure_url, public_id;
        //const lectures: any = sections[i].lectures;
        
        
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
                //console.log(lectureData);
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
            //console.log(section.lectures, 'lectures', section.title);                    
            //course.sections.push(section._id);
            await section.save();                    
        }
                
        res.status(200).json({
            status: true,
            data: section,
            message: 'Section creation successfully.'
        });
    } catch(error: any){
        res.status(400).json({
            status: false,
            message: error.message,
        });
    }
}
export const deleteSections = async (req: Request, res: Response) => {
    try {
        console.log(req.params.id);
        const {id} = req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                status: false,
                message: 'Please enter the valid id.'
            }) 
        }
        const section = await SectionModel.findOne({_id:id});
        if(!section){
            return res.status(400).json({
                status: false,
                message: 'Section not found',
            })
        }
                        
        const lectures = await LectureModel.find({_id: {$in: section.lectures}});                
        
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
        
        await SectionModel.findByIdAndDelete(id);
        
        return res.status(200).json({
            status: true,
            message: 'Section deleted successfully.'
        });
    } catch (error: any) {
        return res.status(400).json({
            status: false,
            message: error.message,
        });
    }
}