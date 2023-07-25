import React, { useState ,useEffect} from 'react';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { Calendar as DatePicker } from 'react-date-range';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../layout/SubHeader/SubHeader';
import Button from '../../components/bootstrap/Button';
import Page from '../../layout/Page/Page';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../components/bootstrap/Dropdown';

import Popovers from '../../components/bootstrap/Popovers';

import data from '../../common/data/dummyProductData';

import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../components/PaginationButtons';
import useSortableData from '../../hooks/useSortableData';
import useSelectTable from '../../hooks/useSelectTable';
import useDarkMode from '../../hooks/useDarkMode';
import useTourStep from '../../hooks/useTourStep';
import { KnowledgeBaseModal, KnowledgeBase, KnowledgeDocument } from '../presentation/knowledge/components/Modal';
import { DocumentModal } from '../presentation/knowledge/components/Modal';
import { useRouter } from "next/router";
import Layout from '../../components/Layout';
import { deleteKnowledgeBase } from '../../common/data/api';
import {useMutation, useQueryClient , useQuery} from 'react-query';
import { getKnowledgeBases } from '../../common/data/api';
import showNotification from '../../components/extras/showNotification';
import Icon from '../../components/icon/Icon';



const ListBoxedPage = () => {

	

	useTourStep(6);
	const router = useRouter();

	const { themeStatus, darkModeStatus } = useDarkMode();
	const queryClient = useQueryClient();

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
	const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<KnowledgeBase | null>(null);

	const { data: knowledgeBases} = useQuery<KnowledgeBase[]>('knowledgebases', getKnowledgeBases);
	const [deletingKnowledgeBase, setDeletingKnowledgeBase] = useState<number | null>(null);

	

    const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);


	const deleteKnowledgeBaseMutation = useMutation(deleteKnowledgeBase, {
		onSuccess: () => {
			queryClient.invalidateQueries('knowledgebases');
			
			// Display a success notification
			showNotification('Success', 'Knowledge Base deleted successfully', 'info');
		},
		onError: () => {
			// Optionally, handle any error by showing a notification
			showNotification('Error', 'Failed to delete Knowledge Base', 'danger');
		}
	});
	


	useEffect(() => {
		console.log(isModalOpen);
	}, [isModalOpen]);
	
	  
	  // Call the function inside the useEffect hook

    function handleView(knowledgeBase: KnowledgeBase) {

		setSelectedKnowledgeBase(knowledgeBase);
		setIsDocumentModalOpen(true);
		console.log(knowledgeBase.documents);
		// open modal or navigate to new page to display the documents
	}
	


	const handleDelete = (knowledgeBaseId: number) => {
		setDeletingKnowledgeBase(knowledgeBaseId);
	  };
	  
	  const confirmDelete = () => {
		if (deletingKnowledgeBase !== null) {
		  deleteKnowledgeBaseMutation.mutate(deletingKnowledgeBase.toString());
		}
		setDeletingKnowledgeBase(null);
	  };
	  
	  const cancelDelete = () => {
		setDeletingKnowledgeBase(null);
	  };
	

	return (
		<Layout title="hey">
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
                New
            </Button>
            <KnowledgeBaseModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
			{selectedKnowledgeBase && (
      <DocumentModal
        isOpen={isDocumentModalOpen}
        setIsOpen={setIsDocumentModalOpen}
        knowledgeBase={selectedKnowledgeBase}
      />
    )}
						<CardActions>
							<Dropdown isButtonGroup>
								<Popovers
									desc={
										<DatePicker
											onChange={(item) => setDate(item)}
											date={date}
											color={process.env.NEXT_PUBLIC_PRIMARY_COLOR}
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
	{knowledgeBases?.map((knowledgeBase: KnowledgeBase, index: number) => {
      return (
        <tr key={knowledgeBase.id}>
          <td>{index + 1}</td>
          <td>{knowledgeBase.name}</td>
          <td>{knowledgeBase.documents?.length || 0}</td>
          <td>
            {deletingKnowledgeBase === knowledgeBase.id ? (
              <>
                <Icon icon='Check' onClick={confirmDelete} />
                <Icon icon='Clear' onClick={cancelDelete} />
              </>
            ) : (
              <>
                <Button icon='Edit' ></Button>
                <Button icon='Delete' onClick={() => handleDelete(knowledgeBase.id)}></Button>
                <Button icon='RemoveRedEye' onClick={() => handleView(knowledgeBase)}></Button>
                <Button icon='Chat' onClick={() => router.push(`/chat/private/${knowledgeBase.id}`)}>Chat</Button>
              </>
            )}
          </td>
        </tr>
      );
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
		</Layout>
	);
};

export default ListBoxedPage;
