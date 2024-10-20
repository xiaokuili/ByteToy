'use client';
import Link from 'next/link';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};
const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
  { name: 'Reports', href: '#', current: false },
];
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`${
        isScrolled ? 'h-16' : 'h-24'
      } bg-black flex items-center justify-between px-6 fixed top-0 left-0 right-0 transition-all duration-300 z-50`}
    >
      <div className="flex space-x-8 items-center">
        <div className="flex space-x-3 items-center">
          <span className="bg-blue-500 h-10 w-10 flex items-center justify-center flex-shrink-0">
            <Logo />
          </span>
          <span className="text-white text-2xl font-bold">
            <LogoName />
          </span>
        </div>
        {/* mean */}
        <div className="hidden md:block">
          <div className="flex  items-center cursor-pointer">
            <NavItem>Products</NavItem>
            <NavItem>Solutions</NavItem>
            <NavItem>Enterprise</NavItem>
            <NavItem>Pricing</NavItem>
          </div>
        </div>
      </div>
      {/* contact */}
      <div className="flex items-center space-x-4">
        <div className="cursor-pointer text-white hover:text-gray-300">
          <GlobalizationIcon />
        </div>
        <div className="hidden md:block">
          <div className="flex items-center ">
            <NavItem>Contact sales</NavItem>
            <NavItem>Get app</NavItem>
          </div>
        </div>
        <div className="flex item-center">
          <NavItem>Sign up</NavItem>
          <NavItem>Log in</NavItem>
        </div>
        <Button className="bg-white text-black font-semibold text-md py-6 rounded-2xl">
          Get Started
        </Button>
      </div>

      {/* start button */}
    </div>
  );
}

