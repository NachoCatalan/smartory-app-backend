import { AmountUnit } from "src/inventory/enums";

export const categories = [
  { name: 'Bebidas' },
  { name: 'Cereales' },
  { name: 'Lácteos' },
  { name: 'Carnes' },
  { name: 'Frutas' },
  { name: 'Panadería' },
  { name: 'Despensa' },
  { name: 'Pastas' },
];

export const producers = [
  { name: 'Carozzi' },
  { name: 'Nestlé' },
  { name: 'Soprole' },
  { name: 'Coca-Cola' },
  { name: 'Agrosuper' },
  { name: 'Colún' },
  { name: 'Ideal' },
  { name: 'Lucchetti' },
  { name: 'Belmont'}
];

export const products = [
  {
    name: 'Arroz Grado 2 1kg',
    description: 'Arroz blanco tradicional',
    category: 'Cereales',
    producer: 'Carozzi',
    amount: 1,
    amountUnit: AmountUnit.KG,
    images: [
      'https://i5.walmartimages.cl/asr/80aa553a-9e97-4cad-bc03-5e7456947298.ae4524a0b97e2a032e23b403ea41d3fd.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF'
    ]
  },
  {
    name: 'Coca Cola 1.5L',
    description: 'Bebida gaseosa',
    category: 'Bebidas',
    producer: 'Coca-Cola',
    amount: 1.5,
    amountUnit: AmountUnit.LT,
    images: [
      'https://micocacola.vtexassets.com/arquivos/ids/195214/7801610001622_2.png?v=638865613788970000'
    ]
  },
  {
    name: 'Leche Entera 1L',
    description: 'Leche larga vida',
    category: 'Lácteos',
    producer: 'Colún',
    amount: 1,
    amountUnit: AmountUnit.LT,
    images: [
      'https://www.colun.cl/admin/archivos/imagenes/productos/hGXYJoktisoXNbYGZGJp.png'
    ]
  },
  {
    name: 'Pechuga de Pollo 700 gr',
    description: 'Carne fresca',
    category: 'Carnes',
    producer: 'Agrosuper',
    amount: 700,
    amountUnit: AmountUnit.GR,
    images: [
      'https://agrosuperventas.com/medias/1012017-1-300Wx300H?context=bWFzdGVyfGltYWdlc3wzODQ2Njd8aW1hZ2UvanBlZ3xhR1U0TDJnd055ODRPREUwTWprNE56VTVNVGs0THpFd01USXdNVGRmTVY4ek1EQlhlRE13TUVnfDcxZTkzMTY4YTQ0ZDg1N2FkMzdiMDJiOTg2NGI5YWJlNDcyMThhNGVmYjBmN2YzYWZlMDQ5NmRmNDkzYTU0MjU'
    ]
  },
  {
    name: 'Manzana Roja 1kg',
    description: 'Fruta fresca',
    category: 'Frutas',
    producer: 'Nestlé',
    amount: 1,
    amountUnit: AmountUnit.UN,
    images: [
      'https://www.shutterstock.com/image-photo/fresh-red-apple-water-droplets-600nw-2717791503.jpg'
    ]
  },
  {
    name: 'Pan de Molde blanco 750 gr',
    description: 'Pan suave',
    category: 'Panadería',
    producer: 'Ideal',
    amount: 750,
    amountUnit: AmountUnit.GR,
    images: [
      'https://media.falabella.com/tottusCL/20114600_1/w=1500,h=1500,fit=cover'
    ]
  },
  {
    name: 'Aceite Vegetal 1L',
    description: 'Aceite para cocinar',
    category: 'Despensa',
    producer: 'Belmont',
    amount: 1,
    amountUnit: AmountUnit.LT,
    images: [
      'https://jcpuntofertas.cl/wp-content/uploads/2023/07/Aceite-vegeta-Belmont-1-L.jpg'
    ]
  },
  {
    name: 'Fideos Espagueti 500g',
    description: 'Pasta de trigo',
    category: 'Pastas',
    producer: 'Lucchetti',
    amount: 500,
    amountUnit: AmountUnit.GR,
    images: [
      'https://i5.walmartimages.cl/asr/a0afe1e9-2bf2-4dd4-9ede-6cdaa8fff339.51f4e5e79d47ad6b577440c19aedcd01.jpeg'
    ]
  },
  {
    name: 'Yogurt Natural 150gr',
    description: 'Yogurt sin azúcar',
    category: 'Lácteos',
    producer: 'Soprole',
    amount: 150,
    amountUnit: AmountUnit.GR,
    images: [
      'https://alvicl.vtexassets.com/arquivos/ids/166117/000000000000052483-UN.jpg?v=638960601640800000'
    ]
  },
  {
    name: 'Huevos 12 unidades',
    description: 'Huevos frescos',
    category: 'Lácteos',
    producer: 'Colún',
    amount: 12,
    amountUnit: AmountUnit.UN,
    images: [
      'https://santaisabel.vtexassets.com/arquivos/ids/527825/Huevos-Cuisine---Co-Grandes-Color-12-un.jpg?v=638908740205000000'
    ]
  },
];