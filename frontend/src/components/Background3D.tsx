
import React from 'react';

const Background3D: React.FC = () => {
  return (
    <div className="bg-3d">
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>
      
      {/* Additional gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-cyan-900/10 via-transparent to-purple-900/10"></div>
    </div>
  );
};

export default Background3D;
