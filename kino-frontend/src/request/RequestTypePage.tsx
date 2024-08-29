import React, { useState, useEffect} from 'react';
import { searchMedia } from './RequestAPI';
import { FaSearch } from 'react-icons/fa';
import './RequestTypePage.css';

interface Frame {
    frame_id: number,
    media: Media,
    timestamp: number
}

interface Media {
  id: string;
  title: string;
  type: string;
}

const RequestTypePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [isSearchMenuVisible, setIsSearchMenuVisible] = useState(false);
  const [frameContainerItems, setFrameContainerItems] = useState<Frame[]>([]);
  const [kinoCommand, setKinoCommand] = useState<string>('');

  const generateCommand = () => {
    const media = frameContainerItems[0].media;
    let command = "";
    let isSameMedia = true;
    for (const frame of frameContainerItems) {
      // Set isSameMedia to false if there is more than one title in the frameContainerItems
        if (frame.media.title !== frameContainerItems[0].media.title) {
            isSameMedia = false;
            break;
        }
  }
  if (isSameMedia) {
    command += "!freq " + media.title + " ";
    
  } else {
    command += "!fparallel " + media.title + " ";
  
}
setKinoCommand(command);
  };

  const handleResultClick = (result: Media) => {
    if (frameContainerItems.length >= 15) {
        alert('You can only have up to 15 frames');
        return;
    }
    const len = frameContainerItems.length;
    const id = frameContainerItems[len - 1] ? frameContainerItems[len - 1].frame_id + 1 : 0;
    const frame = {
        frame_id: id,
        media: result
    }
    setFrameContainerItems([...frameContainerItems, frame]);
    };

  // Debounce function to limit the rate of API calls
  const debounce = (func, delay: number) => {
    let timeoutId: number;
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
  const handleSearch = async (query: string) => {
    if (query && query.length > 1) {
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
        <div>
            <p className="command-container"> {kinoCommand}  </p>
            <button onClick={() => generateCommand()}>Generate Command</button>
        </div>
        <h1>Frames</h1>
        <div className="frame-container">
        {frameContainerItems.map((item) => (

          <div key={item.media.id} className="frame-item">
            <p>{item.media.title}</p>
            <input className="quote-search-bar" type="text" placeholder="Search quote" />
            <button onClick={() => setFrameContainerItems(frameContainerItems.filter((frame) => frame.frame_id !== item.frame_id))}>
              Remove
            </button>
          </div>
        ))}
        <div className="add-frame-container">
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
                <div key={result.id} className="search-result-item" onClick={() => handleResultClick(result)}>
                  <p>{result.title}, {result.type.charAt(0).toUpperCase() + result.type.slice(1)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
      </div>
    </div>
  );
};

export default RequestTypePage;
