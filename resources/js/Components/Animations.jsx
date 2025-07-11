/**
 * Reusable animation variants for use with Framer Motion components
 */

// Hover scale animation
export const hoverScale = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.98
  }
};

// Fade in animation
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

// Slide up fade in animation
export const slideUp = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

// Staggered children animation
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05
    }
  }
};

// Card animation
export const cardAnimation = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  },
  hover: {
    y: -2,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: {
      duration: 0.2
    }
  }
};

/**
 * Animation variants for reusable animations
 */

// Fade in/out animation
export const fadeAnimation = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
};

// Scale animation with fade
export const scaleAnimation = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.2
        }
    }
};

// Slide up animation
export const slideUpAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3
        }
    },
    exit: {
        opacity: 0,
        y: 10,
        transition: {
            duration: 0.2
        }
    }
};

// Slide from right animation
export const slideFromRightAnimation = {
    hidden: { opacity: 0, x: 10 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3
        }
    },
    exit: {
        opacity: 0,
        x: 10,
        transition: {
            duration: 0.2
        }
    }
};

// Staggered children animation
export const staggeredContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.05
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2
        }
    }
};

// Staggered item animation
export const staggeredItem = {
    hidden: { opacity: 0, y: 5 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3
        }
    },
    exit: {
        opacity: 0,
        y: 5,
        transition: {
            duration: 0.2
        }
    }
};

// Dialog/Modal animations
export const modalBackdropAnimation = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.2
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2
        }
    }
};

export const modalContentAnimation = {
    hidden: { opacity: 0, y: -10, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.3
        }
    },
    exit: {
        opacity: 0,
        y: 10,
        scale: 0.98,
        transition: {
            duration: 0.2
        }
    }
};

// Dropdown animation
export const dropdownAnimation = {
    hidden: { opacity: 0, y: -5, height: 0 },
    visible: {
        opacity: 1,
        y: 0,
        height: 'auto',
        transition: {
            duration: 0.2
        }
    },
    exit: {
        opacity: 0,
        y: -5,
        height: 0,
        transition: {
            duration: 0.2
        }
    }
};
