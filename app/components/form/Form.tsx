// FlightEmissionsCalculator.js
import styles from './form.module.scss';
import { useState, useRef, useLayoutEffect } from 'react';
import Button from '~/components/button/button';
import { Popover, Autocomplete, TextField } from "@mui/material";
import TripDetails from '../tripDetails/tripDetails';
const travelClasses = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium', label: 'Premium' }
];

const EmissionCalculator = () => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    roundtrip: false,
    flight_class: travelClasses[0].label,
    passengers: 1,
    departure: '',
    return: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef(null);
  const [formRect, setFormRect] = useState<any | undefined>(undefined);
  useLayoutEffect(()=>{ setFormRect(formRef?.current?.getBoundingClientRect()) },[formRef])
  //anchor for popover
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  // store only the total emissions number
  const [totalEmissions, setTotalEmissions] = useState<number>(0);
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setAnchorEl(event.currentTarget);
    const origin = formData.origin;
    const destination = formData.destination;
    const passengers = parseInt(formData.passengers.toString(), 10);
    const isRoundtrip = formData.roundtrip;
    const cabinClass = formData.flight_class;
    const travelClass = travelClasses.find(f => f.label === cabinClass)

    if (!origin || !destination || !passengers) {
      setError('Please fill in all required fields.');
    } else {
      const legs = [
        {
          departure_airport: origin,
          destination_airport: destination,
          cabin_class: travelClass ? travelClass.value : travelClasses[0].value
        }
      ];
  
      if (isRoundtrip) {
        legs.push({
          departure_airport: destination,
          destination_airport: origin,
          cabin_class: travelClass ? travelClass.value : travelClasses[0].value
        });
      }
  
      const payload = {
        type: 'flight',
        passengers,
        legs
      };
  
      try {
        setError(null);
  
        const response = await fetch('https://www.carboninterface.com/api/v1/estimates', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer W3ybZlNo1ESBkPsI1tw',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
  
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
  
        const result = await response.json();
        setTotalEmissions(result.data.attributes.carbon_kg);
        console.log('Emission Result:', result.data.attributes.carbon_kg);
      } catch (err) {
        console.error('Error fetching emissions data:', err);
        setError('Failed to fetch emissions data.');
      } finally {
        setLoading(false);
      }  
    }
  };

  const handleModalClose = () => {
    setLoading(true);
    setAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);
  const tripID = popoverOpen ? 'simple-popover' : undefined;


  return (
    <>
      <div className={styles.formcontainer} ref={formRef}>
        <form className={styles.formBody} onSubmit={handleSubmit}>
          <label className={styles.label}>
            From
            <input
              type="text"
              className={styles.input}
              value={formData.origin}
              onChange={e => handleChange('origin', e.target.value)}
              required
            />
          </label>

          <label className={styles.label}>
            To
            <input
              type="text"
              className={styles.input}
              value={formData.destination}
              onChange={e => handleChange('destination', e.target.value)}
              required
            />
          </label>

          <label className={styles.label}>
            Passengers
            <input
              type="number"
              min={1}
              max={50}
              className={styles.input}
              value={formData.passengers}
              onChange={e => handleChange('passengers', Number(e.target.value))}
              required
            />
          </label>

          <label className={styles.label}>
            Class
            <Autocomplete 
              onChange={(e,v) => handleChange('flight_class', v)}
              value={formData.flight_class}
              options={travelClasses.map(m => m.label)}
              renderInput={(params) => <TextField {...params} />}
              sx={{
                backgroundColor: "transparent",
                color: "#A15B96",
                fontWeight: "600",
                fontSize: "24px",
                border: "none"
              }}
            />                
          </label>

          <label className={styles.label}>
            <input
              type="checkbox"
              checked={formData.roundtrip}
              onChange={e => handleChange('roundtrip', e.target.checked)}
            />{' '}
            Round Trip
          </label>

          <Button
            type="solid"
            color="primary"
            size="medium"
            text={'Submit'}
            onClick={handleSubmit}
            
          />
          {!!formRect && !loading &&
          <Popover
          id={tripID}
          anchorReference='anchorPosition'
          anchorPosition={{top: formRect.top, left: formRect.left - formRect.width}}
          open={popoverOpen}
          anchorEl={anchorEl}
          onClose={handleModalClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{
            '& .MuiPopover-paper': {
              backgroundColor: 'transparent',
              borderRadius: '30px'
            }
          }}
        >
          <TripDetails

            close={() => handleModalClose()}
            title="Trip Details"
            totalEmissions={totalEmissions}
          />
        </Popover>
        }
        </form>
        {error && <div className={styles.error}>{error}</div>}
      </div>

      {/* Popover with TripDetails */}

    </>
  );
};

export default EmissionCalculator;