'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function SignIn() {
  const [error, setError] = useState('');

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

    return () => {
      authListener?.subscription.unsubscribe();
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
      {/* Logo Section */}
      <div className="w-full py-8 flex justify-center">
        <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center justify-center">
          
          <img src="/logos/logo.png" alt="AI Tutor Logo" className="w-24 h-24 object-contain" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 mt-8">
        <div className="max-w-4xl text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Learn AI with AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Choose your favorite character to learn AI whether its Iron Man or Malar teacher
          </p>

          {/* Sign In Button */}  {/* Sign In Section */}
          <div className="max-w-md mx-auto w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
              Start Your Journey
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
              Sign in with GitHub to begin your AI engineering adventure
            </p>

            {error && (
              <div className="text-red-500 text-sm text-center mb-4 bg-red-50 dark:bg-red-900/30 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleGithubSignIn}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              Sign in with GitHub
            </button>
          </div>
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            {[
              {
                title: 'Character-Based Learning',
                description: 'Pick your favorite character as your AI mentor for a unique learning experience'
              },
              {
                title: 'Interactive Conversations',
                description: 'Learn through natural dialogues with AI characters who match your style'
              },
              {
                title: 'Personalized Journey',
                description: 'Get explanations that resonate with you, from characters you love'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

        
        </div>
      </div>
    </div>
  );
}
