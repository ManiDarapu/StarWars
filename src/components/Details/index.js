import {useState, useEffect} from 'react'
import './index.css'

const Details = ({url}) => {
  const [name, setName] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url)
      const data = await response.json()
      setName(data.name)
    }

    if (url) {
      fetchData()
    }
  }, [url])

  return <li className="dLi">{name}</li>
}

export default Details
