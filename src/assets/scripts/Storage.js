import Store from "electron-store"
import { DAYS_IN_WEEK, CAL_HEIGHT, hashDate }  from "./Constants.js"

const CAL_DICT = 'calDict'
// delete old events after a certain period
export default function Storage() {

  this.store = new Store()
  this.getEventsForGrid = (date, row) => {
    let d =  new Date(date)
    d.setDate(d.getDate() - (DAYS_IN_WEEK * row + d.getDay()))
    const ret = {}
    for (let i = 0; i < CAL_HEIGHT; i++) {
      for (let j = 0; j < DAYS_IN_WEEK; j++) {
        const hd = hashDate(d)    
        const val = this.store.get(`${CAL_DICT}.${hd}`)
        if (val) ret[hd] = val
        d.setDate(d.getDate() + 1)
      }
    }
    return ret
  }

  this.getWeek = (date) => {
    let d = new Date(date) 
    const hd = hashDate(d)
    const storage = this.store.get(CAL_DICT)
    d.setDate(d.getDate() - d.getDay())
    const ret = {}
    for (let i = 0; i < DAYS_IN_WEEK; i++) {
      const val = this.store.get(`${CAL_DICT}.${hd}`)
      if (val) ret[hd] = val
      d.setDate(d.getDate() + 1)
    }
    return ret
  }

  // Time should be in correct format (prepend 'a')
  this.addEvent = (date, time, event) => {
    const hd = hashDate(date)
    if (!this.store.has(`${CAL_DICT}.${hd}.${time}`)) {
      const storage = this.store.get(CAL_DICT)
      storage[hd][time] = event
      this.store.set(CAL_DICT, storage)
      return true
    } 
    return false
  }

  // delEvent = async (date, time) => {
  //   const hd = hashDate(date)
  //   const value = await forage.getItem({
  //     key: hd.toString()
  //   })
  //   if (value && value[time]) {
  //     delete value[time]
  //     await forage.setItem({
  //       key: hd.toString(),
  //       value: value
  //     })
  //     return true
  //   } 
  //   return false
  // }
}
