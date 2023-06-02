import React, { FC, useCallback, useState ,useContext, createContext} from 'react';
import classNames from 'classnames';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Select from '../../../components/bootstrap/forms/Select';
import Card, { CardBody, CardTitle } from '../../../components/bootstrap/Card';
import Badge from '../../../components/bootstrap/Badge';
import data, { CATEGORIES, TTags } from './helper/dummyKnowledgeData';
import { demoPagesMenu } from '../../../menu';
import useDarkMode from '../../../hooks/useDarkMode';
import { TColor } from '../../../type/color-type';
import { YouTubeModal, PDFModal } from './components/Modal';




interface IItemProps {
    id: string | number;
    image: string;
    title: string;
    description: string;
    tags: TTags[];
    color: TColor;
    onSelect: (id: string | number, type: string) => void; // Added onSelect prop
}

const Item: FC<IItemProps> = ({ id, image, title, description, tags, color, onSelect }) => { 


    const handleSelect = (id: string | number, tags: TTags[]) => {
        // If tags are not empty
        if (tags.length > 0) {
            console.log('Clicked item with ID:', id); // added console.log to check the id
            console.log('Item has tags:', tags); // added console.log to check the tags
            // Depending on the first tag's text, set the appropriate modal state
            switch(tags[0].text) {
                case 'Youtube':
                    console.log('Opening Youtube modal...'); // added console.log to check the case
                    onSelect(id, 'Youtube');
                    break;
                case 'PDF':
                    console.log('Opening PDF modal...'); // added console.log to check the case
                    onSelect(id, 'PDF');
                    break;
                default:
                    console.log('No matching tag found.'); // added console.log to check the default case
                    break;
            }
        } else {
            console.log('No tags found for this item.'); // added console.log to handle the situation when there are no tags
        }
    };
    
  

	return (
		<Card 
			className='cursor-pointer shadow-3d-primary shadow-3d-hover'
			onClick={() => handleSelect(id, tags)}
			data-tour={title}>
			<CardBody>
				<CardTitle>{title}</CardTitle>
				<p className='text-muted truncate-line-2'>{description}</p>
				<div className='row g-2'>
					{!!tags &&
						// eslint-disable-next-line react/prop-types
						tags.map((tag) => (
							<div key={tag.text} className='col-auto'>
								<Badge isLight color={tag.color} className='px-3 py-2'>
									{tag.text}
								</Badge>
							</div>
						))}
				</div>
			</CardBody>
		</Card>
	);
};

const test = () => {
	const { darkModeStatus } = useDarkMode();
    const [selectedItem, setSelectedItem] = useState<{ id: string | number, type: string } | null>(null); // Changed ItemType to string
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const handleItemSelect = (id: string | number, type: string) => {
        console.log(`Setting selectedItem to id: ${id}, type: ${type}`);
        setSelectedItem({ id, type });
        setModalOpen(true);
    };

    const closeModals = () => {
        setSelectedItem(null);
        setModalOpen(false);
    };
	const [filterableData, setFilterableData] = useState(data);



	return (
		<PageWrapper title={demoPagesMenu.knowledge.subMenu.grid.text}>
			<Page>
				<div className='row'>
					<div className='col-12 text-center my-5'>
						<span className='display-5 fw-bold'>Create your knowledge base</span>
					</div>
					
				</div>
				<div className='row mb-5'>
					{filterableData.map((item) => (
						<div key={item.id} className='col-xl-3 col-lg-4 col-md-6'>
							{/* eslint-disable-next-line react/jsx-props-no-spreading */}
                            <Item {...item} onSelect={handleItemSelect} />

						</div>
					))}
				</div>


                <>
                {selectedItem?.type === 'Youtube' && 
                    <YouTubeModal id={selectedItem.id} isOpen={isModalOpen} setIsOpen={setModalOpen} />
                }
            </>
            <>
                {selectedItem?.type === 'PDF' && 
                    <PDFModal id={selectedItem.id} isOpen={isModalOpen} setIsOpen={setModalOpen} />
                }
            </>
			</Page>

         


		</PageWrapper>
	);
};

export default test;
