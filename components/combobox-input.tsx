'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';

interface ComboboxInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
}

export function ComboboxInput({
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: ComboboxInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Deduplicate options to avoid duplicate key warnings
  const uniqueOptions = [...new Set(options)];

  const filteredOptions = uniqueOptions.filter((option) =>
    option.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setOpen(true);
  };

  const handleSelect = (option: string) => {
    setInputValue(option);
    onChange(option);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="pr-8"
        />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          disabled={disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
        >
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
          />
        </button>
      </div>

      {open && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-stone-200 rounded-md shadow-lg max-h-48 overflow-auto">
          {filteredOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              className={cn(
                'w-full px-3 py-2 text-left text-sm hover:bg-stone-100 flex items-center justify-between',
                value === option && 'bg-stone-50'
              )}
            >
              {option}
              {value === option && <Check className="h-4 w-4 text-stone-600" />}
            </button>
          ))}
        </div>
      )}

      {open && inputValue && !options.includes(inputValue) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-stone-200 rounded-md shadow-lg">
          <div className="px-3 py-2 text-sm text-stone-500">
            Press enter to create &quot;{inputValue}&quot;
          </div>
        </div>
      )}
    </div>
  );
}
