import type { ChangeEvent, MouseEvent } from 'react';
import { styled, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField, 
  Autocomplete, 
  Checkbox, 
  FormLabel, 
  FormControl, 
  FormGroup, 
  FormControlLabel,
  FormHelperText
 } from '@mui/material';
import { ReactComponent as CloseX } from "~/components/icons/close-x";
import { ReactComponent as ChevronDown } from '../icons/chevron-down';
import styles from './filter.module.scss';

const BpIcon = styled('span')(({ theme }) => ({
  borderRadius: 3,
  width: 25,
  height: 25,
  backgroundColor: '#fff',
  border: "3px solid #AAAAAA",
  '.Mui-focusVisible &': {
    outline: '2px auto #A15A95',
    outlineOffset: 2,
  },
  'input:hover ~ &': {
    backgroundColor: '#A15A9599',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: 'rgba(206,217,224,.5)',
  },
}));

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: '#A15A95',
  'input:hover ~ &': {
    backgroundColor: '#A15A9599',
  },
});

function Filter({close, change, yearOptions, schoolOptions, error, filters}:{
  close: (event:MouseEvent) => void,
  change: (event:ChangeEvent) => void, 
  yearOptions: {label:string, value: string[]}[],
  schoolOptions: {label:string, value:number}[],
  error?: string,
  filters: {years: string[], school: string}
}) {
  return (
        <div className={styles.modalContainer}>
          <div className={styles.header}>
            <h3 className={styles.filterTitle}>Filter Menu</h3>
            <button className={styles.buttonX} onClick={close}><CloseX /></button>
          </div>
          <div className={styles.modalBody}>
            <Accordion
              sx={{
                borderRadius: "10px",
                boxShadow: "0px 4px 4px 0px #00000040",
                backgroundColor: "#FFFFFFCC",
                fontFamily: "Montserrat",
                fontWeight: "600",
                fontSize: "24px",
                color: "#A15B96",
                marginBottom: "20px",
                "&:first-of-type": {borderRadius: "10px"}                
              }}
            >
              <AccordionSummary
                expandIcon={<ChevronDown />}
                id="school-division"
                aria-controls="school-division-input"
              >
                <h3 className={styles.accordionTitle}>School/Division</h3>       
              </AccordionSummary>
              <AccordionDetails>
                <Autocomplete 
                  onChange={change}
                  value={filters.school}
                  options={schoolOptions.map(m => m.label)}
                  renderInput={(params) => <TextField {...params} />}
                  sx={{
                    backgroundColor: "transparent",
                    color: "#A15B96",
                    fontWeight: "600",
                    fontSize: "24px",
                    border: "none"
                  }}
                />                
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{
                borderRadius: "10px",
                boxShadow: "0px 4px 4px 0px #00000040",
                backgroundColor: "#FFFFFFCC",
                fontFamily: "Montserrat",
                fontWeight: "600",
                fontSize: "24px",
                color: "#A15B96",
                "&:last-of-type": {borderRadius: "10px"}
              }}
            >
              <AccordionSummary
                expandIcon={<ChevronDown />}
                id="years"
                aria-controls="years-input"
              >
                <h3 className={styles.accordionTitle}>Fiscal Year</h3>       
              </AccordionSummary>
              <AccordionDetails>
                <FormControl component="fieldset" variant="standard" error={!!error}>
                  <FormLabel component="legend">Pick up to 5</FormLabel>
                  <FormGroup row={true}>
                    {yearOptions?.length > 0 && yearOptions.map((chk) => {
                      return (
                        <FormControlLabel
                        sx={{fontFamily: "Montserrat", color: "#000000"}}
                        control={
                          <Checkbox
                            onChange={change}
                            sx={{ '&:hover': { bgcolor: 'transparent' }}}
                            disableRipple
                            color="default"
                            checkedIcon={<BpCheckedIcon />}
                            icon={<BpIcon />}
                          />
                        }
                        label={chk.label}
                        value={chk.value}
                        checked={filters.years.includes(chk.value)}
                      />  
                      )
                    })}
                  </FormGroup>
                  {!!error &&
                    <FormHelperText>{error}</FormHelperText>
                  }
                </FormControl>
              </AccordionDetails>
            </Accordion>
            </div>
        </div>
      );
}

export default Filter