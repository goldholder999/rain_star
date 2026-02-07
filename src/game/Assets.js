
import level1Star from '../assets/level_1_star.svg';
import level10Star from '../assets/level_10_star.svg';
import level100Medal from '../assets/level_100_medal.svg';
import coinIcon from '../assets/coin.svg';
import shopIcon from '../assets/shop.svg';
import characterImg from '../assets/character.png';

export const ICONS = {
  // Player/Enemy Icons
  LEVEL_1: new Image(),
  LEVEL_10: new Image(),
  LEVEL_100: new Image(),
  CHARACTER: new Image(),

  // UI Icons
  COIN_SRC: coinIcon,
  SHOP_SRC: shopIcon,

  // Pre-load images
  loadImages: () => {
    ICONS.LEVEL_1.src = level1Star;
    ICONS.LEVEL_10.src = level10Star;
    ICONS.LEVEL_100.src = level100Medal;
    ICONS.CHARACTER.src = characterImg;
  }
};

ICONS.loadImages();
