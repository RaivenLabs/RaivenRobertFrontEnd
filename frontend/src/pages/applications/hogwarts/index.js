import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HogwartsLanding = ({ appData }) => {
  const navigate = useNavigate();
  const [spellCast, setSpellCast] = useState(false);
  const [house, setHouse] = useState('');
  const houses = ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin'];
  
  // House colors
  const houseColors = {
    Gryffindor: 'from-red-700 to-yellow-500',
    Hufflepuff: 'from-yellow-400 to-black',
    Ravenclaw: 'from-blue-600 to-gray-400',
    Slytherin: 'from-green-700 to-gray-700',
    default: 'from-purple-700 to-indigo-500'
  };
  
  // Choose random house on load
  useEffect(() => {
    const randomHouse = houses[Math.floor(Math.random() * houses.length)];
    setHouse(randomHouse);
  }, []);
  
  const castSpell = () => {
    setSpellCast(true);
    setTimeout(() => setSpellCast(false), 2000);
  };

  return (
    <div className={`min-h-screen p-6 bg-gradient-to-b ${houseColors[house] || houseColors.default}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header with Hogwarts crest */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-6xl font-serif text-white drop-shadow-lg mb-2">
              Hogwarts School
            </h1>
            <h2 className="text-xl md:text-3xl font-serif text-white/90 italic">
              of Witchcraft and Wizardry
            </h2>
            {spellCast && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-yellow-300/30 animate-pulse rounded-full blur-xl"></div>
                <div className="absolute w-40 h-40 bg-yellow-400/60 animate-spin rounded-full blur-md"></div>
                <div className="absolute w-20 h-20 bg-white animate-ping rounded-full blur-sm"></div>
              </div>
            )}
          </div>
        </div>
        
        {/* Magic wand button */}
        <div className="text-center mb-8">
          <button 
            onClick={castSpell}
            className="px-6 py-3 bg-amber-800 text-amber-100 rounded-lg transform transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            Cast Lumos Spell ✨
          </button>
        </div>
        
        {/* Main card */}
        <div className="bg-stone-100/90 backdrop-blur-sm rounded-xl shadow-2xl p-8 mb-8 transform transition-all hover:shadow-amber-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-amber-900">Welcome, Student</h3>
            <span className="px-4 py-1 bg-gradient-to-r from-amber-700 to-amber-500 text-white rounded-full text-sm">
              {house} House
            </span>
          </div>
          
          <p className="text-gray-700 mb-6">
            Your magical journey begins here. Explore the hallowed halls of Hogwarts, 
            attend classes with our distinguished professors, and discover the secrets of 
            the wizarding world.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => navigate('dashboard')}
              className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-lg shadow cursor-pointer hover:shadow-md transition-all"
            >
              <h4 className="text-lg font-semibold text-amber-800 mb-2">Great Hall</h4>
              <p className="text-amber-900/70">View announcements, house points, and upcoming feasts</p>
            </div>
            
            <div 
              onClick={() => navigate('courses')}
              className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-lg shadow cursor-pointer hover:shadow-md transition-all"
            >
              <h4 className="text-lg font-semibold text-amber-800 mb-2">Course Schedule</h4>
              <p className="text-amber-900/70">Access your magical lessons and assignments</p>
            </div>
            
            <div 
              onClick={() => navigate('students')}
              className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-lg shadow cursor-pointer hover:shadow-md transition-all"
            >
              <h4 className="text-lg font-semibold text-amber-800 mb-2">Student Directory</h4>
              <p className="text-amber-900/70">Connect with your fellow witches and wizards</p>
            </div>
            
            <div 
              className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-lg shadow cursor-pointer hover:shadow-md transition-all"
            >
              <h4 className="text-lg font-semibold text-amber-800 mb-2">Restricted Section</h4>
              <p className="text-amber-900/70">Permission slip required from Professor</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center text-white/80 text-sm">
          <p>© {new Date().getFullYear()} Hogwarts School of Witchcraft and Wizardry</p>
          <p className="text-xs mt-1">Ministry of Magic Approved • Albus Dumbledore, Headmaster</p>
        </div>
      </div>
    </div>
  );
};

export default HogwartsLanding;
