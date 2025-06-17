import axios from 'axios'

export const apiNodeServer = axios.create({
  baseURL: "http://localhost:5000"
})

export const apiAIServer = axios.create({
  baseURL: window.api.AI_SERVER_URL
})

