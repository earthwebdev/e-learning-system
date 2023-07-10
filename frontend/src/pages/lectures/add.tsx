import { mixed, number, object, string } from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { successToast, errorToast } from "../../services/toastify.service";
import { getJWTToken } from "../../utils/helpers";
import {postDataWithJWT} from '../../services/axios.service';

import { useNavigate } from 'react-router-dom';


/* const validationSchema = yup.object({
        title: yup
            .string()  
            .required('Title is required'),
        content: yup
            .string()
            .min(10, 'Content should be of minimum 10 characters length')
            .required('Content is required'),
        duration: yup
                    .number()
                    .required('Duration is required'),
        file: yup
            .mixed().required('File is required')
  }); */
const AddLecturesPage = () => {
    const initialValues = { title: '', content: '', duration: '', file: null };
    const navigate = useNavigate();
    const token = getJWTToken();
    const lectureValidationSchema = object().shape({
        title: string().required('Title is required'),
        content: string().required('Content is required'),
        duration: number().required('Duration is required'),
        file: mixed().required('File is required')
    });


    //const handleSubmit = (values: any, {setSubmitting}: any)=> {
    const handleSubmit = async (values: any, {setSubmitting}: any) => {
        try {
            console.log('tested');
            console.log(values);
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('content', values.content);
            formData.append('duration', values.duration);
            formData.append('photo', values.file);

            const response: any = await postDataWithJWT("/lectures", formData, token);
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
   return (         
        <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Create Lecture</h2>
                
                <Formik initialValues={initialValues} validationSchema={ lectureValidationSchema } onSubmit={handleSubmit} >
                    {({ isSubmitting, setFieldValue }: any) => {                        
                            return(
                                <Form>
                                    <div className="mb-4">
                                        <label htmlFor="title" className="block mb-2">Title</label>
                                        <Field className="w-full border px-4 py-2" name="title" id="title" placeholder="Enter the Title " />
                                        <ErrorMessage name="title" component="div" className="text-red-500 mt-1" />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="content" className="block mb-2">Content</label>
                                        <Field component="textarea" className="w-full border px-4 py-2" name="content" id="content" placeholder="Enter the content " />
                                        <ErrorMessage name="content" component="div" className="text-red-500 mt-1" />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="duration" className="block mb-2">Duration</label>
                                        <Field className="w-full border px-4 py-2" id="duration" name="duration" placeholder="Enter the Duration " />
                                        <ErrorMessage name="duration" component="div" className="text-red-500 mt-1" />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="file" className="block mb-2">File</label>
                                        <input onChange={(e: any) => { setFieldValue("file", e.currentTarget.files[0]); }} type="file" className="w-full border px-4 py-2" name="file" id="file" />
                                        <ErrorMessage name="duration" component="div" className="text-red-500 mt-1" />
                                    </div>

                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4"
                                    >
                                        {isSubmitting ? "Add..." : "Add Lecture"}
                                    </button> 
                                </Form>
                            );
                        }
                    }
                </Formik>
            
        </div>
    ) 
  /* return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Lecture</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={lectureValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }: any) => {
          return (
            <Form>
              <div className="mb-4">
                <label htmlFor="title" className="block mb-2">
                  Title
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="w-full border px-4 py-2"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 mt-1"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="content" className="block mb-2">
                  Content
                </label>
                <Field
                  type="textarea"
                  id="content"
                  name="content"
                  className="w-full border px-4 py-2"
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-red-500 mt-1"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="duration" className="block mb-2">
                  Duration
                </label>
                <Field
                  type="number"
                  id="duration"
                  name="duration"
                  className="w-full border px-4 py-2"
                />
                <ErrorMessage
                  name="duration"
                  component="div"
                  className="text-red-500 mt-1"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="file" className="block mb-2">
                  File
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  className="w-full"
                  onChange={(e: any) => {
                    setFieldValue("file", e.currentTarget.files[0]);
                  }}
                />
                <ErrorMessage
                  name="file"
                  component="div"
                  className="text-red-500 mt-1"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4"
              >
                {isSubmitting ? "Creating..." : "Create Lecture"}
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  ); */
}

export default AddLecturesPage