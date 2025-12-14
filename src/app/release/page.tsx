'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, Sparkles, Star, Zap, Heart, Trophy, Gift, Stars } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReleasePage() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isLaunched, setIsLaunched] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  // Launch logs simulation
  const launchLogs = [
    '🚀 Initializing CODEEX AI Launch Sequence...',
    '⚡ Loading AI Models: Llama 3.1, Gemini 2.5 Flash...',
    '🧠 Activating Jarvis Mode Voice Assistant...',
    '🎯 Connecting Multi-Provider AI Network...',
    '🔧 Optimizing Student Learning Algorithms...',
    '🌟 Enabling Voice-Controlled Programming...',
    '📚 Loading Educational AI Tutoring System...',
    '🎨 Initializing Magical UI Experience...',
    '🔒 Securing Firebase Authentication...',
    '📡 Establishing Real-time Chat Connections...',
    '🎵 Activating Enhanced Text-to-Speech...',
    '💫 Democratizing Tech Learning Worldwide...',
    '✨ Empowering Students with AI Magic...',
    '🎉 CODEEX AI Systems: ALL GREEN!',
    '🚀 Launch Sequence: COMPLETE!'
  ];

  // Calculate time until 4 PM today
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const today = new Date();
      today.setHours(16, 0, 0, 0); // 4 PM today
      
      // If it's already past 4 PM today, set to 4 PM tomorrow
      if (now > today) {
        today.setDate(today.getDate() + 1);
      }
      
      const difference = today.getTime() - now.getTime();
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        setIsLaunched(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle launch button click
  const handleLaunch = () => {
    setShowLogs(true);
    setCurrentLogIndex(0);
    
    // Simulate log messages appearing
    const logInterval = setInterval(() => {
      setCurrentLogIndex(prev => {
        if (prev < launchLogs.length - 1) {
          return prev + 1;
        } else {
          clearInterval(logInterval);
          // Show congratulations after 1 minute (60 seconds)
          setTimeout(() => {
            setShowLogs(false);
            setShowCongrats(true);
          }, 60000);
          return prev;
        }
      });
    }, 200);
  };

  const isReadyToLaunch = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!showLogs && !showCongrats && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="text-center space-y-8 max-w-4xl"
            >
              {/* Header */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center gap-4 mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Rocket className="w-16 h-16 text-yellow-400" />
                  </motion.div>
                  <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                    CODEEX AI
                  </h1>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-16 h-16 text-pink-400" />
                  </motion.div>
                </div>
                
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl md:text-4xl font-semibold text-white mb-4"
                >
                  🎉 OFFICIAL LAUNCH CELEBRATION 🎉
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto"
                >
                  The magical AI learning platform that democratizes tech education for students worldwide!
                </motion.p>
              </motion.div>

              {/* Countdown or Launch Button */}
              {!isReadyToLaunch ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="space-y-6"
                >
                  <h3 className="text-3xl font-bold text-yellow-400 mb-8">
                    🕐 Launching at 4:00 PM Today!
                  </h3>
                  
                  <div className="flex justify-center gap-8 text-center">
                    <motion.div 
                      className="countdown-box launch-glow rounded-2xl p-6 min-w-[120px]"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-4xl font-bold text-yellow-400">{timeLeft.hours.toString().padStart(2, '0')}</div>
                      <div className="text-sm text-gray-300 uppercase tracking-wider">Hours</div>
                    </motion.div>
                    <motion.div 
                      className="countdown-box launch-glow rounded-2xl p-6 min-w-[120px]"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-4xl font-bold text-pink-400">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                      <div className="text-sm text-gray-300 uppercase tracking-wider">Minutes</div>
                    </motion.div>
                    <motion.div 
                      className="countdown-box launch-glow rounded-2xl p-6 min-w-[120px]"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-4xl font-bold text-purple-400">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                      <div className="text-sm text-gray-300 uppercase tracking-wider">Seconds</div>
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="space-y-8"
                >
                  <h3 className="text-4xl font-bold text-green-400 mb-8">
                    🎯 IT'S TIME! Ready for Launch?
                  </h3>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleLaunch}
                      size="lg"
                      className="launch-button launch-rainbow text-2xl px-12 py-6 text-white font-bold rounded-full shadow-2xl transform transition-all duration-300 hover:shadow-pink-500/25 hover:scale-110"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Rocket className="w-8 h-8 mr-4" />
                      </motion.div>
                      🚀 CLICK TO RELEASE CODEEX AI! 🚀
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-8 h-8 ml-4" />
                      </motion.div>
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {/* Features Preview */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
              >
                {[
                  { icon: Zap, text: 'Jarvis Mode', color: 'text-yellow-400' },
                  { icon: Heart, text: 'Student First', color: 'text-pink-400' },
                  { icon: Trophy, text: 'AI Learning', color: 'text-purple-400' },
                  { icon: Gift, text: 'Completely Free', color: 'text-green-400' }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
                  >
                    <feature.icon className={`w-8 h-8 mx-auto mb-2 ${feature.color}`} />
                    <div className="text-white font-semibold">{feature.text}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Launch Logs */}
          {showLogs && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl"
            >
              <div className="launch-console rounded-2xl p-8 relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-2xl font-bold text-green-400">CODEEX AI Launch Console</h3>
                  <div className="ml-auto flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="font-mono text-sm space-y-2 h-96 overflow-y-auto">
                  {launchLogs.slice(0, currentLogIndex + 1).map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-green-300"
                    >
                      <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                    </motion.div>
                  ))}
                  <motion.div
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-green-400"
                  >
                    ▊
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Congratulations */}
          {showCongrats && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center space-y-8 max-w-4xl"
            >
              <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                  🎉 CONGRATULATIONS! 🎉
                </h1>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
                  CODEEX AI Successfully Launched! 🚀
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                <p className="text-xl text-gray-200 max-w-2xl mx-auto">
                  The magical AI learning platform is now live and ready to democratize tech education for students worldwide!
                </p>

                <motion.h2
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-4xl md:text-6xl font-bold website-link success-text"
                >
                  🌟 codeex-ai.netlify.app 🌟
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
                >
                  <Button
                    asChild
                    size="lg"
                    className="text-xl px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold rounded-full"
                  >
                    <a href="https://codeex-ai.netlify.app" target="_blank" rel="noopener noreferrer">
                      🚀 Launch CODEEX AI Now!
                    </a>
                  </Button>
                  
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="text-xl px-8 py-4 border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-bold rounded-full"
                  >
                    <a href="https://codeex-ai.netlify.app/jarvis-mode" target="_blank" rel="noopener noreferrer">
                      ✨ Try Jarvis Mode
                    </a>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Celebration Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute inset-0 pointer-events-none"
              >
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{ 
                      x: Math.random() * window.innerWidth,
                      y: window.innerHeight + 50,
                      rotate: 0 
                    }}
                    animate={{ 
                      y: -100,
                      rotate: 360,
                      x: Math.random() * window.innerWidth
                    }}
                    transition={{ 
                      duration: Math.random() * 3 + 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  >
                    <Stars className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}