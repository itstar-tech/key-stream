import React from 'react';
import styles from './Flex.module.css';

interface FlexProps {
    children: React.ReactNode;
    direction?: 'row' | 'column';
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around';
    gap?: 'sm' | 'md' | 'lg';
    wrap?: boolean;
    className?: string;
}

export const Flex: React.FC<FlexProps> = ({
                                              children,
                                              direction = 'row',
                                              align = 'start',
                                              justify = 'start',
                                              gap = 'md',
                                              wrap = false,
                                              className = '',
                                          }) => {
    const classNames = [
        styles.flex,
        styles[direction],
        styles[`align${align.charAt(0).toUpperCase() + align.slice(1)}`],
        styles[`justify${justify.charAt(0).toUpperCase() + justify.slice(1)}`],
        styles[`gap${gap.charAt(0).toUpperCase() + gap.slice(1)}`],
        wrap ? styles.wrap : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return <div className={classNames}>{children}</div>;
};