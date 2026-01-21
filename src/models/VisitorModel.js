import ApiRequest from "utils/ApiRequest"

export default class FormModel {
  // =============== HELPER METHOD ===============
  static handleResponse = (response) => {
    // Check berbagai kemungkinan response structure
    if (!response) return null;
    
    // Jika response langsung array (misal: [visitor1, visitor2])
    if (Array.isArray(response)) {
      return {
        http_code: 200,
        data: response,
        success: true
      };
    }
    
    // Jika response punya http_code/statusCode
    if (response.http_code || response.statusCode) {
      return response;
    }
    
    // Jika response punya data property
    if (response.data !== undefined) {
      return {
        http_code: 200,
        data: response.data,
        success: true
      };
    }
    
    // Default: anggap response adalah data langsung
    return {
      http_code: 200,
      data: response,
      success: true
    };
  }

  // =============== VISITORS ===============
  static getAllVisitors = async (params = {}) => {
    try {
      let queryString = ""
      if (Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams(params).toString()
        queryString = `?${queryParams}`
      }
      const response = await ApiRequest.set(`v1/visitor/all${queryString}`, "GET")
      return this.handleResponse(response)
    } catch (error) {
      console.error("Error getAllVisitors:", error)
      return {
        http_code: error.http_code || 500,
        error_message: error.error_message || "Failed to fetch visitors",
        data: []
      }
    }
  }

  static getVisitorById = async (id) => {
    try {
      const response = await ApiRequest.set(`v1/visitor/${id}`, "GET")
      return this.handleResponse(response)
    } catch (error) {
      console.error("Error getVisitorById:", error)
      return {
        http_code: error.http_code || 404,
        error_message: error.error_message || "Visitor not found",
        data: null
      }
    }
  }

  static createVisitor = async (body) => {
    try {
      const response = await ApiRequest.set("v1/visitor/create", "POST", body)
      return this.handleResponse(response)
    } catch (error) {
      console.error("Error createVisitor:", error)
      return {
        http_code: error.http_code || 500,
        error_message: error.error_message || "Failed to create visitor",
        data: null
      }
    }
  }

  static updateVisitor = async (id, body) => {
    try {
      const response = await ApiRequest.set(`v1/visitor/${id}`, "PUT", body)
      return this.handleResponse(response)
    } catch (error) {
      console.error("Error updateVisitor:", error)
      return {
        http_code: error.http_code || 500,
        error_message: error.error_message || "Failed to update visitor",
        data: null
      }
    }
  }

  static deleteVisitor = async (id) => {
    try {
      const response = await ApiRequest.set(`v1/visitor/${id}`, "DELETE")
      return this.handleResponse(response)
    } catch (error) {
      console.error("Error deleteVisitor:", error)
      return {
        http_code: error.http_code || 500,
        error_message: error.error_message || "Failed to delete visitor",
        data: null
      }
    }
  }

  static checkoutVisitor = async (id) => {
    try {
      const response = await ApiRequest.set(`v1/visitor/${id}/checkout`, "POST")
      return this.handleResponse(response)
    } catch (error) {
      console.error("Error checkoutVisitor:", error)
      return {
        http_code: error.http_code || 500,
        error_message: error.error_message || "Failed to checkout visitor",
        data: null
      }
    }
  }

  static getVisitorStats = async (params = {}) => {
    try {
      let queryString = ""
      if (Object.keys(params).length > 0) {
        const queryParams = new URLSearchParams(params).toString()
        queryString = `?${queryParams}`
      }
      const response = await ApiRequest.set(`v1/visitor/stats${queryString}`, "GET")
      return this.handleResponse(response)
    } catch (error) {
      console.error("Error getVisitorStats:", error)
      return {
        http_code: error.http_code || 500,
        error_message: error.error_message || "Failed to fetch stats",
        data: null
      }
    }
  }

  static searchVisitors = async (query) => {
    try {
      const response = await ApiRequest.set(`v1/visitor/search?query=${encodeURIComponent(query)}`, "GET")
      return this.handleResponse(response)
    } catch (error) {
      console.error("Error searchVisitors:", error)
      return {
        http_code: error.http_code || 500,
        error_message: error.error_message || "Failed to search visitors",
        data: []
      }
    }
  }

  static getVisitorByPhone = async (phone) => {
    try {
      const response = await ApiRequest.set(`v1/visitor/phone?phone=${encodeURIComponent(phone)}`, "GET")
      return this.handleResponse(response)
    } catch (error) {
      console.error("Error getVisitorByPhone:", error)
      return {
        http_code: error.http_code || 404,
        error_message: error.error_message || "Visitor not found",
        data: null
      }
    }
  }

  static getRecentActiveVisitors = async (limit = 10) => {
    try {
      const response = await ApiRequest.set(`v1/visitor/recent-active?limit=${limit}`, "GET")
      return this.handleResponse(response)
    } catch (error) {
      console.error("Error getRecentActiveVisitors:", error)
      return {
        http_code: error.http_code || 500,
        error_message: error.error_message || "Failed to fetch recent visitors",
        data: []
      }
    }
  }

  // =============== DEBUG FUNCTION ===============
  static debugAPI = async (endpoint, method = "GET", body = null) => {
    try {
      console.log(`DEBUG API: ${method} ${endpoint}`)
      const response = await ApiRequest.set(endpoint, method, body)
      console.log("DEBUG Response:", response)
      return response
    } catch (error) {
      console.error("DEBUG Error:", error)
      return error
    }
  }

