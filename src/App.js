import React, {Component} from 'react';
import loader from './images/loader.svg';
import Gif from './Gif';
import clearButton from './images/close-icon.svg';

const randomChoice = arr => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {/* if we have results show clear button otherwise show the title */}
    {hasResults ? <img src={clearButton} onClick={clearSearch}/> : <h1 className="title">Jiffy</h1>}
    
  </div>
);

const UserHint = ({loading, hintText}) => (
  <div className="user-hint">
    {loading ? 
    <img className="block mx-auto" src={loader}/> : 
    hintText}
  </div>
)

class App extends Component {

   constructor(props){
     super(props)
     this.state = {
       searchTerm: '',
       loading: false,
       hintText: '',
      //  gif: null,
       gifs: []
     }
   }

  searchGiphy = async searchTerm => {
    this.setState({
      loading: true
    })
    try {
      // we use await to wait for our response to come back
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=KLnLAHurM0s15xlPBaEqdd5vg1AxlZjQ&q=${searchTerm}&limit=25&offset=0&rating=pg&lang=en`
      );
      // here we conver our raw into json data
      const {data} = await response.json();

      // here we check if the array of results is empty
      if(!data.length) {
        throw `Nothing found for ${searchTerm}`
      }

      const randomGif = randomChoice(data)

      console.log(randomGif)

      this.setState((prevState, props) => ({
        ...prevState,
        //get the first result and put it in the state
        // gif: randomGif,
        // here we use our spred to take the previous gifs
        // and spred them out and then add our new gif
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `Hit enter to see more ${searchTerm}`
      }))
    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false
      }));
      console.log(error);
    }
  }

  handleChange = event => {
    const {value} = event.target;
    this.setState((prevState, props) => ({
      // we take our old props and spread out here
      ...prevState,
      // and then we overwrite th ones we want to alert
      searchTerm: value,
      // we set the hint text only when we have more than 2 characters
      hintText: value.length > 2 ? `Hit enter to search ${value}`: ''
    }))
    
  };

  handleKeyPress = event => {
    const {value} = event.target;

    if(value.length > 2 && event.key === 'Enter'){

      // here we call our searchGiphy function 
      this.searchGiphy(value)
    }
    // console.log(event.key)
  }

  //clear search
  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }));
    //here we grab the input and focus the cursor back into it
    this.textInput.focus();
  }


  render(){
    const {searchTerm, gifs} = this.state;
    const hasResults = gifs.length;

    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults}/>

        <div className="search grid">
          {/* gif img */}
          {/* loop over gifs array */}
          {this.state.gifs.map(gif => 
            //we sped out all of our properties onto our Gif component
            <Gif {...gif}/>
          )}
          
          <input className="input grid-item" placeholder="Type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={input => {
              this.textInput = input;
            }}
          />
        </div>
        <UserHint {...this.state}/>
      </div>
    );
  }
}

export default App;
