export type FloorId = 0 | 1 | 2 | 3;

export interface Product {
  id: string;
  name: string;
  category: string;
  floor: FloorId;
  description: string;
  price: number;
  symbol: string;
  image: string;
  lumens: number;
  kelvin: number;
  accent: "amber" | "cyan" | "rose" | "lime";
}

export const FLOOR_META: Record<FloorId, {
  code: string;
  name: string;
  subtitle: string;
  description: string;
  atmosphere: string;
}> = {
  0: {
    code: "04",
    name: "OBJECT LIBRARY",
    subtitle: "Small objects for curious desks.",
    description: "Precision forms and quiet tools for the spaces where ideas begin.",
    atmosphere: "blueprint",
  },
  1: {
    code: "02",
    name: "SACRED ROOM",
    subtitle: "Faith in every form.",
    description: "Sculptural companions for rooms that ask you to slow down.",
    atmosphere: "sacred",
  },
  2: {
    code: "03",
    name: "MEMORY ARCHIVE",
    subtitle: "Keep a moment close.",
    description: "Small monuments to the stories that stay with us.",
    atmosphere: "archive",
  },
  3: {
    code: "01",
    name: "LIGHT LAB",
    subtitle: "Objects that create atmosphere.",
    description: "A dark-room test chamber for light, glow, and the feeling between.",
    atmosphere: "light",
  },
};

export const PRODUCTS: Product[] = [
  { id: "orbit-glow", name: "Orbit Glow", category: "LIGHT", floor: 3, description: "A sculptural mood lamp with a soft, calming halo.", price: 1299, symbol: "◎", image: "/assets/orbit-glow.svg", lumens: 2400, kelvin: 3000, accent: "amber" },
  { id: "moon-lamp", name: "Moon Lamp", category: "LIGHT", floor: 3, description: "A warm miniature moon for desks and shelves.", price: 1599, symbol: "◐", image: "/assets/moon-lamp.svg", lumens: 1800, kelvin: 2700, accent: "amber" },
  { id: "halo-lamp", name: "Halo Lamp", category: "LIGHT", floor: 3, description: "A minimalist ring of light designed as a calm accent.", price: 1799, symbol: "◯", image: "/assets/halo-lamp.svg", lumens: 2200, kelvin: 4000, accent: "cyan" },
  { id: "dome-light", name: "Dome Light", category: "LIGHT", floor: 3, description: "A small architectural lamp with a warm glow.", price: 1499, symbol: "◌", image: "/assets/dome-light.svg", lumens: 1600, kelvin: 3200, accent: "amber" },
  { id: "moment-frame", name: "Moment Frame", category: "MEMORIES", floor: 2, description: "A keepsake display object for meaningful snapshots.", price: 1199, symbol: "▣", image: "/assets/moment-frame.svg", lumens: 900, kelvin: 3200, accent: "rose" },
  { id: "memory-house", name: "Memory House", category: "MEMORIES", floor: 2, description: "A tiny scene built around a personal story.", price: 1599, symbol: "⌂", image: "/assets/memory-house.svg", lumens: 1100, kelvin: 3000, accent: "rose" },
  { id: "photo-totem", name: "Photo Totem", category: "MEMORIES", floor: 2, description: "A playful sculptural display for favourite moments.", price: 999, symbol: "▥", image: "/assets/photo-totem.svg", lumens: 700, kelvin: 3500, accent: "rose" },
  { id: "tiny-timeline", name: "Tiny Timeline", category: "MEMORIES", floor: 2, description: "A tangible little memory in miniature form.", price: 899, symbol: "▤", image: "/assets/tiny-timeline.svg", lumens: 500, kelvin: 3000, accent: "rose" },
  { id: "krishna-with-flute", name: "Krishna with Flute", category: "DIVINE", floor: 1, description: "A stylised 3D-printed Krishna figurine.", price: 1999, symbol: "🪈", image: "/assets/krishna-with-flute.svg", lumens: 1000, kelvin: 2700, accent: "cyan" },
  { id: "buddha", name: "Buddha", category: "DIVINE", floor: 1, description: "A serene sculptural piece for quiet corners.", price: 1699, symbol: "☸", image: "/assets/buddha.svg", lumens: 800, kelvin: 2700, accent: "cyan" },
  { id: "shiva", name: "Shiva", category: "DIVINE", floor: 1, description: "A contemplative statement piece for your space.", price: 2199, symbol: "ॐ", image: "/assets/shiva.svg", lumens: 1200, kelvin: 3000, accent: "cyan" },
  { id: "venkateshwara", name: "Venkateshwara", category: "DIVINE", floor: 1, description: "A devotional miniature with crafted detail.", price: 2299, symbol: "✦", image: "/assets/venkateshwara.svg", lumens: 1000, kelvin: 2800, accent: "cyan" },
  { id: "mini-globe", name: "Mini Globe", category: "DESK ART", floor: 0, description: "A tiny world for a curious workspace.", price: 899, symbol: "🌍", image: "/assets/mini-globe.svg", lumens: 450, kelvin: 5000, accent: "lime" },
  { id: "mountain-diorama", name: "Mountain Diorama", category: "DESK ART", floor: 0, description: "A miniature landscape made for slow moments.", price: 1499, symbol: "🏔️", image: "/assets/mountain-diorama.svg", lumens: 600, kelvin: 4800, accent: "lime" },
  { id: "desk-organiser", name: "Desk Organiser", category: "DESK ART", floor: 0, description: "A compact home for your everyday tools.", price: 699, symbol: "▤", image: "/assets/desk-organiser.svg", lumens: 300, kelvin: 4500, accent: "lime" },
  { id: "orbit-sculpture", name: "Orbit Sculpture", category: "DESK ART", floor: 0, description: "A geometric desk object with a calm rhythm.", price: 1299, symbol: "◉", image: "/assets/orbit-sculpture.svg", lumens: 650, kelvin: 4200, accent: "lime" },
];