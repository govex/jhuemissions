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

const TripDetails: React.FC<TripDetailsProps> = ({ close, title, totalEmissions }) => (
    <div className={styles.modalContainer}>
        <div className={styles.header}>
            <h3 className={styles.filterTitle}>{title}</h3>
            <button className={styles.buttonX} onClick={close}>
                <CloseX />
            </button>
        </div>
        <div className={styles.modalBody}>

            <Accordion sx={{ backgroundColor: '#FFFFFFCC', boxShadow: 'none', borderRadius: '10px' }}>
                <AccordionDetails>
                    <div className={styles.resultRow}>

                        <span>{totalEmissions.toFixed(2)} kg CO₂e</span>
                    </div>
                </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded sx={{ backgroundColor: '#FFFFFFCC', boxShadow: 'none', borderRadius: '10px' }}>
                <AccordionSummary
                    expandIcon={<ChevronDown />}
                    aria-controls="sustainability-options-content"
                    id="sustainability-options-header"
                    sx={{ fontFamily: 'Montserrat', fontWeight: 600, fontSize: '20px', color: '#A15B96' }}
                >
                    <Typography>If you would like to make your trip more sustainable</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ol style={{ paddingLeft: '20px', margin: 0, fontFamily: 'Montserrat', fontSize: '16px' }}>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ol>
                </AccordionDetails>
            </Accordion>
        </div>
    </div>
);

export default TripDetails;
