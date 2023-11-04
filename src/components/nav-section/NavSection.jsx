import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
import {
  Box,
  List,
  ListItemText,
  Collapse
} from '@mui/material';
import { StyledNavItem, StyledNavItemIcon } from './styles';

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  return (
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {data.map((item, index) => (
          <NavItem key={index} value={item.path} item={item} />
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
        }}
      >
        <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>
        <ListItemText primary={title} />
        {subitems && <div>{open ? '˄' : '˅'}</div>}
      </StyledNavItem>

      {subitems && (
        <Collapse in={open}>
          <List disablePadding sx={{ pl: 4 }}>
            {subitems.map((subitem) => (
              <NavItem key={subitem.title} item={subitem} />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
}
