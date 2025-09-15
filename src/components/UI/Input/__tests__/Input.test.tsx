import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from '../index'

describe('Input Component', () => {
  const defaultProps = {
    name: 'test-input',
    value: '',
    type: 'text',
    onChange: jest.fn(), // Ajout d'un onChange par défaut
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Input {...defaultProps} />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('name', 'test-input')
      expect(input).toHaveAttribute('type', 'text')
    })

    it('should render with label when provided', () => {
      render(<Input {...defaultProps} label="Test Label" />)
      
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
      expect(screen.getByText('Test Label')).toBeInTheDocument()
    })

    it('should render without label when not provided', () => {
      render(<Input {...defaultProps} />)
      
      expect(screen.queryByText('Test Label')).not.toBeInTheDocument()
    })

    it('should render with custom id when provided', () => {
      render(<Input {...defaultProps} id="custom-id" />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('id', 'custom-id')
    })

    it('should use name as id when id is not provided', () => {
      render(<Input {...defaultProps} />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('id', 'test-input')
    })

    it('should render with placeholder when provided', () => {
      render(<Input {...defaultProps} placeholder="Enter text here" />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('placeholder', 'Enter text here')
    })

    it('should render with required attribute when isRequired is true', () => {
      render(<Input {...defaultProps} isRequired={true} />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toBeRequired()
    })

    it('should render with autocomplete attribute when provided', () => {
      render(<Input {...defaultProps} autocomplete="email" />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toHaveAttribute('autocomplete', 'email')
    })

    it('should render with different input types', () => {
      const { rerender } = render(<Input {...defaultProps} type="email" />)
      expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'email')
      
      rerender(<Input {...defaultProps} type="password" />)
      expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password')
      
      rerender(<Input {...defaultProps} type="number" />)
      expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'number')
    })
  })

  describe('User Interactions', () => {
    it('should call onChange when value changes', async () => {
      const mockOnChange = jest.fn()
      const user = userEvent.setup()
      
      render(<Input {...defaultProps} onChange={mockOnChange} />)
      
      const input = screen.getByDisplayValue('')
      await user.type(input, 'test')
      
      expect(mockOnChange).toHaveBeenCalledTimes(4) // One for each character
    })

    it('should call onFocus when input is focused', async () => {
      const mockOnFocus = jest.fn()
      const user = userEvent.setup()
      
      render(<Input {...defaultProps} onFocus={mockOnFocus} />)
      
      const input = screen.getByDisplayValue('')
      await user.click(input)
      
      expect(mockOnFocus).toHaveBeenCalledTimes(1)
    })

    it('should handle controlled input value updates', () => {
      const { rerender } = render(<Input {...defaultProps} value="initial" />)
      
      let input = screen.getByDisplayValue('initial')
      expect(input).toHaveValue('initial')
      
      rerender(<Input {...defaultProps} value="updated" />)
      input = screen.getByDisplayValue('updated')
      expect(input).toHaveValue('updated')
    })

    it('should handle empty string values', () => {
      render(<Input {...defaultProps} value="" />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toHaveValue('')
    })

    it('should handle numeric values for number inputs', () => {
      render(<Input {...defaultProps} type="number" value={42} />)
      
      const input = screen.getByDisplayValue('42')
      expect(input).toHaveAttribute('type', 'number')
      expect(input).toHaveValue(42)
    })
  })

  describe('Accessibility', () => {
    it('should have proper label association', () => {
      render(<Input {...defaultProps} label="Test Label" />)
      
      const input = screen.getByLabelText('Test Label')
      const label = screen.getByText('Test Label')
      
      expect(input).toHaveAttribute('id', 'test-input')
      expect(label).toHaveAttribute('for', 'test-input')
    })

    it('should be accessible to screen readers', () => {
      render(<Input {...defaultProps} label="Test Label" />)
      
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
    })

    it('should indicate required fields', () => {
      render(<Input {...defaultProps} label="Test Label" isRequired={true} />)
      
      const input = screen.getByLabelText('Test Label')
      expect(input).toBeRequired()
    })

    it('should have proper ARIA attributes', () => {
      render(<Input {...defaultProps} label="Test Label" />)
      
      const input = screen.getByLabelText('Test Label')
      expect(input).toHaveAttribute('name', 'test-input')
      expect(input).toHaveAttribute('type', 'text')
    })
  })

  describe('Form Integration', () => {
    it('should work within a form context', () => {
      render(
        <form>
          <Input {...defaultProps} label="Test Label" />
        </form>
      )
      
      const input = screen.getByLabelText('Test Label')
      expect(input.closest('form')).toBeInTheDocument()
    })

    it('should submit form data correctly', async () => {
      const mockSubmit = jest.fn((e) => e.preventDefault())
      const user = userEvent.setup()
      
      render(
        <form onSubmit={mockSubmit}>
          <Input {...defaultProps} label="Test Label" />
          <button type="submit">Submit</button>
        </form>
      )
      
      const input = screen.getByLabelText('Test Label')
      const submitButton = screen.getByRole('button', { name: /submit/i })
      
      await user.type(input, 'test value')
      await user.click(submitButton)
      
      expect(mockSubmit).toHaveBeenCalledTimes(1)
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long values', () => {
      const longValue = 'A'.repeat(1000)
      render(<Input {...defaultProps} value={longValue} />)
      
      const input = screen.getByDisplayValue(longValue)
      expect(input).toHaveValue(longValue)
    })

    it('should handle special characters in values', () => {
      const specialValue = 'Special chars: émojis 🚀 !@#$%^&*()'
      render(<Input {...defaultProps} value={specialValue} />)
      
      const input = screen.getByDisplayValue(specialValue)
      expect(input).toHaveValue(specialValue)
    })

    it('should handle undefined onChange gracefully', () => {
      render(<Input {...defaultProps} onChange={undefined} />)
      
      const input = screen.getByDisplayValue('')
      expect(() => fireEvent.change(input, { target: { value: 'test' } })).not.toThrow()
    })

    it('should handle undefined onFocus gracefully', () => {
      render(<Input {...defaultProps} onFocus={undefined} />)
      
      const input = screen.getByDisplayValue('')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Styling and Classes', () => {
    it('should have correct CSS classes', () => {
      render(<Input {...defaultProps} />)
      
      const input = screen.getByDisplayValue('')
      const container = input.closest('div')
      
      expect(container).toHaveClass('input_cont')
      expect(input).toHaveClass('text_input')
    })

    it('should maintain class structure with different props', () => {
      const { rerender } = render(<Input {...defaultProps} />)
      
      let input = screen.getByDisplayValue('')
      let container = input.closest('div')
      
      expect(container).toHaveClass('input_cont')
      expect(input).toHaveClass('text_input')
      
      rerender(<Input {...defaultProps} isRequired={true} />)
      input = screen.getByDisplayValue('')
      container = input.closest('div')
      
      expect(container).toHaveClass('input_cont')
      expect(input).toHaveClass('text_input')
    })
  })
})
