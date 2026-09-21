import * as THREE from './assets/three.module.min.js';

const wrap = document.querySelector('#canvas-wrap');
const home = document.querySelector('#home');
const playButton = document.querySelector('#play-button');
const homeMessage = document.querySelector('#home-message');
const hud = document.querySelector('#hud');
const scoreEl = document.querySelector('#score');
const eggsEl = document.querySelector('#eggs');
const bestEl = document.querySelector('#best-score');
const soundButton = document.querySelector('#sound-button');
const pauseButton = document.querySelector('#pause-button');
const countdownEl = document.querySelector('#countdown');
const touchControls = document.querySelector('#touch-controls');
const magnetStatus = document.querySelector('#magnet-status');
const magnetTimeEl = document.querySelector('#magnet-time');
const doubleStatus = document.querySelector('#double-status');
const doubleTimeEl = document.querySelector('#double-time');
const walletEggsEl = document.querySelector('#wallet-eggs');
const shopEggsEl = document.querySelector('#shop-eggs');
const wardrobeButton = document.querySelector('#wardrobe-button');
const shopButton = document.querySelector('#shop-button');
const wardrobePanel = document.querySelector('#wardrobe-panel');
const shopPanel = document.querySelector('#shop-panel');
const wardrobeGrid = document.querySelector('#wardrobe-grid');
const shopGrid = document.querySelector('#shop-grid');
const iceCreamGrid = document.querySelector('#ice-cream-grid');
const cakeGrid = document.querySelector('#cake-grid');
const halloweenGrid = document.querySelector('#halloween-grid');
const careerGrid = document.querySelector('#career-grid');
const candyGrid = document.querySelector('#candy-grid');
const schoolGrid = document.querySelector('#school-grid');
const footballGrid = document.querySelector('#football-grid');
const avatarCanvas = document.querySelector('#avatar-canvas');
const avatarNameEl = document.querySelector('#avatar-name');
const chickenNameInput = document.querySelector('#chicken-name');
const soundboardPanel = document.querySelector('#soundboard-panel');
const pauseScreen = document.querySelector('#pause-screen');
const resumeButton = document.querySelector('#resume-button');
const pauseHomeButton = document.querySelector('#pause-home-button');
const toast = document.querySelector('#toast');
const loading = document.querySelector('#loading');

const audio = {
  music: new Audio('./assets/theme.mp3'),
  egg: new Audio('./assets/egg.mp3'),
  farmer: new Audio('./assets/farmer.mp3'),
  crash: new Audio('./assets/crash.mp3'),
  jump: new Audio('./assets/jump.mp3'),
  crouch: new Audio('./assets/crouch.mp3'),
  left: new Audio('./assets/left.mp3'),
  right: new Audio('./assets/right.mp3'),
  powerup: new Audio('./assets/powerup.mp3'),
  taunt: new Audio('./assets/taunt.mp3'),
  hi: new Audio('./assets/hi.mp3'),
  shop: new Audio('./assets/shop-song.mp3'),
  funky: new Audio('./assets/funky-ehh.mp3'),
  tung: new Audio('./assets/tung-tung-sahere-deer.mp3'),
  nathan: new Audio('./assets/i-cant-do-nathan.mp3')
};
audio.music.loop = true;
audio.shop.loop = true;
const GAME_MUSIC_VOLUME = 0.38;
const MENU_MUSIC_VOLUME = GAME_MUSIC_VOLUME * .5;
audio.music.volume = GAME_MUSIC_VOLUME;
audio.egg.volume = 0.7;
audio.farmer.volume = 0.75;
audio.crash.volume = 0.9;
audio.jump.volume = 0.8;
audio.crouch.volume = 0.8;
audio.left.volume = 0.72;
audio.right.volume = 0.72;
audio.powerup.volume = 0.82;
audio.taunt.volume = 0.86;
audio.hi.volume = 0.9;
audio.shop.volume = 0.42;
audio.funky.volume = 0.9;
audio.tung.volume = 0.9;
audio.nathan.volume = 0.9;

let muted = false;
function playSound(sound, restart = true) {
  if (muted) return;
  if (restart) sound.currentTime = 0;
  sound.play().catch(() => {});
}

const activeCoinVoices = new Set();

function stopCoinSounds() {
  activeCoinVoices.forEach(voice => {
    voice.pause();
    voice.currentTime = 0;
  });
  activeCoinVoices.clear();
}

function playCoinSound() {
  if (muted || state === 'crash') return;
  const voice = audio.egg.cloneNode();
  voice.volume = audio.egg.volume;
  voice.preload = 'auto';
  activeCoinVoices.add(voice);
  const release = () => activeCoinVoices.delete(voice);
  voice.addEventListener('ended', release, { once: true });
  voice.play().catch(release);
}

function playSoundboardSound(sound) {
  if (muted) return;
  const voice = sound.cloneNode();
  voice.volume = sound.volume;
  voice.play().catch(() => {});
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7ed0f1);
scene.fog = new THREE.Fog(0x9ed9ed, 55, 145);

const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 260);
camera.position.set(0, 5.7, 10.8);
camera.lookAt(0, 1.2, -11);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
wrap.append(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xdff7ff, 0x527d2f, 2.25));
const sun = new THREE.DirectionalLight(0xfff2c4, 3.1);
sun.position.set(-18, 28, 15);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -25;
sun.shadow.camera.right = 25;
sun.shadow.camera.top = 25;
sun.shadow.camera.bottom = -12;
scene.add(sun);

const mat = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.78, ...extra });
const M = {
  road: mat(0xb6834f), roadDark: mat(0x8f653e), line: mat(0xf5ddb2),
  grass: mat(0x66b941), grass2: mat(0x83ca45), dirt: mat(0x9e6c3c),
  white: mat(0xfff8e9), cream: mat(0xffe3b0), red: mat(0xe84734),
  orange: mat(0xf39a2d), yellow: mat(0xffd63b), dark: mat(0x263b2d),
  brown: mat(0x7a4729), wood: mat(0x9b5e31), hay: mat(0xf2c43d),
  denim: mat(0x3975a8), skin: mat(0xe9ae76), green: mat(0x398a46),
  tire: mat(0x252726), metal: mat(0xbcc7c6), gold: mat(0xffc928, { metalness: .45, roughness: .25, emissive: 0x7a4100, emissiveIntensity: .35 }),
  goldGlow: mat(0xffef75, { emissive: 0xffb000, emissiveIntensity: 1.3, transparent: true, opacity: .72 }),
  water: mat(0x4aa9d4, { metalness: .1, roughness: .25 }),
  tubeGlass: mat(0x8f38d6, { metalness: .05, roughness: .16, emissive: 0x3f1168, emissiveIntensity: .35, transparent: true, opacity: .3, depthWrite: false, side: THREE.DoubleSide }),
  tubeRim: mat(0xc77dff, { metalness: .2, roughness: .3, emissive: 0x6d22a8, emissiveIntensity: .55 }),
  roosterTeal: mat(0x24b8a6, { metalness: .18, roughness: .35, emissive: 0x07564f, emissiveIntensity: .35 }),
  roosterBlue: mat(0x2556b8, { metalness: .2, roughness: .32, emissive: 0x10245f, emissiveIntensity: .28 }),
  tongue: mat(0xf06f85, { roughness: .58 })
};

