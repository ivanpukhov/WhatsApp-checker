import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resultValidUrl, setResultValidUrl] = useState(null);
  const [resultInvalidUrl, setResultInvalidUrl] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      selectedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await axios.post('http://localhost:5000/process-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Получение ссылок на файлы с валидными и невалидными номерами
      setResultValidUrl(response.data.valid_path);
      setResultInvalidUrl(response.data.invalid_path);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Container>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h5" align="center" gutterBottom>
              Загрузите Excel файлы для обработки
            </Typography>
            <input type="file" multiple onChange={handleFileChange} />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isLoading}
                fullWidth
                style={{ marginTop: '20px' }}
            >
              {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
              ) : (
                  'Обработать'
              )}
            </Button>
          </Grid>
        </Grid>
        {resultValidUrl && (
            <div>
              <Typography variant="h6" gutterBottom>
                Ссылка на файл с валидными номерами:
              </Typography>
              <a href={`http://localhost:5000/download_csv/${resultValidUrl}`} download>
                Скачать файл с валидными номерами
              </a>

            </div>
        )}
        {resultInvalidUrl && (
            <div>
              <Typography variant="h6" gutterBottom>
                Ссылка на файл с невалидными номерами:
              </Typography>
              <a href={`http://localhost:5000/download_csv/${resultInvalidUrl}`} download>
                Скачать файл с невалидными номерами
              </a>

            </div>
        )}
      </Container>
  );
}

export default App;
