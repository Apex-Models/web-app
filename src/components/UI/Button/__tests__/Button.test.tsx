import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../index'

describe('Button Component', () => {
  const defaultProps = {
    title: 'Click me',
    onClick: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Button {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('type', 'button')
    })

    it('should render with custom title', () => {
      render(<Button {...defaultProps} title="Custom Title" />)
      
      expect(screen.getByRole('button', { name: 'Custom Title' })).toBeInTheDocument()
    })

    it('should render with custom type', () => {
      render(<Button {...defaultProps} type="submit" />)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('should render with custom name and value', () => {
      render(<Button {...defaultProps} name="test-button" value="test-value" />)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toHaveAttribute('name', 'test-button')
      expect(button).toHaveAttribute('value', 'test-value')
    })

    it('should render with custom style class', () => {
      render(<Button {...defaultProps} style="primary" />)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toHaveClass('primary')
    })

    it('should render without style class when style is not provided', () => {
      render(<Button {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toHaveClass('btn')
      expect(button).not.toHaveClass('primary')
    })
  })

  describe('User Interactions', () => {
    it('should call onClick when clicked', () => {
      const mockOnClick = jest.fn()
      render(<Button {...defaultProps} onClick={mockOnClick} />)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      fireEvent.click(button)
      
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when not provided', () => {
      render(<Button title="Click me" />)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(() => fireEvent.click(button)).not.toThrow()
    })

    it('should be focusable', () => {
      render(<Button {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      button.focus()
      
      expect(button).toHaveFocus()
    })

    it('should be keyboard accessible', async () => {
      const mockOnClick = jest.fn()
      const user = userEvent.setup()
      render(<Button {...defaultProps} onClick={mockOnClick} />)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      await user.click(button)
      
      expect(mockOnClick).toHaveBeenCalledTimes(1)
      
      // Test space key
      await user.keyboard(' ')
      expect(mockOnClick).toHaveBeenCalledTimes(2)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Button {...defaultProps} />)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toHaveAttribute('type', 'button')
    })

    it('should be accessible to screen readers', () => {
      render(<Button {...defaultProps} title="Accessible Button" />)
      
      expect(screen.getByRole('button', { name: 'Accessible Button' })).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty title gracefully', () => {
      render(<Button title="" onClick={jest.fn()} />)
      
      const button = screen.getByRole('button', { name: '' })
      expect(button).toBeInTheDocument()
    })

    it('should handle very long titles', () => {
      const longTitle = 'A'.repeat(1000)
      render(<Button title={longTitle} onClick={jest.fn()} />)
      
      const button = screen.getByRole('button', { name: longTitle })
      expect(button).toBeInTheDocument()
      expect(button.textContent).toBe(longTitle)
    })

    it('should handle special characters in title', () => {
      const specialTitle = 'Button with émojis 🚀 and special chars!@#'
      render(<Button title={specialTitle} onClick={jest.fn()} />)
      
      const button = screen.getByRole('button', { name: specialTitle })
      expect(button).toBeInTheDocument()
      expect(button.textContent).toBe(specialTitle)
    })
  })

  describe('Integration', () => {
    it('should work with form submission', () => {
      render(
        <form>
          <Button type="submit" title="Submit Form" />
        </form>
      )
      
      const button = screen.getByRole('button', { name: 'Submit Form' })
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('should work with form reset', () => {
      render(
        <form>
          <Button type="reset" title="Reset Form" />
        </form>
      )
      
      const button = screen.getByRole('button', { name: 'Reset Form' })
      expect(button).toHaveAttribute('type', 'reset')
    })
  })
})
