import styles from "./methodology.module.scss"

function Methodology() {
  return (
    <div className={styles.methodology}>
      <h2>Methodology</h2>
      <p>
        The emissions were computed using the methodology presented in Category 6: Business Travel of the GHG Protocol Technical Guidance for Calculating Scope 3 Emissions document. The distance-based method was used, since distance data is available in the data files used.
      </p>
      <p>
        The formula shown below was used.
        <img src="/methodology_screenshot.png" alt="Calculation formula [6.1] Distance-based method. Co2e emissions from business travel = sum across vehicle types: sum of distance travelled by vehicle type (vehicle-km or passenger-km) times vehicle specific emission factor (kg CO2e per vehicle-km or kg CO2e per passenger-km plus optional sum of annual number of hotal nights (nights) times hotel emission factor (kg CO2e per night." />
      </p>
      <p>
        The emissions factors were sourced from the EPA 2024 GHG Emission Factors Hub. The table of emissions factors is shown below. Note that the units for air travel are in “passenger-mile.” The number of passengers is multiplied by the number of miles traveled. In this case, it was assumed that there was one JHU employee on each flight.
      </p>
      <p>
        Before computing emissions, each flight was classified into short, medium, or long haul based on the flight distance specified. The distances were then multiplied by the appropriate emissions factor. CO2, CH4, and N2O emissions were calculated for each flight segment. The CH4 and N2O emissions were multiplied by global warming potentials (28 and 265 respectively) to give a result in MTCO2e (metric tons CO2 equivalent).
      </p>
    </div>
  )
}

export default Methodology