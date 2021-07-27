import { DAYS_IN_WEEK, CAL_HEIGHT, sameDate, hashDate } from "../assets/scripts/Constants.js"
import React from 'react'

const MAX_PREVIEW = 3
const MONTH_NAME = [
  "January",
  "Febuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function Calender(props) {
  const { selected, today, row, gridEvents } = props
  const curr = new Date(selected)
  const offset = DAYS_IN_WEEK * row + selected.getDay()
  curr.setDate(curr.getDate() - offset)
  const dates = []
  let week = []
  let weekKey = ""
  let isLabel = false
  let month = 0
  for (let i = 0; i < CAL_HEIGHT; i++) {
    week.push({})
    for (let j = 0; j < DAYS_IN_WEEK; j++) {
      if (j == 0) 
        weekKey = `${curr.getDate()} ${curr.getMonth()} ${curr.getFullYear()}`
      if (curr.getDate() == 1) {
        isLabel = true
        month = curr.getMonth()
      }
      week.push(
        // use as key the date
        <Day
          key={curr.getDate()}
          date={{
            day: curr.getDay(),
            date: curr.getDate(),
            month: curr.getMonth(),
            year: curr.getFullYear(),
          }}
          today={sameDate(today, curr)}
          selected={sameDate(selected, curr)}
          events={gridEvents[hashDate(curr)]}
        />
      )
      curr.setDate(curr.getDate() + 1)
    }
    // should choose legit key in the future
    week[0] = (
      <MonthLabel key={"0"} isLabel={isLabel} month={month}/>
    )
    isLabel = false
    dates.push(
      <tr key={weekKey}> 
        {week}
      </tr>
    )
    week = []
  }

  return (
    <div>
      <table className="calendar">
        <tbody>
          {dates}
        </tbody>
      </table>
    </div>
  )
}

function MonthLabel(props) {
  let label = !props.isLabel ? null : (
    <h1>{`${MONTH_NAME[props.month].slice(0,3)}`}</h1>
  )
  return (
    <td>
      {label}
    </td>
  )
}

function Day(props) {
  const { date, today, selected, weekend, events } = props
  let color = (date.day === 0 || date.day === 6) ? "weekend" : null
  color = props.selected ? "selected" : color
  const keys = Object.keys(events || {})
    .map((num) => parseInt(num,10))
    .sort((a,b) => a - b)
  let suffix = "", shownEvents = []
  if (keys.length > MAX_PREVIEW) {
    suffix = date.date < 10 ? "  +" : " +"
  }
  return (
    <td className={color}>
      <div>{(today ? "~" : date.date) + suffix}</div>
      {keys.slice(0, MAX_PREVIEW).map((key) => {
        return <div className="preview" key={key}>{events[key]}</div>
      })}
    </td>
  )  
}

export default Calender
