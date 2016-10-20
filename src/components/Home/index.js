import React from 'react';


import {GridList, GridTile} from 'material-ui/GridList';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: 1024,
    height: 600,
    overflowY: 'none',
  },
};

const tilesData = [
  {
    img: 'https://raw.githubusercontent.com/gisce/oraKWlum-frontend-pilot/master/screenshots/chart.png',
    title: 'Multiarea chart',
    featured: true,
  },
  {
    img: 'https://raw.githubusercontent.com/gisce/oraKWlum-frontend-pilot/master/screenshots/chart2.png',
    title: 'Multiline chart',
  },
  {
    img: 'https://raw.githubusercontent.com/gisce/oraKWlum-frontend-pilot/master/screenshots/chart3.png',
    title: 'Bars chart',
  },
  {
    img: 'https://raw.githubusercontent.com/gisce/oraKWlum-frontend-pilot/master/screenshots/chart4.png',
    title: 'All types',
    featured: true,
  },
  {
    img: 'https://raw.githubusercontent.com/gisce/oraKWlum-frontend-pilot/master/screenshots/table.png',
    title: 'Text table',
  },
  {
    img: 'https://raw.githubusercontent.com/gisce/oraKWlum-frontend-pilot/master/screenshots/table2.png',
    title: 'Visual table',
  },
  {
    img: 'https://raw.githubusercontent.com/gisce/oraKWlum-frontend-pilot/master/screenshots/table3.png',
    title: 'Combined table',
    featured: true,
  },
]


const OkwScreenshots = () => (
  <div style={styles.root}>
    <GridList
      cols={2}
      cellHeight={200}
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
            <h2>An <i>energy forecasting tool</i> for predicting future consumption!</h2>
            <p><br/></p>
            <p>See some examples of processed proposals:</p>
            <OkwScreenshots/>
        </div>
    </section>;
