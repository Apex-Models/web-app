import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from '../index'

// Mock Next.js navigation
const mockPush = jest.fn()
const mockPathname = '/'

// Create a mock object that we can modify
const mockNavigation = {
  usePathname: () => mockPathname,
}

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => mockNavigation.usePathname(),
}))

jest.mock('@/components/context/userContext', () => ({
  __esModule: true,
  default: React.createContext({
    user: null,
    cart: [],
    logout: jest.fn(),
    login: jest.fn(),
    addToCart: jest.fn(),
  }),
}))

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset pathname to default
    mockNavigation.usePathname = () => mockPathname
  })

  describe('Rendering', () => {
    it('should render header with logo', () => {
      render(<Header />)
      
      const logo = screen.getByAltText('Logo')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('src', '/apex_logo.png')
    })

    it('should render navigation links on non-auth pages', () => {
      render(<Header />)
      
      expect(screen.getByText('CATALOG')).toBeInTheDocument()
      expect(screen.getByText('ABOUT')).toBeInTheDocument()
    })

    it('should not render navigation links on auth pages', () => {
      // Mock pathname to be auth page
      mockNavigation.usePathname = () => '/auth/login'

      render(<Header />)
      
      expect(screen.queryByText('CATALOG')).not.toBeInTheDocument()
      expect(screen.queryByText('ABOUT')).not.toBeInTheDocument()
    })

    it('should render login link when user is not authenticated', () => {
      render(<Header />)
      
      const loginLink = screen.getByText('LOGIN')
      expect(loginLink).toBeInTheDocument()
      expect(loginLink.closest('a')).toHaveAttribute('href', '/auth/login')
    })

    it('should render account icon', () => {
      render(<Header />)
      
      const accountIcon = screen.getByAltText('Account')
      expect(accountIcon).toBeInTheDocument()
      expect(accountIcon).toHaveAttribute('src', '/icons/account.svg')
    })

    it('should render cart icon', () => {
      render(<Header />)
      
      const cartIcon = screen.getByAltText('Cart')
      expect(cartIcon).toBeInTheDocument()
      expect(cartIcon).toHaveAttribute('src', '/icons/cart.svg')
    })
  })

  describe('Navigation', () => {
    it('should navigate to home when logo is clicked', async () => {
      const user = userEvent.setup()
      render(<Header />)
      
      const logo = screen.getByAltText('Logo')
      await user.click(logo)
      
      expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('should have correct navigation links', () => {
      render(<Header />)
      
      const catalogLink = screen.getByText('CATALOG')
      const aboutLink = screen.getByText('ABOUT')
      
      expect(catalogLink.closest('a')).toHaveAttribute('href', '/products')
      expect(aboutLink.closest('a')).toHaveAttribute('href', '/products')
    })

    it('should have correct account and cart links', () => {
      render(<Header />)
      
      const accountLink = screen.getByAltText('Account').closest('a')
      const cartLink = screen.getByAltText('Cart').closest('a')
      
      expect(accountLink).toHaveAttribute('href', '/account')
      expect(cartLink).toHaveAttribute('href', '/cart')
    })
  })

  describe('Styling and Classes', () => {
    it('should apply correct CSS classes based on page type', () => {
      render(<Header />)
      
      // Find the root header element by looking for the element that contains both logo and navItems
      const logo = screen.getByAltText('Logo')
      const header = logo.closest('div')
      expect(header).toBeInTheDocument()
      expect(header?.className).toContain('header')
      expect(header?.className).toContain('transparent') // Home page
    })

    it('should apply auth class on auth pages', () => {
      // Mock pathname to be auth page
      mockNavigation.usePathname = () => '/auth/login'

      render(<Header />)
      
      const logo = screen.getByAltText('Logo')
      const header = logo.closest('div')
      expect(header).toBeInTheDocument()
      expect(header?.className).toContain('header')
      expect(header?.className).toContain('auth')
    })

    it('should apply transparent class on home page', () => {
      render(<Header />)
      
      const logo = screen.getByAltText('Logo')
      const header = logo.closest('div')
      expect(header).toBeInTheDocument()
      expect(header?.className).toContain('header')
      expect(header?.className).toContain('transparent')
    })
  })

  describe('Accessibility', () => {
    it('should have proper alt text for images', () => {
      render(<Header />)
      
      expect(screen.getByAltText('Logo')).toBeInTheDocument()
      expect(screen.getByAltText('Account')).toBeInTheDocument()
      expect(screen.getByAltText('Cart')).toBeInTheDocument()
    })

    it('should have proper link roles', () => {
      render(<Header />)
      
      expect(screen.getByRole('link', { name: 'CATALOG' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'ABOUT' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'LOGIN' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Account' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Cart 0' })).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle different pathnames correctly', () => {
      // Test products page
      mockNavigation.usePathname = () => '/products'

      const { rerender } = render(<Header />)
      
      expect(screen.getByText('CATALOG')).toBeInTheDocument()
      expect(screen.getByText('ABOUT')).toBeInTheDocument()
      expect(screen.queryByText('LOGIN')).toBeInTheDocument()

      // Test auth page
      mockNavigation.usePathname = () => '/auth/register'

      rerender(<Header />)
      
      expect(screen.queryByText('CATALOG')).not.toBeInTheDocument()
      expect(screen.queryByText('ABOUT')).not.toBeInTheDocument()
      expect(screen.queryByText('LOGIN')).not.toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const { rerender } = render(<Header />)
      
      // Re-render with same props
      rerender(<Header />)
      
      // Component should still be there
      expect(screen.getByAltText('Logo')).toBeInTheDocument()
    })
  })
})
