import React, { useEffect, useState } from 'react'
import { Dropdown, ListGroup, ListGroupItem, ToggleButton, Form, Button } from 'react-bootstrap';


export const Filters = (props) => {
  const [loading, setloading] = useState(false)
  const [name, setName] = useState("");

  const [drawradios, setdrawradios] = useState([
    { id: 'none', name: 'None', value: true },
    { id: 'addingMarkers', name: 'Marker', value: false },
    { id: 'addingLines', name: 'Line', value: false },
    { id: 'addingPolygon', name: 'Polygon', value: false },
  ]);

  const [showradios, setshowradios] = useState([
    { id: 'showAll', name: 'All', value: true },
    { id: 'showMarkers', name: 'Marker', value: false },
    { id: 'showLines', name: 'Line', value: false },
    { id: 'showPolygon', name: 'Polygon', value: false },
  ]);

  const [categories, setcategories] = useState([
    { id: 'none', name: 'None' },
  ])

  const [selectedCategory, setselectedCategory] = useState("none")

  // get all"none"ories
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('categoryList')) || [];
    list.length > 0 && setcategories(list)
  }, [])

  // add categories when new category is added
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem('categoryList')) || [];
    categories.length > list.length &&
      localStorage.setItem('categoryList', JSON.stringify(categories))
  }, [categories]);

  function handleSelectCategory(e) {
    setselectedCategory(e.target.value)

    props.changeCategoryState(e.target.value)
  }


  async function handleDrawRadioChange(e) {
    await setloading(true)
    let objIndex = drawradios.findIndex((i => i.id === e.target.id));
    let newObj = drawradios

    await newObj.map(e => e.value = false)
    newObj[objIndex].value = Boolean(e.target.value)

    await setdrawradios(newObj)
    await setloading(false)

    let drawArray = [];

    await newObj.filter(i => i.id !== 'none').map(item => {
      drawArray = [...drawArray, { [item['id']]: item.value }]
    })

    await props.changeFilterState(drawArray)
  }

  async function handleShowRadioChange(e) {
    await setloading(true)
    let objIndex = showradios.findIndex((i => i.id === e.target.id));
    let newObj = showradios

    await newObj.map(e => e.value = false)
    newObj[objIndex].value = Boolean(e.target.value)

    await setshowradios(newObj)

    await setloading(false)

    let showArray = [];

    await newObj.map(item => {
      showArray = [...showArray, { [item['id']]: item.value }]
    })

    await props.changeFilterState(showArray)
  }

  useEffect(() => {
    (async function call() {
      let drawArray = [];

      await drawradios.filter(i => i.id !== 'none').map(item => {
        drawArray = [...drawArray, { [item['id']]: item.value }]
      })

      await props.changeFilterState(drawArray)

    })()
  }, [loading])

  async function handleSubmit(e) {
    e.preventDefault()
    console.log(name)

    await setloading(true)
    await setcategories(old => [...old, { id: name, name: name }])
    await setName("")
    await setloading(false)
  }


  return (
    <>
      {!loading && drawradios.map((radio, idx) => (
        <ToggleButton
          key={radio.id}
          id={radio.id}
          type="radio"
          variant={idx % 2 ? 'outline-success' : 'outline-danger'}
          name="draw"
          value={radio.value}
          checked={radio.value}
          onChange={handleDrawRadioChange}
        >
          {radio.name}
        </ToggleButton>
      ))}
      <br></br><br></br>

      {!loading && showradios.map((radio, idx) => (
        <ToggleButton
          key={radio.id}
          id={radio.id}
          type="radio"
          variant={idx % 2 ? 'outline-success' : 'outline-danger'}
          name="show"
          value={radio.value}
          checked={radio.value}
          onChange={handleShowRadioChange}
        >
          {radio.name}
        </ToggleButton>
      ))}

      <select
        value={selectedCategory}
        onChange={e => handleSelectCategory(e)}>
        {!loading && categories.map(o => (
          <option key={o.id} >{o.name}</option>
        ))}
      </select>

      <Form>
        <Form.Group className="mb-3">
          <Form.Control id="category" type="text" placeholder="Enter category" value={name}
            onChange={(e) => setName(e.target.value)} />
        </Form.Group>

        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </>
  )
}
