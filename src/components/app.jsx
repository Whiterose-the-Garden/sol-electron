import React from 'react'
import Calendar from './Calendar.js'
import Command from './Command.js'
import Mousetrap from 'mousetrap'
import Storage from '../assets/scripts/Storage.js'
import { DAYS_IN_WEEK, CAL_HEIGHT, hashDate } from "../assets/scripts/Constants.js"
import '../assets/css/app.css'

const MODES = {
  COMMAND: 0,
  CALENDAR: 1,
}

const INST = {
  ADD: ":add", 
  DEL: ":del",
  GOTO: ":goto",
}

const HOUR_OFFSET = 100

class App extends React.Component {  
  constructor(props) {
    super(props)
    const today = new Date()
    this.commandRef = React.createRef()
    this.storage = new Storage()
    this.state = {
      row: 1,
      today,
      selectedDate: new Date(today),
      command: "",
      gridEvents: this.storage.getEventsForGrid(today, 1),
    }
  }

  componentDidMount() {
    Mousetrap.bind("ctrl+j", this.downDate)
    Mousetrap.bind("ctrl+k", this.upDate)
    Mousetrap.bind(":", this.enterCommand)
  }

  componentWillUnmount() {
    Mousetrap.unbind("ctrl+j")
    Mousetrap.unbind("ctrl+k")
    Mousetrap.unbind(":")
  }

  enterCommand = () => {
    this.setState({
      mode: MODES.COMMAND
    })
    this.commandRef.current.focus()
  }

  onKeyDown = (event) => {
    const { mode, command } = this.state
    if (event.code === 'Escape') {
      this.setState({
        mode: MODES.CALENDAR, 
        command: ''
      })
    } else if (event.code === 'Enter') {
      this.controller(command) 
    }
  }

  controller = (command) => {
    const stack = command.split(" ")
    if (stack.length < 2) return;
    const args = stack.map((s) => s.trim()).slice(1)
    switch(stack[0].toLowerCase()) {
      case INST.ADD: 
        this.add(args)
        break;
      case INST.DEL: 
        this.delete(args)
        break;
      case INST.GOTO:
        this.goto(args)
        break;
    }
  }

  parseDateArg = (arg) => {
    const {today} = this.state 
    const [date, month, year] = arg.split("-", 2)
    let d = new Date(
      year || today.getFullYear(),
      parseInt(month) - 1 || today.getMonth(),
      date || today.getDate()
    )
    return d.getTime() === d.getTime() ? d : null
  }

  parseTimeArg = (arg) => {
    const [hour, min] = arg.split(":")
    const h = parseInt(hour) * HOUR_OFFSET + parseInt(min)  
    return h === NaN ? null : h
  }

  add = (args) => {
    const { selectedDate } = this.state
    const time = this.parseTimeArg(args[0])
    const res = this.storage.addEvent(selectedDate, time, args[1])
    if (res) {
      const { row, selectedDate } = this.state
      const val = this.storage.getEventsForGrid(selectedDate, row)
      this.setState({
        gridEvents: val,
        command: INST.ADD + " ",
      }, this.debug)
    }
  }

  debug = () => {
    console.log(this.state)
  }

  // TODO: delete from the list that will be shown
  // delete = (args) => {
  //   this.storage.delEvent(, args[0])
  // }

  goto = (args) => {
    const d = this.parseDateArg(args[0])
    if (d) {
      this.setState({
        selectedDate: d,
        command: INST.GOTO + " ",
      }) 
    }
  }
 
  downDate = () => {
    const { selectedDate } = this.state
    selectedDate.setDate(selectedDate.getDate() + DAYS_IN_WEEK)
    this.setState({
      selectedDate 
    })
  } 

  upDate = () => {
    const { selectedDate } = this.state
    selectedDate.setDate(selectedDate.getDate() - DAYS_IN_WEEK)
    this.setState({
      selectedDate 
    })
  }

  // vertically navigate
  // vnavDate = curry()

  onChange = (event) => {
    let value = event.target.value
    this.setState({
      command: value[0] !== ":" ? ":" + value : value
    })
  }

  render() {
    const { 
      selectedDate, 
      today,
      row,
      command,
      mode,
      gridEvents,
    } = this.state
    return (
      <div id='app'>
        <Calendar
          selected={selectedDate}
          today={today}
          row={row}
          gridEvents={gridEvents}
        />
        <Command
          command={command}
          active={mode === MODES.COMMAND}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          commandRef={this.commandRef}
        />
      </div>
    )
  }
}

export default App
