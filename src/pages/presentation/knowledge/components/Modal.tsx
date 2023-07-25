// In Modals.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '../../../../components/bootstrap/Button';
import Select from '../../../../components/bootstrap/forms/Select';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import { sendYouTubeUrl } from '../../../../common/data/uploadAPI';
import { createYTConversation } from '../../../../common/data/uploadAPI';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
import { AxiosProgressEvent } from 'axios';
import { PDFForm , YouTubeForm} from './Form';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../../components/bootstrap/Card';

import { uploadSinglePDF } from '../../../../common/data/uploadAPI';
import { createConversation } from '../../../../common/data/conversationUtils';
import axios from 'axios';
import Cookies from "js-cookie";
import Spinner from '../../../../components/bootstrap/Spinner';
import useClientSideLayoutEffect from '../../../../hooks/useClientSideLayoutEffect';
import { createKnowledgeBase,deleteKnowledgeBase } from '../../../../common/data/api';
import { useMutation, useQueryClient } from 'react-query';

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
  








interface KnowledgeBaseModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({ isOpen, setIsOpen }) => {


  console.log('Rendering KnowledgeBaseModal', isOpen);
    const [knowledgeBaseName, setKnowledgeBaseName] = useState("");
    const [selectedInputType, setSelectedInputType] = useState("");
    const [selectedInputs, setSelectedInputs] = useState<Array<{ type: string, data: any }>>([]);
    const csrftoken = Cookies.get("csrftoken") || '';
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();


    
    axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    

    const handleAddInput = () => {
        if (selectedInputType) {
            setSelectedInputs([...selectedInputs, { type: selectedInputType, data: {} }]);
            setSelectedInputType("");
        }
    };

    const handleInputDataChange = (index: number, data: any) => {
        const newInputs = [...selectedInputs];
        newInputs[index].data = data;
        setSelectedInputs(newInputs);
    };

    const handleRemoveInput = (index: number) => {
        const newInputs = [...selectedInputs];
        newInputs.splice(index, 1);
        setSelectedInputs(newInputs);
    };

    const createKnowledgeBaseMutation = useMutation(createKnowledgeBase, {
      onSuccess: () => {
        queryClient.invalidateQueries('knowledgebases');
      }
    });
    





    const handleSubmit = async () => {
      let formData = new FormData();
      
      formData.append("name", knowledgeBaseName);
      
      selectedInputs.forEach((input, index) => {
          if (input.type === "PDF") {
              formData.append(`inputs[${index}][type]`, input.type);
              formData.append(`inputs[${index}][data][file]`, input.data.file);
          } else if (input.type === "YouTube") {
              formData.append(`inputs[${index}][type]`, input.type);
              formData.append(`inputs[${index}][data][url]`, input.data.url);
          }
      });
    
      setIsLoading(true);
      try {
        await createKnowledgeBaseMutation.mutateAsync(formData);
        setIsOpen(false);  // Close the modal
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
    };
    
    

    return (
        <Modal
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            size='md'
            isScrollable
            data-tour='knowledge-base-modal'>
            <ModalHeader className='px-4' setIsOpen={setIsOpen}>
                <ModalTitle id='knowledge-base-modal'>Create Knowledge Base</ModalTitle>
            </ModalHeader>
            <ModalBody className='px-4'>
                <div className='row'>
                    <div className='col-md-12'>
                        <FormGroup className='col-12' label='Name'>
                            <Input
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKnowledgeBaseName(e.target.value)}
                                value={knowledgeBaseName}
                            />
                        </FormGroup>
                        <FormGroup className='col-12' label='Add Input'>
                        <Select 
    id='input-type' 
    name='inputType'
    placeholder='Select Input Type'
    ariaLabel='Input Type'
    list={[
        { value: '', text: 'Select Input Type' }, 
        { value: 'YouTube', text: 'YouTube' }, 
        { value: 'PDF', text: 'PDF' }
    ]}
    value={selectedInputType} 
    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedInputType(e.target.value);
    }}
    
    
/>
    <Button color='primary' onClick={handleAddInput} isDisable={!selectedInputType}>Add Input</Button>
</FormGroup>

                        {selectedInputs.map((input, index) => {
                            if (input.type === 'YouTube') {
                                return (
                                    <YouTubeForm
                                        key={index}
                                        id={index}
                                        onInputChange={(data) => handleInputDataChange(index, data)}
                                        onRemove={() => handleRemoveInput(index)}
                                    />
                                );
                            } else if (input.type === 'PDF') {
                                return (
                                    <PDFForm
                                        key={index}
                                        id={index}
                                        onInputChange={(data) => handleInputDataChange(index, data)}
                                        onRemove={() => handleRemoveInput(index)}
                                    />
                                );
                            } else {
                                return null;
                            }
                        })}

</div>
</div>
</ModalBody>
<ModalFooter>
{isLoading && 
    <div>
        
         Processing <Spinner inButton isSmall isGrow color ="danger" tag="div" />
    </div> 
}

 {/* Render the spinner when isLoading is true */}
<Button color="primary" onClick={handleSubmit}>Submit</Button>
<Button color="secondary" onClick={() => setIsOpen(false)}>Close</Button>
</ModalFooter>
</Modal>
);
};

interface DocumentModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  knowledgeBase: KnowledgeBase;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ isOpen, setIsOpen, knowledgeBase }) => {

  
  // Handle editing document name
  const handleEdit = (documentId: number) => {
    // Handle editing the document name here
  }

  // Handle deleting a document
  const handleDelete = (documentId: number) => {
    // Handle deleting the document here
  }

  // You can use a library like 'react-modal' to create your modal.
  // I'll just use a simple div for illustration.
  return isOpen ? (
    <Modal
  setIsOpen={setIsOpen}
  isOpen={isOpen}
  size='xl'
  isScrollable
  data-tour='document-modal'>
  <ModalHeader className='px-4' setIsOpen={setIsOpen}>
    <ModalTitle id='document-modal'>Manage Documents</ModalTitle>
  </ModalHeader>
  <ModalBody className='px-4'>
    <div className='row'>
      <div className='col-md-12'>
        <table className='table table-modern table-hover'>
          <thead>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Type</th>
              <th scope='col'>URL/File</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>
          <tbody>
          {knowledgeBase.documents.map((document, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{document.document_type}</td>
                <td>{document.data.url}</td>
                <td>
                  <Button icon='Edit' onClick={() => handleEdit(index)}></Button>
                  <Button icon='Delete' onClick={() => handleDelete(index)}></Button>
                </td>
              </tr>
            )
          })}
          </tbody>
        </table>
        <Button color="secondary" onClick={() => setIsOpen(false)}>Close</Button>
      </div>
    </div>
  </ModalBody>
</Modal>

  
  ) : null;
};
