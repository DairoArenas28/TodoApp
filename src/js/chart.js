const labels = ["Pendiente","Completado"];
const colors = ['rgb(203,82,82)','rgb(99,201,122)'];


let ctx = $("#graph");
let totalState = ObtenerTotalEstadoTask()
const data = {
    labels: labels,
    datasets: [{
        label: "Ejemplo 1",
        data: totalState,
        backgroundColor: colors
    }]

}

const config = {
    type: "doughnut",
    data: data,
}

new Chart(ctx,config);

/*let myChart = new Chart(ctx,{
    type: "bar",
    data: data,
    options: {}
});*/

function ObtenerTotalEstadoTask() {
    let countPendiente = 0;
    let countCompletado = 0;
    for (let i = 0; i < localStorage.length; i++) {
        let clave = localStorage.key(i);
        let getContent = JSON.parse(localStorage.getItem(clave));
        console.log("Total " , getContent);
        if (getContent["state"] === 0) { // Filtra solo las claves que comienzan con "Task"
            countPendiente++;
        } else {
            countCompletado++;
        }
    }
    console.log("Total oendiente ", countPendiente)
    console.log("Total comple ", countCompletado)
    return [countPendiente,countCompletado]; // Retorna el array con los índices
}
