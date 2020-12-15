import React from "react";
import ReactDOM from "react-dom";

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBaseWithDescription extends CoursePartBase {
  description: string;
}

interface CoursePartOne extends CoursePartBaseWithDescription {
  name: "Fundamentals";
}

interface CoursePartTwo extends CoursePartBase {
  name: "Using props to pass data";
  groupProjectCount: number;
}

interface CoursePartThree extends CoursePartBaseWithDescription {
  name: "Deeper type usage";
  exerciseSubmissionLink: string;
}

interface CustomCoursePart extends CoursePartBaseWithDescription {
  name: "Test part";
  prize: string;
}

type CoursePart = CoursePartOne | CoursePartTwo | CoursePartThree | CustomCoursePart;

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Header: React.FC<{ courseName: string }> = ({ courseName }) => <h1>{courseName}</h1>;

const Part: React.FC<{ part: CoursePart }> = ({ part }) => {
  switch (part.name) {
    case 'Fundamentals':          
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>{part.description}</p>
        </div>
      );
    case 'Using props to pass data':
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>Group projects: {part.groupProjectCount}</p>
        </div>
      );
    case 'Deeper type usage':
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>{part.description}</p>
          <p>Submission link: <a href={part.exerciseSubmissionLink}>{part.exerciseSubmissionLink}</a></p>
        </div>
      );
    case 'Test part':
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>{part.description}</p>
          <p>Prize: {part.prize}</p>
        </div>
      );
    default:
      return assertNever(part);
  }
};

const Content: React.FC<{ courseParts: CoursePart[] }> = ({ courseParts }) => (
  <div>
    {courseParts.map(p => <Part key={p.name} part={p} />)}
  </div>
);

const Total: React.FC<{ courseParts: CoursePart[] }> = ({ courseParts }) => (
  <h2>
    Number of exercises{" "}
    {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
  </h2>
);

const App: React.FC = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev"
    },
    {
      name: "Test part",
      exerciseCount: 5,
      description: "Something new",
      prize: "Tesla Model S"
    }
  ];

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
