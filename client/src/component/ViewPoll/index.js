import React, { Component } from "react";
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart, Bar } from 'react-chartjs-2'
import { Link, useParams } from "react-router-dom"
import Polling from '../../contracts/Polling.json';
import getWeb3 from "../../getWeb3";

import "./ViewPoll.scss";

export function withRouter(Children){
  return(props)=>{

     const match  = {params: useParams()};
     return <Children {...props}  match = {match}/>
 }
}

class ViewPoll extends Component {
  constructor(props) {
    super(props)

    this.state = {
      viewResults: false,
      poll_title: "static poll",
      poll_description: "This is a static description that can be deleted later",
      poll_options: [
        {"votes": 3, "option_text": "fancy"},
        {"votes": 1, "option_text": "fancier"},
        {"votes": 7, "option_text": "fanciest"},
        {"votes": 6, "option_text": "fancy feast"}
      ]
    }
  }

  componentDidMount = async () => {
    let { pollid } = this.props.match.params;
    this.setState({poll_id: pollid});

    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Polling.networks[networkId];
      const instance = new web3.eth.Contract(
        Polling.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
      let results = await instance.methods.polls(pollid).call();
      console.error(results);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  onSubmitPoll = () => {
    const { accounts, contract } = this.state;

    // Call Method to Vote
    // await contract.methods.vote(value).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    // let results = await instance.methods.polls(pollid).call();

    // Show user the chart with the values
    this.setState({ viewResults: true });

    //For now show the user an alert saying congrats
    alert("Congrats you clicked a button that doesnt work yet! I am proud of you!");
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

    let labels = [];
    let data = [];

    this.state.poll_options.forEach((item, idx) => {
      labels.push(item.option_text);
      data.push(item.votes);
    })

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: 'Dataset 1',
          maxBarThickness: 40,
          data: data,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ]
    }

    return <Bar options={options} data={chartData} />
  }

  renderForm = () => {
    return(
      <div>
        <h1>{this.state.poll_title}</h1>
        <p>{this.state.poll_description}</p>
        <div>
          {this.state.poll_options.map((option, idx) => {
            return(
              <div key={idx}>
                <input type="radio" name="pollResult" value={option.option_text} /> {option.option_text}
              </div>
            )
          })}
        </div>
        <button onClick={this.onSubmitPoll}>Submit Poll</button>
      </div>
    )
  }

  render() {
    return (
      <section id="view-poll">
        { this.state.viewResults ? this.renderChart() : this.renderForm() }
        <button onClick={this.toggleResults}>{`${this.state.viewResults ? 'Hide' : 'View'} Results`}</button>
        <Link to="/">Back to dashboard</Link>
      </section>
    )
  }
}

export default withRouter(ViewPoll);