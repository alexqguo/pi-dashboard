import React from 'react';

class MTAArrivalInfo extends React.Component {

  // todo: fetch updated info every minute and set state with updated info
  constructor(props) {
    super(props);

    this.state = {
      arrivalInfo: this.props.arrivalInfo,
      now: new Date(),
    };
  }

  getDiffInMinutes = (first, second) => {
    const msDiff = second - first;
    return Math.round(((msDiff % 86400000) % 3600000) / 60000);
  }

  getNextArrivals = (schedule) => {
    const nextArrivals = schedule.slice(0, 12); // Take the next 12 arrivals

    return nextArrivals.map((arrival, idx) => {
      const imageKey = arrival.routeId.replace('X', 'd'); // For express trains. Not sure why it's a 'd' instead of 'X'
      const minutesToArrival = this.getDiffInMinutes(this.state.now, new Date(arrival.arrivalTime * 1000));
      
      return (
        <>
          <style jsx>{`
            .arrival-line {
              display: flex;
              align-items: center;
            }
          `}</style>
          <div className={'arrival-line'} key={idx}>
            <img src={`http://web.mta.info/siteimages/subwaybullets/36px/${imageKey}.png`} />
            &nbsp; {minutesToArrival} min
          </div>
        </>
      );
    });
  }

  getArrivalColumnsForTrainLine(arrivalInfo) {
    if (arrivalInfo.error) return this.getErrorStateForArrivalInfo(arrivalInfo);

    const northbound = arrivalInfo.schedule[arrivalInfo.id].N;
    const southbound = arrivalInfo.schedule[arrivalInfo.id].S;

    return (
      <section className={'arrival-block'} key={arrivalInfo.id}>
        <style jsx>{`
          .arrival-grid, .arrival-block {
            display: inline-block;
            margin-right: 20px;
          }
        `}</style>

        <h3>{ arrivalInfo.canonicalName }</h3>

        <div className={'arrival-grid'}>
          <h3 style={{ marginTop: 15 }}>Northbound</h3>
          {this.getNextArrivals(northbound)}
        </div>

        <div className={'arrival-grid'}>
          <h3 style={{ marginTop: 15 }}>Southbound</h3>
          {this.getNextArrivals(southbound)}
        </div>
      </section>
    );
  }

  getErrorStateForArrivalInfo = (arrivalInfo) => {
    return (
      <>
        Sorry, the MTA's API has decided not to work right now for <strong>{ arrivalInfo.canonicalName }</strong>.
      </>
    );
  }

  render() {
    const updatedOnDate = this.state.now;
    const updatedOnStr = `${updatedOnDate.toLocaleDateString()} ${updatedOnDate.toLocaleTimeString()}`;

    return (
      <section>
        <div style={{ fontSize: 12, marginBottom: 20 }}>Updated on: {updatedOnStr}</div>

        {this.state.arrivalInfo.map(arrival => this.getArrivalColumnsForTrainLine(arrival))}
      </section>
    );
  }
}

export default MTAArrivalInfo;