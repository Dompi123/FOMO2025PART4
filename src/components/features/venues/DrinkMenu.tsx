import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ChevronDown, ChevronLeft, Search, Plus, 
  Minus, Star, Users, Timer, Share2, Trophy
} from 'lucide-react';
import type { Screen, Drink, Venue } from '@/types';
import { useDebounce } from '../../../hooks/useDebounce';
import { motion } from 'framer-motion';

const MAX_QUANTITY = 10;
const MIN_QUANTITY = 1;

export interface DrinkMenuProps {
  venue: Venue;
  onNavigate: (screen: Screen, data?: { items: Drink[] }) => void;
  onBack: () => void;
  disabled?: boolean;
}

interface Category {
  id: string
  label: string
  count: string
}

export function DrinkMenu({ venue, onNavigate, onBack, disabled }: DrinkMenuProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [selectedDrinks, setSelectedDrinks] = useState<Drink[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setSelectedDrink(null);
      setShowCustomize(false);
      setQuantity(MIN_QUANTITY);
      setError(null);
    };
  }, []);

  // Debounce search query
  const debouncedSearch = useDebounce(searchQuery, 300);

  const categories: Category[] = [
    { id: 'all', label: 'ALL', count: '12' },
    { id: 'hot', label: 'HOT', count: '6' },
    { id: 'mixed', label: 'MIXED', count: '2X' }
  ];

  const drinks: Drink[] = [
    {
      id: '1',
      name: 'Single Mixed Drink',
      price: 4.00,
      description: 'Classic mixed drink',
      imageUrl: '/api/placeholder/80/80',
      category: 'cocktail',
      available: true,
      preparationTime: 5
    },
    {
      id: '2',
      name: 'Truly Hard Seltzer',
      price: 4.00,
      description: 'Light and refreshing',
      imageUrl: '/api/placeholder/80/80',
      category: 'beer',
      available: true,
      preparationTime: 2
    },
    {
      id: '3',
      name: 'Green Tea Shot',
      price: 4.00,
      description: 'Sweet and smooth',
      imageUrl: '/api/placeholder/80/80',
      category: 'spirit',
      available: true,
      preparationTime: 3
    }
  ];

  // Memoize filtered drinks
  const filteredDrinks = useMemo(() => 
    drinks.filter(drink => 
      drink.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      drink.description.toLowerCase().includes(debouncedSearch.toLowerCase())
    ),
    [drinks, debouncedSearch]
  );

  const handleAddToOrder = useCallback(async () => {
    if (!selectedDrink) return;
    
    if (quantity > MAX_QUANTITY) {
      setError(`Maximum quantity is ${MAX_QUANTITY}`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Add the drink with its quantity
      const newDrinks = Array(quantity).fill(selectedDrink);
      setSelectedDrinks(prev => [...prev, ...newDrinks]);
      setShowCustomize(false);
      setQuantity(MIN_QUANTITY);
    } catch (err) {
      setError('Failed to add drink to order');
      console.error('Add to order error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDrink, quantity]);

  const total = useMemo(() => 
    selectedDrinks.reduce((sum, drink) => sum + drink.price, 0),
    [selectedDrinks]
  );

  const handleCheckout = useCallback(async () => {
    if (disabled) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await onNavigate('checkout', { items: selectedDrinks });
    } catch (err) {
      setError('Failed to proceed to checkout');
      console.error('Checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDrinks, onNavigate, disabled]);

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
                disabled={isLoading || disabled}
                className="p-2 rounded-full bg-white/5 transition-transform hover:scale-110 active:scale-90 disabled:opacity-50"
                aria-label="Go back"
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
                  disabled={isLoading || disabled}
                  className={`
                    relative px-4 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50
                    ${activeCategory === category.id 
                      ? 'bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F]' 
                      : 'bg-white/5 hover:bg-white/10'
                    }
                  `}
                  aria-pressed={activeCategory === category.id}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to drink?"
                className="bg-transparent w-full text-white placeholder:text-white/40 focus:outline-none"
                aria-label="Search drinks"
                disabled={isLoading || disabled}
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p>{error}</p>
            </motion.div>
          )}
        </div>
      </header>

      {/* Loading State */}
      {isLoading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4"
        >
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/60 animate-pulse">Processing your request...</p>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="pt-[160px] pb-[100px] px-4 max-w-md mx-auto">
        {/* Drink List */}
        <div className="space-y-4" role="list">
          {filteredDrinks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-white/60"
            >
              No drinks found matching "{debouncedSearch}"
            </motion.div>
          ) : (
            filteredDrinks.map((drink) => (
              <motion.div 
                key={drink.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  if (!isLoading && !disabled) {
                    setSelectedDrink(drink);
                    setShowCustomize(true);
                  }
                }}
                className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm cursor-pointer transition-transform hover:scale-102 active:scale-98"
                role="listitem"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#9D5CFF]/20 to-[#FF3B7F]/20" />
                  <div className="flex-1">
                    <h3 className="font-medium">{drink.name}</h3>
                    <p className="text-sm text-white/60">{drink.description}</p>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">${drink.price.toFixed(2)}</div>
                      <div className="text-xs text-white/40">•</div>
                      <div className="text-sm text-white/60">{drink.category}</div>
                      <div className="text-xs text-white/40">•</div>
                      <div className="text-sm text-[#9D5CFF]">{drink.preparationTime}m</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>

      {/* Checkout Button */}
      {selectedDrinks.length > 0 && (
        <div className="fixed bottom-24 left-0 right-0 p-4 bg-[#070707]/80 backdrop-blur-xl border-t border-white/5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            disabled={isLoading || disabled}
            className="w-full bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] p-4 rounded-2xl font-bold text-lg shadow-lg shadow-purple-500/20 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : `Checkout • $${total.toFixed(2)}`}
          </motion.button>
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
                    disabled={isLoading || disabled}
                    className="p-2 rounded-full bg-white/5 transition-transform hover:scale-110 active:scale-90 disabled:opacity-50"
                    aria-label="Close customization panel"
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
                      onClick={() => setQuantity(Math.max(MIN_QUANTITY, quantity - 1))}
                      disabled={quantity <= MIN_QUANTITY || isLoading || disabled}
                      className="p-2 rounded-full bg-white/5 transition-transform hover:scale-110 active:scale-90 disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(MAX_QUANTITY, quantity + 1))}
                      disabled={quantity >= MAX_QUANTITY || isLoading || disabled}
                      className="p-2 rounded-full bg-white/5 transition-transform hover:scale-110 active:scale-90 disabled:opacity-50"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToOrder}
                  disabled={isLoading || disabled}
                  className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-[#9D5CFF] to-[#FF3B7F] transition-transform hover:scale-102 active:scale-98 disabled:opacity-50"
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
}