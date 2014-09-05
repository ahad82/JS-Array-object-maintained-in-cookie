//@Author Ahad Ali
//requires jquery
//requires Jquery plugin https://github.com/carhartl/jquery-cookie/blob/master/src/jquery.cookie.js
var cookie = {
    selectedList: "",
    //color: "red",
    addToQuoteRequest:function(id, sku, qty){
        console.log("inside addToQuoteRequest qty::" , qty);
        this.addToList("quoteList", id, sku, qty);
    },
    addToRecentlyViewedList:function(id, sku){
        this.addToList("recentProducts", id, sku, 1);
    },
    deleteProductFromList: function(listName, id, sku){
        this.selectedList = listName;
        var currentList;
        currentList = this.get();
        searchResult = this.search(currentList, id);
        if(searchResult.index === false)
            return false;
        else{
            newList = jQuery.grep(currentList, function( val, index ) {//returns an array without the element
            return ( index != searchResult.index );
          });
        }
        if(newList.length == 0)
            this.remove();//array is empty now..
        else
            this.update(newList);
        
    },
    addToList: function (listName, id, sku, qty) {
        this.selectedList = listName;
        if(jQuery.cookie(this.selectedList)){
            var currentList;
            currentList = this.get();
            searchResult = this.search(currentList, id);
            console.log("searchResult::", searchResult);
            if(searchResult === false)// not found
                this.add(currentList, id, sku, qty);
            
            else if( searchResult.qty != qty ){
                this.deleteProductFromList(listName, id, sku);
                var currentList = [];
                currentList = this.get();
                this.add(currentList, id, sku, qty);
            }
        }else{
            var currentList = [];
            this.add(currentList, id, sku, qty);
        }
    },
    add: function (currentList, id, sku, qty){
        console.log("Adding to cookie", jQuery.cookie(this.selectedList));
        
        var arr = new Object();
        arr.id = id;
        arr.sku = sku;
        arr.qty = qty;
        console.log("JSON stringify" , JSON.stringify(arr));
        currentList[currentList.length] = arr;
        this.update(currentList);
    },
    remove: function (){
        jQuery.removeCookie(this.selectList);
    },
    update: function (list){
        jQuery.cookie(this.selectedList, JSON.stringify(list), { expires: 2 });
    },
    get: function (){
        return JSON.parse(jQuery.cookie(this.selectedList));
    },
    search: function(haystack, needle){
        var found = false;
        jQuery.each(haystack, function (index, Obj){//making sure we dont add the same product again
                if(Obj.id == needle){
                    console.log("product id already exists", needle);
                    Obj.index = index;
                    found = Obj;//
                }
            });
 
        return found;
    }
}     
