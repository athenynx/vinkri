import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  Heart,
  Menu,
  Minus,
  Moon,
  Plus,
  RotateCcw,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FLOOR_META, PRODUCTS, type FloorId, type Product } from "@/data/products";

type View = "facade" | "room" | "checkout";
type Theme = "dark" | "light";
type CartLine = { product: Product; quantity: number };

const FLOOR_ORDER: FloorId[] = [3, 1, 2, 0];
const money = (value: number) => `₹${value.toLocaleString("en-IN")}`;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function ParticleField({ count = 28 }: { count?: number }) {
  const particles = useMemo(
    () => Array.from({ length: count }, (_, index) => ({
      id: index,
      x: `${(index * 37 + 11) % 100}%`,
      y: `${(index * 61 + 7) % 100}%`,
      size: `${2 + (index % 3)}px`,
      delay: `${(index % 9) * -0.8}s`,
      duration: `${8 + (index % 7)}s`,
    })),
    [count],
  );
  return (
    <div className="particle-field" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="particle"
          style={{
            "--particle-x": particle.x,
            "--particle-y": particle.y,
            "--particle-size": particle.size,
            "--particle-delay": particle.delay,
            "--particle-duration": particle.duration,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

function StudioCursor() {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const move = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
    };
    const over = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      setLabel(target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? "");
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
    };
  }, []);
  return (
    <div className={`studio-cursor ${label ? "is-active" : ""}`} aria-hidden="true">
      <span className="cursor-dot" />
      <span className="cursor-ring" />
      {label && <span className="cursor-label">{label}</span>}
    </div>
  );
}

