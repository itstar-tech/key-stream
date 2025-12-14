import React from 'react';
import {Header} from './Header';
import {Container} from './Container';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
    containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    className?: string;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
                                                          children,
                                                          showHeader = true,
                                                          containerSize = 'lg',
                                                          className = '',
                                                      }) => {
    return (
        <div className={styles.layout}>
            {showHeader && <Header/>}

            <main className={`${styles.main} ${className}`}>
                <Container size={containerSize}>
                    {children}
                </Container>
            </main>
        </div>
    );
};