
$("document").ready(function () {
    $('nav a[href^="/' + location.pathname.split("/")[1] + '"]').addClass("top-border");
    $('nav a[href^="/' + location.pathname.split("/")[1] + '"]').removeClass("hvr-underline-reveal");
    $(".category-1-bg").on("mouseover", function () {
        $(".category-1-bg h6").addClass("scale");
    });
    $(".category-1-bg").on("mouseout", function () {
        $(".category-1-bg h6").removeClass("scale");
    });
    $(".category-2-bg").on("mouseover", function () {
        $(".category-2-bg h6").addClass("scale");
    });
    $(".category-2-bg").on("mouseout", function () {
        $(".category-2-bg h6").removeClass("scale");
    });
    $(".to-top").on("click", function () {
        window.scroll({ top: 0, behavior: 'smooth' });
    });
    if (screen.width <= 600) {
        $(".nav-link").removeClass("hvr-underline-reveal");
    }
});
