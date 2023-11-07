import React from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

function ReportDownloadButton({ url }) {
    const imprimirButtonStyle = {
        fontFamily: 'Roboto, sans-serif',
        borderRadius: '4px',
        boxSizing: 'border-box',
        textTransform: 'none',
        marginTop: '-25px',
        backgroundColor: '#808080',
        color: '#fff',
        width: '200px',
        height: '36px',
        marginRight: '8px',
        transition: 'background-color 0.3s',
        '&:hover': {
            backgroundColor: '#1565C0',
        },
        '&:active': {
            backgroundColor: '#0D47A1',
        },
    };

    const downloadReport = () => {
        axios({
            url: url,
            method: 'GET',
            responseType: 'blob',
        })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'relatorio.docx');
                document.body.appendChild(link);
                link.click();
            })
            .catch((error) => {
                console.error('Erro ao baixar o relatório:', error);
            });
    };

    return (
        <Button variant='contained' style={imprimirButtonStyle} onClick={downloadReport}>
            Baixar Relatório
        </Button>
    );
}

export default ReportDownloadButton;
