export class Range {
    setFrom(from, include) {
        this.from = from
        this.includeFrom = include === undefined ? true : false
        return this
    }
    setTo(to,include) {
        this.to = to
        this.includeTo = include === undefined ? true : false
        return this
    }
    isValid() {
        return this.to || this.from
    }

}
export class FilterElement {
    constructor(name) {
        this.name = name 
        this.type = this.constructor.name
    }
    setValue(value) {
        this.value = value
        return this
    }
    setType(type) {
        this.type = type
        return this
    }
    setName(name) {
        this.name = name;
        return this
    }
    isValid() {
        return this.name && this.value
    }
    setTableFilter(filter) {
        return  this.setValue(filter.filterVal)           
    }
}
export class RangeFilterElement extends FilterElement {
    constructor (name) {
        super(name)
        this.range = new Range()
        
    }
    isValid() {
        return this.name && this.range.isValid() && this.operator
    }
}
export class DateFilterElement extends RangeFilterElement {
    setTableFilter(filter) {
        const value = filter.filterVal
        this.operator = value.comparator
        const date = value.date
        if(!date) return
        const dateString = date.getFullYear() + "/" +( date.getMonth() +1) + "/" + date.getDate()
        const currentDay = new Date(dateString)
        const nextDay = new Date(dateString)
        nextDay.setDate(nextDay.getDate() +1)
        switch(this.operator) {
            case ">" : this.range.setFrom(nextDay.getTime()); break
            case ">=" : this.range.setFrom(currentDay.getTime())  ; break
            case "=" :  this.range.setFrom(currentDay.getTime()).setTo(nextDay.getTime()); break
            case "<" : this.range.setTo(currentDay.getTime(),false); break
            case "<=" : this.range.setTo(nextDay.getTime()); break
            default: this.range.setFrom(currentDay.getTime()).setTo(nextDay.getTime()); break
        }
        return this
    }
}
export class Filters {
    constructor(tableFilters) {
        this.items = {}
        if(tableFilters) this.addTableFilters(tableFilters)
    }
    addTableFilters(tableFilters) {
        for(const filterName in tableFilters) {
            const filter = tableFilters[filterName]
            this.type = filter.filterType
            let filterElement
            switch(filter.filterType) {
                case "DATE":  filterElement = new DateFilterElement(filterName); break
                default:  filterElement = new FilterElement(filterName)       
            }
            filterElement.setTableFilter(filter)
            if(filterElement.isValid()) {
                this.addFilter(filterName, filterElement)
            }            
        }
    }
    addFilter(name, filterElement) {
        filterElement.setName(name)
        this.items[name] = filterElement
    }
    get() {
        return this.items
    }

}