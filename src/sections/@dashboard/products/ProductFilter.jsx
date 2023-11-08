import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Collapse, Paper, Typography, List, ListItem, ListItemText, ListItemButton, Checkbox, FormControlLabel, Divider, Button } from '@mui/material';

ProductFilter.propTypes = {
  filterOptions: PropTypes.array, // Lista de opções de filtro aninhadas
  onFilterChange: PropTypes.func, // Função chamada ao aplicar filtros
  genero: PropTypes.string, // Parâmetro de gênero
};

export default function ProductFilter({ filterOptions, onFilterChange, genero }) {
  const [openFilter, setOpenFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleFilterToggle = (filter) => {
    const selectedIndex = selectedFilters.indexOf(filter);
    const newSelected = [...selectedFilters];

    if (selectedIndex === -1) {
      newSelected.push(filter);
    } else {
      newSelected.splice(selectedIndex, 1);
    }

    setSelectedFilters(newSelected);
  };

  useEffect(() => {
    if (genero === 'masculino') {
      setSelectedFilters(['Masculino']);
    } else if (genero === 'feminino') {
      setSelectedFilters(['Feminino']);
    }
  }, [genero]);

  const applyFilters = () => {
    onFilterChange(selectedFilters);
  };

  return (
    <Paper elevation={0} sx={{ p: 2, background: 'transparent' }}>
      <Typography variant="h6" sx={{ color: 'white' }}>
        Filtrar Produtos
      </Typography>

      {filterOptions.map((filterOption) => (
        <List key={filterOption.category} disablePadding>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setOpenFilter(!openFilter)}>
              <ListItemText primary={filterOption.category} sx={{ color: 'white' }} />
            </ListItemButton>
          </ListItem>
          <Collapse in={openFilter}>
            <List disablePadding>
              {filterOption.options.map((option) => (
                <ListItem key={option} button>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedFilters.includes(option)}
                        onChange={() => handleFilterToggle(option)}
                      />
                    }
                    label={option}
                    sx={{ color: 'white' }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
      ))}

      <Divider sx={{ my: 2, borderColor: 'white' }} />

      {/* Aplicar Filtros */}
      <Box display="flex" justifyContent="center">
        <Button onClick={applyFilters} style={{ color: 'white', border: '1px solid white' }}>
          Aplicar Filtros
        </Button>
      </Box>
    </Paper>
  );
}
