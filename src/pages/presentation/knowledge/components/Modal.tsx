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





interface KnowledgeBaseModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({ isOpen, setIsOpen }) => {
    const [knowledgeBaseName, setKnowledgeBaseName] = useState("");
    const [selectedInputType, setSelectedInputType] = useState("");
    const [selectedInputs, setSelectedInputs] = useState<Array<{ type: string, data: any }>>([]);
    const csrftoken = Cookies.get("csrftoken") || '';

    
    axios.defaults.headers.common["X-CSRFToken"] = csrftoken;
    
    const BASE_URL = process.env.REACT_APP_DJANGO_BASE_URL;

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
    
        const response = await fetch(`${BASE_URL}/create_knowledgebase/`, {  // your Django view's URL
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                // No 'Content-Type': 'application/json' here because we are sending form data
                // Include any other necessary headers, like CSRF tokens
            },
            body: formData,
        });
    
        const data = await response.json();
        console.log("data", data);
    
        if (data.detail === 'Knowledge base created.') {
            setIsOpen(false);  // Close the modal
        } else {
            console.error('Error creating knowledge base:', data.detail);
        }
    };
    
    

    return (
        <Modal
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            size='lg'
            isScrollable
            data-tour='knowledge-base-modal'>
            <ModalHeader className='px-4' setIsOpen={setIsOpen}>
                <ModalTitle id='knowledge-base-modal'>Create Knowledge Base</ModalTitle>
            </ModalHeader>
            <ModalBody className='px-4'>
                <div className='row'>
                    <div className='col-md-8'>
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

<Button color="primary" onClick={handleSubmit}>Submit</Button>
<Button color="secondary" onClick={() => setIsOpen(false)}>Close</Button>
</div>
</div>
</ModalBody>
</Modal>
);
};

                       












interface YouTubeModalProps {
    id: string | number;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

interface PDFModalProps {
    id: string | number;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}




export const YouTubeModal: React.FC<YouTubeModalProps> = ({ id ,isOpen, setIsOpen }) => {
    console.log(`YouTubeModal isOpen: ${isOpen}, id: ${id}`);
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const navigate = useNavigate();
    const [isValid, setIsValid] = useState(true);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isValid) {
          try {
            const token = localStorage.getItem("access_token"); // fetch the token
            if (!token) {
              throw new Error('No access token found');
            }
            const data = await sendYouTubeUrl(url, token);

            const ytdID = data.yt_link_id



            const conversation = await createYTConversation(token, ytdID);
            console.log("Conversation:",conversation)

            navigate(`/chat/test/${conversation.conversation_id}`);
            setResponse(data);
            setError(null); 
             // Reset the error message when request is successful
          } catch (err: any) {
            setError(err.message);
          }
        }
      };

    return (
        <Modal
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          size='lg'
          isScrollable
          data-tour='mail-app-modal'>
          <ModalHeader className='px-4' setIsOpen={setIsOpen}>
              <ModalTitle id='youtube-edit'>YouTube Information</ModalTitle>
          </ModalHeader>
          <ModalBody className='px-4'>
              <div className='row'>
                  <div className='col-md-8'>
                      <Card shadow='sm'>
                          <CardHeader>
                              <CardLabel icon='Info' iconColor='success'>
                                  <CardTitle>YouTube Details</CardTitle>
                              </CardLabel>
                          </CardHeader>
                          <CardBody>
                              <div className='row g-4'>
                                  <FormGroup
                                      className='col-12'
                                      id='name'
                                      label='Name'>
                                      <Input
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                          value={name}
                                      />
                                  </FormGroup>
                                  <FormGroup
                                      className='col-12'
                                      id='url'
                                      label='URL'>
                                      <Input
                                          type='url'
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                                          value={url}
                                      />
                                  </FormGroup>
                                  <Button color="primary" onClick={handleSubmit}>Save</Button>
                                  <Button color="secondary" onClick={() => setIsOpen(false)}>Close</Button>
                              </div>
                          </CardBody>
                      </Card>
                  </div>
              </div>
          </ModalBody>
        </Modal>
    );
};


export const PDFModal: React.FC<PDFModalProps> = ({ id ,isOpen, setIsOpen }) => {
    console.log(`PDFModal isOpen: ${isOpen}, id: ${id}`);
    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();


    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            setFile(e.target.files[0]);
        }
    };
    

    const handleSubmit = async () => {
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            
            
            const response = await uploadSinglePDF(formData);
            const pdfId = response.pdf_document_id;
            console.log(response);
            const token = localStorage.getItem("access_token");
      if (token) {
        const conversation = await createConversation(token, pdfId);
        console.log("Conversation:",conversation)

      
      
      navigate(`/chat/test/${conversation.conversation_id}`);
    }
            



        }
        setIsOpen(false);

    };

    return (
        <Modal
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            size='lg'
            isScrollable
            data-tour='mail-app-modal'>
            <ModalHeader className='px-4' setIsOpen={setIsOpen}>
                <ModalTitle id='project-edit'>PDF Upload</ModalTitle>
            </ModalHeader>
            <ModalBody className='px-4'>
                <div className='row'>
                    <div className='col-md-8'>
                        <FormGroup
                            className='col-12'
                            id='name'
                            label='Name'>
                            <Input
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                value={name}
                            />
                        </FormGroup>
                        <FormGroup
                            className='col-12'
                            id='file'
                            label='File'>
                            <Input
                                type='file'
                                onChange={handleFileUpload}
                            />
                        </FormGroup>
                        <Button color='primary' onClick={handleSubmit}>Save</Button>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default PDFModal;