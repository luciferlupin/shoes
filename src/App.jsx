import React, { useState, useEffect } from 'react';
import HudOverlay from './components/HudOverlay';
import HeroStage from './components/HeroStage';
import { playClickSound, playSwitchSound, playBootChime } from './utils/audio';

const PRODUCTS = [
  {
    id: 'aero-01',
    name: 'AERO 01 // PULSE RED',
    concept: 'PULSE RED',
    number: '01.85',
    color: '#dd2233',
    price: '$399.00',
    tag: 'HERITAGE RUNNER',
    specs: {
      weight: '238g',
      propulsion: '9.6/10',
      flexibility: '86%',
      cushioning: 'Encapsulated Air',
      traction: 'Classic Pivot Grip',
      material: 'Full-Grain Leather'
    },
    techLog: [
      'INITIALIZING HERITAGE ARCHIVE: 1985 CHICAGO COLOR MATRIX...',
      'CALIBRATING VARSITY RED DYE SPECTRUM AT 650NM...',
      'FULL-GRAIN LEATHER REINFORCEMENT VERIFIED.',
      'STATUS: ONLINE // READY FOR DISPATCH.'
    ],
    features: {
      toe: {
        number: '01.01',
        title: 'Laser Perforated Toe Box',
        text: '68 PRECISION LASER-PUNCHED AIRFLOW PORTS REGULATE INTERNAL TEMPERATURE AND EXPEL MOISTURE DURING HIGH ACTIVITY.',
        durability: 94,
        flexibility: 88
      },
      mudguard: {
        number: '01.02',
        title: 'Reinforced Mudguard Overlay',
        text: 'DOUBLE-STITCHED FULL-GRAIN RED LEATHER SHIELD PROTECTS HIGH-WEAR FOREFOOT ZONES FROM LATERAL SCRAPES.',
        durability: 96,
        flexibility: 82
      },
      laces: {
        number: '01.03',
        title: 'High-Tensile Braided Laces',
        text: 'HIGH-DENSITY NYLON WEAVE WITH ANODIZED EYELET REINFORCEMENTS PREVENTS PRESSURE POINTS ACROSS INSTEP.',
        durability: 90,
        flexibility: 95
      },
      tongue: {
        number: '01.04',
        title: 'Open-Cell Padded Mesh Tongue',
        text: 'BREATHABLE NYLON TONGUE WITH VINTAGE WOVEN AIR LABELS DELIVERS SOFT PRESSURE-RELIEF OVER THE METATARSALS.',
        durability: 88,
        flexibility: 92
      },
      swoosh: {
        number: '01.05',
        title: 'Precision-Cut Leather Swoosh',
        text: 'ARCHITECTURAL MIDFOOT OVERLAY ANCHORS THE LATERAL QUARTER PANEL FOR STRUCTURAL RIGIDITY.',
        durability: 95,
        flexibility: 85
      },
      midsole: {
        number: '01.06',
        title: 'Encapsulated Air-Sole Unit',
        text: 'PRESSURIZED NITROGEN GAS CAPSULE EMBEDDED IN HIGH-DENSITY EVA RESIN FOR SOFT, RESPONSIVE IMPACT DAMPING.',
        durability: 92,
        flexibility: 86
      },
      outsole: {
        number: '01.07',
        title: 'Concentric Pivot Waffle Outsole',
        text: 'SOLID RUBBER CUPSOLE WITH 360-DEGREE FOREFOOT PIVOT CIRCLE AND DEEP FLEX GROOVES FOR SUPERIOR COURT TRACTION.',
        durability: 98,
        flexibility: 80
      },
      heel: {
        number: '01.08',
        title: 'Molded TPU Heel Counter & Wings',
        text: 'RIGID INTERNAL HEEL CRADLE PREVENTS REARFOOT EVERSION WHILE EMBOSSED RETRO WINGS LOGO CELEBRATES HERITAGE.',
        durability: 94,
        flexibility: 78
      }
    }
  },
  {
    id: 'quantum-mocha',
    name: 'QUANTUM // REVERSE MOCHA',
    concept: 'REVERSE MOCHA',
    number: '02.22',
    color: '#5a4233',
    price: '$899.00',
    tag: 'BRUSHED SUEDE',
    specs: {
      weight: '242g',
      propulsion: '9.4/10',
      flexibility: '84%',
      cushioning: 'Cactus Air Unit',
      traction: 'Mocha Grip Matrix',
      material: 'Brushed Nubuck Suede'
    },
    techLog: [
      'LOADED CONFIG: QUANTUM REVERSE MOCHA BRUSHED SUEDE...',
      'APPLYING EARTH NUBUCK SUEDE DIFFUSE MAP...',
      'INVERTING LATERAL OVERLAY SWOOSH GEOMETRY...',
      'STATUS: GRAIL SPECIMEN ONLINE.'
    ],
    features: {
      toe: {
        number: '02.01',
        title: 'Dark Mocha Nubuck Toe Box',
        text: 'VELVET-TOUCH BRUSHED SUEDE FOREFOOT VAMP DELIVERS LUXURIOUS TACTILE FINISH WITH LASER PERFORATIONS.',
        durability: 91,
        flexibility: 90
      },
      mudguard: {
        number: '02.02',
        title: 'Sail Leather Mudguard Overlays',
        text: 'PREMIUM AGED SAIL GRAINED LEATHER OVERLAYS FRAME THE VAMP WITH UNIVERSITY RED CONTRAST ACCENTS.',
        durability: 95,
        flexibility: 84
      },
      laces: {
        number: '02.03',
        title: 'Waxed Vintage Cream Laces',
        text: 'CUSTOM ROUND COTTON-WAXED LACES IN VINTAGE SAIL MATCH THE AGED MIDSOLE FOR EFFORTLESS STREETWEAR DRAPE.',
        durability: 89,
        flexibility: 96
      },
      tongue: {
        number: '02.04',
        title: 'Embroidered Custom Tongue',
        text: 'WOVEN TONGUE PATCH FEATURES OFFSET EMBROIDERY WITH SOFT FOAM INNER SLEEVE.',
        durability: 90,
        flexibility: 91
      },
      swoosh: {
        number: '02.05',
        title: 'Inverted Signature Sail Swoosh',
        text: 'THE REVOLUTIONARY REVERSE SWOOSH DESIGN OVERSIZED AND ROOTED INTO THE AGED MIDSOLE STACK.',
        durability: 96,
        flexibility: 82
      },
      midsole: {
        number: '02.06',
        title: 'Vintage Aged Sail Midsole',
        text: 'PRE-YELLOWED RETRO PATINA MIDSOLE ENCAPSULATES NITROGEN AIR MATRIX FOR SIGNATURE COMFORT.',
        durability: 93,
        flexibility: 87
      },
      outsole: {
        number: '02.07',
        title: 'Mocha Rubber Outsole Cup',
        text: 'HIGH-DENSITY DARK MOCHA RUBBER PATTERN MATCHES THE SUEDE UPPER FOR SEAMLESS TONAL HARMONY.',
        durability: 97,
        flexibility: 81
      },
      heel: {
        number: '02.08',
        title: 'Crimson Embroidered Wings',
        text: 'DUAL-EMBROIDERED HEEL BADGES SHOWCASE THE EMBLEM IN VIVID CRIMSON.',
        durability: 94,
        flexibility: 79
      }
    }
  },
  {
    id: 'ignite-solar',
    name: 'IGNITE // SOLAR ORANGE',
    concept: 'SOLAR ORANGE',
    number: '03.55',
    color: '#ff6600',
    price: '$429.00',
    tag: 'HIGH-GLOSS PATENT',
    specs: {
      weight: '240g',
      propulsion: '9.5/10',
      flexibility: '85%',
      cushioning: 'Air Sole V2',
      traction: 'Solar Traction',
      material: 'Tumbled Gloss Leather'
    },
    techLog: [
      'LOADED CONFIG: IGNITE SOLAR ORANGE SPECTRUM...',
      'APPLYING HIGH-GLOSS CRINKLED LEATHER CLEARCOAT (0.45)...',
      'SOLAR ORANGE CHROMATIC ANCHOR LOCKED.',
      'STATUS: FULLY ONLINE.'
    ],
    features: {
      toe: {
        number: '03.01',
        title: 'Solar Crinkled Patent Toe',
        text: 'HIGH-GLOSS ORANGE TUMBLED LEATHER WITH INTEGRATED AIR DUCTS DELIVERS MAXIMUM VISIBILITY.',
        durability: 93,
        flexibility: 86
      },
      mudguard: {
        number: '03.02',
        title: 'Pitch Black Gloss Mudguard',
        text: 'SHINY JET-BLACK LEATHER STRAPS REINFORCE LATERAL EDGES AND CREATE VIBRANT CONTRAST.',
        durability: 96,
        flexibility: 83
      },
      laces: {
        number: '03.03',
        title: 'Densely Woven Jet Laces',
        text: 'BLACK BRAIDED LACES WITH REINFORCED AGLETS REDUCE FRICTION THROUGH METALLIC EYELETS.',
        durability: 91,
        flexibility: 94
      },
      tongue: {
        number: '03.04',
        title: 'Nylon Air Tongue Tab',
        text: 'BLACK WOVEN NYLON TONGUE DISPERSES LACE PRESSURE EVENLY ACROSS THE ARCH.',
        durability: 89,
        flexibility: 93
      },
      swoosh: {
        number: '03.05',
        title: 'High-Gloss Obsidian Swoosh',
        text: 'JET BLACK LEATHER SWOOSH OFFERS STRIKING CONTRAST AGAINST THE SAIL QUARTER PANELS.',
        durability: 95,
        flexibility: 85
      },
      midsole: {
        number: '03.06',
        title: 'Aged Cream Air-Sole',
        text: 'VINTAGE-TINTED DUAL-DENSITY EVA CORE OFFERS PLUSH WALKING TRANSITION.',
        durability: 93,
        flexibility: 88
      },
      outsole: {
        number: '03.07',
        title: 'Solar Orange Cupsole',
        text: 'BRIGHT ORANGE SOLID RUBBER TREAD OFFERS MAXIMUM TRACTION AND HIGH-VISIBILITY PROFILE.',
        durability: 98,
        flexibility: 82
      },
      heel: {
        number: '03.08',
        title: 'Orange Heel Cap & Wings',
        text: 'TUMBLED ORANGE LEATHER COLLAR WRAPS THE ACHILLES WITH TONAL RETRO EMBOSSING.',
        durability: 94,
        flexibility: 80
      }
    }
  },
  {
    id: 'stratos-unc',
    name: 'STRATOS // SKY VELOCITY',
    concept: 'SKY VELOCITY',
    number: '04.23',
    color: '#3b9bf0',
    price: '$449.00',
    tag: 'NAPPA LEATHER',
    specs: {
      weight: '236g',
      propulsion: '9.7/10',
      flexibility: '88%',
      cushioning: 'Icy Air Sole',
      traction: 'Sky Blue Pivot Grip',
      material: 'Buttery Nappa Leather'
    },
    techLog: [
      'LOADED CONFIG: STRATOS SKY BLUE SPEED MATRIX...',
      'APPLYING BUTTERY NAPPA LEATHER DIFFUSE & NORMAL MAPS...',
      'ICING BLUE TRANSLUCENT OUTSOLE CALIBRATION COMPLETE.',
      'STATUS: ONLINE.'
    ],
    features: {
      toe: {
        number: '04.01',
        title: 'Clean White Nappa Toe Box',
        text: 'BUTTERY SOFT WHITE FULL-GRAIN LEATHER VAMP WITH LASER VENTS OFFERS SUPREME STEP-IN FLEX.',
        durability: 92,
        flexibility: 91
      },
      mudguard: {
        number: '04.02',
        title: 'Sky Blue Mudguard',
        text: 'VIBRANT CAROLINA BLUE LEATHER OVERLAYS CRADLE THE FOREFOOT WITH CRISP WHITE ACCENT STITCHING.',
        durability: 95,
        flexibility: 86
      },
      laces: {
        number: '04.03',
        title: 'Crisp White Flat Laces',
        text: 'CONTRASTING BRIGHT WHITE LACES BRING CRISP MINIMALISM TO THE SKY-BLUE COLORBLOCKING.',
        durability: 90,
        flexibility: 96
      },
      tongue: {
        number: '04.04',
        title: 'Breathable White Mesh Tongue',
        text: 'PADDED WHITE TEXTILE TONGUE ENHANCES UPPER AIR CIRCULATION BY 35%.',
        durability: 88,
        flexibility: 94
      },
      swoosh: {
        number: '04.05',
        title: 'Obsidian Navy Swoosh Overlay',
        text: 'DEEP NAVY BLUE LEATHER EMBLEM PROVIDES TIMELESS COLOR DEPTH AND MIDFOOT LOCKDOWN.',
        durability: 95,
        flexibility: 85
      },
      midsole: {
        number: '04.06',
        title: 'Summit White Air Midsole',
        text: 'CLEAN WHITE RESIN CORE ENCASING THE AIR-SOLE POUCH FOR REBOUND EFFICIENCY.',
        durability: 93,
        flexibility: 87
      },
      outsole: {
        number: '04.07',
        title: 'Sky Blue Rubber Sole',
        text: 'TONAL SKY-BLUE RUBBER WITH PIVOT TREAD FOR FLUID DIRECTIONAL CUTS.',
        durability: 97,
        flexibility: 84
      },
      heel: {
        number: '04.08',
        title: 'UNC Heel Cap & Dark Wings',
        text: 'SKY BLUE HEEL WRAP EMBROIDERED WITH OBSIDIAN WINGS LOGO FOR REAR FOOT DISTINCTION.',
        durability: 94,
        flexibility: 81
      }
    }
  },
  {
    id: 'apex-emerald',
    name: 'APEX // EMERALD MATRIX',
    concept: 'EMERALD MATRIX',
    number: '05.18',
    color: '#118833',
    price: '$389.00',
    tag: 'COURT EDITION',
    specs: {
      weight: '244g',
      propulsion: '9.3/10',
      flexibility: '82%',
      cushioning: 'Air Sole V1',
      traction: 'Emerald Waffle',
      material: 'Tumbled Leather'
    },
    techLog: [
      'LOADED CONFIG: APEX EMERALD MATRIX COURT EDITION...',
      'APPLYING EMERALD DYE MATRIX & TUMBLED GRAIN NOISE...',
      'BLACK LOGO ACCENTS LOCKED AT 100% OPACITY.',
      'STATUS: ONLINE.'
    ],
    features: {
      toe: {
        number: '05.01',
        title: 'Emerald Green Toe Box',
        text: 'DEEP GREEN FULL-GRAIN LEATHER VAMP DELIVERS DISTINCTIVE RETRO BASKETBALL IDENTITY.',
        durability: 94,
        flexibility: 87
      },
      mudguard: {
        number: '05.02',
        title: 'Pitch Black Overlay Guard',
        text: 'BLACK LEATHER SURROUNDING THE TOE CAP PROTECTS AGAINST HEAVY SURFACE WEAR.',
        durability: 96,
        flexibility: 83
      },
      laces: {
        number: '05.03',
        title: 'Black Flat Weave Laces',
        text: 'BLACK FLAT-BRAID LACES SECURED WITH HEAVY-DUTY EYELET REINFORCEMENTS.',
        durability: 91,
        flexibility: 95
      },
      tongue: {
        number: '05.04',
        title: 'Emerald Tongue Label',
        text: 'CONTRASTING JUMPMAN & AIR TAGS SEWN ONTO A DURABLE BLACK FABRIC TONGUE.',
        durability: 89,
        flexibility: 92
      },
      swoosh: {
        number: '05.05',
        title: 'Black Leather Swoosh',
        text: 'BOLD JET-BLACK SWOOSH CONTRASTS WITH THE CRISP WHITE SIDE PANEL.',
        durability: 95,
        flexibility: 85
      },
      midsole: {
        number: '05.06',
        title: 'Pure White Air Midsole',
        text: 'HIGH-IMPACT POLYMER CORE ABSORBS 88% OF HEEL STRIKE ENERGY.',
        durability: 93,
        flexibility: 86
      },
      outsole: {
        number: '05.07',
        title: 'Emerald Rubber Sole',
        text: 'DENSE RUBBER FORMULATION PROVIDES MAXIMUM STREET & HARDWOOD TRACTION.',
        durability: 98,
        flexibility: 81
      },
      heel: {
        number: '05.08',
        title: 'Green Heel Counter Overlay',
        text: 'EMERALD LEATHER HEEL CUP PROVIDES TORSIONAL STIFFNESS AND HEEL RETENTION.',
        durability: 95,
        flexibility: 79
      }
    }
  },
  {
    id: 'phantom-stealth',
    name: 'PHANTOM // STEALTH OBSIDIAN',
    concept: 'STEALTH NOIR',
    number: '06.00',
    color: '#181818',
    price: '$420.00',
    tag: 'TACTICAL NOIR',
    specs: {
      weight: '230g',
      propulsion: '9.8/10',
      flexibility: '90%',
      cushioning: 'Nitrogen Stealth Pod',
      traction: 'Smoked Obsidian Tread',
      material: 'Ballistic Leather'
    },
    techLog: [
      'LOADED CONFIG: PHANTOM STEALTH OBSIDIAN TACTICAL...',
      'APPLYING MATTE BLACK ANTI-REFLECTIVE COATING...',
      'SMOKED TRANSLUCENT AIR CHAMBER ENGAGED.',
      'STATUS: STEALTH RUNNER ONLINE.'
    ],
    features: {
      toe: {
        number: '06.01',
        title: 'Matte Stealth Perforated Toe',
        text: 'BALLISTIC TUMBLED BLACK LEATHER WITH CONCEALED VENTILATION CHANNELS.',
        durability: 97,
        flexibility: 89
      },
      mudguard: {
        number: '06.02',
        title: 'Rubberized Ballistic Mudguard',
        text: 'TACTICAL ABRASION RESISTANT OVERLAY READY FOR ALL-WEATHER URBAN TERRAINS.',
        durability: 99,
        flexibility: 84
      },
      laces: {
        number: '06.03',
        title: 'Reflective 3M Tactical Laces',
        text: 'BLACK NYLON LACES WITH SUBTLE 3M THREAD FOR LOW-LIGHT VISIBILITY.',
        durability: 93,
        flexibility: 95
      },
      tongue: {
        number: '06.04',
        title: 'Gusseted Stealth Tongue',
        text: 'WEATHERPROOF GUSSET PREVENTS DIRT AND WATER INFILTRATION AT THE EYELETS.',
        durability: 94,
        flexibility: 90
      },
      swoosh: {
        number: '06.05',
        title: 'Gloss Black Accent Swoosh',
        text: 'SUBTLE SHINE VARIATION ON MATTE QUARTER GIVES A HIGH-END STEALTH LOOK.',
        durability: 96,
        flexibility: 86
      },
      midsole: {
        number: '06.06',
        title: 'Dark Charcoal EVA Midsole',
        text: 'MATTE BLACK SHOCK ABSORBER CONCEALING HIGH-PRESSURE NITROGEN CORE.',
        durability: 94,
        flexibility: 88
      },
      outsole: {
        number: '06.07',
        title: 'Smoked Translucent Outsole',
        text: 'SEMI-OPAQUE OBSIDIAN RUBBER REVEALS INTERNAL ARCH STIFFENER PLATE.',
        durability: 97,
        flexibility: 85
      },
      heel: {
        number: '06.08',
        title: 'Reflective Wings Emboss',
        text: 'TACTICAL TONAL HEEL EMBOSS WITH DISCREET MATTE ANTHRACITE FINISH.',
        durability: 95,
        flexibility: 80
      }
    }
  },
  {
    id: 'terra-dune',
    name: 'TERRA // DUNE ECO',
    concept: 'DUNE ECO',
    number: '07.24',
    color: '#a2795d',
    price: '$399.00',
    tag: 'MINIMAL ARTISANAL',
    specs: {
      weight: '245g',
      propulsion: '9.2/10',
      flexibility: '83%',
      cushioning: 'Eco Cork & Air Unit',
      traction: 'Gum Waffle Tread',
      material: 'Brushed Suede'
    },
    techLog: [
      'LOADED CONFIG: TERRA DUNE ECO NATURAL ARTISANAL...',
      'APPLYING MICRO-FIBER SUEDE & CANVAS ORGANIC MATRIX...',
      'VINTAGE GUM RUBBER SOLE CALIBRATION COMPLETE.',
      'STATUS: ONLINE.'
    ],
    features: {
      toe: {
        number: '07.01',
        title: 'Sanddrift Brushed Suede Toe',
        text: 'NATURAL TAN SUEDE WITH VELVET NAP FOR PREMIUM LIFESTYLE COMFORT.',
        durability: 91,
        flexibility: 89
      },
      mudguard: {
        number: '07.02',
        title: 'Desert Moss Suede Mudguard',
        text: 'EARTH TONED OVERLAYS REINFORCED WITH SAIL WAXED THREAD.',
        durability: 94,
        flexibility: 85
      },
      laces: {
        number: '07.03',
        title: 'Sail Organic Rope Laces',
        text: 'ROUND UNBLEACHED COTTON LACES PROVIDE A RELAXED ARTISANAL DRAPE.',
        durability: 90,
        flexibility: 96
      },
      tongue: {
        number: '07.04',
        title: 'Natural Canvas Tongue',
        text: 'TEXTURED SAIL CANVAS WITH EXPOSED FOAM EDGES FOR VINTAGE AESTHETIC.',
        durability: 89,
        flexibility: 92
      },
      swoosh: {
        number: '07.05',
        title: 'Hemp Brown Suede Swoosh',
        text: 'CONTRASTING EARTH BROWN SUEDE MOTIF EMBEDDED IN TAN QUARTERS.',
        durability: 94,
        flexibility: 86
      },
      midsole: {
        number: '07.06',
        title: 'Vintage Sail EVA Cushioning',
        text: 'NATURAL CUSHIONING UNIT COMPLIMENTED BY AN ECO ORTHOLITE INSOLE.',
        durability: 92,
        flexibility: 87
      },
      outsole: {
        number: '07.07',
        title: 'Vintage Gum Rubber Sole',
        text: 'GENUINE GUM RUBBER DELIVERS CLASSIC RETRO GRIP AND NATURAL BOUNCE.',
        durability: 97,
        flexibility: 83
      },
      heel: {
        number: '07.08',
        title: 'Suede Heel Counter & Wings',
        text: 'SOFT SANDDRIFT HEEL PANEL EMBOSSED WITH ICONIC WINGS LOGO.',
        durability: 93,
        flexibility: 80
      }
    }
  },
  {
    id: 'cyber-2099',
    name: 'CYBER // NEON KINETIC 2099',
    concept: 'NEON KINETIC',
    number: '08.99',
    color: '#00f0ff',
    price: '$599.00',
    tag: 'FUTURE CARBON',
    specs: {
      weight: '218g',
      propulsion: '9.9/10',
      flexibility: '94%',
      cushioning: 'Dual Nitrogen Chamber',
      traction: 'Carbon Kinetic Matrix',
      material: 'Twill Carbon Fiber'
    },
    techLog: [
      'LOADED EXPERIMENTAL SPECIMEN: CYBER 2099 NEON KINETIC...',
      'COMPILING 2x2 TWILL CARBON FIBER NORMAL SHADER...',
      'ACTIVATING LUMINOUS CYAN & MAGENTA GLOW PARTICLES...',
      'STATUS: FUTURISTIC SPEED RIG ACTIVE.'
    ],
    features: {
      toe: {
        number: '08.01',
        title: 'Carbon Fiber Weave Toe Box',
        text: 'HIGH-MODULUS 2x2 TWILL CARBON WEAVE PROVIDES UNMATCHED STRUCTURAL STRENGTH AT ULTRA-LOW MASS.',
        durability: 99,
        flexibility: 92
      },
      mudguard: {
        number: '08.02',
        title: 'Luminous Cyan Thermal Shield',
        text: 'AERODYNAMIC THERMOPLASTIC OVERLAY GLOWS WITH 0.8 LUX LUMINESCENCE UNDER LOW LIGHT.',
        durability: 98,
        flexibility: 88
      },
      laces: {
        number: '08.03',
        title: 'Kevlar Cyber Core Lacing',
        text: 'BULLETPROOF KEVLAR CORD WITH RAPID AUTO-TENSION DIAL LOCKS THE FOOT INSTANTLY.',
        durability: 99,
        flexibility: 98
      },
      tongue: {
        number: '08.04',
        title: 'Holographic Mesh Tongue',
        text: 'DIGITAL IRIDESCENT SURFACE REFRACTS AMBIENT LIGHT ACROSS THE ELECTROMAGNETIC SPECTRUM.',
        durability: 95,
        flexibility: 94
      },
      swoosh: {
        number: '08.05',
        title: 'Chrome Magenta Emissive Blade',
        text: 'ELECTROLUMINESCENT LATERAL STABILIZER CHIP DISPERSES TORSIONAL ENERGY AT 60 FPS.',
        durability: 98,
        flexibility: 89
      },
      midsole: {
        number: '08.06',
        title: 'Dual Nitrogen Kinetic Pod',
        text: 'DUAL GAS CHAMBERS OFFER 94% KINETIC REBOUND ON IMPACT.',
        durability: 96,
        flexibility: 92
      },
      outsole: {
        number: '08.07',
        title: 'Cyan Semi-Transparent Grip',
        text: 'HYPER-TRACTION POLYMER SOLE WITH REAL-TIME FORCE VECTORING CHANNELS.',
        durability: 98,
        flexibility: 90
      },
      heel: {
        number: '08.08',
        title: 'Carbon Aero Heel Wing',
        text: 'AERODYNAMIC HEEL SPOILER AND LIGHT BAR ENSURES STABILITY AT VELOCITY.',
        durability: 99,
        flexibility: 82
      }
    }
  }
];

