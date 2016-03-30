/* @flow */
import React from 'react';
import {Table, sortColumn, Search, formatters} from 'reactabular';
import Markdown from 'react-remarkable';
import SkyLight from 'react-skylight';
import orderBy from 'lodash/orderBy';
import {connect} from 'react-redux';
import {fetchProjects} from '../../redux/modules/projects';
import classNames from 'classnames';
import * as styles from './TableView.css';
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
function highlightSimple(getHighlights) {
  return function(value) {
    if (Object.prototype.toString.call(value) === '[object Array]') {
      return value.map(x => {
        let val = (typeof x === 'object' && x.hasOwnProperty('name')) ? x.name : x;
        let markup = {__html: markIt(val, getHighlights)};
        return <span dangerouslySetInnerHTML={markup} />;
      });
    } else {
      return markIt(value, getHighlights);
    }
  };
}

export class TableView extends React.Component<void, Props, void> {
  linkCell = v => <a href={v} dangerouslySetInnerHTML={{__html: v}} />;
  markdownCell = v => {
    let opts = {
      html: true
    };
    return {
      value: <Markdown source={v} options={opts}/>
    };
  };
  tagCell = tagClass => tags => {
    let klass = tagClass || styles.tag;
    let tagComponents = tags.map(t => (<li className={klass}>{t}</li>));
    return <ul className={styles.tagList}>{tagComponents}</ul>;
  };

  actionsCell = (value, data, rowIndex, property) => {
    let remove = () => {
      var idx = this.props.projects
        .findIndex(x => x.id === data[rowIndex].id);
      console.log(idx);
      this.refs.modal.hide();
    };
    let cancel = () => {
      this.refs.modal.hide();
    };

    let confirm = () => {
      this.setState({
        modal: {
          title: 'Delete?',
          content: <div className={styles.modalButtons}>
            <button
              className={classNames('pure-button', styles.buttonWarning)}
              onClick={remove}>Delete</button>
            <button
              className={classNames('pure-button', styles.buttonSecondary)}
              onClick={cancel}>Cancel</button>
          </div>
        }
      });
      this.refs.modal.show();
    };

    return <span style={{whiteSpace: 'nowrap'}}>
      <span style={{cursor: 'pointer'}}><i className='icon-pencil' /></span>
      <span onClick={confirm} style={{cursor: 'pointer'}}><i className='icon-cancel' /></span>
    </span>;
  };

  highlighter = column => formatters.highlight(value => {
    return Search.matches(column, value, this.state.search.query);
  });
  highlighterSimple = column => highlightSimple(value => {
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
      cell: [this.highlighterSimple('prodUrl'), this.linkCell]
    },
    {
      property: 'projectTimespan',
      header: 'When?',
      cell: [x => x, this.highlighter('projectTimespan')]
    },
    {
      property: 'description',
      header: 'Description',
      cell: [this.highlighterSimple('description'), this.markdownCell]
    },
    {
      property: 'team',
      header: 'Team',
      cell: [this.highlighterSimple('team'), this.tagCell(styles.teamTag)],
      search: s => s.map(x => x.name).toString()
    },
    {
      property: 'techTags',
      header: 'Technologies',
      cell: [this.highlighterSimple('techTags'), this.tagCell()],
      search: s => s.toString()
    },
    {
      property: 'otherTags',
      header: 'Other notes',
      cell: [this.highlighterSimple('otherTags'), this.tagCell()],
      search: s => s.toString()
    },
    {
      cell: this.actionsCell
    }
  ];

  columnNames = {
    onClick: column => {
      sortColumn(
        this.columns,
        column,
        this.setState.bind(this)
      );
    }
  };

  constructor(props) {
    super(props);
    this.onSearch = ::this.onSearch;
    this.state = {
      search: '',
      sortingColumn: null,
      modal: {
        title: 'title',
        content: 'content'
      }
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

    if (this.state.sortingColumn) {
      projects = orderBy(projects, [this.state.sortingColumn.property],
        [this.state.sortingColumn.sort]);
    }

    var dialogStyles = {
      width: '250px',
      height: '150px'
    };

    return (
      <div>
        <div className={styles.searchContainer}>
          <form className='pure-form'>
            <fieldset>
              <i className='icon-search'/>
              <Search columns={this.columns} data={projects} onChange={this.onSearch}/>
            </fieldset>
          </form>
        </div>
        <div className={styles.tableContainer}>
          <Table
            className={classNames(styles.tmTable, 'pure-table', 'pure-table-horizontal')}
            columns={this.columns} data={projects}
            columnNames={this.columnNames}
            rowKey={'id'}/>
        </div>
        <SkyLight
          ref='modal'
          dialogStyles={dialogStyles}
          title={this.state.modal.title}>{this.state.modal.content}</SkyLight>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  projects: state.projectsReducer.projects
});
export default connect(mapStateToProps)(TableView);
