
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="text-white text-lg font-medium">Company</h2>
            <p className="text-sm">
              Advanced AI-powered trading insights and analysis for the modern trader.
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h2 className="text-white text-lg font-medium mb-4">Company</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              </li>
              <li>
                <a href="/download" className="hover:text-white transition-colors">Download</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-white text-lg font-medium mb-4">Resources</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/academy" className="hover:text-white transition-colors">Academy</Link>
              </li>
              <li>
                <Link to="/docs" className="hover:text-white transition-colors">Documentation</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-white text-lg font-medium mb-4">Legal</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              </li>
              <li>
                <Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} InsightFlow AI Trading. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="/terms" className="text-sm text-gray-400 hover:text-blue-400">
              Terms
            </a>
            <a href="/privacy" className="text-sm text-gray-400 hover:text-blue-400">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-blue-400">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
