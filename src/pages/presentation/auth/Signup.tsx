
import axios, { AxiosError } from 'axios';

import React, { FC, useCallback, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Logo from '../../../components/Logo';
import useDarkMode from '../../../hooks/useDarkMode';
import { useFormik } from 'formik';
import AuthContext from '../../../contexts/authContext';
import USERS, { getUserDataWithUsername } from '../../../common/data/userDummyData';
import Spinner from '../../../components/bootstrap/Spinner';
import Alert from '../../../components/bootstrap/Alert';
const [isLoading, setIsLoading] = useState(false);



const SignUpForm = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
    //const [singUpStatus, setSingUpStatus] = useState<boolean>(!!isSignUp);
  
    const validateForm = () => {
      if (!email || !name || !surname || !password) {
        alert('Please fill in all required fields.');
        return false;
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
      }
  
      if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return false;
      }
  
      return true;
    };
  

  const handleOnClick = async () => {
    if (!validateForm()) return;


    setIsLoading(true);

    const data = {
      email,
      name,
      surname,
      password,
    };

    try {
      const response = await axios.post(`$(BASE_URL)/signup`, data);
      console.log(response);
      // Handle successful registration (e.g., redirect, show success message, etc.)
      navigate('/login');
        } catch (error : unknown) {
            const axiosError = error as AxiosError;
            console.error('Error during registration:',  axiosError);
            setIsLoading(false);

            // Display a specific error message based on the error response
            if (axiosError.response && axiosError.response.status === 409) {
            alert('This email is already registered. Please try another one.');
            } else {
                alert('An error occurred during registration. Please try again later.');
                }
                        }
  };

  return (
    <form className='row g-4'>
      { (
        <>
          <div className='col-12'>
            <FormGroup id='signup-email' isFloating label='Your email'>
              <Input
                type='email'
                autoComplete='email'
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </FormGroup>
          </div>
          <div className='col-12'>
            <FormGroup id='signup-name' isFloating label='Your name'>
              <Input
                autoComplete='given-name'
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              />
            </FormGroup>
          </div>
          <div className='col-12'>
            <FormGroup id='signup-surname' isFloating label='Your surname'>
              <Input
                autoComplete='family-name'
                value={surname}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSurname(e.target.value)}
              />
            </FormGroup>
          </div>
          <div className='col-12'>
            <FormGroup id='signup-password' isFloating label='Password'>
              <Input
                type='password'
                autoComplete='password'
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </FormGroup>
          </div>
          <div className='col-12'>
            <Button
              color='info'
              className='w-100 py-3'
              onClick={handleOnClick}
            >
              Sign Up
            </Button>
          </div>
        </>
      ) }
    </form>
  );
};

export default SignUpForm;
