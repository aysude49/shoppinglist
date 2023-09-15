let offlineData = [];
function addToLocalStorage(ItemNumber, newItem) {
    const offlineData = JSON.parse(localStorage.getItem("offlineData")) || [];
    offlineData.push({
        number: ItemNumber,
        name: newItem,
        checked: false
    });
    localStorage.setItem("offlineData", JSON.stringify(offlineData));
}

function LocalShoppingList() {
    shoppingList.innerHTML = ''; 
    const offlineData = JSON.parse(localStorage.getItem("offlineData")) || [];
    if(navigator.onLine){
        offlineData.forEach(function (data) {
            addToFirebase(data.number, data.name);
        });

        localStorage.removeItem("offlineData");
    }else{
        offlineData.forEach(function (data) {
            const num = data.number;
            const item = data.name;
            const checked = data.checked || false;
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerHTML = `
                <span class="ml-2">${num} Adet</span>
                <span>${item}</span>
                <button class="btn btn-danger btn-sm float-right" onclick="deleteItemLocally('${item}')">
                    <i class="fa fa-trash"></i>
                </button>
                <button class="btn btn-primary btn-sm float-right mr-2" onclick="editItemLocally('${item}')">
                    <i class="fa fa-pencil"></i> 
                </button>
                <button class="btn btn-${checked ? 'success' : 'warning'} btn-sm float-right mr-2" onclick="checkItemLocally('${item}')">
                    <i class="fa fa-check"></i>
                </button>
            `;
            shoppingList.appendChild(listItem);
        });
    }
    
}
function deleteItemLocally(itemName) {
    const confirmation = confirm(`ürünü silmek istediğinize emin misiniz?`);
    if (confirmation) {
        const itemIndex = offlineData.findIndex(data => data.name === itemText);
        if (itemIndex) {
            const offlineData = JSON.parse(localStorage.getItem("offlineData"));

            const updatedOfflineData = offlineData.filter(function (data) {
                return data.name !== itemName;
            });

            localStorage.setItem("offlineData", JSON.stringify(updatedOfflineData));
            LocalShoppingList();
        }
    }
}

function editItemLocally(itemName, itemNumber) {
    const updatednum = prompt(`"${itemName}" ürününün adedini güncelleyin:`,itemNumber );
    const updatedItem = prompt(`"${itemName}" ürününü güncelleyin:`, itemName);
    if (updatedItem !== null) {
        if (localStorage.getItem("offlineData") !== null) {
            const offlineData = JSON.parse(localStorage.getItem("offlineData"));
            offlineData.forEach(function (data) {
                if (data.name === itemName) {
                    data.name = updatedItem;
                    data.number = updatednum;
                }
            });
            localStorage.setItem("offlineData", JSON.stringify(offlineData));
        }
    }
}

function checkItemLocally(itemName) {
    const offlineData = JSON.parse(localStorage.getItem("offlineData")) || [];
    offlineData.forEach(function (data) {
        if (data.name === itemName) {
            data.checked = !data.checked; 
        }
    });
    localStorage.setItem("offlineData", JSON.stringify(offlineData));
}