const SKINS = [
  { id: 'classic', name: 'Classic Chicken', primary: 0xfff8e9, secondary: 0xffe3b0, price: 0 },
  { id: 'plush_pal', name: 'Plush Pal Chicken', primary: 0xc98b42, secondary: 0x4b82bd, accent: 0xd84835, price: 5000, featured: true },
  { id: 'sunny', name: 'Sunny Chicken', primary: 0xffdf45, secondary: 0xffaa2b, price: 150 },
  { id: 'brown', name: 'Cocoa Chicken', primary: 0x8a512f, secondary: 0xc8874f, price: 250 },
  { id: 'berry', name: 'Berry Chicken', primary: 0xf06da7, secondary: 0xffb3d2, price: 400 },
  { id: 'sky', name: 'Sky Chicken', primary: 0x58bde8, secondary: 0xa6e7ff, price: 600 },
  { id: 'mint', name: 'Mint Chicken', primary: 0x58cf91, secondary: 0xb5f1c8, price: 800 },
  { id: 'midnight', name: 'Midnight Chicken', primary: 0x303554, secondary: 0x727aaa, price: 1050 },
  { id: 'royal', name: 'Royal Purple', primary: 0x8d52d8, secondary: 0xd2a9ff, price: 1250 },
  { id: 'rooster', name: 'Regal Rooster', primary: 0xb62e35, secondary: 0xf0a52a, price: 1500, rooster: true },
  { id: 'cookies_cream', name: "Cookies N' Cream", primary: 0xf4eee2, secondary: 0xbcb7b0, accent: 0x302d2b, price: 500, collection: 'icecream' },
  { id: 'mint_chip', name: 'Mint Chocolate Chip', primary: 0x9ee6bd, secondary: 0x54b989, accent: 0x3b2922, price: 600, collection: 'icecream' },
  { id: 'strawberry_swirl', name: 'Strawberry Swirl', primary: 0xffa8bd, secondary: 0xffe4df, accent: 0xd93562, price: 700, collection: 'icecream' },
  { id: 'chocolate_fudge', name: 'Chocolate Fudge', primary: 0x6b3926, secondary: 0xa8653d, accent: 0x2c1915, price: 800, collection: 'icecream' },
  { id: 'vanilla_sprinkle', name: 'Vanilla Sprinkle', primary: 0xfff1ba, secondary: 0xffd96d, accent: 0xf15d74, price: 900, collection: 'icecream' },
  { id: 'blue_moon', name: 'Blue Moon Scoop', primary: 0x63bff2, secondary: 0x9fe5ff, accent: 0x4057c9, price: 1000, collection: 'icecream' },
  { id: 'pistachio', name: 'Pistachio Crunch', primary: 0xb9dc7c, secondary: 0x7fac4c, accent: 0x76532c, price: 1100, collection: 'icecream' },
  { id: 'birthday_cake', name: 'Birthday Cake', primary: 0xffe8f0, secondary: 0x75dcea, accent: 0xff5d9f, price: 1200, collection: 'icecream' },
  { id: 'cotton_candy', name: 'Cotton Candy', primary: 0xff9ed5, secondary: 0x91ddff, accent: 0x9d65d8, price: 1300, collection: 'icecream' },
  { id: 'caramel_crunch', name: 'Caramel Crunch', primary: 0xd78a3b, secondary: 0xffc66d, accent: 0x7b4221, price: 1400, collection: 'icecream' },
  { id: 'rocky_road', name: 'Rocky Road', primary: 0x70432e, secondary: 0xc18b6a, accent: 0xede2cf, price: 1500, collection: 'icecream' },
  { id: 'neapolitan', name: 'Neapolitan Scoop', primary: 0xf4d8c4, secondary: 0xf19ab0, accent: 0x6a3829, price: 1600, collection: 'icecream' },
  { id: 'mango_sorbet', name: 'Mango Sorbet', primary: 0xffb52d, secondary: 0xffdf61, accent: 0xf36c2f, price: 1700, collection: 'icecream' },
  { id: 'cherry_sundae', name: 'Cherry Sundae', primary: 0xfff1df, secondary: 0xe84a59, accent: 0x8f1830, price: 1850, collection: 'icecream' },
  { id: 'galaxy_gelato', name: 'Galaxy Gelato', primary: 0x4d3c91, secondary: 0x9e63d6, accent: 0x59d9e8, price: 2000, collection: 'icecream' },
  { id: 'vanilla_layer_cake', name: 'Vanilla Layer Cake', primary: 0xfff0c8, secondary: 0xffd77d, accent: 0xf07c9b, price: 600, collection: 'cake' },
  { id: 'chocolate_layer_cake', name: 'Chocolate Layer Cake', primary: 0x70402c, secondary: 0xa76644, accent: 0xffd18a, price: 750, collection: 'cake' },
  { id: 'strawberry_shortcake', name: 'Strawberry Shortcake', primary: 0xffb4c0, secondary: 0xffeee1, accent: 0xd83c55, price: 900, collection: 'cake' },
  { id: 'lemon_drizzle', name: 'Lemon Drizzle', primary: 0xffe36e, secondary: 0xfff3b5, accent: 0xf1a72d, price: 1050, collection: 'cake' },
  { id: 'red_velvet', name: 'Red Velvet Cake', primary: 0xa92f3b, secondary: 0xf8e1cc, accent: 0x68202a, price: 1200, collection: 'cake' },
  { id: 'funfetti', name: 'Funfetti Cake', primary: 0xfff2d9, secondary: 0xf8c7dd, accent: 0x5dc8df, price: 1350, collection: 'cake' },
  { id: 'carrot_cake', name: 'Carrot Cake', primary: 0xd98535, secondary: 0xffe2ae, accent: 0x5c9d47, price: 1500, collection: 'cake' },
  { id: 'blueberry_cake', name: 'Blueberry Cake', primary: 0x6972cb, secondary: 0xc4c9ff, accent: 0x343979, price: 1700, collection: 'cake' },
  { id: 'confetti_cupcake', name: 'Confetti Cupcake', primary: 0xf8c2df, secondary: 0x8edcf0, accent: 0xffcf3f, price: 1900, collection: 'cake' },
  { id: 'midnight_cake', name: 'Midnight Cake', primary: 0x332a55, secondary: 0x7552a9, accent: 0xffcf55, price: 2200, collection: 'cake' },
  { id: 'pumpkin_patch', name: 'Pumpkin Patch', primary: 0xf28a24, secondary: 0x4d9b48, accent: 0x5d321d, price: 500, collection: 'halloween' },
  { id: 'midnight_witch', name: 'Midnight Witch', primary: 0x352447, secondary: 0x7f4cb0, accent: 0xffc94c, price: 650, collection: 'halloween' },
  { id: 'candy_corn', name: 'Candy Corn', primary: 0xfff0d0, secondary: 0xf5842f, accent: 0xffd63d, price: 800, collection: 'halloween' },
  { id: 'friendly_ghost', name: 'Friendly Ghost', primary: 0xf4f4ec, secondary: 0xb7d9ee, accent: 0x7e66a9, price: 900, collection: 'halloween' },
  { id: 'vampire', name: 'Vampire Chicken', primary: 0x29262f, secondary: 0xa9273b, accent: 0xf4eadc, price: 1050, collection: 'halloween' },
  { id: 'franken_chicken', name: 'Franken-Chicken', primary: 0x7cad45, secondary: 0x47355d, accent: 0x252825, price: 1200, collection: 'halloween' },
  { id: 'black_cat', name: 'Black Cat Chicken', primary: 0x252329, secondary: 0x744b9c, accent: 0xf5cf43, price: 1300, collection: 'halloween' },
  { id: 'mummy', name: 'Mummy Chicken', primary: 0xd8cba8, secondary: 0x8c795c, accent: 0xeab64d, price: 1400, collection: 'halloween' },
  { id: 'slime', name: 'Slime Chicken', primary: 0x83d63d, secondary: 0x3a642a, accent: 0x8a4eb1, price: 1500, collection: 'halloween' },
  { id: 'haunted_hayride', name: 'Haunted Hayride', primary: 0x9a5b2f, secondary: 0xe38a2f, accent: 0x342b2c, price: 1600, collection: 'halloween' },
  { id: 'moonlit_bat', name: 'Moonlit Bat', primary: 0x2e365f, secondary: 0x7652a9, accent: 0xc8d5e9, price: 1750, collection: 'halloween' },
  { id: 'spooky_skeleton', name: 'Spooky Skeleton', primary: 0x25282c, secondary: 0xeee5cc, accent: 0x52c7bd, price: 1850, collection: 'halloween' },
  { id: 'trick_or_treat', name: 'Trick-or-Treat', primary: 0x844bb2, secondary: 0xf1842f, accent: 0xffd54b, price: 2000, collection: 'halloween' },
  { id: 'jack_o_lantern', name: "Jack-o'-Lantern", primary: 0xed7624, secondary: 0x2e3429, accent: 0x5ea444, price: 2150, collection: 'halloween' },
  { id: 'phantom_rooster', name: 'Phantom Rooster', primary: 0x4b4169, secondary: 0x9c7bc1, accent: 0x65e0c1, price: 2400, collection: 'halloween' },
  { id: 'doctor', name: 'Doctor Chicken', primary: 0xf2f5f2, secondary: 0x5fb6d5, accent: 0xe94f55, price: 600, collection: 'career' },
  { id: 'firefighter', name: 'Firefighter Chicken', primary: 0xd84635, secondary: 0xf2c13c, accent: 0x33363a, price: 750, collection: 'career' },
  { id: 'career_farmer', name: 'Farmer Chicken', primary: 0xe8c77c, secondary: 0x4b83aa, accent: 0x5b913f, price: 850, collection: 'career' },
  { id: 'chef', name: 'Chef Chicken', primary: 0xfff6e8, secondary: 0xd9dce0, accent: 0xe84b3b, price: 950, collection: 'career' },
  { id: 'police_officer', name: 'Police Officer Chicken', primary: 0x344f7a, secondary: 0x6f95c5, accent: 0xf3ca45, price: 1050, collection: 'career' },
  { id: 'astronaut', name: 'Astronaut Chicken', primary: 0xf1f2f4, secondary: 0x9da9bd, accent: 0x4b79d8, price: 1200, collection: 'career' },
  { id: 'scientist', name: 'Scientist Chicken', primary: 0xebf4f2, secondary: 0x65b8aa, accent: 0x864fc4, price: 1300, collection: 'career' },
  { id: 'builder', name: 'Builder Chicken', primary: 0xf0a02f, secondary: 0xf5ce48, accent: 0x575c5d, price: 1400, collection: 'career' },
  { id: 'teacher', name: 'Teacher Chicken', primary: 0xa85c42, secondary: 0xe7c994, accent: 0x3e7960, price: 1500, collection: 'career' },
  { id: 'pilot', name: 'Pilot Chicken', primary: 0x354566, secondary: 0xd9e1ec, accent: 0xe6b642, price: 1650, collection: 'career' },
  { id: 'mechanic', name: 'Mechanic Chicken', primary: 0x4f6570, secondary: 0xe47f32, accent: 0xbec9ca, price: 1750, collection: 'career' },
  { id: 'artist', name: 'Artist Chicken', primary: 0xee7d9d, secondary: 0x6cbad2, accent: 0xffd24d, price: 1850, collection: 'career' },
  { id: 'mail_carrier', name: 'Mail Carrier Chicken', primary: 0x4a78b4, secondary: 0xbdd5ed, accent: 0xe64d45, price: 1950, collection: 'career' },
  { id: 'detective', name: 'Detective Chicken', primary: 0x6e563e, secondary: 0xbda47f, accent: 0x34302c, price: 2100, collection: 'career' },
  { id: 'game_developer', name: 'Game Developer Chicken', primary: 0x584d9c, secondary: 0x47b8a5, accent: 0xffca48, price: 2300, collection: 'career' },
  { id: 'bubblegum_pop', name: 'Bubblegum Pop', primary: 0xff83c6, secondary: 0xffc1e1, accent: 0x55c7ef, price: 500, collection: 'candy' },
  { id: 'candy_cane', name: 'Candy Cane', primary: 0xfff4e8, secondary: 0xe94a4a, accent: 0x4caf69, price: 600, collection: 'candy' },
  { id: 'gummy_bear', name: 'Gummy Bear', primary: 0xffa72f, secondary: 0xffd152, accent: 0xe94b65, price: 700, collection: 'candy' },
  { id: 'sour_apple', name: 'Sour Apple', primary: 0x85dc48, secondary: 0xc9ef71, accent: 0xffe24c, price: 800, collection: 'candy' },
  { id: 'blue_raspberry', name: 'Blue Raspberry', primary: 0x45cbea, secondary: 0x77e7ff, accent: 0x3e65cf, price: 900, collection: 'candy' },
  { id: 'cherry_lollipop', name: 'Cherry Lollipop', primary: 0xe73b55, secondary: 0xff7488, accent: 0x9d2138, price: 1000, collection: 'candy' },
  { id: 'lemon_drop', name: 'Lemon Drop', primary: 0xffdc3f, secondary: 0xfff3a0, accent: 0xf39a2d, price: 1100, collection: 'candy' },
  { id: 'grape_taffy', name: 'Grape Taffy', primary: 0x9b63d5, secondary: 0xd7b5f3, accent: 0xf07cab, price: 1200, collection: 'candy' },
  { id: 'watermelon_chew', name: 'Watermelon Chew', primary: 0xf36e83, secondary: 0x65c977, accent: 0x354833, price: 1300, collection: 'candy' },
  { id: 'caramel_swirl', name: 'Caramel Swirl', primary: 0xc77b39, secondary: 0xffcf86, accent: 0x754121, price: 1400, collection: 'candy' },
  { id: 'peppermint_twist', name: 'Peppermint Twist', primary: 0xfff8ef, secondary: 0xef5058, accent: 0x77d3ac, price: 1500, collection: 'candy' },
  { id: 'rainbow_sprinkles', name: 'Rainbow Sprinkles', primary: 0xffe4bd, secondary: 0xff8cc6, accent: 0x4fcde5, price: 1600, collection: 'candy' },
  { id: 'fizzy_cola', name: 'Fizzy Cola', primary: 0x6d3b2a, secondary: 0xb66c3c, accent: 0xffe1ad, price: 1700, collection: 'candy' },
  { id: 'peach_ring', name: 'Peach Ring', primary: 0xff9b70, secondary: 0xffdf70, accent: 0xf45f91, price: 1800, collection: 'candy' },
  { id: 'licorice_twist', name: 'Licorice Twist', primary: 0x292635, secondary: 0x59405f, accent: 0xe14b55, price: 1900, collection: 'candy' },
  { id: 'jelly_bean', name: 'Jelly Bean', primary: 0xa549d1, secondary: 0x5ed6df, accent: 0xffd64a, price: 2000, collection: 'candy' },
  { id: 'rock_candy', name: 'Rock Candy', primary: 0x82dff4, secondary: 0xc39cec, accent: 0x59fff0, price: 2100, collection: 'candy' },
  { id: 'chocolate_truffle', name: 'Chocolate Truffle', primary: 0x4c2b25, secondary: 0x8c523a, accent: 0xe8b94e, price: 2200, collection: 'candy' },
  { id: 'cosmic_candy', name: 'Cosmic Candy', primary: 0x35306f, secondary: 0x8253c7, accent: 0x54e8e2, price: 2350, collection: 'candy' },
  { id: 'golden_candy', name: 'Golden Candy', primary: 0xe6a92d, secondary: 0xffd968, accent: 0xfff1b0, price: 2500, collection: 'candy' },
  { id: 'school_kindergarten', name: 'Kindergarten Chicken', primary: 0xffdf55, secondary: 0x58b9e8, accent: 0xe95163, price: 500, collection: 'school' },
  { id: 'school_hall_monitor', name: 'Hall Monitor Chicken', primary: 0xf4eee0, secondary: 0xf29e38, accent: 0xc83f45, price: 600, collection: 'school' },
  { id: 'school_math_club', name: 'Math Club Chicken', primary: 0x4f7cb7, secondary: 0xc9dcf1, accent: 0xffd34e, price: 700, collection: 'school' },
  { id: 'school_science_lab', name: 'Science Lab Chicken', primary: 0xeef5f1, secondary: 0x54b59d, accent: 0x754bc1, price: 800, collection: 'school' },
  { id: 'school_art_class', name: 'Art Class Chicken', primary: 0xf58db0, secondary: 0x62c9e6, accent: 0xffd044, price: 900, collection: 'school' },
  { id: 'school_band', name: 'Marching Band Chicken', primary: 0xb53045, secondary: 0xf0bd3d, accent: 0xf8f0dc, price: 1050, collection: 'school' },
  { id: 'school_chess_club', name: 'Chess Club Chicken', primary: 0x343238, secondary: 0xe6dfcf, accent: 0xb98b3f, price: 1150, collection: 'school' },
  { id: 'school_book_club', name: 'Book Club Chicken', primary: 0x8655aa, secondary: 0xd6b8e8, accent: 0x50a36a, price: 1250, collection: 'school' },
  { id: 'school_spirit', name: 'School Spirit Chicken', primary: 0x2765ae, secondary: 0xf0c73e, accent: 0xf8f4e9, price: 1350, collection: 'school' },
  { id: 'school_honor_roll', name: 'Honor Roll Chicken', primary: 0xf4e7bd, secondary: 0x7c4eaa, accent: 0xe3ad32, price: 1500, collection: 'school' },
  { id: 'school_recess', name: 'Recess Chicken', primary: 0x5bc778, secondary: 0x8ddbed, accent: 0xff8a55, price: 1650, collection: 'school' },
  { id: 'school_lunch_crew', name: 'Lunch Crew Chicken', primary: 0xef5b4e, secondary: 0xffd55b, accent: 0x4fa876, price: 1800, collection: 'school' },
  { id: 'school_drama_club', name: 'Drama Club Chicken', primary: 0x693c85, secondary: 0xe14f72, accent: 0xf2c64b, price: 1950, collection: 'school' },
  { id: 'school_computer_club', name: 'Computer Club Chicken', primary: 0x34465d, secondary: 0x48b6b1, accent: 0x80f0d0, price: 2100, collection: 'school' },
  { id: 'school_valedictorian', name: 'Valedictorian Chicken', primary: 0x242938, secondary: 0x4d68a3, accent: 0xf0c64a, price: 2400, collection: 'school' },
  { id: 'football_saints', name: 'Saints Chicken', primary: 0x1c1c1c, secondary: 0xd3bc8d, accent: 0xf7f3e8, price: 700, collection: 'football' },
  { id: 'football_eagles', name: 'Eagles Chicken', primary: 0x145a5a, secondary: 0xc5d5d8, accent: 0xffffff, price: 800, collection: 'football' },
  { id: 'football_chiefs', name: 'Chiefs Chicken', primary: 0xc82f3f, secondary: 0xffc92f, accent: 0xffffff, price: 900, collection: 'football' },
  { id: 'football_bills', name: 'Bills Chicken', primary: 0x315ca8, secondary: 0xe23e45, accent: 0xffffff, price: 1000, collection: 'football' },
  { id: 'football_dolphins', name: 'Dolphins Chicken', primary: 0x1a9b9b, secondary: 0xf59b34, accent: 0xffffff, price: 1100, collection: 'football' },
  { id: 'football_cowboys', name: 'Cowboys Chicken', primary: 0x304b75, secondary: 0xb8c4cf, accent: 0xffffff, price: 1200, collection: 'football' },
  { id: 'football_packers', name: 'Packers Chicken', primary: 0x28563b, secondary: 0xf1c232, accent: 0xffffff, price: 1300, collection: 'football' },
  { id: 'football_bears', name: 'Bears Chicken', primary: 0x26324c, secondary: 0xd96a2c, accent: 0xffffff, price: 1400, collection: 'football' },
  { id: 'football_lions', name: 'Lions Chicken', primary: 0x4d9bc6, secondary: 0xbac4ca, accent: 0xffffff, price: 1500, collection: 'football' },
  { id: 'football_vikings', name: 'Vikings Chicken', primary: 0x63438f, secondary: 0xf1c43b, accent: 0xffffff, price: 1650, collection: 'football' },
  { id: 'football_49ers', name: '49ers Chicken', primary: 0xb52e38, secondary: 0xd9ad55, accent: 0xffffff, price: 1800, collection: 'football' },
  { id: 'football_seahawks', name: 'Seahawks Chicken', primary: 0x263e63, secondary: 0x65b346, accent: 0x8bc5db, price: 1950, collection: 'football' },
  { id: 'football_ravens', name: 'Ravens Chicken', primary: 0x42356f, secondary: 0x1f2025, accent: 0xd3a844, price: 2100, collection: 'football' },
  { id: 'football_bengals', name: 'Bengals Chicken', primary: 0xe8732f, secondary: 0x29292d, accent: 0xffffff, price: 2250, collection: 'football' },
  { id: 'football_broncos', name: 'Broncos Chicken', primary: 0x244f83, secondary: 0xe4662e, accent: 0xffffff, price: 2500, collection: 'football' }
];

