import React from 'react';
import './chart.css'
const Chart = (props)=> {
    const chartItems = props.planets.map(planet => (
                <div key={planet.name} className="chart-item">
                    <small>{planet.name}</small>
                    <div style={{height:(planet.rate*50)}} className="pole"/>
                    <small >{planet.population}</small>
                </div>
    ))
    return (
        <div className="chart-container container">
            {chartItems}
        </div>
    )
}
   
export default Chart;