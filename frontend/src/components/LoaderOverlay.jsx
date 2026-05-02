import { motion } from 'framer-motion';
import { Layout } from 'lucide-react';
import { useEffect, useState } from 'react';

const LoaderOverlay = ({ isLoading, onAnimationComplete }) => {
    // Determine if we should show the loading content (logo/text)
    // We show it when isLoading is true.

    return (
        <>
            {/* Logo Layer (Fades out first when loading finishes) */}
            <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
                initial={{ opacity: 1 }}
                animate={{ opacity: isLoading ? 1 : 0 }}
                transition={{
                    duration: 0.5,
                    delay: isLoading ? 0.5 : 0.2 // Delay appearance on close so iris covers first
                }}
                onAnimationComplete={() => {
                    if (!isLoading && onAnimationComplete) onAnimationComplete();
                }}
            >
                {/* Green background behind logo to cover the iris hole - matches theme color */}
                <motion.div
                    className="absolute bg-primary-600 rounded-full"
                    style={{ width: '120px', height: '120px' }}
                    animate={{ scale: isLoading ? 1 : 0 }}
                    transition={{
                        duration: 0.5,
                        delay: isLoading ? 0.5 : 0 // Delay appearance on close
                    }}
                />

                <div className="flex flex-col items-center relative z-10">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
                        className="mb-4"
                    >
                        <Layout className="h-16 w-16 text-white" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-white/80 font-medium text-sm tracking-widest uppercase"
                    >
                        Loading...
                    </motion.div>
                </div>
            </motion.div>

            {/* Iris Reveal Layer (Mask via Box Shadow) - z-[90] */}
            <motion.div
                className="fixed top-1/2 left-1/2 z-[90] bg-transparent rounded-full pointer-events-none"
                style={{
                    width: '10px',
                    height: '10px',
                    boxShadow: '0 0 0 200vmax #059669', // Huge shadow covers text (Theme Green)
                    x: '-50%',
                    y: '-50%',
                    willChange: 'transform'
                }}
                animate={{ scale: isLoading ? 1 : 500 }}
                transition={{
                    duration: isLoading ? 1.0 : 2.0, // Faster closing (1s), slower opening (2s)
                    ease: isLoading ? "easeInOut" : [0.87, 0, 0.13, 1], // Custom slow ease for opening
                    delay: isLoading ? 0 : 0.5 // No delay on close
                }}
            />
        </>
    );
};

export default LoaderOverlay;