function readSavedList(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

const savedWalletEggs = Number(localStorage.getItem('feather-rush-eggs') || 0);
let walletEggs = Number.isFinite(savedWalletEggs) ? Math.max(0, Math.floor(savedWalletEggs)) : 0;
let ownedSkins = readSavedList('feather-rush-skins', ['classic']);
if (!ownedSkins.includes('classic')) ownedSkins.unshift('classic');
let selectedSkinId = localStorage.getItem('feather-rush-selected-skin') || 'classic';
if (!ownedSkins.includes(selectedSkinId) || !SKINS.some(skin => skin.id === selectedSkinId)) selectedSkinId = 'classic';
let chickenName = (localStorage.getItem('ranch-runners-chicken-name') || 'Nugget').slice(0, 12);
chickenNameInput.value = chickenName;
const skinMaterialCache = new Map();

function getSkin(id) {
  return SKINS.find(skin => skin.id === id) || SKINS[0];
}

const THEME_ORDER = ['classic', 'icecream', 'cake', 'halloween', 'career', 'candy', 'school', 'football'];
const THEME_NAMES = {
  classic: 'Classic Chickens',
  icecream: 'Ice Cream Chickens',
  cake: 'Cake Chickens',
  halloween: 'Halloween Chickens',
  career: 'Career Chickens',
  candy: 'Candy Chickens',
  school: 'School Chickens',
  football: 'Football Chickens'
};

function skinTheme(skin) {
  return skin.collection || 'classic';
}

function themeLockInfo(skin) {
  const themeIndex = THEME_ORDER.indexOf(skinTheme(skin));
  if (themeIndex <= 0) return { locked: false, previous: null };
  const previous = THEME_ORDER[themeIndex - 1];
  const previousComplete = SKINS
    .filter(item => skinTheme(item) === previous)
    .every(item => ownedSkins.includes(item.id));
  return { locked: !previousComplete, previous };
}

function getSkinMaterials(id) {
  if (!skinMaterialCache.has(id)) {
    const skin = getSkin(id);
    skinMaterialCache.set(id, {
      primary: mat(skin.primary, { roughness: .72 }),
      secondary: mat(skin.secondary, { roughness: .76 }),
      accent: mat(skin.accent || skin.secondary, { metalness: skin.id === 'galaxy_gelato' ? .28 : .05, roughness: .52, emissive: skin.id === 'galaxy_gelato' ? 0x162052 : 0x000000, emissiveIntensity: skin.id === 'galaxy_gelato' ? .55 : 0 })
    });
  }
  return skinMaterialCache.get(id);
}

function applyChickenSkin(target, id) {
  const materials = getSkinMaterials(id);
  target.userData.skinPrimary.forEach(part => { part.material = materials.primary; });
  target.userData.skinSecondary.forEach(part => { part.material = materials.secondary; });
  target.userData.roosterParts.forEach(part => { part.visible = id === 'rooster'; });
  const iceCreamSkin = getSkin(id).collection === 'icecream';
  target.userData.iceCreamParts.forEach(part => { part.visible = iceCreamSkin; });
  target.userData.iceCreamSecondary.forEach(part => { part.material = materials.secondary; });
  target.userData.iceCreamAccent.forEach(part => { part.material = materials.accent; });
  const cakeSkin = getSkin(id).collection === 'cake';
  target.userData.cakeParts.forEach(part => { part.visible = cakeSkin; });
  target.userData.cakeSecondary.forEach(part => { part.material = materials.secondary; });
  target.userData.cakeAccent.forEach(part => { part.material = materials.accent; });
  const halloweenSkin = getSkin(id).collection === 'halloween';
  target.userData.halloweenParts.forEach(part => { part.visible = halloweenSkin; });
  target.userData.halloweenSecondary.forEach(part => { part.material = materials.secondary; });
  target.userData.halloweenAccent.forEach(part => { part.material = materials.accent; });
  const careerSkin = getSkin(id).collection === 'career';
  target.userData.careerParts.forEach(part => { part.visible = careerSkin; });
  target.userData.careerSecondary.forEach(part => { part.material = materials.secondary; });
  target.userData.careerAccent.forEach(part => { part.material = materials.accent; });
  const candySkin = getSkin(id).collection === 'candy';
  target.userData.candyParts.forEach(part => { part.visible = candySkin; });
  target.userData.candySecondary.forEach(part => { part.material = materials.secondary; });
  target.userData.candyAccent.forEach(part => { part.material = materials.accent; });
  const schoolSkin = getSkin(id).collection === 'school';
  target.userData.schoolParts.forEach(part => { part.visible = schoolSkin; });
  target.userData.schoolSecondary.forEach(part => { part.material = materials.secondary; });
  target.userData.schoolAccent.forEach(part => { part.material = materials.accent; });
  const footballSkin = getSkin(id).collection === 'football';
  target.userData.footballParts.forEach(part => { part.visible = footballSkin; });
  target.userData.footballSecondary.forEach(part => { part.material = materials.secondary; });
  target.userData.footballAccent.forEach(part => { part.material = materials.accent; });
  target.userData.plushParts.forEach(part => { part.visible = id === 'plush_pal'; });
}

function mesh(geometry, material, parent, position = [0, 0, 0], rotation = [0, 0, 0]) {
  const item = new THREE.Mesh(geometry, material);
  item.position.set(...position);
  item.rotation.set(...rotation);
  item.castShadow = true;
  item.receiveShadow = true;
  parent.add(item);
  return item;
}

function box(size, material, parent, position, rotation) {
  return mesh(new THREE.BoxGeometry(...size), material, parent, position, rotation);
}

function sphere(radius, material, parent, position, scale = [1, 1, 1]) {
  const item = mesh(new THREE.SphereGeometry(radius, 18, 14), material, parent, position);
  item.scale.set(...scale);
  return item;
}

function cyl(radiusTop, radiusBottom, height, material, parent, position, rotation = [0, 0, 0], segments = 16) {
  return mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material, parent, position, rotation);
}

