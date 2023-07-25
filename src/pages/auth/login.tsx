import React, { FC, useCallback, useContext, useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Page from '../../layout/Page/Page';
import Card, { CardBody } from '../../components/bootstrap/Card';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Button from '../../components/bootstrap/Button';
import Logo from '../../components/Logo';
import useDarkMode from '../../hooks/useDarkMode';
import { useFormik } from 'formik';
import AuthContext from '../../contexts/authContext';
import USERS, { getUserDataWithUsername } from '../../common/data/userDummyData';
import Spinner from '../../components/bootstrap/Spinner';
import Alert from '../../components/bootstrap/Alert';
import axios, { AxiosError } from 'axios';
import {getCookie} from '../presentation/auth/Cookies'
import * as Yup from 'yup';
import { useRouter } from "next/router";


interface ILoginHeaderProps {
	isNewUser?: boolean;
}
const LoginHeader: FC<ILoginHeaderProps> = ({ isNewUser }) => {
	if (isNewUser) {
		return (
			<>
				<div className='text-center h1 fw-bold mt-5'>Create Account,</div>
				<div className='text-center h4 text-muted mb-5'>Sign up to get started!</div>
			</>
		);
	}
	return (
		<>
			<div className='text-center h1 fw-bold mt-5'>Welcome,</div>
			<div className='text-center h4 text-muted mb-5'>Sign in to continue!</div>
		</>
	);
};

interface ILoginProps {
	isSignUp?: boolean;
}
const Login: FC<ILoginProps> = ({ isSignUp }) => {
	const { setUser } = useContext(AuthContext);

	const { darkModeStatus } = useDarkMode();
	const [usernameTouched, setUsernameTouched] = useState(false);
	const [passwordTouched, setPasswordTouched] = useState(false);


	const [signInPassword, setSignInPassword] = useState<boolean>(false);
	const [singUpStatus, setSingUpStatus] = useState<boolean>(!!isSignUp);
	const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_BASE_URL

	const router = useRouter();
    const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [password, setPassword] = useState('');
	const [loginUsername, setLoginUsername] = useState('');
	const [isLoading, setIsLoading] = useState<boolean>(false);


	const usernameCheck = (inputUsername: string) => {
		return !!getUserDataWithUsername(inputUsername);
	};

	const passwordCheck = (inputUsername: string, inputPassword: string) => {
		return getUserDataWithUsername(inputUsername).password === inputPassword;
	};

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

	  const validateLoginForm = () => {
		if (!username || !password) {
		  alert('Please fill in all required fields.');
		  return false;
		}
	  
		return true;
	  };
	  
	
  
	  const handleSignUp = async () => {
		if (!validateForm()) return;
	  
		setIsLoading(true);
	  
		const data = {
		  email,
		  username,
		  name,
		  surname,
		  password,
		};
	  
		const csrfToken = getCookie("csrftoken");
		const headers = {
		  "Content-Type": "application/json",
		  "X-CSRFToken": csrfToken as string,
		};
	  
		try {
		  const response = await axios.post(`${BASE_URL}/signup`, data, { headers });
		  console.log(response);

		  

	      if (response.status==200)
		  {
		  // Handle successful registration
		  alert("Your account has been created successfully. Please login.");
		  setSingUpStatus(false);
		  router.push("/auth/login");
		  }
		} catch (error: any) {
		  // ... Handle errors
		}
		setIsLoading(false);

	  };
	  


const handleLogin = async () => {
    if (!validateLoginForm()) return;

    setIsLoading(true);

    const data = {
        username: loginUsername,
        password,
    };

    try {
        // Fetch JWT token
        const tokenResponse = await axios.post(`${BASE_URL}/api/token/`, data);
        const accessToken = tokenResponse.data.access;
		const refreshToken = tokenResponse.data.refresh;
		localStorage.setItem('access_token', accessToken);
		localStorage.setItem('refresh_token', refreshToken);


        // Fetch user data using the JWT token
        const userResponse = await axios.get(`${BASE_URL}/user/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });


        // Handle successful login (e.g., redirect, show success message, etc.)
        if (setUser && userResponse.data.username) {
            setUser(userResponse.data);
        }

        router.push('/knowledge/item');
    } 
	catch (error: unknown) {
		setIsLoading(false);
	
		if (axios.isAxiosError(error)) {
			if (error.response) {
				// The request was made and the server responded with a status code that falls out of the range of 2xx
				
			} else if (error.request) {
				// The request was made but no response was received
				console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log('Error', error.message);
			}
			console.log(error.config);
		} else {
			console.log('Non-Axios error:', error);
		}
	}
	
	
};

	


	const handleOnClick = () => {
		if (singUpStatus) {
		  handleSignUp();
		} else {
		setPasswordTouched(true);
		  handleLogin();
		}
	  };

	  const validationSchema = Yup.object().shape({
		loginUsername: Yup.string().test(
		  'username-required',
		  'Required',
		  (value, context) => {
			return context.options?.context?.signInPassword ? true : !!value;
		  }
		),
		loginPassword: Yup.string().test(
		  'password-required',
		  'Required',
		  (value, context) => {
			return context.options?.context?.signInPassword ? !!value : true;
		  }
		),
	  });
  
  const formik = useFormik({
	enableReinitialize: true,
	initialValues: {
	  loginUsername: USERS.JOHN.username,
	  loginPassword: USERS.JOHN.password,
	},
	validationSchema,
	validateOnChange: false,
	onSubmit: (values) => {
	  if (signInPassword) {
		if (passwordCheck(values.loginUsername, values.loginPassword)) {
		  if (setUser) {
			setUser(values.loginUsername);
		  }
  
		  handleOnClick();
		} else {
		  formik.setFieldError('loginPassword', 'Username and password do not match.');
		}
	  }
	},
  });

	
	const handleContinue = async () => {
		setUsernameTouched(true);
	  
		if (!username) {
		  formik.setFieldError('loginUsername', 'Required');
		  return;
		}
	  
		setIsLoading(true);
	  
		try {
		  const response = await axios.post(`${BASE_URL}/check_user_exists`, { username });
		  if (!response.data.exists) {
			formik.setFieldError('loginUsername', 'No such user found in the system.');
		  } else {
			setSignInPassword(true);
			// Store the username value
			setLoginUsername(username);
		  }
		} catch (error: unknown) {
		  // Handle errors
		}
	  
		setIsLoading(false);
	  };
	  
	  

	return (
		<PageWrapper
			isProtected={false}
			title={singUpStatus ? 'Sign Up' : 'Login'}
			className={classNames({ 'bg-dark': !singUpStatus, 'bg-light': singUpStatus })}>
			<Page className='p-0'>
				<div className='row h-100 align-items-center justify-content-center'>
					<div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
						<Card className='shadow-3d-dark' data-tour='login-page'>
							<CardBody>
								<div className='text-center my-5'>
								<Link 
    href="/"
    className={classNames(
        'text-decoration-none  fw-bold display-2',
        {
            'text-dark': !darkModeStatus,
            'text-light': darkModeStatus,
        },
    )}
>
    <Logo width={200} />
</Link>


								</div>
								<div
									className={classNames('rounded-3', {
										'bg-l10-dark': !darkModeStatus,
										'bg-dark': darkModeStatus,
									})}>
									<div className='row row-cols-2 g-3 pb-3 px-3 mt-0'>
										<div className='col'>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												isLight={singUpStatus}
												className='rounded-1 w-100'
												size='lg'
												onClick={() => {
													setSignInPassword(false);
													setSingUpStatus(!singUpStatus);
												}}>
												Login
											</Button>
										</div>
										<div className='col'>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												isLight={!singUpStatus}
												className='rounded-1 w-100'
												size='lg'
												onClick={() => {
													setSignInPassword(false);
													setSingUpStatus(!singUpStatus);
												}}>
												Sign Up
											</Button>
										</div>
									</div>
								</div>

								<LoginHeader isNewUser={singUpStatus} />

								<Alert isLight icon='Lock' isDismissible>
									<div className='row'>
										<div className='col-12'>
											<strong>Username:</strong> {USERS.JOHN.username}
										</div>
										<div className='col-12'>
											<strong>Password:</strong> {USERS.JOHN.password}
										</div>
									</div>
								</Alert>
								<form className='row g-4'>
									{singUpStatus ? (
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
										  <FormGroup id='signup-username' isFloating label='Your username'>
											<Input
											  
											  autoComplete='username'
											  value={username}
											  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
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
									) : (
										<>
											<div className='col-12'>
  <FormGroup
    id='loginUsername'
    isFloating
    label='Your email or username'
    className={classNames({
      'd-none': signInPassword,
    })}>
    <Input
      autoComplete='username'
	  value={username}
	  isTouched={usernameTouched}
	  invalidFeedback={formik.errors.loginUsername}
	  isValid={formik.isValid}
	  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
	  onBlur={formik.handleBlur}
	  onFocus={() => {
		formik.setErrors({});
	  }}
    />
  </FormGroup>
  {signInPassword && (
    <div className='text-center h4 mb-3 fw-bold'>
      Hi, {username}.
    </div>
  )}
  <FormGroup
    id='loginPassword'
    isFloating
    label='Password'
    className={classNames({
      'd-none': !signInPassword,
    })}>
    <Input
      type='password'
	  autoComplete='current-password'
	  value={password}
	  isTouched={passwordTouched}
	  invalidFeedback={formik.errors.loginPassword}
	  validFeedback='Looks good!'
	  isValid={formik.isValid}
	  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
	  onBlur={formik.handleBlur}
    />
  </FormGroup>
</div>
<div className='col-12'>
  {!signInPassword ? (
    <Button
      color='warning'
      className='w-100 py-3'
      isDisable={!username}
      onClick={handleContinue}>
      {isLoading && (
        <Spinner isSmall inButton isGrow />
      )}
      Continue
    </Button>
  ) : (
    <Button
      color='warning'
      className='w-100 py-3'
      onClick={handleOnClick}>
		 {isLoading && (
        <Spinner isSmall inButton isGrow />
      )}
      Login
    </Button>
  )}
</div>

										</>
									)}

									{/* BEGIN :: Social Login */}
									{!signInPassword && (
										<>
											<div className='col-12 mt-3 text-center text-muted'>
												OR
											</div>
											<div className='col-12 mt-3'>
												<Button
													isOutline
													color={darkModeStatus ? 'light' : 'dark'}
													className={classNames('w-100 py-3', {
														'border-light': !darkModeStatus,
														'border-dark': darkModeStatus,
													})}
													icon='CustomApple'
													onClick={handleOnClick}>
													Sign in with Apple
												</Button>
											</div>
											<div className='col-12'>
												<Button
													isOutline
													color={darkModeStatus ? 'light' : 'dark'}
													className={classNames('w-100 py-3', {
														'border-light': !darkModeStatus,
														'border-dark': darkModeStatus,
													})}
													icon='CustomGoogle'
													onClick={handleOnClick}>
													Continue with Google
												</Button>
											</div>
										</>
									)}
									{/* END :: Social Login */}
								</form>
							</CardBody>
						</Card>
						<div className='text-center'>
							<a
								href='/'
								className={classNames('text-decoration-none me-3', {
									'link-light': singUpStatus,
									'link-dark': !singUpStatus,
								})}>
								Privacy policy
							</a>
							<a
								href='/'
								className={classNames('link-light text-decoration-none', {
									'link-light': singUpStatus,
									'link-dark': !singUpStatus,
								})}>
								Terms of use
							</a>
						</div>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};
Login.propTypes = {
	isSignUp: PropTypes.bool,
};
Login.defaultProps = {
	isSignUp: false,
};

export default Login;
