import React from 'react';

const LoadingSkeleton = () => (
  <div className="skeleton-container">
    <div className="skeleton-line skeleton-line--title" />
    <div className="skeleton-line" />
    <div className="skeleton-line skeleton-line--short" />
    <div className="skeleton-line" />
    <div className="skeleton-line skeleton-line--medium" />
    <div className="skeleton-line" />
    <div className="skeleton-line skeleton-line--short" />
  </div>
);

export default LoadingSkeleton;