function createChicken() {
  const g = new THREE.Group();
  const body = sphere(.7, M.white, g, [0, 1.05, 0], [1.02, 1.13, 1.18]);
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 1.78, -.44);
  g.add(headPivot);
  const head = sphere(.48, M.white, headPivot, [0, 0, 0], [1, 1.03, 1]);
  const beak = box([.42, .22, .42], M.orange, headPivot, [0, -.04, -.47]);
  const tongue = box([.17, .08, .38], M.tongue, headPivot, [0, -.19, -.58], [.08, 0, 0]);
  tongue.visible = false;
  const comb = sphere(.18, M.red, headPivot, [0, .48, .01], [.7, 1.25, .7]);
  sphere(.14, M.red, headPivot, [-.17, .42, .04], [.65, 1.1, .65]);
  sphere(.09, M.white, headPivot, [-.22, .12, -.41], [1.08, 1.08, .65]);
  sphere(.09, M.white, headPivot, [.22, .12, -.41], [1.08, 1.08, .65]);
  sphere(.045, M.dark, headPivot, [-.22, .12, -.47]);
  sphere(.045, M.dark, headPivot, [.22, .12, -.47]);
  sphere(.105, M.red, headPivot, [-.09, -.22, -.34], [.75, 1.15, .7]);
  sphere(.105, M.red, headPivot, [.09, -.22, -.34], [.75, 1.15, .7]);
  const wingL = sphere(.38, M.cream, g, [-.62, 1.07, -.02], [.42, 1, .74]);
  const wingR = sphere(.38, M.cream, g, [.62, 1.07, -.02], [.42, 1, .74]);
  const tail = new THREE.Group();
  const tailFeathers = [];
  tail.position.set(0, 1.25, .76);
  g.add(tail);
  [-.28, 0, .28].forEach((x, i) => {
    const feather = mesh(new THREE.ConeGeometry(.19, .8, 7), i === 1 ? M.white : M.cream, tail, [x, .2 + (i === 1 ? .16 : 0), .12], [-.72, 0, 0]);
    feather.scale.z = .75;
    tailFeathers.push(feather);
  });
  const legL = new THREE.Group();
  const legR = new THREE.Group();
  legL.position.set(-.28, .61, 0);
  legR.position.set(.28, .61, 0);
  g.add(legL, legR);
  cyl(.075, .075, .55, M.orange, legL, [0, -.27, 0]);
  cyl(.075, .075, .55, M.orange, legR, [0, -.27, 0]);
  const footL = box([.38, .08, .28], M.orange, legL, [0, -.56, -.1]);
  const footR = box([.38, .08, .28], M.orange, legR, [0, -.56, -.1]);
  // Decorative details are revealed only for the premium rooster skin.
  const roosterParts = [];
  const addRoosterPart = part => { part.visible = false; roosterParts.push(part); return part; };
  addRoosterPart(mesh(new THREE.TorusGeometry(.49, .055, 10, 28), M.gold, g, [0, 1.5, -.02], [Math.PI / 2, 0, 0]));
  [-.22, 0, .22].forEach((x, i) => {
    const crest = addRoosterPart(sphere(.14 + i * .015, M.red, g, [x, 2.38 + (i === 1 ? .1 : 0), -.42], [.7, 1.35, .7]));
    crest.rotation.z = x * -.5;
  });
  [-.27, 0, .27].forEach((x, i) => {
    const jewel = addRoosterPart(mesh(new THREE.OctahedronGeometry(.11 + (i === 1 ? .04 : 0)), i === 1 ? M.goldGlow : M.roosterTeal, g, [x, 1.05 + (i === 1 ? .16 : 0), -.73]));
    jewel.scale.set(1, 1.45, .55);
  });
  addRoosterPart(sphere(.2, M.gold, g, [-.66, 1.08, -.18], [.22, 1.25, .7]));
  addRoosterPart(sphere(.2, M.gold, g, [.66, 1.08, -.18], [.22, 1.25, .7]));
  [[-.34, M.roosterBlue, -.38], [0, M.roosterTeal, -.55], [.34, M.gold, -.38]].forEach(([x, material, tilt], i) => {
    const plume = addRoosterPart(mesh(new THREE.ConeGeometry(.17, 1.22 + i * .08, 8), material, g, [x, 1.62 + i * .12, .82], [tilt, 0, x * -.7]));
    plume.scale.z = .72;
  });

  const iceCreamParts = [];
  const iceCreamSecondary = [];
  const iceCreamAccent = [];
  const addIceCreamPart = (part, collection = null) => {
    part.visible = false;
    iceCreamParts.push(part);
    if (collection) collection.push(part);
    return part;
  };
  addIceCreamPart(mesh(new THREE.ConeGeometry(.24, .52, 12), M.hay, g, [0, 2.48, -.42], [0, 0, Math.PI]));
  addIceCreamPart(sphere(.27, M.cream, g, [0, 2.75, -.42], [1.08, .9, 1.08]), iceCreamSecondary);
  addIceCreamPart(sphere(.12, M.goldGlow, g, [0, 2.96, -.43], [1, 1, 1]), iceCreamAccent);
  addIceCreamPart(mesh(new THREE.TorusGeometry(.52, .055, 10, 28), M.cream, g, [0, 1.48, -.02], [Math.PI / 2, 0, 0]), iceCreamSecondary);
  [
    [-.3, 1.24, -.72, -.35], [0, 1.34, -.76, .28], [.31, 1.18, -.71, -.22],
    [-.37, .93, -.68, .45], [-.08, .91, -.76, -.4], [.24, .83, -.72, .35]
  ].forEach(([x, y, z, rotation]) => {
    addIceCreamPart(box([.09, .15, .055], M.dark, g, [x, y, z], [0, 0, rotation]), iceCreamAccent);
  });
  addIceCreamPart(sphere(.17, M.cream, g, [-.66, 1.12, -.16], [.22, 1.15, .65]), iceCreamSecondary);
  addIceCreamPart(sphere(.17, M.cream, g, [.66, 1.12, -.16], [.22, 1.15, .65]), iceCreamSecondary);

  const cakeParts = [];
  const cakeSecondary = [];
  const cakeAccent = [];
  const addCakePart = (part, collection = null) => {
    part.visible = false;
    cakeParts.push(part);
    if (collection) collection.push(part);
    return part;
  };
  addCakePart(cyl(.4, .43, .34, M.cream, g, [0, 2.58, -.42], [0, 0, 0], 20), cakeSecondary);
  addCakePart(cyl(.44, .44, .09, M.white, g, [0, 2.78, -.42], [0, 0, 0], 20), cakeAccent);
  addCakePart(box([.09, .42, .09], M.cream, g, [0, 3.02, -.42]), cakeAccent);
  addCakePart(sphere(.09, M.goldGlow, g, [0, 3.29, -.42], [.72, 1.25, .72]));
  addCakePart(mesh(new THREE.TorusGeometry(.53, .06, 10, 28), M.cream, g, [0, 1.47, -.02], [Math.PI / 2, 0, 0]), cakeSecondary);
  [
    [-.3, 1.25, -.73, -.42], [-.02, 1.34, -.77, .32], [.3, 1.19, -.72, -.2],
    [-.35, .96, -.69, .35], [-.06, .89, -.77, -.48], [.25, .84, -.73, .44]
  ].forEach(([x, y, z, rotation]) => {
    addCakePart(box([.08, .18, .055], M.gold, g, [x, y, z], [0, 0, rotation]), cakeAccent);
  });

  const halloweenParts = [];
  const halloweenSecondary = [];
  const halloweenAccent = [];
  const addHalloweenPart = (part, collection = null) => {
    part.visible = false;
    halloweenParts.push(part);
    if (collection) collection.push(part);
    return part;
  };
  addHalloweenPart(cyl(.56, .56, .09, M.dark, g, [0, 2.45, -.42], [0, 0, 0], 20), halloweenSecondary);
  const witchHat = addHalloweenPart(mesh(new THREE.ConeGeometry(.43, 1.05, 12), M.dark, g, [0, 2.92, -.42], [0, 0, -.12]), halloweenSecondary);
  witchHat.scale.x = .88;
  addHalloweenPart(mesh(new THREE.TorusGeometry(.37, .055, 9, 24), M.gold, g, [0, 2.68, -.42], [Math.PI / 2, 0, 0]), halloweenAccent);
  addHalloweenPart(box([.22, .18, .08], M.goldGlow, g, [0, 2.68, -.83]), halloweenAccent);
  addHalloweenPart(mesh(new THREE.TorusGeometry(.53, .06, 10, 28), M.dark, g, [0, 1.47, -.02], [Math.PI / 2, 0, 0]), halloweenSecondary);
  [[-.34, 1.2, -.73], [0, 1.31, -.78], [.34, 1.15, -.72], [-.2, .88, -.75], [.2, .86, -.74]].forEach(([x, y, z], i) => {
    const charm = addHalloweenPart(mesh(new THREE.OctahedronGeometry(.085), M.goldGlow, g, [x, y, z]), halloweenAccent);
    charm.rotation.z = i * .7;
  });

  const careerParts = [];
  const careerSecondary = [];
  const careerAccent = [];
  const addCareerPart = (part, collection = null) => {
    part.visible = false;
    careerParts.push(part);
    if (collection) collection.push(part);
    return part;
  };
  addCareerPart(sphere(.42, M.denim, g, [0, 2.5, -.42], [1, .48, 1]), careerSecondary);
  addCareerPart(box([.65, .09, .4], M.denim, g, [0, 2.43, -.68]), careerSecondary);
  addCareerPart(box([.24, .15, .06], M.gold, g, [0, 2.52, -.83]), careerAccent);
  addCareerPart(mesh(new THREE.TorusGeometry(.53, .06, 10, 28), M.denim, g, [0, 1.47, -.02], [Math.PI / 2, 0, 0]), careerSecondary);
  addCareerPart(box([.13, .42, .07], M.red, g, [0, 1.18, -.76], [0, 0, .06]), careerAccent);
  addCareerPart(mesh(new THREE.OctahedronGeometry(.12), M.red, g, [0, .92, -.76]), careerAccent);
  addCareerPart(box([.24, .19, .06], M.goldGlow, g, [.35, 1.29, -.7]), careerAccent);

  const candyParts = [];
  const candySecondary = [];
  const candyAccent = [];
  const addCandyPart = (part, collection = null) => {
    part.visible = false;
    candyParts.push(part);
    if (collection) collection.push(part);
    return part;
  };
  addCandyPart(sphere(.38, M.cream, g, [0, 2.53, -.42], [1, .6, 1]), candySecondary);
  addCandyPart(mesh(new THREE.TorusGeometry(.36, .055, 10, 28), M.gold, g, [0, 2.55, -.42], [Math.PI / 2, 0, 0]), candyAccent);
  addCandyPart(mesh(new THREE.TorusGeometry(.53, .06, 10, 28), M.cream, g, [0, 1.47, -.02], [Math.PI / 2, 0, 0]), candySecondary);
  addCandyPart(cyl(.035, .035, .72, M.white, g, [-.7, 1.39, -.2], [0, 0, -.22], 10));
  addCandyPart(sphere(.2, M.goldGlow, g, [-.78, 1.75, -.2], [.9, .9, .55]), candyAccent);
  [[-.31, 1.25, -.72], [0, 1.34, -.77], [.31, 1.18, -.72], [-.2, .89, -.75], [.23, .86, -.74]].forEach(([x, y, z], i) => {
    const sweet = addCandyPart(mesh(new THREE.OctahedronGeometry(.09), M.goldGlow, g, [x, y, z]), candyAccent);
    sweet.rotation.z = i * .55;
  });

  const schoolParts = [];
  const schoolSecondary = [];
  const schoolAccent = [];
  const addSchoolPart = (part, collection = null) => {
    part.visible = false;
    schoolParts.push(part);
    if (collection) collection.push(part);
    return part;
  };
  addSchoolPart(sphere(.4, M.denim, g, [0, 2.48, -.42], [1, .45, 1]), schoolSecondary);
  addSchoolPart(box([.68, .08, .38], M.denim, g, [0, 2.42, -.68]), schoolSecondary);
  addSchoolPart(mesh(new THREE.TorusGeometry(.53, .055, 10, 28), M.denim, g, [0, 1.47, -.02], [Math.PI / 2, 0, 0]), schoolSecondary);
  addSchoolPart(box([.13, .38, .07], M.red, g, [0, 1.18, -.77]), schoolAccent);
  addSchoolPart(mesh(new THREE.OctahedronGeometry(.12), M.red, g, [0, .93, -.78]), schoolAccent);
  addSchoolPart(box([.86, .78, .3], M.denim, g, [0, 1.22, .69]), schoolSecondary);
  addSchoolPart(box([.14, .62, .12], M.red, g, [-.47, 1.2, .44], [0, 0, -.12]), schoolAccent);
  addSchoolPart(box([.14, .62, .12], M.red, g, [.47, 1.2, .44], [0, 0, .12]), schoolAccent);
  addSchoolPart(box([.2, .56, .42], M.gold, g, [.72, 1.05, -.12], [0, 0, -.15]), schoolAccent);

  const footballParts = [];
  const footballSecondary = [];
  const footballAccent = [];
  const addFootballPart = (part, collection = null) => {
    part.visible = false;
    footballParts.push(part);
    if (collection) collection.push(part);
    return part;
  };
  addFootballPart(sphere(.5, M.denim, g, [0, 2.03, -.4], [1.08, .62, 1.06]), footballSecondary);
  addFootballPart(sphere(.17, M.denim, g, [-.47, 1.82, -.42], [.55, 1, .8]), footballSecondary);
  addFootballPart(sphere(.17, M.denim, g, [.47, 1.82, -.42], [.55, 1, .8]), footballSecondary);
  addFootballPart(box([.76, .055, .055], M.gold, g, [0, 1.72, -.96]), footballAccent);
  addFootballPart(box([.055, .4, .055], M.gold, g, [-.32, 1.85, -.91]), footballAccent);
  addFootballPart(box([.055, .4, .055], M.gold, g, [.32, 1.85, -.91]), footballAccent);
  addFootballPart(sphere(.35, M.denim, g, [-.67, 1.36, -.01], [.65, .6, 1]), footballSecondary);
  addFootballPart(sphere(.35, M.denim, g, [.67, 1.36, -.01], [.65, .6, 1]), footballSecondary);
  addFootballPart(mesh(new THREE.TorusGeometry(.54, .065, 10, 28), M.denim, g, [0, 1.48, -.02], [Math.PI / 2, 0, 0]), footballSecondary);
  addFootballPart(box([.62, .12, .07], M.gold, g, [0, 1.14, -.78]), footballAccent);
  addFootballPart(box([.36, .12, .075], M.gold, g, [0, .94, -.8]), footballAccent);

  // Plush Pal details based on the supplied tan, red, blue, and yellow toy chicken.
  const plushParts = [];
  const addPlushPart = part => { part.visible = false; plushParts.push(part); return part; };
  addPlushPart(sphere(.21, M.red, headPivot, [-.21, .04, -.4], [1.42, 1.3, .3]));
  addPlushPart(sphere(.21, M.red, headPivot, [.21, .04, -.4], [1.42, 1.3, .3]));
  addPlushPart(sphere(.34, M.yellow, g, [-.31, .12, -.18], [1.02, .58, 1.18]));
  addPlushPart(sphere(.34, M.yellow, g, [.31, .12, -.18], [1.02, .58, 1.18]));
  g.userData = {
    body, head, headPivot, beak, tongue, comb, wingL, wingR, legL, legR, footL, footR, tail,
    skinPrimary: [body, head, tailFeathers[1]],
    skinSecondary: [wingL, wingR, tailFeathers[0], tailFeathers[2]],
    roosterParts,
    iceCreamParts,
    iceCreamSecondary,
    iceCreamAccent,
    cakeParts,
    cakeSecondary,
    cakeAccent,
    halloweenParts,
    halloweenSecondary,
    halloweenAccent,
    careerParts,
    careerSecondary,
    careerAccent,
    candyParts,
    candySecondary,
    candyAccent,
    schoolParts,
    schoolSecondary,
    schoolAccent,
    footballParts,
    footballSecondary,
    footballAccent,
    plushParts
  };
  return g;
}

function createFarmer() {
  const g = new THREE.Group();
  const torso = box([1.1, 1.4, .62], M.denim, g, [0, 1.75, 0]);
  box([1.14, .45, .67], M.red, g, [0, 2.28, 0]);
  const head = sphere(.48, M.skin, g, [0, 2.92, 0], [1, 1.08, .95]);
  box([1.2, .16, .9], M.hay, g, [0, 3.3, 0]);
  cyl(.47, .58, .34, M.hay, g, [0, 3.5, 0]);
  sphere(.055, M.dark, g, [-.17, 3, -.44]);
  sphere(.055, M.dark, g, [.17, 3, -.44]);
  box([.33, .09, .06], M.brown, g, [0, 2.78, -.47]);
  const legL = box([.38, 1.15, .46], M.denim, g, [-.3, .62, 0]);
  const legR = box([.38, 1.15, .46], M.denim, g, [.3, .62, 0]);
  box([.46, .18, .72], M.brown, g, [-.3, .05, -.08]);
  box([.46, .18, .72], M.brown, g, [.3, .05, -.08]);
  const armL = new THREE.Group();
  const armR = new THREE.Group();
  armL.position.set(-.68, 2.38, 0);
  armR.position.set(.68, 2.38, 0);
  g.add(armL, armR);
  cyl(.14, .16, 1.05, M.skin, armL, [0, -.48, 0]);
  cyl(.14, .16, 1.05, M.skin, armR, [0, -.48, 0]);
  armL.rotation.x = Math.PI / 2;
  g.userData = { torso, head, armL, armR, legL, legR };
  return g;
}

const chicken = createChicken();
applyChickenSkin(chicken, selectedSkinId);
chicken.position.set(0, 0, 2.1);
scene.add(chicken);

const farmer = createFarmer();
farmer.position.set(-1.3, 0, 5.1);
farmer.scale.setScalar(.92);
scene.add(farmer);

const avatarScene = new THREE.Scene();
const avatarCamera = new THREE.PerspectiveCamera(34, 190 / 210, .1, 30);
avatarCamera.position.set(0, 2.45, 7.4);
avatarCamera.lookAt(0, 1.35, 0);
avatarScene.add(new THREE.HemisphereLight(0xffffff, 0x315b36, 3));
const avatarLight = new THREE.DirectionalLight(0xffefbe, 3.4);
avatarLight.position.set(-3, 6, 5);
avatarScene.add(avatarLight);
const avatarChicken = createChicken();
avatarChicken.position.y = -.12;
applyChickenSkin(avatarChicken, selectedSkinId);
avatarScene.add(avatarChicken);
const avatarRenderer = new THREE.WebGLRenderer({ canvas: avatarCanvas, alpha: true, antialias: true });
avatarRenderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
avatarRenderer.setSize(190, 210, false);
avatarRenderer.outputColorSpace = THREE.SRGBColorSpace;

