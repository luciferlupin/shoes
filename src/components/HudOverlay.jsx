import React, { useEffect, useState } from 'react';
import { playHoverSound, playClickSound, toggleMute, getMuted } from '../utils/audio';

export default function HudOverlay({
  mousePos,
  activeProduct,
  viewAngle,
  onSelectViewAngle,
  isExploded,
  onToggleExploded,
  isAutoRotate,
  onToggleAutoRotate,
  lightMode,
  onSelectLightMode
}) {
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [logIndex, setLogIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(getMuted());

  // Update terminal logs dynamically when product changes
  useEffect(() => {
    setTerminalLogs([]);
    setLogIndex(0);
  }, [activeProduct]);

  useEffect(() => {
    if (activeProduct.techLog && logIndex < activeProduct.techLog.length) {
      const timeout = setTimeout(() => {
        setTerminalLogs(prev => [...prev, activeProduct.techLog[logIndex]]);
        setLogIndex(prev => prev + 1);
        playHoverSound();
      }, 650);
      return () => clearTimeout(timeout);
    }
  }, [logIndex, activeProduct]);

  const handleMuteToggle = () => {
    const nextMuted = toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) playClickSound();
  };

  const viewModes = [
    { id: 'hero', label: 'HERO 3/4', icon: '📐' },
    { id: 'side', label: 'SIDE', icon: '👟' },
    { id: 'top', label: 'TOP DOWN', icon: '🔍' },
    { id: 'sole', label: 'SOLE TREAD', icon: '⚡' },
    { id: 'heel', label: 'HEEL LOCK', icon: '🛡️' }
  ];

  return (
    <div className="hud-container">
      {/* Top Border HUD */}
      <div className="hud-top-bar">
        <div className="hud-brand" onMouseEnter={playHoverSound}>
          <span className="brand-logo">DODD</span>
          <span className="hud-divider">//</span>
          <span className="brand-sub">AERO LAB R&D</span>
          <span className="edition-badge">{activeProduct.concept}</span>
        </div>

        {/* Cinematic View Angle Presets Toolbar */}
        <div className="hud-view-presets">
          {viewModes.map((v) => (
            <button
              key={v.id}
              className={`view-preset-btn ${viewAngle === v.id && !isExploded ? 'active' : ''}`}
              onClick={() => {
                playClickSound();
                if (isExploded) onToggleExploded(false);
                onSelectViewAngle(v.id);
              }}
              onMouseEnter={playHoverSound}
              title={`View ${v.label}`}
            >
              <span className="preset-icon">{v.icon}</span>
              <span className="preset-text">{v.label}</span>
            </button>
          ))}

          {/* Exploded Deconstruct Toggle Button */}
          <button
            className={`view-preset-btn explode-btn ${isExploded ? 'active-explode' : ''}`}
            onClick={() => {
              playClickSound();
              onToggleExploded(!isExploded);
            }}
            onMouseEnter={playHoverSound}
            title="Toggle 3D Exploded Deconstruct View"
          >
            <span className="preset-icon">💥</span>
            <span className="preset-text">EXPLODED</span>
          </button>
        </div>

        {/* Utility Controls (Auto-Spin, Lighting, Audio) */}
        <div className="hud-status">
          {/* Auto Rotate Button */}
          <button 
            className={`hud-icon-btn ${isAutoRotate ? 'btn-active' : ''}`}
            onClick={() => {
              playClickSound();
              onToggleAutoRotate(!isAutoRotate);
            }}
            onMouseEnter={playHoverSound}
            title="Toggle Turntable Auto Spin"
          >
            <span className="icon-symbol">↻</span>
            <span className="icon-text">{isAutoRotate ? 'SPINNING' : 'AUTO SPIN'}</span>
          </button>

          {/* Lighting Mode Selector */}
          <div className="lighting-toggle-group">
            <button
              className={`light-btn ${lightMode === 'studio' ? 'active' : ''}`}
              onClick={() => {
                playClickSound();
                onSelectLightMode('studio');
              }}
              title="Daylight Studio Lighting"
            >
              ☀️
            </button>
            <button
              className={`light-btn ${lightMode === 'cyberpunk' ? 'active' : ''}`}
              onClick={() => {
                playClickSound();
                onSelectLightMode('cyberpunk');
              }}
              title="Cyberpunk Neon Mode"
            >
              🟣
            </button>
            <button
              className={`light-btn ${lightMode === 'noir' ? 'active' : ''}`}
              onClick={() => {
                playClickSound();
                onSelectLightMode('noir');
              }}
              title="Stealth Noir Mode"
            >
              🌑
            </button>
          </div>

          {/* Audio Mute/Unmute */}
          <button 
            className="hud-icon-btn audio-btn"
            onClick={handleMuteToggle}
            onMouseEnter={playHoverSound}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          <div className="status-indicator">
            <span className="status-dot"></span>
            <span className="status-text">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Side HUD Lines and Technical Specs Telemetry */}
      <div className="hud-side-left">
        <div className="hud-coordinate-label">40.7128° N, 74.0060° W</div>
        <div className="hud-vertical-line"></div>
        <div className="hud-spec-tag">MATERIAL // {activeProduct.specs.material || 'FULL GRAIN'}</div>
        <div className="hud-spec-tag">CUSHION // {activeProduct.specs.cushioning}</div>
        <div className="hud-spec-tag">WEIGHT // {activeProduct.specs.weight}</div>
      </div>

      <div className="hud-side-right">
        <div className="hud-coordinate-label">REF: {activeProduct.id.toUpperCase()}</div>
        <div className="hud-vertical-line"></div>
        <div className="hud-spec-tag">TRACTION // {activeProduct.specs.traction}</div>
        <div className="hud-spec-tag">PROPULSION // {activeProduct.specs.propulsion}</div>
        <div className="hud-spec-tag">FLEX // {activeProduct.specs.flexibility}</div>
      </div>

      {/* Bottom HUD bar */}
      <div className="hud-bottom-bar">
        {/* Terminal logs in bottom left */}
        <div className="hud-terminal" onMouseEnter={playHoverSound}>
          <div className="terminal-header">
            <span>R&D SPECIMEN LOGS</span>
            <span className="terminal-pulse"></span>
          </div>
          <div className="terminal-body">
            {terminalLogs.map((log, index) => (
              <div key={index} className="terminal-line">
                <span className="terminal-prompt">&gt;</span> {log}
              </div>
            ))}
            {logIndex < (activeProduct.techLog?.length || 0) && (
              <div className="terminal-line terminal-typing">
                <span className="terminal-prompt">&gt;</span> SCANNING GEOMETRIC MESH<span className="cursor">_</span>
              </div>
            )}
          </div>
        </div>

        {/* Engineering Credit in bottom center */}
        <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontFamily: "monospace" }}>
          ENGINEERED BY <a href="https://www.curiouskaizer.com/" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline" }} title="Curious Kaizer - Web Development Company in Delhi">CURIOUS KAIZER</a>
        </div>

        {/* Mouse coordinates tracking in bottom right */}
        <div className="hud-coordinates" onMouseEnter={playHoverSound}>
          <div className="coordinate-block">
            <span className="coord-label">TARGET X:</span>
            <span className="coord-val">{Math.round(mousePos.x)}px</span>
          </div>
          <div className="coordinate-block">
            <span className="coord-label">TARGET Y:</span>
            <span className="coord-val">{Math.round(mousePos.y)}px</span>
          </div>
          <div className="hud-crosshair">+</div>
        </div>
      </div>
    </div>
  );
}