export default function App() {
  const [activeProduct, setActiveProduct] = useState(PRODUCTS[0]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPackaged, setIsPackaged] = useState(false);
  const [viewAngle, setViewAngle] = useState('hero');
  const [isExploded, setIsExploded] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [lightMode, setLightMode] = useState('studio');
  const [activeHotspot, setActiveHotspot] = useState(null);

  // Mouse move tracker
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInitialize = () => {
    setIsInitialized(true);
    playBootChime();
  };

  const handleSelectProductById = (id) => {
    if (isPackaged) return;

    const found = PRODUCTS.find(p => p.id === id);
    if (found) {
      setActiveProduct(found);
      playSwitchSound();
    }
  };

  const handleAcquireClick = (e) => {
    e.stopPropagation();
    setIsPackaged(true);
    playClickSound();
  };

  if (!isInitialized) {
    return (
      <div className="init-screen">
        <div className="bg-grid"></div>
        <div className="bg-dot-grid"></div>
        <div className="init-dialog glass-panel">
          <div className="init-terminal-text">
            <p className="glitch-text">// SYSTEM INITIALIZATION DEPLOYMENT //</p>
            <p>PROJECT: DODD NEXT-GEN 3D SNEAKER SHOWCASE</p>
            <p>SPECIMENS: 8 DISTINCT COLORWAYS // HIGH-FIDELITY PBR MATERIALS</p>
            <p>ENGINE: THREE.JS 60FPS // GROUNDED ROTATING PEDESTAL & SHADOWS</p>
            <p>STATUS: SYSTEM READY. ENCRYPTED LINK CREATED.</p>
          </div>
          <button 
            className="init-button"
            onClick={handleInitialize}
          >
            ENTER SHOWCASE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`app-container mode-${lightMode}`}>
      {/* Background visual layers */}
      <div className="bg-grid"></div>
      <div className="bg-dot-grid"></div>
      <div className="bg-vignette"></div>
      <div className="bg-lighting-glow"></div>

      {/* Futuristic HUD overlays & Presets Toolbar */}
      <HudOverlay 
        mousePos={mousePos} 
        activeProduct={activeProduct}
        viewAngle={viewAngle}
        onSelectViewAngle={setViewAngle}
        isExploded={isExploded}
        onToggleExploded={setIsExploded}
        isAutoRotate={isAutoRotate}
        onToggleAutoRotate={setIsAutoRotate}
        lightMode={lightMode}
        onSelectLightMode={setLightMode}
      />

      {/* 3D WebGL Canvas */}
      <div className="stage-3d-background">
        <HeroStage 
          activeProduct={activeProduct} 
          isPackaged={isPackaged}
          onSelectProduct={handleSelectProductById} 
          viewAngle={viewAngle}
          isExploded={isExploded}
          isAutoRotate={isAutoRotate}
          lightMode={lightMode}
          activeHotspot={activeHotspot}
          setActiveHotspot={setActiveHotspot}
        />
      </div>

      {/* Clean Floating Bottom-Left Product Spec Card */}
      {!isPackaged && (
        <div className="bottom-product-spec-card glass-panel fade-in">
          <div className="spec-card-top-row">
            <div className="tag-cluster">
              <span className="concept-badge">{activeProduct.concept}</span>
              <span className="edition-pill">{activeProduct.tag}</span>
            </div>
            <span className="product-number-tag">{activeProduct.number}</span>
          </div>

          <h2 className="product-title-3d">{activeProduct.name}</h2>
          <div className="price-and-action-row">
            <span className="product-price-3d">{activeProduct.price}</span>
            <button 
              className="acquire-button-3d"
              onClick={handleAcquireClick}
            >
              PACKAGE SPECIMEN
            </button>
          </div>

          <div className="specs-mini-grid">
            <div className="spec-mini-cell">
              <span className="spec-mini-label">WEIGHT</span>
              <span className="spec-mini-val">{activeProduct.specs.weight}</span>
            </div>
            <div className="spec-mini-cell">
              <span className="spec-mini-label">PROPULSION</span>
              <span className="spec-mini-val">{activeProduct.specs.propulsion}</span>
            </div>
            <div className="spec-mini-cell">
              <span className="spec-mini-label">MATERIAL</span>
              <span className="spec-mini-val">{activeProduct.specs.material}</span>
            </div>
            <div className="spec-mini-cell">
              <span className="spec-mini-label">CUSHIONING</span>
              <span className="spec-mini-val">{activeProduct.specs.cushioning}</span>
            </div>
          </div>

          <div className="spec-card-barcode-row">
            <div className="barcode-graphic"></div>
            <span className="barcode-number">SYS_REF_{activeProduct.id.substring(0, 4).toUpperCase()}_01</span>
          </div>
        </div>
      )}

      {/* Clean Bottom-Center Shoe Edition Dock */}
      {!isPackaged && (
        <div className="bottom-shoe-selector-dock glass-panel">
          {PRODUCTS.map((prod) => (
            <button
              key={prod.id}
              className={`shoe-dock-pill ${prod.id === activeProduct.id ? 'active' : ''}`}
              onClick={() => handleSelectProductById(prod.id)}
              title={prod.name}
            >
              <span className="pill-color-dot" style={{ backgroundColor: prod.color }}></span>
              <span className="pill-name">{prod.concept}</span>
              <span className="pill-num">{prod.number}</span>
            </button>
          ))}
        </div>
      )}

      {/* Packaging Ticket Overlay - Shown when shoe is enclosed inside the acrylic container */}
      {isPackaged && (
        <div className="packaging-overlay-container">
          <div className="packaging-ticket-card glass-panel fade-in">
            <button className="info-card-close" onClick={() => setIsPackaged(false)}>×</button>
            
            <div className="ticket-left">
              <span className="concept-badge">{activeProduct.concept}</span>
              <h2 className="product-title-3d">{activeProduct.name}</h2>
              <span className="product-price-3d">{activeProduct.price}</span>
              
              <div className="dispatch-status">
                <span className="dispatch-dot"></span>
                <span className="dispatch-text">SPECIMEN ENCLOSED // AIRTIGHT ACRYLIC VAULT</span>
              </div>
            </div>

            <div className="ticket-right">
              <div className="card-barcode-area">
                <div className="barcode-graphic"></div>
                <span className="barcode-number">SYS_REF_{activeProduct.id.substring(0, 4).toUpperCase()}_C0DE</span>
              </div>
              <button 
                className="acquire-button-3d unbox-btn"
                onClick={() => {
                  playClickSound();
                  setIsPackaged(false);
                }}
              >
                UNBOX SPECIMEN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