const world = new THREE.Group();
scene.add(world);

function trackCurveOffset(z) {
  const distance = Math.max(0, 2 - z);
  return -Math.min(16, distance * distance * .00105);
}

function trackCurveAngle(z) {
  const distance = Math.max(0, 2 - z);
  return Math.atan(Math.min(.34, distance * .0021));
}

const fields = new THREE.Group();
box([120, .4, 260], M.grass, fields, [0, -.25, -72]);
world.add(fields);

const roadSections = [];
for (let i = 0; i < 24; i++) {
  const section = new THREE.Group();
  section.position.z = 14 - i * 8;
  box([10.5, .12, 8.5], M.road, section, [0, .02, 0]);
  box([.18, .13, 8.5], M.roadDark, section, [-5.28, .09, 0]);
  box([.18, .13, 8.5], M.roadDark, section, [5.28, .09, 0]);
  section.position.x = trackCurveOffset(section.position.z);
  section.rotation.y = trackCurveAngle(section.position.z);
  world.add(section);
  roadSections.push(section);
}

const roadMarks = [];
for (let i = 0; i < 17; i++) {
  const segment = new THREE.Group();
  segment.position.z = 8 - i * 10;
  [-1.52, 1.52].forEach(x => box([.12, .025, 4.3], M.line, segment, [x, .095, 0]));
  [-6.4, 6.4].forEach(x => {
    box([.14, 1.05, .14], M.white, segment, [x, .52, 0]);
    box([.14, .13, 9.8], M.white, segment, [x, .43, 0]);
    box([.14, .13, 9.8], M.white, segment, [x, .9, 0]);
  });
  segment.position.x = trackCurveOffset(segment.position.z);
  segment.rotation.y = trackCurveAngle(segment.position.z);
  world.add(segment);
  roadMarks.push(segment);
}

function createTree(x, z, scale = 1) {
  const g = new THREE.Group();
  cyl(.22, .3, 2.2, M.wood, g, [0, 1.1, 0]);
  sphere(1.15, Math.random() > .5 ? M.green : M.grass2, g, [0, 2.6, 0], [1.05, 1.25, 1.05]);
  g.userData.trackSideX = x;
  g.position.set(x + trackCurveOffset(z), 0, z);
  g.scale.setScalar(scale);
  world.add(g);
  return g;
}

function createBarn(x, z) {
  const g = new THREE.Group();
  box([5, 3.8, 4], M.red, g, [0, 1.9, 0]);
  const roof = mesh(new THREE.ConeGeometry(3.7, 2.1, 4), M.white, g, [0, 4.65, 0], [0, Math.PI / 4, 0]);
  roof.scale.z = .8;
  box([1.8, 2.4, .08], M.white, g, [0, 1.45, 2.04]);
  box([1.45, 2.05, .1], M.brown, g, [0, 1.4, 2.1]);
  g.userData.trackSideX = x;
  g.position.set(x + trackCurveOffset(z), 0, z);
  world.add(g);
  return g;
}

const scenery = [];
for (let i = 0; i < 20; i++) {
  const side = i % 2 ? 1 : -1;
  scenery.push(createTree(side * (8 + Math.random() * 10), -i * 13 - 5, .7 + Math.random() * .6));
}
scenery.push(createBarn(-15, -54));
scenery.push(createBarn(16, -118));

const horizon = new THREE.Group();
for (let i = 0; i < 8; i++) {
  const mountain = mesh(new THREE.ConeGeometry(12 + Math.random() * 6, 12 + Math.random() * 7, 5), mat(i % 2 ? 0x75a87b : 0x699678), horizon, [-65 + i * 19, 4, -135]);
  mountain.rotation.y = Math.random();
}
scene.add(horizon);

const clouds = [];
for (let i = 0; i < 7; i++) {
  const c = new THREE.Group();
  sphere(2.2, M.white, c, [0, 0, 0], [1.5, .65, .7]);
  sphere(1.5, M.white, c, [-1.6, .3, 0], [1, .7, .7]);
  sphere(1.7, M.white, c, [1.6, .25, 0], [1, .72, .72]);
  c.position.set(-30 + i * 10, 14 + (i % 2) * 3, -70 - (i % 3) * 14);
  scene.add(c); clouds.push(c);
}

function createGoldenEgg() {
  const g = new THREE.Group();
  const egg = sphere(.42, M.gold, g, [0, 0, 0], [.82, 1.16, .82]);
  const ring = mesh(new THREE.TorusGeometry(.62, .045, 8, 24), M.goldGlow, g, [0, 0, 0], [Math.PI / 2, 0, 0]);
  for (let i = 0; i < 3; i++) {
    const sparkle = mesh(new THREE.OctahedronGeometry(.09), M.goldGlow, g, [Math.cos(i * 2.1) * .72, Math.sin(i * 2.1) * .5, 0]);
    sparkle.userData.phase = i;
  }
  g.userData.egg = egg;
  g.userData.ring = ring;
  return g;
}

function createMagnetPowerup() {
  const g = new THREE.Group();
  mesh(new THREE.TorusGeometry(.5, .16, 12, 30, Math.PI), M.red, g, [0, .18, 0]);
  box([.32, .5, .32], M.red, g, [-.5, -.08, 0]);
  box([.32, .5, .32], M.red, g, [.5, -.08, 0]);
  box([.34, .28, .34], M.metal, g, [-.5, -.47, 0]);
  box([.34, .28, .34], M.metal, g, [.5, -.47, 0]);
  const halo = mesh(new THREE.TorusGeometry(.78, .045, 8, 28), M.goldGlow, g, [0, 0, 0], [Math.PI / 2, 0, 0]);
  g.userData.halo = halo;
  return g;
}

function createDoublePickup() {
  const g = new THREE.Group();
  const two = new THREE.Group();
  const x = new THREE.Group();
  const bar = (parent, position, size, rotation = [0, 0, 0]) => box(size, M.gold, parent, position, rotation);
  bar(two, [0, .48, 0], [.58, .14, .17]);
  bar(two, [.23, .25, 0], [.14, .48, .17]);
  bar(two, [0, 0, 0], [.58, .14, .17], [0, 0, -.28]);
  bar(two, [-.23, -.25, 0], [.14, .48, .17]);
  bar(two, [0, -.48, 0], [.58, .14, .17]);
  bar(x, [0, 0, 0], [.14, 1.05, .17], [0, 0, .64]);
  bar(x, [0, 0, 0], [.14, 1.05, .17], [0, 0, -.64]);
  two.position.x = -.43;
  x.position.x = .43;
  g.add(two, x);
  return g;
}

function createHayBale() {
  const g = new THREE.Group();
  const bale = cyl(.68, .68, 1.35, M.hay, g, [0, .68, 0], [0, 0, Math.PI / 2], 18);
  [0, Math.PI / 2].forEach(rot => mesh(new THREE.TorusGeometry(.7, .045, 7, 18), M.brown, g, [0, .68, 0], [rot, Math.PI / 2, 0]));
  return g;
}

function createHighGate() {
  const g = new THREE.Group();
  box([.34, 2.8, .34], M.wood, g, [-1.2, 1.4, 0]);
  box([.34, 2.8, .34], M.wood, g, [1.2, 1.4, 0]);
  box([2.75, .5, .52], M.red, g, [0, 2.05, 0]);
  for (let x = -.8; x <= .8; x += .8) box([.11, .62, .12], M.white, g, [x, 2.05, -.3], [0, 0, Math.PI / 4]);
  return g;
}

function createChoiceObstacle() {
  const g = new THREE.Group();
  box([2.45, .18, .45], M.wood, g, [0, 1.42, 0], [0, 0, -.08]);
  sphere(.48, M.grass2, g, [-.8, 1.46, 0], [1.2, .55, .55]);
  sphere(.5, M.grass2, g, [.76, 1.36, 0], [1.2, .55, .55]);
  box([.22, 1.1, .22], M.wood, g, [-1.12, .55, 0]);
  box([.22, 1.1, .22], M.wood, g, [1.12, .55, 0]);
  return g;
}

function addWheel(g, x, y, z, scale = 1) {
  const wheel = cyl(.62 * scale, .62 * scale, .36, M.tire, g, [x, y, z], [Math.PI / 2, 0, 0], 18);
  cyl(.24 * scale, .24 * scale, .39, M.metal, g, [x, y, z], [Math.PI / 2, 0, 0], 14);
  return wheel;
}

function createTractor() {
  const g = new THREE.Group();
  box([2.55, 1.35, 3.2], M.green, g, [0, 1.3, 0]);
  box([2.2, 1.75, 1.55], M.green, g, [0, 2.48, .55]);
  box([1.75, 1.2, .08], mat(0xaee8f3, { metalness: .05, roughness: .15 }), g, [0, 2.58, -.25]);
  cyl(.25, .3, 1.9, M.dark, g, [.78, 3.15, .5]);
  box([2.66, .22, .28], M.yellow, g, [0, 1.26, -1.69]);
  addWheel(g, -1.18, .72, -.75, 1.12); addWheel(g, 1.18, .72, -.75, 1.12);
  addWheel(g, -1.18, .67, 1.05, .84); addWheel(g, 1.18, .67, 1.05, .84);
  return g;
}

function createPurpleTube() {
  const g = new THREE.Group();
  const radius = 1.2;
  const length = 10.5;
  const shell = mesh(new THREE.CylinderGeometry(radius, radius, length, 32, 1, true), M.tubeGlass, g, [0, radius, 0], [Math.PI / 2, 0, 0]);
  shell.castShadow = false;
  shell.renderOrder = 2;
  [-length / 2, -length / 6, length / 6, length / 2].forEach(z => {
    const hoop = mesh(new THREE.TorusGeometry(radius, .075, 10, 32), M.tubeRim, g, [0, radius, z]);
    hoop.castShadow = false;
  });
  g.userData.length = length;
  g.userData.topY = radius * 2;
  return g;
}

const lanes = [-3.05, 0, 3.05];
let moving = [];
let state = 'home';
let lane = 1;
let targetX = 0;
let y = 0;
let velocityY = 0;
let duckTimer = 0;
let duckRoll = 0;
let score = 0;
let eggCount = 0;
let speed = 23;
let runTime = 0;
let spawnDistance = 11.5;
let farmerExit = false;
let farmerPointTimer = 0;
let crashTime = 0;
let magnetTimer = 0;
let doubleTimer = 0;
let tauntTriggered = false;
let tauntWaitingForSound = false;
let tauntReturnTimer = 0;
let tauntMutedTimer = 0;
const TAUNT_RETURN_SECONDS = .22;
const TAUNT_SOUND_FALLBACK_SECONDS = 1.2;
let avatarGreetingTimer = 0;
let avatarGreetingDuration = 1;
let hiPlaying = false;
let standingOnTube = false;
let best = Number(localStorage.getItem('feather-rush-best') || 0);
bestEl.textContent = best.toLocaleString();

audio.taunt.addEventListener('ended', () => {
  if (!tauntWaitingForSound || state === 'home') return;
  tauntWaitingForSound = false;
  tauntReturnTimer = TAUNT_RETURN_SECONDS;
  syncMusicVolume();
});

audio.hi.addEventListener('ended', () => {
  hiPlaying = false;
  syncMusicVolume();
});

function playTimedTaunt() {
  tauntTriggered = true;
  tauntWaitingForSound = true;
  tauntReturnTimer = 0;
  if (muted) {
    tauntMutedTimer = TAUNT_SOUND_FALLBACK_SECONDS;
    syncMusicVolume();
    return;
  }
  tauntMutedTimer = 0;
  syncMusicVolume();
  audio.taunt.currentTime = 0;
  audio.taunt.play().catch(() => {
    tauntWaitingForSound = false;
    tauntReturnTimer = TAUNT_RETURN_SECONDS;
    syncMusicVolume();
  });
}

function playAvatarGreeting() {
  if (state !== 'home' || home.classList.contains('hidden')) return;
  avatarGreetingDuration = Number.isFinite(audio.hi.duration) ? audio.hi.duration : 1;
  avatarGreetingTimer = avatarGreetingDuration;
  audio.hi.pause();
  audio.hi.currentTime = 0;
  if (muted) return;
  hiPlaying = true;
  syncMusicVolume();
  audio.hi.play().catch(() => {
    hiPlaying = false;
    syncMusicVolume();
  });
}

function saveProfile() {
  localStorage.setItem('feather-rush-eggs', String(walletEggs));
  localStorage.setItem('feather-rush-skins', JSON.stringify(ownedSkins));
  localStorage.setItem('feather-rush-selected-skin', selectedSkinId);
  localStorage.setItem('ranch-runners-chicken-name', chickenName);
}

function updateWalletDisplay() {
  const value = walletEggs.toLocaleString();
  walletEggsEl.textContent = value;
  shopEggsEl.textContent = value;
}

let toastTimer = 0;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = setTimeout(() => { toast.hidden = true; }, 2400);
}

