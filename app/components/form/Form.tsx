import './form.css';
import { useState } from 'react';
import Button from '../button/button';
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
      <div className="container">
        <h1 className="heading">Emission Calculator</h1>
        <form onSubmit={handleSubmit}>
          <label className="label">Origin of Travel</label>
          <input type="text" name="origin" className="input" value={formData.origin} onChange={handleChange} />
          
          <label className="label">Travel Destination</label>
          <input type="text" name="destination" className="input" value={formData.destination} onChange={handleChange} />
          
          <label className="label">Mode</label>
          <input type="text" name="mode" className="input" value={formData.mode} onChange={handleChange} />
          
          <label className="label">Days You’re Travelling</label>
          <input type="number" name="days" className="input" value={formData.days} onChange={handleChange} />
          <Button type="solid" color="#0E2D72" height="40px" width="150px">
            Submit
          </Button>
          
        </form>
      </div>
    );
  };
  
  export default EmissionCalculator;
  