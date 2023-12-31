import { useEffect, useState } from 'react';
import { getDatasFromAxios, deleteDataFromAxios } from '../../services/axios.service';
import {getJWTToken, getRoleAccess} from '../../utils/helpers';
import { Card, CardContent, IconButton, Typography } from '@mui/material';
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {successToast, errorToast } from '../../services/toastify.service';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { useLocation } from "react-router-dom";

const LecturesPage = () => {
    const [lectures, setLectures] = useState([]);
    const [pagination, setPagination] = useState<any>({});
    const [errorsData, setErrorsData] = useState('');
    const navigate = useNavigate();

    const query = new URLSearchParams(useLocation().search);
    const page = query.get("page")?? 1;
    const limit = query.get("limit");
    let queryUrl = '';
    console.log(page, limit);
    if(page && limit){
        queryUrl += `page=${page}&limit=${limit}`;
    } else if( page !== '' ){
        queryUrl += `page=${page}`;
    } else if(limit){
        queryUrl += `page=${limit}`;
    }
    const jwt = getJWTToken();
    const accessRole: boolean = getRoleAccess('admin');

    const editLecture= (id: any) => {
        navigate(`/lectures/${id}`);
    }

    const getDataOfLectures = async () => {
        const response = await getDatasFromAxios(`/lectures?${queryUrl}`, jwt);
        console.log(response);
        if(response.status){
            setLectures(response.data);
            setPagination(response.pagination);
        } else {
            setErrorsData(response);
        }
    }

    const deleteLecture = async (id: any) => {
        //console.log(id);
        const response = await deleteDataFromAxios(`/lectures/${id}`, jwt);
        //console.log(response);
        if(response.status){
            //setLectures(response.data);
            getDataOfLectures();
            successToast(response.message);
        } else {
            errorToast(response.message);
        }
    }

    useEffect(() => {
        getDataOfLectures();
    }, [page])

  return (
    <>
        <div className="container mx-auto px-4 py-8">
            <Typography variant='h4' gutterBottom>
                <div className=''>
                    <span>Lectures</span>
                    {
                        accessRole && 
                            (
                                <Button variant="contained" className="float-right mb-4" onClick={(e) => {e.preventDefault(); navigate("/lectures/add"); } }>Add</Button>
                            )
                    }
                    
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {
                    lectures && lectures.length > 0 && lectures.map((lecture: any) => {
                        return (
                            <Card key={lecture._id} className='bg-white shadow-lg mr-2'>
                                <CardContent>
                                    <div className="flex justify-between items-center mb-2">
                                        <Typography variant='h6'>{lecture.title.length > 15?lecture.title.slice(0,15)+'...':lecture.title}</Typography>
                                        {
                                            accessRole && 
                                                (
                                                    <div>
                                                        <IconButton color='primary' className='mr-2' onClick={(e) => {e.preventDefault();editLecture(lecture._id)}}>
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton color='error' onClick={(e) => {e.preventDefault();deleteLecture(lecture._id)}}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </div>                                            
                                                )
                                        }
                                         

                                    </div>

                                    <Typography variant='subtitle1'>
                                        Duration: {lecture.duration} days
                                    </Typography>
                                    <Typography variant='body1' className='mb-4'>
                                    {lecture.content.length > 30?lecture.content.slice(0,30)+'...':lecture.content}
                                    </Typography>
                                    <div className="aspect-w-16">
                                        {
                                            lecture.public_id && lecture.public_id.startsWith('videos')? (
                                                <video controls className="object-cover w-full h-full">
                                                    <source src={lecture.lectureUrl}></source>
                                                </video>
                                            ): (
                                                <img className="w-50" src={lecture.lectureUrl} />
                                            )
                                        }
                                        
                                    </div>
                                </CardContent>

                            </Card>
                        )
                    })

                    
                }
                
                {
                    lectures.length < 1 && (
                            <>
                                {errorsData}
                            </>
                        )
                }
                </div>
                {
                    pagination && (
                        <>
                            <nav aria-label="Page navigation example">
                                <ul className="list-style-none flex">
                                {
                                    pagination.prev && (
                                        <li>
                                        <a className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
                                        href="#" onClick={(e) => {e.preventDefault();navigate(`/lectures?page=${pagination.prev.page}&limit=${pagination.prev.limit}`)}} >
                                            <ArrowBackIosIcon />
                                        </a>
                                    </li>
                                    )
                                }                                                                                                    
                                {
                                    pagination.next && (

                                    <li>
                                        <a className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
                                        href="#" onClick={(e) => {e.preventDefault();navigate(`/lectures?page=${pagination.next.page}&limit=${pagination.next.limit}`)}} >
                                            <ArrowForwardIosIcon />
                                        </a>
                                    </li>                                            
                                    )
                                }
                                    
                                </ul>
                            </nav>
                        </>
                        
                    )
                }
                
            </Typography>
            
        </div>       
    </>
    
  )
}

export default LecturesPage