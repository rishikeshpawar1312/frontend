import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

 interface ApiResponse {
  is_success: boolean;
  user_id: string;
  email: string;
  roll_number: string;
  numbers: string[];
  alphabets: string[];
  highest_lowercase_alphabet: string[];
  is_prime_found: boolean;
}

function App() {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
       const parsedInput = JSON.parse(jsonInput);
      
       const apiResponse = await axios.post('https://backend-production-4e77.up.railway.app/bfhl', parsedInput);
      setResponse(apiResponse.data);
    } catch (err) {
      setError('Invalid JSON or API error');
      console.error(err);
    }
  };

  const filterResponse = () => {
    if (!response) return null;

    const filteredResponse: Partial<ApiResponse> = {};
    selectedFilters.forEach(filter => {
      switch(filter) {
        case 'Alphabets':
          filteredResponse.alphabets = response.alphabets;
          break;
        case 'Numbers':
          filteredResponse.numbers = response.numbers;
          break;
        case 'Highest lowercase alphabet':
          filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
          break;
      }
    });

    return filteredResponse;
  };

  return (
    <div className="app-container">
      <header>
        <h1>0827CI211156</h1>
      </header>
      
      <main>
        <form onSubmit={handleSubmit} className="input-form">
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Enter JSON: {"data": ["A","1","B"]}'
            rows={5}
            className="json-input"
          />
          <button type="submit" className="submit-btn">Submit</button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="filter-section">
          <h3>Filter Response</h3>
          <select 
            multiple 
            className="filter-select"
            onChange={(e) => 
              setSelectedFilters(
                Array.from(e.target.selectedOptions, option => option.value)
              )
            }
          >
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
        </div>

        {response && (
          <div className="response-section">
            <h3>Response</h3>
            <pre className="response-pre">
              {JSON.stringify(filterResponse(), null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;