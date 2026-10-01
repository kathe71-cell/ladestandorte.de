import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, X } from 'lucide-react';

interface Props {
  title?: string;
  subtitle?: string;
  link?: string;
  linkLabel?: string;
}

/**
 * FloatingCTABar
 * TEMPORÄR DEAKTIVIERT (POPUP = OFF).
 * Keine aktiven Timer, keine Scroll-Listener, keine DOM-Elemente / Overlays.
 * Kann später reaktiviert werden, sobald ein relevanter Conversion-Pfad vorliegt.
 */
export const FloatingCTABar: React.FC<Props> = () => {
  // POPUP = OFF (Vorerst deaktiviert - keine Timer, keine Scroll-Listener, kein DOM).
  // Kann bei Bedarf sofort reaktiviert werden.
  return null;
};

export default FloatingCTABar;
