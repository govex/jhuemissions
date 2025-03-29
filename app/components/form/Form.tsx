import styles from './form.module.scss';
import { useState } from 'react';
import Button from '~/components/button/button';
const EmissionCalculator = () => {
    const [formData, setFormData] = useState({
      origin: '',
      destination: '',
      mode: '',
      days: ''
    });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log(formData);
    };
  
    return (
      <div className={styles.formcontainer}>
        <form onSubmit={handleSubmit}>
          <label className={styles.label}>Origin of Travel</label>
          <input type="text" name="origin" className={styles.input} value={formData.origin} onChange={handleChange} />
          
          <label className={styles.label}>Travel Destination</label>
          <input type="text" name="destination" className={styles.input} value={formData.destination} onChange={handleChange} />
          
          <label className={styles.label}>Mode</label>
          <input type="text" name="mode" className={styles.input} value={formData.mode} onChange={handleChange} />
          
          <label className={styles.label}>Days You’re Travelling</label>
          <input type="number" name="days" className={styles.input} value={formData.days} onChange={handleChange} />
          <Button 
            type="solid" color="primary" size='medium' text="Submit" />
          
        </form>
      </div>
    );
  };
  
  export default EmissionCalculator;
  