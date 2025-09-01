import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to registration page
    navigate('/registration');
  }, [navigate]);

  return null;
};

export default Signup;