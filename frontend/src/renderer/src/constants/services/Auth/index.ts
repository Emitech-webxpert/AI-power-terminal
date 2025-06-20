import { apiNodeServer } from '@renderer/constants'
import { ISignUpRequest,ISignInRequest } from '@renderer/type/auth'

export const signUp = async (data: ISignUpRequest) => {
  const response = await apiNodeServer.post('/users/signUp', data)
  return response.data
}
export const signIn = async (data: ISignInRequest) => {
  const response = await apiNodeServer.post('/users/signIn', data)
  return response.data
}

