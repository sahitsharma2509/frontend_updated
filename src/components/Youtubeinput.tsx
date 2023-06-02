import React, { useState } from "react";
import { sendYouTubeUrl } from '../common/data/uploadAPI'; // Adjust the import path to where your API functions are defined
import Input from '../components/bootstrap/forms/Input';
import Button from '../components/bootstrap/Button';

const YouTubeLinkInput = () => {
  const [link, setLink] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const validateYouTubeUrl = (url: string) => {
    const pattern = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return pattern.test(url);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (validateYouTubeUrl(value) || value === "") {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
    setLink(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValid) {
      try {
        const token = localStorage.getItem("access_token"); // fetch the token
        if (!token) {
          throw new Error('No access token found');
        }
        const data = await sendYouTubeUrl(link, token);
        setResponse(data);
        setError(null);  // Reset the error message when request is successful
      } catch (err: any) {
        setError(err.message);
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input type="url" value={link} onChange={handleInputChange} style={{ borderColor: isValid ? "" : "red" }}/>
      {!isValid && <div>Please enter a valid YouTube link.</div>}
      <button type="submit">Submit</button>
      {response && <div>Response: {JSON.stringify(response)}</div>}
      {error && <div>Error: {error}</div>}
    </form>
  );
};

export default YouTubeLinkInput;
