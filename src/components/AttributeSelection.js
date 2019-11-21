import React, { Component } from "react";
import { connect } from "react-redux";

export class AttributeSelection extends Component {
  render() {
    return (
        <select name="attributs" value={this.props.seletedAttribute} onChange={this.props.onChange} className="select">
          <option value="happiness">With most happiness</option>
          <option value="anger">With most anger</option>
          <option value="contempt">With most contempt</option>
          <option value="disgust">With most disgust</option>
          <option value="fear">With most fear</option>
          <option value="neutral">With most neutral</option>
          <option value="sadness">With most sadness</option>
          <option value="surprise">With most surprise</option>
        </select>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AttributeSelection);
