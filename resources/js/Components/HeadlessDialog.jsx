import { Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeadlessDialog = ({ open, onClose, className = '', children, ...props }) => {
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: {
        duration: 0.2,
        ease: 'easeOut'
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          as="div"
          className={`relative z-50 ${className}`}
          {...props}
        >
          <motion.div
            className="fixed inset-0 bg-black/30"
            aria-hidden="true"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
          />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={dialogVariants}
              className="mx-auto max-w-sm rounded-lg bg-primary p-6 shadow-xl"
            >
              {children}
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

HeadlessDialog.Title = ({ className = '', children, ...props }) => {
  return (
    <Dialog.Title
      as={motion.h3}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.3 }}
      className={`text-lg font-medium leading-6 text-primary ${className}`}
      {...props}
    >
      {children}
    </Dialog.Title>
  );
};

HeadlessDialog.Description = ({ className = '', children, ...props }) => {
  return (
    <Dialog.Description
      as={motion.p}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.25, duration: 0.3 }}
      className={`mt-2 text-sm text-tertiary ${className}`}
      {...props}
    >
      {children}
    </Dialog.Description>
  );
};

HeadlessDialog.Panel = ({ className = '', children, ...props }) => {
  const panelVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={panelVariants}
      className={`mx-auto rounded-lg bg-primary shadow-xl ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default HeadlessDialog;
