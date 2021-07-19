import React from 'react';
import ArrivalColumn from './ArrivalColumn';

class TrainLine extends React.Component {

  // keep track of time of initial mount, and each time new data is received.
  // if that time grows a lot, indicate that the data is not fresh

  constructor(props) {
    super(props);

    this.state = {
      updatedOn: new Date()
    };
  }

  renderErrorState() {
    const { arrivalInfo } = this.props;
    return (
      <>
        Sorry, the MTA's API has decided not to work right now for <strong>{ arrivalInfo.canonicalName }</strong>.
      </>
    );
  }

  renderContent() {
    const { arrivalInfo } = this.props;

    return (
      <>
        <ArrivalColumn name="Northbound" schedule={arrivalInfo.schedule[`${arrivalInfo.id}N`]} />
        <ArrivalColumn name="Southbound" schedule={arrivalInfo.schedule[`${arrivalInfo.id}S`]} />
      </>
    );
  }

  render() {
    const { arrivalInfo } = this.props;
    console.log(arrivalInfo)

    return (
      <section className={'arrival-block'} key={arrivalInfo.id}>
        <style jsx>{`
          .arrival-block {
            display: inline-block;
            margin-right: 20px;
            max-width: 300px;
            vertical-align: top;
          }
          .freshness {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #00ee00;
          }
          .freshness.stale {
            background-color: #aa4400;
          }
        `}</style>

        <h3 style={{ marginBottom: 20 }}>
          { arrivalInfo.canonicalName }
          &nbsp;<span className={`freshness ${arrivalInfo.error ? 'stale' : ''}`}></span>
        </h3>

        {arrivalInfo.error ? this.renderErrorState() : this.renderContent()}
      </section>
    );
  }
}

export default TrainLine;