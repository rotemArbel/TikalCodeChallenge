import React from 'react';
import './vehicleCard.css'

const VehicleCard = (props)=> {

    const planets = props.pilots.map(pilot => (
        <tr key={pilot.planetName}>
            <td>{pilot.planetName}</td> 
            <td>{pilot.planetPopulation}</td>
        </tr>
    ));
    const pilots = props.pilots.map(pilot => (
        <tr key={pilot.pilotName}>
            <td>{pilot.pilotName}</td> 
        </tr>
    ))
    return (
        <div className='card-container container'>
            {props.pilots &&
            <React.Fragment>
                <h1>
                    {props.name}
                </h1>
                <h2>Related home planets</h2> 
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Population</th>
                            </tr> 
                        </thead>
                        <tbody>
                            {planets}
                        </tbody>
                
                    </table>
                <div>
                    <h2>Related pilot</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                            </tr> 
                        </thead>
                        <tbody>
                            {pilots}
                        </tbody>
                
                    </table>
            
                </div>
            </React.Fragment>
            }   
        </div>
    )
}

export default VehicleCard;