import React from 'react';
import '../styles/SkeletonLoader.css';


const SkeletonLoader = () => {
  return (
    <div className="skeleton-loader">
      {/* Map Skeleton - Large rectangle */}
      <div className="skeleton-map"></div>

      {/* Title Skeleton - Bar */}
      <div className="skeleton-title"></div>

      {/* Summary Skeleton - Smaller bar */}
      <div className="skeleton-summary"></div>

      {/* Daily Plan Skeleton - Three card-like boxes */}
      <div className="skeleton-daily-plan">
        {[1, 2, 3].map((index) => (
          <div key={index} className="skeleton-day-card">
            {/* Day header */}
            <div className="skeleton-day-header">
              <div className="skeleton-day-number"></div>
              <div className="skeleton-city-name"></div>
            </div>
            
            {/* Activities */}
            <div className="skeleton-activities">
              <div className="skeleton-activity"></div>
              <div className="skeleton-activity"></div>
              <div className="skeleton-activity short"></div>
            </div>
            
            {/* Action buttons */}
            <div className="skeleton-actions">
              <div className="skeleton-button"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Info Skeleton */}
      <div className="skeleton-safety">
        <div className="skeleton-safety-title"></div>
        <div className="skeleton-safety-content">
          <div className="skeleton-safety-item"></div>
          <div className="skeleton-safety-item"></div>
          <div className="skeleton-safety-item short"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;