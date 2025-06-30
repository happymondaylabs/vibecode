import React from 'react';
import { Check, Zap, Heart } from 'lucide-react';

interface LandingSectionProps {
  onGetStarted: () => void;
}

export function LandingSection({ onGetStarted }: LandingSectionProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Headline */}
        <h2 className="text-5xl md:text-6xl font-black tracking-wider text-black mb-6">
          PAPER CARDS ARE DEAD.
          <br />
          <span className="text-white">WE BURIED THEM.</span>
        </h2>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl font-mono text-black mb-12 max-w-3xl mx-auto leading-relaxed">
          Stop embarrassing yourself with $8 paper. Custom video birthday cards that actually make people laugh, share, and remember you forever.
        </p>

        {/* Primary CTA */}
        <button
          onClick={onGetStarted}
          className="inline-block px-12 py-6 bg-black text-white font-black text-xl tracking-wider hover:text-orange-400 transition-all duration-200 transform hover:scale-105 shadow-xl mb-16"
        >
          START SENDING VIBES - $10
        </button>

        {/* Trust Indicators */}
        <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Check size={32} className="text-black" strokeWidth={3} />
            </div>
            <span className="font-black text-black text-lg tracking-wide">100% CUSTOM VIDEOS</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Zap size={32} className="text-orange-400" strokeWidth={3} />
            </div>
            <span className="font-black text-black text-lg tracking-wide">INSTANT VIDEO GENERATION</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Heart size={32} className="text-black" strokeWidth={3} />
            </div>
            <span className="font-black text-black text-lg tracking-wide">BETTER THAN PAPER CARDS</span>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-black text-white mb-2">10,000+</div>
            <div className="text-black font-mono tracking-wide">CARDS CREATED</div>
          </div>
          <div>
            <div className="text-4xl font-black text-black mb-2">98%</div>
            <div className="text-white font-mono tracking-wide">SATISFACTION RATE</div>
          </div>
          <div>
            <div className="text-4xl font-black text-white mb-2">24/7</div>
            <div className="text-black font-mono tracking-wide">INSTANT DELIVERY</div>
          </div>
        </div>
      </div>
    </section>
  );
}