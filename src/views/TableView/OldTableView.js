/* @flow */
import React from 'react';
import {Table, Column, Cell} from 'fixed-data-table';
import Markdown from 'react-remarkable';
import {connect} from 'react-redux';
import {fetchProjects} from '../../redux/modules/projects';
import 'fixed-data-table/dist/fixed-data-table.css';

type Props = {
  projects: Array<Object>,
  dispatch: Function
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

export class TableView extends React.Component<void, Props, void> {

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(fetchProjects());
  }

  render() {
    let {projects} = this.props;
    return (
      <div>
        <Table
          rowHeight={50}
          rowsCount={projects.length}
          width={1000}
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
    );
  }
}

const mapStateToProps = state => ({
  projects: state.projectsReducer.projects
});
export default connect(mapStateToProps)(TableView);
