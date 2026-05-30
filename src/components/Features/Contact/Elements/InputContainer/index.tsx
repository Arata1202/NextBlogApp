import { useTheme } from 'next-themes';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { fieldControlClassName } from '@/components/Common/controlClassNames';

type Props = {
  label: string;
  name: string;
  registerResult: UseFormRegisterReturn;
  errors?: FieldError;
  textarea?: boolean;
};

export default function InputContainer({
  label,
  name,
  registerResult,
  errors,
  textarea = false,
}: Props) {
  const { theme } = useTheme();
  const errorId = `${name}-error`;

  return (
    <div className="sm:col-span-2">
      <label
        htmlFor={name}
        className={`block text-sm font-semibold leading-6 ${theme === 'dark' ? 'DarkTheme placeholder:text-gray-500' : 'LightTheme placeholder:text-gray-500'}`}
      >
        {label}
      </label>
      <div className="mt-2.5">
        {!textarea && (
          <input
            {...registerResult}
            type="text"
            id={name}
            name={name}
            autoComplete={name}
            aria-invalid={Boolean(errors)}
            aria-describedby={errors ? errorId : undefined}
            className={`${fieldControlClassName} block h-10 w-full px-3 text-base sm:text-sm ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
          />
        )}
        {textarea && (
          <textarea
            {...registerResult}
            id={name}
            name={name}
            rows={4}
            aria-invalid={Boolean(errors)}
            aria-describedby={errors ? errorId : undefined}
            className={`${fieldControlClassName} block w-full px-3 py-2 text-base sm:text-sm ${theme === 'dark' ? 'DarkTheme' : 'LightTheme'}`}
          />
        )}
        {errors && (
          <p id={errorId} className="text-red-700" role="alert">
            {errors.message}
          </p>
        )}
      </div>
    </div>
  );
}
