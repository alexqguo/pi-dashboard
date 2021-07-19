import React from 'react';
import Head from 'next/head';

import MTAArrivalInfo from './components/MTAArrivalInfo';

class IndexPage extends React.Component {

  render() {
    return (
      <div>
        <Head>
          <title>Dashboard</title>
          <link href="https://fonts.googleapis.com/css?family=Roboto:300,700&display=swap" rel="stylesheet"></link>
        </Head>
        <style jsx global>{`
          body {
            margin: 0;
            padding: 50px;
            font-family: 'Roboto', sans-serif;
            color: white;
            background-color: #111;
          }
          h2, h3, h4, h5 {
            margin: 0;
          }
        `}</style>

        <h1>Nearby Train Departure Times</h1>
        <MTAArrivalInfo />
      </div>
    );
  }
}

export default IndexPage;