const Logo = () => (
  <svg className="h-8 w-8" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.70076 0.320312L0.478516 4.91332L7.70076 9.50633L14.9242 4.91332L22.1465 9.50633L29.3687 4.91332L22.1465 0.320312L14.9242 4.91332L7.70076 0.320312Z"
      fill="#F7F5F2"
    />
    <path
      d="M7.70076 18.6925L0.478516 14.0994L7.70076 9.50633L14.9242 14.0994L7.70076 18.6925Z"
      fill="#F7F5F2"
    />
    <path
      d="M14.9242 14.0994L22.1465 9.50633L29.3687 14.0994L22.1465 18.6925L14.9242 14.0994Z"
      fill="#F7F5F2"
    />
    <path
      d="M14.9242 24.8164L7.70077 20.2234L14.9242 15.6304L22.1465 20.2234L14.9242 24.8164Z"
      fill="#F7F5F2"
    />
  </svg>
);
const LogoName = ({ className = '', width = 93, height = 22 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 93 22"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M79.0027 17.1956L83.8346 10.6951L79.3777 4.55302H83.1948L85.7762 8.38529L88.3798 4.55302H92.1748L87.6517 10.6731L92.4175 17.1956H88.6666L85.7321 13.0709L82.8859 17.1956H79.0027Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M66.8534 11.1269C66.8534 15.2995 69.1327 17.5177 73.1703 17.5177C76.9474 17.5177 79.5089 15.2995 79.5089 11.1269V10.7755C79.5089 6.55884 76.904 4.23092 73.1703 4.23092C69.5234 4.23092 66.8534 6.51492 66.8534 10.7755V11.1269ZM76.2184 11.1278C76.2184 13.4426 75.0645 14.6993 73.1702 14.6993C71.2978 14.6993 70.1438 13.4206 70.1438 11.1278V10.8192C70.1438 8.35003 71.3631 7.04932 73.192 7.04932C75.0427 7.04932 76.2184 8.43822 76.2184 10.8192V11.1278Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M55.8155 14.8834C56.5002 16.5079 57.8695 17.5177 59.9678 17.5177C63.2144 17.5177 65.3347 15.1468 65.3347 10.932V10.5588C65.3347 6.34398 63.0819 4.25851 60.0561 4.23656C58.0462 4.23656 56.6327 5.1366 55.926 6.78302V0.285156H52.6793V17.1884H55.5505L55.8155 14.8834ZM62.0443 10.9622C62.0443 13.4682 60.8862 14.6993 58.9851 14.6993C57.1715 14.6993 55.9697 13.3363 55.9697 10.9622V10.6984C55.9697 8.52216 57.2152 7.04932 59.0288 7.04932C60.7769 7.04932 62.0443 8.32431 62.0443 10.6545V10.9622Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M38.252 4.56791V21.544H41.493V15.1865C42.1765 16.6635 43.5215 17.5672 45.5499 17.5672C48.5484 17.5672 50.9075 15.3849 50.9075 11.1967V10.844C50.9075 6.56753 48.7909 4.23092 45.5499 4.23092C43.4553 4.23092 42.0442 5.31105 41.3608 6.94227L41.03 4.56791H38.252ZM47.6171 11.1161C47.6171 13.4463 46.4152 14.6993 44.536 14.6993C42.7224 14.6993 41.5424 13.2924 41.5424 11.0502V10.8083C41.5424 8.45621 42.7661 7.04932 44.6016 7.04932C46.3278 7.04932 47.6171 8.30233 47.6171 10.8303V11.1161Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M23.8248 11.1269C23.8248 15.2995 26.1258 17.5177 30.1634 17.5177C33.9405 17.5177 36.4802 15.2995 36.4802 11.1269V10.7755C36.4802 6.55884 33.897 4.23092 30.1634 4.23092C26.5165 4.23092 23.8248 6.51492 23.8248 10.7755V11.1269ZM33.1898 11.1278C33.1898 13.4426 32.0141 14.6993 30.1416 14.6993C28.2692 14.6993 27.1152 13.4206 27.1152 11.1278V10.8192C27.1152 8.35003 28.3345 7.04932 30.1634 7.04932C32.0141 7.04932 33.1898 8.43822 33.1898 10.8192V11.1278Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.9659 17.1956H18.2854V11.3877C18.2854 8.70383 18.9493 7.75786 21.6934 7.75786H23.0654V4.39197H22.2466C19.8788 4.39197 18.5731 5.42593 18.0641 7.44987L17.6436 4.55228H14.9659V17.1956Z"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.285583 1.57357V17.1956H6.31261C10.2386 17.1956 13.1942 14.9151 13.1942 9.87184V8.7974C13.1942 3.77605 10.0622 1.57357 6.22439 1.57357H0.285583ZM3.57601 4.39197H6.08687C8.35455 4.39197 9.90375 5.82472 9.90375 8.97678V9.79235C9.90375 12.9444 8.39945 14.3772 6.19913 14.3772H3.57601V4.39197Z"
    />
  </svg>
);

const GlobalizationIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={`dig-UIIcon dig-UIIcon--standard h-6 w-6 ${className} `}
    role="presentation"
    focusable="false"
  >
    <path
      d="M11.75 4C6.535 4 4 6.535 4 11.75s2.535 7.75 7.75 7.75 7.75-2.535 7.75-7.75S16.965 4 11.75 4Zm5.714 4.5H14.87a9.237 9.237 0 0 0-.623-2.711A4.454 4.454 0 0 1 17.463 8.5ZM18 11.75c.002.586-.042 1.171-.133 1.75H14.97c.022-.579.03-1.167.03-1.75s-.008-1.171-.03-1.75h2.897c.09.579.135 1.164.133 1.75ZM11.75 18c-.616 0-1.3-.41-1.598-3h3.196c-.298 2.59-.982 3-1.598 3Zm-1.712-4.5c-.024-.524-.038-1.1-.038-1.75 0-.65.014-1.226.038-1.75h3.424c.024.524.038 1.1.038 1.75 0 .65-.014 1.226-.038 1.75h-3.424ZM5.5 11.75c-.002-.586.042-1.171.133-1.75H8.53c-.022.579-.03 1.167-.03 1.75s.008 1.171.03 1.75H5.633a11.074 11.074 0 0 1-.133-1.75Zm6.25-6.25c.616 0 1.3.41 1.598 3h-3.196c.298-2.59.982-3 1.598-3Zm-2.497.289A9.236 9.236 0 0 0 8.63 8.5H6.036a4.454 4.454 0 0 1 3.217-2.711ZM6.036 15H8.63c.07.93.28 1.844.623 2.711A4.453 4.453 0 0 1 6.037 15Zm8.21 2.711A9.237 9.237 0 0 0 14.87 15h2.594a4.454 4.454 0 0 1-3.217 2.711Z"
      fill="currentColor"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);
function NavItem({ children }) {
  return (
    <div className="text-white font-sans text-sm font-medium text-center leading-5 text-center whitespace-nowarp antialiased p-4">
      {children}
    </div>
  );
}
