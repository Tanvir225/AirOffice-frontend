import React from 'react';
import img1 from '../../assets/img/family.jpg'
import img2 from '../../assets/img/Chairman.jpg'
import img3 from '../../assets/img/flynas-saudi-arabia.jpg'
import img4 from '../../assets/img/Flynas-Aircraft.jpg'

const Landing = () => {
    const [currentSlider, setCurrentSlider] = useState(0);

    const { user } = useAuth();

    // if you don't want to change the slider automatically then you can just remove the useEffect
    useEffect(() => {
        const intervalId = setInterval(() => setCurrentSlider(currentSlider === carouselItems.length - 1 ? 0 : currentSlider + 1), 5000);
        return () => clearInterval(intervalId);
    }, [currentSlider]);

    return (
        <div>
            <div className='bg-[#00b7ac] p-2 text-right'>
                {
                    user ? (<Link to="/flynas/home" className='btn  px-10'>Dashboard</Link>) : (<Link to="/login" className='btn  px-10'>Login</Link>)
                }
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
import useAuth from '../../Hook/useAuth';

const carouselItems = [
    {
        img: img1,
        title: 'Escape 1',
        des: 'A Symphony of Tranquility. Experience the perfect blend of relaxation and excitement.'
    },
    {
        img: img2,
        title: 'Escape 2',
        des: 'A Symphony of Tranquility. Experience the perfect blend of relaxation and excitement.'
    },
    {
        img: img3,
        title: 'Escape 3',
        des: 'A Symphony of Tranquility. Experience the perfect blend of relaxation and excitement.'
    },
    {
        img: img4,
        title: 'Escape 4',
        des: 'A Symphony of Tranquility. Experience the perfect blend of relaxation and excitement.'
    },

];