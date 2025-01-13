import React, { useState } from 'react';
import { 
  ChevronDown, ChevronLeft, Search, Plus, 
  Minus, Star, Users, Timer, Share2, Trophy
} from 'lucide-react';
import type { Screen } from '@/types';

interface Drink {
  id: string;
  name: string;
  price: number;
  image: string;
  popularity: number;
  timeLimit?: string;
  boost?: string;
}

interface DrinkMenuProps {
  venue: any;
  onNavigate: (screen: Screen, data?: any) => void;
  onBack: () => void;
}

export const DrinkMenu: React.FC<DrinkMenuProps> = ({ venue, onNavigate, onBack }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedDrinks, setSelectedDrinks] = useState<Drink[]>([]);

  const categories = [
    { id: 'all', label: 'ALL', count: '12' },
    { id: 'hot', label: 'HOT', count: '6' },
    { id: 'mixed', label: 'MIXED', count: '2X' }
  ];

  const drinks: Drink[] = [
    {
      id: '1',
      name: 'Single Mixed Drink',
      price: 4.00,
      image: '/api/placeholder/80/80',
      popularity: 342,
      timeLimit: '1h left',
      boost: '2X FOMO'
    },
    {
      id: '2',
      name: 'Truly Hard Seltzer',
      price: 4.00,
      image: '/api/placeholder/80/80',
      popularity: 189,
      boost: 'Trending'
    },
    {
      id: '3',
      name: 'Green Tea Shot',
      price: 4.00,
      image: '/api/placeholder/80/80',
      popularity: 156
    }
  ];

  const handleAddToOrder = () => {
    if (selectedDrink) {
      // Add the drink with its quantity
      for (let i = 0; i < quantity; i++) {
        setSelectedDrinks(prev => [...prev, selectedDrink]);
      }
      setShowCustomize(false);
      setQuantity(1);
    }
  };

  const total = selectedDrinks.reduce((sum, drink) => sum + drink.price, 0);

  const handleCheckout = () => {
    console.log('Navigating to checkout with drinks:', selectedDrinks);
    onNavigate('checkout', { items: selectedDrinks });
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white">
      {/* Premium Background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(157,92,255,0.08),_transparent_70%)]" />
      </div>

      {/* Combined Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#070707]/90 backdrop-blur-xl z-40 border-b border-white/5">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-full bg-white/5 transition-transform hover:scale-110 active:scale-90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-lg font-bold bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] text-transparent bg-clip-text">
                {venue?.name || "Rick's Bar"}
              </span>
            </div>
            
            <div className="flex gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    relative px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95
                    ${activeCategory === category.id 
                      ? 'bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F]' 
                      : 'bg-white/5 hover:bg-white/10'
                    }
                  `}
                >
                  {category.label}
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF3B7F] text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {category.count}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pb-4">
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 transition-transform hover:scale-102">
              <Search className="w-5 h-5 text-white/40" />
              <input 
                type="text"
                placeholder="What do you want to drink?"
                className="bg-transparent w-full text-white placeholder:text-white/40 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Drink Menu */}
      <main className="pt-36 pb-24 max-w-md mx-auto px-4 space-y-3">
        {drinks.map((drink) => (
          <div
            key={drink.id}
            className="p-4 rounded-2xl bg-gradient-to-br from-[#9D5CFF]/10 to-[#FF3B7F]/10 border border-white/5 backdrop-blur-sm opacity-0 translate-y-4 animate-fade-in-up"
          >
            <div className="flex gap-4">
              <img 
                src={drink.image}
                alt={drink.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">{drink.name}</h3>
                    <div className="mt-1 text-2xl font-bold bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] text-transparent bg-clip-text">
                      ${drink.price.toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedDrink(drink);
                      setShowCustomize(true);
                    }}
                    className="p-3 rounded-full bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] transition-transform hover:scale-110 active:scale-90"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-white/60">
                    <Users className="w-4 h-4" />
                    <span>{drink.popularity} ordered</span>
                  </div>
                  {drink.timeLimit && (
                    <div className="flex items-center gap-1 text-white/60">
                      <Timer className="w-4 h-4" />
                      <span>{drink.timeLimit}</span>
                    </div>
                  )}
                </div>

                {drink.boost && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF3B7F] animate-ping" />
                    <span className="text-[#FF3B7F] text-sm">{drink.boost}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* Checkout Button */}
      {selectedDrinks.length > 0 && !showCustomize && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <button
            onClick={handleCheckout}
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-black text-white font-medium shadow-lg transition-transform hover:scale-102 active:scale-98"
          >
            <div className="flex items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H5.62L6.72 16.43C6.78 17.02 6.98 17.58 7.33 18.05C7.68 18.52 8.16 18.9 8.72 19.14C9.28 19.38 9.89 19.47 10.49 19.4C11.1 19.33 11.67 19.1 12.14 18.73H17C17.47 19.1 18.04 19.33 18.65 19.4C19.25 19.47 19.86 19.38 20.42 19.14C20.98 18.9 21.46 18.52 21.81 18.05C22.16 17.58 22.36 17.02 22.42 16.43L23.52 4H4ZM12 13.5C12.53 13.5 13.04 13.3 13.47 12.93C13.89 12.57 14.21 12.06 14.37 11.48C14.53 10.91 14.52 10.3 14.33 9.73C14.14 9.16 13.79 8.67 13.32 8.32C12.85 7.97 12.29 7.77 11.71 7.77C11.13 7.77 10.57 7.97 10.1 8.32C9.63 8.67 9.28 9.16 9.09 9.73C8.9 10.3 8.89 10.91 9.05 11.48C9.21 12.06 9.53 12.57 9.95 12.93C10.38 13.3 10.89 13.5 11.42 13.5H12Z" fill="white"/>
              </svg>
              <span className="ml-2">View cart • {selectedDrinks.length}</span>
            </div>
          </button>
        </div>
      )}

      {/* Customization Panel */}
      {showCustomize && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-fade-in">
          <div className="absolute inset-x-0 bottom-0 bg-[#070707] rounded-t-3xl p-6 transform translate-y-0 animate-slide-up">
            {selectedDrink && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{selectedDrink.name}</h2>
                  <button
                    onClick={() => setShowCustomize(false)}
                    className="p-2 rounded-full bg-white/5 transition-transform hover:scale-110 active:scale-90"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] text-transparent bg-clip-text">
                    ${(selectedDrink.price * quantity).toFixed(2)}
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 rounded-full bg-white/5 transition-transform hover:scale-110 active:scale-90"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 rounded-full bg-white/5 transition-transform hover:scale-110 active:scale-90"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToOrder}
                  className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] transition-transform hover:scale-102 active:scale-98"
                >
                  Add to order • ${(selectedDrink.price * quantity).toFixed(2)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};