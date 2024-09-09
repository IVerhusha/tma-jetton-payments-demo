import { useBackButton as useBackButtonComponent } from '@telegram-apps/sdk-react';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useBackButton = (onClick?: () => void) => {
  const navigate = useNavigate();
  const backButton = useBackButtonComponent();

  const handleBackButtonClick = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    backButton.on('click', onClick ?? handleBackButtonClick);
    backButton.show();

    return () => {
      backButton.hide();
      backButton.off('click', onClick ?? handleBackButtonClick);
    };
  }, [backButton, handleBackButtonClick, onClick]);
};
