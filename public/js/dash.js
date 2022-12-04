$(".ddtitle").click((e)=>{
    if($(e.target).hasClass("js")){
        var cs = $(e.target).attr("class").slice(0,-3);
        if($(`.${cs}>i`).hasClass("fa-caret-down")){
            $(`.${cs}>i`).removeClass("fa-caret-down");
            $(`.${cs}>i`).addClass("fa-caret-up");
            lister(e);
        }
        else{
            $(`.${cs}>i`).addClass("fa-caret-down");
            $(`.${cs}>i`).removeClass("fa-caret-up");
            unlister(e);
        }

    }
    else{
        if($(e.target).hasClass("fa-caret-down")){
            $(e.target).removeClass("fa-caret-down");
            $(e.target).addClass("fa-caret-up");
            lister(e);
        }
        else{
            $(e.target).addClass("fa-caret-down");
            $(e.target).removeClass("fa-caret-up");
            unlister(e);
        }
    }
});

var lister = (e)=>{
    if($(e.target).hasClass("jseasy")){
        $(".easylist").toggleClass("visible");
    }
    else if($(e.target).hasClass("jsmed")){
        $(".medlist").toggleClass("visible");
    }
    else if($(e.target).hasClass("jshard")){
        $(".hardlist").toggleClass("visible");
    }
};

var unlister = (e)=>{
    if($(e.target).hasClass("jseasy")){
        $(".easylist").toggleClass("visible");

    }
    else if($(e.target).hasClass("jsmed")){
        $(".medlist").toggleClass("visible");

    }
    else if($(e.target).hasClass("jshard")){
        $(".hardlist").toggleClass("visible");
    }
};


