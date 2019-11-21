import React, { Component } from "react";
import { connect } from "react-redux";

export class BankSelection extends Component {
  render() {
    return (
      <select name="selectedBank" value={this.props.value} onChange={this.props.onChange} className="select">
        <option value="ABNANL2A">ABN AMRO</option>
        <option value="RABONL2U">Rabobank</option>
        <option value="INGBNL2A">ING</option>
        <option value="BUNQNL2A">bunq</option>
      </select>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BankSelection);
