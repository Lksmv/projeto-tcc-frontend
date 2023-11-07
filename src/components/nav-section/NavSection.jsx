import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
import {
  Box,
  List,
  ListItemText,
  Collapse
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { StyledNavItem, StyledNavItemIcon, StyledSubNavItem } from './styles';

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
      </List>
    </Box>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};


function NavItem({ item }) {
  const { title, path, icon, info, subitems } = item;

  const [open, setOpen] = useState(false);

  const handleSubmenuToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <StyledNavItem
        component={subitems ? 'div' : RouterLink}
        to={subitems ? undefined : path}
        onClick={subitems ? handleSubmenuToggle : undefined}
        sx={{
          color: '#fff',
          '&.active': {
            bgcolor: 'action.selected',
            fontWeight: 'fontWeightBold',
          },
          borderRadius: '0 20px 20px 0', // Borda arredondada à esquerda
          marginBottom: '2px', // Espaçamento inferior entre os itens do menu
        }}
      >
        <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
        <ListItemText primary={title} />
        {subitems && <div>{open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}</div>}
      </StyledNavItem>

      {subitems && (
        <Collapse in={open}>
          <List disablePadding sx={{ pl: 0 }}>
            {subitems.map((subitem) => (
              <SubNavItem key={subitem.title} item={subitem} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}

function SubNavItem({ item }) {
  const { title, path, icon } = item;

  return (
    <StyledSubNavItem
      component={RouterLink}
      to={path}
      sx={{
        color: '#fff',
        '&.active': {
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
        paddingLeft: '20px',
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
      <ListItemText primary={'- ' + title} />
    </StyledSubNavItem>
  );
}
