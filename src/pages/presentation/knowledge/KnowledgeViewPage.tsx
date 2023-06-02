import React, { useState ,useEffect} from 'react';
import { useNavigate, useParams  } from 'react-router-dom';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { Calendar as DatePicker } from 'react-date-range';
import classNames from 'classnames';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Avatar from '../../../components/Avatar';
import UserImageWebp from '../../../assets/img/wanna/wanna1.webp';
import UserImage from '../../../assets/img/wanna/wanna1.png';
import Button from '../../../components/bootstrap/Button';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import InputGroup, { InputGroupText } from '../../../components/bootstrap/forms/InputGroup';
import Input from '../../../components/bootstrap/forms/Input';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Label from '../../../components/bootstrap/forms/Label';
import CommonFilterTag from '../../_common/CommonFilterTag';
import CommonTableRow from '../../_common/CommonTableRow';
import Select from '../../../components/bootstrap/forms/Select';
import Popovers from '../../../components/bootstrap/Popovers';

import data from '../../../common/data/dummyProductData';
import { demoPagesMenu } from '../../../menu';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../components/PaginationButtons';
import useSortableData from '../../../hooks/useSortableData';
import Icon from '../../../components/icon/Icon';
import useSelectTable from '../../../hooks/useSelectTable';
import useDarkMode from '../../../hooks/useDarkMode';
import useTourStep from '../../../hooks/useTourStep';
import { sampleKnowledgeBases } from '../../../common/data/dummyProductData';
import { KnowledgeBaseModal } from './components/Modal';

export interface KnowledgeDocument {
    id: number;
    document_type: string;
    data: any;  // or define a more specific type if you know the structure of the JSON data
}


export interface KnowledgeBase {
    id: number;
    name: string;
    user: number;
    documents: KnowledgeDocument[];  // Add this line
    documents_count?: number;  // Add this line if you want to include a count of documents
}
  


