import React from 'react';


import {GridList, GridTile} from 'material-ui/GridList';

import {FormattedHTMLMessage} from 'react-intl';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 1024,
    height: 1024,
    overflowY: 'none',
  },
};

const tilesData = [
  {
    img: 'https://raw.githubusercontent.com/gisce/oraKWlum-frontend-pilot/master/screenshots/chart.png',
    title: <FormattedHTMLMessage id="Index.multiareachart" defaultMessage="Multiarea chart"/>,
    featured: true,
  },
  {
    img: 'https://raw.githubusercontent.com/gisce/oraKWlum-frontend-pilot/master/screenshots/chart2.png',
    title: <FormattedHTMLMessage id="Index.multiline" defaultMessage="Multiline chart"/>,
  },
  {
    img: 'https://raw.githubusercontent.com/gisce/oraKWlum-frontend-pilot/master/screenshots/chart3.png',
    title: <FormattedHTMLMessage id="Index.barschart" defaultMessage="Bars chart"/>,
  },
  {
    img: 'https://raw.githubusercontent.com/gisce/oraKWlum-frontend-pilot/master/screenshots/chart4.png',
    title: <FormattedHTMLMessage id="Index.alltypes" defaultMessage="All Types"/>,
//    featured: true,
  },
  {
    img: 'https://raw.githubusercontent.com/gisce/oraKWlum-frontend-pilot/master/screenshots/table.png',
    title: <FormattedHTMLMessage id="Index.texttable" defaultMessage="Text table"/>,
  },
  {
    img: 'https://raw.githubusercontent.com/gisce/oraKWlum-frontend-pilot/master/screenshots/table2.png',
    title: <FormattedHTMLMessage id="Index.visualtable" defaultMessage="Visual table"/>,
  },
  {
    img: 'https://raw.githubusercontent.com/gisce/oraKWlum-frontend-pilot/master/screenshots/table3.png',
    title: <FormattedHTMLMessage id="Index.combinedtable" defaultMessage="Combined table"/>,
//    featured: true,
  },
]


const OkwScreenshots = () => (
  <div style={styles.root}>
    <GridList
      cols={2}
      cellWidth={256}
      padding={1}
      style={styles.gridList}
    >
      {tilesData.map((tile) => (
        <GridTile
          key={tile.img}
          title={tile.title}
          actionPosition="left"
          titlePosition="top"
          titleBackground="linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0) 100%)"
          cols={tile.featured ? 2 : 1}
          rows={tile.featured ? 2 : 1}
        >
          <img src={tile.img} />
        </GridTile>
      ))}
    </GridList>
  </div>
);




export const Home = () =>
    <section>
        <div className="container text-center">
            <h2>
                <FormattedHTMLMessage id="Index.slogan" defaultMessage="An <b>energy forecasting tool</b> for predicting future consumption!"/>
            </h2>
            <p><br/></p>
            <p>
                <FormattedHTMLMessage id="Index.examples" defaultMessage="See some examples of processed proposals:"/></p>
            <OkwScreenshots/>
        </div>
    </section>;
