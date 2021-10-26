import React from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import paginationFactory from 'react-bootstrap-table2-paginator'
import filterFactory from 'react-bootstrap-table2-filter'
import { connect } from 'react-redux'
import { Filters } from '../_helpers'
import equal from 'deep-equal'
import PropTypes from 'prop-types'



const RemoteTable = ({ data, page, sizePerPage, onTableChange, totalSize, defaultSorted, columns, searchParameters, expandRow}) => (
  <BootstrapTable
    bootstrap4
    remote
    bordered={false}
    hover
    condense
    keyField='key'
    data={data}
    columns={columns(searchParameters)}
    defaultSorted={defaultSorted}
    filter={filterFactory()}
    pagination={paginationFactory({ page, sizePerPage, totalSize })}
    onTableChange={onTableChange}
    expandRow={expandRow}
  />
)
RemoteTable.propTypes = {
  data: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  totalSize: PropTypes.number.isRequired,
  sizePerPage: PropTypes.number.isRequired,
  onTableChange: PropTypes.func.isRequired,
  expandRow: PropTypes.object
}
class RemoteTableService extends React.Component {
  constructor (props) {
    super(props)
    this.user = this.props.user
    const searchDefault = this.props.defaultFilters(this.user.username)
    this.search = {
      users: this.getImpersonated(),
      ...searchDefault
    }

  }
  componentDidUpdate() {
    this.search.users = this.getImpersonated()
    this.handleTableChange("filter",this.search)
  }
  handleTableChange = async (type, {page,sizePerPage,filters,sortField,sortOrder}) => {
    filters = type === "sort" ? this.search.filters : filters
    this.search = { users: this.search.users, page,sizePerPage,filters,sortField,sortOrder }
    // prevent double post
    if(equal(this.search,this.oldSearch) || !sizePerPage ){
      return
    }
    this.oldSearch = this.search
    // set filters local storage
    localStorage.setItem(
      'default'+this.props.name+'Filters_' + this.user.username,
      JSON.stringify(this.search)
    )
    // prepare filters
    const request = { ...this.search, filter: this.getFilters(filters).get() }
    delete request.filters
    // send request
    await this.props.filterAction(request)
  }
  getFilters(filters) {
    return new Filters(filters)
  }
  getImpersonated() {
    return this.props.impersonate || this.props.defaultFilters(this.user.username).users || this.user.username 
  }
  render () {
    return (
      <RemoteTable
        data={this.props.data}
        page={ this.search.page }
        sizePerPage={ this.search.sizePerPage }
        totalSize={ this.props.totalSize || 0}
        defaultSorted={ [{ dataField: this.search.sortField,  order: this.search.sortOrder }] }
        onTableChange={this.handleTableChange}
        columns={this.props.columns}
        searchParameters={this.search}
        expandRow={this.props.expandRow}
      />
    )
  }
}
RemoteTableService.propTypes = {
  columns: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  filterAction : PropTypes.func.isRequired,
  defaultFilters : PropTypes.func.isRequired,
  additionalFilters : PropTypes.func,
  data : PropTypes.array.isRequired,
  totalSize : PropTypes.number.isRequired,
  expandRow : PropTypes.object
}
function mapState (state) {
  const { user } = state.authentication
  const { data, totalSize } = state.log
  const { impersonate } = state.usertree
  return { user: user.user, impersonate}
}
const connectedRemoteTableService = connect(mapState, {})(RemoteTableService)
export { connectedRemoteTableService as RemoteTableService }
