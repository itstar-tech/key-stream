import React from 'react';
import styles from './Container.module.css';

interface ContainerProps {
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
}

export const Container: React.FC<ContainerProps> = ({
                                                        children,
                                                        size = 'lg',
                                                        className = '',
                                                    }) => {
    const classNames = [styles.container, styles[size], className]
        .filter(Boolean)
        .join(' ');

    return <div className={classNames}>{children}</div>;
};