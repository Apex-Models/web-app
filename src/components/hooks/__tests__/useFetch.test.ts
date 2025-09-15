import { renderHook, act, waitFor } from '@testing-library/react'
import useFetch from '../useFetch'
import { createMockFetchResponse } from '@/test-utils/test-utils'

// Mock fetch globally
global.fetch = jest.fn()

// Mock environment variable
const originalEnv = process.env
beforeEach(() => {
  jest.clearAllMocks()
  process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: 'http://localhost:3000' }
})

afterEach(() => {
  process.env = originalEnv
})

describe('useFetch Hook', () => {
  const defaultParams = {
    url: 'test-endpoint',
    method: 'GET' as const,
  }

  describe('Initial State', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useFetch(defaultParams))
      
      expect(result.current.data).toBeUndefined()
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(typeof result.current.fetchData).toBe('function')
    })
  })

  describe('Successful API Calls', () => {
    it('should fetch data successfully', async () => {
      const mockResponse = createMockFetchResponse({
        code: 200,
        data: { message: 'Success' },
        message: 'OK'
      })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch(defaultParams))

      act(() => {
        result.current.fetchData()
      })

      expect(result.current.loading).toBe(true)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.data).toEqual({
        code: 200,
        data: { message: 'Success' },
        message: 'OK'
      })
      expect(result.current.error).toBeNull()
    })

    it('should handle successful response with code 200', async () => {
      const mockResponse = createMockFetchResponse({
        code: 200,
        data: { items: [1, 2, 3] }
      })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch(defaultParams))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.data?.code).toBe(200)
      expect(result.current.error).toBeNull()
    })

    it('should construct correct API URL', async () => {
      const mockResponse = createMockFetchResponse({ code: 200 })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch({ url: 'api/users', method: 'GET' }))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:3000/api/users',
          expect.objectContaining({
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            }
          })
        )
      })
    })
  })

  describe('HTTP Methods', () => {
    it('should handle GET requests', async () => {
      const mockResponse = createMockFetchResponse({ code: 200 })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch({ url: 'test', method: 'GET' }))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ method: 'GET' })
        )
      })
    })

    it('should handle POST requests with body', async () => {
      const mockResponse = createMockFetchResponse({ code: 200 })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const postData = { name: 'Test User', email: 'test@example.com' }
      const { result } = renderHook(() => useFetch({
        url: 'users',
        method: 'POST',
        body: postData
      }))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(postData)
          })
        )
      })
    })

    it('should handle PUT requests', async () => {
      const mockResponse = createMockFetchResponse({ code: 200 })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch({ url: 'users/1', method: 'PUT' }))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ method: 'PUT' })
        )
      })
    })

    it('should handle DELETE requests', async () => {
      const mockResponse = createMockFetchResponse({ code: 200 })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch({ url: 'users/1', method: 'DELETE' }))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({ method: 'DELETE' })
        )
      })
    })
  })

  describe('Authentication', () => {
    it('should include authorization header when token is provided', async () => {
      const mockResponse = createMockFetchResponse({ code: 200 })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch({
        url: 'protected-endpoint',
        method: 'GET',
        token: 'Bearer token123'
      }))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json',
              'authorization': 'Bearer token123'
            }
          })
        )
      })
    })

    it('should not include authorization header when token is not provided', async () => {
      const mockResponse = createMockFetchResponse({ code: 200 })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch(defaultParams))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: {
              'Content-Type': 'application/json'
            }
          })
        )
      })

      expect(global.fetch).not.toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            authorization: expect.anything()
          })
        })
      )
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors with non-200 codes', async () => {
      const mockResponse = createMockFetchResponse({
        code: 400,
        message: 'Bad Request'
      })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch(defaultParams))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Bad Request')
      expect(result.current.data?.code).toBe(400)
    })

    it('should handle network errors', async () => {
      const networkError = new Error('Network error')
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(networkError)

      const { result } = renderHook(() => useFetch(defaultParams))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Network error')
    })

    it('should handle non-Error objects in catch block', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce('String error')

      const { result } = renderHook(() => useFetch(defaultParams))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('String error')
    })

    it('should handle fetch errors gracefully', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Invalid URL'))

      const { result } = renderHook(() => useFetch(defaultParams))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Invalid URL')
    })
  })

  describe('Loading States', () => {
    it('should set loading to true when fetch starts', () => {
      const { result } = renderHook(() => useFetch(defaultParams))

      act(() => {
        result.current.fetchData()
      })

      expect(result.current.loading).toBe(true)
    })

    it('should set loading to false after fetch completes', async () => {
      const mockResponse = createMockFetchResponse({ code: 200 })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch(defaultParams))

      act(() => {
        result.current.fetchData()
      })

      expect(result.current.loading).toBe(true)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })

    it('should set loading to false even when error occurs', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Test error'))

      const { result } = renderHook(() => useFetch(defaultParams))

      act(() => {
        result.current.fetchData()
      })

      expect(result.current.loading).toBe(true)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
    })


  })

  describe('Request Configuration', () => {
    it('should always include credentials: include', async () => {
      const mockResponse = createMockFetchResponse({ code: 200 })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch(defaultParams))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            credentials: 'include'
          })
        )
      })
    })

    it('should always include Content-Type header', async () => {
      const mockResponse = createMockFetchResponse({ code: 200 })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch(defaultParams))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            headers: expect.objectContaining({
              'Content-Type': 'application/json'
            })
          })
        )
      })
    })

    it('should conditionally include body when provided', async () => {
      const mockResponse = createMockFetchResponse({ code: 200 })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch({
        url: 'test',
        method: 'POST',
        body: { test: 'data' }
      }))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            body: JSON.stringify({ test: 'data' })
          })
        )
      })
    })

    it('should not include body when not provided', async () => {
      const mockResponse = createMockFetchResponse({ code: 200 })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch(defaultParams))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.any(String),
          expect.objectContaining({
            method: 'GET'
          })
        )
      })

      expect(global.fetch).not.toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.anything()
        })
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty response body', async () => {
      const mockResponse = createMockFetchResponse({})
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch(defaultParams))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.data).toEqual({})
      expect(result.current.error).toBeNull()
    })

    it('should handle response without code property', async () => {
      const mockResponse = createMockFetchResponse({
        data: { message: 'Success' }
      })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch(defaultParams))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.data).toEqual({
        data: { message: 'Success' }
      })
      expect(result.current.error).toBeNull()
    })

    it('should handle multiple consecutive calls', async () => {
      const mockResponse1 = createMockFetchResponse({ code: 200, data: 'First call' })
      const mockResponse2 = createMockFetchResponse({ code: 200, data: 'Second call' })
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce(mockResponse1)
        .mockResolvedValueOnce(mockResponse2)

      const { result } = renderHook(() => useFetch(defaultParams))

      // First call
      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.data?.data).toBe('First call')

      // Second call
      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.data?.data).toBe('Second call')
    })
  })

  describe('Environment Variables', () => {
    it('should use NEXT_PUBLIC_API_URL from environment', async () => {
      process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com'
      
      const mockResponse = createMockFetchResponse({ code: 200 })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch(defaultParams))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.example.com/test-endpoint',
          expect.any(Object)
        )
      })
    })

    it('should handle missing environment variable gracefully', async () => {
      delete process.env.NEXT_PUBLIC_API_URL
      
      const mockResponse = createMockFetchResponse({ code: 200 })
      ;(global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse)

      const { result } = renderHook(() => useFetch(defaultParams))

      act(() => {
        result.current.fetchData()
      })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'undefined/test-endpoint',
          expect.any(Object)
        )
      })
    })
  })
})
