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
  { src: 'https://scontent.fbnu4-1.fna.fbcdn.net/v/t39.30808-6/312235895_471000658340678_2103038842941320460_n.jpg?stp=dst-jpg_p526x296&_nc_cat=111&ccb=1-7&_nc_sid=3635dc&_nc_eui2=AeHBr3VvXp2I49iBMxpf26Nabe0xHhmXslFt7TEeGZeyUUY3Jn3fAhJFHdFiMRqIQ--7osqrgQN8klg17U_7uVOh&_nc_ohc=psz5KpnD0iwAX-DZids&_nc_zt=23&_nc_ht=scontent.fbnu4-1.fna&oh=00_AfCJJIAm_5pGQ8gL5FtjWrCblGpu8cAipi5uBkC9YOeZpA&oe=657723B9', alt: 'Image 1' },
  { src: 'https://scontent.fbnu4-1.fna.fbcdn.net/v/t39.30808-6/345907568_206585035503161_5992002424150008557_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=3635dc&_nc_eui2=AeERW0pS-Pky7Lt39CFHR7EfXysP11i0J5lfKw_XWLQnmXf2G6hNCVS53L-tfCSjQAWo5o_eQ2o6_OTrTZq6_krh&_nc_ohc=SDNyjuspUNwAX-oyEhM&_nc_zt=23&_nc_ht=scontent.fbnu4-1.fna&oh=00_AfDGiee1ttx1DhmwO1-rpUEZaPF90oi-cUA0ZuIc5cjH5Q&oe=65775241', alt: 'Image 2' },
  { src: 'https://scontent.fbnu4-1.fna.fbcdn.net/v/t39.30808-6/308757307_458429156264495_7182657427104312418_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=3635dc&_nc_eui2=AeGY3rHdXj_gC3NePTx8L_uYsER-UKxpryiwRH5QrGmvKHCZkSKXr-j2dPhVbWHkYOCfDGQ_FTZbBt5s9TK1CZOx&_nc_ohc=uNR8byg3-6EAX96N0Us&_nc_zt=23&_nc_ht=scontent.fbnu4-1.fna&oh=00_AfAvqg7ezB0k1GYd178FuqvaDOd02FiPFDjiDWtyIZThGQ&oe=657810E8', alt: 'Image 3' },
  { src: 'https://scontent.fbnu4-1.fna.fbcdn.net/v/t1.6435-9/99431263_3000478643406208_8607260760655003648_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=7f8c78&_nc_eui2=AeHKN82IXtM8Q883UYUDPw4DELPyN6DHYpsQs_I3oMdim2lCR0ZxTUbSxaYvcyWUeOPS6bLPczFdkZnDqGhCW2sU&_nc_ohc=gJu_KYEEfwYAX8rFBbN&_nc_ht=scontent.fbnu4-1.fna&oh=00_AfB6AOT4M-QUC0iGu8U7WzxHXaBcWVuUu88zkme80s3TNg&oe=6599B3CD', alt: 'Image 4' },
  { src: 'https://scontent.fbnu4-1.fna.fbcdn.net/v/t1.6435-9/96094916_2981504181970321_1356953157204180992_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=7f8c78&_nc_eui2=AeH5D8HEX_4eM_7riU0U4yG39b2lNPfYwNX1vaU099jA1YF-3e2P3JgRLX_sbnIl4-Q_qxpTQM1xRDZZA70Jvvxf&_nc_ohc=iIp9TIKI8hsAX9sATHF&_nc_ht=scontent.fbnu4-1.fna&oh=00_AfBKaPuIHtF1ZowofjuJcBSKeEbj0wV6xl__JOGQhtWJIw&oe=6599B9DA', alt: 'Image 5' },
  { src: 'https://scontent.fbnu4-1.fna.fbcdn.net/v/t1.6435-9/94133325_2936462769807796_2572608689303191552_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=7f8c78&_nc_eui2=AeGmW7Tbgy13Sk2nKoOBqP0U6fw0AQMWbPLp_DQBAxZs8lZVRPWWSUBirC_EwXQ6u1Egv70bo6mXL13OB33aiwan&_nc_ohc=2BwOoYyXM3kAX9hUjxK&_nc_ht=scontent.fbnu4-1.fna&oh=00_AfC2vzonW0pz4eXY1AZS1oCnBOU6r1jxGPjqrm3C-ZcTfQ&oe=6599ABA0', alt: 'Image 6' },
  { src: 'https://scontent.fbnu4-1.fna.fbcdn.net/v/t1.6435-9/93819970_2913198222134251_2751119173781291008_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=c2f564&_nc_eui2=AeGJFeAvAkKSJPKFRnYt8bovEvcsohJsQxUS9yyiEmxDFbtN8bSmvR-BUoNZh6sbSVtkfIPLwF9A6hzGHCN2Zs_7&_nc_ohc=HDaz8PrwY8YAX8wbIKy&_nc_ht=scontent.fbnu4-1.fna&oh=00_AfDUD6wf7n_uFU4AOKrsvd3A7I4qEiZdAfyxVn55Sofofg&oe=65999C4B', alt: 'Image 7' },
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
