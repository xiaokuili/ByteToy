'use client';

import React from 'react';
import { FadeInAnimation } from './components/FadeInAnimation';
import { ScrollAnimation } from './components/ScrollAnimation';
import Navbar from './components/Navbar';
import AnimatedBox from './study/AnimatedBox';
import HeroSection from './components/HeroSection';
import FeaturesShowcase from './components/FeaturesShowcase';
import { robotoCondensed } from './fonts/font';
import SimpleSticky from './study/stickyDom';
const PlaceholderSection = ({ title, color }) => (
  <div
    style={{
      height: '100vh',
      background: color,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      textAlign: 'center',
    }}
  >
    <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{title}</h2>
    <p style={{ fontSize: '1.2rem', maxWidth: '600px' }}>
      This is some placeholder text for the {title}. You'll see this section animate in as you
      scroll down the page.
    </p>
  </div>
);

const CustomerShowcase = () => <PlaceholderSection title="Customer Showcase" color="#d0d0d0" />;
const IndustryApplications = () => (
  <PlaceholderSection title="Industry Applications" color="#c0c0c0" />
);
const ResourcesSection = () => <PlaceholderSection title="Resources Section" color="#b0b0b0" />;

function App() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturesShowcase />
    </div>
  );
}

export default App;
