import React, { useState, useEffect } from 'react';
import { searchMedia } from '../request/RequestAPI';
import { FaSearch } from 'react-icons/fa';
import './RequestTypePage.css';

interface Media {
  id: string;
  title: string;
  type: string;
}

const RequestTypePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [isSearchMenuVisible, setIsSearchMenuVisible] = useState(false);

  // Debounce function to limit the rate of API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Function to handle search
  const handleSearch = async (query) => {
    if (query) {
      try {
        const results = await searchMedia(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Debounced version of handleSearch
  const debouncedSearch = debounce(handleSearch, 300);

  // useEffect to trigger search on searchQuery change
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery]);

  return (
    <div>
      <button className="add-frame" onClick={() => setIsSearchMenuVisible(!isSearchMenuVisible)}>
        Add Frame
      </button>
      {isSearchMenuVisible && (
        <div className="search-menu-wrapper">
          <div className="search-menu-bar">
            <FaSearch id="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result) => (
                <div key={result.id} className="search-result-item">
                  <p>{result.title}, {result.type.charAt(0).toUpperCase() + result.type.slice(1)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestTypePage;
