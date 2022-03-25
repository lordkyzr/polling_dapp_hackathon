import React, { Component } from "react";
import { Link } from "react-router-dom"
import Polling from '../../contracts/Polling.json';
import getWeb3 from "../../getWeb3";

import "./Dashboard.scss";

export default class ViewPoll extends Component {
  constructor(props) {
    super(props)

    this.state = {
      polls: []
    }
  }

  componentDidMount = async () => {
    await this.callForContractData()
  }

  callForContractData = async () => {
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
      let totalPolls = await instance.methods.totalPolls().call();

      let polls = Array.from(Array(totalPolls))

      for (let i = 0; i < totalPolls; i++) {
        const pollId = i + 1
        let poll = await instance.methods.polls(pollId).call()

        polls[i] = poll
      }

      console.info("POLLS RECEIVED: ", polls);

      this.setState({ polls })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  }

  renderPolls = () => {
    return this.state.polls.map((poll, idx) => {
      const pollId = idx + 1
      return (
        <div key={idx}>
          <Link to={`/view/${pollId}`}>{ poll.title }</Link>
        </div>
      )
    })
  }

  render() {
    return (
      <section id="dashboard">
        <h1>Recent Polls</h1>
        { this.renderPolls() }
      </section>
    )
  }
}
