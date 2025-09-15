import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { UserContextProvider } from '@/components/context/userContext'

// Mock data for tests
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
}

export const mockCartItem = {
  id: '1',
  name: 'Test Product',
  price: 29.99,
  quantity: 1,
  image: '/test-image.jpg',
}

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserContextProvider>
      {children}
    </UserContextProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Utility functions for common test scenarios
export const createMockFetchResponse = (data: unknown, status: number = 200) => {
  return Promise.resolve({
    json: () => Promise.resolve(data),
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
  })
}

export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
  }
}

export const waitForElementToBeRemoved = (element: Element | null) => {
  return new Promise<void>((resolve) => {
    if (!element) {
      resolve()
      return
    }
    
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect()
        resolve()
      }
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })
}
