import React, { Component } from "react";
import Polling from '../../contracts/Polling.json';
import getWeb3 from "../../getWeb3";
import { Link } from "react-router-dom";

import "./CreatePoll.scss";

export default class ViewPoll extends Component {
  
  constructor(props) {
    super(props)

    this.state = {
      poll_title: "",
      poll_description: "",
      options: []
    }
  }

  componentDidMount = async () => {
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
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  pollTitleOnChange = (event) => {
    this.setState({
      poll_title: event.target.value
    });
  }

  pollDescriptionOnChange = (event) => {
    this.setState({
      poll_description: event.target.value
    });
  }

  pollOptionOnChange = (event, idx) => {
    let options = this.state.options;
    options[idx] = event.target.value;
    this.setState({options: options})
  }

  pollAddOption = (event) => {
    let options = this.state.options;
    options.push("");
    this.setState({
      options: options
    })
  }

  submitPoll = (event) => {
    console.error("Title:" + this.state.poll_title)
    console.error("Description: " + this.state.poll_description)
    this.state.options.map((value, idx) => {
      console.error(`"option_${idx}: ${this.state.options[idx]}"`)
    })
    this.submitToBlockChain(this.state.poll_title, this.state.poll_description, this.state.options);
    //Redirect to view poll page
  }

  submitToBlockChain = async (title, description, options) => {
    const { accounts, contract } = this.state;
    await contract.methods.createPoll(title, description, options).send({ from: accounts[0] });
  }

  render() {
    return (
      <section id="create-poll">
        <h1>Create Poll</h1>
        
        <br/>
        
        <div>
          <label htmlFor="poll_title">
            Poll Title: 
          </label>
          <input id="poll_title" name="poll_title" size="30" type="text" 
            onChange={this.pollTitleOnChange} value={this.state.poll_title}/>
        </div>

        <br/>

        <div>
          <label htmlFor="poll_description">
            Poll Description: 
          </label>
          <input id="poll_description" name="poll_description" size="30" type="textarea" 
            onChange={this.pollDescriptionOnChange} value={this.state.poll_description}/>
        </div>

        <br/>

        <div>
          <button onClick={this.pollAddOption}>
            Add Option
          </button>
        </div>

        <br/>

        {
          this.state.options.map((option, idx) => {
            return( 
            <div key={idx}>
              <label htmlFor={"option_input_" + idx} key={"option_label_" + idx}>
                Poll Title: 
              </label>
              <input id={"option_input_" + idx} key={"option_input_" + idx} name={"option_input_" + idx} size="30" type="text" 
                onChange={(e) => this.pollOptionOnChange(e, idx)} value={this.state.options[idx]}/>
            </div>
          )})
        }

        <div>
          <button onClick={this.submitPoll}>
            Submit Poll
          </button>
        </div>

        <Link to="/">Back to dashboard</Link>
      </section>
    )
  }
}
