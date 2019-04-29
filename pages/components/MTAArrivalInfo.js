import React from 'react';

class MTAArrivalInfo extends React.Component {

  // todo: fetch updated info every minute and set state with updated info
  constructor(props) {
    super(props);

    this.state = {
      arrivalInfo: this.props.arrivalInfo,
      now: new Date(this.props.arrivalInfo.updatedOn * 1000),
    };
  }

  getDiffInMinutes = (first, second) => {
    const msDiff = second - first;
    return Math.round(((msDiff % 86400000) % 3600000) / 60000);
  }

  getNextArrivals = (schedule) => {
    const nextArrivals = schedule.slice(0, 5); // Take the next 5 arrivals

    return nextArrivals.map((arrival, idx) => {
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
            <img src={`http://web.mta.info/siteimages/subwaybullets/36px/${arrival.routeId}.png`} />
            &nbsp; {minutesToArrival} min
          </div>
        </>
      );
    });
  }

  render() {
    const updatedOnDate = this.state.now;
    const updatedOnStr = `${updatedOnDate.toLocaleDateString()} ${updatedOnDate.toLocaleTimeString()}`;

    return (
      <section>
        <style jsx>{`
          .arrival-grid {
            display: inline-block;
            margin-right: 20px;
          }
        `}</style>

        <h2>Penn Station arrival times (A/C/E)</h2>
        <div style={{ fontSize: 12 }}>Updated on: {updatedOnStr}</div>

        <div className={'arrival-grid'}>
          <h3 style={{ marginTop: 15 }}>Northbound</h3>
          {this.getNextArrivals(this.state.arrivalInfo.schedule.A28.N)}
        </div>

        <div className={'arrival-grid'}>
          <h3 style={{ marginTop: 15 }}>Southbound</h3>
          {this.getNextArrivals(this.state.arrivalInfo.schedule.A28.S)}
        </div>
      </section>
    );
  }
}

export default MTAArrivalInfo;