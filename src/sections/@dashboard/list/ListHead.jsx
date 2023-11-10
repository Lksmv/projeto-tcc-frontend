import PropTypes from 'prop-types';
// @mui
import { Box, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';
// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

ListHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  onRequestSort: PropTypes.func,
};

export default function ListHead({
  order,
  orderBy,
  headLabel,
  onRequestSort,
}) {

  return (
    <TableHead>
      <TableRow>
        {headLabel.map((headCell) => (
          <TableCell
            padding="normal"
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
            sx={{ backgroundColor: '#3c3c3c', color: '#dedede' }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
