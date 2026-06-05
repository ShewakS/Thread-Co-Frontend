import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia'; // Note: Wait, card media is from @mui/material/CardMedia in original code. Let's make sure it's @mui/material/CardMedia so it works!
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import { formatMoney } from './StoreContext';
import { resolveImage } from './imageMap';

const ratingLabels = {
  0.5: 'Useless', 1: 'Useless+', 1.5: 'Poor', 2: 'Poor+', 2.5: 'Ok',
  3: 'Ok+', 3.5: 'Good', 4: 'Good+', 4.5: 'Excellent', 5: 'Excellent+'
};

const ProductCard = ({ product, onAddToCart, actionLabel = 'Add to Cart' }) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(product.rating || 0);
  const [hover, setHover] = useState(-1);

  const goToDetails = () => navigate(`/product/${product.id}`);

  return (
    <Card className="card product-card" elevation={0}>
      <div className="card-media" onClick={goToDetails} style={{ cursor: 'pointer' }}>
        <CardMedia component="img" image={resolveImage(product.image)} alt={product.name} />
      </div>
      <CardContent className="card-body">
        <h3 className="card-title" onClick={goToDetails} style={{ cursor: 'pointer' }}>{product.name}</h3>
        <p className="card-meta">{product.category}</p>
        <p className="card-price">{formatMoney(product.price)}</p>
        <Box className="product-rating">
          <Rating
            value={rating}
            precision={0.5}
            getLabelText={(v) => `${v} Star${v !== 1 ? 's' : ''}, ${ratingLabels[v]}`}
            onChange={(_, newValue) => setRating(newValue)}
            onChangeActive={(_, newHover) => setHover(newHover)}
            emptyIcon={<StarIcon style={{ opacity: 0.45 }} fontSize="inherit" />}
            size="small"
          />
          {rating !== null && (
            <span className="rating-label">{ratingLabels[hover !== -1 ? hover : rating]}</span>
          )}
        </Box>
        <Button color="secondary" variant="contained" className="btn" onClick={goToDetails}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