const PREVIEW_SPIN_SECONDS = 10;
const PREVIEW_SPIN_FRAMES = 16;
const previewSpinStart = performance.now();

function buildSkinSpinFrames() {
  const frames = new Map();
  const canvas = document.createElement('canvas');
  canvas.width = 150;
  canvas.height = 120;
  const previewRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  previewRenderer.setPixelRatio(1);
  previewRenderer.setSize(150, 120, false);
  previewRenderer.setClearColor(0x8ed8f1, 1);
  previewRenderer.outputColorSpace = THREE.SRGBColorSpace;
  const previewScene = new THREE.Scene();
  previewScene.add(new THREE.HemisphereLight(0xffffff, 0x39663d, 3));
  const light = new THREE.DirectionalLight(0xfff0bf, 3);
  light.position.set(-3, 6, 5);
  previewScene.add(light);
  const previewCamera = new THREE.PerspectiveCamera(36, 1.25, .1, 30);
  previewCamera.position.set(0, 2.45, 7.3);
  previewCamera.lookAt(0, 1.35, 0);
  const previewChicken = createChicken();
  previewChicken.position.y = -.08;
  previewScene.add(previewChicken);
  for (const skin of SKINS) {
    applyChickenSkin(previewChicken, skin.id);
    const skinFrames = [];
    for (let frame = 0; frame < PREVIEW_SPIN_FRAMES; frame++) {
      previewChicken.rotation.y = Math.PI + frame / PREVIEW_SPIN_FRAMES * Math.PI * 2;
      previewRenderer.render(previewScene, previewCamera);
      skinFrames.push(canvas.toDataURL('image/webp', .86));
    }
    frames.set(skin.id, skinFrames);
  }
  previewRenderer.dispose();
  previewRenderer.forceContextLoss();
  return frames;
}

const skinSpinFrames = buildSkinSpinFrames();
let lastSkinPreviewFrame = -1;

function getPreviewSpinPhase(now) {
  return ((now - previewSpinStart) / 1000 % PREVIEW_SPIN_SECONDS) / PREVIEW_SPIN_SECONDS;
}

function updateSkinPreviewFrames(frame) {
  if (frame === lastSkinPreviewFrame) return;
  lastSkinPreviewFrame = frame;
  document.querySelectorAll('[data-skin-preview]').forEach(image => {
    image.src = skinSpinFrames.get(image.dataset.skinPreview)[frame];
  });
}

function skinCard(skin, mode) {
  const owned = ownedSkins.includes(skin.id);
  const selected = selectedSkinId === skin.id;
  const lock = themeLockInfo(skin);
  const themeLocked = !owned && lock.locked;
  const status = selected ? 'Selected' : owned ? 'Owned' : `${skin.price.toLocaleString()} eggs`;
  const price = themeLocked
    ? `<span class="theme-lock">🔒 Finish ${THEME_NAMES[lock.previous]}</span>`
    : !owned ? `<span class="skin-price"><span class="mini-egg"></span>${skin.price.toLocaleString()}</span>` : status;
  const action = themeLocked ? 'Locked' : owned ? 'Select' : 'Buy';
  return `<button class="skin-card ${selected ? 'selected' : ''} ${owned ? '' : 'locked'} ${themeLocked ? 'theme-locked-card' : ''} ${skin.featured ? 'featured-card' : ''} ${skin.rooster ? 'rooster-card' : ''} ${skin.collection === 'icecream' ? 'ice-cream-card' : ''} ${skin.collection === 'cake' ? 'cake-card' : ''} ${skin.collection === 'halloween' ? 'halloween-card' : ''} ${skin.collection === 'career' ? 'career-card' : ''} ${skin.collection === 'candy' ? 'candy-card' : ''} ${skin.collection === 'school' ? 'school-card' : ''} ${skin.collection === 'football' ? 'football-card' : ''}" type="button" data-skin="${skin.id}" data-mode="${mode}" aria-label="${action} ${skin.name}" aria-disabled="${themeLocked}">
    <img src="${skinSpinFrames.get(skin.id)[0]}" data-skin-preview="${skin.id}" alt="${skin.name}, slowly spinning" />
    <strong>${skin.name}</strong>
    <small>${price}</small>
  </button>`;
}

function renderSkinPanels() {
  wardrobeGrid.innerHTML = SKINS.filter(skin => ownedSkins.includes(skin.id)).map(skin => skinCard(skin, 'wardrobe')).join('');
  shopGrid.innerHTML = SKINS
    .filter(skin => !skin.collection)
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .map(skin => skinCard(skin, 'shop')).join('');
  iceCreamGrid.innerHTML = SKINS.filter(skin => skin.collection === 'icecream').map(skin => skinCard(skin, 'shop')).join('');
  cakeGrid.innerHTML = SKINS.filter(skin => skin.collection === 'cake').map(skin => skinCard(skin, 'shop')).join('');
  halloweenGrid.innerHTML = SKINS.filter(skin => skin.collection === 'halloween').map(skin => skinCard(skin, 'shop')).join('');
  careerGrid.innerHTML = SKINS.filter(skin => skin.collection === 'career').map(skin => skinCard(skin, 'shop')).join('');
  candyGrid.innerHTML = SKINS.filter(skin => skin.collection === 'candy').map(skin => skinCard(skin, 'shop')).join('');
  schoolGrid.innerHTML = SKINS.filter(skin => skin.collection === 'school').map(skin => skinCard(skin, 'shop')).join('');
  footballGrid.innerHTML = SKINS.filter(skin => skin.collection === 'football').map(skin => skinCard(skin, 'shop')).join('');
  lastSkinPreviewFrame = -1;
  avatarNameEl.textContent = getSkin(selectedSkinId).name;
  updateWalletDisplay();
}

function selectSkin(id) {
  if (!ownedSkins.includes(id)) return;
  selectedSkinId = id;
  applyChickenSkin(chicken, id);
  applyChickenSkin(avatarChicken, id);
  saveProfile();
  renderSkinPanels();
  showToast(`${getSkin(id).name} selected`);
}

function buyOrSelectSkin(id) {
  const skin = getSkin(id);
  if (ownedSkins.includes(id)) {
    selectSkin(id);
    return;
  }
  const lock = themeLockInfo(skin);
  if (lock.locked) {
    showToast(`Buy every ${THEME_NAMES[lock.previous]} skin first`);
    return;
  }
  if (walletEggs < skin.price) {
    showToast(`You need ${(skin.price - walletEggs).toLocaleString()} more eggs`);
    return;
  }
  walletEggs -= skin.price;
  ownedSkins.push(id);
  saveProfile();
  selectSkin(id);
  showToast(`${skin.name} unlocked!`);
}

function closeMenuPanels() {
  wardrobePanel.hidden = true;
  shopPanel.hidden = true;
  soundboardPanel.hidden = true;
  ensureMusic();
}

function openSoundboard() {
  if (state !== 'home' || home.classList.contains('hidden')) return;
  wardrobePanel.hidden = true;
  shopPanel.hidden = true;
  soundboardPanel.hidden = false;
  ensureMusic();
}

function ensureMusic() {
  if (!shopPanel.hidden) {
    audio.music.pause();
    if (!muted && audio.shop.paused) audio.shop.play().catch(() => {});
    return;
  }
  if (!audio.shop.paused || audio.shop.currentTime > 0) {
    audio.shop.pause();
    audio.shop.currentTime = 0;
  }
  if (!muted && audio.music.paused) audio.music.play().catch(() => {});
}

function syncMusicVolume() {
  const gameplay = state === 'running' || state === 'countdown';
  const taunting = tauntWaitingForSound || tauntReturnTimer > 0;
  const gameplayVolume = taunting ? GAME_MUSIC_VOLUME * .5 : GAME_MUSIC_VOLUME;
  const normalVolume = gameplay ? gameplayVolume : MENU_MUSIC_VOLUME;
  audio.music.volume = muted ? 0 : hiPlaying ? normalVolume * .3 : normalVolume;
}

function addMoving(group, kind, laneIndex, z, extra = {}) {
  const laneX = lanes[laneIndex];
  group.position.set(laneX + trackCurveOffset(z), extra.y || 0, z);
  group.rotation.y = trackCurveAngle(z) + (extra.facingOffset || 0);
  world.add(group);
  const item = { group, kind, lane: laneIndex, laneX, hit: false, collected: false, baseY: extra.y || 0, crossOffset: 0, ...extra };
  moving.push(item);
  return item;
}

function spawnEgg(laneIndex, z, height = .95) {
  return addMoving(createGoldenEgg(), 'egg', laneIndex, z, { y: height });
}

function spawnEggRow(laneIndex, z, count = 5, spacing = 2.5, height = .95) {
  for (let i = 0; i < count; i++) spawnEgg(laneIndex, z - i * spacing, height);
}

function spawnTube(laneIndex, z) {
  addMoving(createPurpleTube(), 'tube', laneIndex, z);
  spawnEggRow(laneIndex, z + 3.2, 3, 3.2, .78);
}

function spawnRow() {
  const z = -105;
  const roll = Math.random();
  const obstacleKinds = ['jump', 'duck', 'choice', 'tractor', 'tube', 'magnet', 'double'];
  const tunnelHasClearEntrance = !moving.some(item => obstacleKinds.includes(item.kind) && Math.abs(item.group.position.z - z) < 15);
  if (roll < .08 && tunnelHasClearEntrance) {
    spawnTube(Math.floor(Math.random() * 3), z);
    return 'tube';
  }
  if (magnetTimer <= 0 && !moving.some(item => item.kind === 'magnet') && Math.random() < .09) {
    addMoving(createMagnetPowerup(), 'magnet', Math.floor(Math.random() * 3), z - 10, { y: 1.15 });
  }
  if (doubleTimer <= 0 && !moving.some(item => item.kind === 'double') && Math.random() < .055) {
    addMoving(createDoublePickup(), 'double', Math.floor(Math.random() * 3), z - 7, { y: 1.25 });
  }
  if (roll < .25) {
    spawnEggRow(Math.floor(Math.random() * 3), z, 3, 2.65);
    return 'eggs';
  }

  const ln = Math.floor(Math.random() * 3);
  if (roll < .44) {
    addMoving(createHayBale(), 'jump', ln, z);
    const safeLane = (ln + (Math.random() > .5 ? 1 : 2)) % 3;
    spawnEggRow(safeLane, z - 1, 2, 2.65);
  } else if (roll < .62) {
    addMoving(createHighGate(), 'duck', ln, z);
    spawnEggRow(ln, z - 2, 2, 2.65, .55);
  } else if (roll < .78) {
    addMoving(createChoiceObstacle(), 'choice', ln, z);
    const safeLane = (ln + (Math.random() > .5 ? 1 : 2)) % 3;
    spawnEggRow(safeLane, z - 1, 2, 2.65);
  } else {
    const tractorLane = Math.random() > .5 ? 0 : 2;
    addMoving(createTractor(), 'tractor', tractorLane, z, {
      facingOffset: Math.PI,
      oncomingSpeed: 8
    });
    const safeLane = tractorLane === 0 ? 2 : 0;
    spawnEggRow(safeLane, z, 3, 2.65);
  }
  return 'obstacle';
}

function clearMoving() {
  for (const item of moving) world.remove(item.group);
  moving = [];
}

function resetRun() {
  clearMoving();
  lane = 1; targetX = 0; y = 0; velocityY = 0; duckTimer = 0; duckRoll = 0;
  score = 0; eggCount = 0; speed = 23; runTime = 0; spawnDistance = 11.5;
  farmerExit = false; farmerPointTimer = 0; crashTime = 0; magnetTimer = 0; doubleTimer = 0; standingOnTube = false;
  tauntTriggered = false; tauntWaitingForSound = false; tauntReturnTimer = 0; tauntMutedTimer = 0;
  audio.taunt.pause();
  audio.taunt.currentTime = 0;
  audio.hi.pause();
  audio.hi.currentTime = 0;
  hiPlaying = false;
  avatarGreetingTimer = 0;
  magnetStatus.hidden = true;
  doubleStatus.hidden = true;
  chicken.visible = true;
  chicken.position.set(0, 0, 2.1);
  chicken.rotation.set(0, 0, 0);
  chicken.scale.set(1, 1, 1);
  chicken.userData.headPivot.rotation.set(0, 0, 0);
  chicken.userData.tongue.visible = false;
  farmer.visible = true;
  farmer.position.set(0, 0, 5.1);
  farmer.rotation.set(0, 0, 0);
  scoreEl.textContent = '0'; eggsEl.textContent = '0';
  for (let i = 0; i < 4; i++) spawnEgg(1, -28 - i * 3);
}

function startGame() {
  resetRun();
  closeMenuPanels();
  pauseScreen.hidden = true;
  state = 'countdown';
  home.classList.add('hidden');
  hud.hidden = false;
  touchControls.hidden = false;
  syncMusicVolume();
  ensureMusic();
  let n = 3;
  countdownEl.textContent = n;
  const timer = setInterval(() => {
    n--;
    if (n > 0) countdownEl.textContent = n;
    else if (n === 0) {
      countdownEl.textContent = 'RUN!';
      if (!muted) farmerPointTimer = .5;
      playSound(audio.farmer);
      state = 'running';
    } else {
      countdownEl.textContent = '';
      clearInterval(timer);
    }
  }, 650);
}

