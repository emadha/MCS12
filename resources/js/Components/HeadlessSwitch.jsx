import { useState } from 'react';
import { Switch } from '@headlessui/react';

export default function HeadlessSwitch({ enabled: initialEnabled = false, onChange, className = '', ...props }) {
  const [enabled, setEnabled] = useState(initialEnabled);

  const handleChange = (newEnabled) => {
    setEnabled(newEnabled);
    if (onChange) {
      onChange(newEnabled);
    }
  };

  return (
    <Switch
      checked={enabled}
      onChange={handleChange}
      className={`${enabled ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full ${className}`}
      {...props}
    >
      <span className="sr-only">Toggle switch</span>
      <span
        className={`${enabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </Switch>
  );
}
