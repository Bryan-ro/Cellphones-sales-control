const baseUrl = "http://localhost:4444";
const infos = {
  imei: document.getElementById("imei"),
  model: null,
  observations: document.getElementById("observacoes")
};
const createButton = document.getElementById("cellForm");

function createCell() {
  event.preventDefault();
  axios.post(`${baseUrl}/device-info`, {
    imei: infos.imei.value,
    observations: infos.observations.value,
    modelId: infos.model
  }).then(res => {
    swal.fire({
      title: "Cadastrado com sucesso.",
      icon: "success",
      background: "#121212",
    })
  }).catch(err => {
    if (err.response.status === 422) {
      swal.fire({
        title: "Erro ao cadastrar.",
        text: `Verifique se um modelo foi selecionado. Se necessario entre em contato com o suporte.`,
        icon: "error",
        background: "#121212"
      })
    } else if (err.response.status === 409) {
      swal.fire({
        title: "Erro ao cadastrar.",
        text: `O IMEI informado já existe, verifique se você digitou corretamente. Se necessario entre em contato com o suporte.`,
        icon: "error",
        background: "#121212"
      })
    }


    console.log(err.response.status)
  })
}

async function viewModels() {
  const models = await axios.get(`${baseUrl}/model-info`);
  const divModel = document.querySelector(".modelos");

  for (i in models.data) {
    divModel.innerHTML += `
        <div class="rounded-2xl bg-gray-800 py-10 text-center  ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center border-indigo-600 cursor-pointer moldura" id="${models.data[i].id}">
        <div class="mx-auto max-w-xs px-8">
          <p class="text-base font-semibold text-gray-100">Samsung</p>
          <p class="text-50 font-semibold text-gray-100">${models.data[i].model}</p>
          <p class="mt-6 flex items-baseline justify-center gap-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-memory w-6 h-6" viewBox="0 0 16 16">
              <path d="M1 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.586a1 1 0 0 0 .707-.293l.353-.353a.5.5 0 0 1 .708 0l.353.353a1 1 0 0 0 .707.293H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H1Zm.5 1h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5Zm5 0h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5Zm4.5.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-4ZM2 10v2H1v-2h1Zm2 0v2H3v-2h1Zm2 0v2H5v-2h1Zm3 0v2H8v-2h1Zm2 0v2h-1v-2h1Zm2 0v2h-1v-2h1Zm2 0v2h-1v-2h1Z"/>
            </svg>
            <span class="text-2xl font-bold tracking-tight text-gray-100">${models.data[i].storage} GB</span>
            <span class="text-sm font-semibold leading-6 tracking-wide text-gray-100">Storage</span>
          </p>
          <p class="mt-6 flex items-baseline justify-center gap-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-device-hdd-fill w-6 h-6" viewBox="0 0 16 16">
              <path d="M8.785 9.896A3.001 3.001 0 0 0 8 4a3 3 0 0 0-.891 5.865c.667-.44 1.396-.91 1.955-1.268.224-.144.483.115.34.34l-.62.96ZM9 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
              <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4Zm9 1.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm0 13a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm-9.5.5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1ZM4 1.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm2.882 11.177a1.102 1.102 0 0 1-1.56-1.559c.1-.098.396-.314.795-.588a4 4 0 1 1 1.946.47c-.537.813-1.02 1.515-1.181 1.677Z"/>
            </svg>
            <span class="text-3xl font-bold tracking-tight text-gray-100">${models.data[i].ram} GB</span>
            <span class="text-sm font-semibold leading-6 tracking-wide text-gray-100">RAM</span>
          </p>
        </div>
      </div>
        `;
  }

  const selectModelButton = document.querySelectorAll(".moldura")

  selectModelButton.forEach(button => {
    button.addEventListener("click", selectModel);
  })
}

function selectModel() {
  // Desmarcar todos os modelos selecionados
  const allModelButtons = document.querySelectorAll(".moldura");

  for (let i = 0; i < allModelButtons.length; i++) {
    allModelButtons[i].classList.remove("border");
  }

  // Selecionar o ultimo clicado
  const model = event.target.closest(".moldura");
  infos.model = model.id;
  model.classList.toggle("border");
}


document.addEventListener('DOMContentLoaded', viewModels);
createButton.addEventListener("submit", createCell);