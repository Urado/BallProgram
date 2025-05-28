import React, { useState } from 'react';

interface SettingsModalProps {
  onClose: () => void;
  pauseAfterTime: number | null;
  setPauseAfterTime: (value: number | null) => void;
  theme: string;
  setTheme: (value: string) => void;
  availableThemes: string[];
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  pauseAfterTime,
  setPauseAfterTime,
  theme,
  setTheme,
  availableThemes,
}) => {
  const [time, setTime] = useState(pauseAfterTime ?? 0);
  const [playForever, setPlayForever] = useState(pauseAfterTime === null);

  const handleSave = () => {
    setPauseAfterTime(playForever ? null : time);
    onClose();
  };

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    padding: '20px',
    width: '300px',
  };

  const footerStyle: React.CSSProperties = {
    marginTop: '20px',
    textAlign: 'right',
  };

  return (
    <div style={modalStyle}>
      <h2>Settings</h2>

      <div style={{ marginBottom: '10px' }}>
        <label>
          <input type="radio" checked={playForever} onChange={() => setPlayForever(true)} />
          Play Forever
        </label>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          <input type="radio" checked={!playForever} onChange={() => setPlayForever(false)} />
          Pause After
        </label>
        {!playForever && (
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(Number(e.target.value))}
            style={{
              marginLeft: '10px',
              width: '60px',
            }}
          />
        )}
        <span> seconds</span>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="theme-select">Theme:</label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          style={{ marginLeft: '10px' }}
        >
          {availableThemes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div style={footerStyle}>
        <button onClick={onClose} style={{ marginRight: '10px' }}>
          Cancel
        </button>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default SettingsModal;
