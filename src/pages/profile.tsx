import type { NextPage } from 'next'; 
import { GetStaticProps } from 'next';
import Head from 'next/head';

import Icon from '../components/icon/Icon';
import { useEffect, useState, useContext } from 'react';
import { useFormik } from 'formik';
import validate from '../common/function/validation/editPagesValidate';
import showNotification from '../components/extras/showNotification';
import validateAddress from '../common/function/validation/editPageAddressValidate';
import Button, { IButtonProps } from '../components/bootstrap/Button';
import Page from '../layout/Page/Page';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../components/bootstrap/Card';
import FormGroup from '../components/bootstrap/forms/FormGroup';
import Input from '../components/bootstrap/forms/Input';
import Avatar from '../components/Avatar';
import USERS from '../common/data/userDummyData';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../components/bootstrap/Dropdown';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import Spinner from '../components/bootstrap/Spinner';
import LANG, { getLangWithKey, ILang } from '../lang';
import useDarkMode from '../hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import AuthContext from '../contexts/authContext';
import { useMutation } from 'react-query';
import { IUserProfileData, IUserData } from '../contexts/authContext';


type TTabs = 'Account Details' | 'Usage' | 'My AI' | 'Billing'
interface ITabs {
	[key: string]: TTabs;
}
const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_BASE_URL

