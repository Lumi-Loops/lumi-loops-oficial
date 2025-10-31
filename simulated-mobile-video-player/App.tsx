import React, { useState } from 'react';
import MobileSimulator from './components/MobileSimulator';
import { SocialPlatform } from './types';
import { InstagramIcon } from './components/icons/InstagramIcon';
import { TiktokIcon } from './components/icons/TiktokIcon';
import { TwitterIcon } from './components/icons/TwitterIcon';
import { FacebookIcon } from './components/icons/FacebookIcon';
import { CloseIcon } from './components/icons/CloseIcon';
import { LinkedInIcon } from './components/icons/LinkedInIcon';
import { YoutubeIcon } from './components/icons/YoutubeIcon';
import { SnapchatIcon } from './components/icons/SnapchatIcon';
import { PlatformInfo } from './components/PlatformInfo';


const App: React.FC = () => {
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');

  const platforms: { name: SocialPlatform; icon: React.ReactNode }[] = [
    { name: 'instagram', icon: <InstagramIcon className="w-6 h-6" /> },
    { name: 'tiktok', icon: <TiktokIcon className="w-6 h-6" /> },
    { name: 'youtube', icon: <YoutubeIcon className="w-6 h-6" /> },
    { name: 'snapchat', icon: <SnapchatIcon className="w-6 h-6" /> },
    { name: 'twitter', icon: <TwitterIcon className="w-6 h-6" /> },
    { name: 'facebook', icon: <FacebookIcon className="w-6 h-6" /> },
    { name: 'linkedin', icon: <LinkedInIcon className="w-6 h-6" /> },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-screen-2xl mx-auto">
        <header className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-text-main">
            Social Media Video Simulator
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            An interactive tool to visualize how vertical videos are displayed across different social media platforms. Select a platform to see its specific UI and rendering characteristics.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-16 items-start">
          <div className="lg:w-5/12 flex flex-col items-center justify-center">
            <MobileSimulator platform={platform} />
          </div>
          
          <div className="w-full lg:w-7/12">
            <div className="flex flex-wrap items-center justify-start gap-3 bg-secondary/30 backdrop-blur-sm p-3 rounded-xl w-full mb-6">
              {platforms.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setPlatform(p.name)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    platform === p.name 
                      ? 'bg-primary text-primary-foreground scale-110 shadow-lg' 
                      : 'bg-secondary text-secondary-foreground hover:bg-muted'
                  }`}
                  aria-label={`Switch to ${p.name}`}
                >
                  {p.icon}
                </button>
              ))}
            </div>
            <PlatformInfo platform={platform} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;