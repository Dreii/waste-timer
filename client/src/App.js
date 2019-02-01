import React, { Component } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import ReactLoading from 'react-loading'

import io from 'socket.io-client'
const socketUrl = `http://${window.location.hostname}:3231`
// let baseUrl = ''

class App extends Component {
  state = {
    callbacks: 0,
    err: '',
    socket: null,
    loading: true,
    loadingButton: false,
    addingDone: false
  }

  componentDidMount(){
    const socket = io(socketUrl)
    socket.on('connect', ()=>{
      this.setState({socket})

      socket.on('CALLBACK_UPDATE', callbacks => {
        console.log(callbacks)
        this.setState({callbacks, loading: false, loadingButton: false})
        setTimeout(()=>this.setState({addingDone: false}), 600)
      })

      socket.on('error', (err)=>{
        this.setState({err})
      })
    })
  }

  render() {
    let callbacks = this.state.callbacks
    let mins = callbacks * 8
    let hr = Math.floor(mins / 60)
    let minDisplay = mins-hr*60
    return (
      <div className="App">

        {this.state.loading ? (
          <div className="container">
            <ReactLoading className="main-loading" type="spin" color="white" height={'32px'} width={'32px'} />
          </div>
        ):(
          <div className="container">
            {/* total calls * 10 / 60 */}
            <p className="title">We've wasted,</p>

            <div className="time-display">
              <div className="time-inner">
                <p className="hr-display">{hr}</p>
                <div className="time-sub">
                  <p className="hr-subtitle">Hours</p>
                  {/* <br/> */}
                  <p className="min-display">{minDisplay}</p>
                  {/* - (callbacks * 8 % 60) */}
                  <p className="min-subtitle">Minutes</p>
                </div>
              </div>
            </div>


            <p className="or">or</p>

            <div className="cash-container">
              {/* total calls * 10 / 60 * 90 */}
              <p className="cash-display">${callbacks * 10 * 1.50}</p>
              <p className="callback-number-subtitle">On {callbacks} callbacks.</p>
              <p className="days-display">In the past 5 days.</p>
              <p className="comment-subtitle">
                {callbacks > 10 ? `We should probably work on that.` : 'Thats not too bad.'}
              </p>
            </div>

            <button
              className={`addCallbackButton ${this.state.loadingButton ? "disabled": ""}`}
              onClick={()=>{
                if(this.state.socket) this.state.socket.emit('NEW_CALLBACK', "null")
                this.setState({loadingButton: true, addingDone: true})
              }}
              disabled = {this.state.loadingButton|| this.state.addingDone ? true : false}
            >
              {this.state.loadingButton ? (
                <div className="button-icon">
                    <ReactLoading className="button-loading fade-in" type="spin" color="white" height={'32px'} width={'32px'} />
                </div>
              ):(
                <div>
                  {this.state.addingDone ? (
                    <div className="button-icon fade-in check">
                      <FontAwesomeIcon icon={faCheck} />
                    </div>
                  ):(
                    <div className="button-icon fade-in add">
                      <FontAwesomeIcon icon={faPlus} />
                      <br/>
                      <p className="button-subtitle">Add Callback</p>
                    </div>
                  )}
                </div>
              )}
            </button>

          </div>
        )}
      </div>
    );
  }
}

export default App;
