var intro = "Welcome to Coding Club's DSA Practice site.\nLet's begin our journey.";
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


// $(".form-boxes").css("display","none");

// $(".placer").click((e)=>{
//     $(e.target).css("display","none");
//     var sel = $(e.target).attr("class");
//     $(`#${sel.slice(7)}`).css("display","block");
//     $(`#${sel.slice(7)}`).focus();
// });

// $(".form-boxes").focusout((e)=>{
//     $(e.target).css("display","none");
//     $(".placer").css("display","flex");
// });