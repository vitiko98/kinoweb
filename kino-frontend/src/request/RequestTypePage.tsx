import React, { useState, useEffect, useCallback} from 'react';
import { searchMedia, getFrame, searchQuote } from './RequestAPI';
import { FaTrash, FaSearch } from 'react-icons/fa';
import './RequestTypePage.css';

interface Frame {
    frame_id: number,
    media: Media,
    timestamp: number // In milliseconds,
    preview_url?: string,
    quote?: string
}

interface Media {
  id: number;
  title: string;
  type: string; // movie, tv, or anime
}

interface Suggestion {
  media_id: number,
  timestamp: number,
  quote: string
}

const RequestTypePage = () => {
  const [mediaSearchQuery, setMediaSearchQuery] = useState('');
  const [searchResults, setMediaSearchResults] = useState<Media[]>([]);
  const [quoteSearchQuery, setQuoteSearchQuery] = useState('');
  const [quoteSearchResults, setQuoteSearchResults] = useState<Suggestion[]>([]);
  const [isMediaSearchMenuVisible, setisMediaSearchMenuVisible] = useState(false);
  const [frameContainerItems, setFrameContainerItems] = useState<Frame[]>([]);
  const [kinoCommand, setKinoCommand] = useState<string>('');
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [selectedFrameItem, setSelectedFrameItem] = useState<Frame | null>(null);
  const [frameImage, setFrameImage] = useState<string>('');

  const handleQuoteSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuoteSearchQuery(e.target.value);
  }, []);

  const FrameOverlay = ({ item, onClose }: { item: Frame; onClose: () => void }) => (
    <div className="overlay">
      <div className="overlay-content">
        <div className="overlay-header">
          <button className="close-button" onClick={onClose}>X</button>
        </div>
        <div className="image-container">
          <img src={item.preview_url} className="overlay-image" />
        </div>
        <div className="settings-container">
          <div className="search-menu-wrapper">
            <div className="search-menu-bar">
            <FaSearch id="search-icon" />
              <input type="text" placeholder="Search quote" value={quoteSearchQuery} onChange={handleQuoteSearchChange}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const generateCommand = () => {
    if (frameContainerItems.length === 0) {
        setKinoCommand("");
        return;
    }
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
    const media = frameContainerItems[0].media;
    command += "!freq " + media.title;
    if (frameContainerItems.length > 1) {
      for (const frame of frameContainerItems) {
        const formattedTimestamp = new Date(frame.timestamp).toISOString().substr(11, 8);
        command += "[" + formattedTimestamp + "]";
      }
    }
  } else {
    command += "!fparallel ";
    for (const frame of frameContainerItems) {
      command += frame.media.title + " | ";
      }
}
// remove trailing |
if (command.charAt(command.length - 2) == "|") {
    command = command.slice(0, -3);
}

setKinoCommand(command);
  };

  const getFramePreview = async (frame: Frame): Promise<string> => {
    try {
      const frameImage = await getFrame(frame.media.id, frame.timestamp);
      frame.preview_url = frameImage.url;
      setFrameContainerItems([...frameContainerItems]);
      return frameImage.url; // Return the preview URL
    } catch (error) {
      console.error('Error fetching frame image:', error);
      return ''; // Return an empty string or handle the error as needed
    }
  }

  const handleResultClick = async (result: Media) => {
    if (frameContainerItems.length >= 15) {
        alert('You can only have up to 15 frames');
        return;
    }

    const len = frameContainerItems.length;
    const id = frameContainerItems[len - 1] ? frameContainerItems[len - 1].frame_id + 1 : 0;

    try {
        const preview_url = await getFramePreview({ frame_id: id, media: result, timestamp: 0 });
        const frame = {
            frame_id: id,
            media: result,
            timestamp: 0,
            preview_url: preview_url
        };
        setFrameContainerItems([...frameContainerItems, frame]);
    } catch (error) {
        console.error('Error generating frame preview:', error);
    }
};

  // Debounce function to limit the rate of API calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: number;
    return (...args: any[]) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Function to handle search
  const handleMediaSearch = async (query: string) => {
    if (query && query.length > 1) {
      try {
        const results = await searchMedia(query);
        setMediaSearchResults(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setMediaSearchResults([]);
    }
  };

  const handleQuoteSearch = async (id: number, query: string) => {
    if (query && query.length > 1) {
      try {
        const results = await searchQuote(id, query);
        setQuoteSearchResults(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    } else {
      setQuoteSearchResults([]);
    }
  }

  // Debounced version of handleMediaSearch
  const debouncedMediaSearch = debounce(handleMediaSearch, 300);
  const debouncedQuoteSearch = debounce(handleQuoteSearch, 300);

  // useEffect to trigger search on searchQuery change
  useEffect(() => {
    debouncedMediaSearch(mediaSearchQuery);
  }, [mediaSearchQuery]);

  useEffect(() => {
    debouncedQuoteSearch(selectedFrameItem?.media.id, quoteSearchQuery);
  }, [quoteSearchQuery]);

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
            <div className="preview-container" onClick={() => {setSelectedFrameItem(item); setIsOverlayVisible(true)}}>
            <img src={item.preview_url} className="frame-image"/>
            </div>
            <button className='remove-button' onClick={() => setFrameContainerItems(frameContainerItems.filter((frame) => frame.frame_id !== item.frame_id))}>
              <FaTrash />
            </button>
          </div>
        ))}
        <div className="add-frame-container">
      <button className="add-frame" onClick={() => setisMediaSearchMenuVisible(!isMediaSearchMenuVisible)}>
        Add Frame
      </button>
      {isMediaSearchMenuVisible && (
        <div className="search-menu-wrapper">
          <div className="search-menu-bar">
            <FaSearch id="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Title"
              value={mediaSearchQuery}
              onChange={(e) => setMediaSearchQuery(e.target.value)}
            />
          </div>
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((result) => (
                <div key={result.id} className="search-result-item" onClick={() => handleResultClick(result)}>
                  <p>{result.title} ({result.type.charAt(0).toUpperCase() + result.type.slice(1)})</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
      </div>
      {isOverlayVisible && selectedFrameItem && (
        <FrameOverlay item={selectedFrameItem} onClose={() => setIsOverlayVisible(false)} />
      )}
    </div>
  );
};

export default RequestTypePage;