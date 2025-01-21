import { ChangeEvent, useState } from 'react';
import { useChat } from 'ai/react';
import Tweet from './Tweet';
import styles from './tweetgenerator.module.css';

const TweetGenerator = () => {
  const [codeSnippet, setCodeSnippet] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [imageUrl, setImageUrl] = useState("");
  const [generateImage, setGenerateImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedTweet, setGeneratedTweet] = useState('');
  const [disableSubmitButton, setDisableSubmitButton] = useState(true);

  const { handleInputChange, handleSubmit } = useChat({
    api: '/api/gpt',
    onFinish: (message) => {
      setError('');

      let generatedTweetContent = message.content;
      // Remove hashtags from the generated tweet
      generatedTweetContent = generatedTweetContent?.replace(/#[\w]+/g, '');
      setGeneratedTweet(generatedTweetContent);
      
      if (generateImage && generatedTweetContent) {
        getImageData(generatedTweetContent).then();
      } else {
        setLoading(false);
      }
    },
    onError: (error) => {
      setError(`An error occurred calling the OpenAI API: ${error}`);
      setLoading(false);
    }
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setDisableSubmitButton(true);

    handleSubmit(event);
  };

  const getImageData = async (prompt: string) => {
    try {
      setLoading(true);
      setDisableSubmitButton(true);

      const response = await fetch('/api/dall-e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { imageUrl } = await response.json();
      setImageUrl(imageUrl);
      setError('');
    } catch (error) {
      setError(`An error occurred calling the DALL-E API: ${error}`);
    }
    setLoading(false);
    setDisableSubmitButton(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Generate your next coding tweet using AI</h1>
      </div>
      <form className={styles.form} onSubmit={onSubmit}>
        <label htmlFor="bioInput" className={styles.label}>1. Enter your code snippet.</label>
        <textarea
          id="bioInput"
          className={styles.textarea}
          rows={6}
          placeholder={`function greet(name) {
  return \`Hello, \${name}!\`;
}`}
          value={codeSnippet}
          onChange={(e) => {
            setCodeSnippet(e.target.value);
            handleInputChange({
              ...e,
              target: {
                ...e.target,
                value: `Generate a tweet about this ${language} code snippet:\n${e.target.value}`
              }
            });
            setDisableSubmitButton(false);
          }}
          disabled={loading}
        />

        <label htmlFor="vibeSelect" className={styles.label}>2. Select the programming language.</label>
        <select
          id="vibeSelect"
          className={styles.select}
          onChange={(e) => {
            const event = e as unknown as ChangeEvent<HTMLInputElement>;
            setLanguage(event.target.value);
            handleInputChange({
              ...event,
              target: {
                ...event.target,
                value: `Generate a tweet about this ${e.target.value} code snippet:\n${codeSnippet}`
              }
            });
            setDisableSubmitButton(false);
          }}
          disabled={loading}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>

        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="imageOption"
            className={styles.checkbox}
            checked={generateImage}
            onChange={(e) => setGenerateImage(e.target.checked)}
            disabled={loading}
          />
          <label htmlFor="imageOption" className={styles.checkboxLabel}>Generate an image with the tweet</label>
        </div>

        <button className={styles.button} type="submit" disabled={disableSubmitButton}>
          Generate your coding tweet →
        </button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {generatedTweet && <Tweet tweet={generatedTweet} imageSrc={imageUrl} />}
    </div>
  );
}

export default TweetGenerator;
