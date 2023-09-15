const itemInput = document.getElementById('itemInput');
const addButton = document.getElementById('addButton');
const shoppingList = document.getElementById('shoppingList');
const number = document.getElementById('numberInput');
const deleteAll = document.getElementById('deleteAll');

addButton.addEventListener('click', addItem);
window.addEventListener("load", function(){
    countRemainingItems();
    if(navigator.onLine){
        ShoppingList();
        if(localStorage.getItem('offlineData')){
            const i = this.localStorage.length;
            for(let a= 0 ; a<=i ; a++){
                const data = JSON.parse(localStorage.getItem("offlineData"));
                console.log(data[a]);
                addToFirebase(data[a].number, data[a].name); 
            }this.localStorage.clear();
        }else{
            console.log('Localde veri bulunamadı')
        }
    }
    else{
        LocalShoppingList();
    }
})

function addItem() {
    const newItem = itemInput.value.trim();
    const ItemNumber = numberInput.value.trim();
    const characterCount = newItem.length;
    const errorMessage = document.getElementById('error-message');
    if (newItem !== '') {
        if (/^[0-9]+[a-zA-z]$/.test(newItem) || /^[a-zA-z]+[0-9]$/.test(newItem)) {
            errorMessage.textContent = "Lütfen yalnızca ürün ismi giriniz."
        }else{
            if(characterCount >= 2){
                if(ItemNumber >=1){
                    if (navigator.onLine) {
                        addToFirebase(ItemNumber,newItem);
                    } else {
                        addToLocalStorage(ItemNumber,newItem);
                    }
                    numberInput.value = '';
                    itemInput.value = '';
                    numberInput.value = '';
                    errorMessage.textContent ='';
            }else{
                if (navigator.onLine) {
                    addToFirebase(1,newItem);
                } else {
                    addToLocalStorage(1,newItem);
                }
                numberInput.value = '';
                itemInput.value = '';
                numberInput.value = '';
                errorMessage.textContent ='';
            }
        }else{errorMessage.textContent = "Lütfen tam ürün ismi giriniz";}
    }
} else{errorMessage.textContent = "Lütfen ürün ismi giriniz.";}
}
function addToFirebase(ItemNumber, newItem) {
    db.collection('shoppingList').add({
        number: ItemNumber,
        name: newItem,
        checked: false 
    }).then((docRef) => {
        console.log(docRef.id);
        db.collection('shoppingList').onSnapshot(function(querySnapshot) {
            shoppingList.innerHTML = '';
            querySnapshot.forEach(function(doc) {
                const key = doc.id;
                const num = doc.data().number;
                const item = doc.data().name;
                const checked = doc.data().checked;
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item';
                listItem.innerHTML = `
                    <span class="ml-2">${num} Adet</span>
                    <span>${item}</span>
                    <button class="btn btn-danger btn-sm float-right" onclick="deleteItem('${key}')">
                        <i class="fa fa-trash"></i>
                    </button>
                    <button class="btn btn-primary btn-sm float-right mr-2" onclick="editItem('${key}', '${item}', '${num}')">
                        <i class="fa fa-pencil"></i> 
                    </button>
                    <button class="btn btn-${checked ? 'success' : 'warning'} btn-sm float-right mr-2" onclick="checkBtn('${key}', ${checked})">
                        <i class="fa fa-check"></i>
                    </button>
                `;
                shoppingList.appendChild(listItem);
            });
        });
    });
}
 function ShoppingList(){
     db.collection('shoppingList').onSnapshot(function(querySnapshot) {
        shoppingList.innerHTML = '';
        querySnapshot.forEach(function(doc) {
            const key = doc.id;
            const num = doc.data().number;
            const item = doc.data().name;
            const checked = doc.data().checked;
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.innerHTML = `
                <span class="ml-2">${num} Adet</span>
                <span>${item}</span>
                <button class="btn btn-danger btn-sm float-right" onclick="deleteItem('${key}')">
                    <i class="fa fa-trash"></i>
                </button>
                <button class="btn btn-primary btn-sm float-right mr-2" onclick="editItem('${key}', '${item}', '${num}')">
                    <i class="fa fa-pencil"></i> 
                </button>
                <button class="btn btn-${checked ? 'success' : 'warning'} btn-sm float-right mr-2" onclick="checkBtn('${key}', ${checked})">
                    <i class="fa fa-check"></i>
                </button>
            `;
            shoppingList.appendChild(listItem);
            
        });
    });
} 

function checkBtn(key, checked) {
    const itemRef = db.collection('shoppingList').doc(key);
    itemRef.update({
        checked: !checked 
    });
    countRemainingItems()
}
function countRemainingItems() {
    db.collection('shoppingList').get()
        .then((querySnapshot) => {
            let checkedItemCount = 0;
            let remainingItemCount = 0;
            querySnapshot.forEach((doc) => {
                const checked = doc.data().checked;
                if (checked) {
                    checkedItemCount++;
                }else{
                    remainingItemCount++;
                }
            });
            if(remainingItemCount === 0){
                console.log('alisveris bitti');
            }
            document.getElementById('checkedItemCount').textContent = checkedItemCount;
            document.getElementById('remainingItemCount').textContent = remainingItemCount;
        })
        .catch((error) => {
            console.error("Error counting remaining items: ", error);
        });
}


function editItem(key, item, num) {
    const updatenum = prompt('adedi güncelleyin:', num);
    const updatedItem = prompt('Ürünü güncelleyin:', item);
    if (updatedItem !== null) {
        db.collection('shoppingList').doc(key).update({ 
            name: updatedItem ,
            number : updatenum,
            checked: false
        });
    }
}
function deleteItem(key) {
    const confirmation = confirm('Ürünü silmek istediğinize emin misiniz?');
    if (confirmation) {
        db.collection('shoppingList').doc(key).delete();
    }
}

deleteAll.addEventListener('click', function(){
    const confirmation = confirm("Tüm ürünleri silmek istediğinize emin misiniz?");
    if(confirmation){
        while(shoppingList.firstChild){
            shoppingList.removeChild(shoppingList.firstChild);
        }
    }
    db.collection('shoppingList').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            db.collection('shoppingList').doc(doc.id).delete();
        }) })
})


