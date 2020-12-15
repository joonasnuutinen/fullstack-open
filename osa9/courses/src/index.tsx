import React from "react";
import ReactDOM from "react-dom";

interface CoursePart {
  name: string;
  exerciseCount: number;
}

const Header: React.FC<{ courseName: string }> = ({ courseName }) => <h1>{courseName}</h1>;

const Content: React.FC<{ courseParts: CoursePart[] }> = ({ courseParts }) => (
  <div>
    {courseParts.map(p =>
      <p key={p.name}>
        {p.name} {p.exerciseCount}
      </p>
    )}
  </div>
);

const Total: React.FC<{ courseParts: CoursePart[] }> = ({ courseParts }) => (
  <p>
    Number of exercises{" "}
    {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
  </p>
);

const App: React.FC = () => {
  const courseName = "Half Stack application development";
  const courseParts = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
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
