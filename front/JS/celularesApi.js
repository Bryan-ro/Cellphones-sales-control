const url = "http://localhost:4444";
const table = document.querySelector(".universal-info-tables");
const searchButton = document.getElementById("submit");
const  cleanSearchButton = document.getElementById("clean-search");
const searchInput = document.getElementById("search-cellPhones");
const createCellButton = document.getElementById("create-button");

async function searchAllCell () {
    searchInput.value = "";
    table.innerHTML = `
        <tr>
            <th>IMEI</th>
            <th>Modelo</th>
            <th>Status</th>
            <th>Data da venda</th>
        </tr>`;
    
    const devices = await axios.get(`${url}/device-info`);
        for(let i in devices.data) {
            const even = i % 2 !== 0 ? "even" : "odd";

            const date = new Date(devices.data[i].updatedAt);
            const dia = ("0" + date.getDate()).slice(-2);
            const mes = ("0" + (date.getMonth() + 1)).slice(-2);
            const ano = date.getFullYear();
            
            const status = !devices.data[i].sold ? "Disponível" : "Vendido";
            const ifSold = status === "Disponível" ? "Indisponivel" : `${dia}/${mes}/${ano}`;

            table.innerHTML += `
        <tr class="${even} line">
            <td class="imei">${devices.data[i].imei}</td>
            <td class="model">${devices.data[i].models.model}</td>
            <td class="status">${status}</td>
            <td class="date">${ifSold}</td>
        </tr>
        `;
    }
}

async function searchOneCell () {
    table.innerHTML = `
        <tr>
            <th>IMEI</th>
            <th>Modelo</th>
            <th>Status</th>
            <th>Data da venda</th>
        </tr>`;
        
    
        const devices = await axios.get(`${url}/device-info/${searchInput.value}`);

        const date = new Date(devices.data.updatedAt);
        const dia = ("0" + date.getDate()).slice(-2);
        const mes = ("0" + (date.getMonth() + 1)).slice(-2);
        const ano = date.getFullYear();

        const status = !devices.data.sold ? "Disponível" : "Vendido";
        const ifSold = status === "Disponível" ? "Indisponivel" : `${dia}/${mes}/${ano}`;

        if(!searchInput.value){
            return searchAllCell();
        }
            table.innerHTML += `
            <tr class="line">
            <td class="imei">${devices.data.imei}</td>
            <td class="model">${devices.data.models.model}</td>
            <td class="status">${status}</td>
            <td class="date">${ifSold}</td>
        </tr>
                `;
            
        
}

async function showInfos () {
    const tr = event.target.closest("tr");
    
    const imei = tr.querySelector(".imei").innerHTML;
    const vendido = tr.querySelector(".status").innerHTML;
    const date = tr.querySelector(".date").innerHTML;

    const device = await axios.get(`${url}/device-info/${imei}`);

    const preço = !device.data.price ? "Não informado" : `R$ ${Number(device.data.price).toFixed(2)}`;
    
    const modelInfos = {
        imei,
        model: device.data.models.model,
        ram: device.data.models.ram,
        armazenamento: device.data.models.storage,
        vendido,
        date,
        preço: `${preço.toString().replace(".", ",")}`,
        observações: device.data.observations   
    }

    const ifVendido = vendido === "Vendido" ? false : true;
    const showSaleDate = vendido === "Vendido" ? modelInfos.date : "Indisponivel";

    swal.fire({
        html: `
        <div class="overflow-hidden bg-black-800 shadow  w-full m-0">
            <div class="px-4 py-5 sm:px-6">
                <h3 class="text-base font-semibold leading-6 text-gray-300">Informações do dispositivo</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">Imei e configurações</p>
            </div>
            <div class="border-t border-gray-800">
                <dl>
                <div class="bg-zinc-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-300">IMEI</dt>
                    <dd class="mt-1 text-sm text-gray-100 sm:col-span-2 sm:mt-0">${imei}</dd>
                </div>
                <div class="bg-black-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-300">Modelo</dt>
                    <dd class="mt-1 text-sm text-gray-100 sm:col-span-2 sm:mt-0">${modelInfos.model}</dd>
                </div>
                <div class="bg-zinc-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-300">RAM</dt>
                    <dd class="mt-1 text-sm text-gray-100 sm:col-span-2 sm:mt-0">${modelInfos.ram} GB</dd>
                </div>
                <div class="bg-black-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-300">Armazenamento</dt>
                    <dd class="mt-1 text-sm text-gray-100 sm:col-span-2 sm:mt-0">${modelInfos.armazenamento} GB</dd>
                </div>
                <div class="bg-zinc-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-300">Observações</dt>
                    <dd class="mt-1 text-sm text-gray-100 sm:col-span-2 sm:mt-0">${modelInfos.observações}</dd>
                </div>
                <div class="bg-black-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-300">Status</dt>
                    <dd class="mt-1 text-sm text-gray-100 sm:col-span-2 sm:mt-0">${modelInfos.vendido}</dd>
                </div>
                <div class="bg-zinc-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-300">Data da venda</dt>
                    <dd class="mt-1 text-sm text-gray-100 sm:col-span-2 sm:mt-0">${showSaleDate}</dd>
                </div>
                <div class="bg-black-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-300">Preço</dt>
                    <dd class="mt-1 text-sm text-gray-100 sm:col-span-2 sm:mt-0">${modelInfos.preço}</dd>
                </div>
                </dl>
            </div>
        </div>
        `,
        background: "#121212",
        showCloseButton: true,
        showDenyButton: true,
        showConfirmButton: ifVendido,
        denyButtonText: "Excluir dispositivo",
        confirmButtonText: "Marcar como vendido"
        
    }).then((result) => {
       if(result.isDenied) {
            swal.fire({
                title: "O dispositivo será deletado permanentemente, deseja prosseguir?",
                icon: "warning",
                background: "#121212",
                showCancelButton: true,
                confirmButtonText: "Excluir",
                cancelButtonText: "Cancelar"
            }).then(async (result) => {
                if(result.isConfirmed) {
                    const device = await axios.delete(`${url}/device-info/${imei}`);

                    if(device ==! "deleted sucessfully") {
                        return swal.fire({
                            title:"Erro ao excluir o dispositivo. Tente novamente mais tarde.",
                            icon: "error",
                        })
                    }

                    swal.fire({
                        title:"Excluido com sucesso!",
                        icon: "success",
                        background: "#121212"
                    })
                    
                    return searchAllCell()
                }
            })
       } else if (result.isConfirmed) {
            swal.fire({
                background: "#121212",
                showCloseButton: true,
                title: "Informe o valor da venda:",
                input: "text"
            }).then(async (result) => {
                if(result.value) {
                    const device = await axios.put(`${url}/device-info/sold/${imei}`, {
                        price: result.value
                    })

                    if(device.status === 201) {
                        swal.fire({
                            title: "O dispositivo foi marcado como vendido!",
                            background: "#121212"
                        })
                        return searchAllCell()
                    }
                }
            })
       }
    })
}

document.addEventListener("DOMContentLoaded", searchAllCell);
searchButton.addEventListener("click", searchOneCell);
cleanSearchButton.addEventListener("click", searchAllCell);
document.addEventListener("keydown", (e) => {
    if(e.key === "Enter") {
        searchOneCell();
    }
});
table.addEventListener("click", showInfos);
createCellButton.addEventListener("click", () => window.location.href = "./html/createCell.html");