import CITIES from '@/constants/cities'

const Home = () => {
  return (
    <main>
      <div className="board">
        {CITIES.map((city, index) => (
          <div key={index}>
            <span>{city.name}</span>
            <span> | pop: {city.population}</span>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Home