function perform(action) {
  if (state !== 'running') return;
  const previousLane = lane;
  if (action === 'left') lane = Math.max(0, lane - 1);
  if (action === 'right') lane = Math.min(2, lane + 1);
  if (lane !== previousLane) playSound(action === 'left' ? audio.left : audio.right);
  targetX = lanes[lane];
  if (action === 'jump' && (y < .04 || standingOnTube)) {
    velocityY = 11.8;
    duckTimer = 0;
    duckRoll = 0;
    standingOnTube = false;
    playSound(audio.jump);
  }
  if (action === 'duck' && duckTimer <= 0) {
    y = 0;
    velocityY = 0;
    chicken.position.y = 0;
    standingOnTube = false;
    duckTimer = .5;
    duckRoll = 0;
    playSound(audio.crouch);
  }
}

function collectEgg(item) {
  if (item.collected) return;
  item.collected = true;
  eggCount++;
  walletEggs++;
  saveProfile();
  updateWalletDisplay();
  score += doubleTimer > 0 ? 50 : 25;
  eggsEl.textContent = eggCount.toLocaleString();
  playCoinSound();
  item.group.scale.setScalar(1.65);
  item.group.visible = false;
}

function collectMagnet(item) {
  if (item.collected) return;
  item.collected = true;
  item.group.visible = false;
  magnetTimer = 8;
  magnetStatus.hidden = false;
  magnetTimeEl.textContent = '8';
  playSound(audio.powerup);
}

function collectDouble(item) {
  if (item.collected) return;
  item.collected = true;
  item.group.visible = false;
  doubleTimer = 8;
  doubleStatus.hidden = false;
  doubleTimeEl.textContent = '8';
  playSound(audio.powerup);
}

function crash() {
  if (state !== 'running') return;
  state = 'crash';
  stopCoinSounds();
  crashTime = 0;
  velocityY = 5.5;
  playSound(audio.crash);
  audio.music.volume = muted ? 0 : .13;
  farmer.visible = true;
  farmer.position.set(chicken.position.x - 1.4, 0, 5.3);
  // Cartoon feather burst.
  const crashMaterials = getSkinMaterials(selectedSkinId);
  const featherMaterials = [crashMaterials.primary, crashMaterials.secondary, crashMaterials.accent];
  for (let i = 0; i < 12; i++) {
    const feather = mesh(new THREE.ConeGeometry(.07, .42, 6), featherMaterials[i % featherMaterials.length], world, [chicken.position.x, 1.4, 2]);
    feather.userData.burst = true;
    feather.userData.v = new THREE.Vector3((Math.random() - .5) * 6, 2 + Math.random() * 5, (Math.random() - .5) * 5);
    moving.push({ group: feather, kind: 'feather', burst: true, life: 1.4 });
  }
}

function finishCrash() {
  best = Math.max(best, Math.floor(score));
  localStorage.setItem('feather-rush-best', String(best));
  bestEl.textContent = best.toLocaleString();
  homeMessage.textContent = `Caught! ${Math.floor(score).toLocaleString()} points · ${eggCount} golden eggs`;
  playButton.innerHTML = '<span>↻</span> RUN AGAIN';
  home.classList.remove('hidden');
  closeMenuPanels();
  pauseScreen.hidden = true;
  hud.hidden = true;
  touchControls.hidden = true;
  countdownEl.textContent = '';
  state = 'home';
  audio.taunt.pause();
  tauntWaitingForSound = false;
  tauntReturnTimer = 0;
  tauntMutedTimer = 0;
  chicken.userData.headPivot.rotation.set(0, 0, 0);
  chicken.userData.tongue.visible = false;
  syncMusicVolume();
  ensureMusic();
  setTimeout(() => {
    chicken.visible = true;
    chicken.position.set(0, 0, 2.1);
    chicken.rotation.set(0, 0, 0);
    chicken.scale.set(1, 1, 1);
    farmer.position.set(0, 0, 5.1);
    farmer.visible = true;
  }, 40);
}

function pauseGame() {
  if (state !== 'running') return;
  state = 'paused';
  pauseScreen.hidden = false;
  touchControls.hidden = true;
  syncMusicVolume();
}

function resumeGame() {
  if (state !== 'paused') return;
  state = 'running';
  pauseScreen.hidden = true;
  touchControls.hidden = false;
  previous = performance.now();
  syncMusicVolume();
}

function returnToMenu() {
  pauseScreen.hidden = true;
  resetRun();
  state = 'home';
  homeMessage.textContent = 'Ready for another farm escape?';
  playButton.innerHTML = '<span>▶</span> PLAY';
  home.classList.remove('hidden');
  hud.hidden = true;
  closeMenuPanels();
  syncMusicVolume();
  ensureMusic();
}

function updateRunner(dt, time) {
  targetX = lanes[lane];
  chicken.position.x = THREE.MathUtils.damp(chicken.position.x, targetX, 14, dt);
  velocityY -= 29 * dt;
  y += velocityY * dt;
  if (y < 0) { y = 0; velocityY = 0; }
  chicken.position.y = y;
  duckTimer = Math.max(0, duckTimer - dt);
  if (tauntWaitingForSound) {
    chicken.userData.headPivot.rotation.y = THREE.MathUtils.damp(chicken.userData.headPivot.rotation.y, Math.PI, 24, dt);
    chicken.userData.tongue.visible = true;
    if (tauntMutedTimer > 0) {
      tauntMutedTimer = Math.max(0, tauntMutedTimer - dt);
      if (tauntMutedTimer === 0) {
        tauntWaitingForSound = false;
        tauntReturnTimer = TAUNT_RETURN_SECONDS;
        syncMusicVolume();
      }
    }
  } else if (tauntReturnTimer > 0) {
    chicken.userData.headPivot.rotation.y = THREE.MathUtils.damp(chicken.userData.headPivot.rotation.y, 0, 24, dt);
    chicken.userData.tongue.visible = false;
    tauntReturnTimer = Math.max(0, tauntReturnTimer - dt);
    if (tauntReturnTimer === 0) {
      chicken.userData.headPivot.rotation.y = 0;
      syncMusicVolume();
    }
  } else {
    chicken.userData.headPivot.rotation.y = 0;
    chicken.userData.tongue.visible = false;
  }
  const ducking = duckTimer > 0;
  if (ducking) duckRoll = Math.min(.5, duckRoll + dt);
  else duckRoll = 0;
  chicken.scale.y = THREE.MathUtils.damp(chicken.scale.y, ducking ? .55 : 1, 20, dt);
  chicken.scale.x = THREE.MathUtils.damp(chicken.scale.x, ducking ? 1.2 : 1, 20, dt);
  const runWave = Math.sin(time * 18 + runTime * 4);
  chicken.userData.legL.rotation.x = runWave * .75;
  chicken.userData.legR.rotation.x = -runWave * .75;
  chicken.userData.wingL.rotation.z = -.18 + runWave * .13;
  chicken.userData.wingR.rotation.z = .18 - runWave * .13;
  chicken.userData.body.rotation.z = Math.sin(time * 11) * .035;
  chicken.rotation.x = ducking ? duckRoll / .5 * Math.PI * 2 : 0;
  chicken.rotation.z = THREE.MathUtils.damp(chicken.rotation.z, (targetX - chicken.position.x) * -.08, 10, dt);
}

function updateFarmer(dt, time) {
  if (state === 'running' || state === 'countdown') {
    if (farmerExit) {
      farmer.visible = false;
    } else {
      farmer.visible = true;
      farmerPointTimer = Math.max(0, farmerPointTimer - dt);
      farmer.position.x = THREE.MathUtils.damp(farmer.position.x, chicken.position.x, 11, dt);
      farmer.position.y = Math.abs(Math.sin(time * 8)) * .1;
      farmer.userData.legL.rotation.x = Math.sin(time * 8) * .55;
      farmer.userData.legR.rotation.x = -Math.sin(time * 8) * .55;
      if (farmerPointTimer > 0) {
        farmer.userData.armL.rotation.x = THREE.MathUtils.damp(farmer.userData.armL.rotation.x, Math.PI / 2, 18, dt);
        farmer.userData.armR.rotation.x = THREE.MathUtils.damp(farmer.userData.armR.rotation.x, 0, 18, dt);
      } else {
        const armWave = Math.sin(time * 8) * .75;
        farmer.userData.armL.rotation.x = armWave;
        farmer.userData.armR.rotation.x = -armWave;
      }
    }
  }
}

function updateMoving(dt, time) {
  standingOnTube = false;
  for (const item of moving) {
    if (item.burst) {
      item.life -= dt;
      item.group.userData.v.y -= 8 * dt;
      item.group.position.addScaledVector(item.group.userData.v, dt);
      item.group.rotation.x += 5 * dt;
      continue;
    }
    item.group.position.z += (speed + (item.oncomingSpeed || 0)) * dt;
    if (!item.magnetized) item.group.position.x = trackCurveOffset(item.group.position.z) + item.laneX + item.crossOffset;
    item.group.rotation.y = trackCurveAngle(item.group.position.z) + (item.facingOffset || 0);
    if (item.kind === 'tube') {
      const dz = Math.abs(item.group.position.z - chicken.position.z);
      const dx = Math.abs(item.group.position.x - chicken.position.x);
      const tubeTop = item.group.userData.topY;
      const halfLength = item.group.userData.length / 2;
      if (dx < .9 && dz < halfLength - .18 && velocityY <= 0 && chicken.position.y > tubeTop - .28 && chicken.position.y < tubeTop + .5) {
        y = tubeTop;
        chicken.position.y = tubeTop;
        velocityY = 0;
        standingOnTube = true;
        farmerExit = true;
      }
    }
    if (item.kind === 'egg' && !item.collected) {
      item.group.rotation.y = time * 3.8;
      item.group.userData.ring.rotation.z = time * 2.2;
      const magnetDistance = item.group.position.distanceTo(chicken.position);
      if (magnetTimer > 0 && magnetDistance < 22) {
        item.magnetized = true;
        item.group.position.x = THREE.MathUtils.damp(item.group.position.x, chicken.position.x, 7.5, dt);
        item.group.position.z = THREE.MathUtils.damp(item.group.position.z, chicken.position.z, 6.5, dt);
        item.group.position.y = THREE.MathUtils.damp(item.group.position.y, chicken.position.y + 1, 8, dt);
      } else {
        item.group.position.y = item.baseY + Math.sin(time * 5) * .16;
      }
      const dz = Math.abs(item.group.position.z - chicken.position.z);
      const dx = Math.abs(item.group.position.x - chicken.position.x);
      const eggY = item.group.position.y;
      if (dz < 1.25 && dx < 1.05 && Math.abs(eggY - (chicken.position.y + 1)) < 1.55) collectEgg(item);
    }

    if (item.kind === 'magnet' && !item.collected) {
      item.group.rotation.y = time * 2.4;
      item.group.position.y = item.baseY + Math.sin(time * 5) * .16;
      item.group.userData.halo.rotation.z = time * 2.8;
      const dz = Math.abs(item.group.position.z - chicken.position.z);
      const dx = Math.abs(item.group.position.x - chicken.position.x);
      if (dz < 1.25 && dx < 1.05) collectMagnet(item);
    }

    if (item.kind === 'double' && !item.collected) {
      item.group.rotation.z = Math.sin(time * 2.4) * .08;
      item.group.position.y = item.baseY + Math.sin(time * 5) * .16;
      const dz = Math.abs(item.group.position.z - chicken.position.z);
      const dx = Math.abs(item.group.position.x - chicken.position.x);
      if (dz < 1.25 && dx < 1.05) collectDouble(item);
    }

    if (!item.hit && !item.collected && ['jump','duck','choice','tractor'].includes(item.kind)) {
      const dz = Math.abs(item.group.position.z - chicken.position.z);
      const dx = Math.abs(item.group.position.x - chicken.position.x);
      if (dz < (item.kind === 'tractor' ? 1.95 : .85) && dx < 1.22) {
        let safe = false;
        if (item.kind === 'jump') safe = chicken.position.y > .82;
        if (item.kind === 'duck') safe = duckTimer > .08;
        if (item.kind === 'choice') safe = chicken.position.y > .72 || duckTimer > .08;
        if (!safe) { item.hit = true; crash(); return; }
        if (item.kind !== 'tractor') farmerExit = true;
        item.hit = true;
      }
    }
  }
  moving = moving.filter(item => {
    const keep = item.burst ? item.life > 0 : item.group.position.z < 20;
    if (!keep) world.remove(item.group);
    return keep;
  });
}

function updateWorld(dt) {
  for (const section of roadSections) {
    section.position.z += speed * dt;
    if (section.position.z > 22) section.position.z -= roadSections.length * 8;
    section.position.x = trackCurveOffset(section.position.z);
    section.rotation.y = trackCurveAngle(section.position.z);
  }
  for (const mark of roadMarks) {
    mark.position.z += speed * dt;
    if (mark.position.z > 18) mark.position.z -= roadMarks.length * 10;
    mark.position.x = trackCurveOffset(mark.position.z);
    mark.rotation.y = trackCurveAngle(mark.position.z);
  }
  for (const prop of scenery) {
    prop.position.z += speed * dt;
    if (prop.position.z > 25) {
      prop.position.z -= 240;
      prop.userData.trackSideX = Math.sign(prop.userData.trackSideX || 1) * (8 + Math.random() * 11);
    }
    prop.position.x = prop.userData.trackSideX + trackCurveOffset(prop.position.z);
    prop.rotation.y = trackCurveAngle(prop.position.z);
  }
  for (const cloud of clouds) {
    cloud.position.x += dt * .35;
    if (cloud.position.x > 42) cloud.position.x = -42;
  }
}

