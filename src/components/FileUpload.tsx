import {
    Box,
    FormHelperText,
    IconButton,
    Stack,
    Typography,
  } from '@mui/material';
  import { styled } from '@mui/material/styles';
  import React, { useCallback, useEffect, useRef, useState } from 'react';
  import DeleteIcon from '@mui/icons-material/Delete';
  import uploadImg from '../assets/cloud-upload.png';
  import { PDFConfig } from './FileConfig';
  import { Controller, useController, useFormContext } from 'react-hook-form';
  
  // ? FileUpload Props Here
  
  interface IFileUploadProps {
    name: string;
    limit: number;
    accept?: string;
  }
  // ? Custom Styles for the Box Component

  const CustomBox = styled(Box)({
    '&.MuiBox-root': {
      backgroundColor: '#fff',
      borderRadius: '2rem',
      boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
      padding: '1rem',
    },
    '&.MuiBox-root:hover, &.MuiBox-root.dragover': {
      opacity: 0.6,
    },
  });
  
  
  // ? FileUpload Component
  const FileUpload: React.FC<IFileUploadProps> = ({ limit, name }) => {
  // ? Form Context
    const {
      control,
      formState: { isSubmitting, errors },
    } = useFormContext();
  
    // ? State with useState()
    const { field } = useController({ name, control });
    const [singleFile, setSingleFile] = useState<File[]>([]);
    const [fileList, setFileList] = useState<File[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);
  
    // ? Toggle the dragover class
    const onDragEnter = () => wrapperRef.current?.classList.add('dragover');
    const onDragLeave = () => wrapperRef.current?.classList.remove('dragover');

    // PDF Upload Service 

    // ? PDF Upload Service
// ? PDF Upload Service
const onFileDrop = useCallback(
    (e: React.SyntheticEvent<EventTarget>) => {
      const target = e.target as HTMLInputElement;
      if (!target.files) return;
  
      const maxSize = 10 * 1000 * 1000; // 10 MB in bytes
  
      if (limit === 1) {
        const newFile = Object.values(target.files).filter(
          (file: File) => file.type === "application/pdf" && file.size <= maxSize
        );
        if (singleFile.length >= 1) return alert('Only a single PDF allowed');
        if (target.files[0].size > maxSize) return alert('PDF must not be larger than 10 MB');
        setSingleFile(newFile);
        field.onChange(newFile[0]);
      }
  

    },
    [field, fileList, limit, singleFile]
  );
  
  // ? Remove multiple PDFs
  const fileRemove = (file: File) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
  };
  
  // ? Remove single PDF
  const fileSingleRemove = () => {
    setSingleFile([]);
  };
  
  // ? Calculate Size in KiloByte and MegaByte
  const calcSize = (size: number) => {
    return size < 1000000
      ? `${Math.floor(size / 1000)} KB`
      : `${Math.floor(size / 1000000)} MB`;
  };
  
      // ? Reset the State
  useEffect(() => {
    if (isSubmitting) {
      setFileList([]);
      setSingleFile([]);
    }
  }, [isSubmitting]);

  
      // ? Actual JSX
      return (
        <>
          <CustomBox>
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              sx={{
                position: 'relative',
                width: '100%',
                height: '13rem',
                border: '2px dashed #4267b2',
                borderRadius: '20px',
              }}
              ref={wrapperRef}
              onDragEnter={onDragEnter}




              onDragLeave={onDragLeave}
              onDrop={onDragLeave}
            >
              <Stack justifyContent='center' sx={{ p: 1, textAlign: 'center' }}>
                <Typography sx={{ color: '#ccc' }}>
                  {limit > 1 ? 'Browse files to upload' : 'Browse file to upload'}
                </Typography>
                <div>
                  <img
                    src={uploadImg}
                    alt='file upload'
                    style={{ width: '5rem' }}
                  />
                </div>
                <Typography variant='body1' component='span'>
                  <strong>Supported File</strong>
                </Typography>
                <Typography variant='body2' component='span'>
                  PDF
                </Typography>
              </Stack>
              <Controller
                name={name}
                defaultValue=''
                control={control}
                render={({ field: { name, onBlur, ref } }) => (
                  <input
                    type='file'
                    name={name}
                    onBlur={onBlur}
                    ref={ref}
                    onChange={onFileDrop}
                    accept='application/pdf'
                    style={{
                      opacity: 0,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      cursor: 'pointer',
                    }}
                  />
                )}
              />
            </Box>
          </CustomBox>
      
          <FormHelperText
            sx={{ textAlign: 'center', my: 1 }}
            error={!!errors[name]}
          >
            {errors[name]?.message as string || ''}


          </FormHelperText>
      
          {/* ?PDF Preview ? */}
        {/* ?PDF Preview ? */}
{singleFile.length > 0 ? (
  <Stack spacing={2} sx={{ my: 2 }}>
    {singleFile.map((item, index) => {
      return (
        <Box
          key={index}
          sx={{
            position: 'relative',
            backgroundColor: '#f5f8ff',
            borderRadius: 1.5,
            p: 0.5,
          }}
        >
          <Box display='flex'>
            <Typography>{item.name}</Typography>
            <Typography variant='body2'>{calcSize(item.size)}</Typography>
          </Box>
          <IconButton
            onClick={() => {
              fileSingleRemove();
            }}
            sx={{
              color: '#df2c0e',
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      );
    })}
  </Stack>
) : null}
</>

      );

            };
  
  export default FileUpload;