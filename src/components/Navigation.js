import React, { Component } from "react";

export default class Navigation extends Component {
  state = {
    seleted: "intro"
  };
  onClick = event => {
    this.setState({
      seleted: event.target.name
    });
  };
  render() {
    return (
      <div className="sidenav">
        <a
          href="#intro"
          name="intro"
          className={this.state.seleted === "intro" ? "active" : null}
          onClick={this.onClick}
        >
          Intro
        </a>
        <a
          href="#step1"
          name="step1"
          className={this.state.seleted === "step1" ? "active" : null}
          onClick={this.onClick}

        >
          Step 1
        </a>
        <a
          href="#step2"
          name="step2"
          className={this.state.seleted === "step2" ? "active" : null}
          onClick={this.onClick}
        >
          Step 2
        </a>
      </div>
    );
  }
}
