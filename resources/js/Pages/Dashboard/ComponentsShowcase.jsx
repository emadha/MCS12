import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import Checkbox from '@/Components/Checkbox';
import SelectInput from '@/Components/SelectInput';
import IconInput from '@/Components/IconInput';
import AnimatedIconInput from '@/Components/AnimatedIconInput';
import EnhancedTextInput from '@/Components/EnhancedTextInput';
import AnimatedButton from '@/Components/AnimatedButton';
import AnimatedCard from '@/Components/AnimatedCard';
import AnimatedList from '@/Components/AnimatedList';
import FadeInSection from '@/Components/FadeInSection';
import { UserIcon } from '@/Components/UserIcon';
import { EnvelopeIcon } from '@/Components/EnvelopeIcon';
import { LockClosedIcon } from '@/Components/LockClosedIcon';
import { MagnifyingGlassIcon } from '@/Components/MagnifyingGlassIcon';
import { CheckIcon } from '@/Components/CheckIcon';
import { ChevronUpDownIcon } from '@/Components/ChevronUpDownIcon';
import { motion } from 'framer-motion';

// Component section for organizing UI components
const ComponentSection = ({ title, description, children }) => {
  return (
    <div className="bg-primary overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-text-primary mb-2">{title}</h2>
      {description && <p className="text-text-secondary mb-6">{description}</p>}
      {children}
    </div>
  );
};
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import HeadlessDialog from '@/Components/HeadlessDialog';
import HeadlessSwitch from '@/Components/HeadlessSwitch';
import HeadlessListbox from '@/Components/HeadlessListbox';
import HeadlessPopover from '@/Components/HeadlessPopover';
import HeadlessCombobox from '@/Components/HeadlessCombobox';
import HeadlessDisclosure from '@/Components/HeadlessDisclosure';
import HeadlessRadioGroup from '@/Components/HeadlessRadioGroup';
import StatusBadge from '@/Components/StatusBadge';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

