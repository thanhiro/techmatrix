/* @flow */
import React from 'react';
import {Table, Column, Cell} from 'fixed-data-table';
import Markdown from 'react-remarkable';
import {connect} from 'react-redux';
import {fetchProjects} from '../../redux/modules/projects';
//import classes from './TableView.css';
import 'fixed-data-table/dist/fixed-data-table.css';

type Props = {
  projects: Array<Object>,
  fetchProjects: Function
};

const TextCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    {data[rowIndex][col]}
  </Cell>
);

const LinkCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    <a href={data[rowIndex][col]}>{data[rowIndex][col]}</a>
  </Cell>
);

const MarkdownCell = ({rowIndex, data, col, ...props}) => (
  <Cell {...props}>
    <Markdown source={data[rowIndex][col]} />
  </Cell>
);

// We avoid using the `@connect` decorator on the class definition so
// that we can export the undecorated component for testing.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
export class TableView extends React.Component<void, Props, void> {

  componentDidMount() {
    const {dispatch, fetchProjects} = this.props;
    dispatch(fetchProjects());
  }

  render() {
    let {projects} = this.props;
    return (
      <div>
        <div>
          <h1>Welcome to the TechMatrix tool</h1>
          <Table
            rowHeight={50}
            rowsCount={0}
            width={900}
            height={500}
            headerHeight={50}>
            <Column
              header={<Cell>Col 1</Cell>}
              cell={<TextCell data={projects} col='name' />}
              width={300}
            />
            <Column
              header={<Cell>Col 1</Cell>}
              cell={<LinkCell data={projects} col='prodUrl' />}
              width={300}
            />
            <Column
              header={<Cell>Col 1</Cell>}
              cell={<MarkdownCell data={projects} col='description' />}
              width={300}
            />
          </Table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  projects: state.projects
});
export default connect((mapStateToProps), {
  fetchProjects
})(TableView);
