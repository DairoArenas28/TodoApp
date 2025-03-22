//console.log(typeof jQuery);
$(document).ready(function () {
    let date = new Date();
    let formattedDate = new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',   // Día de la semana completo
        day: '2-digit',    
        month: 'long',     // Mes en texto
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short' // Zona horaria corta (ejemplo: GMT-5)
    }).format(date);
    CargarLocalStorage()
    $("#btn").on("click", function () {
        let inputTask = $('#inputTask').val();
        var selectedIndex = $('input[name="flexRadioDefault"]:checked').index('input[name="flexRadioDefault"]');
        let indice = ObtenerUltimoRegistro();
        let indiceUltimo = indice ? indice["indice"] + 1 : 0;   
        const taskObj = {
            "number_task" : indiceUltimo,
            "formatted_date" : formattedDate,
            "input_task" : inputTask,
            "state" : selectedIndex,
        }
        if(inputTask !== ""){
            GuardarLocalStorage("Task"+indiceUltimo,taskObj)
            CargarLocalStorage();
            console.log(localStorage.length)
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Tarea creada",
                showConfirmButton: false,
                timer: 1500
            });
            Limpiar();
            taskObj.remove;
            //console.log(inputTask1)
        } else {
            console.log("Esta vacio")
            Swal.fire({
                position: "top-end",
                icon: "info",
                title: "Campo vacío",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });

    $("#btnLocalStorage").on("click", function () {
        LimpiarLocalStorage();
    })

    function ContenidoTask(numberTask,inputTask,formattedDate,state){
        if ($("#Task" + numberTask).length === 0) {
        $("#containerTask").before(`
            <div class="col-10 col-sm-8 col-md-6 col-lg-6 bg-white mt-2 p-3 shadow-sm border rounded taskItem" id="Task${numberTask}">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="mb-0">Tarea ${numberTask}</h4>
                    <div class="ms-auto"> 
                        <button class="btn btn-danger delete-task me-2" type="button" data-id="${numberTask}">
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <line x1="4" y1="4" x2="20" y2="20" stroke="white" stroke-width="3" stroke-linecap="round"/>
                                <line x1="20" y1="4" x2="4" y2="20" stroke="white" stroke-width="3" stroke-linecap="round"/>
                            </svg>
                        </button>
                        <button class="btn btn-primary edit-task" type="button" data-id="${numberTask}">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16 3L21 8L8 21H3V16L16 3Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M14 5L19 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <hr class="my-3">
                <p class="my-4"  id="textTask">${inputTask}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="text-first" id="contentState">
                        ${state === 0 ? `<p class="mb-0 bg-danger text-white px-2 border rounded">Pendiente</p>` : `<p class="mb-0 bg-success text-white px-2 border rounded">Completado</p>`}
                    </div>
                    <div class="text-end">
                        <span>${formattedDate}</span>
                    </div>
                </div>
            </div>
        `);
        }
    }

    function CargarLocalStorage() {
        
        //$(".taskItem").empty();
        let arrayTask = ObtenerNumeroTask();
        arrayTask.sort();
        console.log(arrayTask);
        for (let i = 0; i < arrayTask.length; i++) {
            let element = arrayTask[i];
            console.log(element)
            let storedTaskData = localStorage.getItem('Task'+element);
            console.log(storedTaskData);
            try {
                let taskArray = JSON.parse(storedTaskData);
                ContenidoTask(element,taskArray["input_task"],taskArray["formatted_date"],taskArray["state"]);
            } catch (error) {
                console.error("Error al parsear los datos del LocalStorage:",error);
            }
        }
        
    }

    function GuardarLocalStorage(key,valueObj) {
        localStorage.setItem(key, JSON.stringify(valueObj))
        //const storedTaskData = localStorage.getItem('Task'+numbertask)
        //console.log(storedTaskData)
    }

    function ActualizarTask(id) {
        let inputTaskEditText = $("#Task"+ id + " #inputTaskEdit").val();
        let inputContentEdit = $("#Task"+ id + " #inputContentEdit");
        let contentState = $("#Task"+ id + " #contentStateEdit");
        var selectedIndex = $('input[name="flexRadioDefaultEdit"]:checked').index('input[name="flexRadioDefaultEdit"]');

        let stateText = "";
        if(selectedIndex == 0){stateText = `<p class="mb-0 bg-danger text-white px-2 border rounded">Pendiente</p>`} else {stateText = `<p class="mb-0 bg-success text-white px-2 border rounded">Completado</p>`}
        const taskObj = {
            "number_task" : id,
            "formatted_date" : formattedDate,
            "input_task" : inputTaskEditText,
            "state" : selectedIndex
        }
        GuardarLocalStorage("Task"+id,taskObj);
        inputContentEdit.replaceWith(`
            <p class="my-4" id="textTask">${inputTaskEditText}</p>
        `);
        contentState.replaceWith(`
            <div class="text-first" id="contentState">
                ${stateText}
            </div>         
        `);

        CargarPagina();
    }

    function ModoEdicion(id) {
        let btnDelete = $("#Task"+ id + " .delete-task");
        let btnEdit = $("#Task"+ id + " .edit-task");
        let textTask = $("#Task"+ id + " #textTask");
        let contentState = $("#Task"+ id + " #contentState");
        let contentStateText = contentState.text().trim();

        btnDelete.fadeOut(300);
        btnEdit.replaceWith(`
            <button class="btn btn-success save-edit-task" type="button" data-id="${id}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12L9 16L19 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        `);
        textTask.replaceWith(`
            <div class="form-group mb-5" id="inputContentEdit">
                <input type="text" value="${textTask.text()}" class="form-control" name="" id="inputTaskEdit" aria-describedby="helpId" placeholder="">
            </div>
        `)
        contentState.replaceWith(`
            <div id="contentStateEdit">
                <div class="form-check mt-2">
                    <input class="form-check-input" type="radio" name="flexRadioDefaultEdit" id="flexRadioDefault1" ${contentStateText === "Pendiente" ? "checked" : ""}>
                    <label class="form-check-label" for="flexRadioDefault1">
                        Pendiente
                    </label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="flexRadioDefaultEdit" id="flexRadioDefault2" ${contentStateText === "Completado" ? "checked" : ""}>
                    <label class="form-check-label" for="flexRadioDefault2">
                        Completado
                    </label>
                </div>
            </div>
        `);
    }

    function EliminarLocalStorage(key) {
        
        Swal.fire({
            title: "Estas seguro de eliminar la tarea?",
            text: "No hay vuelta atrás!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Eliminar tarea!"
          }).then((result) => {
            if (result.isConfirmed) {
                //$("#Task" + id).remove();
                localStorage.removeItem(key);
                CargarPagina();
                Swal.fire({
                    title: "Tarea eliminada",
                    text: "",
                    icon: "success"
                });
            }
        });
    }

    function CargarPagina() {
        location.reload();
    }

    function LimpiarLocalStorage() {
        Swal.fire({
            title: "Estas seguro de limpiar el Local Storage?",
            text: "Se te eliminará todas las tareas agregadas!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Eliminar las tareas!"
          }).then((result) => {
            if (result.isConfirmed) {
                //$("#Task" + id).remove();
                localStorage.clear();
                CargarPagina();
            }
        });
        
    }

    function ObtenerUltimoRegistro() {
        let ultimoIndice = -1;
    
        for (let i = 0; i < localStorage.length; i++) {
            let clave = localStorage.key(i);
            
            if (clave.startsWith("Task")) { // Filtra solo las claves que corresponden a tareas
                let indice = parseInt(clave.replace("Task", ""), 10);
                if (!isNaN(indice) && indice > ultimoIndice) {
                    ultimoIndice = indice;
                }
            }
        }
    
        if (ultimoIndice !== -1) {
            let ultimoRegistro = localStorage.getItem("Task" + ultimoIndice);
            return { "indice": ultimoIndice, data: JSON.parse(ultimoRegistro) };
        } else {
            return { "indice": 0};
        }
    
        return null; // Si no hay registros
    }

    function ObtenerNumeroTask() {
    
        let arrayIndiceTask = []; // Inicializa el array fuera del bucle

        for (let i = 0; i < localStorage.length; i++) {
            let clave = localStorage.key(i);
            if (clave.startsWith("Task")) { // Filtra solo las claves que comienzan con "Task"
                let indice = parseInt(clave.replace("Task", ""), 10);
                arrayIndiceTask.push(indice); // Agrega el índice al array
            }
        }

        return arrayIndiceTask; // Retorna el array con los índices
    }

    function Limpiar(){
        $('#inputTask').val("");
    }

    $(document).on("click", ".delete-task", function () {
        let id = $(this).data("id");
        EliminarLocalStorage("Task"+id);
    });

    $(document).on("click", ".edit-task", function () {
        let id = $(this).data("id");
        ModoEdicion(id);
    });

    $(document).on("click", ".save-edit-task", function () {
        Swal.fire({
            title: "Estas seguro de actualizar la tarea?",
            text: "No hay vuelta atrás!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, Actualizar tarea!"
          }).then((result) => {
            if (result.isConfirmed) {
                //$("#Task" + id).remove();
                let id = $(this).data("id");
                ActualizarTask(id);
                CargarPagina();
            } else {
                CargarPagina();
            }
        });
    });
});