const ListBoxedPage = () => {
	/**
	 * For Tour
	 */
	useTourStep(6);
	const navigate = useNavigate();

	const { themeStatus, darkModeStatus } = useDarkMode();

	const [date, setDate] = useState<Date>(new Date());

	const [filterMenu, setFilterMenu] = useState<boolean>(false);
	const formik = useFormik({
		initialValues: {
			minPrice: '',
			maxPrice: '',
			categoryName: '3D Shapes',
			companyA: true,
			companyB: true,
			companyC: true,
			companyD: true,
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		onSubmit: (values) => {
			setFilterMenu(false);
			// alert(JSON.stringify(values, null, 2));
		},
	});

	const filteredData = data.filter(
		(f) =>
			// Category
			f.category === formik.values.categoryName &&
			// Price
			(formik.values.minPrice === '' || f.price > Number(formik.values.minPrice)) &&
			(formik.values.maxPrice === '' || f.price < Number(formik.values.maxPrice)) &&
			//	Company
			((formik.values.companyA ? f.store === 'Company A' : false) ||
				(formik.values.companyB ? f.store === 'Company B' : false) ||
				(formik.values.companyC ? f.store === 'Company C' : false) ||
				(formik.values.companyD ? f.store === 'Company D' : false)),
	);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [perPage, setPerPage] = useState<number>(PER_COUNT['10']);

	const { items, requestSort, getClassNamesFor } = useSortableData(filteredData);
	const onCurrentPageItems = dataPagination(items, currentPage, perPage);
	
    const { selectTable, SelectAllCheck } = useSelectTable(onCurrentPageItems);
    const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);

	const BASE_URL = process.env.REACT_APP_DJANGO_BASE_URL;

    const [isModalOpen, setIsModalOpen] = useState(false);

	const fetchKnowledgeBases = async () => {
		try {
		  const response = await fetch(`${BASE_URL}/get_knowledgebases/`, {
			headers: {
			  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
			},
		  });
	  
		  if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		  }
	  
		  const data = await response.json();
		  setKnowledgeBases(data);
		} catch (error) {
		  console.error('Failed to fetch knowledge bases:', error);
		}
	  };
	  
	  // Call the function inside the useEffect hook
	  useEffect(() => {
		fetchKnowledgeBases();
	  }, []);  

    function handleView(knowledgeBase: KnowledgeBase) {
		console.log(knowledgeBase.documents);
		// open modal or navigate to new page to display the documents
	}
	
	async function handleDelete(knowledgeBaseId: number) {
		try {
		  const response = await fetch(`${BASE_URL}/delete_knowledgebase/${knowledgeBaseId}/`, {
			  method: 'DELETE',
			  headers: {
				  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
			  },
		  });
	  
		  if (!response.ok) {
			  throw new Error(`HTTP error! status: ${response.status}`);
		  }
	  
		  // Refresh the knowledge bases
		  fetchKnowledgeBases();
		} catch (error) {
		  console.error('Failed to delete knowledge base:', error);
		}
	  }
	  



	return (
		<PageWrapper title="hey">
			<SubHeader>
				<SubHeaderLeft>
					
				</SubHeaderLeft>
				<SubHeaderRight>
					
					<SubheaderSeparator />
					
						
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<Card stretch data-tour='list'>
					<CardHeader>
						<CardLabel icon='InsertDriveFile' iconColor='info'>
							<CardTitle>
								Knowledge Base{' '}
								<small className='ms-2'>
									Item:{' '}
									{selectTable.values.selectedList.length
										? `${selectTable.values.selectedList.length} / `
										: null}
									{filteredData.length}
								</small>
							</CardTitle>
                          
						</CardLabel>
                        <Button color='primary' isLight icon='AddBox' onClick={() => setIsModalOpen(true)}>
                Add New
            </Button>
            <KnowledgeBaseModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
						<CardActions>
							<Dropdown isButtonGroup>
								<Popovers
									desc={
										<DatePicker
											onChange={(item) => setDate(item)}
											date={date}
											color={process.env.REACT_APP_PRIMARY_COLOR}
										/>
									}
									placement='bottom-end'
									className='mw-100'
									trigger='click'>
									<Button color='success' isLight icon='WaterfallChart'>
										{dayjs(date).format('MMM Do')}
									</Button>
								</Popovers>
								<DropdownToggle>
									<Button color='success' isLight />
								</DropdownToggle>
								<DropdownMenu isAlignmentEnd>
									<DropdownItem>
										<span>Last Hour</span>
									</DropdownItem>
									<DropdownItem>
										<span>Last Day</span>
									</DropdownItem>
									<DropdownItem>
										<span>Last Week</span>
									</DropdownItem>
									<DropdownItem>
										<span>Last Month</span>
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
							<Button
								color='info'
								icon='CloudDownload'
								isLight
								tag='a'
								to='/somefile.txt'
								target='_blank'
								download>
								Export
							</Button>
							<Dropdown className='d-inline'>
								<DropdownToggle hasIcon={false}>
									<Button color={themeStatus} icon='MoreHoriz' />
								</DropdownToggle>
								<DropdownMenu isAlignmentEnd>
									<DropdownItem>
										<Button icon='Edit'>Edit</Button>
									</DropdownItem>
									<DropdownItem>
										<Button icon='Delete'>Delete</Button>
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</CardActions>
					</CardHeader>
					<CardBody className='table-responsive' isScrollable>
  <table className='table table-modern table-hover'>
    <thead>
      <tr>
        <th scope='col'>#</th>
        <th scope='col'>Name</th>
        <th scope='col'>Files</th>
        <th scope='col'>Actions</th>
      </tr>
    </thead>
    <tbody>
    {knowledgeBases.map((knowledgeBase, index) => {

  return (
    <tr key={knowledgeBase.id}>
      <td>{index + 1}</td>
      <td>{knowledgeBase.name}</td>
      <td>{knowledgeBase.documents?.length || 0}</td>
      <td>
        <Button icon='Edit' ></Button>
        <Button icon='Delete' onClick={() => handleDelete(knowledgeBase.id)}></Button>

        <Button icon='RemoveRedEye' onClick={() => handleView(knowledgeBase)}></Button>

		<Button icon='Chat' onClick={() => navigate(`/chat/test3/${knowledgeBase.id}`)}>Chat</Button>
      </td>
    </tr>
  )
})}
    </tbody>
  </table>
</CardBody>
					<PaginationButtons
						data={items}
						label='items'
						setCurrentPage={setCurrentPage}
						currentPage={currentPage}
						perPage={perPage}
						setPerPage={setPerPage}
					/>
				</Card>
			</Page>
		</PageWrapper>
	);
};

export default ListBoxedPage;
