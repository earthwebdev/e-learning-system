import { useEffect, useState } from 'react';
import { getDatasFromAxios, deleteDataFromAxios } from '../../services/axios.service';
import {getJWTToken, getRoleAccess} from '../../utils/helpers';
import { Card, CardContent, IconButton, Typography } from '@mui/material';
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {successToast, errorToast } from '../../services/toastify.service';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import { useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addToCart } from '../cart/cartSlice';

const SectionPage = () => {
    const [sections, setSections] = useState([]);
    const [pagination, setPagination] = useState<any>({});
    const [errorsData, setErrorsData] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    const accessRoleStudent: boolean = getRoleAccess('student');

    const editSections= (id: any) => {
        navigate(`/sections/${id}`);
    }

    const handleAddToCart = (product: any) => {
        console.log(product);
        dispatch(addToCart(product));
        navigate('/cart');
    }

    const getDataOfSections = async () => {
        const response = await getDatasFromAxios(`/sections?${queryUrl}`, jwt);
        console.log(response);
        if(response.status){
            setSections(response.data);
            setPagination(response.pagination);
        } else {
            setErrorsData(response);
        }
    }

    const deleteSection = async (id: any) => {
        //console.log(id);
        const response = await deleteDataFromAxios(`/sections/${id}`, jwt);
        //console.log(response);
        if(response.status){
            //setSections(response.data);
            getDataOfSections();
            successToast(response.message);
        } else {
            errorToast(response.message);
        }
    }

    useEffect(() => {
        getDataOfSections();
    }, [page])

  return (
    <>
        <div className="container mx-auto px-4 py-8">
            <Typography variant='h4' gutterBottom>
                <div className=''>
                    <span>Sections</span>
                    {
                        accessRole && 
                            (
                                <Button variant="contained" className="float-right mb-4" onClick={(e) => {e.preventDefault(); navigate("/sections/add"); } }>Add</Button>
                            )
                    }
                    
                </div>
            </Typography>        
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {
                    sections && sections.length > 0 && sections.map((section: any) => {
                        return (
                            <Card key={section._id} className='bg-white shadow-lg mr-2'>
                                <CardContent>
                                    <div className="flex justify-between items-center mb-2">
                                        <Typography variant='h6'>{section.title.length > 15?section.title.slice(0,15)+'...':section.title}</Typography>
                                        {
                                            accessRole && 
                                                (
                                                    <div>
                                                        <IconButton color='primary' className='mr-2' onClick={(e) => {e.preventDefault();editSections(section._id)}}>
                                                            <EditIcon />
                                                        </IconButton>
                                                        <IconButton color='error' onClick={(e) => {e.preventDefault();deleteSection(section._id)}}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </div>                                            
                                                )
                                        }
                                        {/* {
                                            accessRoleStudent && 
                                            (
                                                <div>                                                    
                                                    <Button className='mr-2' variant="text" onClick={(e) => {e.preventDefault();handleAddToCart(section)} } >
                                                        <AddShoppingCartIcon /> <span className='p'>Add to cart</span>
                                                    </Button>
                                              </div>
                                            )
                                        } */}
                                         

                                    </div>

                                    {/* <Typography variant='subtitle1'>
                                        Duration: {section.duration} days
                                    </Typography>
                                    <Typography variant='body1' className='mb-4'>
                                    {section.description.length > 30?section.description.slice(0,30)+'...':section.description}
                                    </Typography> */}
                                    {/* <div className="aspect-w-16">
                                        {
                                            section.public_id && section.public_id.startsWith('videos')? (
                                                <video controls className="object-cover w-full h-full">
                                                    <source src={section.sectionUrl}></source>
                                                </video>
                                            ): (
                                                <img className="w-50" src={section.lectureUrl} />
                                            )
                                        }
                                        
                                    </div> */}
                                </CardContent>

                            </Card>
                        )
                    })

                    
                }
                
                {
                    sections.length < 1 && (
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
                                        href="#" onClick={(e) => {e.preventDefault();navigate(`/sections?page=${pagination.prev.page}&limit=${pagination.prev.limit}`)}} >
                                            <ArrowBackIosIcon />
                                        </a>
                                    </li>
                                    )
                                }                                                                                                    
                                {
                                    pagination.next && (

                                    <li>
                                        <a className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
                                        href="#" onClick={(e) => {e.preventDefault();navigate(`/sections?page=${pagination.next.page}&limit=${pagination.next.limit}`)}} >
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
                
            
            
        </div>       
    </>
    
  )
}

export default SectionPage