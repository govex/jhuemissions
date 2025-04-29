// FlightEmissionsCalculator.js
import styles from './form.module.scss';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import Button from '~/components/button/button';
import { Popover, Autocomplete, TextField } from "@mui/material";
import TripDetails from '../tripDetails/tripDetails';
const travelClasses = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium', label: 'Premium' }
];

const EmissionCalculator = (airports) => {
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
  const [fromOptions, setFromOptions] = useState<string[] | undefined>(undefined);
  const [toOptions, setToOptions] = useState<string[] | undefined>(undefined);
  useEffect(()=>{
    if (airports.airports.length > 0) {
      setFromOptions(airports.airports.map(m => `${m.iata} - ${m.airport_name === "N/A" ? `${m.location} ${m.country}` : `${m.airport_name} ${m.location} ${m.country}`}`))
    }
  },[])
  useEffect(()=>{
    if (!!fromOptions && fromOptions.length > 0) {
      setToOptions(fromOptions.filter(f => f !== formData.origin))
    }
  },[fromOptions, formData.origin])
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setAnchorEl(event.currentTarget);
    const origin = formData.origin?.substring(0,3);
    const destination = formData.destination?.substring(0,3);
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
        const key = import.meta.env.VITE_CARBON_INTERFACE;
        const response = await fetch('https://www.carboninterface.com/api/v1/estimates', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
  
        if (!response.ok) {
          setError('Failed to fetch emissions data.');
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
            {!!fromOptions &&
              <Autocomplete 
                onChange={(e,v) => handleChange('origin', v)}
                value={formData.origin}
                options={fromOptions}
                renderInput={(params) => <TextField {...params} />}
                sx={{
                  backgroundColor: "transparent",
                  color: "#A15B96",
                  fontWeight: "600",
                  fontSize: "24px",
                  border: "none"
                }}
              />                
            }
          </label>

          <label className={styles.label}>
            To
            {!!toOptions &&
              <Autocomplete 
                onChange={(e,v) => handleChange('destination', v)}
                value={formData.destination}
                options={toOptions}
                renderInput={(params) => <TextField {...params} />}
                sx={{
                  backgroundColor: "transparent",
                  color: "#A15B96",
                  fontWeight: "600",
                  fontSize: "24px",
                  border: "none"
                }}
              />                
            }
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
          anchorPosition={{top: formRect.top - window.scrollY, left: formRect.left - 400}}
          open={popoverOpen}
          anchorEl={anchorEl}
          onClose={handleModalClose}
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
            formData={formData}
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