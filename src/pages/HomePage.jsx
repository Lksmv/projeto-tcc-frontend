import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { Container, Button } from '@mui/material';
import pageBackground from '../assets/page.png';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Link as RouterLink } from 'react-router-dom';

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  padding: '0px',
  position: 'relative',
};

const imageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '50%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'opacity 0.3s',
};

const transparentButtonStyle = {
  backgroundColor: 'black',
  height: '100%',
  width: '100%',
};

const darkerOverlayStyle = {
  opacity: 0.2,
};

const defaultOpacity = {
  opacity: 0,
};

const CarouselImages = [
  { src: 'https://source.unsplash.com/800x600/?airplane', alt: 'Image 1' },
  { src: 'https://source.unsplash.com/800x600/?food', alt: 'Image 2' },
  { src: 'https://source.unsplash.com/800x600/?cloth', alt: 'Image 3' },
  { src: 'https://source.unsplash.com/800x600/?animal', alt: 'Image 4' },
  { src: 'https://source.unsplash.com/800x600/?woman', alt: 'Image 5' },
  { src: 'https://source.unsplash.com/800x600/?man', alt: 'Image 6' },
  { src: 'https://source.unsplash.com/800x600/?cat', alt: 'Image 7' },
];

const carouselContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '50%',
  position: 'relative',
  paddingTop: '50px',
  padding: '20px 0px 20px 0px'
};

export default function HomePage() {
  const theme = useTheme();
  const [isLeftButtonHovered, setIsLeftButtonHovered] = useState(false);
  const [isRightButtonHovered, setIsRightButtonHovered] = useState(false);

  return (
    <>
      <Helmet>
        <title>Roberta aluguel</title>
      </Helmet>
      <Container style={containerStyle} maxWidth="1080px">
        <img src={pageBackground} style={imageStyle} alt="Background" />
        <div
          style={{
            ...overlayStyle,
            right: '50%',
            ...(isRightButtonHovered ? darkerOverlayStyle : defaultOpacity),
          }}
          onMouseEnter={() => {
            setIsLeftButtonHovered(true);
          }}
          onMouseLeave={() => {
            setIsLeftButtonHovered(false);
          }}
        >
          <Button
            style={transparentButtonStyle}
            to="/catalogo/masculino"
            component={RouterLink}
          >
          </Button>
        </div>
        <div
          style={{
            ...overlayStyle,
            left: '50%',
            ...(isLeftButtonHovered ? darkerOverlayStyle : defaultOpacity),
          }}
          onMouseEnter={() => {
            setIsRightButtonHovered(true);
          }}
          onMouseLeave={() => {
            setIsRightButtonHovered(false);
          }}
        >
          <Button
            style={transparentButtonStyle}
            to="/catalogo/feminino"
            component={RouterLink}
          >
          </Button>
        </div>
      </Container>
      <div style={carouselContainerStyle}>
        <AliceCarousel
          items={CarouselImages.map((image, index) => (
            <img key={index} src={image.src} alt={image.alt} style={{
              width: '480px',
              height: '300px',
              objectFit: 'cover',
            }} />
          ))}
          responsive={{
            0: { items: 1 },
            720: { items: 2 },
            1024: { items: 3 },
            1440: { items: 4 },
          }}
          autoPlay
          autoPlayInterval={2000}
          infinite={true}
          disableDotsControls={true}
          disableButtonsControls={true}
        />
      </div>
    </>
  );
}
