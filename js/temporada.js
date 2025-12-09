function goBack() {
  window.location.href = "../index.html";
}

const platos = [
  {
    nombre: "Salmón Glaseado",
    descripcion: "Salmón fresco con reducción de miel y limón.",
    precio: "$34.000",
    imagen: "https://www.cookforyourlife.org/es/recetas/salmon-glaseado-con-miel-de-maple/"
  },
  {
    nombre: "Risotto de Champiñones",
    descripcion: "Cremoso risotto con queso parmesano y champiñón portobello.",
    precio: "$28.000",
    imagen: "https://images.unsplash.com/photo-1559847844-5315695dadae"
  },
  {
    nombre: "Ensalada Mediterránea",
    descripcion: "Tomates cherry, aceitunas, pepino, queso feta y aderezo griego.",
    precio: "$22.000",
    imagen: "https://images.unsplash.com/photo-1523986371872-9d3ba2e2f5ab"
  },
  {
    nombre: "Lomo en Salsa de Vino",
    descripcion: "Lomo fino acompañado de salsa de vino tinto y hierbas.",
    precio: "$42.000",
    imagen: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
  }
];

const contenedor = document.getElementById("platosContainer");

platos.forEach(p => {
  const card = document.createElement("div");
  card.classList.add("plato-card");

  card.innerHTML = `
    <img src="${p.imagen}" class="plato-img">
    <h3 class="plato-name">${p.nombre}</h3>
    <p class="plato-desc">${p.descripcion}</p>
    <p class="plato-price">${p.precio}</p>
  `;

  contenedor.appendChild(card);
});
