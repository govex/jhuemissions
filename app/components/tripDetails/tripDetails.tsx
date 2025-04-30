// TripDetails.tsx
import type { MouseEvent } from 'react';
import { ReactComponent as CloseX } from "~/components/icons/close-x";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
} from '@mui/material';

import styles from './tripdetails.module.scss';
import { ReactComponent as ChevronDown } from '../icons/chevron-down';
interface TripDetailsProps {
    close: (event: MouseEvent<HTMLButtonElement>) => void;
    title: string;
    totalEmissions: number;
}

const TripDetails: React.FC<TripDetailsProps> = ({ close, title, totalEmissions, formData }) => {
    const calculatorResults = () => {
        let originSplit = formData.origin.split(" ");
        let originShort = `${originSplit[2]} (${originSplit[0]})`;
        let destSplit = formData.destination.split(" ");
        let destShort = `${destSplit[2]} (${destSplit[0]})`;
        let emissions = `${totalEmissions.toFixed(2)} kg CO₂e`;
        let equivalent = totalEmissions * 5;
        return <p>
            A flight from <b>{originShort}</b> to <b>{destShort}</b> {formData.roundtrip ? " and back" : ""} would produce <b>{emissions}</b>. That's the equivalent of driving <b>{equivalent.toFixed(1)}</b> miles.
        </p>
    
    }
    return  (
    <div className={styles.modalContainer}>
        <div className={styles.header}>
            <h3 className={styles.filterTitle}>{title}</h3>
            <button className={styles.buttonX} onClick={close}>
                <CloseX />
            </button>
        </div>
        <div className={styles.modalBody}>

            <Accordion sx={{
                borderRadius: "10px",
                boxShadow: "0px 4px 4px 0px #00000040",
                backgroundColor: "#FFFFFFCC",
                color: "#A15B96",
                marginBottom: "20px",
                "&:first-of-type": {borderRadius: "10px"}                
              }}>
                <AccordionDetails>
                    <div className={styles.resultRow}>
                        {calculatorResults()}
                    </div>
                </AccordionDetails>
            </Accordion>
            <Accordion
                sx={{
                    borderRadius: "10px",
                    boxShadow: "0px 4px 4px 0px #00000040",
                    backgroundColor: "#FFFFFFCC",
                    color: "#A15B96",
                    "&:last-of-type": {borderRadius: "10px"}
                }}
            >
                <AccordionSummary
                    expandIcon={<ChevronDown />}
                    aria-controls="sustainability-options-content"
                    id="sustainability-options-header"
                    sx={{ fontWeight: 600, fontSize: '20px', color: '#A15B96' }}
                >
                    <Typography>Traveling for work? Minimize climate impact by:</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '16px' }}>
                        <li>Taking the train</li>
                        <li>Bundling air trips</li>
                        <li>Flying direct</li>
                    </ul>
                </AccordionDetails>
            </Accordion>
        </div>
    </div>
)};

export default TripDetails;
