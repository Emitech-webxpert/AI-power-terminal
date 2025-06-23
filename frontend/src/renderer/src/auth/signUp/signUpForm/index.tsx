import React from 'react'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { SignUpFormProps } from "@renderer/type"

const SignUpForm: React.FC<SignUpFormProps> = ({
    name,
    email,
    password,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    isLoading,
    error,
    fieldErrors,
    isFormValid,
    onNameChange,
    onEmailChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onTogglePassword,
    onToggleConfirmPassword,
    onSubmit,
    onFieldValidate
}) => {
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        onNameChange(e)
        onFieldValidate('name', value)
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        onEmailChange(e)
        onFieldValidate('email', value)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        onPasswordChange(e)
        onFieldValidate('password', value)
        // Also validate confirm password if it has a value
        if (confirmPassword) {
            onFieldValidate('confirmPassword', confirmPassword, value)
        }
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        onConfirmPasswordChange(e)
        onFieldValidate('confirmPassword', value, password)
    }

    return (
        <form onSubmit={onSubmit} className="flex flex-col">
            {/* API Error Message */}
            {error && (
                <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Name Input */}
            <div className="input-group-custom mb-3">
                <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className={`input-field w-full p-3 h-14 rounded-lg terminal-dark-bg text-base text-white border ${fieldErrors?.name
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-muted focus:border-blue'
                        } focus:outline-none ${name ? 'filled' : ''}`}
                    id="name"
                    required
                    disabled={isLoading}
                />
                <label htmlFor="name" className={`input-label-custom ${fieldErrors?.name ? 'text-red-400' : 'text-muted'}`}>
                    Name
                </label>
                {fieldErrors?.name && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>
                )}
            </div>

            {/* Email Input */}
            <div className="input-group-custom mb-3">
                <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`input-field w-full p-3 h-14 rounded-lg terminal-dark-bg text-base text-white border ${fieldErrors?.email
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-muted focus:border-blue'
                        } focus:outline-none ${email ? 'filled' : ''}`}
                    id="email"
                    required
                    disabled={isLoading}
                />
                <label htmlFor="email" className={`input-label-custom ${fieldErrors?.email ? 'text-red-400' : 'text-muted'}`}>
                    Email
                </label>
                {fieldErrors?.email && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
                )}
            </div>

            {/* Password Input */}
            <div className="input-group-custom relative mb-3">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    className={`input-field w-full p-3 h-14 pr-10 rounded-lg terminal-dark-bg text-base text-white border ${fieldErrors?.password
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-muted focus:border-blue'
                        } focus:outline-none ${password ? 'filled' : ''}`}
                    id="password"
                    placeholder="password"
                    required
                    disabled={isLoading}
                />
                <label htmlFor="password" className={`input-label-custom ${fieldErrors?.password ? 'text-red-400' : 'text-muted'}`}>
                    Password
                </label>
                <button
                    type="button"
                    className="absolute right-3 top-5 text-muted text-sm cursor-pointer bg-transparent border-0"
                    onClick={onTogglePassword}
                    disabled={isLoading}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {fieldErrors?.password && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
                )}
            </div>

            {/* Confirm Password Input */}
            <div className="input-group-custom relative mb-3">
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`input-field w-full p-3 h-14 pr-10 rounded-lg terminal-dark-bg text-base text-white border ${fieldErrors?.confirmPassword
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-muted focus:border-blue'
                        } focus:outline-none ${confirmPassword ? 'filled' : ''}`}
                    id="confirmPassword"
                    required
                    disabled={isLoading}
                />
                <label htmlFor="confirmPassword" className={`input-label-custom ${fieldErrors?.confirmPassword ? 'text-red-400' : 'text-muted'}`}>
                    Confirm Password
                </label>
                <button
                    type="button"
                    className="absolute right-3 top-5 text-muted text-sm cursor-pointer bg-transparent border-0"
                    onClick={onToggleConfirmPassword}
                    disabled={isLoading}
                >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {fieldErrors?.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">{fieldErrors.confirmPassword}</p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full py-3 rounded-lg button-bg border-0 h-12 text-white font-semibold hover:button-hover cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !isFormValid}
            >
                {isLoading ? (
                    <>
                        <Loader2 size={18} className="animate-spin" />
                        Creating account...
                    </>
                ) : (
                    'Sign up'
                )}
            </button>
        </form>
    )
}

export default SignUpForm