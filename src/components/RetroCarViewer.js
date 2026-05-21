import React from 'react';

const RetroCarViewer = ({ highlightedPart }) => {
  return (
    <div className="pixel-card h-100">
      <h2>VEHICLE VIEWER</h2>
      
      <div className="car-stage">
        <img 
          src="/assets/97accordPixels.jpg" 
          alt="Pixel 1997 Honda Accord" 
          className="car-img main-accord-model" 
        />
        
        {/* Transparent red pixel highlights */}
        <div 
          className={`problem-highlight ${highlightedPart === 'engine' ? 'active' : ''}`} 
          data-part="engine"
          style={{
            position: 'absolute',
            top: '30%',
            left: '40%',
            width: '20%',
            height: '15%'
          }}
        />
        <div 
          className={`problem-highlight ${highlightedPart === 'front-o2' ? 'active' : ''}`} 
          data-part="front-o2"
          style={{
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: '8%',
            height: '8%'
          }}
        />
        <div 
          className={`problem-highlight ${highlightedPart === 'downstream-o2' ? 'active' : ''}`} 
          data-part="downstream-o2"
          style={{
            position: 'absolute',
            top: '35%',
            left: '65%',
            width: '8%',
            height: '8%'
          }}
        />
        <div 
          className={`problem-highlight ${highlightedPart === 'catalytic-converter' ? 'active' : ''}`} 
          data-part="catalytic-converter"
          style={{
            position: 'absolute',
            top: '40%',
            left: '45%',
            width: '10%',
            height: '10%'
          }}
        />
        <div 
          className={`problem-highlight ${highlightedPart === 'evap' ? 'active' : ''}`} 
          data-part="evap"
          style={{
            position: 'absolute',
            top: '60%',
            left: '30%',
            width: '15%',
            height: '10%'
          }}
        />
        <div 
          className={`problem-highlight ${highlightedPart === 'cooling' ? 'active' : ''}`} 
          data-part="cooling"
          style={{
            position: 'absolute',
            top: '20%',
            left: '35%',
            width: '12%',
            height: '12%'
          }}
        />
        <div 
          className={`problem-highlight ${highlightedPart === 'transmission' ? 'active' : ''}`} 
          data-part="transmission"
          style={{
            position: 'absolute',
            top: '45%',
            left: '35%',
            width: '18%',
            height: '15%'
          }}
        />
        <div 
          className={`problem-highlight ${highlightedPart === 'wheel-speed' ? 'active' : ''}`} 
          data-part="wheel-speed"
          style={{
            position: 'absolute',
            top: '70%',
            left: '20%',
            width: '8%',
            height: '8%'
          }}
        />
      </div>
      
      <div className="legend mt-3">
        <span className="legend-box"></span>
        <span>Transparent red pixels show the likely problem area.</span>
      </div>
    </div>
  );
};

export default RetroCarViewer;
