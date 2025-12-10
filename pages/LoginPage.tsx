import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Anchor, Lock, Bug } from 'lucide-react';
import { User } from '../types';
import { MOCK_USER } from '../constants';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authStage, setAuthStage] = useState<'idle' | 'redirecting' | 'validating'>('idle');
  const [error, setError] = useState<string | null>(null);

  // --- 1. Ticket Validation Logic ---
  // In a real CAS flow, the CAS server redirects back to this page with ?ticket=ST-XXXXX
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ticket = params.get('ticket');

    if (ticket) {
      setAuthStage('validating');
      
      // SIMULATION: In real app, you would fetch your backend:
      // await fetch(`/api/auth/validate?ticket=${ticket}`)
      
      const timer = setTimeout(() => {
        // Mock successful validation returning a user
        const ssoUser: User = {
          id: 'vims-' + Math.random().toString(36).substr(2, 9),
          name: 'VIMS Staff Member',
          email: 'staff@vims.edu',
          department: 'Marine Science'
        };
        
        onLogin(ssoUser);
        navigate('/');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [location, onLogin, navigate]);


  // --- 2. Button Handlers ---

  const handleRealSSO = () => {
    setAuthStage('redirecting');
    setError(null);

    // CURRENT URL (Service URL)
    // We need the full URL to tell CAS where to send the user back to.
    // In HashRouter, it's tricky, but usually we just send them to the base page 
    // and handle the ticket there.
    const serviceUrl = window.location.origin + window.location.pathname + '#/login';
    
    // REAL VIMS CAS URL (Example)
    // const casLoginUrl = `https://cas.wm.edu/login?service=${encodeURIComponent(serviceUrl)}`;
    
    // SIMULATION:
    // Since we don't have a real backend registered with W&M CAS, we simulate the 
    // redirect by reloading the page with a fake ticket.
    const mockCasRedirectUrl = serviceUrl + '?ticket=ST-SIMULATED-TICKET-12345';
    
    setTimeout(() => {
      // Uncomment this line to use real CAS (if authorized)
      // window.location.href = casLoginUrl;
      
      // Using simulation for demo:
      window.location.href = mockCasRedirectUrl;
    }, 1000);
  };

  const handleDebugLogin = () => {
    // Immediate login with the Mock User constant (Dr. Jane Mariner)
    onLogin(MOCK_USER);
    navigate('/');
  };

  // --- 3. Render ---

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 px-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-teal-900/20" />
          <div className="relative z-10">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
               <Anchor className="h-10 w-10 text-slate-900" />
            </div>
            <h1 className="text-2xl font-bold text-white">VBay Login</h1>
            <p className="text-slate-400 mt-2">VIMS Community Marketplace</p>
          </div>
        </div>
        
        <div className="p-8">
          {authStage === 'validating' ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Validating Ticket...</h2>
              <p className="text-slate-500 text-sm mt-2">Connecting to VIMS CAS</p>
            </div>
          ) : authStage === 'redirecting' ? (
            <div className="text-center py-8">
               <div className="w-12 h-12 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
               <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Redirecting...</h2>
               <p className="text-slate-500 text-sm mt-2">Sending you to William & Mary Login</p>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Authentication Required</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  Please log in to manage listings and view seller details.
                </p>
              </div>

              <div className="space-y-4">
                {/* Main SSO Button */}
                <button
                  onClick={handleRealSSO}
                  className="w-full flex items-center justify-center gap-3 bg-[#115740] hover:bg-[#0d4432] text-white py-3 px-4 rounded-lg font-semibold transition-all shadow-md group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <Lock className="h-5 w-5 opacity-80 group-hover:opacity-100 relative z-10" />
                  <span className="relative z-10">Sign in with VIMS CAS</span>
                </button>

                {/* Divider */}
                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-600"></div>
                    <span className="flex-shrink-0 mx-4 text-xs font-semibold text-slate-400 uppercase">Developers Only</span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-600"></div>
                </div>

                {/* Debug Button */}
                <button
                  onClick={handleDebugLogin}
                  className="w-full flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  <Bug className="h-4 w-4" />
                  Debug: Login as Dr. Jane Mariner
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded border border-red-200">
                  {error}
                </div>
              )}

              <div className="mt-8 border-t border-slate-100 dark:border-slate-700 pt-6 text-center">
                 <p className="text-xs text-slate-400 leading-relaxed">
                   By logging in, you agree to the VIMS Acceptable Use Policy. 
                   <br/>
                   <span className="opacity-75 italic">
                     Note: "Sign in with VIMS CAS" uses a simulated redirect for this demo environment.
                   </span>
                 </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};