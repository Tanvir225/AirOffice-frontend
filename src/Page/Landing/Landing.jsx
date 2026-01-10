import React from 'react';

const Landing = () => {
    const [currentSlider, setCurrentSlider] = useState(0);

    // if you don't want to change the slider automatically then you can just remove the useEffect
    useEffect(() => {
        const intervalId = setInterval(() => setCurrentSlider(currentSlider === carouselItems.length - 1 ? 0 : currentSlider + 1), 5000);
        return () => clearInterval(intervalId);
    }, [currentSlider]);

    return (
        <div>
            <div className='bg-sky-200 p-3 text-right'>
                <Link to="/login" className='btn btn-outline px-10 btn-primary'>login</Link>
            </div>
            <div
                className="flex  w-full transform flex-col items-center justify-center gap-5 bg-cover bg-center duration-1000 ease-linear before:absolute before:inset-0 before:bg-black/50 sm:h-96 md:h-[88vh] lg:gap-10"
                style={{ backgroundImage: `url(${carouselItems[currentSlider].img})` }}
            >
                {/* text container here */}
                <div className="px-5 text-center text-white drop-shadow-lg duration-300 ease-linear">
                    <h1 className="mb-3 text-xl font-semibold lg:text-3xl">{carouselItems[currentSlider].title}</h1>
                    <p className="text-sm md:text-base lg:text-lg">{carouselItems[currentSlider].des}</p>
                </div>
            </div>
 
        </div>
    );
};

export default Landing;


import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const carouselItems = [
    {
        img: 'https://images.unsplash.com/photo-1421789665209-c9b2a435e3dc?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3',
        title: 'Escape 1',
        des: 'A Symphony of Tranquility. Experience the perfect blend of relaxation and excitement.'
    },
    {
        img: 'https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
        title: 'Escape 2',
        des: 'A Symphony of Tranquility. Experience the perfect blend of relaxation and excitement.'
    },
    {
        img: 'https://images.unsplash.com/photo-1719749990914-a3ba54e6343f?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3',
        title: 'Escape 3',
        des: 'A Symphony of Tranquility. Experience the perfect blend of relaxation and excitement.'
    },
    {
        img: 'https://images.unsplash.com/photo-1467195468637-72eb862bb14e?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3',
        title: 'Escape 4',
        des: 'A Symphony of Tranquility. Experience the perfect blend of relaxation and excitement.'
    },
    {
        img: 'https://images.unsplash.com/photo-1532155297578-a43684be8db8?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3',
        title: 'Escape 5',
        des: 'A Symphony of Tranquility. Experience the perfect blend of relaxation and excitement.'
    }
];