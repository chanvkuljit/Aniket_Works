import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 100,
    },
  },
};

const names = [
  'User',
  'Trainer',
  'Admin',
];

export default function MultipleSelect({ onChange }) {
  const theme = useTheme();
  const [selected, setSelected] = React.useState('ALL');

  const handleChange = (event) => {
    const value = event.target.value;
    setSelected(value);
    if (onChange) onChange(value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 250 }}>
        <InputLabel id="demo-multiple-name-label">Roles</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-single-name"
          value={selected}
          onChange={handleChange}
          input={<OutlinedInput label="Roles" />}
          MenuProps={MenuProps}
          size='small'
        >
          <MenuItem value="ALL">All</MenuItem>
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
