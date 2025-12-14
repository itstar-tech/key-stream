import React, { forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            helperText,
            fullWidth = false,
            leftIcon,
            rightIcon,
            className = '',
            ...props
        },
        ref
    ) => {
        const containerClasses = [
            styles.container,
            fullWidth ? styles.fullWidth : '',
        ]
            .filter(Boolean)
            .join(' ');

        const inputWrapperClasses = [
            styles.inputWrapper,
            leftIcon ? styles.hasLeftIcon : '',
            rightIcon ? styles.hasRightIcon : '',
            error ? styles.error : '',
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={containerClasses}>
                {label && (
                    <label className={styles.label}>
                        {label}
                    </label>
                )}

                <div className={inputWrapperClasses}>
                    {leftIcon && (
                        <span className={styles.leftIcon}>{leftIcon}</span>
                    )}

                    <input
                        ref={ref}
                        className={`${styles.input} ${className}`}
                        {...props}
                    />

                    {rightIcon && (
                        <span className={styles.rightIcon}>{rightIcon}</span>
                    )}
                </div>

                {error && (
                    <span className={styles.errorText}>{error}</span>
                )}

                {helperText && !error && (
                    <span className={styles.helperText}>{helperText}</span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';