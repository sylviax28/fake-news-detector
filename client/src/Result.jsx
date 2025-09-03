import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './App.css';

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const analysis = location.state?.analysis;

  if (!analysis) {
    return (
      <div>
        <h2>No analysis data available.</h2>
        <button onClick={() => navigate("/")}>Back</button>
      </div>
    );
  }

  let reasonsArray = [];
  if (analysis.reasons && analysis.reasons.length > 0) {
    for (let i = 0; i < analysis.reasons.length; i++) {
      const reason = analysis.reasons[i].replace(/^-+\s*/, ""); // remove any leading "-"
      reasonsArray.push(<li key={i}>{reason}</li>);
    }
  }

  let verdictClass = 'verdict';
  if (analysis.verdict === 'FAKE') {
    verdictClass += ' fake';
  } else {
    verdictClass += ' real';
  }

  return (
    <div className="resultContainer">
      <h2>Analysis Result</h2>
      <h1 className={verdictClass}>{analysis.verdict}</h1>
      <p>{analysis.score}</p>

      {reasonsArray.length > 0 && (
        <div>
          <h3>Reasons:</h3>
          <p>{reasonsArray}</p>
        </div>
      )}

      <button onClick={() => navigate("/")}>Back</button>
    </div>
  );
};

export default Result;
