function dateFormatter (date, row) {
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let min = date.getMinutes()
  
    month = (month < 10 ? '0' : '') + month
    day = (day < 10 ? '0' : '') + day
    hour = (hour < 10 ? '0' : '') + hour
    min = (min < 10 ? '0' : '') + min
    return day + '.' + month + '.' + date.getFullYear() + ' - ' + hour + ':' + min
  }
  
  const cellFormater = (cell, row, rowIndex, colIndex, width) => {
    let css = {
      padding: 0,
      paddingLeft: '15px',
      verticalAlign: 'middle'
    }
    return css
  }
  function getDefaultFilter (searchParameters,filterName) {
    const filter = searchParameters.filters
    if (filter && filter[filterName] && filter[filterName].filterVal) {
      return { defaultValue: filter[filterName].filterVal }
    } else return {}
  }


export {dateFormatter as dateFormatter}
export {cellFormater as cellFormater}
export {getDefaultFilter as getDefaultFilter}