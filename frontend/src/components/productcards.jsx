const IMAGES = {
  buds: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
  keyboard: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80",
  mouse: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&q=80",
  camera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
  speaker: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
  tablet: "https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=400&q=80",
  gaming: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80",
  monitor: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80",
  drive: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=400&q=80",
  lock: "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80",
  charger: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=400&q=80",
  vacuum: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80",
  light: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80",
  styler: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80",
  scale: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80",
  mug: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80",
  glasses: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
  printer: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=80",
  headset: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80",
  laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
  watch: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  phone: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
  fallback: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&q=80",
};

function pickImage(name) {
  const n = name.toLowerCase();
  if (n.includes("buds") || n.includes("earbuds") || n.includes("airpods")) return IMAGES.buds;
  if (n.includes("headset") || n.includes("headphone") || n.includes("wh-")) return IMAGES.headset;
  if (n.includes("keyboard")) return IMAGES.keyboard;
  if (n.includes("mouse") || n.includes("mx master")) return IMAGES.mouse;
  if (n.includes("camera") || n.includes("gopro") || n.includes("facecam")) return IMAGES.camera;
  if (n.includes("speaker")) return IMAGES.speaker;
  if (n.includes("surface") || n.includes("tablet") || n.includes("pad") || n.includes("tab")) return IMAGES.tablet;
  if (n.includes("laptop") || n.includes("macbook") || n.includes("thinkpad")) return IMAGES.laptop;
  if (n.includes("watch") || n.includes("band") || n.includes("fitbit")) return IMAGES.watch;
  if (n.includes("phone") || n.includes("iphone") || n.includes("pixel") || n.includes("galaxy s")) return IMAGES.phone;
  if (n.includes("deck") || n.includes("quest") || n.includes("controller") || n.includes("xbox") || n.includes("switch") || n.includes("ally") || n.includes("portal") || n.includes("8bitdo")) return IMAGES.gaming;
  if (n.includes("monitor") || n.includes("display")) return IMAGES.monitor;
  if (n.includes("ssd") || n.includes("drive") || n.includes("passport")) return IMAGES.drive;
  if (n.includes("lock") || n.includes("doorbell")) return IMAGES.lock;
  if (n.includes("charger") || n.includes("power") || n.includes("nexode")) return IMAGES.charger;
  if (n.includes("vacuum") || n.includes("roborock")) return IMAGES.vacuum;
  if (n.includes("nanoleaf") || n.includes("light") || n.includes("shapes")) return IMAGES.light;
  if (n.includes("styler") || n.includes("airwrap")) return IMAGES.styler;
  if (n.includes("scale")) return IMAGES.scale;
  if (n.includes("mug")) return IMAGES.mug;
  if (n.includes("glasses") || n.includes("frames")) return IMAGES.glasses;
  if (n.includes("printer") || n.includes("ecotank")) return IMAGES.printer;
  return IMAGES.fallback;
}

export default function ProductCards({ product }) {
  const bullets = product.description
    ? product.description.split(",").slice(0, 3).map(b => b.trim())
    : [];

  return (
    <div className="device">
      <div className="device-img">
        <img src={pickImage(product.name)} alt={product.name} />
      </div>
      <div className="device-info">
        <div className="device-title" title={product.name}>{product.name}</div>
        <div className="device-cat">{product.category ? product.category.toUpperCase() : ""}</div>
        <ul className="device-bullets">
          {bullets.map((b, i) => (
            <li key={i}>• {b}</li>
          ))}
        </ul>
        <div className="device-footer">
          <div className="device-price">₹{product.price.toLocaleString("en-IN")}</div>
          <button className="device-btn-view">View Product</button>
        </div>
      </div>
    </div>
  );
}