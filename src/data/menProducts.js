// Catálogo de HOMBRE con productos reales organizados por marca
// Estructura: Nike, Adidas, Puma
// Las fotos reales están en /images/Catalogo/hombres/[Marca]/[Modelo]/[Color].png

export const menProducts = [
  // ========== NIKE ==========
  {
    id: "h-nike-01",
    category: "hombre",
    name: "Air Force 1 '07 LV8 Denim",
    brand: "Nike",
    type: "Lifestyle",
    price: 159,
    oldPrice: 189,
    colors: [
      {
        name: "Beige",
        base: "#d4c4a8",
        accent: "#8b7355",
        sole: "#f5f1e8",
        laces: "#d4c4a8",
        swatch: "#d4c4a8",
        photo: new URL("../../images/Catalogo/hombres/Nike/Air Force 1 '07 LV8 Denim/Beige.png", import.meta.url).href
      },
      {
        name: "Gris",
        base: "#8a8d92",
        accent: "#4a4d52",
        sole: "#e8e9eb",
        laces: "#6b6e73",
        swatch: "#8a8d92",
        photo: new URL("../../images/Catalogo/hombres/Nike/Air Force 1 '07 LV8 Denim/Gris.png", import.meta.url).href
      }
    ],
    sizes: ["40", "41", "42", "43", "44", "45"]
  },
  {
    id: "h-nike-02",
    category: "hombre",
    name: "Nike Air Force 1",
    brand: "Nike",
    type: "Clásico urbano",
    price: 149,
    colors: [
      {
        name: "Blanco",
        base: "#f5f5f5",
        accent: "#ffffff",
        sole: "#ffffff",
        laces: "#f0f0f0",
        swatch: "#ffffff",
        photo: new URL("../../images/Catalogo/hombres/Nike/Nike Air Force 1/Blanco.png", import.meta.url).href
      },
      {
        name: "Negro",
        base: "#1a1a1a",
        accent: "#2d2d2d",
        sole: "#0f0f0f",
        laces: "#1a1a1a",
        swatch: "#1a1a1a",
        photo: new URL("../../images/Catalogo/hombres/Nike/Nike Air Force 1/Negro.png", import.meta.url).href
      }
    ],
    sizes: ["40", "41", "42", "43", "44", "45", "46"]
  },
  {
    id: "h-nike-03",
    category: "hombre",
    name: "Nike Dunk Low Retro",
    brand: "Nike",
    type: "Retro clásico",
    price: 169,
    oldPrice: 199,
    colors: [
      {
        name: "Blanco",
        base: "#f7f7f7",
        accent: "#e8e8e8",
        sole: "#ffffff",
        laces: "#f0f0f0",
        swatch: "#ffffff",
        photo: new URL("../../images/Catalogo/hombres/Nike/Nike Dunk Low Retro/Blanco.png", import.meta.url).href
      },
      {
        name: "Celeste",
        base: "#a7c9e3",
        accent: "#6b9bc3",
        sole: "#f5f8fa",
        laces: "#d1e5f2",
        swatch: "#a7c9e3",
        photo: new URL("../../images/Catalogo/hombres/Nike/Nike Dunk Low Retro/Celeste.png", import.meta.url).href
      },
      {
        name: "Negro",
        base: "#1c1c1c",
        accent: "#0a0a0a",
        sole: "#2d2d2d",
        laces: "#1c1c1c",
        swatch: "#1c1c1c",
        photo: new URL("../../images/Catalogo/hombres/Nike/Nike Dunk Low Retro/Negro.png", import.meta.url).href
      }
    ],
    sizes: ["40", "41", "42", "43", "44", "45"]
  },
  {
    id: "h-nike-04",
    category: "hombre",
    name: "Nike Revolution 8",
    brand: "Nike",
    type: "Running",
    price: 98,
    colors: [
      {
        name: "Azul",
        base: "#2b4a7c",
        accent: "#1a2d4f",
        sole: "#e9ecf0",
        laces: "#4d6a9e",
        swatch: "#2b4a7c",
        photo: new URL("../../images/Catalogo/hombres/Nike/Nike Revolution 8/Azul.png", import.meta.url).href
      },
      {
        name: "Blanco y negro",
        base: "#f0f0f0",
        accent: "#1a1a1a",
        sole: "#ffffff",
        laces: "#8a8a8a",
        swatch: "#8a8a8a",
        photo: new URL("../../images/Catalogo/hombres/Nike/Nike Revolution 8/Blanco_y_negro.png", import.meta.url).href
      },
      {
        name: "Negro",
        base: "#1a1a1a",
        accent: "#0d0d0d",
        sole: "#2d2d2d",
        laces: "#1a1a1a",
        swatch: "#1a1a1a",
        photo: new URL("../../images/Catalogo/hombres/Nike/Nike Revolution 8/Negro.png", import.meta.url).href
      },
      {
        name: "Negro y rojo",
        base: "#1a1a1a",
        accent: "#c41e3a",
        sole: "#2d2d2d",
        laces: "#c41e3a",
        swatch: "#c41e3a",
        photo: new URL("../../images/Catalogo/hombres/Nike/Nike Revolution 8/Negro_y_rojo.png", import.meta.url).href
      }
    ],
    sizes: ["40", "41", "42", "43", "44", "45"]
  },

  // ========== ADIDAS ==========
  {
    id: "h-adidas-01",
    category: "hombre",
    name: "Dame X",
    brand: "Adidas",
    type: "Basketball",
    price: 189,
    colors: [
      {
        name: "Azul",
        base: "#3d5a8c",
        accent: "#1e3a5f",
        sole: "#eaeff5",
        laces: "#5a7cad",
        swatch: "#3d5a8c",
        photo: new URL("../../images/Catalogo/hombres/Adidas/Dame X/Azul.png", import.meta.url).href
      }
    ],
    sizes: ["40", "41", "42", "43", "44", "45"]
  },
  {
    id: "h-adidas-02",
    category: "hombre",
    name: "Drop Step Low 2.0",
    brand: "Adidas",
    type: "Lifestyle",
    price: 135,
    colors: [
      {
        name: "Blanco",
        base: "#f5f5f5",
        accent: "#e0e0e0",
        sole: "#ffffff",
        laces: "#f0f0f0",
        swatch: "#ffffff",
        photo: new URL("../../images/Catalogo/hombres/Adidas/Drop Step Low 2.0/Blanco.png", import.meta.url).href
      },
      {
        name: "Gris",
        base: "#a8aaad",
        accent: "#6d6f72",
        sole: "#e8e9ea",
        laces: "#9194a0",
        swatch: "#a8aaad",
        photo: new URL("../../images/Catalogo/hombres/Adidas/Drop Step Low 2.0/Gris.png", import.meta.url).href
      },
      {
        name: "Verde",
        base: "#4a6b4d",
        accent: "#2d4a30",
        sole: "#e8f0e9",
        laces: "#5f8062",
        swatch: "#4a6b4d",
        photo: new URL("../../images/Catalogo/hombres/Adidas/Drop Step Low 2.0/Verde.png", import.meta.url).href
      }
    ],
    sizes: ["40", "41", "42", "43", "44", "45"]
  },
  {
    id: "h-adidas-03",
    category: "hombre",
    name: "Forum Low CL",
    brand: "Adidas",
    type: "Retro clásico",
    price: 159,
    oldPrice: 185,
    colors: [
      {
        name: "Beige y marrón",
        base: "#d4c4a8",
        accent: "#8b6f47",
        sole: "#f5f1e8",
        laces: "#a68a5c",
        swatch: "#8b6f47",
        photo: new URL("../../images/Catalogo/hombres/Adidas/Forum Low CL/Beige_y_marron.png", import.meta.url).href
      },
      {
        name: "Beige y rojo",
        base: "#d4c4a8",
        accent: "#c41e3a",
        sole: "#f5f1e8",
        laces: "#a68a5c",
        swatch: "#c41e3a",
        photo: new URL("../../images/Catalogo/hombres/Adidas/Forum Low CL/Beige_y_rojo.png", import.meta.url).href
      }
    ],
    sizes: ["40", "41", "42", "43", "44", "45"]
  },
  {
    id: "h-adidas-04",
    category: "hombre",
    name: "LA Trainer OG",
    brand: "Adidas",
    type: "Retro deportivo",
    price: 145,
    colors: [
      {
        name: "Azul",
        base: "#4b6a9f",
        accent: "#2d4570",
        sole: "#eef2f7",
        laces: "#6282b8",
        swatch: "#4b6a9f",
        photo: new URL("../../images/Catalogo/hombres/Adidas/LA Trainer OG/Azul.png", import.meta.url).href
      }
    ],
    sizes: ["40", "41", "42", "43", "44", "45"]
  },

  // ========== PUMA ==========
  {
    id: "h-puma-01",
    category: "hombre",
    name: "Action Pro",
    brand: "Puma",
    type: "Performance",
    price: 119,
    colors: [
      {
        name: "Gris",
        base: "#9a9da2",
        accent: "#5d6064",
        sole: "#e8e9eb",
        laces: "#7a7d82",
        swatch: "#9a9da2",
        photo: new URL("../../images/Catalogo/hombres/Puma/Action Pro/Gris.png", import.meta.url).href
      },
      {
        name: "Negro",
        base: "#1a1a1a",
        accent: "#0d0d0d",
        sole: "#2d2d2d",
        laces: "#1a1a1a",
        swatch: "#1a1a1a",
        photo: new URL("../../images/Catalogo/hombres/Puma/Action Pro/Negro.png", import.meta.url).href
      },
      {
        name: "Verde",
        base: "#3d5c3f",
        accent: "#244026",
        sole: "#e5ede6",
        laces: "#527454",
        swatch: "#3d5c3f",
        photo: new URL("../../images/Catalogo/hombres/Puma/Action Pro/Verde.png", import.meta.url).href
      }
    ],
    sizes: ["40", "41", "42", "43", "44", "45"]
  },
  {
    id: "h-puma-02",
    category: "hombre",
    name: "Suede Dressed",
    brand: "Puma",
    type: "Lifestyle clásico",
    price: 129,
    oldPrice: 155,
    colors: [
      {
        name: "Marrón",
        base: "#6b4423",
        accent: "#8b5a2b",
        sole: "#f0e7d8",
        laces: "#9d6f3d",
        swatch: "#6b4423",
        photo: new URL("../../images/Catalogo/hombres/Puma/Suede Dressed/Marron.png", import.meta.url).href
      },
      {
        name: "Negro",
        base: "#1c1c1c",
        accent: "#0a0a0a",
        sole: "#2d2d2d",
        laces: "#1c1c1c",
        swatch: "#1c1c1c",
        photo: new URL("../../images/Catalogo/hombres/Puma/Suede Dressed/Negro.png", import.meta.url).href
      }
    ],
    sizes: ["40", "41", "42", "43", "44", "45"]
  },
  {
    id: "h-puma-03",
    category: "hombre",
    name: "Suede XL Shadow",
    brand: "Puma",
    type: "Lifestyle urbano",
    price: 139,
    colors: [
      {
        name: "Gris",
        base: "#b5b8bc",
        accent: "#6d7074",
        sole: "#eaebec",
        laces: "#8d9094",
        swatch: "#b5b8bc",
        photo: new URL("../../images/Catalogo/hombres/Puma/Suede XL Shadow/Gris.png", import.meta.url).href
      }
    ],
    sizes: ["40", "41", "42", "43", "44", "45"]
  },
  {
    id: "h-puma-04",
    category: "hombre",
    name: "Suede XL Slappy Sessionz",
    brand: "Puma",
    type: "Edición especial",
    price: 149,
    colors: [
      {
        name: "Gris",
        base: "#a8abaf",
        accent: "#5f6266",
        sole: "#e7e8ea",
        laces: "#888b8f",
        swatch: "#a8abaf",
        photo: new URL("../../images/Catalogo/hombres/Puma/Suede XL Slappy Sessionz/Gris.png", import.meta.url).href
      }
    ],
    sizes: ["40", "41", "42", "43", "44", "45"]
  }
]
