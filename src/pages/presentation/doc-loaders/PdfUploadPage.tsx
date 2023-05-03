import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { z, object, array, TypeOf } from 'zod';
import { Box, Typography, Container, Stack, Button, ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import FileUpload  from '../../../components/FileUpload';
import { uploadSinglePDF } from '../../../common/data/uploadAPI';
import {createConversation} from '../../../common/data/conversationUtils'

const pdfUploadSchema = object({
    pdfCover: z.instanceof(File),
  });
  
  type IUploadPdf = TypeOf<typeof pdfUploadSchema>;



export const PdfUploadPage: React.FC = () => {

  const methods = useForm<IUploadPdf>({
    resolver: zodResolver(pdfUploadSchema),
  });

  const onSubmit: SubmitHandler<IUploadPdf> = async (values) => {
    const formData = new FormData();
  
    formData.append('pdfCover', values.pdfCover);
  
  
    try {
      const response = await uploadSinglePDF(formData);
      console.log("PDF",response)
      const pdfId = response.pdf_document_id;
      console.log(pdfId)
      const token = localStorage.getItem("access_token");
      if (token) {
      await createConversation(token, pdfId);
    }
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false}>
        <Box
          display='flex'
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <Box display='flex' flexDirection='column' sx={{ width: '30%' }}>
            {/* Single PDF Upload */}
            <FormProvider {...methods}>
              <form noValidate autoComplete="off" onSubmit={methods.handleSubmit(onSubmit)}>
                <Stack marginBottom={2}>
                  <Typography
                    textAlign='center'
                    variant='h4'
                    component='h1'
                    gutterBottom
                  >
                    Single PDF Upload
                  </Typography>
                  <FileUpload limit={1} name='pdfCover' accept='application/pdf' />
                </Stack>
                <Button
                  variant='contained'
                  type='submit'
                  fullWidth
                  sx={{ py: '0.8rem', my: 2 }}
                >
                  Submit PDFs
                </Button>
              </form>
            </FormProvider>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};


