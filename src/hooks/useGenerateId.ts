import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useGenerateId = () => {
  const idRef = useRef<string | null>(null);

  if (idRef.current === null) {
    idRef.current = uuidv4();
  }

  return idRef.current;
};
