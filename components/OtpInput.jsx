'use client';

import React, { useRef, useEffect } from 'react';

/**
 * 6-digit OTP input component with auto-focus, backspace navigation, paste handling, and mobile numeric keypad
 */
export default function OtpInput({
  value = '',
  onChange,
  disabled = false,
  autoFocus = true,
  dark = false
}) {
  const inputsRef = useRef([]);

  // Ensure value is at least an array of 6 chars
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

  useEffect(() => {
    if (autoFocus && inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (index, e) => {
    const rawVal = e.target.value;
    const char = rawVal.replace(/\D/g, '').slice(-1); // Only take latest numeric digit

    const newDigits = [...digits];
    newDigits[index] = char;
    const combined = newDigits.join('');
    onChange(combined);

    // Auto-advance to next input if a digit was entered
    if (char && index < 5 && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
      inputsRef.current[index + 1].select();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0 && inputsRef.current[index - 1]) {
        // Move to previous box if current is empty
        inputsRef.current[index - 1].focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        onChange(newDigits.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    onChange(pasteData);

    // Focus on the next empty box or the last box
    const focusIndex = Math.min(pasteData.length, 5);
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 my-4">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          aria-label={`Digit ${i + 1} of 6`}
          className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-2xl font-black rounded-xl sm:rounded-2xl transition-all outline-none ${
            dark
              ? digit
                ? 'border-2 border-red-500 bg-red-950/40 text-white shadow-sm'
                : 'border border-slate-700 bg-slate-950 text-white hover:border-slate-600 focus:border-red-500 focus:ring-4 focus:ring-red-900/40'
              : digit
                ? 'border-2 border-red-500 bg-red-50/40 text-slate-900 shadow-sm'
                : 'border border-slate-200 bg-white text-slate-800 hover:border-slate-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-800/40' : ''}`}
        />
      ))}
    </div>
  );
}
