import { type IBaseComponent } from './types';
import { twMerge } from "tailwind-merge";

export const LoadingSpinner: React.FC<IBaseComponent> = ({ className }) => {
  const classes = twMerge(`
    flex
    items-center
    justify-center
    ${className ?? ""}
  `);

  return (
      <div className={classes}>
        <div
          className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status">
          <span
            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
  );
};

export const LoadingPage: React.FC = () => <LoadingSpinner className="h-screen" />;