import {useState, useEffect} from 'react'

const Films = ({url}) => {
  const [title, setTitle] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(url)
      const data = await response.json()
      setTitle(data.title)
    }

    if (url) {
      fetchData()
    }
  }, [url])

  return <li className="dLi">{title}</li>
}

export default Films
