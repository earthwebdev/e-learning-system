import Box from '@mui/material/Box';

import { Stepper, Step, StepLabel, Button } from "@mui/material";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import { useState } from "react";
import * as yup from "yup";
import { postDataWithJWT } from '../../services/axios.service';

import {useNavigate} from 'react-router-dom';

import {getJWTToken} from '../../utils/helpers';
import { errorToast, successToast } from '../../services/toastify.service';

const steps = ["Sections Details", "Lectures"];

  const validationSchema = yup.object().shape({        
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

const initialValues: any = {  
      title: "",
      lectures: [
        {
          title: "",
          content: "",
          duration: "",
          file: null,
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
      console.log(values, 'values'); //return;   
      const formData: any = new FormData();
      formData.append( 'title', values.title);
             
      if(values.lectures.length > 0 ){
        values.lectures.forEach((lecture: any, lectureIndex: number) => {
          formData.append(`lectures[${lectureIndex}][title]`, lecture.title);                        
          formData.append(`lectures[${lectureIndex}][content]`, lecture.content);
          formData.append(`lectures[${lectureIndex}][duration]`, lecture.duration);            
          formData.append(`photo`, lecture.file);
        });           
      }
      
      const resp = await postDataWithJWT('/sections', formData, token );
      if(resp.status){
        successToast(resp.message);
        navigate('/sections');
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
                </div>
              )}
              {
                activeStep === 1 && (
                  /* values.lectures.map( (section: any, lectureIndex: any) => (
                    <div key={lectureIndex} className="mb-6"> */
                          <FieldArray name={`lectures`}>
                      {({ push: addLecture, remove: removeLecture }) => (
                          <div>
                            {values.lectures.map( (lecture: any, lectureIndex: any) => (
                              <div key={lectureIndex} className="mb-6">
                                  <div className='mb-4'>
                                    <label htmlFor={`lectures[${lectureIndex}].title`} className="block mb-2">Lecture Title {lectureIndex}</label>
                                    <Field type="text" className={`w-full border ${ errors.lectures?.[
                                        lectureIndex
                                      ]?.title &&
                                      touched.lectures?.[lectureIndex]?.title? "border-red-500": ""}`} 
                                        name={`lectures[${lectureIndex}].title`} id={`lectures[${lectureIndex}].title`} placeholder="Enter the Lecture Title " />
                                    <ErrorMessage name={`lectures[${lectureIndex}].title`} component="div" className="text-red-500 mt-1" />
                                  </div>

                                  <div className='mb-4'>
                                    <label htmlFor={`lectures[${lectureIndex}].content`} className="block mb-2">Lecture Content {lectureIndex}</label>
                                    <Field type="text" className={`w-full border ${ errors.lectures?.[
                                        lectureIndex
                                      ]?.content &&
                                      touched.lectures?.[lectureIndex]?.content? "border-red-500": ""}`}  name={`lectures[${lectureIndex}].content`} id={`lectures[${lectureIndex}].content`} placeholder="Enter the Lecture Content " />
                                    <ErrorMessage name={`lectures[${lectureIndex}].content`} component="div" className="text-red-500 mt-1" />
                                  </div>

                                  <div className='mb-4'>
                                    <label htmlFor={`lectures[${lectureIndex}].duration`} className="block mb-2">Lecture Duration {lectureIndex}</label>
                                    <Field type="text" className={`w-full border ${ errors.lectures?.[
                                        lectureIndex
                                      ]?.duration &&
                                      touched.lectures?.[lectureIndex]?.duration? "border-red-500": ""}`}  name={`lectures[${lectureIndex}].duration`} id={`lectures[${lectureIndex}].duration`} placeholder="Enter the Lecture Duration " />
                                    <ErrorMessage name={`lectures[${lectureIndex}].duration`} component="div" className="text-red-500 mt-1" />
                                  </div>

                                  <div className="mb-2">
                                  <label className="block mb-2" htmlFor={`lectures[${lectureIndex}].file`}>
                                    Lecture File
                                  </label>
                                  <input
                                    type="file"
                                    id={`lectures[${lectureIndex}].file`}
                                    name={`lectures[${lectureIndex}].file`}
                                    className={`w-full border ${
                                      errors.lectures?.[
                                        lectureIndex
                                      ]?.file &&
                                      touched.lectures?.[lectureIndex]?.file
                                        ? "border-red-500"
                                        : ""
                                    }`}
                                    onChange={(event: any) => {
                                      const file = event.target.files[0];
                                      setFieldValue(
                                        `lectures[${lectureIndex}].file`,
                                        file
                                      );
                                    }}
                                  />
                                  <ErrorMessage
                                    name={`lectures[${lectureIndex}].file`}
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
                    
                )                
              }
              {/* Step 2: Sections and Lectures */}
              {/* activeStep === 1 &&
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
                            
                          
                      {/* field lecture part ////}
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
                )) */}

              {/* {activeStep === 1 &&
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
                            
                          
                      {/* field lecture part ////}
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
                ))} */}              

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