function EntrySequence({ onEnter, reducedMotion }: { onEnter: () => void; reducedMotion: boolean }) {
  const [ready, setReady] = useState(reducedMotion);
  useEffect(() => {
    if (reducedMotion) {
      setReady(true);
      return;
    }
    const timer = window.setTimeout(() => setReady(true), 2400);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);
  const [entering, setEntering] = useState(false);
  const handleEnter = () => {
    setEntering(true);
    window.setTimeout(onEnter, reducedMotion ? 0 : 900);
  };
  return (
    <section className={`entry-sequence ${ready ? "entry-ready" : ""} ${entering ? "entry-leaving" : ""}`} data-testid="entry-sequence">
      <ParticleField count={34} />
      <div className="entry-ambient" />
      <div className="entry-grid" aria-hidden="true" />
      <div className="entry-building" aria-hidden="true">
        <div className="entry-building-glow" />
        <div className="entry-building-core">
          <span className="entry-roof" />
          {Array.from({ length: 4 }, (_, floor) => (
            <div className="entry-window-row" key={floor}>
              {Array.from({ length: 7 }, (_, windowIndex) => <i key={windowIndex} />)}
            </div>
          ))}
          <span className="entry-door" />
        </div>
      </div>
      <div className="entry-copy">
        <div className="entry-wordmark" data-testid="entry-wordmark">VINKRI</div>
        <Button
          type="button"
          onClick={handleEnter}
          disabled={!ready || entering}
          data-testid="enter-studio-button"
          data-cursor="ENTER"
          className="enter-button"
        >
          <span>{entering ? "ENTERING STUDIO" : "ENTER STUDIO"}</span>
          <ArrowUpRight size={16} />
        </Button>
      </div>
    </section>
  );
}

function Header({
  theme,
  onTheme,
  onSearch,
  onCart,
  cartCount,
  onMenu,
  onHome,
}: {
  theme: Theme;
  onTheme: () => void;
  onSearch: () => void;
  onCart: () => void;
  cartCount: number;
  onMenu: () => void;
  onHome: () => void;
}) {
  return (
    <header className="studio-header" data-testid="studio-header">
      <button type="button" onClick={onHome} className="brand-lockup" data-testid="brand-home-button" data-cursor="HOME">
        <span className="brand-mark">V</span>
        <span><strong>VINKRI</strong><small>VIRTUAL STUDIO</small></span>
      </button>
      <nav className="desktop-nav" aria-label="Primary navigation" data-testid="desktop-navigation">
        <button type="button" onClick={onHome} data-testid="nav-studio-button">STUDIO</button>
        <a href="#rooms" data-testid="nav-rooms-link">ROOMS</a>
        <a href="#objects" data-testid="nav-objects-link">OBJECTS</a>
      </nav>
      <div className="header-actions">
        <button type="button" onClick={onSearch} className="icon-button header-search" data-testid="open-search-button" data-cursor="SEARCH" aria-label="Search objects"><Search size={17} /><span>SEARCH</span></button>
        <button type="button" onClick={onTheme} className="icon-button" data-testid="theme-toggle-button" data-cursor="LIGHT" aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}>{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>
        <button type="button" onClick={onCart} className="trolley-button" data-testid="open-trolley-button" data-cursor="TROLLEY" aria-label="Open trolley"><ShoppingBag size={17} /><span>TROLLEY</span><b>{cartCount}</b></button>
        <button type="button" onClick={onMenu} className="mobile-menu-button" data-testid="open-mobile-menu-button" aria-label="Open menu"><Menu size={20} /></button>
      </div>
    </header>
  );
}

function Facade({ onFloor }: { onFloor: (floor: FloorId) => void }) {
  const [hovered, setHovered] = useState<FloorId | null>(3);
  const hoveredMeta = hovered === null ? null : FLOOR_META[hovered];
  return (
    <main className="facade-view" data-testid="facade-view">
      <section className="facade-hero" id="rooms">
        <div className="facade-copy">
          <div className="eyebrow" data-testid="facade-eyebrow">01 / 04 — SELECT A ROOM</div>
          <h1 data-testid="facade-heading">Enter the<br /><em>living</em> archive.</h1>
          <p data-testid="facade-description">VINKRI is a virtual design studio for objects that shape the feeling of a space. Choose a room and step inside.</p>
          <div className="facade-meta"><span>4 ATMOSPHERES</span><span>16 OBJECTS</span><span>01:1 SCALE</span></div>
        </div>
        <div className="facade-stage" data-testid="facade-stage">
          <div className="facade-halo" />
          <div className="facade-shadow" />
          <div className="facade-building" aria-label="Interactive VINKRI building facade">
            <div className="building-roof"><span>VINKRI / 01</span></div>
            <div className="building-slice building-slice-left" />
            <div className="building-floors">
              {FLOOR_ORDER.map((floor, index) => {
                const meta = FLOOR_META[floor];
                const active = hovered === floor;
                return (
                  <button
                    type="button"
                    key={floor}
                    className={`floor-selector floor-selector-${meta.atmosphere} ${active ? "is-hovered" : ""}`}
                    onMouseEnter={() => setHovered(floor)}
                    onFocus={() => setHovered(floor)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => onFloor(floor)}
                    data-testid={`floor-selector-${meta.code}`}
                    data-cursor="ENTER FLOOR"
                    aria-label={`Enter ${meta.name}`}
                  >
                    <span className="floor-light" />
                    <span className="floor-number">{meta.code}</span>
                    <span className="floor-name">{meta.name}</span>
                    <span className="floor-arrow"><ArrowUpRight size={14} /></span>
                    <span className="floor-windows" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</span>
                    <span className="floor-hover-label">ENTER FLOOR <ArrowUpRight size={12} /></span>
                  </button>
                );
              })}
            </div>
            <div className="building-base"><span>VIRTUAL STUDIO</span><span>V / 2025</span></div>
          </div>
          {hoveredMeta && <div className="floor-beam" data-testid="floor-hover-beam" />}
          <div className="facade-stage-note"><span>HOVER A FLOOR</span><span>↕</span></div>
        </div>
        <div className="facade-callout" data-testid="facade-callout">
          <span className="callout-line" />
          <span><b>{hoveredMeta?.code ?? "—"}</b> {hoveredMeta?.name ?? "SELECT A ROOM"}</span>
          <small>{hoveredMeta?.subtitle ?? "Move across the building to illuminate a room."}</small>
        </div>
      </section>
      <section className="studio-intro-band" id="objects" data-testid="studio-intro-band">
        <div className="eyebrow">THE VINKRI METHOD</div>
        <p>Not a storefront. A sequence of rooms where products are felt before they are owned.</p>
        <span className="scroll-cue"><span /> SCROLL TO DESCEND</span>
      </section>
    </main>
  );
}

function Marquee({ products, onProduct }: { products: Product[]; onProduct: (product: Product) => void }) {
  const loop = [...products, ...products];
  return (
    <section className="conveyor-section" data-testid="product-conveyor">
      <div className="section-kicker"><span>OBJECT CONVEYOR / 001—016</span><span>HOVER TO HOLD</span></div>
      <div className="conveyor-window">
        <div className="conveyor-track">
          {loop.map((product, index) => (
            <button type="button" key={`${product.id}-${index}`} onClick={() => onProduct(product)} className="conveyor-object" data-testid={`conveyor-object-${product.id}-${index}`} data-cursor="VIEW OBJECT">
              <span className="conveyor-symbol">{product.symbol}</span>
              <span><b>{product.name}</b><small>{product.category} / {money(product.price)}</small></span>
              <ArrowUpRight size={14} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, onOpen, wished, onWish }: { product: Product; onOpen: (product: Product) => void; wished: boolean; onWish: () => void }) {
  return (
    <article className={`product-card card-accent-${product.accent}`} data-testid={`product-card-${product.id}`}>
      <button type="button" className="product-card-hit" onClick={() => onOpen(product)} data-testid={`open-product-${product.id}`} data-cursor="VIEW OBJECT" aria-label={`View ${product.name}`}>
        <div className="product-art"><img src={product.image} alt={product.name} loading="lazy" /></div>
        <div className="product-card-topline"><span>{product.category}</span><span>V / {product.floor.toString().padStart(2, "0")}</span></div>
        <div className="product-card-copy"><h3 data-testid={`product-name-${product.id}`}>{product.name}</h3><p>{product.description}</p><span className="product-view-link">VIEW OBJECT <ArrowUpRight size={13} /></span></div>
      </button>
      <div className="product-card-footer"><span data-testid={`product-price-${product.id}`}>{money(product.price)}</span><button type="button" onClick={onWish} className={`wish-button ${wished ? "is-wished" : ""}`} data-testid={`wishlist-${product.id}`} data-cursor="SAVE" aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}><Heart size={15} fill={wished ? "currentColor" : "none"} /></button></div>
    </article>
  );
}

function RoomView({ floor, products, wishlist, onBack, onOpen, onWish, onSimulator }: { floor: FloorId; products: Product[]; wishlist: string[]; onBack: () => void; onOpen: (product: Product) => void; onWish: (id: string) => void; onSimulator: () => void }) {
  const meta = FLOOR_META[floor];
  const roomProducts = products.filter((product) => product.floor === floor);
  return (
    <main className={`room-view atmosphere-${meta.atmosphere}`} data-testid="room-view">
      <ParticleField count={24} />
      <div className="room-grid-overlay" aria-hidden="true" />
      <section className="room-hero" id="room-stage">
        <button type="button" onClick={onBack} className="back-to-building" data-testid="back-to-building-button" data-cursor="BACK"><ArrowLeft size={15} /> BACK TO BUILDING</button>
        <div className="room-hero-content"><div className="eyebrow" data-testid="room-eyebrow">ROOM {meta.code} / VINKRI INTERIORS</div><h1 data-testid="room-title"><span>{meta.name.split(" ")[0]}</span> {meta.name.split(" ").slice(1).join(" ")}</h1><p data-testid="room-description">{meta.description}</p><div className="room-spec-line"><span>ATMOSPHERE / {meta.atmosphere.toUpperCase()}</span><span>OBJECTS / {roomProducts.length.toString().padStart(2, "0")}</span><span>LIVE ROOM SIMULATION</span></div></div>
        <div className="room-portal" aria-hidden="true"><div className="portal-ring" /><div className="portal-core" /><span>ROOM<br />{meta.code}</span></div>
      </section>
      <section className="room-products-section" data-testid="room-products-section">
        <div className="room-products-heading"><div><div className="eyebrow">CURATED OBJECTS / {meta.name}</div><h2>Objects in residence.</h2></div>{floor === 3 && <button type="button" onClick={onSimulator} className="simulator-link" data-testid="open-room-simulator-button" data-cursor="ADJUST"><SlidersHorizontal size={15} /> ROOM SIMULATOR <ArrowUpRight size={14} /></button>}</div>
        <div className="product-grid">{roomProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={onOpen} wished={wishlist.includes(product.id)} onWish={() => onWish(product.id)} />)}</div>
      </section>
    </main>
  );
}

function RoomSimulator({ product, darkness, lumens, kelvin, onDarkness, onLumens, onKelvin }: { product: Product; darkness: number; lumens: number; kelvin: number; onDarkness: (value: number) => void; onLumens: (value: number) => void; onKelvin: (value: number) => void }) {
  const lux = Math.round((lumens / 12) * (0.3 + darkness / 100));
  const glow = Math.min(1, (lumens / 3500) * (0.35 + darkness / 120));
  const lightColor = kelvin < 3500 ? "#ffbd72" : kelvin < 5000 ? "#f7f1cc" : "#a8d8ff";
  return (
    <section className="room-simulator" data-testid="dark-room-simulator">
      <div className="simulator-copy"><div className="eyebrow"><Sparkles size={13} /> LIVE LIGHT STUDY</div><h3>How will it feel<br />after dark?</h3><p>Change the room and watch {product.name} project its atmosphere in real time.</p><div className="simulator-readout"><span><b data-testid="dark-room-lux-value">{lux}</b> lux</span><small>AT SURFACE / 1M</small></div></div>
      <div className="simulator-scene" style={{ "--room-darkness": darkness / 100, "--lamp-glow": glow, "--lamp-color": lightColor } as CSSProperties} data-testid="dark-room-scene">
        <div className="scene-wall" /><div className="scene-floor" /><div className="scene-shadow" /><img src={product.image} alt={`${product.name} in a dark room`} /><div className="scene-light-cone" /><span className="scene-coordinate">Y / 01.00<br />X / 00.42</span>
      </div>
      <div className="simulator-controls">
        <label htmlFor="darkness-slider"><span>ROOM DARKNESS</span><output data-testid="dark-room-darkness-value">{darkness}%</output></label><input id="darkness-slider" data-testid="dark-room-darkness-slider" type="range" min="0" max="100" value={darkness} onChange={(event) => onDarkness(Number(event.target.value))} />
        <label htmlFor="lumens-slider"><span>PRODUCT INTENSITY</span><output data-testid="dark-room-lumens-value">{lumens} lm</output></label><input id="lumens-slider" data-testid="dark-room-lumens-slider" type="range" min="100" max="3500" step="50" value={lumens} onChange={(event) => onLumens(Number(event.target.value))} />
        <label htmlFor="kelvin-slider"><span>COLOUR TEMPERATURE</span><output data-testid="dark-room-kelvin-value">{kelvin} K</output></label><input id="kelvin-slider" data-testid="dark-room-kelvin-slider" type="range" min="2700" max="6500" step="100" value={kelvin} onChange={(event) => onKelvin(Number(event.target.value))} />
        <div className="simulator-legend"><span><i className="legend-dot warm" /> WARM</span><span><i className="legend-dot cool" /> COOL</span><button type="button" onClick={() => { onDarkness(82); onLumens(product.lumens); onKelvin(product.kelvin); }} data-testid="reset-dark-room-button"><RotateCcw size={12} /> RESET STUDY</button></div>
      </div>
    </section>
  );
}

function RoomSimulatorModal({ products, product, onSelect, onClose, darkness, lumens, kelvin, onDarkness, onLumens, onKelvin }: { products: Product[]; product: Product; onSelect: (product: Product) => void; onClose: () => void; darkness: number; lumens: number; kelvin: number; onDarkness: (value: number) => void; onLumens: (value: number) => void; onKelvin: (value: number) => void }) {
  return (
    <div className="modal-backdrop simulator-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} data-testid="room-simulator-backdrop">
      <section className="dedicated-simulator" role="dialog" aria-modal="true" aria-labelledby="room-simulator-title" data-testid="room-simulator-modal">
        <div className="dedicated-simulator-header">
          <div><div className="eyebrow"><Sparkles size={13} /> LIGHT LAB / ROOM SIMULATOR</div><h2 id="room-simulator-title" data-testid="room-simulator-title">Test the room after dark.</h2></div>
          <button type="button" onClick={onClose} className="modal-close" data-testid="close-room-simulator-button" aria-label="Close room simulator"><X size={18} /></button>
        </div>
        <div className="simulator-object-selector" data-testid="simulator-object-selector">
          <span>SELECT LIGHT OBJECT</span>
          <div>{products.map((item) => <button type="button" key={item.id} onClick={() => onSelect(item)} className={item.id === product.id ? "is-selected" : ""} data-testid={`simulator-select-${item.id}`}><span>{item.symbol}</span>{item.name}</button>)}</div>
        </div>
        <RoomSimulator product={product} darkness={darkness} lumens={lumens} kelvin={kelvin} onDarkness={onDarkness} onLumens={onLumens} onKelvin={onKelvin} />
      </section>
    </div>
  );
}

function ProductModal({ product, onClose, onAdd, isWished, onWish }: { product: Product; onClose: () => void; onAdd: () => void; isWished: boolean; onWish: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} data-testid="product-modal-backdrop">
      <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" data-testid="product-detail-modal">
        <button type="button" onClick={onClose} className="modal-close" data-testid="close-product-modal-button" aria-label="Close product details"><X size={18} /></button>
        <div className="modal-visual"><img src={product.image} alt={product.name} /><span className="modal-visual-grid" /><div className="modal-visual-tag">VINKRI / OBJECT {product.floor.toString().padStart(2, "0")}</div></div>
        <div className="modal-copy"><div className="eyebrow">{product.category} / LIMITED OBJECT</div><h2 id="product-modal-title" data-testid="product-modal-title">{product.name}</h2><p data-testid="product-modal-description">{product.description}</p><div className="modal-specs"><span><small>FROM</small><b>{money(product.price)}</b></span><span><small>OUTPUT</small><b>{product.lumens} lm</b></span><span><small>INDEX</small><b>V / {product.id.slice(0, 4).toUpperCase()}</b></span></div><div className="modal-actions"><Button type="button" onClick={onAdd} className="primary-action" data-testid="add-to-trolley-button" data-cursor="ADD TO TROLLEY"><ShoppingBag size={16} /> ADD TO TROLLEY</Button><button type="button" onClick={onWish} className={`modal-wish ${isWished ? "is-wished" : ""}`} data-testid="product-modal-wishlist-button" data-cursor="SAVE"><Heart size={16} fill={isWished ? "currentColor" : "none"} /> {isWished ? "SAVED" : "SAVE"}</button></div></div>
      </section>
    </div>
  );
}

function SearchPanel({ query, onQuery, results, onOpen, onClose }: { query: string; onQuery: (query: string) => void; results: Product[]; onOpen: (product: Product) => void; onClose: () => void }) {
  return (
    <div className="search-layer" data-testid="search-layer"><div className="search-panel"><div className="search-panel-top"><div className="eyebrow">SEARCH THE ARCHIVE / {results.length.toString().padStart(2, "0")} RESULTS</div><button type="button" onClick={onClose} className="modal-close" data-testid="close-search-button" aria-label="Close search"><X size={18} /></button></div><div className="search-input-wrap"><Search size={22} /><Input autoFocus value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search object, room, material..." data-testid="search-input" /><span>⌘ K</span></div><div className="search-results" data-testid="search-results">{results.map((product) => <button type="button" key={product.id} onClick={() => onOpen(product)} className="search-result" data-testid={`search-result-${product.id}`}><span className="search-result-image"><img src={product.image} alt="" /></span><span><b>{product.name}</b><small>{product.category} / {money(product.price)}</small></span><ArrowUpRight size={15} /></button>)}{results.length === 0 && <p className="empty-state" data-testid="search-empty-state">No object found in this room.</p>}</div></div></div>
  );
}

function Trolley({ cart, coupon, onCoupon, discount, onClose, onQuantity, onCheckout }: { cart: CartLine[]; coupon: string; onCoupon: (coupon: string) => void; discount: number; onClose: () => void; onQuantity: (id: string, delta: number) => void; onCheckout: () => void }) {
  const subtotal = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const total = Math.max(0, subtotal - discount);
  return (
    <div className="drawer-layer" data-testid="trolley-layer"><aside className="trolley-drawer" role="dialog" aria-modal="true" aria-labelledby="trolley-title"><div className="drawer-header"><div><div className="eyebrow">VINKRI / PERSONAL TROLLEY</div><h2 id="trolley-title" data-testid="trolley-title">Your objects <span>{cart.length.toString().padStart(2, "0")}</span></h2></div><button type="button" onClick={onClose} className="modal-close" data-testid="close-trolley-button" aria-label="Close trolley"><X size={18} /></button></div>{cart.length === 0 ? <div className="empty-trolley" data-testid="empty-trolley"><ShoppingBag size={28} /><p>Your trolley is quiet.</p><small>Enter a room to discover something with a little gravity.</small></div> : <><div className="trolley-items">{cart.map((line) => <div className="trolley-line" key={line.product.id} data-testid={`trolley-line-${line.product.id}`}><img src={line.product.image} alt={line.product.name} /><div className="trolley-line-copy"><b>{line.product.name}</b><small>{line.product.category}</small><div className="quantity-control"><button type="button" onClick={() => onQuantity(line.product.id, -1)} data-testid={`decrease-quantity-${line.product.id}`} aria-label={`Decrease ${line.product.name} quantity`}><Minus size={13} /></button><span data-testid={`quantity-${line.product.id}`}>{line.quantity}</span><button type="button" onClick={() => onQuantity(line.product.id, 1)} data-testid={`increase-quantity-${line.product.id}`} aria-label={`Increase ${line.product.name} quantity`}><Plus size={13} /></button></div></div><strong>{money(line.product.price * line.quantity)}</strong></div>)}</div><div className="coupon-row"><Input value={coupon} onChange={(event) => onCoupon(event.target.value)} placeholder="COUPON CODE" data-testid="coupon-input" /><span data-testid="coupon-status">{coupon.toUpperCase() === "VINKRI10" ? "−10% APPLIED" : "TRY VINKRI10"}</span></div><div className="trolley-total"><span>SUBTOTAL</span><b>{money(subtotal)}</b>{discount > 0 && <><span className="discount-label">VINKRI10</span><b className="discount-value">−{money(discount)}</b></>}<span>TOTAL</span><b>{money(total)}</b></div><Button type="button" onClick={onCheckout} className="primary-action trolley-checkout" data-testid="trolley-checkout-button" data-cursor="CHECKOUT">PROCEED TO CHECKOUT <ArrowUpRight size={16} /></Button></>}</aside></div>
  );
}

function Checkout({ cart, onBack, onComplete, orderComplete, isSubmitting }: { cart: CartLine[]; onBack: () => void; onComplete: () => void; orderComplete: boolean; isSubmitting: boolean }) {
  const total = cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  if (orderComplete) return <main className="checkout-view order-complete" data-testid="order-complete-view"><div className="completion-mark"><Check size={28} /></div><div className="eyebrow">VINKRI / TRANSMISSION CONFIRMED</div><h1 data-testid="order-complete-title">Order complete.</h1><p data-testid="order-complete-description">Your objects are now moving from the studio into your space.</p><span className="order-number" data-testid="order-number">ORDER / VK-{Math.floor(1000 + Math.random() * 8999)}</span><button type="button" onClick={onBack} className="text-action" data-testid="return-to-studio-button">RETURN TO STUDIO <ArrowUpRight size={15} /></button></main>;
  return <main className="checkout-view" data-testid="checkout-view"><button type="button" onClick={onBack} className="back-to-building" data-testid="back-to-room-button"><ArrowLeft size={15} /> BACK TO ROOM</button><div className="checkout-layout"><div className="checkout-copy"><div className="eyebrow">VINKRI / QUIET STUDIO</div><h1 data-testid="checkout-title">A quieter<br /><em>room</em> for checkout.</h1><div className="checkout-steps"><span className="is-active">01 / OBJECTS</span><span>02 / DETAILS</span><span>03 / COMPLETE</span></div><label className="checkout-field"><span>YOUR NAME</span><Input placeholder="Name for the studio record" data-testid="checkout-name-input" /></label><label className="checkout-field"><span>DELIVERY NOTE</span><Input placeholder="Where should we send the atmosphere?" data-testid="checkout-address-input" /></label><Button type="button" onClick={onComplete} disabled={isSubmitting} className="primary-action checkout-submit" data-testid="complete-order-button" data-cursor="COMPLETE">{isSubmitting ? "TRANSMITTING..." : "COMPLETE DEMO ORDER"} <ArrowUpRight size={16} /></Button><small className="mock-note" data-testid="mock-checkout-note">DEMO CHECKOUT / NO PAYMENT IS TAKEN</small></div><div className="checkout-summary"><div className="summary-header"><span>ORDER SUMMARY</span><span>{cart.length.toString().padStart(2, "0")} OBJECTS</span></div>{cart.map((line) => <div className="summary-line" key={line.product.id}><img src={line.product.image} alt="" /><span><b>{line.product.name}</b><small>{line.quantity} × {money(line.product.price)}</small></span><strong>{money(line.product.price * line.quantity)}</strong></div>)}<div className="summary-total"><span>TOTAL</span><b>{money(total)}</b></div></div></div></main>;
}

export default function Home() {
  const reducedMotion = useReducedMotion();
  const { data: products = PRODUCTS } = useQuery<Product[]>({ queryKey: ["vinkri-products"], queryFn: async () => PRODUCTS, staleTime: Infinity });
  const [entered, setEntered] = useState(false);
  const [view, setView] = useState<View>("facade");
  const [activeFloor, setActiveFloor] = useState<FloorId>(3);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [simulatorProduct, setSimulatorProduct] = useState<Product>(PRODUCTS.find((product) => product.id === "orbit-glow") ?? PRODUCTS[0]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [coupon, setCoupon] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);
  const [darkness, setDarkness] = useState(82);
  const [lumens, setLumens] = useState(2400);
  const [kelvin, setKelvin] = useState(3000);
  const checkoutMutation = useMutation({ mutationFn: async () => new Promise((resolve) => window.setTimeout(resolve, reducedMotion ? 0 : 850)), onSuccess: () => { setOrderComplete(true); setCart([]); } });
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const discount = coupon.toUpperCase() === "VINKRI10" ? Math.round(cart.reduce((sum, line) => sum + line.product.price * line.quantity, 0) * 0.1) : 0;
  const searchResults = useMemo(() => { const query = searchQuery.trim().toLowerCase(); return query ? products.filter((product) => `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(query)) : products.slice(0, 6); }, [products, searchQuery]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setSearchOpen(true); }
      if (event.key === "Escape") { setSelectedProduct(null); setSimulatorOpen(false); setSearchOpen(false); setCartOpen(false); }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, []);

  const enterStudio = () => setEntered(true);
  const openFloor = (floor: FloorId) => { setActiveFloor(floor); setView("room"); setMenuOpen(false); window.setTimeout(() => document.getElementById("room-stage")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" }), 50); };
  const goHome = () => { setView("facade"); setOrderComplete(false); setMenuOpen(false); window.setTimeout(() => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }), 20); };
  const openProduct = (product: Product) => { setSelectedProduct(product); setLumens(product.lumens); setKelvin(product.kelvin); setSearchOpen(false); };
  const selectSimulatorProduct = (product: Product) => { setSimulatorProduct(product); setLumens(product.lumens); setKelvin(product.kelvin); };
  const openSimulator = () => { const firstLight = products.find((product) => product.floor === 3) ?? products[0]; selectSimulatorProduct(firstLight); setSimulatorOpen(true); };
  const addToCart = (product: Product) => { setCart((current) => { const existing = current.find((line) => line.product.id === product.id); return existing ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { product, quantity: 1 }]; }); setSelectedProduct(null); setCartOpen(true); };
  const changeQuantity = (id: string, delta: number) => setCart((current) => current.map((line) => line.product.id === id ? { ...line, quantity: Math.max(0, line.quantity + delta) } : line).filter((line) => line.quantity > 0));
  const toggleWish = (id: string) => setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <div className={`studio-app theme-${theme} ${entered ? "has-entered" : ""}`} data-testid="vinkri-studio-app">
      <StudioCursor />
      {!entered && <EntrySequence onEnter={enterStudio} reducedMotion={reducedMotion} />}
      {entered && <div className="studio-shell"><ParticleField count={18} /><Header theme={theme} onTheme={() => setTheme((current) => current === "dark" ? "light" : "dark")} onSearch={() => setSearchOpen(true)} onCart={() => setCartOpen(true)} cartCount={cartCount} onMenu={() => setMenuOpen((current) => !current)} onHome={goHome} />{menuOpen && <div className="mobile-menu-panel" data-testid="mobile-menu-panel"><button type="button" onClick={goHome} data-testid="mobile-menu-studio-button">STUDIO</button><button type="button" onClick={() => openFloor(3)} data-testid="mobile-menu-light-lab-button">LIGHT LAB</button><button type="button" onClick={() => openFloor(0)} data-testid="mobile-menu-object-library-button">OBJECT LIBRARY</button><button type="button" onClick={() => setSearchOpen(true)} data-testid="mobile-menu-search-button">SEARCH ARCHIVE</button></div>}{view === "facade" && <><Facade onFloor={openFloor} /><Marquee products={products} onProduct={openProduct} /><section className="footer-studio-note" data-testid="footer-studio-note"><div className="eyebrow">VINKRI / MAKE SPACE FOR FEELING</div><h2>Objects with a<br /><em>point of view.</em></h2><span>© 2025 VINKRI OBJECTS / ALL RIGHTS RESERVED</span></section></>}{view === "room" && <RoomView floor={activeFloor} products={products} wishlist={wishlist} onBack={goHome} onOpen={openProduct} onWish={toggleWish} onSimulator={openSimulator} />}{view === "checkout" && <Checkout cart={cart} onBack={() => { setView("room"); setCartOpen(false); }} onComplete={() => checkoutMutation.mutate()} orderComplete={orderComplete} isSubmitting={checkoutMutation.isPending} />}</div>}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={() => addToCart(selectedProduct)} isWished={wishlist.includes(selectedProduct.id)} onWish={() => toggleWish(selectedProduct.id)} />}
      {simulatorOpen && <RoomSimulatorModal products={products.filter((product) => product.floor === 3)} product={simulatorProduct} onSelect={selectSimulatorProduct} onClose={() => setSimulatorOpen(false)} darkness={darkness} lumens={lumens} kelvin={kelvin} onDarkness={setDarkness} onLumens={setLumens} onKelvin={setKelvin} />}
      {searchOpen && <SearchPanel query={searchQuery} onQuery={setSearchQuery} results={searchResults} onOpen={openProduct} onClose={() => setSearchOpen(false)} />}
      {cartOpen && <Trolley cart={cart} coupon={coupon} onCoupon={setCoupon} discount={discount} onClose={() => setCartOpen(false)} onQuantity={changeQuantity} onCheckout={() => { setCartOpen(false); setView("checkout"); setOrderComplete(false); }} />}
    </div>
  );
}