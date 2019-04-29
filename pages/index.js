import React from 'react';
import Head from 'next/head';
import 'isomorphic-unfetch';

import MTAArrivalInfo from './components/MTAArrivalInfo';

class IndexPage extends React.Component {

  // Fetch data for initial page load
  static async getInitialProps({ req }) {
    const baseUrl = req ? `${req.protocol}://${req.get('Host')}` : '';
    const result = await fetch(`${baseUrl}/data/mta`);
    const arrivalInfo = await result.json();

    return { arrivalInfo };
  }

  render() {
    return (
      <div>
        <Head>
          <title>Dashboard</title>
          <script dangerouslySetInnerHTML={{ 
            __html: 'setTimeout(() => { document.location.reload() }, 60000)' 
          }}></script>
        </Head>
        <style jsx global>{`
          body {
            margin: 0;
            padding: 50px;
            font-family: sans-serif;
          }
          h2, h3, h4, h5 {
            margin: 0;
          }
        `}</style>
  
        <h1>Dashboard</h1>
        {/* <div style={{ fontFamily: 'Courier' }}>
          { JSON.stringify(this.props.arrivalInfo) }
        </div> */}

        <MTAArrivalInfo arrivalInfo={this.props.arrivalInfo} />
      </div>
    );
  }
}

export default IndexPage;