export default function ComponentsShowcase({ auth }) {
    // State for interactive components
    const [checked, setChecked] = useState(false);
    const [switchEnabled, setSwitchEnabled] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedOption, setSelectedOption] = useState('option1');

    // Sample data
    const people = [
        { id: 1, name: 'Durward Reynolds' },
        { id: 2, name: 'Kenton Towne' },
        { id: 3, name: 'Therese Wunsch' },
        { id: 4, name: 'Benedict Kessler' },
        { id: 5, name: 'Katelyn Rohan' },
    ];

    const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
    ];

    const filteredPeople = query === ''
        ? people
        : people.filter((person) =>
            person.name.toLowerCase().includes(query.toLowerCase())
        );

    // Sample data for demonstration purposes

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Components Showcase</h2>}
        >
            <Head title="Components Showcase" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-text-primary mb-4 section-heading">Components Showcase</h1>
                        <p className="text-text-secondary">
                            This page displays all available components in the application to help verify theming and styling.
                        </p>
                    </div>

                    {/* Form Components */}
                    <ComponentSection
                        title="Form Components"
                        description="Basic form input components used throughout the application."
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Text Input */}
                            <div>
                                <InputLabel htmlFor="name" value="Text Input" />
                                <TextInput
                                    id="name"
                                    type="text"

                                    className="mt-1 block w-full"
                                    placeholder="Enter your name"
                                />
                                <InputError message="This is what an error looks like" className="mt-2" />
                            </div>

                            {/* Select Input */}
                            <div>
                                <InputLabel htmlFor="select" value="Select Input" />
                                <SelectInput
                                    id="select"
                                    className="mt-1 block w-full"
                                    value={selectedOption}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                    options={options}
                                />
                            </div>

                            {/* Checkbox */}
                            <div className="flex items-center">
                                <Checkbox
                                    id="remember_me"
                                    checked={checked}
                                    onChange={(e) => setChecked(e.target.checked)}
                                />
                                <InputLabel htmlFor="remember_me" value="Remember me" className="ms-2" />
                            </div>

                            {/* Text Area */}
                            <div className="md:col-span-2">
                                <InputLabel htmlFor="description" value="Text Area" />
                                <TextArea
                                    id="description"
                                    className="mt-1 block w-full"
                                    placeholder="Enter a description"
                                    rows="4"
                                />
                            </div>

                            {/* Icon Inputs */}
                            <div className="md:col-span-2 mt-6">
                                <h4 className="font-medium mb-3">Inputs with Icons</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <h5 className="text-sm font-medium text-gray-500">Standard Icon Inputs</h5>
                                        <IconInput
                                            id="icon-name"
                                            name="icon-name"
                                            label="Name with Icon"
                                            placeholder="Enter your name"
                                            icon={<UserIcon className="w-5 h-5" />}
                                        />

                                        <IconInput
                                            id="icon-email"
                                            type="email"
                                            name="icon-email"
                                            label="Email with Icon"
                                            placeholder="Enter your email"
                                            icon={<EnvelopeIcon className="w-5 h-5" />}
                                        />
                                    </div>

                                    <div className="space-y-6">
                                        <h5 className="text-sm font-medium text-gray-500">Animated Icon Inputs</h5>
                                        <AnimatedIconInput
                                            id="animated-icon-name"
                                            name="animated-icon-name"
                                            label="Name with Animated Icon"
                                            placeholder="Enter your name"
                                            icon={<UserIcon className="w-5 h-5" />}
                                        />

                                        <AnimatedIconInput
                                            id="animated-icon-email"
                                            type="email"
                                            name="animated-icon-email"
                                            label="Email with Animated Icon"
                                            placeholder="Enter your email"
                                            icon={<EnvelopeIcon className="w-5 h-5" />}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <AnimatedIconInput
                                        id="animated-icon-password"
                                        type="password"
                                        name="animated-icon-password"
                                        label="Password with Animated Icon"
                                        placeholder="Enter your password"
                                        error="Password must be at least 8 characters"
                                        icon={<LockClosedIcon className="w-5 h-5" />}
                                    />

                                    <AnimatedIconInput
                                        id="animated-icon-search"
                                        type="search"
                                        name="animated-icon-search"
                                        label="Search with Animated Icon"
                                        placeholder="Search..."
                                        icon={<MagnifyingGlassIcon className="w-5 h-5" />}
                                    />
                                </div>
                            </div>
                        </div>
                    </ComponentSection>

                    {/* Button Components */}
                    <ComponentSection
                        title="Button Components"
                        description="Various button styles available in the application."
                    >
                        <div className="flex flex-wrap gap-4 mb-6">
                            <PrimaryButton>Primary Button</PrimaryButton>
                            <SecondaryButton>Secondary Button</SecondaryButton>
                            <DangerButton>Danger Button</DangerButton>
                            <PrimaryButton disabled>Disabled Button</PrimaryButton>
                        </div>

                        <div className="mt-6">
                            <h4 className="text-lg font-medium text-gray-700 mb-4">Animated Buttons</h4>
                            <div className="flex flex-wrap gap-4">
                                <AnimatedButton variant="primary">Animated Primary</AnimatedButton>
                                <AnimatedButton variant="secondary">Animated Secondary</AnimatedButton>
                                <AnimatedButton variant="danger">Animated Danger</AnimatedButton>
                                <AnimatedButton variant="primary" disabled>Animated Disabled</AnimatedButton>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-700 mb-4">Scroll-Triggered Animations</h4>
                            <p className="text-gray-600 mb-6">
                                The following sections animate as you scroll down the page. Each element animates once when it enters the viewport.
                            </p>

                            <div className="space-y-12 py-4">
                                <FadeInSection direction="up" className="bg-gray-50 p-6 rounded-lg">
                                    <h5 className="text-lg font-medium mb-2">Fade In From Bottom</h5>
                                    <p className="text-gray-600">
                                        This section fades in and moves up when scrolled into view.
                                    </p>
                                </FadeInSection>

                                <FadeInSection direction="left" className="bg-gray-50 p-6 rounded-lg">
                                    <h5 className="text-lg font-medium mb-2">Fade In From Right</h5>
                                    <p className="text-gray-600">
                                        This section fades in and moves from right to left when scrolled into view.
                                    </p>
                                </FadeInSection>

                                <FadeInSection direction="right" className="bg-gray-50 p-6 rounded-lg">
                                    <h5 className="text-lg font-medium mb-2">Fade In From Left</h5>
                                    <p className="text-gray-600">
                                        This section fades in and moves from left to right when scrolled into view.
                                    </p>
                                </FadeInSection>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <FadeInSection delay={0} className="bg-gray-50 p-6 rounded-lg">
                                        <h5 className="text-lg font-medium mb-2">Staggered 1</h5>
                                        <p className="text-gray-600">
                                            Staggered animations can be created using different delay values.
                                        </p>
                                    </FadeInSection>

                                    <FadeInSection delay={0.2} className="bg-gray-50 p-6 rounded-lg">
                                        <h5 className="text-lg font-medium mb-2">Staggered 2</h5>
                                        <p className="text-gray-600">
                                            This element appears 0.2 seconds after the previous one.
                                        </p>
                                    </FadeInSection>

                                    <FadeInSection delay={0.4} className="bg-gray-50 p-6 rounded-lg">
                                        <h5 className="text-lg font-medium mb-2">Staggered 3</h5>
                                        <p className="text-gray-600">
                                            This element appears 0.4 seconds after the first one.
                                        </p>
                                    </FadeInSection>
                                </div>
                            </div>
                        </div>
                    </ComponentSection>

                    {/* Navigation Components */}
                    <ComponentSection
                        title="Navigation Components"
                        description="Components used for navigation in the application."
                    >
                        <div className="space-y-6">
                            <div className="flex space-x-4 border-b border-gray-200 pb-4">
                                <NavLink href="#" active>Active NavLink</NavLink>
                                <NavLink href="#">Inactive NavLink</NavLink>
                            </div>

                            <div className="space-y-2">
                                <ResponsiveNavLink href="#" active>Active ResponsiveNavLink</ResponsiveNavLink>
                                <ResponsiveNavLink href="#">Inactive ResponsiveNavLink</ResponsiveNavLink>
                            </div>

                            <div className="w-48">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                            >
                                                Dropdown
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href="#">Option 1</Dropdown.Link>
                                        <Dropdown.Link href="#">Option 2</Dropdown.Link>
                                        <Dropdown.Link href="#">Option 3</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </ComponentSection>

                    {/* Animated UI Components */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">Animated UI Components</h2>
                        <p className="text-gray-600 mb-6">Components with enhanced animations and interactions.</p>

                        <div className="mb-8">
                            <h4 className="font-medium text-gray-700 mb-4">Animated Cards</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <AnimatedCard delay={0}>
                                    <h5 className="text-lg font-medium mb-2">Interactive Card 1</h5>
                                    <p className="text-gray-600">
                                        This card animates on page load and when hovered. Try hovering over it!
                                    </p>
                                </AnimatedCard>

                                <AnimatedCard delay={0.1}>
                                    <h5 className="text-lg font-medium mb-2">Interactive Card 2</h5>
                                    <p className="text-gray-600">
                                        These cards use staggered animations for a more natural feel.
                                    </p>
                                </AnimatedCard>

                                <AnimatedCard delay={0.2}>
                                    <h5 className="text-lg font-medium mb-2">Interactive Card 3</h5>
                                    <p className="text-gray-600">
                                        Hover effects enhance user engagement and provide visual feedback.
                                    </p>
                                </AnimatedCard>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h4 className="font-medium text-gray-700 mb-4">Animated Lists</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AnimatedCard hover={false}>
                                    <h5 className="text-lg font-medium mb-4">Staggered List Animation</h5>
                                    <AnimatedList>
                                        <AnimatedList.Item className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-3">
                                                    <span>1</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">First item</p>
                                                    <p className="text-sm text-gray-500">Items appear one after another</p>
                                                </div>
                                            </div>
                                        </AnimatedList.Item>
                                        <AnimatedList.Item className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-3">
                                                    <span>2</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Second item</p>
                                                    <p className="text-sm text-gray-500">With a slight delay</p>
                                                </div>
                                            </div>
                                        </AnimatedList.Item>
                                        <AnimatedList.Item className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mr-3">
                                                    <span>3</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">Third item</p>
                                                    <p className="text-sm text-gray-500">Creating a cascade effect</p>
                                                </div>
                                            </div>
                                        </AnimatedList.Item>
                                    </AnimatedList>
                                </AnimatedCard>

                                <div className="space-y-4">
                                    <h5 className="text-lg font-medium">Animation Properties</h5>
                                    <p className="text-gray-600">
                                        List animations use staggered timing to create a natural flow as items enter the view.
                                    </p>
                                    <p className="text-gray-600">
                                        This technique increases user engagement and makes UI transitions feel more polished.
                                    </p>
                                    <p className="text-gray-600">
                                        Try refreshing the page to see the animations again.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <h4 className="font-medium text-gray-700 mb-4">Form Animations</h4>

                                <AnimatedIconInput
                                    id="animated-contact-name"
                                    name="animated-contact-name"
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    icon={<UserIcon className="w-5 h-5" />}
                                />

                                <EnhancedTextInput
                                    id="enhanced-text-input"
                                    name="enhanced-text-input"
                                    label="Floating Label Input"
                                    placeholder="This has a floating label effect"
                                />

                                <AnimatedIconInput
                                    id="animated-contact-email"
                                    type="email"
                                    name="animated-contact-email"
                                    label="Email Address"
                                    placeholder="your.email@example.com"
                                    icon={<EnvelopeIcon className="w-5 h-5" />}
                                />

                                <AnimatedIconInput
                                    id="animated-contact-message"
                                    type="text"
                                    name="animated-contact-message"
                                    label="Message"
                                    placeholder="Type your message here"
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
                                        </svg>
                                    }
                                />

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 transform hover:scale-105 active:scale-95"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md hover:scale-[1.02] hover:border-indigo-500/20">
                                <h4 className="font-medium text-gray-700 mb-4">Interactive Card</h4>
                                <p className="text-gray-600 mb-4">
                                    This card features subtle hover animations and transitions to enhance user experience.
                                </p>

                                <div className="flex items-center space-x-4 mt-6">
                                    <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                        <CheckIcon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-gray-800">Enhanced UX</h5>
                                        <p className="text-sm text-gray-500">Smooth animations improve user engagement</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 mt-4">
                                    <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                                            <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                                            <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.71 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                                            <path d="M4.462 19.462c.42-.419.753-.89.98-1.375.227.485.56.956.98 1.375L8.2 21.24a3 3 0 0 0 4.24 0l2.777-2.777a3 3 0 0 0 0-4.24l-2.777-2.777a3 3 0 0 0-4.24 0l-2.777 2.777a3 3 0 0 0 0 4.24Z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-gray-800">Modern Aesthetics</h5>
                                        <p className="text-sm text-gray-500">Clean design with subtle effects</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Headless UI Components */}
                    <ComponentSection
                        title="Headless UI Components"
                        description="Components built with Headless UI library."
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Dialog */}
                            <div>
                                <h4 className="font-medium mb-2">Dialog</h4>
                                <SecondaryButton onClick={() => setIsDialogOpen(true)}>Open Dialog</SecondaryButton>

                                <HeadlessDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                                    <HeadlessDialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        <HeadlessDialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                            Payment successful
                                        </HeadlessDialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Your payment has been successfully submitted. We've sent you an email with all of the details of your order.
                                            </p>
                                        </div>
                                        <div className="mt-4">
                                            <AnimatedButton
                                                variant="primary"
                                                onClick={() => setIsDialogOpen(false)}
                                            >
                                                Got it, thanks!
                                            </AnimatedButton>
                                        </div>
                                    </HeadlessDialog.Panel>
                                </HeadlessDialog>
                            </div>

                            {/* Switch */}
                            <div>
                                <h4 className="font-medium mb-2">Switch</h4>
                                <div className="flex items-center">
                                    <HeadlessSwitch
                                        checked={switchEnabled}
                                        onChange={setSwitchEnabled}
                                        className={`${switchEnabled ? 'bg-accent' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2`}
                                    >
                                        <span
                                            className={`${switchEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                        />
                                    </HeadlessSwitch>
                                    <span className="ml-3 text-gray-700">
                                        {switchEnabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                            </div>

                            {/* Popover */}
                            <div>
                                <h4 className="font-medium mb-2">Popover</h4>
                                <HeadlessPopover>
                                    <HeadlessPopover.Button>
                                        Solutions
                                    </HeadlessPopover.Button>
                                    <HeadlessPopover.Panel className="absolute z-10">
                                        <div className="grid grid-cols-2 gap-4">
                                            <a href="#" className="p-3 hover:bg-gray-100 rounded-lg">
                                                <div className="font-medium">Analytics</div>
                                                <div className="text-sm text-gray-500">View insights</div>
                                            </a>
                                            <a href="#" className="p-3 hover:bg-gray-100 rounded-lg">
                                                <div className="font-medium">Reporting</div>
                                                <div className="text-sm text-gray-500">Generate reports</div>
                                            </a>
                                        </div>
                                    </HeadlessPopover.Panel>
                                </HeadlessPopover>
                            </div>

                            {/* Disclosure */}
                            <div>
                                <h4 className="font-medium mb-2">Disclosure</h4>
                                <HeadlessDisclosure>
                                    <HeadlessDisclosure.Button className="flex w-full justify-between rounded-lg bg-gray-100 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-accent focus-visible:ring-opacity-75">
                                        <span>What is your refund policy?</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </HeadlessDisclosure.Button>
                                    <HeadlessDisclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                        If you're unhappy with your purchase for any reason, email us within 90 days and we'll refund you in full, no questions asked.
                                    </HeadlessDisclosure.Panel>
                                </HeadlessDisclosure>
                            </div>
                        </div>
                    </ComponentSection>

                    {/* Feedback Components */}
                    <ComponentSection
                        title="Feedback Components"
                        description="Components used to provide feedback to users."
                    >
                        <div className="space-y-4">
                            {/* Modal */}
                            <div>
                                <SecondaryButton onClick={() => setIsModalOpen(true)}>Open Modal</SecondaryButton>

                                <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                                    <div className="p-6">
                                        <h2 className="text-lg font-medium text-gray-900">Modal Title</h2>
                                        <p className="mt-2 text-sm text-gray-600">
                                            This is a modal dialog that can be used to display important information or collect user input.
                                        </p>
                                        <div className="mt-4 flex justify-end">
                                            <SecondaryButton onClick={() => setIsModalOpen(false)} className="mr-2">Cancel</SecondaryButton>
                                            <PrimaryButton onClick={() => setIsModalOpen(false)}>Confirm</PrimaryButton>
                                        </div>
                                    </div>
                                </Modal>
                            </div>

                            {/* Status Badges */}
                            <div>
                                <h4 className="font-medium mb-2">Status Badges</h4>
                                <div className="flex flex-wrap gap-2">
                                    <StatusBadge status="available">Available</StatusBadge>
                                    <StatusBadge status="reserved">Reserved</StatusBadge>
                                    <StatusBadge status="sold">Sold</StatusBadge>
                                    <StatusBadge status="pending">Pending</StatusBadge>
                                    <StatusBadge status="maintenance">Maintenance</StatusBadge>
                                </div>
                            </div>
                        </div>
                    </ComponentSection>

                    {/* Typography */}
                    <ComponentSection
                        title="Typography"
                        description="Text styling examples to demonstrate typography throughout the application."
                    >
                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-gray-900">Heading 1</h1>
                            <h2 className="text-2xl font-bold text-gray-900">Heading 2</h2>
                            <h3 className="text-xl font-bold text-gray-900">Heading 3</h3>
                            <h4 className="text-lg font-bold text-gray-900">Heading 4</h4>
                            <p className="text-base text-gray-700">Regular paragraph text. The quick brown fox jumps over the lazy dog.</p>
                            <p className="text-sm text-gray-600">Small text for less emphasis or secondary information.</p>
                            <div>
                                <span className="text-accent font-medium">Accent Text</span> -
                                <span className="text-green-600">Success Text</span> -
                                <span className="text-red-600">Error Text</span> -
                                <span className="text-yellow-600">Warning Text</span>
                            </div>
                        </div>
                    </ComponentSection>

                    {/* Color Palette */}
                    <ComponentSection
                        title="Color Palette"
                        description="Showcasing the application's color palette in both light and dark modes."
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <div className="h-16 rounded-md bg-accent"></div>
                                <p className="text-sm font-medium">Accent</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-16 rounded-md bg-accent-dark"></div>
                                <p className="text-sm font-medium">Accent Dark</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-16 rounded-md bg-accent-light"></div>
                                <p className="text-sm font-medium">Accent Light</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-16 rounded-md bg-white border border-gray-200"></div>
                                <p className="text-sm font-medium">Background</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-16 rounded-md bg-gray-100"></div>
                                <p className="text-sm font-medium">Background Alt</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-16 rounded-md bg-gray-900"></div>
                                <p className="text-sm font-medium">Text Primary</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-16 rounded-md bg-gray-700"></div>
                                <p className="text-sm font-medium">Text Secondary</p>
                            </div>
                            <div className="space-y-2">
                                <div className="h-16 rounded-md bg-gray-300"></div>
                                <p className="text-sm font-medium">Border</p>
                            </div>
                        </div>
                    </ComponentSection>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
