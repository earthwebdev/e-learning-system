import { mixed, number, object, string } from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { successToast, errorToast } from "../../services/toastify.service";
import { getJWTToken } from "../../utils/helpers";
import { getDatasFromAxios, patchDataWithJWT } from '../../services/axios.service';

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";

const EditLecturesPage = () => {
    const [lecture, setLecture] = useState<any>({});
    const [isRemoveUpload, setIsRemoveUpload] = useState<boolean>(true);
    
    const navigate = useNavigate();
    const token = getJWTToken();
    const {id} = useParams();
    const getLectureData = async() => {
        const response = await getDatasFromAxios(`/lectures?_id[eq]=${id}`, token);
        //console.log(response);
        if(response.status){
          setLecture(response);
          //return response.data;
        }
        else{
          errorToast('Lecture id not found');
          navigate('/lectures');
        }
        
    }
    const lectureValidationSchema = object().shape({
        title: string().required('Title is required'),
        content: string().required('Content is required'),
        duration: number().required('Duration is required'),
        file: mixed().nullable()
    });

    const removeFilesHandle = (setFieldValue: any) => {
        console.log('tested asdfasfsadf');
        setIsRemoveUpload(false);
        setFieldValue("file", null);
    }
    //const handleSubmit = (values: any, {setSubmitting}: any)=> {
    const handleSubmit = async (values: any, {setSubmitting}: any) => {
        try {
            /* console.log('tested');
            console.log(values); */            
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('content', values.content);
            formData.append('duration', values.duration);
            
            
            formData.append('isSubmitted', values.file?'true': 'false');
            if (!isRemoveUpload && values.file) {
                formData.append('photo', values.file);
            }
            //console.log(isRemoveUpload, values.file);return;

            const response: any = await patchDataWithJWT(`/lectures/${id}`, formData, token);
            if (response.status) {
                successToast(response.message);
                navigate("/lectures");
            }
            //write all logics above here
            setSubmitting(false);
        } catch (error) {
            console.log(error);
        }            
    }
    useEffect( () => {
      getLectureData();   
    }, [] );

    useEffect( () => {
        console.log('working');
        console.log(isRemoveUpload);
    }, [isRemoveUpload])
    /* const initialValues = {
      title: lecture.title,
      content: lecture.content,
      duration: lecture.duration,
      file: null,
    }; */
   return (         
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Edit Lecture</h2>
                
                {
                    lecture.status && (
                        <Formik initialValues={{
                                        title: lecture.data[0].title,
                                        content: lecture.data[0].content,
                                        duration: lecture.data[0].duration,
                                        file: null,
                                        lectureUrl: lecture.data[0].lectureUrl,
                                        public_id: lecture.data[0].public_id,
                                        }} validationSchema={ lectureValidationSchema } onSubmit={handleSubmit} >
                            {({ values, isSubmitting, setFieldValue }: any) => { 
                                    return(
                                        <Form>
                                            <div className="mb-4">
                                                <label htmlFor="title" className="block mb-2">Title</label>
                                                <Field value={values.title} className="w-full border px-4 py-2" name="title" id="title" placeholder="Enter the Title " />
                                                <ErrorMessage name="title" component="div" className="text-red-500 mt-1" />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="content" className="block mb-2">Content</label>
                                                <Field value={values.content} component="textarea" className="w-full border px-4 py-2" name="content" id="content" placeholder="Enter the content " />
                                                <ErrorMessage name="content" component="div" className="text-red-500 mt-1" />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="duration" className="block mb-2">Duration</label>
                                                <Field value={values.duration} className="w-full border px-4 py-2" id="duration" name="duration" placeholder="Enter the Duration " />
                                                <ErrorMessage name="duration" component="div" className="text-red-500 mt-1" />
                                            </div>

                                            <div className="mb-4">
                                                {
                                                    !isRemoveUpload ? (
                                                        <>                                                
                                                            <label htmlFor="file" className="block mb-2">File</label>
                                                            <input onChange={(e: any) => { setFieldValue("file", e.currentTarget.files[0]); }} type="file" className="w-full border px-4 py-2" name="file" id="file" />
                                                            <ErrorMessage name="file" component="div" className="text-red-500 mt-1" />
                                                        </>
                                                    ):(
                                                        isRemoveUpload && values.public_id && values.public_id.startsWith('videos')? (
                                                            <div className="aspect-w-16">
                                                                <video controls className="object-cover w-full h-full">
                                                                    <source src={values?.lectureUrl}></source>
                                                                </video>
                                                                <button onClick={(e) => {e.preventDefault(); removeFilesHandle(setFieldValue)}} type="button" className="bg-red-500 text-white mt-2 rounded-md py-1 px-1">Remove</button>
                                                            </div>
                                                        ):(<div className="aspect-w-16"><img className="w-50" src={values.lectureUrl} /><button onClick={(e) => {e.preventDefault(); removeFilesHandle(setFieldValue)}} type="button" className="bg-red-500 text-white mt-2 rounded-md py-1 px-1">Remove</button></div>) 
                                                    )
                                                }                                                                                        
                                            </div>

                                            <button type="submit"
                                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4"
                                            >
                                                {isSubmitting ? "Editing..." : "Edit Lecture"}
                                            </button> 
                                        </Form>
                                    );
                                }
                            }
                        </Formik>
                    )
                }
            
        </div>
    );  
}

export default EditLecturesPage;