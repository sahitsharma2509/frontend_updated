import React from 'react';
import Card, { CardBody } from '../../components/bootstrap/Card';
import PageWrapper from '../PageWrapper/PageWrapper';
import Page from '../Page/Page';
import SubHeader from '../SubHeader/SubHeader';
import dynamic from 'next/dynamic';
import { useState , useEffect} from 'react';
import ClientSideComponent from '../../components/ClientSideComponent';

const LOADING = (
	<PageWrapper>
		<SubHeader>
			<div />
		</SubHeader>
		<Page>
			<div className='row h-100'>
				<div className='col-lg-6'>
					<Card stretch>
						<CardBody>
							<div />
						</CardBody>
					</Card>
				</div>
				<div className='col-lg-6'>
					<Card stretch='semi'>
						<CardBody>
							<div />
						</CardBody>
					</Card>
					<Card stretch='semi'>
						<CardBody>
							<div />
						</CardBody>
					</Card>
				</div>
			</div>
		</Page>
	</PageWrapper>
);

const Content = () => {
	const [isClient, setIsClient] = useState(false);

	// This effect will run after component mount, setting isClient to true
	useEffect(() => {
	  setIsClient(true);
	}, []);
  
	return (
		<main className='content'>
			<ClientSideComponent>
				{/* nothing here, just empty */}
			</ClientSideComponent>
			{!isClient && LOADING}
		</main>
	);
	
};

export default Content;
