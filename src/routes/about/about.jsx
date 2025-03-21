import "./about.css"

function About() {
  return (
 
    <div className="about__blocks">
      <p className="heading">Carbon Emissions</p>

      <div className="block1">
        <div className="text-1">

        <p className="p1">Carbon is a molecule formed when a carbon atom combines with two oxygen atoms

          This combination is the result of the chemical reaction that occurs when a carbon fuel, like gasoline, coal or wood, is burned.</p>
        <p className="b1"> When CO2 is created by burning carbon fuels it is a polluting carbon emission.</p>
        </div>
        <img src="general/globe.png" alt="" className="globe" />
        <div className="text-2">


        <p className="b2">What is carbon pollution? </p>
        <p className="p2">It is the emission of CO2 from burning fossil fuels. It is considered pollution because of the negative impact this gas has on the planet. It absorbs heat in the form of infrared radiation, so it works like glass in a greenhouse.</p>
        </div>

      </div>
      <div className="block2">
        <div className="text-3">

        <p className="b3">A carbon footprint is the total amount of greenhouse gases (including carbon dioxide and methane) that are generated by our actions.</p>
        <p className="p3">The average carbon footprint for a person in the United States is 16 tons, one of the highest rates in the world. Globally, the average carbon footprint is closer to 4 tons. </p>
        </div>

      </div>
      <div className="block3">

        <img src="general/feet.png" alt="" className="feet" />
        <img src="general/arrowOne.png" alt="" className="arrow1" />
        <img src="general/arrowTwo.png" alt="" className="arrow2" />
        <img src="general/tempGraph.png" alt="" className="tempGraph" />

      </div>
    </div>

  )
}

export default About