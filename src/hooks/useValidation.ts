import { useState, useCallback } from 'react';
import { UserData, ValidationErrors } from '../types';

export function useValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateUserData = useCallback((userData: UserData): boolean => {
    const newErrors: ValidationErrors = {};

    // Name validation
    if (!userData.name.trim()) {
      newErrors.name = 'NAME IS REQUIRED';
    } else if (userData.name.length > 20) {
      newErrors.name = 'NAME TOO LONG (MAX 20)';
    }

    // Age validation
    if (!userData.age.trim()) {
      newErrors.age = 'AGE IS REQUIRED';
    } else {
      const age = parseInt(userData.age);
      if (isNaN(age) || age < 1 || age > 120) {
        newErrors.age = 'AGE MUST BE 1-120';
      }
    }

    // Message validation (optional - will be auto-generated if empty)
    if (userData.message && userData.message.trim()) {
      const words = userData.message.trim().split(/\s+/).filter(word => word.length > 0);
      if (words.length > 10) {
        newErrors.message = 'MAX 10 WORDS ALLOWED';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateUserData,
    clearErrors
  };
}