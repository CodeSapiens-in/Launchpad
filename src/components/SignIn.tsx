'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function SignIn() {
  const [error, setError] = useState('');
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        localStorage.setItem('authToken', session.access_token);
        
        const user = session.user;
        if (user?.user_metadata) {
          localStorage.setItem('userProfile', JSON.stringify({
            name: user.user_metadata.full_name,
            avatar_url: user.user_metadata.avatar_url
          }));
        }
        
        window.location.href = '/';
      }
    });

    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      authListener?.subscription.unsubscribe();
      clearInterval(testimonialInterval);
    };
  }, []);

  const handleGithubSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/`,
          scopes: 'read:user'
        }
      });

      if (error) throw error;
    } catch (error) {
      setError('Error signing in with GitHub');
      console.error('GitHub sign in error:', error);
    }
  };

  // Sample testimonials data
  const testimonials = [
    {
      name: "Alex Chen",
      role: "AI Engineering Student",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Learning AI with my favorite sci-fi character as my guide made complex concepts actually fun to understand!"
    },
    {
      name: "Priya Sharma",
      role: "Data Science Enthusiast",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "The 4-week curriculum is perfectly paced. I went from AI novice to building my own models in no time."
    },
    {
      name: "Marcus Johnson",
      role: "Computer Science Major",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      text: "Having Iron Man explain neural networks to me was both entertaining and incredibly effective!"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 font-sans">
      {/* Navigation */}
      <nav className="w-full py-4 px-6 flex justify-between items-center bg-white/10 backdrop-blur-lg border-b border-white/20 dark:border-gray-800/30">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <img src="/logos/logo.png" alt="AI Tutor Logo" className="w-8 h-8 object-contain" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">AI Tutor</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="w-full py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 animate-pulse"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            Learn AI, Your Way—With Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Favorite Characters!</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            A structured 4-week AI learning program where you choose a character to guide you through the journey.
          </p>
        </div>
      </div>

      {/* Sign In Section */}
      <div className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-md">
          <Card className="max-w-md mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-white/50 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Start Your Journey</CardTitle>
            <CardDescription className="text-center">Sign in with GitHub to begin your AI engineering adventure</CardDescription>
          </CardHeader>
          <CardContent>

          {error && (
            <div className="text-red-500 text-sm text-center mb-4 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg">
              {error}
            </div>
          )}

            <Button
              onClick={handleGithubSignIn}
              className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-black hover:to-gray-800"
            >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            Sign in with GitHub
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials Section */}
      <div className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">What Our Students Say</h2>
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="w-full flex-shrink-0 px-4 bg-white dark:bg-gray-700 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <img src={testimonial.image} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-blue-500" />
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{testimonial.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 italic">{testimonial.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 p-0 rounded-full ${activeTestimonial === index ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  aria-label={`View testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <img src="/logos/logo.png" alt="AI Tutor Logo" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-lg font-bold">AI Tutor</span>
          </div>
          <div className="flex space-x-6">
            <Button variant="link" className="text-white hover:text-blue-400">About</Button>
            <Button variant="link" className="text-white hover:text-blue-400">Contact</Button>
            <Button variant="link" className="text-white hover:text-blue-400">Privacy</Button>
            <Button variant="link" className="text-white hover:text-blue-400">Terms</Button>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" aria-label="Twitter">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg>
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" aria-label="GitHub">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
            </Button>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} AI Tutor. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
