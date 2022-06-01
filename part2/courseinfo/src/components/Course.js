import React from 'react'

const Header = (props) => {
    return (
        <h1>{props.course}</h1>
    )
}
  
const Part = ({name, exercises}) => {
    return (
      <p>
        {name} {exercises}
      </p>
    )
}
  
const Content = ({parts}) => {
    return (
      <>
        {parts.map(part =>
          <Part key={part.id} name={part.name} exercises={part.exercises} />
        )}
        
      </ >
    )
}
  
const Total = ({parts}) => {
    return (
      <b>total of {parts.map(part => {
        // extract exercises
        return parseInt(part.exercises);
      }).reduce((p, c) => {
        // get sum
        return p + c;
      }, 0)} exercises</b>
    )
}
  
const Course = ({course}) => {
  
    return (
      <div>
        <Header course={course.name}/>
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
}

export default Course;