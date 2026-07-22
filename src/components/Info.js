import React from 'react';
import { motion } from 'framer-motion';

export function Info({ children, direction = 'left', delay = 0 }) {
    const offset = direction === 'left' ? 100 : direction === 'right' ? -100 : 0;
    const offsetY = direction === 'up' ? 50 : direction === 'down' ? -50 : 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: offset, y: offsetY }}
            whileInView={{ opacity: 1, x: 2, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.5, delay: delay, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
}