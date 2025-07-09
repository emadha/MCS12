import React, {useState} from 'react';
import {useForm} from '@inertiajs/react';
import StarRating from './StarRating';
import {motion} from 'framer-motion';
import {InputLabel} from "@mui/material";
import InputError from "@/Components/InputError.jsx";
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import TextArea from "@/Components/Form/TextArea.jsx";
import TextInput from "@/Components/Form/TextInput.jsx";

export default function ReviewForm({h, onSuccess}) {
    const [rating, setRating] = useState(0);

    const {data, setData, post, processing, errors, reset} = useForm({
        rating: 0,
        title: '',
        content: '',
    });

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        setData('rating', newRating);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('actions.reviews.store', {h: h}), {
            onSuccess: () => {
                reset();
                setRating(0);
                if (onSuccess) onSuccess();
            },
        });
    };

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.3}}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
        >
            <form onSubmit={handleSubmit}>
                <h3 className="text-lg font-medium mb-4">Write a Review</h3>

                <div className="mb-4">
                    <InputLabel htmlFor="rating" value="Rating"/>
                    <div className="mt-1">
                        <StarRating
                            rating={rating}
                            onChange={handleRatingChange}
                            interactive={true}
                            size="xl"
                        />
                    </div>
                    <InputError message={errors.rating} className="mt-2"/>
                </div>

                <div className="mb-4">
                    <InputLabel htmlFor="title" value="Title"/>
                    <TextInput
                        id="title"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.title}
                        handleChange={(e) => setData('title', e.target.value)}
                    />
                    <InputError message={errors.title} className="mt-2"/>
                </div>

                <div className="mb-4">
                    <InputLabel htmlFor="content" value="Content"/>
                    <TextArea
                        id="content"
                        className="mt-1 block w-full"
                        value={data.content}
                        handleChange={(e) => setData('content', e.target.value)}
                        rows={4}
                    />
                    <InputError message={errors.content} className="mt-2"/>
                </div>

                <div className="flex items-center justify-end">
                    <PrimaryButton className="ml-4" disabled={processing || !rating}>
                        Submit Review
                    </PrimaryButton>
                </div>
            </form>
        </motion.div>
    );
};
