// FlightEmissionsCalculator.js
import styles from './form.module.scss';
import { useState } from 'react';
import Button from '~/components/button/button';
import axios from 'axios';
import Select from 'react-select';

const travelClasses = [
  { value: 'economy', label: 'Economy' },
  { value: 'premiumeconomy', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First' }
];

const EmissionCalculator = () => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    roundtrip: false,
    flight_class: travelClasses[0],
    passengers: 1,
    departure: '',
    return: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const origin = formData.origin;
    const destination = formData.destination;
    const passengers = parseInt(formData.passengers.toString(), 10);
    const isRoundtrip = formData.roundtrip;
  
    if (!origin || !destination || !passengers) {
      setError('Please fill in all required fields.');
      return;
    }
  
    const legs = [
      {
        departure_airport: origin,
        destination_airport: destination
      }
    ];
  
    if (isRoundtrip) {
      legs.push({
        departure_airport: destination,
        destination_airport: origin
      });
    }
  
    const payload = {
      type: 'flight',
      passengers,
      legs
    };
  
    try {
      setLoading(true);
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
      console.log('Emission Result:', result);
    } catch (err) {
      console.error('Error fetching emissions data:', err);
      setError('Failed to fetch emissions data.');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className={styles.formcontainer}>
      <form className={styles.formBody} onSubmit={handleSubmit}>
        <label className={styles.label}>From (Airport Code)
          <input type="text" className={styles.input} value={formData.origin} onChange={e => handleChange('origin', e.target.value)} required />
        </label>
        <label className={styles.label}>To (Airport Code)
          <input type="text" className={styles.input} value={formData.destination} onChange={e => handleChange('destination', e.target.value)} required />
        </label>
        <label className={styles.label}>Passengers
          <input type="number" min="1" max="50" className={styles.input} value={formData.passengers} onChange={e => handleChange('passengers', e.target.value)} required />
        </label>
        <label className={styles.label}>Departure Date
          <input type="date" className={styles.input} value={formData.departure} onChange={e => handleChange('departure', e.target.value)} />
        </label>
        {formData.roundtrip && (
          <label className={styles.label}>Return Date
            <input type="date" className={styles.input} value={formData.return} onChange={e => handleChange('return', e.target.value)} />
          </label>
        )}
        <label className={styles.label}>Class
          <Select options={travelClasses} value={formData.flight_class} onChange={v => handleChange('flight_class', v)} />
        </label>
        <label className={styles.label}>
          <input type="checkbox" checked={formData.roundtrip} onChange={e => handleChange('roundtrip', e.target.checked)} /> Round Trip
        </label>
        <Button type="solid" color="primary" size='medium' text={loading ? 'Loading...' : 'Submit'} disabled={loading} />
      </form>

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
};

export default EmissionCalculator;