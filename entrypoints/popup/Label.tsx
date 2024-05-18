interface ILabelProps {
    node: any
    onNodeSelected: Dispatch<SetStateAction<number>>
  }

import * as React from 'react'
import * as d3 from 'd3'
import { Dispatch, SetStateAction } from 'react'

export default class Label extends React.PureComponent<ILabelProps> {
  ref: SVGTextElement | undefined

  componentDidMount() {
    if (this.ref) d3.select(this.ref).data([this.props.node])
  }

  render() {
    return (
      <text
        style={{ cursor: 'pointer' }}
        className="label"
        ref={(ref: SVGTextElement) => (this.ref = ref)}
        onClick={() => {
          this.props.onNodeSelected(((this.props.node as unknown) as { index: number }).index - 1)
        }}
      >
        {this.props.node.id}
      </text>
    )
  }
}