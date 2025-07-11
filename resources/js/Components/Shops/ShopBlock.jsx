import {Link, router, usePage} from '@inertiajs/react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faListDots, faStar, faStore} from '@fortawesome/free-solid-svg-icons';
import ContextMenu from '@/Components/ContextMenu';
import {AppContext} from '@/AppContext';
import ConfirmForm from '@/Components/Forms/ConfirmForm';
import ReportForm from '@/Components/Forms/ReportForm';
import {useContext, useState} from 'react';
import LikeButton from '@/Components/Actions/LikeButton';
import {AnimatePresence, motion} from 'framer-motion';
import {ShopTypeIcons} from '@/Components/Icons';

export default function ShopBlock({
    _k,
    className = '',
    shop,
    variant = 'square', // 'square', 'wide', 'tall'
    options = {
        showImage: true,
        showTitle: true,
        showShortDescription: true,
        showLikes: true,
        showRating: true,
        showListings: true,
        showTypes: true,
    },
}) {
    const {lang, setModalData, setModalShow} = useContext(AppContext);
    const [loadedShop, setLoadedShop] = useState(shop);
    const [isHovered, setIsHovered] = useState(false);
    const {user} = usePage().props.auth;

    // Animation variants
    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: 'easeOut',
                staggerChildren: 0.1,
            },
        },
        hover: {
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            transition: {
                duration: 0.2,
                ease: 'easeOut',
            },
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            transition: {
                duration: 0.3,
                ease: 'easeIn',
            },
        },
    };

    const itemVariants = {
        hidden: {opacity: 0, y: 10},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 200,
                damping: 20,
            },
        },
        exit: {
            opacity: 0,
        },
    };

    const imageVariants = {
        hidden: {opacity: 0, scale: 0.8},
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: 'easeOut',
            },
        },
        hover: {
            scale: 1.01,
            transition: {
                duration: 0.3,
                ease: 'easeOut',
            },
        },
    };

    const updateShop = (updatedItem) => {
        setLoadedShop(updatedItem);
    };

    const contextOnClick = (action, e) => {
        switch (action) {
            case 'delete': {
                setModalData({
                    content: <ConfirmForm onSuccess={() => setLoadedShop(false)}
                                          action={'delete'} item={loadedShop}/>,
                });
                setModalShow(true);
                break;
            }
            case 'edit': {
                router.visit(route('shop.single.edit', loadedShop.id));
                break;
            }
            case 'disapprove':
            case 'approve': {
                setModalData({
                    content: <ConfirmForm onSuccess={updateShop} action={action}
                                          item={loadedShop}/>,
                });
                setModalShow(true);
                break;
            }
            case 'report': {
                setModalShow(true);
                setModalData({
                    title: lang('Report'),
                    content: <ReportForm h={loadedShop.h}/>,
                });
                break;
            }
            default:
                console.log('Unknown context action:' + action);
        }
    };

    if (!loadedShop) return <AnimatePresence></AnimatePresence>;

    // Layout classes based on variant
    const getLayoutClasses = () => {
        switch (variant) {
            case 'wide':
                return 'flex-row items-center';
            case 'tall':
                return 'flex-col h-full';
            case 'square':
            default:
                return 'flex-col';
        }
    };

    // Image container classes based on variant
    const getImageClasses = () => {
        switch (variant) {
            case 'wide':
                return 'w-1/3 min-w-[100px] h-full max-h-[120px]';
            case 'tall':
                return 'w-full h-2/3 max-h-[250px]';
            case 'square':
            default:
                return 'w-full aspect-square';
        }
    };

    // Content container classes based on variant
    const getContentClasses = () => {
        switch (variant) {
            case 'wide':
                return 'flex-1 p-3 pl-4';
            case 'tall':
                return 'flex-1 p-3 pt-2';
            case 'square':
            default:
                return 'p-3 pt-2';
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className={`h-full relative ${className}`}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={containerVariants}
                layout
            >
                <motion.div
                    className={`
                        group dark:bg-white/5 rounded overflow-hidden
                        flex ${getLayoutClasses()}
                        border border-transparent outline outline-1 outline-transparent transition-all hover:outline-accent
                        ${!loadedShop.is_approved ? 'border-red-500/20' : ''}
                    `}
                    whileHover="hover"
                    variants={containerVariants}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    layout
                >
                    <Link
                        href={loadedShop.link}
                        className="contents"
                    >
                        {options.showImage && (
                            <motion.div
                                className={`h-full relative ${getImageClasses()}`}
                                variants={itemVariants}
                                layout
                            >
                                {loadedShop.primary_photo ? (
                                    <motion.img
                                        src={loadedShop.primary_photo.path.square_md}
                                        className="object-cover w-full h-full rounded-t dark:bg-neutral-900/50"
                                        alt={loadedShop.title}
                                        variants={imageVariants}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover="hover"
                                        layout
                                    />
                                ) : (
                                    <motion.div
                                        className="flex items-center justify-center h-full w-full"
                                        variants={imageVariants}
                                    >
                                        <FontAwesomeIcon
                                            icon={faStore}
                                            className="text-sm opacity-40"
                                            style={{filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.1))'}}
                                        />
                                    </motion.div>
                                )}

                                {/* Overlay animation on hover */}
                                <motion.div
                                    className="absolute inset-0 bg-primary-500/10 pointer-events-none"
                                    initial={{opacity: 0}}
                                    animate={{opacity: isHovered ? 1 : 0}}
                                    transition={{duration: 0.2}}
                                />
                            </motion.div>
                        )}

                        <motion.div
                            className={getContentClasses()}
                            variants={itemVariants}
                            layout
                        >
                            {options.showTitle && (
                                <motion.h5
                                    className="font-medium mb-1 line-clamp-1"
                                    variants={itemVariants}
                                    layout
                                >
                                    {loadedShop.title}
                                </motion.h5>
                            )}

                            {options.showShortDescription && (
                                <motion.p
                                    className="text-xs font-light line-clamp-2"
                                    variants={itemVariants}
                                    layout
                                >
                                    {loadedShop.description}
                                </motion.p>
                            )}

                            <motion.div className="mt-2 flex justify-end items-center"
                                        layout>
                                {options.showLikes && (
                                    <motion.span
                                        className="text-xs gap-x-1 items-center justify-start flex"
                                        variants={itemVariants}
                                        layout
                                    >
                                        <LikeButton item={loadedShop}/>
                                    </motion.span>
                                )}

                                {options.showRating && (
                                    <motion.span
                                        className="text-xs gap-x-1 items-center justify-start flex pr-5"
                                        variants={itemVariants}
                                        layout
                                    >
                                        <FontAwesomeIcon
                                            icon={faStar}
                                            className="opacity-70"
                                        />
                                        <span>{loadedShop.reviews?.average_rating ||
                                            0}</span>
                                    </motion.span>
                                )}

                                {options.showListings && (
                                    <motion.span
                                        className="text-xs gap-x-1 items-center justify-start flex"
                                        variants={itemVariants}
                                        layout
                                    >
                                        <FontAwesomeIcon
                                            icon={faListDots}
                                            className="opacity-70"
                                        />
                                        <span>{loadedShop.listings_count}</span>
                                    </motion.span>
                                )}
                            </motion.div>

                            {/* Shop type icons */}
                            {options.showTypes && loadedShop.types && loadedShop.types.length > 0 && (
                                <motion.div
                                    className="pt-3 flex flex-wrap gap-2 border-t border-border"
                                    variants={itemVariants}
                                    layout
                                >
                                    {loadedShop.types.map((type) => {
                                        // Use the type.id to get the correct icon component
                                        const IconComponent = ShopTypeIcons.ShopTypeIcons[type.id];
                                        return IconComponent ? (
                                            <motion.div
                                                key={type.id}
                                                className="tooltip-trigger opacity-20 hover:opacity-100"
                                                transition={{duration: 0.2}}
                                                title={type.title}
                                            >
                                                <IconComponent className="w-3 h-3"/>
                                            </motion.div>
                                        ) : null;
                                    })}
                                </motion.div>
                            )}
                        </motion.div>

                    </Link>
                    <div
                        className={'absolute right-5 top-5'}>
                        <ContextMenu
                            h={loadedShop.h}
                            onClick={contextOnClick}
                        />
                    </div>
                </motion.div>

            </motion.div>
        </AnimatePresence>
    );
}
