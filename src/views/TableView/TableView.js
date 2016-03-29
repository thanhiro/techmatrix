/* @flow */
import React from 'react';
import {Table, sortColumns, Search, formatters} from 'reactabular';
import Markdown from 'react-remarkable';
import {connect} from 'react-redux';
import {fetchProjects} from '../../redux/modules/projects';
import classNames from 'classnames';
import * as classes from './TableView.css';
import 'fixed-data-table/dist/fixed-data-table.css';

type Props = {
  projects: Array<Object>,
  dispatch: Function
};

function markIt(value, getHighlights) {
  value = String(value);
  let str = '';
  let highlights = getHighlights(value);
  let currentPosition = 0;
  for (let x = 0; x < highlights.length; x++) {
    let nonMatchingPrefix = value.slice(currentPosition, highlights[x].startIndex);
    let matchingText = value.slice(highlights[x].startIndex, highlights[x].startIndex + highlights[x].length);
    currentPosition = highlights[x].startIndex + highlights[x].length;

    if (nonMatchingPrefix.length > 0) {
      str += nonMatchingPrefix;
    }
    str += '<mark>' + matchingText + '</mark>';
  }
  str += value.slice(currentPosition);
  return str;
}

/**
 * Highlighter with simpler <mark>-based syntax
 * @param getHighlights
 * @returns {Function}
 */
function highlightMD(getHighlights) {
  return function(value) {
    if (Object.prototype.toString.call(value) === '[object Array]') {
      return value.map(x => {
        let markup = {__html: markIt(x, getHighlights)};
        return <span dangerouslySetInnerHTML={markup} />;
      });
    } else {
      return markIt(value, getHighlights);
    }
  };
}

export class TableView extends React.Component<void, Props, void> {
  linkCell = v => <a href={v}>{v}</a>;
  markdownCell = v => {
    let opts = {
      html: true
    };
    return {
      value: <Markdown source={v} options={opts}/>
    };
  };
  tagCell = tags => {
    let tagComponents = tags.map(t => (<li className={classes.tag}>{t}</li>));
    return <ul className={classes.tagList}>{tagComponents}</ul>;
  };
  deleteCell = (value, data, rowIndex, property) => {
    let remove = () => {
      var idx = this.props.projects
        .findIndex(x => x.id === data[rowIndex].id);
      console.log(idx);
    };
    return <span
      onClick={remove} style={{cursor: 'pointer'}}>&#10007;</span>;
  };

  highlighter = column => formatters.highlight(value => {
    return Search.matches(column, value, this.state.search.query);
  });
  highlighterMD = column => highlightMD(value => {
    return Search.matches(column, value, this.state.search.query);
  });

  columns = [
    {
      property: 'name',
      header: 'Name',
      cell: [x => x, this.highlighter('name')]
    },
    {
      property: 'prodUrl',
      header: 'URL',
      cell: [this.highlighter('prodUrl'), this.linkCell]
    },
    {
      property: 'projectTimespan',
      header: 'When?',
      cell: [x => x, this.highlighter('projectTimespan')]
    },
    {
      property: 'description',
      header: 'Description',
      cell: [this.highlighterMD('description'), this.markdownCell]
    },
    {
      property: 'team',
      header: 'Team',
      cell: [this.highlighterMD('team'), this.tagCell],
      search: s => s.toString()
    },
    {
      property: 'techTags',
      header: 'Technologies',
      cell: [this.highlighterMD('techTags'), this.tagCell],
      search: s => s.toString()
    },
    {
      property: 'otherTags',
      header: 'Other notes',
      cell: [this.highlighterMD('otherTags'), this.tagCell],
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
            <i className="icon-search"></i>
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
