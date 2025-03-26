import type { MouseEvent } from 'react';
import Button from "~/components/button/button";
import { styled, 
  TextField, 
  Autocomplete, 
  Checkbox, 
  FormLabel, 
  FormControl, 
  FormGroup, 
  FormControlLabel } from '@mui/material';
import { ReactComponent as CloseX } from "~/components/icons/close-x";
import styles from './filter.module.scss';

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: 3,
  width: 16,
  height: 16,
  boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  backgroundColor: '#f5f8fa',
  backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: '#ebf1f5',
    ...theme.applyStyles('dark', {
      backgroundColor: '#30404d',
    }),
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: 'rgba(206,217,224,.5)',
    ...theme.applyStyles('dark', {
      background: 'rgba(57,75,89,.5)',
    }),
  },
  ...theme.applyStyles('dark', {
    boxShadow: '0 0 0 1px rgb(16 22 26 / 40%)',
    backgroundColor: '#394b59',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))',
  }),
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#137cbd',
  backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
  '&::before': {
    display: 'block',
    width: 16,
    height: 16,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  'input:hover ~ &': {
    backgroundColor: '#106ba3',
  },
});

function Filter({close}:{close: (event:MouseEvent)=>null}) {
  return (
        <div className={styles.modalContainer}>
          <div className={styles.header}>
            <h3 id="modal-modal-title"> Filter Menu </h3>
            <button className={styles.buttonX} onClick={close}><CloseX /></button>
          </div>
            <div className=" content department">
              <Autocomplete 
                options={["School 1", "School 2", "School 3"]}
                renderInput={(params) => <TextField {...params} label="School or Division" />}
                sx={{
                  "backgroundColor": "#FFFFFFCC",
                  "color": "#A15B96",
                  "fontWeight": "600",
                  "fontSize": "24px",
                  "margin": "20px",
                  "borderRadius": "30px",
                  "border": "none"
                }}
              />                
            </div>
            <div className={styles.content}>
            <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Year</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                sx={{ '&:hover': { bgcolor: 'transparent' } }}
                disableRipple
                color="default"
                checkedIcon={<BpCheckedIcon />}
                icon={<BpIcon />}
              />
            }
            label="2024"
          />
        </FormGroup>
      </FormControl>

            </div>
             <Button 
                type="solid"
                text="Apply"
                color="secondary"
                size="medium"
                onClick={close}
             />
        </div>
      );
}

export default Filter