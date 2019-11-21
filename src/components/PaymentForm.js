import React, { Component } from "react";
import { connect } from "react-redux";
import BankSelection from "./BankSelection";

export class PaymentForm extends Component {
  render() {
    return (
      <form
        onSubmit={this.props.onSubmit}
        autoComplete="off"
        className="payment-form"
      >
        <div>
          <label htmlFor="iban">Recipient's name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={this.props.onChange}
            value={this.props.paymentData.name}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="selectedBank">Recipient's bank</label>
          <BankSelection
            onChange={this.props.onChange}
            value={this.props.paymentData.selectedBank}
          />
        </div>
        <div>
          <label htmlFor="iban">Recipient's account (IBAN)</label>
          <input
            type="text"
            name="iban"
            placeholder="Account number"
            onChange={this.props.onChange}
            value={this.props.paymentData.iban}
            required
          ></input>
        </div>
        <div>
          <label htmlFor="amount">Total amount (EUR) to split</label>
          <input
            type="number"
            name="amount"
            placeholder="EUR"
            onChange={this.props.onChange}
            value={this.props.paymentData.amount}
            required
          ></input>
        </div>

        <input type="submit" value="Generate QR-code for splitted bill"></input>
      </form>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentForm);
