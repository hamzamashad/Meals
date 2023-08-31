const menuShowBtnTag = 'nav .disp-btns .fa-bars',
menuCloseBtnTag = 'nav .disp-btns .fa-x'
nav = 'nav',
navLinks = 'nav ul li',
menuTag = 'nav .hide';


function hideNav() {
    const navWidth = $(menuTag).outerWidth();
    $(nav).animate({left: -navWidth}, 500);
    $(menuCloseBtnTag).addClass('d-none');
    $(menuShowBtnTag).removeClass('d-none');
    $(navLinks).animate({top: 300}, 500);
}

function showNav() {
    $(nav).animate({left: 0}, 500);
    $(menuCloseBtnTag).removeClass('d-none');
    $(menuShowBtnTag).addClass('d-none');
    $(navLinks).animate({top: 0}, 750);
}


$(menuShowBtnTag).click(() => showNav());

$(menuCloseBtnTag).click(() => hideNav());

hideNav();