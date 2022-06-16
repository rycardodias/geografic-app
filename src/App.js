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

  const [categoryState, setcategoryState] = useState("None")

  const handleFilterState = async (e) => {
    let obj = filterState

    e.map(item => { obj = { ...obj, ...item } })
    setfilterState(obj)
  }

  const handleCategoryState = async (e) => {
    await setcategoryState(e)
  }

  return (
    <div className="App">
      <Container fluid>
        <Row >
          <Col>
            <Filters changeFilterState={handleFilterState} changeCategoryState={handleCategoryState} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Map filterState={filterState} categoryState={categoryState} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