  // =============== USERS (AUTH) ===============
  static login = async (username, password) => {
    try {
      const response = await ApiRequest.set("v1/user/login", "POST", { username, password })
      return this.handleResponse(response)
    } catch (error) {
      console.error("Error login:", error)
      return {
        http_code: error.http_code || 401,
        error_message: error.error_message || "Login failed",
        data: null
      }
    }
  }

  static getSelfData = async () => {
    try {
      const response = await ApiRequest.set("v1/user/self", "GET")
      return this.handleResponse(response)
    } catch (error) {
      console.error("Error getSelfData:", error)
      return {
        http_code: error.http_code || 401,
        error_message: error.error_message || "Failed to get user data",
        data: null
      }
    }
  }

  static getAllUsers = async () => {
    try {
      const response = await ApiRequest.set("v1/user/all", "GET")
      return this.handleResponse(response)
    } catch (error) {
      console.error("Error getAllUsers:", error)
      return {
        http_code: error.http_code || 500,
        error_message: error.error_message || "Failed to fetch users",
        data: []
      }
    }
  }

  // ... method lainnya tetap sama ...
  // =============== VALIDATION HELPER ===============
  static validateVisitorData = (data) => {
    const errors = {}

    if (!data.visitor_name || data.visitor_name.trim() === "") {
      errors.visitor_name = "Visitor name is required"
    }

    if (!data.phone_number || data.phone_number.trim() === "") {
      errors.phone_number = "Phone number is required"
    } else {
      const phoneRegex = /^[0-9+()-]+$/
      if (!phoneRegex.test(data.phone_number)) {
        errors.phone_number = "Invalid phone number format"
      }
    }

    if (!data.visitor_profile || data.visitor_profile.trim() === "") {
      errors.visitor_profile = "Visitor profile is required"
    } else if (data.visitor_profile === "Other" && (!data.visitor_profile_other || data.visitor_profile_other.trim() === "")) {
      errors.visitor_profile_other = "Please specify the visitor profile"
    }

    if (!data.filled_by || data.filled_by.trim() === "") {
      errors.filled_by = "Filled by field is required"
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  // =============== FORM TRANSFORMER ===============
  static transformVisitorFormData = (formData) => {
    return {
      visitor_name: formData.visitor_name?.trim() || "",
      phone_number: formData.phone_number?.trim() || "",
      visitor_profile: formData.visitor_profile || "Visitor",
      visitor_profile_other: formData.visitor_profile === "Other" ? formData.visitor_profile_other?.trim() : null,
      filled_by: formData.filled_by?.trim() || ""
    }
  }

  static transformVisitorForTable = (visitor) => {
    if (!visitor) return {};
    
    return {
      id: visitor.id,
      name: visitor.visitor_name,
      phone: visitor.phone_number,
      profile: visitor.visitor_profile,
      profileOther: visitor.visitor_profile_other,
      filledBy: visitor.filled_by,
      checkedOut: visitor.checked_out_at ? new Date(visitor.checked_out_at).toLocaleString() : "Not checked out",
      checkedOutRaw: visitor.checked_out_at,
      createdAt: visitor.created_at ? new Date(visitor.created_at).toLocaleString() : "",
      status: visitor.checked_out_at ? "checked-out" : "active"
    }
  }

  // =============== FILTER OPTIONS ===============
  static getVisitorProfileOptions = () => {
    return [
      { value: "Player", label: "Player" },
      { value: "Visitor", label: "Visitor" },
      { value: "Other", label: "Other" }
    ]
  }

  static getFilterOptions = () => {
    return {
      status: [
        { value: "all", label: "All Visitors" },
        { value: "active", label: "Active Only" },
        { value: "checked-out", label: "Checked Out Only" }
      ],
      profile: [
        { value: "", label: "All Profiles" },
        { value: "Player", label: "Player" },
        { value: "Visitor", label: "Visitor" },
        { value: "Other", label: "Other" }
      ]
    }
  }

  // =============== EXPORT/IMPORT ===============
  static exportVisitorsToCSV = (visitors) => {
    if (!visitors || visitors.length === 0) return ""
    
    const headers = ["ID", "Name", "Phone", "Profile", "Profile Other", "Filled By", "Checkout Time", "Created At"]
    const rows = visitors.map(visitor => [
      visitor.id,
      `"${visitor.visitor_name}"`,
      `"${visitor.phone_number}"`,
      visitor.visitor_profile,
      visitor.visitor_profile_other ? `"${visitor.visitor_profile_other}"` : "",
      `"${visitor.filled_by}"`,
      visitor.checked_out_at ? new Date(visitor.checked_out_at).toLocaleString() : "",
      visitor.created_at ? new Date(visitor.created_at).toLocaleString() : ""
    ])
    
    return [headers, ...rows].map(row => row.join(",")).join("\n")
  }

  // =============== DASHBOARD STATS ===============
  static calculateStats = (visitors) => {
    if (!visitors || !Array.isArray(visitors)) {
      return {
        total: 0,
        today: 0,
        active: 0,
        byProfile: { Player: 0, Visitor: 0, Other: 0 }
      }
    }
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const todayVisitors = visitors.filter(v => 
      v.created_at && new Date(v.created_at) >= today
    )
    
    const activeVisitors = visitors.filter(v => !v.checked_out_at)
    
    const byProfile = {
      Player: visitors.filter(v => v.visitor_profile === "Player").length,
      Visitor: visitors.filter(v => v.visitor_profile === "Visitor").length,
      Other: visitors.filter(v => v.visitor_profile === "Other").length
    }
    
    return {
      total: visitors.length,
      today: todayVisitors.length,
      active: activeVisitors.length,
      byProfile
    }
  }
}

// Optional: Buat instance juga kalo butuh
export const formModel = new FormModel()