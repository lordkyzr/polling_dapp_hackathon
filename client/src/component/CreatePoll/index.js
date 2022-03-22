import React, { Component } from "react";

import { Link } from "react-router-dom"

import "./CreatePoll.scss";

export default class ViewPoll extends Component {
  render() {
    return (
      <section id="create-poll">
        <h1>Create Poll</h1>
        <Link to="/">Back to dashboard</Link>
      </section>
    )
  }
}
