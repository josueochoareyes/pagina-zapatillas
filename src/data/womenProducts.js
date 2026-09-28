// Catálogo de MUJER con productos reales organizados por marca
// Estructura: Nike, Adidas, Puma
// Las fotos reales están en /images/Catalogo/mujeres/[Marca]/[Modelo]/[Color].png

export const womenProducts = [
  // ========== NIKE ==========
  {
    id: "m-nike-01",
    category: "mujer",
    name: "Air Force 1 '07 SE",
    brand: "Nike",
    type: "Lifestyle",
    price: 159,
    oldPrice: 189,
    colors: [
      {
        name: "Blanco y azul",
        base: "#f5f5f5",
        accent: "#4a7ba7",
        sole: "#ffffff",
        laces: "#4a7ba7",
        swatch: "#4a7ba7",
        photo: new URL("../../images/Catalogo/mujeres/Nike/Air Force 1 '07 SE/Blanco_y_azul.png", import.meta.url).href
      },
      {
        name: "Blanco y rojo",
        base: "#f5f5f5",
        accent: "#c41e3a",
        sole: "#ffffff",
        laces: "#c41e3a",
        swatch: "#c41e3a",
        photo: new URL("../../images/Catalogo/mujeres/Nike/Air Force 1 '07 SE/Blanco_y_rojo.png", import.meta.url).href
      },
      {
        name: "Blanco y rosa",
        base: "#f5f5f5",
        accent: "#e89bac",
        sole: "#ffffff",
        laces: "#e89bac",
        swatch: "#e89bac",
        photo: new URL("../../images/Catalogo/mujeres/Nike/Air Force 1 '07 SE/Blanco_y_rosa.png", import.meta.url).href
      }
    ],
    sizes: ["36", "37", "38", "39", "40", "41"]
  },
  {
    id: "m-nike-02",
    category: "mujer",
    name: "Air Max Bia",
    brand: "Nike",
    type: "Running lifestyle",
    price: 179,
    colors: [
      {
        name: "Blanco",
        base: "#f5f5f5",
        accent: "#e0e0e0",
        sole: "#ffffff",
        laces: "#f0f0f0",
        swatch: "#ffffff",
        photo: new URL("../../images/Catalogo/mujeres/Nike/Air Max Bia/Blanco.png", import.meta.url).href
      }
    ],
    sizes: ["36", "37", "38", "39", "40", "41"]
  },
  {
    id: "m-nike-03",
    category: "mujer",
    name: "Court Vision Low",
    brand: "Nike",
    type: "Lifestyle urbano",
    price: 109,
    colors: [
      {
        name: "Rojo",
        base: "#c41e3a",
        accent: "#8b1529",
        sole: "#f5e8ea",
        laces: "#d94759",
        swatch: "#c41e3a",
        photo: new URL("../../images/Catalogo/mujeres/Nike/Court Vision Low/Rojo.png", import.meta.url).href
      },
      {
        name: "Rosa",
        base: "#e89bac",
        accent: "#c7637a",
        sole: "#fdf3f5",
        laces: "#f0b5c3",
        swatch: "#e89bac",
        photo: new URL("../../images/Catalogo/mujeres/Nike/Court Vision Low/Rosa.png", import.meta.url).href
      }
    ],
    sizes: ["36", "37", "38", "39", "40", "41"]
  },
  {
    id: "m-nike-04",
    category: "mujer",
    name: "Free Metcon 7",
    brand: "Nike",
    type: "Training",
    price: 149,
    oldPrice: 175,
    colors: [
      {
        name: "Blanco",
        base: "#f7f7f7",
        accent: "#e0e0e0",
        sole: "#ffffff",
        laces: "#f0f0f0",
        swatch: "#ffffff",
        photo: new URL("../../images/Catalogo/mujeres/Nike/Free Metcon 7/Blanco.png", import.meta.url).href
      },
      {
        name: "Rosa",
        base: "#f0a5b8",
        accent: "#d87393",
        sole: "#fdf5f7",
        laces: "#f5c2d1",
        swatch: "#f0a5b8",
        photo: new URL("../../images/Catalogo/mujeres/Nike/Free Metcon 7/Rosa.png", import.meta.url).href
      },
      {
        name: "Verde",
        base: "#5d8a6e",
        accent: "#3f6450",
        sole: "#e8f0eb",
        laces: "#72a085",
        swatch: "#5d8a6e",
        photo: new URL("../../images/Catalogo/mujeres/Nike/Free Metcon 7/Verde.png", import.meta.url).href
      }
    ],
    sizes: ["36", "37", "38", "39", "40", "41"]
  },

  // ========== ADIDAS ==========
  {
    id: "m-adidas-01",
    category: "mujer",
    name: "Gazelle Indoor",
    brand: "Adidas",
    type: "Retro clásico",
    price: 155,
    colors: [
      {
        name: "Beige",
        base: "#d9c9b5",
        accent: "#a68a68",
        sole: "#f5f1e8",
        laces: "#c4b09a",
        swatch: "#d9c9b5",
        photo: new URL("../../images/Catalogo/mujeres/Adidas/Gazelle Indoor/Beige.png", import.meta.url).href
      },
      {
        name: "Blanco",
        base: "#f5f5f5",
        accent: "#e0e0e0",
        sole: "#ffffff",
        laces: "#f0f0f0",
        swatch: "#ffffff",
        photo: new URL("../../images/Catalogo/mujeres/Adidas/Gazelle Indoor/Blanco.png", import.meta.url).href
      }
    ],
    sizes: ["36", "37", "38", "39", "40", "41"]
  },
  {
    id: "m-adidas-02",
    category: "mujer",
    name: "Lightblaze",
    brand: "Adidas",
    type: "Lifestyle moderno",
    price: 169,
    colors: [
      {
        name: "Rosa",
        base: "#e8a0b3",
        accent: "#c97590",
        sole: "#fdf4f6",
        laces: "#f2bad0",
        swatch: "#e8a0b3",
        photo: new URL("../../images/Catalogo/mujeres/Adidas/Lightblaze/Rosa.png", import.meta.url).href
      }
    ],
    sizes: ["36", "37", "38", "39", "40", "41"]
  },
  {
    id: "m-adidas-03",
    category: "mujer",
    name: "TURNAROUND",
    brand: "Adidas",
    type: "Lifestyle urbano",
    price: 139,
    oldPrice: 165,
    colors: [
      {
        name: "Rosa",
        base: "#f0b5c5",
        accent: "#d88aa5",
        sole: "#fef6f8",
        laces: "#f5cfd9",
        swatch: "#f0b5c5",
        photo: new URL("../../images/Catalogo/mujeres/Adidas/TURNAROUND/Rosa.png", import.meta.url).href
      }
    ],
    sizes: ["36", "37", "38", "39", "40", "41"]
  },
  {
    id: "m-adidas-04",
    category: "mujer",
    name: "Y-3 Superstar",
    brand: "Adidas",
    type: "Premium collab",
    price: 299,
    colors: [
      {
        name: "Blanco",
        base: "#f7f7f7",
        accent: "#e0e0e0",
        sole: "#ffffff",
        laces: "#f0f0f0",
        swatch: "#ffffff",
        photo: new URL("../../images/Catalogo/mujeres/Adidas/Y-3 Superstar/Blanco.png", import.meta.url).href
      },
      {
        name: "Negro",
        base: "#1a1a1a",
        accent: "#0d0d0d",
        sole: "#2d2d2d",
        laces: "#1a1a1a",
        swatch: "#1a1a1a",
        photo: new URL("../../images/Catalogo/mujeres/Adidas/Y-3 Superstar/Negro.png", import.meta.url).href
      },
      {
        name: "Negro y blanco",
        base: "#1a1a1a",
        accent: "#f5f5f5",
        sole: "#e0e0e0",
        laces: "#f5f5f5",
        swatch: "#8a8a8a",
        photo: new URL("../../images/Catalogo/mujeres/Adidas/Y-3 Superstar/Negro_y_blanco.png", import.meta.url).href
      }
    ],
    sizes: ["36", "37", "38", "39", "40", "41"]
  },

  // ========== PUMA ==========
  {
    id: "m-puma-01",
    category: "mujer",
    name: "Action Pro",
    brand: "Puma",
    type: "Performance",
    price: 119,
    colors: [
      {
        name: "Blanco",
        base: "#f5f5f5",
        accent: "#e0e0e0",
        sole: "#ffffff",
        laces: "#f0f0f0",
        swatch: "#ffffff",
        photo: new URL("../../images/Catalogo/mujeres/Puma/Action Pro/Blanco.png", import.meta.url).href
      },
      {
        name: "Negro",
        base: "#1a1a1a",
        accent: "#0d0d0d",
        sole: "#2d2d2d",
        laces: "#1a1a1a",
        swatch: "#1a1a1a",
        photo: new URL("../../images/Catalogo/mujeres/Puma/Action Pro/Negro.png", import.meta.url).href
      }
    ],
    sizes: ["36", "37", "38", "39", "40", "41"]
  },
  {
    id: "m-puma-02",
    category: "mujer",
    name: "Cilia 2 Mode Metallic Glam",
    brand: "Puma",
    type: "Lifestyle elegante",
    price: 129,
    colors: [
      {
        name: "Blanco",
        base: "#f7f7f7",
        accent: "#d4d4d4",
        sole: "#ffffff",
        laces: "#e8e8e8",
        swatch: "#ffffff",
        photo: new URL("../../images/Catalogo/mujeres/Puma/Cilia 2 Mode Metallic Glam/Blanco.png", import.meta.url).href
      }
    ],
    sizes: ["36", "37", "38", "39", "40", "41"]
  },
  {
    id: "m-puma-03",
    category: "mujer",
    name: "MB World.01",
    brand: "Puma",
    type: "Basketball lifestyle",
    price: 189,
    oldPrice: 219,
    colors: [
      {
        name: "Blanco",
        base: "#f5f5f5",
        accent: "#e0e0e0",
        sole: "#ffffff",
        laces: "#f0f0f0",
        swatch: "#ffffff",
        photo: new URL("../../images/Catalogo/mujeres/Puma/MB World.01/Blanco.png", import.meta.url).href
      }
    ],
    sizes: ["36", "37", "38", "39", "40", "41"]
  },
  {
    id: "m-puma-04",
    category: "mujer",
    name: "Suede XL Wild",
    brand: "Puma",
    type: "Lifestyle urbano",
    price: 139,
    colors: [
      {
        name: "Negro",
        base: "#1c1c1c",
        accent: "#0a0a0a",
        sole: "#2d2d2d",
        laces: "#1c1c1c",
        swatch: "#1c1c1c",
        photo: new URL("../../images/Catalogo/mujeres/Puma/Suede XL Wild/Negro.png", import.meta.url).href
      },
      {
        name: "Rosa",
        base: "#e8a8ba",
        accent: "#c97591",
        sole: "#fdf5f7",
        laces: "#f2c2d3",
        swatch: "#e8a8ba",
        photo: new URL("../../images/Catalogo/mujeres/Puma/Suede XL Wild/Rosa.png", import.meta.url).href
      }
    ],
    sizes: ["36", "37", "38", "39", "40", "41"]
  }
]
