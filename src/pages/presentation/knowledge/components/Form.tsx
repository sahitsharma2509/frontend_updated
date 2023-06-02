// In Modals.tsx
import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router';
import Button from '../../../../components/bootstrap/Button';
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



interface YouTubeFormProps {
    id: string | number;
    onInputChange: (data: { name: string, url: string }) => void;
    onRemove: () => void;
}

export const YouTubeForm: React.FC<YouTubeFormProps> = ({ id, onInputChange, onRemove }) => {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        onInputChange({ name, url });
    }, [name, url]);

    return (
        <div>
            
            <FormGroup
                id={`youtube-url-${id}`}
                label='URL'>
                <Input
                    type='url'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
                    value={url}
                />
            </FormGroup>
            <Button color="danger" isOutline onClick={onRemove}>Remove</Button>
        </div>
    );
};

interface PDFFormProps {
    id: string | number;
    onInputChange: (data: { name: string, file: File | null }) => void;
    onRemove: () => void;
}

export const PDFForm: React.FC<PDFFormProps> = ({ id, onInputChange, onRemove }) => {
    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    useEffect(() => {
        onInputChange({ name, file });
    }, [name, file]);

    return (
        <div>
           
            <FormGroup
                id={`pdf-file-${id}`}
                label='File'>
                <Input
                    type='file'
                    onChange={handleFileUpload}
                />
            </FormGroup>
            <Button color="danger" isOutline onClick={onRemove}>Remove</Button>
        </div>
    );
};
