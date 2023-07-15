import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AccessDeniedPage = () => {
    const navigate = useNavigate();
    return (
      <div className="text-red-500 text-center">
        <p>Sorry but you don't have permission to access this page. Click here to go to dashboard</p>
        <Button className='my-4' variant="outlined" onClick={() => navigate("/dashboard")}>
          Go to dashboard
        </Button>
      </div>
    );
}

export default AccessDeniedPage