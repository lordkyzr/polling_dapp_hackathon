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
      poll_title: "",
      poll_description: "",
      poll_options: [],
      selected_option: null
    }

    // Example state shape:
    // {
    //   viewResults: false,
    //   poll_title: "static poll",
    //   poll_description: "This is a static description that can be deleted later",
    //   poll_options: [
    //     {"votes": 3, "option_text": "fancy"},
    //     {"votes": 1, "option_text": "fancier"},
    //     {"votes": 7, "option_text": "fanciest"},
    //     {"votes": 6, "option_text": "fancy feast"}
    //   ]
    // }
  }

  setPollData = async (contract, pollid, poll) => {
    let options = await contract.methods.getPollOptions(pollid).call()
    let optionVotes = Array.from(Array(options.length))

    for (let o = 0; o < options.length; o++) {
      let votes = await contract.methods.getPollOptionVotes(pollid, o + 1).call()
      optionVotes[o] = votes
    }

    let poll_options = options.map((o, idx) => ({ option_text: o, votes: optionVotes[idx] }))

    this.setState({ poll_options, poll_title: poll.title, poll_description: poll.description })
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
      let poll = await instance.methods.polls(pollid).call();

      await this.setPollData(instance, pollid, poll)
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  onSubmitPoll = async () => {
    const { accounts, contract } = this.state;

    // Call Method to Vote
    if (this.state.poll_id == null || this.state.selected_option == null) {
      alert("Select poll option before submitting!")
      return
    }

    await contract.methods
      .voteForPoll(this.state.poll_id, this.state.selected_option + 1)
      .send({ from: accounts[0] })

    // Get the value from the contract to prove it worked.
    let poll = await contract.methods.polls(this.state.poll_id).call();

    await this.setPollData(contract, this.state.poll_id, poll)

    // Show user the chart with the values
    this.setState({ viewResults: true });


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

  changeSelectedValue = (selected_option) => {
    this.setState({ selected_option })
  }

  renderForm = () => {
    return(
      <div>
        <h2>{this.state.poll_title}</h2>
        <p>{this.state.poll_description}</p>
        <div>
          {this.state.poll_options.map((option, idx) => {
            return(
              <div key={idx}>
                <input 
                  type="radio"
                  name="pollResult"
                  value={option.option_text}
                  onChange={ () => this.changeSelectedValue(idx) }
                  checked={ idx === this.state.selected_option }
                /> {option.option_text}
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