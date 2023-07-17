import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'

const SuccessPage = () => {
    const navigate = useNavigate();
  return (
    <div>
        <h1>Thanks for your order!</h1>
        <p>Your shopping is complete. Click here to continue more.</p>
      <Button variant="outlined" onClick={() => navigate("/courses")}>
        Continue shopping
      </Button>

    </div>
  )
}

export default SuccessPage