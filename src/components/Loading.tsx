import { type IBaseComponent } from './types';
import { twMerge } from "tailwind-merge";

interface ILoadingSpinnerProps extends IBaseComponent {
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<ILoadingSpinnerProps> = ({ className, size }) => {
  const classes = twMerge(`
    flex
    items-center
    justify-center
    ${className ?? ""}
  `);

  const sizes = {
    small: 'h-8 w-8',
    medium: 'h-16 w-16',
    large: 'h-32 w-32',
  }

  const spinnerClasses = twMerge(`
    inline-block
    animate-spin
    rounded-full
    border-4
    border-solid
    border-current
    border-r-transparent
    align-[-0.125em]
    motion-reduce:animate-[spin_1.5s_linear_infinite]
    ${sizes[size ?? 'medium']}
  `);

  return (
      <div className={classes}>
        <div className={spinnerClasses} role="status">
          <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
  );
};

export const LoadingPage: React.FC<ILoadingSpinnerProps> = ({ size }) => <LoadingSpinner className="h-screen" size={size} />;