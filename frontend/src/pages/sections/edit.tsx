import { mixed, number, object, string } from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { successToast, errorToast } from "../../services/toastify.service";
import { getJWTToken } from "../../utils/helpers";
import { getDatasFromAxios, patchDataWithJWT } from '../../services/axios.service';

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";

const EditSectionsPage = () => {
    const [course, setCourse] = useState<any>({});    
    
    const navigate = useNavigate();
    const token = getJWTToken();
    const {id} = useParams();
    const getCourseData = async() => {
        const response = await getDatasFromAxios(`/courses?_id[eq]=${id}`, token);
        //console.log(response);
        if(response.status){
            setCourse(response);
          //return response.data;
        }
        else{
          errorToast('Course id not found');
          navigate('/courses');
        }
        
    }
    const courseValidationSchema = object().shape({
        title: string().required('Title is required'),
        description: string().required('Description is required'),
        duration: number().required('Duration is required'),
        price: number().required('Price is required')
    });
    
    //const handleSubmit = (values: any, {setSubmitting}: any)=> {
    const handleSubmit = async (values: any, {setSubmitting}: any) => {
        try {
            const dataCourse: any = {};
            /* console.log('tested');
            console.log(values); */            
            //const formData = new FormData();
            dataCourse.title = values.title;
            dataCourse.description = values.description;
            dataCourse.duration = values.duration;
            dataCourse.price = values.price;
                                    
            console.log(dataCourse);//return;

            const response: any = await patchDataWithJWT(`/courses/${id}`, dataCourse, token);
            if (response.status) {
                successToast(response.message);
                navigate("/courses");
            }
            //write all logics above here
            setSubmitting(false);
        } catch (error: any) {
            console.log(error);
            errorToast(error.message);
        }            
    }
    useEffect( () => {
      getCourseData();   
    }, [] );
   
   return (         
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Edit Course</h2>
                
                {
                    course.status && (
                        <Formik initialValues={{
                                        title: course.data[0].title,
                                        description: course.data[0].description,
                                        duration: course.data[0].duration,
                                        price: course.data[0].price,                                    
                                        }} validationSchema={ courseValidationSchema } onSubmit={handleSubmit} >
                            {({ values, isSubmitting }: any) => { 
                                    return(
                                        <Form>
                                            <div className="mb-4">
                                                <label htmlFor="title" className="block mb-2">Title</label>
                                                <Field value={values.title} className="w-full border px-4 py-2" name="title" id="title" placeholder="Enter the Title " />
                                                <ErrorMessage name="title" component="div" className="text-red-500 mt-1" />
                                            </div>

                                            <div className="mb-4">
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
                                            </div>

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
                                                {isSubmitting ? "Updating..." : "Update Course"}
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