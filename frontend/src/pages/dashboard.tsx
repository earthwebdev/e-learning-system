import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCookie } from '../helpers/cookies.helper';
import { useDispatch } from 'react-redux';
import { login } from "./SignIn/authSlice";
import { getJWTToken, getRole } from "../utils/helpers";

import Chart from "react-apexcharts";
import { getDatasFromAxios } from "../services/axios.service";

const dashboardPage = () => {
  const dispatch = useDispatch();
  
  const jwt = getCookie("jwtToken") || '';
  const role = getCookie("role") || '';
  console.log(jwt, role);
  const data = {
    jwt, role
  }
  const navigate = useNavigate();
  const loginstate = useSelector((state: any) => state.auth.isLoggedIn);
    //console.log(loginstate, '====');
    useEffect( () => {
      if(jwt && role){
        dispatch(login(data));
      } else if(!loginstate){
            navigate('/');
      }
    }, []);
    const tokenJwt =  getJWTToken();
    useEffect(() => {
      getCourses();
    }, []);
    let courseDate: any = []; 
    let dataSeries: any = [];
    const getCourses = async () => {
      const resp = await getDatasFromAxios('/courses?limit=20', tokenJwt);
      //console.log(resp);
      
      if(resp.status){
        if(resp.data.length > 0){
          
          resp.data.map((course: any) => {
            /* const d = new Date(course.updatedAt);
            let month = d.getMonth();
            let year = d.getFullYear(); */
            courseDate.push(course.duration);
            return courseDate;
          });
          //console.log(courseDate);
          resp.data.map((course: any) => {
              const dataObj = {
                name: course.title,
                data: [course.price]
              };
              dataSeries.push(dataObj);
              return dataSeries;
          });
        }
        
      }
      console.log(courseDate, dataSeries);
    } 

   // const { role } = useSelector((state: any) => state.auth);
  const getRoleLoginUser = getRole();
  //console.log(getRoleLoginUser);
  
  const ChartData = {
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999] //courseDate,//
      }
    },
    series:  [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70]
      },
      {
        name: "series-2",
        data: [32, 42, 42, 52, 42, 62, 72, 92]
      }
      ,
      {
        name: "series-3",
        data: [33, 43, 45, 53, 44, 63, 73, 93]
      }
    ] 
  }; /*dataSeries */

  return (
    <>
      <div className="text-bold text-3xl">Dashboard</div>
      {
         getRoleLoginUser === 'student' ?
          <div>
              <Chart
                options={ChartData.options}
                series={ChartData.series}
                type="line"
                width="500"
              />
          </div>: 
          <div>
            <Chart
              options={ChartData.options}
              series={ChartData.series}
              type="bar"
              width="500"
            />
        </div>
      }
    </>
  )
}

export default dashboardPage