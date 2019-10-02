/** Dependency: Bootstrap 4 */
class eCart {

    constructor(name) {
        this.name = (name == undefined ? "eCart" : name);
        this.items = [];
        this.debug = true;
        this.logMessage = { message: "Cart created", item: null };
        this._load();
    }

    addItem(item) {
        /* item = { name: "pepe", price:556.25 , count: 1 } */
        let exists = false;
        this.items.forEach((element, i, arr) => {
            if (element.name == item.name) {
                arr[i].count++;
                arr[i].total = parseFloat(arr[i].total) + parseFloat(arr[i].price);
                item = arr[i];
                exists = true;
            }
        });
        if (!exists) {
            item.total = parseFloat(item.price);
            item.price = parseFloat(item.price);
            this.items.push(item);
        }
        this._updateLabels(item);
        this.logMessage = { message: "Item added", item: item };
        this._save();
        this._debug();
    }

    deleteItem(item) {
        this.items.forEach((element, i, arr) => {
            if (element.name == item.name) {
                arr[i].count--;
                arr[i].total = parseFloat(arr[i].total) - parseFloat(arr[i].price);
                if (arr[i].count < 0) {
                    arr[i].count = 0;
                    arr[i].total = 0.00;
                }
                item = arr[i];
            }
        });
        this._updateLabels(item);
        this.logMessage = { message: "Item deleted", item: item };
        this._save();
        this._debug();
    }
    
    empty() {
        this.logMessage = { message: "Cart empty", item: null };
        this.items = [];
        sessionStorage.removeItem(this.name + "_eCartItems");

        document.getElementsByClassName("eCartCount").innerHTML = 0;
        document.getElementsByClassName("eCartTotal").innerHTML = "0.00";
        this._debug();
    }

    drawResume() {
        let body = document.getElementById("eCartResume");
        body.innerHTML = "";
        let rowTemp = document.createElement("div");
        rowTemp.className = "input-group w-100  bg-light";
        rowTemp.appendChild(this._resumeLabel({ className: "w-25 text-center", text:"Producto"}));
        rowTemp.appendChild(this._resumeLabel({ className: "w-25 border-left text-center", text:"Precio"}));
        rowTemp.appendChild(this._resumeLabel({ className: "w-25 border-left text-center", text:"Cantidad"}));
        rowTemp.appendChild(this._resumeLabel({ className: "w-25 border-left text-center", text:"Total"}));
        
        body.appendChild(rowTemp);
        /** Escribo tabla de items */
        let totalPrice = 0;
        this.items.forEach(item => {
            rowTemp = document.createElement("div");
            rowTemp.className = "input-group w-100 border-top";
            rowTemp.appendChild(this._resumeLabel({ className: "w-25 pl-2", text: item.name }));
            rowTemp.appendChild(this._resumeLabel({ className: "w-25 border-left pl-2 ", text: "$" + (item.price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')  }));
            rowTemp.appendChild(this._resumeLabel({ className: "w-25 border-left pr-2 text-right", text: item.count }));
            rowTemp.appendChild(this._resumeLabel({ className: "w-25 border-left pl-2", text: "$" + (item.total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') }));
            body.appendChild(rowTemp);
            totalPrice += parseFloat(item.total);
        });
        /** Escribo el total */
        rowTemp = document.createElement("div");
        rowTemp.className = "input-group w-100";
        rowTemp.appendChild(this._resumeLabel({ className: "w-50 text-center", text:""}));
        rowTemp.appendChild(this._resumeLabel({ className: "w-25 border-left text-right border-top border-bottom bg-light", text:"Total"}));
        rowTemp.appendChild(this._resumeLabel({ className: "w-25 border-right pl-2 border-top border-bottom bg-light", text:"$" + totalPrice}));
        body.appendChild(rowTemp);
    }

    _resumeLabel(data){
        let label = document.createElement("label");
        label.className = data.className;
        label.innerHTML = data.text;
        return label;
    }
    /** private functions  */
    _save() {
        /*this.logMessage = { message: "Cart saved", item: this.items };*/
        sessionStorage.setItem(this.name + "_eCartItems", JSON.stringify(this.items));
        /*this._debug();*/
    }
    _load() {

        if (sessionStorage.getItem(this.name + "_eCartItems") != undefined) {
            this.items = JSON.parse(sessionStorage.getItem(this.name + "_eCartItems"));
        }
        this._updateAllLabels();
        this.logMessage = { message: "Cart loaded", item: this.items };
        this._debug();
    }
    _debug() {
        if (this.debug != true) {
            return false;
        }
        console.log(this.logMessage.message, this.logMessage.item);
    }

    _updateLabels(item) {
        let idCount = "eCart" + item.name.replace(/ /g, "") + "Count";
        let idTotal = "eCart" + item.name.replace(/ /g, "") + "Total";
        document.getElementById(idCount).innerHTML = item.count;
        document.getElementById(idTotal).innerHTML = item.total;
    }

    _updateAllLabels() {
        this.items.forEach(element => {
            try{
                this._updateLabels(element);
            } catch(e){
                console.error("Error in _updateLabels => ", e );
                console.error("Item => ",element);

            }
        });
    }

    toHtmlTable(){
        let totalPrice = 0;
        let table = "<table border='1'><thead><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Total</th></thead>";
        this.items.forEach(item => {
            table+="<tr>";
            table+="<td>" +item.name + "</td>";
            table+="<td>$" + (item.price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')+ "</td>";
            table+="<td>" + item.count+ "</td>";
            table+="<td>$" + (item.total).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')+ "</td>";
            table+="</tr>";
            totalPrice += parseFloat(item.total);
        });
        table+="<tr><td></td><td></td><td>Total</td><td>$"+totalPrice+"</td></tr></table>";
        return table;
    }

}
