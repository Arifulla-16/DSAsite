var intro = "Welcome to Coding Club's DSA Practice site.\nLet's begin our journey.";
var k =0;
var matcher,checker;

$(".subbtn").attr("type","button");

var timer = setInterval(()=>{
    if(k==43){
        $(".introspan").append("<br/>");
    }
    $(".introspan").append(intro[k++]);
},50);

if(k==43){
    $(".introspan").append("<br/>");
}

if(k==intro.length){
    clearInterval(timer);
}


$("#uname").change((e)=>{
    if($("#uname").val()===""){
        $(".usercheck").text("");
    }
    else{
        fetch(`db/username/${$("#uname").val()}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if(data.status===true){
            $(".usercheck").append("Username Already Exists");
            $(".usercheck").css("color","red");
        }
        else{
            $(".usercheck").text("Username Available");
            $(".usercheck").css("color","green");
        }
      });
    }
});

$("#password").change((e)=>{
    if($("#password").val().length<8){
        $(".passcheck").text("Password need to be atleast 8 charecters!");
    }
    else{
        $(".passcheck").text("");
    }
});

$("#password").focus((e)=>{
    matcher = setInterval(()=>{
        if($("#password").val().length<8){
            $(".passcheck").text("Password need to be atleast 8 charecters!");
        }
        else{
            $(".passcheck").text("");
        }
    },100);
});

$("#password").focusout((e)=>{
    clearInterval(matcher);
});

$("#cpassword").focus((e)=>{ 
   matcher = setInterval(()=>{
        if($("#cpassword").val()===$("#password").val()){
            $(".passmatch").text("");
            $(".subbtn").attr("type","submit");
        }
        else{
            $(".passmatch").text("Password not matched!");
            $(".subbtn").attr("type","button");
        }
    },100);
});

$("#cpassword").focusout((e)=>{
    clearInterval(matcher);
});