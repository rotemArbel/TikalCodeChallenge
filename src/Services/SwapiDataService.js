export default class SwapiDataService {
    constructor() {
        this.baseUrl = 'https://swapi.py4e.com/api/';
    }


    /**
     * Get all vehicles.
     * @returns {Array}
     */
    async getAllVehicles() {
        // Init vehicles aray.
        let allVehicles = [];

        // Get first chunk of vehicles
        let vehicles = await this.getVehicles();
        allVehicles = allVehicles.concat(vehicles.results);

        // While vehicles has next property fetch next page.
        while (vehicles.next) {
            vehicles = await this.get(vehicles.next);
            allVehicles = allVehicles.concat(vehicles.results);
        }

        return allVehicles;
    }

    /** 
     *  Get vehicles.
     * @returns {Promise}
     */
    getVehicles() {
        return new Promise(resolve => {
            return fetch(this.baseUrl + '/vehicles')
                .then((res) => resolve(res.json()))
                .catch((err) => {
                    // Handle Error
                });
        })
    }


/**
 * Get planet by name.
 * @param {string} name 
 * @returns {Promise}
 */
    getPlanetByName(name) {
        return new Promise(resolve => {
            return fetch(this.baseUrl + '/planets/?search=' + name)
                .then((res) => resolve(res.json()))
                .catch((err) => {
                    // Handle Error
                });;
        })
    }

    /**
     * Get data by URL
     * @param {string} url 
     * @returns {Promise}
     */
    get(url) {
        return new Promise(resolve => {
            fetch(url)
                .then((res) => resolve(res.json()))
                .catch((err) => {
                    // Handle Error
                });;
        })

    }

}