import React, { useLayoutEffect, forwardRef, ReactElement, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ISubHeaderProps } from '../SubHeader/SubHeader';
import { IPageProps } from '../Page/Page';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/authContext';
import { demoPagesMenu } from '../../menu';
import { useRouter } from "next/router";

interface IPageWrapperProps {
	isProtected?: boolean;
	title?: string;
	description?: string;
	children:
		| ReactElement<ISubHeaderProps>[]
		| ReactElement<IPageProps>
		| ReactElement<IPageProps>[];
	className?: string;
}
const PageWrapper = forwardRef<HTMLDivElement, IPageWrapperProps>(
	({ isProtected, title, description, className, children }, ref) => {
		useEffect(() => {
			const titleElement = document.getElementsByTagName('TITLE')[0] as HTMLTitleElement;
			if (titleElement) {
			  titleElement.text = `${title ? `${title} | ` : ''}${process.env.NEXT_PUBLIC_SITE_NAME}`;
			}
		
			const metaElement = document.querySelector('meta[name="description"]') as HTMLMetaElement;
			if (metaElement) {
			  metaElement.setAttribute('content', description || process.env.REACT_APP_META_DESC || '');
			}
		}, [title, description]);
		
		  
		  

		const { user } = useContext(AuthContext);

		const router = useRouter();
		useEffect(() => {
			if (isProtected && user === '') {
				router.push(`../${demoPagesMenu.login.path}`);
			}
			return () => {};
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		return (
			<div ref={ref} className={classNames('page-wrapper', 'container-fluid', className)}>
				{children}
			</div>
		);
	},
);
PageWrapper.displayName = 'PageWrapper';
PageWrapper.propTypes = {
	isProtected: PropTypes.bool,
	title: PropTypes.string,
	description: PropTypes.string,
	// @ts-ignore
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};
PageWrapper.defaultProps = {
	isProtected: true,
	title: undefined,
	description: undefined,
	className: undefined,
};

export default PageWrapper;
