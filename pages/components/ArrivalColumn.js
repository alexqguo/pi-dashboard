import React from 'react';
import ArrivalTime from './ArrivalTime';

export default (props) => {
  const { name, schedule } = props;
  const nextArrivals = schedule.slice(0, 15); // Take the next 15 arrivals

  return (
    <div style={{ display: 'inline-block', marginRight: 20, verticalAlign: 'top' }}>
      <h3>{name}</h3>
      {nextArrivals.map((arrival, idx) => <ArrivalTime arrival={arrival} key={idx} />)}
    </div>
  );
}