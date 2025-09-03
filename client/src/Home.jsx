import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './App.css';

export default function Home() {
  const [url, setUrl] = useState('')
  const navigate = useNavigate(); 

  const handleURL = (event) => setUrl(event.target.value);

  async function handleSubmit() {
    if (url == '') {
      alert("Please enter a URL.");
      return;
    }
    // send url to the backend!
    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",                       // send a POST request (not GET)
        headers: { "Content-Type": "application/json" },  // tell server it's JSON
        body: JSON.stringify({ url }),        // data you're sending (the URL)
      });

      const data = await response.json();
      navigate("/result", { state: { analysis: data } });
      

    } catch (error) {
      console.error(error.message);
      return;
    }
  };

  return (
    <div>
      <h1>Fake-News Detector</h1>
      <p>
      As the internet evolves, more and more fake stories have come out to gain clicks and attention.<br />
      This website hopes to help more people detect what is real and what is fake, through AI.
      </p>
      <p>
        To get started, please paste your news URL below:
      </p>
      <input
        type="text"
        className='url-input'
        placeholder="Enter news article URL here.."
        value={url}
        onChange={handleURL}
      />
        <br></br><button onClick={handleSubmit} className="analyze-button">Analyze</button>

      <div className="info-section">
        <div className="info-card warning">
          <h3>Red Flags in Articles</h3>
          <ul>
            <li>Sensational or vague headlines</li>
            <li>No sources listed</li>
            <li>Biased or emotionally charged language</li>
          </ul>
        </div>
        <div className="info-card report">
          <h3>📢 Where to Report Misinformation</h3>
          <p>If you see fake news, report it! Make sure others don't fall for these stories.
          Below are some links to websites to report misinformation!</p>
          <ul>
            <li><a href="https://mediabiasfactcheck.com/">Media Bias/Fact Check</a></li>
            <li><a href="https://toolbox.google.com/factcheck/explorer">Google Fact Check</a></li>
          </ul>
        </div>
        <div className="info-card reminder">
          <h3>💡 Helpful Reminders</h3>
          <ul>
            <li>Cross-check sources</li>
            <li>Read past the headline</li>
            <li>Switch up search engines, Google's algorithm plays a big role in what you see!</li>
          </ul>
        </div>
      </div>

    </div>

  );
  
};