const Index: NextPage = () => {
	const TABS: ITabs = {
		ACCOUNT_DETAIL: 'Account Details',
		USAGE: 'Usage',
		AI: 'My AI',
		BILLING: 'Billing',  // Add this line
	  };
	const [activeTab, setActiveTab] = useState<TTabs>(TABS.ACCOUNT_DETAIL);
	const { darkModeStatus, setDarkModeStatus } = useDarkMode();
	const { userProfileData } = useContext(AuthContext);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [selectedPlan, setSelectedPlan] = useState<string | null>(null);


	
	const router = useRouter();
	
  const [isEditing, setIsEditing] = useState<boolean>(false);


	const updateUserProfileMutation = useMutation(async ({ userId, newAvatar }: { userId: number | string, newAvatar: File | null }) => {
		const token = localStorage.getItem("access_token");
	  
		const formData = new FormData();
		if (newAvatar) {
		  formData.append('avatar', newAvatar);
		}
	  
		const response = await fetch(`${BASE_URL}/updateProfile/${userId}/`, {
		  method: 'PATCH',
		  body: formData,
		  headers: {
			'Authorization': `Bearer ${token}`,
		  },
		});
	  
		if (!response.ok) {
		  throw new Error(`HTTP error! status: ${response.status}`);
		}
	  
		return await response.json();
	  }, {
		onError: (error) => {
		  console.error('An error occurred while updating the profile:', error);
		},
		onSuccess: (data) => {
			showNotification(
				'Profile Update', 
				'Profile updated successfully',
				'success'
			  );

			  setIsEditing(false);
		}
	  });
	  
	  
	  

	const handleChangeAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
		  const avatarFile = event.target.files[0];
		  formik.setFieldValue('avatar', avatarFile);
		  setAvatarPreview(URL.createObjectURL(avatarFile));
		}
	  };

	const formik = useFormik({
		initialValues: {
			avatar: userProfileData?.avatar || null,
			firstName: userProfileData?.user?.first_name || '',
			lastName: userProfileData?.user?.last_name || '',
			displayName: userProfileData?.user?.username || '',
			emailAddress: userProfileData?.user?.email || '',

		},
		
		onSubmit: (values) => {
			try {
				console.log('onSubmit called with values:', values);
				updateUserProfileMutation.mutate({
					userId: userProfileData?.user?.id || 'defaultId',
					newAvatar: values.avatar as File | null,
				});
			} catch (error) {
				console.error('Error in onSubmit:', error);
			}
		}
		
		  

		  
		  
		,
	});
	
	const styledBtn: IButtonProps = {
		color: darkModeStatus ? 'dark' : 'light',
		hoverShadow: 'default',
		isLight: !darkModeStatus,
		size: 'lg',
	};

	const { i18n } = useTranslation();

	const changeLanguage = (lng: ILang['key']['lng']) => {
		i18n.changeLanguage(lng);
		router.push(router.pathname, router.pathname, { locale: lng });
		showNotification(
			<span className='d-flex align-items-center'>
				<Icon icon={getLangWithKey(lng)?.icon} size='lg' className='me-1' />
				<span>{`Language changed to ${getLangWithKey(lng)?.text}`}</span>
			</span>,
			'You updated the language of the site. (Only "Aside" was prepared as an example.)',
		);
	};







	return (
		<Layout title ="Profile"  hideHeader={true}>
			<Head>
				<title>{}</title>
			</Head>
			<Page>
				<div className='row h-100'>
					<div className='col-xl-3 col-lg-4 col-md-6'>
						<Card stretch>
							<CardHeader>
								<CardLabel icon='Person' iconColor='info'>
									<CardTitle>Account Settings</CardTitle>
									<CardSubTitle>Personal Information</CardSubTitle>
								</CardLabel>
							</CardHeader>
							<CardBody isScrollable>
								<div className='row g-3'>
									<div className='col-12'>
										<Button
											icon='Contacts'
											color='info'
											className='w-100 p-3'
											isLight={TABS.ACCOUNT_DETAIL !== activeTab}
											onClick={() => setActiveTab(TABS.ACCOUNT_DETAIL)}>
											{TABS.ACCOUNT_DETAIL}
										</Button>
									</div>
									<div className='col-12'>
										<Button
											icon='GeneratingTokens'
											color='info'
											className='w-100 p-3'
											isLight={TABS.USAGE !== activeTab}
											onClick={() => setActiveTab(TABS.USAGE)}>
											{TABS.USAGE}
										</Button>
									</div>
									<div className='col-12'>
										<Button
											icon='Policy'
											color='info'
											className='w-100 p-3'
											isLight={TABS.AI !== activeTab}
											onClick={() => setActiveTab(TABS.AI)}>
											{TABS.AI}
										</Button>
									</div>
									<div className='col-12 border-bottom' />
									<div className='col-12'>
										<Button
											icon='Payment'  // Use appropriate icon here
											color='info'
											className='w-100 p-3'
											isLight={TABS.BILLING !== activeTab}
											onClick={() => setActiveTab(TABS.BILLING)}>
											{TABS.BILLING}
										</Button>
										</div>

									
								</div>
							</CardBody>
							<CardFooter>
								<CardFooterLeft className='w-100'>
									<Button
										icon='Logout'
										color='danger'
										isLight
										className='w-100 p-3'>
										Logout
									</Button>
								</CardFooterLeft>
							</CardFooter>
						</Card>
					</div>
					<div className='col-xl-9 col-lg-8 col-md-6'>
					{TABS.ACCOUNT_DETAIL === activeTab && (
							 <Card stretch tag='form' noValidate onSubmit={formik.handleSubmit}>
							 <CardHeader>
							   <CardLabel icon='Contacts' iconColor='info'>
								 <CardTitle>Account Details</CardTitle>
							   </CardLabel>
							 </CardHeader>
							 <CardBody className='pb-0' isScrollable>
							   <div className='row g-4'>
          <div className='col-12'>
            <div className='row g-4 align-items-center'>
              <div className='col-lg-auto'>
              <Avatar src={avatarPreview || userProfileData?.avatar || ''} color={USERS.JOHN.color} />

              </div>
              {isEditing && (
                <div className='col-lg'>
                  <div className='row g-4'>
                    <div className='col-auto'>
					<Input
						type='file'
						autoComplete='photo'
						onChange={handleChangeAvatar}
						/>
                    </div>
                    <div className='col-auto'>
                      <Button color='dark' isLight icon='Delete'>
                        Delete Avatar
                      </Button>
                    </div>
                    <div className='col-12'>
                      <p className='lead text-muted'>
                        Avatar helps your teammates get to know you.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
								 <div className='col-12 border-bottom' />
								 <div className='col-md-6'>
								   <FormGroup id='firstName' label='UserName' isFloating>
								   <Input
										placeholder='Username'
										autoComplete='additional-name'
										
										value={formik.values.firstName || (userProfileData?.user?.username ?? '')}
										
										readOnly={true}
										/>
								   </FormGroup>
								 </div>
								 <div className='col-12 border-bottom' />
								 <div className='col-md-6'>
								   <FormGroup id='emailAddress' label='Email address' isFloating>
								   <Input
									type='email'
									placeholder='Email address'
									autoComplete='email'
									
									value={formik.values.emailAddress || (userProfileData && userProfileData.user.email) || ''}
									
									readOnly={true}
									/>

								   </FormGroup>
								 </div>
							{/* Lang Selector */}
				<div className='col-auto'>
					<Dropdown>
						<label> Language :</label>
						<DropdownToggle hasIcon={false}>
							{typeof getLangWithKey(router.locale as ILang['key']['lng'])?.icon ===
							'undefined' ? (
								<Button
									// eslint-disable-next-line react/jsx-props-no-spreading
									{...styledBtn}
									className='btn-only-icon'
									aria-label='Change language'
									data-tour='lang-selector'>
									<Spinner isSmall inButton='onlyIcon' isGrow />
								</Button>
							) : (
								<Button
									// eslint-disable-next-line react/jsx-props-no-spreading
									{...styledBtn}
									icon={
										getLangWithKey(router.locale as ILang['key']['lng'])?.icon
									}
									aria-label='Change language'
									data-tour='lang-selector'
								/>
							)}
						</DropdownToggle>
						<DropdownMenu isAlignmentEnd data-tour='lang-selector-menu'>
							{Object.keys(LANG).map((i) => (
								<DropdownItem key={LANG[i].lng}>
									<Button
										icon={LANG[i].icon}
										onClick={() => changeLanguage(LANG[i].lng)}>
										{LANG[i].text}
									</Button>
								</DropdownItem>
							))}
						</DropdownMenu>
					</Dropdown>
				</div>
							   </div>
							 </CardBody>
							 <CardFooter>
							 <CardFooterLeft>
          <Button color='info' isLink onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </CardFooterLeft>
							   <CardFooterRight>
							   {isEditing && (
    <Button type='submit' icon='Save' color='info' isOutline >
        Save
    </Button>
)}



							   </CardFooterRight>
							 </CardFooter>
						   </Card>
						)}
						{TABS.USAGE === activeTab && (
							<Card
								stretch
								tag='form'
								noValidate
								>
								<CardHeader>
									<CardLabel icon='Generating Tokens' iconColor='info'>
										<CardTitle>{TABS.ADDRESS}</CardTitle>
									</CardLabel>
								</CardHeader>
								<CardBody className='pb-0' isScrollable>
									<div className='row g-4'>

									</div>
								</CardBody>
								<CardFooter>
									<CardFooterLeft>
										<Button
											color='info'
											isLink
											type='reset'
											>
											Reset
										</Button>
									</CardFooterLeft>
									<CardFooterRight>
										<Button
											type='submit'
											icon='Save'
											color='info'
											isOutline
											>
											Save
										</Button>
									</CardFooterRight>
								</CardFooter>
							</Card>
						)}
						{TABS.BILLING === activeTab && (

<div id='second' className='row scroll-margin'>
<div className='col-12 mb-3'>
	<div className='display-4 fw-bold py-3'>Choose your Plan!</div>
</div>

<div className='col-md-4' onClick={() => setSelectedPlan('hobby')}>
<Card stretch borderColor={selectedPlan === 'hobby' ? 'warning' : undefined} borderSize={selectedPlan === 'hobby' ? 3 : 0} shadow={selectedPlan === 'hobby' ? 'lg' : undefined}>
		<CardBody>
			<div className='row pt-5 g-4 align-items-center'>
				<div className='col-auto'>
					<Icon icon='CustomRocketLaunch' size='5x' color='warning' />
				</div>
				<div className='col'>
					<h2>Hobby</h2>
				</div>
				<div className='col-12'>
					<h3 className='display-1 fw-bold'>
						<span className='display-4 fw-bold'>$</span>9
						<span className='display-6'>/mo</span>
					</h3>
				</div>
				<div className='col-12'>
					<div className='lead'>
						<Icon icon='Done Outline' color='success' /> 1000 message credits/month
					</div>
					<div className='lead'>
						<Icon icon='Done Outline' color='success' /> 3 Chatbots
					</div>
					<div className='lead text-muted'>
						<Icon icon='Close' color='danger' /> Access to all the Loaders 
					</div>
					<div className='lead text-muted'>
						<Icon icon='Close' color='danger' /> Text to speech Enabled
					</div>
				</div>
				<div className='col-12'>
					<p>Lorem ipsum dolor sit amet.</p>
				</div>
				<div className='col-12'>
					<Button
						color='warning'
						isLight
						className='w-100 py-3 text-uppercase'
						size='lg'>
						Select Plan
					</Button>
				</div>
			</div>
		</CardBody>
	</Card>
</div>
<div className='col-md-4' onClick={() => setSelectedPlan('standard')}>
<Card stretch borderColor={selectedPlan === 'standard' ? 'primary' : undefined} borderSize={selectedPlan === 'standard' ? 3 : 0} shadow={selectedPlan === 'standard' ? 'lg' : undefined}>
		<CardBody>
			<div className='row pt-5 g-4 align-items-center'>
				<div className='col-auto'>
					<Icon icon='Maps Home Work' size='5x' color='primary' />
				</div>
				<div className='col'>
					<h2>Standard</h2>
				</div>
				<div className='col-12'>
					<h3 className='display-1 fw-bold'>
						<span className='display-4 fw-bold'>$</span>19
						<span className='display-6'>/mo</span>
					</h3>
				</div>
				<div className='col-12'>
					<div className='lead'>
						<Icon icon='Done Outline' color='success' /> 5 Chatbots
					</div>
					<div className='lead'>
						<Icon icon='Done Outline' color='success' />2,000,000 characters/chatbot
					</div>
					<div className='lead'>
						<Icon icon='Done Outline' color='success' /> Access to all the Loaders
					</div>
					<div className='lead'>
						<Icon icon='Done Outline' color='success' /> Text to Speech Enabled
					</div>
				</div>
				<div className='col-12'>
					<p>Lorem ipsum dolor sit amet.</p>
				</div>
				<div className='col-12'>
					<Button
						color='primary'
						className='w-100 py-3 text-uppercase'
						size='lg'>
						Select Plan
					</Button>
				</div>
			</div>
		</CardBody>
	</Card>
</div>
<div className='col-md-4' onClick={() => setSelectedPlan('enterprise')}>
<Card stretch borderColor={selectedPlan === 'enterprise' ? 'info' : undefined} borderSize={selectedPlan === 'enterprise' ? 3 : 0} shadow={selectedPlan === 'enterprise' ? 'lg' : undefined}>
		<CardBody>
			<div className='row pt-5 g-4 align-items-center'>
				<div className='col-auto'>
					<Icon icon='CustomFactory' size='5x' color='info' />
				</div>
				<div className='col'>
					<h2>Enterprise</h2>
				</div>
				<div className='col-12'>
					<h3 className='display-1 fw-bold'>
						<span className='display-4 fw-bold'>$</span>49
						<span className='display-6'>/mo</span>
					</h3>
				</div>
				<div className='col-12'>
					<div className='lead'>
						<Icon icon='Done Outline' color='success' /> Upto 10 Chatbots
					</div>
					<div className='lead'>
						<Icon icon='Done Outline' color='success' /> 5,00,000 characters/chatbot
					</div>
					<div className='lead'>
						<Icon icon='Done Outline' color='success' /> Access to all Loaders
					</div>
					<div className='lead'>
						<Icon icon='Done Outline' color='success' /> Text to Speech Enabled
					</div>
				</div>
				<div className='col-12'>
					<p>Lorem ipsum dolor sit amet.</p>
				</div>
				<div className='col-12'>
					<Button
						color='info'
						isLight
						className='w-100 py-3 text-uppercase'
						size='lg'>
						Select Plan
					</Button>
				</div>
			</div>
		</CardBody>
	</Card>
</div>

</div>
						)}

					
					</div>
				</div>
			</Page>
		</Layout>
	);
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
	props: {
		// @ts-ignore
		
	},
});

export default Index;
