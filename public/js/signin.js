
var intro = "Welcome to Coding Club's DSA Practice site.\nLet's harden some brain muscles.";
var k =0;

var timer = setInterval(()=>{

    if(k==43){
        $(".intro").append("<br/>");
    }
    $(".intro").append(intro[k++]);
},50);

if(k==43){
    $(".intro>br").remove();
    $(".intro").append("<br/>");
}

if(k==intro.length){
    clearInterval(timer);
}
