import { useState } from 'react'

const Button = ({text, onClick}) => {
  return (
    <button onClick={onClick}>{text}</button>
  );
}

const Feedback = ({addToGoodCount, addToNeutralCount, addToBadCount}) => {
  return (
    <>
      <Button text="good" onClick={addToGoodCount} />
      <Button text="neutral" onClick={addToNeutralCount} />
      <Button text="bad" onClick={addToBadCount} />
    </>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({goodCount, neutralCount, badCount}) => {
  let sumCount = goodCount + neutralCount + badCount;
  if (sumCount > 0) {
    let avgScore = (goodCount - badCount)/sumCount;
    let posPercent = (goodCount/sumCount)*100;
    return (
      <div>
        <table>
          <tbody>
            <StatisticLine text="good" value={goodCount} />
            <StatisticLine text="neutral" value={neutralCount} />
            <StatisticLine text="bad" value={badCount} />
            <StatisticLine text="all" value={sumCount} />
            <StatisticLine text="average" value={avgScore} />
            <StatisticLine text="positive" value={posPercent} />
          </tbody>
        </table>
      </div>
    )
  }
  return (
    <div>
      No feedback given.
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [goodCount, setGoodCount] = useState(0)
  const [neutralCount, setNeutralCount] = useState(0)
  const [badCount, setBadCount] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <Feedback 
        addToGoodCount={() => {setGoodCount(goodCount + 1)}}
        addToNeutralCount={() => {setNeutralCount(neutralCount + 1)}}
        addToBadCount={() => {setBadCount(badCount + 1)}}
      />
      <h1>statistics</h1>
      <Statistics 
        goodCount={goodCount} 
        neutralCount={neutralCount} 
        badCount={badCount}
      />
    </div>
  )
}

export default App