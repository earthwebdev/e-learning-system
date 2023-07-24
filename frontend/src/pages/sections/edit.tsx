import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { successToast, errorToast } from "../../services/toastify.service";
import { getJWTToken } from "../../utils/helpers";
import { getDatasFromAxios, patchDataWithJWT } from '../../services/axios.service';

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";

const EditSectionsPage = () => {
    const [section, setSection] = useState<any>({});    
    
    const navigate = useNavigate();
    const token = getJWTToken();
    const {id} = useParams();
    const getSectionData = async() => {
        const response = await getDatasFromAxios(`/sections/${id}`, token);
        console.log(response);
        if(response.status){
            setSection(response);
          //return response.data;
        }
        else{
          errorToast('Section id not found');
          navigate('/sections');
        }
        
    }
    const sectionValidationSchema = yup.object().shape({        
        title: yup.string().required('Section title is require'),
        lectures : yup.array().of(
            yup.object(
                {
                    title: yup.string().required('Lecture title is require'),
                    content: yup.string().required('Lecture content is require'),
                    duration: yup.number().required('Lecture duration is require'),
                    file: yup.string().required('Lecture file is require'),
                }
            )
        )            
      });
    
    //const handleSubmit = (values: any, {setSubmitting}: any)=> {
    const handleSubmit = async (values: any, {setSubmitting}: any) => {
        try {
            const dataSection: any = {};
            /* console.log('tested');
            console.log(values); */            
            //const formData = new FormData();
            dataSection.title = values.title;
            /* dataSection.description = values.description;
            dataSection.duration = values.duration;
            dataSection.price = values.price; */
                                    
            console.log(dataSection);//return;

            const response: any = await patchDataWithJWT(`/sections/${id}`, dataSection, token);
            if (response.status) {
                successToast(response.message);
                navigate("/sections");
            }
            //write all logics above here
            setSubmitting(false);
        } catch (error: any) {
            console.log(error);
            errorToast(error.message);
        }            
    }
    useEffect( () => {
      getSectionData();   
    }, [] );
   
   return (         
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Edit Section</h2>
                
                {
                    section.status && (
                        <Formik initialValues={{
                                        title: section.data.title,                                                                            
                                        }} validationSchema={ sectionValidationSchema } onSubmit={handleSubmit} >
                            {({ values, isSubmitting }: any) => { 
                                    return(
                                        <Form>
                                            <div className="mb-4">
                                                <label htmlFor="title" className="block mb-2">Title</label>
                                                <Field value={values.title} className="w-full border px-4 py-2" name="title" id="title" placeholder="Enter the Title " />
                                                <ErrorMessage name="title" component="div" className="text-red-500 mt-1" />
                                            </div>

                                            {/* <div className="mb-4">
                                                <label htmlFor="description" className="block mb-2">Description</label>
                                                <Field value={values.description} component="textarea" className="w-full border px-4 py-2" name="description" id="description" placeholder="Enter the description " />
                                                <ErrorMessage name="description" component="div" className="text-red-500 mt-1" />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="duration" className="block mb-2">Duration</label>
                                                <Field value={values.duration} className="w-full border px-4 py-2" id="duration" name="duration" placeholder="Enter the Duration " />
                                                <ErrorMessage name="duration" component="div" className="text-red-500 mt-1" />
                                            </div>

                                            <div className="mb-4">
                                                <label htmlFor="price" className="block mb-2">Price</label>
                                                <Field value={values.price} className="w-full border px-4 py-2" id="price" name="price" placeholder="Enter the price " />
                                                <ErrorMessage name="price" component="div" className="text-red-500 mt-1" />
                                            </div> */}

                                            {/* <div className="mb-4">
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
                                            </div> */}

                                            <button type="submit"
                                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4"
                                            >
                                                {isSubmitting ? "Updating..." : "Update Section"}
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

export default EditSectionsPage;