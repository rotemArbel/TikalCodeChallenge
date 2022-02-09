import React from 'react';
import SwapiDataService from './Services/SwapiDataService';
import './App.css';
import VehicleCard from './components/VehicleCard/VehicleCard';
import Chart from './components/Chart/Chart';

class App extends React.Component {

    constructor(props) {
      super(props);
      this.dataService = new SwapiDataService();
      this.planetsForChartNames = ['Tatooine', 'Alderaan', 'Naboo', 'Bespin', 'Endor'];
      this.state = {
        largestPilotPlanetsPopulations: null,
        planetsForChart: null,
        load: false
      };
    }


    /**
     * Get planet for the chart.
     * @returns {Array}
     */
    async getPlanetsForChart() {
      // Init planets array.
      const planets = [];

      // For each planet name get all data.
      this.planetsForChartNames.forEach(async (planetName) => {
        const planet = await this.dataService.getPlanetByName(planetName);

        // Save relevant data to th planets array
        planets.push({
          name: planet.results[0].name,
          population: parseInt(planet.results[0].population)

        })
      })

      return planets;
    }


    /**
     * Get all vehicles that has at least one pilot and their pilots and planet data.
     * @returns {Array}
     */
    async getVehiclesData() {
      const vehiclesWithPilots = await this.getVehiclesWithPilots();
      const vehicles = [];
      vehiclesWithPilots.forEach(async (vehicle) => {
        const pilotsAndVehicleDetails = [];
        const vehiclePilotsPopulation = [];
        vehicle.pilots.forEach(async (pilot) => {
          const pilotDetails = await this.getPilotAndPlanetDetails(pilot)
          pilotsAndVehicleDetails.push(pilotDetails);
          vehiclePilotsPopulation.push(pilotDetails.planetPopulation);

        })
        vehicle.pilots = pilotsAndVehicleDetails;
        vehicle.populations = vehiclePilotsPopulation;
      })


      return vehiclesWithPilots;
    }


    /**
     * Get all vehicles with at least one pilot.
     * @returns {Array}
     */
    async getVehiclesWithPilots() {
      const vehicleWithPilots = [];
      // Get all vehicles
      const vehicles = await this.dataService.getAllVehicles();


      // Loop through al vehicles.
      // Check if vehicle has at least one pilot.
      // Save vehicle name and pilots.
      vehicles.forEach(vehicle => {

        const singleVehicle = {};

        if (vehicle.pilots.length > 0) {

          singleVehicle.name = vehicle.name;
          singleVehicle.pilots = vehicle.pilots;

          vehicleWithPilots.push(singleVehicle);
        };
      });

      return vehicleWithPilots;
    }


    /**
     * Get vehicle pilot and his respective planets details.
     * @returns {Object}
     */
    async getPilotAndPlanetDetails(pilot) {
      // Get pilot data.
      const pilotDetails = await this.dataService.get(pilot);
      // Get pilot`s planet data.
      const planetDetails = await this.dataService.get(pilotDetails.homeworld);

      // Return a pilot object with the relevant data.
      return {
        pilotName: pilotDetails.name,
        planetName: planetDetails.name,
        planetPopulation: planetDetails.population

      }
    }


    /**
     * Shuffle planets.
     * @param {Array} planets 
     */
    shufflePlanets(planets) {
      let i = planets.length - 1;
      for (; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = planets[i];
        planets[i] = planets[j];
        planets[j] = temp;
      }
      return planets;
    }


    async componentWillMount() {

      // Get vehicles and planets data
      let data = await Promise.all([this.getVehiclesData(), this.getPlanetsForChart()])
        .then((data) => {
          // Sort planets by population, add rate property and save to the state. 
          data[1].sort((a, b) => (a.population - b.population)).map((planet, i) => planet.rate = i + 1)
          this.setState({
            planetsForChart: this.shufflePlanets(data[1])
          })

          // Return vehicles data
          return data[0];
        })
        .then((data) => {
          const vehicles = [...data];

          // Loop through vehicles and join pilots planets populations.
          data.forEach((vehicle) => {
            vehicle.populations = vehicle.populations.reduce((a, b) => {
              return parseInt(a) + parseInt(b);
            }, 0)
          })

          // Find the vehicle with the max population of pilots planets
          const maxPopulation = data.reduce((a, b) => {
            return (a.populations > b.populations) ? a : b
          })

          // Save vehicle to the state.
          this.setState({
            largestPilotPlanetsPopulations: maxPopulation,
          })

        })
        .then(() => {

          // Set load to true when all data exist.
          setTimeout(() => {
            this.setState({
              load: true
            })
          }, 500)
        })
    }

    render() {
     
        return (
          <div>
            {(this.state.load) &&
            <div>
              <VehicleCard 
                name={this.state.largestPilotPlanetsPopulations.name}
                pilots = {this.state.largestPilotPlanetsPopulations.pilots}
              />  
              <Chart planets={this.state.planetsForChart}/>
            </div>
           } 
          </div>
        );
      }
    }

    export default App;