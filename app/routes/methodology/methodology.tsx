import styles from "./methodology.module.scss"
import Card from "~/components/card/card";

function Methodology() {
  return (
    <>
    <h1 className={styles.internal}>Methodology</h1>
    <div className={styles.methodology}>
      <p>
        The emissions were computed using the methodology presented in Category 6: Business Travel of the <a href="https://ghgprotocol.org/sites/default/files/standards/Scope3_Calculation_Guidance_0.pdf">GHG Protocol Technical Guidance for Calculating Scope 3 Emissions</a> document. The distance-based method was used, since distance data is available in the data files used.
      </p>
      <Card 
        title="Calculation formula - Distance-based method"
      >
      <p>
        CO<sub>2</sub>e emissions from business travel = 
        <br />sum across vehicle types: 
        <br/> &#931; distance travelled by vehicle type (vehicle-km or passenger-km) <i>x</i> 
        <br/> vehicle specific emission factor (kg CO<sub>2</sub>e per vehicle-km or kg CO<sub>2</sub>e per passenger-km) <i>+</i> 
        <br/> <i>optional</i> &#931; annual number of hotal nights (nights) times hotel emission factor (kg CO<sub>2</sub>e per night).      
      </p>
      </Card>
      <br/><br/>
      <p>
        The emissions factors were sourced from the EPA 2024 GHG Emission Factors Hub. Note that the units for air travel are in “passenger-mile.” The number of passengers is multiplied by the number of miles traveled. In this case, it was assumed that there was one JHU employee on each flight.
      </p>
      <p>
        Before computing emissions, each flight was classified into short, medium, or long haul based on the flight distance specified. The distances were then multiplied by the appropriate emissions factor. CO<sub>2</sub>, CH<sub>4</sub>, and N<sub>2</sub>O emissions were calculated for each flight segment. The CH4 and N2O emissions were multiplied by global warming potentials (28 and 265 respectively) to give a result in MTCO<sub>2</sub>e (metric tons CO<sub>2</sub> equivalent).
      </p>
    </div>
    </>
  )
}

export default Methodology