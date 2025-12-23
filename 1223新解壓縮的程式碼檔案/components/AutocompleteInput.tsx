
import React, { useState, useEffect, useRef } from 'react';
import { searchCompanyNames } from '../services/geminiService';

interface AutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  onSelect?: (val: string) => void;
  placeholder: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ value, onChange, onSelect, placeholder }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    // Only search if length > 0 and user is typing
    if (value.trim().length > 0) {
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
      
      debounceTimer.current = window.setTimeout(async () => {
        setIsSearching(true);
        const results = await searchCompanyNames(value);
        if (results.length > 0) {
          setSuggestions(results);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
        setIsSearching(false);
      }, 600);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
    return () => {
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    };
  }, [value]);

  const selectItem = (name: string) => {
    onChange(name);
    setShowDropdown(false);
    setSelectedIndex(-1);
    if (onSelect) onSelect(name);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        selectItem(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center group">
        <div className="absolute left-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
          <i className="fas fa-search text-sm"></i>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowDropdown(false), 250)}
          placeholder={placeholder}
          className="w-full bg-slate-900/80 border border-slate-700/50 rounded-xl pl-11 pr-10 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white placeholder-slate-600 hover:bg-slate-800"
        />
        {isSearching && (
          <div className="absolute right-4">
             <i className="fas fa-circle-notch fa-spin text-indigo-500 text-sm"></i>
          </div>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-[100] w-full mt-3 bg-slate-900 border border-slate-700/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase border-b border-slate-800">建議公司名稱</div>
          {suggestions.map((name, index) => (
            <li
              key={index}
              className={`px-4 py-3.5 cursor-pointer flex items-center gap-3 transition-colors ${
                index === selectedIndex ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
              onMouseDown={() => selectItem(name)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${index === selectedIndex ? 'bg-white/20' : 'bg-slate-800'}`}>
                <i className="fas fa-building text-xs"></i>
              </div>
              <span className="font-medium">{name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
