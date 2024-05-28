import React, { ReactNode } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

type DefaultButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

type Props = DefaultButtonProps & {
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  children?: ReactNode;
  size?: 'large' | 'medium' | 'small';
  styleType?: 'primary' | 'secondary';
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  type?: 'button' | 'submit' | 'reset' | undefined;
};

const Button = ({
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: Props) => (
  <button
    className={clsx(styles.button, className)}
    disabled={disabled}
    type={type}
    {...props}
  >
    {children}
  </button>
);

export default Button;
