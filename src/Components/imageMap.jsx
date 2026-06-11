import accessories from '../Assets/Images/accessories.jpg';
import adv1 from '../Assets/Images/adv1.jpg';
import banner from '../Assets/Images/Banner.jpg';
import cottonCargoShorts from '../Assets/Images/Cotton Cargo Shorts.jpg';
import dailyDenimJacket from '../Assets/Images/Daily Denim Jacket.jpg';
import download from '../Assets/Images/download.webp';
import flowMidiDress from '../Assets/Images/Flow Midi Dress.webp';
import hat from '../Assets/Images/Hat.webp';
import linenShirt from '../Assets/Images/lenin shirt.jpg';
import menShirts from '../Assets/Images/men shirts.jpg';
import leatherBelt from '../Assets/Images/Minimal Leather Belt.webp';
import relaxedBeigeBlazer from '../Assets/Images/Relaxed Beige Blazer.jpg';
import shirtForMen from '../Assets/Images/shirt for men.webp';
import softKnitSet from '../Assets/Images/Soft Knit Co-ord Set.webp';
import womenDress from '../Assets/Images/women dress.avif';
import childdress from '../Assets/Images/childdress.jpg';
import beadednecklace from '../Assets/Images/Beadednecklace.jpg';

export const imageMap = {
  'images/accessories.jpg': accessories,
  'images/adv1.jpg': adv1,
  'images/Banner.jpg': banner,
  'images/Cotton%20Cargo%20Shorts.jpg': cottonCargoShorts,
  'images/Cotton Cargo Shorts.jpg': cottonCargoShorts,
  'images/Daily%20Denim%20Jacket.jpg': dailyDenimJacket,
  'images/Daily Denim Jacket.jpg': dailyDenimJacket,
  'images/download.webp': download,
  'images/Flow%20Midi%20Dress.webp': flowMidiDress,
  'images/Flow Midi Dress.webp': flowMidiDress,
  'images/Hat.webp': hat,
  'images/lenin%20shirt.jpg': linenShirt,
  'images/lenin shirt.jpg': linenShirt,
  'images/men%20shirts.jpg': menShirts,
  'images/men shirts.jpg': menShirts,
  'images/Minimal%20Leather%20Belt.webp': leatherBelt,
  'images/Minimal Leather Belt.webp': leatherBelt,
  'images/Relaxed%20Beige%20Blazer.jpg': relaxedBeigeBlazer,
  'images/Relaxed Beige Blazer.jpg': relaxedBeigeBlazer,
  'images/shirt%20for%20men.webp': shirtForMen,
  'images/shirt for men.webp': shirtForMen,
  'images/Soft%20Knit%20Co-ord%20Set.webp': softKnitSet,
  'images/Soft Knit Co-ord Set.webp': softKnitSet,
  'images/women%20dress.avif': womenDress,
  'images/women dress.avif': womenDress,
  'images/childdress.jpg': childdress,
  'images/Beadednecklace.jpg': beadednecklace
};

export const resolveImage = (path) => {
  if (!path) return download;
  return imageMap[path] || imageMap[decodeURI(path)] || path;
};

export const heroImages = [adv1, accessories, banner];
