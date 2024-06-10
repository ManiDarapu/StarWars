import {Component} from 'react'
import Cookies from 'js-cookie'
import {withRouter} from 'react-router-dom'
import Details from '../Details'
import Films from '../Films'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inprogress: 'INPROGRESS',
  failure: 'FAILURE',
}

class ListItem extends Component {
  state = {apiStatus: apiStatusConstants.initial, details: {}}

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inprogress})
    const {url} = this.props
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      const updatedData = {
        name: data.name,
        height: data.height,
        mass: data.mass,
        hairColor: data.hair_color,
        skinColor: data.skin_color,
        eyeColor: data.eye_color,
        birthYear: data.birth_year,
        gender: data.gender,
        homeworld: data.homeworld,
        films: data.films,
        species: data.species,
        vehicles: data.vehicles,
        starships: data.starships,
        created: data.created.split('-')[0],
        edited: data.edited.split('-')[0],
        url: data.url,
      }
      this.setState({
        details: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderInprogressView = () => (
    <div>
      <img
        src="https://th.bing.com/th/id/R.28ae5c6f789d072707ff15c36cfac2b6?rik=5IE4H%2f%2fLOY38Zw&riu=http%3a%2f%2f31.media.tumblr.com%2f123b38534727a8bdf81354a742809ba0%2ftumblr_mn62vukpoJ1s917bwo1_500.gif&ehk=pigrwDfj6yd9W8UJhghXged54a4PPZWF5RHUABw%2fbBs%3d&risl=&pid=ImgRaw&r=0"
        alt="Loading..."
      />
    </div>
  )

  handleRetry = () => {
    this.getDetails()
  }

  renderFailureView = () => (
    <div className="failureView">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.handleRetry}>
        Retry
      </button>
    </div>
  )

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  handleBackClick = () => {
    const {history} = this.props
    history.push('/')
  }

  renderSuccessView = () => {
    const {details} = this.state
    const {
      name,
      height,
      mass,
      gender,
      hairColor,
      skinColor,
      eyeColor,
      birthYear,
      homeworld,
      films,
      species,
      vehicles,
      starships,
      created,
      edited,
    } = details
    return (
      <div className="listDiv1">
        <div className="listDiv2">
          <button
            type="button"
            className="logout"
            onClick={this.handleBackClick}
          >
            Back
          </button>
          <h1>{name}</h1>
          <button type="button" className="logout" onClick={this.onClickLogout}>
            Logout
          </button>
        </div>
        <div className="listDiv3">
          <div className="listDiv4">
            <h3>Height: {height}</h3>
            <h3>Mass: {mass}</h3>
            <h3>Gender: {gender}</h3>
            <h3>DOB: {birthYear}</h3>
          </div>
          <div className="listDiv4">
            <h4>Hair: {hairColor}</h4>
            <h4>Skin: {skinColor}</h4>
            <h4>Eye: {eyeColor}</h4>
          </div>
          <div className="listDiv4">
            <p>Created on: {created}</p>
            <p>Last Edited: {edited}</p>
          </div>
          {homeworld && homeworld.length > 0 && (
            <ul className="itemUl">
              <h3>Home World</h3>
              <Details key={homeworld} url={homeworld} />
            </ul>
          )}
          {films && films.length > 0 && (
            <ul className="itemUl">
              <h3>Films</h3>
              {films.map(url => (
                <Films key={url} url={url} />
              ))}
            </ul>
          )}
          {species && species.length > 0 && (
            <ul className="itemUl">
              <h3>Species</h3>
              {species.map(url => (
                <Details key={url} url={url} />
              ))}
            </ul>
          )}
          {vehicles && vehicles.length > 0 && (
            <ul className="itemUl">
              <h3>Vehicles</h3>
              {vehicles.map(url => (
                <Details key={url} url={url} />
              ))}
            </ul>
          )}
          {starships && starships.length > 0 && (
            <ul className="itemUl">
              <h3>Starships</h3>
              {starships.map(url => (
                <Details key={url} url={url} />
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state
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

export default withRouter(ListItem)
