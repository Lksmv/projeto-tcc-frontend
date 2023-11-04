import React from 'react';
import PropTypes from 'prop-types';
import { List } from '@mui/material';

SubMenu.propTypes = {
  items: PropTypes.array,
};

export default function SubMenu({ items }) {
  return (
    <List disablePadding sx={{ p: 1 }}>
      {items.map((subItem) => (
        <NavItem key={subItem.path} item={subItem} />
      ))}
    </List>
  );
}

