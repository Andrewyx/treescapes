interface ILabelsProps {
    nodes: Node[]
    onNodeSelected: Dispatch<SetStateAction<number>>
}

import * as React from 'react'
import { Dispatch, SetStateAction } from 'react'
import Label from './Label'

const uuid = require('react-uuid')

export default class Labels extends React.PureComponent<ILabelsProps> {
  render() {
    const labels = this.props.nodes.map((node: Node) => {
      return <Label key={`label-${uuid()}`} node={node} onNodeSelected={this.props.onNodeSelected} />
    })
    return <g className="labels">{labels}</g>
  }
}