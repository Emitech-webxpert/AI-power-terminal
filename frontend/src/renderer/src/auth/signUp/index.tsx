import React, { useEffect } from 'react'
import { SignInProps } from '@renderer/type'
import { useAppSelector, useAppDispatch } from '@renderer/store/hooks'
import {
    signUpUser,
    setSignUpName,
    setSignUpEmail,
    setSignUpPassword,
    setSignUpConfirmPassword,
    toggleSignUpShowPassword,
    toggleSignUpShowConfirmPassword,
    clearSignUpError,
    clearSignUpForm,
    clearAllSignUpFieldErrors,
    validateSignUpField,
    validateSignUpForm,
    selectSignUpName,
    selectSignUpEmail,
    selectSignUpPassword,
    selectSignUpConfirmPassword,
    selectSignUpShowPassword,
    selectSignUpShowConfirmPassword,
    selectSignUpIsLoading,
    selectSignUpError,
    selectSignUpFieldErrors,
    selectSignUpIsFormValid
} from '@renderer/store/slices/authSlice/signUp'

import SignUpForm from './signUpForm'
import OrDivider from '../../common/OrDivider'
import SocialButtons from '../../common/socialLogin'

const SignUp: React.FC<SignInProps> = ({ onLoginSuccess, onSignInClick }) => {
    const dispatch = useAppDispatch()

    // Redux state including validation
    const name = useAppSelector(selectSignUpName)
    const email = useAppSelector(selectSignUpEmail)
    const password = useAppSelector(selectSignUpPassword)
    const confirmPassword = useAppSelector(selectSignUpConfirmPassword)
    const showPassword = useAppSelector(selectSignUpShowPassword)
    const showConfirmPassword = useAppSelector(selectSignUpShowConfirmPassword)
    const isLoading = useAppSelector(selectSignUpIsLoading)
    const error = useAppSelector(selectSignUpError)
    const fieldErrors = useAppSelector(selectSignUpFieldErrors)
    const isFormValid = useAppSelector(selectSignUpIsFormValid)

    // Clear form when component mounts (when modal opens or switches)
    useEffect(() => {
        dispatch(clearSignUpForm())
        dispatch(clearAllSignUpFieldErrors())
    }, [dispatch])

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Clear any previous errors
        dispatch(clearSignUpError())
        
        // Validate entire form before submission
        dispatch(validateSignUpForm())
        
        // Check if form is valid after validation
        if (!isFormValid) {
            return
        }

        try {
            const result = await dispatch(signUpUser({ name, email, password, confirmPassword }))

            if (signUpUser.fulfilled.match(result)) {
                console.log('Sign up successful:', result.payload)

                localStorage.setItem('isLoggedIn', 'true')
                if (result.payload.token) {
                    localStorage.setItem('authToken', result.payload.token)
                }
                if (result.payload.user) {
                    localStorage.setItem('userData', JSON.stringify(result.payload.user))
                }

                onLoginSuccess()
            }
        } catch (err) {
            console.error('Unexpected error:', err)
        }
    }

    const handleFieldValidate = (field: string, value: string, additionalValue?: string) => {
        dispatch(validateSignUpField({ field, value, additionalValue }))
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSignUpName(e.target.value))
        // Clear API error when user starts typing
        if (error) {
            dispatch(clearSignUpError())
        }
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSignUpEmail(e.target.value))
        // Clear API error when user starts typing
        if (error) {
            dispatch(clearSignUpError())
        }
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSignUpPassword(e.target.value))
        // Clear API error when user starts typing
        if (error) {
            dispatch(clearSignUpError())
        }
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSignUpConfirmPassword(e.target.value))
        // Clear API error when user starts typing
        if (error) {
            dispatch(clearSignUpError())
        }
    }

    const handleSignInClick = () => {
        // Clear form before switching to SignIn
        dispatch(clearSignUpForm())
        dispatch(clearAllSignUpFieldErrors())
        
        if (onSignInClick) {
            onSignInClick()
        }
    }

    return (
        <div className="flex flex-col items-center justify-start h-screen overflow-auto text-white py-5">
            <div className="w-96 p-6 rounded-lg border border-dark terminal-dark-bg">
                <h2 className="text-4xl font-bold mb-0 mt-0 text-muted-two pb-1-half">Sign Up</h2>
                <p className="text-sm text-muted-two mb-4 mt-1">Create your account</p>

                <SignUpForm
                    name={name}
                    email={email}
                    password={password}
                    confirmPassword={confirmPassword}
                    showPassword={showPassword}
                    showConfirmPassword={showConfirmPassword}
                    isLoading={isLoading}
                    error={error}
                    fieldErrors={fieldErrors}
                    isFormValid={isFormValid}
                    onNameChange={handleNameChange}
                    onEmailChange={handleEmailChange}
                    onPasswordChange={handlePasswordChange}
                    onConfirmPasswordChange={handleConfirmPasswordChange}
                    onTogglePassword={() => dispatch(toggleSignUpShowPassword())}
                    onToggleConfirmPassword={() => dispatch(toggleSignUpShowConfirmPassword())}
                    onSubmit={handleSignUp}
                    onFieldValidate={handleFieldValidate}
                />

                <OrDivider />

                <SocialButtons
                    mode="signup"
                    disabled={isLoading}
                    onToggleClick={handleSignInClick}
                />
            </div>
        </div>
    )
}

export default SignUp