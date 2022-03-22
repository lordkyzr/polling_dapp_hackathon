import React, { Component } from "react";
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart, Bar } from 'react-chartjs-2'
import { Link } from "react-router-dom"

import "./ViewPoll.scss";

export default class ViewPoll extends Component {
  constructor(props) {
    super(props)

    this.state = {
      viewResults: false
    }
  }

  toggleResults = () => {
    this.setState({ viewResults: !this.state.viewResults })
  }

  renderChart = () => {
    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          position: 'top',
        },
        title: {
          display: true,
          text: 'Poll Results',
        },
      },
    }

    const chartData = {
      labels: [ "Option 1", "Option 2", "Option 3" ],
      datasets: [
        {
          label: 'Dataset 1',
          maxBarThickness: 40,
          data: [ 10, 3, 37 ],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ]
    }

    return <Bar options={options} data={chartData} />
  }

  render() {
    return (
      <section id="view-poll">
        <h1>View Poll</h1>
        { this.state.viewResults ? this.renderChart() : undefined }
        <button onClick={this.toggleResults}>{`${this.state.viewResults ? 'Hide' : 'View'} Results`}</button>
        <Link to="/">Back to dashboard</Link>
      </section>
    )
  }
}
