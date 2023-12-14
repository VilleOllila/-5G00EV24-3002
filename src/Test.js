import { useRef, useState } from "react";
const {
  TextAnalyticsClient,
  AzureKeyCredential,
} = require("@azure/ai-text-analytics");

const Test = () => {
  const textRef = useRef();
  const [results, setResults] = useState([]);

  const key = process.env.REACT_APP_LANGUAGE_KEY;
  const endpoint = process.env.REACT_APP_LANGUAGE_ENDPOINT;

  const client = new TextAnalyticsClient(endpoint, new AzureKeyCredential(key));

  const handleClick = async () => {
    const documents = [
      {
        text: textRef.current.value,
        id: "0",
        language: "en",
      },
    ];

    console.log(documents[0].text);

    const analysisResults = await client.analyzeSentiment(documents, {
      includeOpinionMining: true,
    });

    console.log(analysisResults);
    setResults(analysisResults);
  };

  return (
    <div>
      <div>
        <textarea maxLength={100} ref={textRef} required></textarea>
      </div>
      <div>
        <button onClick={handleClick}>Sentiment analysis</button>
      </div>
      <div>
        {results.map((result) => (
          <div key={result.id}>
            <h2>Overall Sentiment: {result.sentiment}</h2>
            <h4>Sentiment confidence scores:</h4>
            <ul>
              <li>Positive: {result.confidenceScores.positive}</li>
              <li>Neutral: {result.confidenceScores.neutral}</li>
              <li>Negative: {result.confidenceScores.negative}</li>
            </ul>
            {result.sentences.map(
              ({ sentiment, confidenceScores, opinions, text }, index) => (
                <div key={index}>
                  <h4>Sentence: {text} </h4>
                  <p>Sentence sentiment: {sentiment}</p>
                  <p>Confidence scores:</p>
                  <ul>
                    <li>Positive: {confidenceScores.positive}</li>
                    <li>Neutral: {confidenceScores.neutral}</li>
                    <li>Negative: {confidenceScores.negative}</li>
                  </ul>
                  {opinions.map(({ assessments }, opinionIndex) => (
                    <div key={opinionIndex}>
                      <h5>Target assessments:</h5>
                      {assessments.map(
                        ({ text, sentiment }, assessmentIndex) => (
                          <div key={assessmentIndex}>
                            <p>Text: {text}</p>
                            <p>Sentiment: {sentiment}</p>
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Test;
