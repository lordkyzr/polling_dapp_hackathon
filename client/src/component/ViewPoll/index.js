import React, { Component } from "react";

import { Link } from "react-router-dom"

import "./ViewPoll.scss";

export default class ViewPoll extends Component {
  render() {
    return (
      <section id="view-poll">
        <h1>View Poll</h1>
        <Link to="/">Back to dashboard</Link>
      </section>
    )
  }
}
