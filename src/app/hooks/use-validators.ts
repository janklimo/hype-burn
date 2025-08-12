'use client';

import { useEffect, useState } from 'react';

interface Validator {
  validator: string;
  signer: string;
  name: string;
}

interface ValidatorNameMap {
  [address: string]: string;
}

interface UseValidatorsReturn {
  validatorNames: ValidatorNameMap;
  isLoading: boolean;
}

const useValidators = (): UseValidatorsReturn => {
  const [validatorNames, setValidatorNames] = useState<ValidatorNameMap>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchValidators = async () => {
      try {
        setIsLoading(true);

        const response = await fetch('https://api.hyperliquid.xyz/info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'validatorSummaries',
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const validatorData: Validator[] = await response.json();

        // Create validator name mapping: { "0x...": "name", ... }
        const nameMap: ValidatorNameMap = {};
        validatorData.forEach((validator) => {
          nameMap[validator.validator] = validator.name;
        });

        setValidatorNames(nameMap);
      } finally {
        setIsLoading(false);
      }
    };

    fetchValidators();
  }, []);

  return {
    validatorNames,
    isLoading,
  };
};

export default useValidators;
