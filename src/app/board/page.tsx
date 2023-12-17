import Card from '@/components/Card/Card'
import CITIES from '@/core/data/constants/cities'

const BoardPage = () => {
  const startCity = CITIES[0]
  const citiesSample = CITIES.slice(1, 3)

  return (
    <main>
      <div className="c-board">
        <div className="c-board__center">
          <div className="c-board__center-card">
            <Card city={startCity} />
          </div>
          <div className="c-board__direction --left --row">
            {citiesSample.map((city, index) => (
              <Card key={index} city={city} />
            ))}
          </div>
          <div className="c-board__direction --right --row">
            {citiesSample.map((city, index) => (
              <Card key={index} city={city} />
            ))}
          </div>
          <div className="c-board__direction --top --column">
            {citiesSample.map((city, index) => (
              <Card key={index} city={city} />
            ))}
          </div>
          <div className="c-board__direction --bottom --column">
            {citiesSample.map((city, index) => (
              <Card key={index} city={city} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default BoardPage
