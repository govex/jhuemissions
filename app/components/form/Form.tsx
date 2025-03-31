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
        Coming Soon
        <form className={styles.formBody} onSubmit={handleSubmit}>
            <label className={styles.label}>From - Airport Code
            <input type="text" name="origin" className={styles.input} value={formData.origin} onChange={handleChange} disabled={true} />
            </label>          
            <label className={styles.label}>To - Airport Code
            <input type="text" name="destination" className={styles.input} value={formData.destination} onChange={handleChange} disabled={true} />
            </label>          
            <label className={styles.label}>Departure Date
            <input type="text" name="mode" className={styles.input} value={formData.mode} onChange={handleChange} disabled={true} />
            </label>          
            <label className={styles.label}>Arrival Date
            <input type="number" name="days" className={styles.input} value={formData.days} onChange={handleChange} disabled={true} />
            </label>
            <label className={styles.label}>Round Trip <input className={styles.checkbox} type='checkbox' checked disabled /></label>
        </form>
        <Button 
              type="solid" color="primary" size='medium' text="Submit" disabled={true} />
      </div>
    );
  };
  
  export default EmissionCalculator;
  