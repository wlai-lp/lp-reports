'use client'

import './globals.css'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeProvider } from './context/ThemeContext'
import ThemeToggle from './components/ThemeToggle'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isReportsOpen, setIsReportsOpen] = useState(false)
  const pathname = usePathname()

  const isReportActive = pathname?.startsWith('/reports')
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en" className="light">
      <body>
        <ThemeProvider>
          {isLoginPage ? (
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
              {children}
            </main>
          ) : (
            <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
              {/* Sidebar */}
              <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
                <div className="flex flex-col h-full">
                  {/* Logo */}
                  <div className="flex items-center justify-center h-16 border-b">
                    <span className="text-xl font-bold text-gray-800 dark:text-white">{process.env.NEXT_PUBLIC_DASHBOARD_TITLE}</span>
                  </div>
                  
                  {/* Navigation Links */}
                  <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link 
                      href="/dashboard" 
                      className={`flex items-center px-4 py-2.5 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${
                        pathname === '/dashboard' ? 'bg-gray-100 dark:bg-gray-800' : ''
                      }`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </Link>
                    
                    {/* Reports Dropdown */}
                    <div>
                      <button
                        onClick={() => setIsReportsOpen(!isReportsOpen)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${
                          isReportActive ? 'bg-gray-100 dark:bg-gray-800' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Reports
                        </div>
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isReportsOpen ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Submenu */}
                      <div
                        className={`mt-2 ml-6 space-y-2 ${
                          isReportsOpen ? 'block' : 'hidden'
                        }`}
                      >
                        <Link
                          href="/reports/daily"
                          className={`flex items-center px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${
                            pathname === '/reports/daily' ? 'bg-gray-100 dark:bg-gray-800' : ''
                          }`}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Daily Report
                        </Link>
                        <Link
                          href="/reports/conversation"
                          className={`flex items-center px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${
                            pathname === '/reports/conversation' ? 'bg-gray-100 dark:bg-gray-800' : ''
                          }`}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          Conversation Details
                        </Link>
                        <Link
                          href="/reports/branch"
                          className={`flex items-center px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${
                            pathname === '/reports/branch' ? 'bg-gray-100 dark:bg-gray-800' : ''
                          }`}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Branch Report
                        </Link>
                      </div>
                    </div>
                    
                    <Link 
                      href="/settings" 
                      className={`flex items-center px-4 py-2.5 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${
                        pathname === '/settings' ? 'bg-gray-100 dark:bg-gray-800' : ''
                      }`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                  </nav>
                  
                  {/* Bottom Section with Theme Toggle and Profile */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <div className="flex items-center justify-between px-4 py-2.5 text-gray-700 dark:text-gray-300">
                      <span className="text-sm font-medium">Theme</span>
                      <ThemeToggle />
                    </div>
                    
                    <Link 
                      href="/profile" 
                      className={`flex items-center px-4 py-2.5 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${
                        pathname === '/profile' ? 'bg-gray-100 dark:bg-gray-800' : ''
                      }`}
                    >
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Main Content */}
              <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
                {children}
              </div>
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}
