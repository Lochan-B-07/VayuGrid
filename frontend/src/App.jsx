import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ULBCommandDeskPage } from './pages/ULBCommandDeskPage';
import { CitizenReporterPage } from './pages/CitizenReporterPage';
import { CitizenViewPage } from './pages/CitizenViewPage';
import { PitchDeckPage } from './pages/PitchDeckPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<ULBCommandDeskPage />} />
      <Route path="/report" element={<CitizenReporterPage />} />
      <Route path="/citizen" element={<CitizenViewPage />} />
      <Route path="/pitch" element={<PitchDeckPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
