import React from 'react';
import styles from './Section.module.css';

interface SectionProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    actions?: React.ReactNode;
    className?: string;
}

export const Section: React.FC<SectionProps> = ({
                                                    children,
                                                    title,
                                                    subtitle,
                                                    actions,
                                                    className = '',
                                                }) => {
    return (
        <section className={`${styles.section} ${className}`}>
            {(title || subtitle || actions) && (
                <div className={styles.header}>
                    <div className={styles.headerText}>
                        {title && <h2 className={styles.title}>{title}</h2>}
                        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                    </div>
                    {actions && <div className={styles.actions}>{actions}</div>}
                </div>
            )}

            <div className={styles.content}>{children}</div>
        </section>
    );
};