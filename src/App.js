import { Map } from './components/Map';
import { Filters } from './components/Filters';
import { Row, Col, Container, } from 'react-bootstrap';
import React, { useState, useEffect } from 'react'


function App() {
  const [filterState, setfilterState] = useState({
    showAll: true,
    showMarkers: false,
    addingMarkers: false,
    showLines: false,
    addingLines: false,
    showPolygon: false,
    addingPolygon: false
  }
  )

  const handleFilterState = async (e) => {
    let obj = filterState

    e.map(item => { obj = { ...obj, ...item } })
    setfilterState(obj)
  }

  return (
    <div className="App">
      <Container fluid>
        <Row >
          <Col><Filters changeFilterState={handleFilterState} /></Col>

          <Col sm={10}><Map filterState={filterState} /></Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