function updateCrash(dt, time) {
  crashTime += dt;
  speed = THREE.MathUtils.damp(speed, 0, 7, dt);
  updateWorld(dt);
  updateMoving(dt, time);
  if (crashTime < .8) {
    chicken.position.y = Math.max(0, Math.sin(crashTime * Math.PI / .8) * 1.05);
    chicken.rotation.x += dt * 8;
    chicken.rotation.z += dt * 3;
  } else if (crashTime < 1.45) {
    farmer.position.z = THREE.MathUtils.damp(farmer.position.z, 3.25, 7, dt);
    farmer.position.x = THREE.MathUtils.damp(farmer.position.x, chicken.position.x - .75, 7, dt);
    chicken.position.y = THREE.MathUtils.damp(chicken.position.y, 1.3, 7, dt);
    chicken.position.x = THREE.MathUtils.damp(chicken.position.x, farmer.position.x + .55, 7, dt);
    chicken.position.z = THREE.MathUtils.damp(chicken.position.z, farmer.position.z - .35, 7, dt);
    chicken.rotation.set(.3, 0, -.7);
    chicken.scale.setScalar(.75);
  } else {
    farmer.position.z += 9 * dt;
    chicken.position.z = farmer.position.z - .35;
    chicken.position.x = farmer.position.x + .55;
    chicken.position.y = 1.3 + Math.sin(time * 9) * .08;
  }
  if (crashTime > 2.9) finishCrash();
}

function idleAnimation(time, dt) {
  chicken.position.y = Math.sin(time * 2.5) * .04;
  chicken.userData.headPivot.rotation.y = Math.sin(time * .8) * .25;
  chicken.userData.wingL.rotation.z = -.15 + Math.sin(time * 2) * .05;
  chicken.userData.wingR.rotation.z = .15 - Math.sin(time * 2) * .05;
  farmer.userData.armL.rotation.z = Math.sin(time * 2) * .08;
  farmer.userData.armL.rotation.x = Math.sin(time * 2) * .18;
  farmer.userData.armR.rotation.x = -Math.sin(time * 2) * .18;
  for (const item of moving) {
    if (item.kind === 'egg') {
      item.group.rotation.y = time * 1.6;
      item.group.position.y = item.baseY + Math.sin(time * 3) * .12;
    }
  }
}

let previous = performance.now();
function animate(now) {
  const dt = Math.min((now - previous) / 1000, .05);
  previous = now;
  const time = now / 1000;

  if (state === 'running') {
    runTime += dt;
    if (!tauntTriggered && farmerExit && !farmer.visible) playTimedTaunt();
    score += speed * dt * 1.35 * (doubleTimer > 0 ? 2 : 1);
    const difficultyScore = Math.min(score, 3000);
    speed = 23 + difficultyScore / 310;
    scoreEl.textContent = Math.floor(score).toLocaleString();
    if (magnetTimer > 0) {
      magnetTimer = Math.max(0, magnetTimer - dt);
      magnetStatus.hidden = false;
      magnetTimeEl.textContent = String(Math.ceil(magnetTimer));
      if (magnetTimer === 0) magnetStatus.hidden = true;
    }
    if (doubleTimer > 0) {
      doubleTimer = Math.max(0, doubleTimer - dt);
      doubleStatus.hidden = false;
      doubleTimeEl.textContent = String(Math.ceil(doubleTimer));
      if (doubleTimer === 0) doubleStatus.hidden = true;
    }
    spawnDistance -= speed * dt;
    if (spawnDistance <= 0) {
      const spawned = spawnRow();
      const closeGap = Math.max(8.5, 11.5 - difficultyScore / 1200) + Math.random() * 1.5;
      spawnDistance = spawned === 'tube' ? 16 : closeGap;
    }
    updateRunner(dt, time);
    updateFarmer(dt, time);
    updateMoving(dt, time);
    updateWorld(dt);
  } else if (state === 'countdown') {
    updateFarmer(dt, time);
    updateRunner(dt, time);
  } else if (state === 'crash') {
    updateCrash(dt, time);
  } else if (state === 'paused') {
    // Keep the exact frame visible while paused.
  } else {
    idleAnimation(time, dt);
  }

  const camTargetX = state === 'home' ? 0 : chicken.position.x * .18;
  camera.position.x = THREE.MathUtils.damp(camera.position.x, camTargetX, 3.5, dt);
  camera.position.y = THREE.MathUtils.damp(camera.position.y, 5.7 + Math.min(chicken.position.y * .22, .8), 4, dt);
  renderer.render(scene, camera);
  if (!home.classList.contains('hidden')) {
    const spinPhase = getPreviewSpinPhase(now);
    const synchronizedSpin = Math.PI + spinPhase * Math.PI * 2;
    chicken.rotation.y = synchronizedSpin;
    if (avatarGreetingTimer > 0) {
      avatarGreetingTimer = Math.max(0, avatarGreetingTimer - dt);
      const greetingElapsed = avatarGreetingDuration - avatarGreetingTimer;
      const turnDelta = Math.atan2(Math.sin(Math.PI - avatarChicken.rotation.y), Math.cos(Math.PI - avatarChicken.rotation.y));
      avatarChicken.rotation.y += turnDelta * (1 - Math.exp(-20 * dt));
      const waving = greetingElapsed >= .18;
      const waveAngle = waving ? .95 + Math.sin((greetingElapsed - .18) * 16) * .38 : .2;
      avatarChicken.userData.wingR.rotation.z = THREE.MathUtils.damp(avatarChicken.userData.wingR.rotation.z, waveAngle, 18, dt);
      avatarChicken.userData.wingR.rotation.x = THREE.MathUtils.damp(avatarChicken.userData.wingR.rotation.x, waving ? -.38 : 0, 18, dt);
    } else {
      avatarChicken.rotation.y = synchronizedSpin;
      avatarChicken.userData.wingR.rotation.z = THREE.MathUtils.damp(avatarChicken.userData.wingR.rotation.z, 0, 18, dt);
      avatarChicken.userData.wingR.rotation.x = THREE.MathUtils.damp(avatarChicken.userData.wingR.rotation.x, 0, 18, dt);
    }
    avatarChicken.position.y = -.12 + Math.sin(time * 2.2) * .05;
    avatarRenderer.render(avatarScene, avatarCamera);
    updateSkinPreviewFrames(Math.floor(spinPhase * PREVIEW_SPIN_FRAMES) % PREVIEW_SPIN_FRAMES);
  }
  requestAnimationFrame(animate);
}

playButton.addEventListener('click', startGame);
chickenNameInput.addEventListener('input', () => {
  chickenName = chickenNameInput.value.slice(0, 12);
  if (chickenNameInput.value !== chickenName) chickenNameInput.value = chickenName;
  saveProfile();
});
chickenNameInput.addEventListener('blur', () => {
  chickenName = chickenName.trim().slice(0, 12) || 'Nugget';
  chickenNameInput.value = chickenName;
  saveProfile();
});
avatarCanvas.addEventListener('click', playAvatarGreeting);
avatarCanvas.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    playAvatarGreeting();
  }
});
wardrobeButton.addEventListener('click', () => {
  wardrobePanel.hidden = false;
  shopPanel.hidden = true;
  soundboardPanel.hidden = true;
  renderSkinPanels();
  syncMusicVolume();
  ensureMusic();
});
shopButton.addEventListener('click', () => {
  shopPanel.hidden = false;
  wardrobePanel.hidden = true;
  soundboardPanel.hidden = true;
  renderSkinPanels();
  syncMusicVolume();
  ensureMusic();
});
document.querySelectorAll('[data-close-menu]').forEach(button => button.addEventListener('click', closeMenuPanels));
wardrobeGrid.addEventListener('click', event => {
  const card = event.target.closest('[data-skin]');
  if (card) selectSkin(card.dataset.skin);
});
shopGrid.addEventListener('click', event => {
  const card = event.target.closest('[data-skin]');
  if (card) buyOrSelectSkin(card.dataset.skin);
});
iceCreamGrid.addEventListener('click', event => {
  const card = event.target.closest('[data-skin]');
  if (card) buyOrSelectSkin(card.dataset.skin);
});
cakeGrid.addEventListener('click', event => {
  const card = event.target.closest('[data-skin]');
  if (card) buyOrSelectSkin(card.dataset.skin);
});
halloweenGrid.addEventListener('click', event => {
  const card = event.target.closest('[data-skin]');
  if (card) buyOrSelectSkin(card.dataset.skin);
});
careerGrid.addEventListener('click', event => {
  const card = event.target.closest('[data-skin]');
  if (card) buyOrSelectSkin(card.dataset.skin);
});
candyGrid.addEventListener('click', event => {
  const card = event.target.closest('[data-skin]');
  if (card) buyOrSelectSkin(card.dataset.skin);
});
schoolGrid.addEventListener('click', event => {
  const card = event.target.closest('[data-skin]');
  if (card) buyOrSelectSkin(card.dataset.skin);
});
footballGrid.addEventListener('click', event => {
  const card = event.target.closest('[data-skin]');
  if (card) buyOrSelectSkin(card.dataset.skin);
});
document.querySelectorAll('[data-soundboard-sound]').forEach(button => button.addEventListener('click', () => {
  const sound = audio[button.dataset.soundboardSound];
  if (sound) playSoundboardSound(sound);
}));
pauseButton.addEventListener('click', pauseGame);
resumeButton.addEventListener('click', resumeGame);
pauseHomeButton.addEventListener('click', returnToMenu);
soundButton.addEventListener('click', () => {
  muted = !muted;
  soundButton.textContent = muted ? '×' : '♪';
  soundButton.setAttribute('aria-label', muted ? 'Turn sound on' : 'Mute sound');
  for (const sound of Object.values(audio)) sound.muted = muted;
  syncMusicVolume();
  if (!muted) ensureMusic();
});

const shopCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowLeft', 'ArrowRight', 'ArrowRight'];
let shopCodeProgress = 0;
const soundboardCode = 'soundboard';
let soundboardCodeProgress = 0;
addEventListener('keydown', event => {
  const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
  if (typing) {
    if (event.key === 'Escape') event.target.blur();
    return;
  }
  if (state === 'home' && !home.classList.contains('hidden') && event.key.length === 1) {
    const key = event.key.toLowerCase();
    if (key === soundboardCode[soundboardCodeProgress]) {
      soundboardCodeProgress++;
      if (soundboardCodeProgress === soundboardCode.length) {
        soundboardCodeProgress = 0;
        openSoundboard();
        return;
      }
    } else {
      soundboardCodeProgress = key === soundboardCode[0] ? 1 : 0;
    }
  }
  if (!shopPanel.hidden && event.key.startsWith('Arrow')) {
    event.preventDefault();
    if (event.key === shopCode[shopCodeProgress]) {
      shopCodeProgress++;
      if (shopCodeProgress === shopCode.length) {
        shopCodeProgress = 0;
        walletEggs += 50000;
        saveProfile();
        renderSkinPanels();
        playSound(audio.egg);
        showToast('Secret flock bonus: +50,000 eggs!');
      }
    } else {
      shopCodeProgress = event.key === shopCode[0] ? 1 : 0;
    }
    return;
  }
  if (event.key === 'Escape') {
    if (!wardrobePanel.hidden || !shopPanel.hidden || !soundboardPanel.hidden) closeMenuPanels();
    else if (state === 'running') pauseGame();
    else if (state === 'paused') resumeGame();
    return;
  }
  const map = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ArrowUp: 'jump', w: 'jump', W: 'jump', ' ': 'jump', ArrowDown: 'duck', s: 'duck', S: 'duck' };
  if (map[event.key]) { event.preventDefault(); perform(map[event.key]); }
});

addEventListener('pointerdown', () => {
  if (state === 'home') {
    syncMusicVolume();
    ensureMusic();
  }
}, { once: true });

touchControls.addEventListener('pointerdown', event => {
  const button = event.target.closest('button[data-action]');
  if (button) perform(button.dataset.action);
});

let swipeStart = null;
renderer.domElement.addEventListener('pointerdown', event => { swipeStart = { x: event.clientX, y: event.clientY }; });
renderer.domElement.addEventListener('pointerup', event => {
  if (!swipeStart || state !== 'running') return;
  const dx = event.clientX - swipeStart.x;
  const dy = event.clientY - swipeStart.y;
  if (Math.max(Math.abs(dx), Math.abs(dy)) > 28) {
    if (Math.abs(dx) > Math.abs(dy)) perform(dx > 0 ? 'right' : 'left');
    else perform(dy < 0 ? 'jump' : 'duck');
  }
  swipeStart = null;
});

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
});

// A recognizable, playable scene is ready before the loading cover is removed.
resetRun();
state = 'home';
renderSkinPanels();
syncMusicVolume();
ensureMusic();
loading.classList.add('done');
requestAnimationFrame(animate);
