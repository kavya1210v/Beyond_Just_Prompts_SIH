/**
 * Satellite Frame Canvas Generator & Multi-Spectral Filter Engine
 * Generates synthetic 640x640 INSAT-3D/3DR satellite frames and applies channel LUTs
 */

export type SpectralBand = 'TIR1' | 'GEOCOLOR' | 'WV' | 'VISIBLE';

export function generateSampleSatelliteFrame(
  type: 'positive_1' | 'positive_2' | 'negative_1' | 'negative_2',
  band: SpectralBand = 'TIR1'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background Ocean Base
  ctx.fillStyle = band === 'VISIBLE' ? '#0d1e38' : (band === 'WV' ? '#1a0b2e' : '#091322');
  ctx.fillRect(0, 0, 640, 640);

  if (type === 'positive_1' || type === 'positive_2') {
    // Cyclone Positive: Logarithmic spiral vortex
    const cx = type === 'positive_1' ? 335 : 305;
    const cy = type === 'positive_1' ? 305 : 285;
    const intensity = type === 'positive_1' ? 1.0 : 1.3;

    // Draw spiral rainbands
    const numArms = 4;
    for (let arm = 0; arm < numArms; arm++) {
      const armOffset = arm * (Math.PI * 2 / numArms);
      for (let theta = 0; theta < Math.PI * 4; theta += 0.05) {
        const r = 18 * Math.exp(0.24 * theta);
        if (r > 310) break;
        const x = cx + r * Math.cos(theta + armOffset);
        const y = cy + r * Math.sin(theta + armOffset);
        const puffRad = Math.max(8, Math.floor(10 + r / 16));

        // Color based on band
        let fillStyle = 'rgba(230, 240, 255, 0.45)';
        if (band === 'TIR1') {
          // Cold convective cloud tops: red/yellow/cyan Dvorak enhanced color curve
          if (r < 80) fillStyle = 'rgba(239, 68, 68, 0.85)'; // -75C coldest core (Red)
          else if (r < 140) fillStyle = 'rgba(245, 158, 11, 0.75)'; // -60C (Amber)
          else if (r < 220) fillStyle = 'rgba(6, 182, 212, 0.65)'; // -45C (Cyan)
          else fillStyle = 'rgba(224, 242, 254, 0.45)';
        } else if (band === 'WV') {
          fillStyle = r < 120 ? 'rgba(217, 70, 239, 0.75)' : 'rgba(99, 102, 241, 0.45)';
        } else if (band === 'GEOCOLOR') {
          fillStyle = 'rgba(255, 255, 255, 0.7)';
        }

        ctx.beginPath();
        ctx.arc(x, y, puffRad, 0, Math.PI * 2);
        ctx.fillStyle = fillStyle;
        ctx.fill();
      }
    }

    // Central Convective Core / Eyewall
    const coreGradient = ctx.createRadialGradient(cx, cy, 15, cx, cy, 110);
    if (band === 'TIR1') {
      coreGradient.addColorStop(0, 'rgba(147, 51, 234, 0.95)'); // Ultra cold top
      coreGradient.addColorStop(0.3, 'rgba(239, 68, 68, 0.9)');
      coreGradient.addColorStop(0.7, 'rgba(245, 158, 11, 0.8)');
      coreGradient.addColorStop(1, 'rgba(6, 182, 212, 0.2)');
    } else if (band === 'WV') {
      coreGradient.addColorStop(0, 'rgba(236, 72, 153, 0.95)');
      coreGradient.addColorStop(1, 'rgba(79, 70, 229, 0.1)');
    } else {
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
      coreGradient.addColorStop(1, 'rgba(255, 255, 255, 0.15)');
    }
    ctx.beginPath();
    ctx.arc(cx, cy, 115, 0, Math.PI * 2);
    ctx.fillStyle = coreGradient;
    ctx.fill();

    // Eye formation (darker center)
    const eyeRadius = Math.floor(14 * intensity);
    ctx.beginPath();
    ctx.arc(cx, cy, eyeRadius, 0, Math.PI * 2);
    ctx.fillStyle = band === 'TIR1' ? '#1e1b4b' : '#050c18';
    ctx.fill();

  } else if (type === 'negative_1') {
    // Cyclone Negative (Calm open ocean with scattered small cumulus)
    for (let i = 0; i < 70; i++) {
      const rx = (Math.sin(i * 99) * 0.5 + 0.5) * 600 + 20;
      const ry = (Math.cos(i * 47) * 0.5 + 0.5) * 600 + 20;
      const rw = 12 + (i % 15);
      const rh = 6 + (i % 8);
      ctx.beginPath();
      ctx.ellipse(rx, ry, rw, rh, 0, 0, Math.PI * 2);
      ctx.fillStyle = band === 'TIR1' ? 'rgba(125, 211, 252, 0.35)' : 'rgba(255, 255, 255, 0.35)';
      ctx.fill();
    }
  } else {
    // Cyclone Negative (Linear non-rotating monsoon trough cloud band)
    for (let x = 0; x < 640; x += 20) {
      const yBase = 260 + 50 * Math.sin(x / 80.0);
      for (let j = 0; j < 5; j++) {
        const px = x + (Math.sin(x + j) * 15);
        const py = yBase + (Math.cos(x * 2 + j) * 30);
        ctx.beginPath();
        ctx.arc(px, py, 22, 0, Math.PI * 2);
        ctx.fillStyle = band === 'TIR1' ? 'rgba(56, 189, 248, 0.45)' : 'rgba(240, 244, 250, 0.45)';
        ctx.fill();
      }
    }
  }

  // Telemetry HUD overlay on satellite frame
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(10, 10, 310, 48);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1;
  ctx.strokeRect(10, 10, 310, 48);

  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('INSAT-3D / 3DR SATELLITE (MULTI-SOURCE)', 18, 28);

  ctx.font = '10px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94a3b8';
  const bandLabel = band === 'TIR1' ? 'TIR-1 (10.8µm ENHANCED IR)' : (band === 'WV' ? 'WV (6.7µm WATER VAPOR)' : 'VISIBLE (0.65µm VIS)');
  const stateLabel = type.startsWith('positive') ? 'STATE: CYCLONE-POSITIVE' : 'STATE: CYCLONE-NEGATIVE';
  ctx.fillText(`640x640 | ${bandLabel}`, 18, 42);
  ctx.fillText(stateLabel, 18, 54);

  return canvas.toDataURL('image/png');
}
