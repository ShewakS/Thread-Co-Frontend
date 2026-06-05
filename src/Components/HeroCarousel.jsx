import { useEffect, useMemo, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { heroImages } from './imageMap';

const HeroCarousel = () => {
  const slides = useMemo(() => heroImages, []);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const move = (delta) => {
    setActive((prev) => (prev + delta + slides.length) % slides.length);
  };

  return (
    <div className="hero-media">
      <img src={slides[active]} alt="Hero slide" />
      <IconButton
        aria-label="Previous"
        onClick={() => move(-1)}
        size="small"
        sx={{ position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.7)' }}
      >
        <NavigateBeforeIcon />
      </IconButton>
      <IconButton
        aria-label="Next"
        onClick={() => move(1)}
        size="small"
        sx={{ position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)', bgcolor: 'rgba(255,255,255,0.7)' }}
      >
        <NavigateNextIcon />
      </IconButton>
    </div>
  );
};

export default HeroCarousel;
