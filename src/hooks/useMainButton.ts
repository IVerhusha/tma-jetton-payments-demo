import { useMainButton as useMainButtonComponent } from '@telegram-apps/sdk-react';
import { useEffect } from 'react';

type Props = {
  text: string;
  onClick: () => void;
  isEnabled?: boolean;
  isVisible?: boolean;
};

export const useMainButton = ({ text, onClick, isEnabled = true }: Props) => {
  const mainButton = useMainButtonComponent();

  useEffect(() => {
    mainButton.on('click', onClick);
    mainButton.setParams({
      isEnabled,
      isVisible: true,
      text: text.toUpperCase(),
      bgColor: '#0098EA',
      textColor: '#ffffff',
    });

    return () => {
      mainButton.off('click', onClick);
    };
  }, [isEnabled, text, onClick]);

  return mainButton;
};
