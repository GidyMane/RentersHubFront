// Add this new file to handle API requests

export async function fetchConnections(baseUrl: string) {
    try {
      const response = await fetch(`${baseUrl}accounts/connections`)
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
  
      const data = await response.json()
  
      // Log the response structure to help debug
      console.log("API Response Structure:", {
        isArray: Array.isArray(data),
        type: typeof data,
        keys: data ? Object.keys(data) : null,
      })
  
      // Handle different response formats
      if (Array.isArray(data)) {
        return data
      } else if (data && typeof data === "object") {
        // Some APIs wrap arrays in properties like 'results', 'data', 'items', etc.
        if (data.results && Array.isArray(data.results)) {
          return data.results
        } else if (data.data && Array.isArray(data.data)) {
          return data.data
        } else if (data.items && Array.isArray(data.items)) {
          return data.items
        }
  
        // If we can't find an array in common properties, check if the object itself
        // has the expected connection properties and wrap it in an array
        if (data.id && data.connectionfullname) {
          return [data]
        }
      }
  
      // If we can't determine the structure, return an empty array
      console.error("Unexpected API response format:", data)
      return []
    } catch (error) {
      console.error("Error fetching connections:", error)
      throw error
    }
  }
  
  export async function fetchConnectionById(baseUrl: string, id: string) {
    try {
      const response = await fetch(`${baseUrl}accounts/connection/${id}/`)
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
  
      return await response.json()
    } catch (error) {
      console.error(`Error fetching connection ${id}:`, error)
      throw error
    }
  }
  
  export async function createConnection(baseUrl: string, connectionData: any) {
    try {
      const response = await fetch(`${baseUrl}accounts/connections/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(connectionData),
      })
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
  
      return await response.json()
    } catch (error) {
      console.error("Error creating connection:", error)
      throw error
    }
  }
  
  export async function updateConnection(baseUrl: string, id: string, connectionData: any) {
    try {
      const response = await fetch(`${baseUrl}accounts/connection/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(connectionData),
      })
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
  
      return await response.json()
    } catch (error) {
      console.error(`Error updating connection ${id}:`, error)
      throw error
    }
  }
  
  export async function deleteConnection(baseUrl: string, id: string) {
    try {
      const response = await fetch(`${baseUrl}accounts/connection/${id}/`, {
        method: "DELETE",
      })
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
  
      return true
    } catch (error) {
      console.error(`Error deleting connection ${id}:`, error)
      throw error
    }
  }
  
  