document.addEventListener("DOMContentLoaded", () => {

    const botones = document.querySelectorAll(".btn-guardar");

    botones.forEach(btn => {
        btn.addEventListener("click", () => {
            alert("✔ Cambios guardados correctamente");
        });
    });

});
