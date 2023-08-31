const menuShowBtnTag = 'nav .disp-btns .fa-bars',
menuCloseBtnTag = 'nav .disp-btns .fa-x',
nav = 'nav',
navLinks = 'nav ul li',
menuTag = 'nav .hide',
searchAreaTag = '.search',
nameSearchTag = '#nameSearch',
letterSearchTag = '#letterSearch',
displayTag = '.display .container .row';


// Nav bar effects

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

function searchMeals() {
    hideNav();
    $(searchAreaTag).removeClass('d-none');
}

// End of Nav bar


// Display Meals on display area

function displayMeals(meals) {
    let displayContent = ``;
    for (i=0; i<meals.length; i++) {
        const meal = meals[i];
        displayContent += `
            <div class="col-md-3">
                <div class="meal rounded-2 position-relative">
                    <img src="${meal.strMealThumb}" class="img-fluid">
                    <div class="meal-overlay position-absolute d-flex align-items-center text-black p-2">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            </div>
        `;
    }
    $(displayTag).html(displayContent);
}

// End of Meals display


// Meals by Category

async function getCats() {
    hideNav();
    displayMeals([]);
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    response = await response.json();
    displayCats(response.categories);
}

function displayCats(cats) {
    let displayContent = ``;
    for (i=0; i<cats.length; i++) {
        const cat = cats[i];
        displayContent += `
            <div class="col-md-3">
                <div onclick="getCatMeals('${cat.strCategory}')" class="meal rounded-2 position-relative">
                    <img src="${cat.strCategoryThumb}" class="img-fluid">
                    <div class="meal-overlay position-absolute d-flex align-items-center text-black p-2">
                        <h3>${cat.strCategory}</h3>
                    </div>
                </div>
            </div>
        `;
    }
    $(displayTag).html(displayContent);
}

async function getCatMeals(cat) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
    response = await response.json();
    displayMeals(response.meals.slice(0, 20));
}

// End of Category Meals


// Meals by Area

async function getAreas() {
    hideNav();
    displayMeals([]);
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    response = await response.json();
    console.log(response.meals);
    displayAreas(response.meals);
}

function displayAreas(areas) {
    let displayContent = ``;
    for (i=0; i<areas.length; i++) {
        const area = areas[i];
        displayContent += `
            <div class="col-md-3">
                <div onclick="getAreaMeals('${area.strArea}')" class="meal rounded-2 position-relative text-center text-white">
                    <i class="fa-solid fa-location-pin fa-4x"></i>    
                    <h3>${area.strArea}</h3>
                </div>
            </div>
        `;
    }
    $(displayTag).html(displayContent);
}

async function getAreaMeals(area) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    response = await response.json();
    displayMeals(response.meals.slice(0, 20));
}

// End of Area Meals


// Search Meals

async function searchByName(input) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`);
    response = await response.json();
    if (response.meals == null) {
        displayMeals([]);
    } else {
        displayMeals(response.meals);
    }
}

async function searchByLetter(input) {
    if (input == '') {
        input = 'a';
    }
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${input}`);
    response = await response.json();
    if (response.meals == null) {
        displayMeals([]);
    } else {
        displayMeals(response.meals);
    }
}

// End of Meals search


// Navigation events
$(menuShowBtnTag).click(() => showNav());
$(menuCloseBtnTag).click(() => hideNav());

// Search input events
$(nameSearchTag).keyup(function() {
    searchByName(this.value);
});
$(letterSearchTag).keyup(function() {
    searchByLetter(this.value);
});

// onload
hideNav();
searchByName("");