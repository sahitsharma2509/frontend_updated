import React, { useState, useContext, ReactNode } from 'react';

import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { demoPagesMenu } from '../../menu';
import { DropdownItem, DropdownMenu } from '../../components/bootstrap/Dropdown';
import Button from '../../components/bootstrap/Button';
import useDarkMode from '../../hooks/useDarkMode';
import Collapse from '../../components/bootstrap/Collapse';
import { NavigationLine } from '../Navigation/Navigation';
import Icon from '../../components/icon/Icon';
import useNavigationItemHandle from '../../hooks/useNavigationItemHandle';
import AuthContext from '../../contexts/authContext';
import { useRouter } from 'next/router'

const User = () => {
   const { userProfileData, setUserProfileData } = useContext(AuthContext);
     console.log("data",userProfileData); // Let's log userProfileData to see what we're working with.

    const router = useRouter();
    const { darkModeStatus, setDarkModeStatus } = useDarkMode();
    const [collapseStatus, setCollapseStatus] = useState(false);
    const { t } = useTranslation();

    return (
        <>
            <div
                className={classNames('user', { open: collapseStatus })}
                role='presentation'
                onClick={() => setCollapseStatus(!collapseStatus)}>
                <div className='user-avatar'>
                    {/*<img
                        srcSet={}
                        src={}
                        alt='Avatar'
                        width={128}
                        height={128}
                    />*/}
                </div>
                <div className='user-info'>
                    <div className='user-name d-flex align-items-center'>
                        {`Hi! ${userProfileData?.user.first_name}`}
                        <Icon icon='Verified' className='ms-1' color='info' />
                    </div>
                </div>
            </div>
            <DropdownMenu>
                <DropdownItem>
                    <Button
                        icon={darkModeStatus ? 'DarkMode' : 'LightMode'}
                        onClick={() => setDarkModeStatus(!darkModeStatus)}
                        aria-label='Toggle fullscreen'>
                        {darkModeStatus ? 'Dark Mode' : 'Light Mode'}
                    </Button>
                </DropdownItem>
            </DropdownMenu>

            <Collapse isOpen={collapseStatus} className='user-menu'>
                <nav aria-label='user-menu'>
                    <div className='navigation'>
                        <div
                            role='presentation'
                            className='navigation-item cursor-pointer'
                            onClick={() => router.push('/profile')}>
                            <span className='navigation-link navigation-link-pill'>
                                <span className='navigation-link-info'>
                                    <Icon icon='AccountBox' className='navigation-icon' />
                                    <span className='navigation-text'>
                                        {t('menu:Profile')}
                                    </span>
                                </span>
                            </span>
                        </div>

                        <div
                            role='presentation'
                            className='navigation-item cursor-pointer'
                            onClick={() => {
                                setDarkModeStatus(!darkModeStatus);
                            }}>
                            <span className='navigation-link navigation-link-pill'>
                                <span className='navigation-link-info'>
                                    <Icon
                                        icon={darkModeStatus ? 'DarkMode' : 'LightMode'}
                                        color={darkModeStatus ? 'info' : 'warning'}
                                        className='navigation-icon'
                                    />
                                    <span className='navigation-text'>
                                        {darkModeStatus
                                            ? t('menu:DarkMode')
                                            : t('menu:LightMode')}
                                    </span>
                                </span>
                            </span>
                        </div>
                    </div>
                </nav>
                <nav aria-label='logout-menu'>
                    <div className='navigation'>
                        <div
                            role='presentation'
                            className='navigation-item cursor-pointer'
                            onClick={() => {
                                if (setUserProfileData) {
                                    localStorage.removeItem('access_token');
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('accessToken');
                                    setUserProfileData(null);
                                    router.push('/login');
                                }
                            }}>
                            <span className='navigation-link navigation-link-pill'>
                                <span className='navigation-link-info'>
                                    <Icon icon='Logout' className='navigation-icon' />
                                    <span className='navigation-text'>
                                        {t('menu:Logout')}
                                    </span>
                                </span>
                            </span>
                        </div>
                    </div>
                </nav>
            </Collapse>
        </>
    );
};

export default User;

