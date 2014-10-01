//@Author Ahad Ali
//requires jquery
//requires Jquery plugin https://github.com/carhartl/jquery-cookie/blob/master/src/jquery.cookie.js
var cookie_cstm = {
    selectedList: "",
    maxLength: "",
    //color: "red",
    addToQuoteRequest:function(id, sku, qty, url){
        console.log("inside addToQuoteRequest qty::" , qty);
        this.addToList("quoteList", id, sku, qty, url);
    },
    addToRecentlyViewedList:function(id, sku, url){
         console.log("inside addToRecentlyViewedList");
        //this ensures there can only be 10 most recent products in the list,
        this.maxLength = 10;
        this.addToList("recentProducts", id, sku, 1, url);
    },
    addToSaveList:function(id, sku, url){
         console.log("inside addToSaveList");
        this.addToList("savedProducts", id, sku, 1, url);
    },
    getList:function(listName){
        var temp="";
        this.selectedList = listName;
        listObj = this.get();
        if(listObj){
            $j.each(listObj, function (index, Obj){
                temp += "<li><a href='" + Obj.url + "'>" + Obj.sku + "</a></li>";

            });
        }else{
            console.log(listName , " is empty");
        }
        console.log(temp);
        return temp;
    },
    deleteProductFromList: function(listName, id, sku){
        this.selectedList = listName;
        var currentList;
        currentList = this.get();
        searchResult = this.search(currentList, id);
        if(searchResult.index === false)
            return false;
        else{
            newList = $j.grep(currentList, function( val, index ) {//returns an array without the element
            return ( index != searchResult.index );
          });
        }
        if(newList.length == 0)
            this.remove();//array is empty now..
        else
            this.update(newList);
        
    },
    addToList: function (listName, id, sku, qty, url) {
        this.selectedList = listName;
        if($j.cookie(this.selectedList)){
            var currentList;
            currentList = this.get();
            searchResult = this.search(currentList, id);
            console.log("searchResult::", searchResult);
            if(searchResult === false)// not found
                this.add(currentList, id, sku, qty, url);
            
            else if( searchResult.qty != qty ){
                this.deleteProductFromList(listName, id, sku);
                var currentList = [];
                currentList = this.get();
                this.add(currentList, id, sku, qty, url);
            }
        }else{
            var currentList = [];
            this.add(currentList, id, sku, qty, url);
        }
    },
    add: function (currentList, id, sku, qty, url){
        console.log("Adding to cookie", $j.cookie(this.selectedList));
        
        var arr = new Object();
        arr.id = id;
        arr.sku = sku;
        arr.qty = qty;
        arr.url = url;
        //console.log("JSON stringify" , JSON.stringify(arr));
        if(this.maxLength && (currentList.length == this.maxLength)){
            console.log("Shifting, current length of list::", currentList.length);
            currentList.shift();
        }
        currentList[currentList.length] = arr;
        this.update(currentList);
    },
    remove: function (){
        $j.removeCookie(this.selectList);
    },
    update: function (list){
        $j.cookie(this.selectedList, JSON.stringify(list), { expires: 2, path: '/' });
    },
    get: function (){
        if($j.cookie(this.selectedList))
            return JSON.parse($j.cookie(this.selectedList));
        else
            return false;
    },
    search: function(haystack, needle){
        var found = false;
        $j.each(haystack, function (index, Obj){//making sure we dont add the same product again
                if(Obj.id == needle){
                    console.log("product id already exists", needle);
                    Obj.index = index;
                    found = Obj;//
                }
            });
 
        return found;
    }
}    
