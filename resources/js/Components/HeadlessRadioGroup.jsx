import { RadioGroup } from '@headlessui/react';

const HeadlessRadioGroup = ({ value, onChange, className = '', children, ...props }) => {
  return (
    <RadioGroup value={value} onChange={onChange} className={className} {...props}>
      {children}
    </RadioGroup>
  );
};

HeadlessRadioGroup.Option = ({ value, className = '', children, ...props }) => {
  return (
    <RadioGroup.Option
      value={value}
      className={({ active, checked }) =>
        `${active ? 'ring-2 ring-offset-2 ring-[rgb(var(--color-input-focus-ring))]' : ''}
        ${checked ? 'bg-accent border-transparent text-on-accent hover-bg-button-primary-hover' : 'bg-primary border-primary text-primary hover-bg-secondary'}
        relative block cursor-pointer rounded-lg border p-4 focus:outline-none ${className}`
      }
      {...props}
    >
      {({ active, checked }) => children({ active, checked })}
    </RadioGroup.Option>
  );
};

HeadlessRadioGroup.Label = ({ className = '', children, ...props }) => {
  return (
    <RadioGroup.Label className={`font-medium text-primary ${className}`} {...props}>
      {children}
    </RadioGroup.Label>
  );
};

HeadlessRadioGroup.Description = ({ className = '', children, ...props }) => {
  return (
    <RadioGroup.Description className={`text-tertiary ${className}`} {...props}>
      {children}
    </RadioGroup.Description>
  );
};

export default HeadlessRadioGroup;
