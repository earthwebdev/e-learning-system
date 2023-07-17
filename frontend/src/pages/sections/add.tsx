import Box from '@mui/material/Box';

import { Stepper, Step, StepLabel, Button } from "@mui/material";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { postDataWithJWT } from '../../services/axios.service';

import {useNavigate} from 'react-router-dom';

import {getJWTToken} from '../../utils/helpers';
import { errorToast, successToast } from '../../services/toastify.service';

const steps = ["Course Details", "Sections and Lectures"];

const validationSchema = yup.object().shape({
  title: yup.string().required('Title is require'),
  description: yup.string().required('Descripton is required'),
  duration: yup.number().required('Duration is required'),
  price: yup.number().required('Price is required'),  
  sections: yup.array().of(
      yup.object().shape({
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
      })
  )
});

const initialValues: any = {
  title: "",
  description: "",
  price: "",
  duration: "",
  sections: [
    {
      title: "",
      lectures: [
        {
          title: "",
          content: "",
          duration: "",
          file: null,
        },
      ],
    },
  ],
};
function SectionAddPage() {
  const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();
    const token = getJWTToken();   

  const handleNextStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handlePreviousStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleFormSubmit = async (values: any) => {   
    try {
      console.log('working submit button');
      console.log(values, 'values');    
      const formData: any = new FormData();
      formData.append( 'title', values.title);
      formData.append( 'description', values.description);
      formData.append( 'duration', values.duration);
      formData.append( 'price', values.price);
      if(values.sections.length > 0 ){
        values.sections.forEach((section: any, sectionIndex: number) => {
          formData.append(`sections[${sectionIndex}][title]`, section.title);          
          if(section.lectures.length > 0 ){
            section.lectures.forEach((lecture: any, lectureIndex: number) => {
              formData.append(`sections[${sectionIndex}][lectures][${lectureIndex}][title]`, lecture.title); 
              //formData.append(`sections[${sectionIndex}][lectures][${lectureIndex}][title]`, lecture.title);           
              formData.append(`sections[${sectionIndex}][lectures][${lectureIndex}][content]`, lecture.content);
              formData.append(`sections[${sectionIndex}][lectures][${lectureIndex}][duration]`, lecture.duration);            
              formData.append(`photo`, lecture.file);
            });           
          }
        });
      } 
      
      const resp = await postDataWithJWT('/courses', formData, token );
      if(resp.status){
        successToast(resp.message);
        navigate('/courses');
      } else {
        errorToast(resp.message);      
      }
    } catch (error: any) {
      console.error("An error occurred while submitting the form", error);
      errorToast("An error occurred while submitting the form" + error.message);   
    }
  }
  return (
        
    <Box sx={{ width: '100%' }}>  
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}          
          onSubmit={handleFormSubmit}
        >
          {({ values, errors, touched, setFieldValue }: any) => (
            <Form className="w-full max-w-lg mx-auto">
              {/* Step 1: Course Details */}
              
              {activeStep === 0 && (
                <div>
                  <div className="mb-4">
                    <label className="block mb-2" htmlFor="title">
                      Title
                    </label>
                    <Field
                      type="text"
                      id="title"
                      name="title"
                      className={`w-full border ${
                        errors.title && touched.title ? "border-red-500" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2" htmlFor="description">
                      Description
                    </label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      className={`w-full border ${
                        errors.description && touched.description
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2" htmlFor="price">
                      Price
                    </label>
                    <Field
                      type="text"
                      id="price"
                      name="price"
                      className={`w-full border ${
                        errors.price && touched.price ? "border-red-500" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2" htmlFor="duration">
                      Duration
                    </label>
                    <Field
                      type="text"
                      id="duration"
                      name="duration"
                      className={`w-full border ${
                        errors.duration && touched.duration
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    <ErrorMessage
                      name="duration"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Sections and Lectures */}
              {activeStep === 1 &&
                values.sections.map((section: any, sectionIndex: any) => (                
                    <div key={sectionIndex} className="mb-6">
                        <div className="mb-4">
                          <label
                            className="block mb-2"
                            htmlFor={`sections[${sectionIndex}].title`}
                          >
                            Section Title
                          </label>
                          
                          <Field
                            type="text"
                            id={`sections[${sectionIndex}].title`}
                            name={`sections[${sectionIndex}].title`}
                            className={`w-full border ${
                              errors.sections?.[sectionIndex]?.title &&
                              touched.sections?.[sectionIndex]?.title
                                ? "border-red-500"
                                : ""
                            }`}
                          />
                          <ErrorMessage
                            name={`sections[${sectionIndex}].title`}
                            component="div"
                            className="text-red-500"                            
                          />                          
                        </div>
                            
                          
                      {/* field lecture part */}
                      <FieldArray name={`sections[${sectionIndex}].lectures`}>
                      {({ push: addLecture, remove: removeLecture }) => (
                          <div>
                            {section.lectures.map((lecture: any, lectureIndex: any) => (
                              <div key={lectureIndex} className="mb-6">
                                  <div className='mb-4'>
                                    <label htmlFor={`sections[${sectionIndex}].lectures[${lectureIndex}].title`} className="block mb-2">Lecture Title {lectureIndex}</label>
                                    <Field type="text" className={`w-full border ${ errors.sections?.[sectionIndex]?.lectures?.[
                                        lectureIndex
                                      ]?.title &&
                                      touched.sections?.[sectionIndex]
                                        ?.lectures?.[lectureIndex]?.title? "border-red-500": ""}`} 
                                        name={`sections[${sectionIndex}].lectures[${lectureIndex}].title`} id={`sections[${sectionIndex}].lectures[${lectureIndex}].title`} placeholder="Enter the Lecture Title " />
                                    <ErrorMessage name={`sections[${sectionIndex}].lectures[${lectureIndex}].title`} component="div" className="text-red-500 mt-1" />
                                  </div>

                                  <div className='mb-4'>
                                    <label htmlFor={`sections[${sectionIndex}].lectures[${lectureIndex}].content`} className="block mb-2">Lecture Content {lectureIndex}</label>
                                    <Field type="text" className={`w-full border ${ errors.sections?.[sectionIndex]?.lectures?.[
                                        lectureIndex
                                      ]?.content &&
                                      touched.sections?.[sectionIndex]
                                        ?.lectures?.[lectureIndex]?.content? "border-red-500": ""}`}  name={`sections[${sectionIndex}].lectures[${lectureIndex}].content`} id={`sections[${sectionIndex}].lectures[${lectureIndex}].content`} placeholder="Enter the Lecture Content " />
                                    <ErrorMessage name={`sections[${sectionIndex}].lectures[${lectureIndex}].content`} component="div" className="text-red-500 mt-1" />
                                  </div>

                                  <div className='mb-4'>
                                    <label htmlFor={`sections[${sectionIndex}].lectures[${lectureIndex}].duration`} className="block mb-2">Lecture Duration {lectureIndex}</label>
                                    <Field type="text" className={`w-full border ${ errors.sections?.[sectionIndex]?.lectures?.[
                                        lectureIndex
                                      ]?.duration &&
                                      touched.sections?.[sectionIndex]
                                        ?.lectures?.[lectureIndex]?.duration? "border-red-500": ""}`}  name={`sections[${sectionIndex}].lectures[${lectureIndex}].duration`} id={`sections[${sectionIndex}].lectures[${lectureIndex}].duration`} placeholder="Enter the Lecture Duration " />
                                    <ErrorMessage name={`sections[${sectionIndex}].lectures[${lectureIndex}].duration`} component="div" className="text-red-500 mt-1" />
                                  </div>

                                  <div className="mb-2">
                                  <label className="block mb-2" htmlFor={`sections[${sectionIndex}].lectures[${lectureIndex}].file`}>
                                    Lecture File
                                  </label>
                                  <input
                                    type="file"
                                    id={`sections[${sectionIndex}].lectures[${lectureIndex}].file`}
                                    name={`sections[${sectionIndex}].lectures[${lectureIndex}].file`}
                                    className={`w-full border ${
                                      errors.sections?.[sectionIndex]?.lectures?.[
                                        lectureIndex
                                      ]?.file &&
                                      touched.sections?.[sectionIndex]
                                        ?.lectures?.[lectureIndex]?.file
                                        ? "border-red-500"
                                        : ""
                                    }`}
                                    onChange={(event: any) => {
                                      const file = event.target.files[0];
                                      setFieldValue(
                                        `sections[${sectionIndex}].lectures[${lectureIndex}].file`,
                                        file
                                      );
                                    }}
                                  />
                                  <ErrorMessage
                                    name={`sections[${sectionIndex}].lectures[${lectureIndex}].file`}
                                    component="div"
                                    className="text-red-500"
                                  />
                                </div>

                                {lectureIndex > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => removeLecture(lectureIndex)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                  >
                                    Remove Lecture
                                  </button>
                                )}

                              </div>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              addLecture({
                                title: "",
                                content: "",
                                duration: "",
                                file: null,
                              })
                            }
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Add Lecture
                          </button>
                          </div>
                      )}

                      </FieldArray>
                      
                      
                        
                      
                      
                      {sectionIndex > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updatedSections = [...values.sections];
                            updatedSections.splice(sectionIndex, 1);
                            setFieldValue("sections", updatedSections);
                          }}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Remove Section
                        </button>
                      )}
                    
                  </div>
                ))}
              {activeStep === 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setFieldValue("sections", [
                      ...values.sections,
                      {
                        title: "",
                        lectures: [
                          { title: "", content: "", duration: "", file: null },
                        ],
                      },
                    ])
                  }
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Section
                </button>
              )}

            <div className="mt-6">
              {activeStep > 0 && (
                <Button onClick={handlePreviousStep}>Previous</Button>
              )}
              {activeStep < steps.length - 1 && (
                <Button onClick={handleNextStep}>Next</Button>
              )}
              {activeStep === steps.length - 1 && (
                <Button type="submit" variant="contained">
                  Submit
                </Button>
              )}
            </div>
            </Form>
          )}
        </Formik>
      </Box>
  );
}


export default SectionAddPage