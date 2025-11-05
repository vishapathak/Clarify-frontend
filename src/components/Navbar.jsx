'use client'

import { Fragment, useState, useEffect } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // ✅ Check for auth token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setIsAuthenticated(!!token)
  }, [])

  return (
    <div className="bg-white relative">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Mobile Links */}
            <div className="px-4 py-6 space-y-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block text-gray-700">Dashboard</Link>
                  <Link to="/invoices" className="block text-gray-700">Invoices</Link>
                  <Link to="/bills" className="block text-gray-700">Bills</Link>
                  <Link to="/profile" className="block text-gray-700">Profile</Link>
                </>
              ) : (
                <>
                  <Link to="/" className="block text-gray-700">Home</Link>
                  <Link to="/#about" className="block text-gray-700">About</Link>
                  <Link to="/#contact" className="block text-gray-700">Contact</Link>
                  <Link to="/login" className="block text-gray-700">Sign in</Link>
                  <Link to="/register" className="block text-gray-700">Create account</Link>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop Navbar */}
      <header className="relative bg-white">
        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link to="/">
                  <span className="sr-only">Your Company</span>
                  <img
                    alt="Logo"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                    className="h-8 w-auto"
                  />
                </Link>
              </div>

              {/* Navigation Links */}
              <div className="flex gap-8 mx-8">
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/invoices">Invoices</Link>
                    <Link to="/bills">Bills</Link>
                    <Link to="/quotations">Quotations</Link>
                  </>
                ) : (
                  <>
                    <Link to="/">Home</Link>
                    <Link to="/#about">About</Link>
                    <Link to="/#contact">Contact</Link>
                  </>
                )}
              </div>

              {/* Right Side Options */}
              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {isAuthenticated ? (
                    <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                      Profile
                    </Link>
                  ) : (
                    <>
                      <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                        Sign in
                      </Link>
                      <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                      <Link to="/register" className="text-sm font-medium text-gray-700 hover:text-gray-800">
                        Create account
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
