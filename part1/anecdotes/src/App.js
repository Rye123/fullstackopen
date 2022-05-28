import { useState } from 'react';

const getRandomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const Button = ({text, onClick}) => {
  return (
    <button onClick={onClick}>{text}</button>
  );
}

const AnecdoteDisplay = ({anecdoteId, anecVotesArray, anecdotesArray}) => {
  return (
    <div>
      <div style={{minHeight: "3em"}} >{anecdotesArray[anecdoteId]}</div>
      <div>has {anecVotesArray[anecdoteId]} votes</div>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ];
   
  const [selectedAnecId, setSelectedAnecId] = useState(0);
  const [anecVotes, setAnecVotes] = useState(Array(anecdotes.length).fill(0)); // haha geddit anecdotes -> anecVOTES im hilarious i know

  const voteButtonClicked = () => () => {
    let anecVotesArrayCopy = [...anecVotes];
    anecVotesArrayCopy[selectedAnecId] += 1;
    setAnecVotes(anecVotesArrayCopy);
  };
  return (
    <div>
      <AnecdoteDisplay 
        anecdoteId={selectedAnecId} 
        anecVotesArray={anecVotes}
        anecdotesArray={anecdotes}
      />
      <Button
        text="vote"
        onClick={voteButtonClicked()}
      />
      <Button 
        text="next anecdote"
        onClick={() => {setSelectedAnecId(getRandomInRange(0, anecdotes.length))}}
      />
    </div>
  );
}

export default App;