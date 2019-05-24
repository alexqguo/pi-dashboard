import React from 'react';

function getDiffInMinutes(first, second) {
  const msDiff = second - first;
  return Math.round(((msDiff % 86400000) % 3600000) / 60000);
}

export default (props) => {
  const { arrival } = props;
  // For express trains. Not sure why it's a 'd' instead of 'X'
  const imageKey = arrival.routeId.replace('X', 'd');
  const minutesToArrival = getDiffInMinutes(new Date(), new Date(arrival.arrivalTime * 1000));

  return (
    <>
      <style jsx>{`
        .arrival-line {
          display: flex;
          align-items: center;
        }
      `}</style>
      <div className={'arrival-line'}>
        <img src={`http://web.mta.info/siteimages/subwaybullets/36px/${imageKey}.png`} />
        &nbsp; {minutesToArrival} min
      </div>
    </>
  );
};