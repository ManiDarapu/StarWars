import {Component} from 'react'
import Cookies from 'js-cookie'
import {withRouter} from 'react-router-dom'
import ListItem from '../ListItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inprogress: 'INPROGRESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    list: [],
    next: '',
    previous: '',
    url: 'https://swapi.dev/api/people',
    selectedUrl: '',
  }

  componentDidMount() {
    this.getStarwars()
  }

  getStarwars = async () => {
    const {url} = this.state
    this.setState({apiStatus: apiStatusConstants.inprogress})

    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    const {results} = data
    const updatedResults = results.map(each => ({
      name: each.name,
      height: each.height,
      mass: each.mass,
      hairColor: each.hair_color,
      skinColor: each.skin_color,
      eyeColor: each.eye_color,
      birthYear: each.birth_year,
      gender: each.gender,
      homeworld: each.homeworld,
      films: each.films,
      species: each.species,
      vehicles: each.vehicles,
      starships: each.starships,
      created: each.created,
      edited: each.edited,
      url: each.url,
    }))
    if (response.ok) {
      this.setState({
        list: updatedResults,
        apiStatus: apiStatusConstants.success,
        next: data.next,
        previous: data.previous,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="failureView">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button">Retry</button>
    </div>
  )

  renderInprogressView = () => (
    <div>
      <img
        src="https://th.bing.com/th/id/R.28ae5c6f789d072707ff15c36cfac2b6?rik=5IE4H%2f%2fLOY38Zw&riu=http%3a%2f%2f31.media.tumblr.com%2f123b38534727a8bdf81354a742809ba0%2ftumblr_mn62vukpoJ1s917bwo1_500.gif&ehk=pigrwDfj6yd9W8UJhghXged54a4PPZWF5RHUABw%2fbBs%3d&risl=&pid=ImgRaw&r=0"
        alt="Loading..."
      />
    </div>
  )

  onClickListItem = url => {
    this.setState({selectedUrl: url})
  }

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  onClickNext = () => {
    const {next} = this.state
    if (next) {
      this.setState({url: next}, this.getStarwars)
    }
  }

  onClickPrevious = () => {
    const {previous} = this.state
    if (previous) {
      this.setState({url: previous}, this.getStarwars)
    }
  }

  renderSuccessView = () => {
    const {list} = this.state
    return (
      <div className="homeDiv1">
        <div className="homeDiv2">
          <img
            className="homeImg"
            src="https://bestanimations.com/media/star-wars/1037554235star-wars-animated-gif-32.gif"
            alt="starwars logo"
          />
          <button type="button" className="logout" onClick={this.onClickLogout}>
            Logout
          </button>
        </div>
        <ul className="homeUl">
          {list.map(each => (
            <li
              key={each.name}
              className="homeLi"
              onClick={() => this.onClickListItem(each.url)}
            >
              <h1>{each.name}</h1>
              <div className="liDiv2">
                <h4>Height: {each.height}</h4>
                <h4>DOB: {each.birthYear}</h4>
              </div>
              <div className="liDiv2">
                <p>Skin: {each.skinColor} </p>
                <p>Hair: {each.hairColor}</p>
                <p>Eye: {each.eyeColor}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="buttons">
          <button
            className="nxtBtn"
            type="button"
            onClick={this.onClickPrevious}
          >
            Previous
          </button>
          <button className="nxtBtn" type="button" onClick={this.onClickNext}>
            Next
          </button>
        </div>
      </div>
    )
  }

  render() {
    const {apiStatus, selectedUrl} = this.state
    if (selectedUrl) {
      return <ListItem url={selectedUrl} />
    }
    switch (apiStatus) {
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inprogress:
        return this.renderInprogressView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }
}

export default withRouter(Home)
