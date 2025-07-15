
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import Navbar from '../components/layout/Navbar';
import { ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="relative">
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-float">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-8">
                Shorten URLs
                <br />
                <span className="text-4xl md:text-6xl">Track Everything</span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create short, trackable links with powerful analytics. 
              Perfect for marketing campaigns, social media, and professional use.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
              <Link to="/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/80 neon-glow px-8 py-4 text-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="glass glass-hover border-white/20 text-white px-8 py-4 text-lg">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Demo URL Shortener */}
            <div className="glass p-8 rounded-2xl max-w-2xl mx-auto neon-glow-blue">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="url"
                  placeholder="https://your-long-url.com/very/long/path"
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  disabled
                />
                <Button disabled className="bg-purple-600 hover:bg-purple-700 px-6 py-3">
                  Shorten URL
                </Button>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                Sign up to start shortening URLs and tracking analytics
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white">
              Powerful Features
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass p-8 rounded-2xl text-center glass-hover neon-glow">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Lightning Fast</h3>
                <p className="text-gray-300">
                  Generate short URLs instantly with our optimized infrastructure and global CDN.
                </p>
              </div>

              <div className="glass p-8 rounded-2xl text-center glass-hover neon-glow-blue">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Advanced Analytics</h3>
                <p className="text-gray-300">
                  Track clicks, locations, devices, and more with detailed analytics and real-time monitoring.
                </p>
              </div>

              <div className="glass p-8 rounded-2xl text-center glass-hover neon-glow-cyan">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Secure & Reliable</h3>
                <p className="text-gray-300">
                  Enterprise-grade security with JWT authentication and admin approval system.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass p-12 rounded-2xl neon-glow">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of users who trust our platform for their URL shortening needs.
              </p>
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-12 py-4 text-lg">
                  Create Account Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
