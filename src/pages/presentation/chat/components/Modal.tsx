import React, { useState } from 'react';
import { ModalHeader, ModalTitle, ModalBody, ModalFooter } from '../../../../components/bootstrap/Modal'; // import from your library
import Button from '../../../../components/bootstrap/Button';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Modal from '../../../../components/bootstrap/Modal';
import Input from '../../../../components/bootstrap/forms/Input';
import Textarea from '../../../../components/bootstrap/forms/Textarea';
import Checks from '../../../../components/bootstrap/forms/Checks';
interface AIModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, setIsOpen }) => {
    const [name, setName] = useState("");
   
    const [description, setDescription] = useState("");
    const [temperature, setTemperature] = useState(1);
    const [isModelTypeChecked, setIsModelTypeChecked] = useState(false);
    const [isSwitchChecked, setIsSwitchChecked] = useState(false);

    const handleSubmit = () => {
      // Handle submit here
    };
    
    return (
        <Modal
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            size='md'
            isScrollable
            data-tour='new-modal'>
            <ModalHeader className='px-4' setIsOpen={setIsOpen}>
                <ModalTitle id='new-modal'>AI Settings</ModalTitle>
            </ModalHeader>
            <ModalBody className='px-4'>
            <FormGroup className='col-12' label='Name'>
                    <Input type="text" 
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setName(e.target.value)} 
                    />
                </FormGroup>
                <FormGroup className='col-12' label='Description'>
                    <Textarea 
                        value={description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} 
                        size = 'lg'
                    />
                </FormGroup>
                <FormGroup className='col-12' label='Temperature'>
                <Input 
    type="range" 
    value={temperature}
    min={0}
    max={1}
    step={0.1}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTemperature(Number(e.target.value))} 
/>
<p>value: {temperature}</p>

                </FormGroup>
                <FormGroup className='col-12' label='Model type : '>
                    <Checks 
                    type ="radio"
                    checked={isModelTypeChecked} 
                    label = "GPT 3.5"
                    isInline
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsModelTypeChecked(e.target.checked)} 
                    />
                    <Checks 
                    type ="radio"
                    checked={isModelTypeChecked}
                    label = "GPT 4" 
                    isInline
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsModelTypeChecked(e.target.checked)} 
                    />
                    <Checks 
                    type ="radio"
                    checked={isModelTypeChecked}
                    label = "Anthropic" 
                    isInline 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsModelTypeChecked(e.target.checked)} 
                    />
                    
                </FormGroup>
                <FormGroup className='col-12' label='Enable Sources'>
                <Checks 
                    type ="switch"
                    checked={isSwitchChecked} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsSwitchChecked(e.target.checked)} 
                    />
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSubmit}>Submit</Button>
                <Button color="secondary" onClick={() => setIsOpen(false)}>Close</Button>
            </ModalFooter>
        </Modal>
    );
};
