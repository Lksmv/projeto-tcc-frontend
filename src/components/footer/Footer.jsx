import { styled } from '@mui/material/styles';
import { Box, Grid, Typography, Link, Divider, IconButton } from '@mui/material';
import Imagem from '../../assets/logo.png';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import HomeIcon from '@mui/icons-material/Home';


const StyledRoot = styled(Box)(({ theme}) => ({
  top: 'auto',
  bottom: 0,
  background: 'linear-gradient(180deg, #000 0%, #000 98%)',
  boxShadow: '5px 0px 10px #000',
  display: 'flex'
}));

const LeftSection = () => (
  <Box display="flex" alignItems="center" justifyContent="center">
    <img src={Imagem} alt="Logo" maxHeight={63} maxWidth={143} />
  </Box>
);

const MiddleSection = () => (
  <Typography variant="h6" color={"#8F1B4D"} sx={{ fontFamily: 'Roboto, sans-serif', textAlign: "justify", textJustify: "auto"}}>
    Roberta aluguel de trajes® | CNPJ: 14.072.275/0001-45

    <Typography variant="body1" color={"#dff5ed"} paddingTop={"5px"} paddingBottom={"5px"} sx={{ fontFamily: 'Roboto, sans-serif', textAlign: "justify", textJustify: "auto" }}>
      R. General Osório N 2065 - Blumenau - 89226-435
    </Typography>

    <Divider sx={{ backgroundColor: '#8F1B4D', mb: 2, mt: 2, width: '20px', height: '2px' }} />

    <Typography variant='body1' color={"#dff5ed"} sx={{ fontFamily: 'Roboto, sans-serif', textAlign: "justify", textJustify: "auto" }} >
      Roberta aluguel de trajes é uma loja de aluguel
      dedicada a tornar os seus momentos especiais verdadeiramente memoráveis.
      Com uma ampla seleção de trajes e acessórios elegantes, estamos comprometidos
      em ajudar você a encontrar o visual perfeito para qualquer ocasião.
      Nossa paixão pela qualidade e estilo reflete em cada item da nossa coleção.
      De casamentos a festas, estamos aqui para vestir os seus sonhos e
      fazer você se destacar em grande estilo.
    </Typography>

  </Typography>
);

const RightSection = () => (
  <Box marginLeft={"20px"} marginRight={"20px"}>
    <Typography variant="subtitle1">
      Redes sociais:
    </Typography>
    <Link href="#">
      <IconButton>
        <FacebookIcon style={{ color: "#4267B2" }} />
      </IconButton>
    </Link>
    <Link href="#">
      <IconButton>
        <InstagramIcon style={{ color: "#C13584" }} />
      </IconButton>
    </Link>
    <Link href="#">
      <IconButton>
        <WhatsAppIcon style={{ color: "#25D366" }} />
      </IconButton>
    </Link>
    <Box
      bgcolor="#8F1B4D" // Cor de fundo vermelho
      py={'10px'} // Espaçamento vertical
      px={'20px'} // Espaçamento horizontal (aumentei para 2 para uma margem mais estreita)
      borderRadius={1} // Borda arredondada
      color="#fff" // Cor do texto
      display="flex" // Usar flex para alinhar os itens horizontalmente
      alignItems="center" // Alinhar verticalmente os itens
      marginTop={"20px"}
    >
      <IconButton>
        <HomeIcon style={{ color: '#fff' }} />
      </IconButton>
      <Typography variant='subtitle2'>
        Loja física em Blumenau
      </Typography>
      <Divider orientation="vertical" sx={{ backgroundColor: '#fff', width: '1px', height: '45px', marginLeft: '20px', marginRight: '20px' }} />
      <Box flexGrow={1} />
      <Typography variant='body1'>
        (47) 3037-7661
        <Typography variant='body2'>
          Segunda a sexta das 9h as 19h
        </Typography>
        <Typography variant='body2'>
          Sábado das 9h as 13h
        </Typography>
      </Typography>
    </Box>
  </Box>
);

export default function Footer() {
  return (
    <StyledRoot>
        <Grid container justifyContent="center" alignItems="center" marginTop={"20px"} marginBottom={"20px"}>
          <Grid item xs={3}>
            <LeftSection />
          </Grid>
          <Grid item xs={5}>
            <MiddleSection />
          </Grid>
          <Grid item xs={4} container justifyContent="center" alignItems="center">
            <RightSection />
          </Grid>
        </Grid>
    </StyledRoot>
  );
}
