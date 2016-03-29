/* @flow */
import React from 'react';
import {Table, sortColumns, Search} from 'reactabular';
import Markdown from 'react-remarkable';
import {connect} from 'react-redux';
import {fetchProjects} from '../../redux/modules/projects';
import classNames from 'classnames';
import * as classes from './TableView.css';
import 'fixed-data-table/dist/fixed-data-table.css';
const highlight = require('reactabular/formatters/highlight');

type Props = {
  projects: Array<Object>,
  dispatch: Function
};

export class TableView extends React.Component<void, Props, void> {

  linkCell = v => ({
    value: <a href={v}>{v}</a>
  });
  markdownCell = v => ({
    value: <Markdown source={v}/>
  });
  tagCell = tags => {
    let tagComponents = tags.map(t => (<li className={classes.tag}>{t}</li>));
    return ({
      value: <ul className={classes.tagList}>{tagComponents}</ul>
    });
  };
  deleteCell = (value, data, rowIndex, property) => {
    let remove = () => {
      var idx = this.props.projects
        .findIndex(x => x.id === data[rowIndex].id);
      console.log(idx);
    };

    return {
      value:
        <span>
          <span onClick={remove} style={{cursor: 'pointer'}}>&#10007;</span>
        </span>
    };
  };

  highlighter = column => {
    return highlight(value => {
      let m = Search.matches(column, value, this.state.search.query);
      return m;
    });
  };

  columns = [
    {
      property: 'name',
      header: 'Name',
      cell: [x => x, this.highlighter('name')]
    },
    {
      property: 'prodUrl',
      header: 'URL',
      cell: this.linkCell
    },
    {
      property: 'projectTimespan',
      header: 'When?'
    },
    {
      property: 'description',
      header: 'Description',
      cell: [this.markdownCell, this.highlighter('description')]
    },
    {
      property: 'team',
      header: 'Team',
      cell: [this.tagCell, this.highlighter('team')],
      search: s => s.toString()
    },
    {
      property: 'techTags',
      header: 'Technologies',
      cell: [this.tagCell, this.highlighter('techTags')],
      search: s => s.toString()
    },
    {
      property: 'otherTags',
      header: 'Other notes',
      cell: [this.tagCell, this.highlighter('otherTags')],
      search: s => s.toString()
    },
    {
      cell: this.deleteCell
    }
  ];

  columnNames = {
    onClick: column => {
      sortColumns(
        this.columns,
        this.state.sortedColumns,
        column,
        this.setState.bind(this));
    }
  };

  constructor(props) {
    super(props);
    this.onSearch = ::this.onSearch;
    this.state = {
      search: '',
      sortedColumns: []
    };
  }

  onSearch(search) {
    this.setState({
      search: search
    });
  }

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchProjects());
  }

  render() {
    let {projects} = this.props;

    if (this.state.search.query) {
      projects = Search.search(
        projects,
        this.columns,
        this.state.search.column,
        this.state.search.query
      );
    }

    return (
      <div>
        <form className='pure-form search-container'>
          <fieldset>
            <Search columns={this.columns} data={projects} onChange={this.onSearch}/>
          </fieldset>
        </form>
        <Table
          className={classNames(classes.tmTable, 'pure-table', 'pure-table-horizontal')}
          columns={this.columns} data={projects}
          columnNames={this.columnNames}
          rowKey={'id'}/>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  projects: state.projectsReducer.projects
});
export default connect(mapStateToProps)(TableView);
