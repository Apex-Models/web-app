import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { UserContextProvider } from '../userContext'

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ success: false }),
    ok: true,
    status: 200,
    statusText: 'OK',
  } as Response)
)

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn((key: string) => {
    if (key === 'cart') return '[]'
    if (key === 'user') return null
    return null
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
} as Storage
global.localStorage = localStorageMock

describe('UserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.clear()
    ;(global.fetch as jest.Mock).mockClear()
  })

  describe('UserContextProvider', () => {
    it('should render children', () => {
      render(
        <UserContextProvider>
          <div data-testid="test-child">Test Child</div>
        </UserContextProvider>
      )
      
      expect(screen.getByTestId('test-child')).toBeInTheDocument()
    })

    it('should handle authentication check on mount', async () => {
      render(
        <UserContextProvider>
          <div data-testid="test-child">Test Child</div>
        </UserContextProvider>
      )

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:4003/api/auth/me',
          { credentials: 'include' }
        )
      })

      expect(screen.getByTestId('test-child')).toBeInTheDocument()
    })

    it('should handle cart loading from localStorage', async () => {
      // Mock localStorage to return a cart
      const mockGetItem = jest.fn((key: string) => {
        if (key === 'cart') return '[{"id":"1","name":"Test","price":10,"quantity":1}]'
        return null
      })
      Object.defineProperty(global.localStorage, 'getItem', {
        value: mockGetItem,
        writable: true,
      })

      render(
        <UserContextProvider>
          <div data-testid="test-child">Test Child</div>
        </UserContextProvider>
      )

      expect(screen.getByTestId('test-child')).toBeInTheDocument()
    })
  })
})
