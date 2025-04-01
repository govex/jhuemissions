import styles from "./about.module.scss";

function About() {
  return (
    <>
    <h1 className={styles.internal}>About</h1>
    <div className={styles.about}>
      <div className={styles.odd}>
        <div className={styles.about_block}>
          <div className={styles.imgOdd}>
            <img src="./general/co2_circle.png" alt="an illustration of a cloud labelled CO2 with arrows pointing down from the bottom."/>
          </div>
          <div className={styles.question}>
            <h2>
              What are carbon emissions and how are they created?   
            </h2>
            <p>
              Carbon emissions occur when carbon dioxide and other greenhouse gases are discharged into the air through burning fossil fuels like oil, for instance, from an airplane engine.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.even}>
        <div className={styles.about_block}>
          <div className={styles.imgEven}>
            <img src="./general/scale_circle.png" alt="an illustration of a scale with a dial guage pointing between past the halfway mark."/>        
          </div>
          <div className={styles.question}>
            <h2>
              How do we measure them? (carbon footprint, metric tonne)
            </h2>
            <p>
              Carbon emissions are typically measured in mass, for instance, by metric tons (tonnes). 1 tonne of CO2 weighs as much as a small car. When speaking of greenhouse gas emissions, 1 tonne is equivalent to the amount of warming created by driving a gas-powered car for 5,000 miles.
            </p>
          </div>
        </div>
      </div>
      <div className={styles.odd}>
        <div className={styles.about_block}>
          <div className={styles.imgOdd}>
            <img src="./general/car_circle.png" alt="an illustration of a small car."/>
          </div>
          <div className={styles.question}>
            <h2>
              Air Travel to other travel modes
            </h2>
            <p>
              Transportation accounts for 28% of U.S. greenhouse gas emissions, making it the largest single source of carbon pollution and one that's rapidly growing. Passenger cars make up over half of these emissions. Deciding how to travel most efficiently often depends on how far a traveler is going. For short trips, flying will generally be much more carbon intensive. Carbon pollution emitted to travel one km is much greater for domestic flights when compared to gas-powered cars (246g versus 170g). A bus trip or rail journey of the same distance emits just 97g and 35g respectively. As such, taking transit is by far the lowest carbon way to travel, where possible... that is, if you can't walk or bike (<a href="https://ourworldindata.org/grapher/carbon-footprint-travel-mode">source</a>)
            </p>
          </div>
        </div>
      </div>
      <div className={styles.even}>
      <div className={styles.about_block}>
          <div className={styles.imgEven}>
        <img src="./general/plane_circle.png" alt="an illustration of passenger jet." />        
        </div>
        <div className={styles.question}>
        <h2>
          Air Travel to other travel-related activities
        </h2>
        <p>
          Emissions from air travel will typically represent over 90% of all emissions produced in a work trip, with hotel accommodations representing about 7% and ground travel, such as taxis, under 1% (<a href="https://sustainable.stanford.edu/sites/g/files/sbiybj26701/files/media/file/scope-3-emissions-from-business-travel_public-march-2023.pdf">source</a>).
        </p>
        </div>
        </div>
      </div>
      <div className={styles.odd}>
      <div className={styles.about_block}>
          <div className={styles.imgOdd}>
        <img src="./general/map_circle.png" alt="an illustration of curved dashed line connecting two map markers."/>
        </div>
        <div className={styles.question}>
        <h2>
          What affects air travel emissions?
        </h2>
        <p>
          Air itineraries can have enormous variations in emissions. The most important factors are the number of stops, aircraft class, and carrier choice. <a href="https://theicct.org/sites/default/files/publications/variation-aviation-emissions-itinerary-jul2021-1.pdf">Read more here.</a>
        </p>
        </div>
        </div>
      </div>
      <div className={styles.even}>
      <div className={styles.about_block}>
          <div className={styles.imgEven}>
        <img src="./general/baltimore_circle.png" alt="an illustration of crab."/>        
        </div>
        <div className={styles.question}>
        <h2>
          How do emissions from business travel compare with greenhouse gas emissions for typical Baltimore residents?
        </h2>
        <p>
          The per capita CO<sub>2</sub> emissions of a typical Baltimore City resident are approximately 7.2 metric tons CO<sub>2</sub> per person per year: about 3.0 tons for on-road transportation, 2.5 tons for residential energy, and 1.75 tons for waste management. These per capita values do not include air travel emissions. JHU business air travel emissions in 2023 were 10,300 metric tons among 17,000 employees: approximately 0.6 tons per JHU employee. If we add JHU business air travel emissions to the citywide average per capita values, the CO<sub>2</sub> per capita emissions of traveling JHU employees increases by ~8% overall and by ~20% in the transportation sector, relative to the average Baltimore resident.
        </p>
        </div>
        </div>
      </div>
      <p className={styles.footnote}>
        Infographic reviewed by <a href="https://publichealth.jhu.edu/faculty/3991/shima-hamidi">Shima Hamidi</a>, <a href="https://engineering.jhu.edu/faculty/scot-miller/">Scot Miller</a>, and <a href="https://www.dylangaeta.com/">Dylan Gaeta</a>.
      </p>
    </div>
    </>
  )
}

export default About