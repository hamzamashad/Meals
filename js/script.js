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

// End of Nav bar


// Search Meals

function searchMeals() {
    hideNav();
    $(displayTag).html('');
    $(searchAreaTag).removeClass('d-none');
}

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


// Display Meals on display area

function displayMeals(meals) {
    let displayContent = ``;
    for (i=0; i<meals.length; i++) {
        const meal = meals[i];
        displayContent += `
            <div class="col-md-3">
                <div onclick="getMealInfo(${meal.idMeal})" class="meal rounded-2 position-relative">
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

async function getMealInfo(meal) {
    hideNav();
    $(searchAreaTag).addClass('d-none');
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal}`);
    response = await response.json();
    displayMeal(response.meals[0])
}

function displayMeal(meal) {
    let ingredients = ``;
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }
    
    let tags = [];
    if (meal.strTags != null) {
        tags = meal.strTags.split(",");
    }
    let tagList = ''
    for (let i = 0; i < tags.length; i++) {
        tagList += `
            <li class="alert alert-danger m-2 p-1">${tags[i]}</li>
        `;
    }

    let displayContent = `
        <div class="col-md-4">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}">
            <h2>${meal.strMeal}</h2>
        </div>
        <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            <h3><span class="fw-bolder">Area: </span>${meal.strArea}</h3>
            <h3><span class="fw-bolder">Category: </span>${meal.strCategory}</h3>
            <h3>Ingredients :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${ingredients}
            </ul>
            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
               ${tagList}
            </ul>
            <a target="_blank" href="#" class="btn btn-success">Source</a>
            <a target="_blank" href="#" class="btn btn-danger">Youtube</a>
        </div>
    `;
    $(displayTag).html(displayContent);
}

// End of Meals display


// Meals by Category

async function getCats() {
    hideNav();
    $(searchAreaTag).addClass('d-none');
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
    $(searchAreaTag).addClass('d-none');
    displayMeals([]);
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    response = await response.json();
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


// Meals by Ingredients

async function getIngs() {
    hideNav();
    $(searchAreaTag).addClass('d-none');
    displayMeals([]);
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    response = await response.json();
    displayIngs(response.meals.slice(0, 20))
}

function displayIngs(ings) {
    let displayContent = ``;
    for (i=0; i<ings.length; i++) {
        const ing = ings[i];
        displayContent += `
            <div class="col-md-3">
                <div onclick="getIngMeals('${ing.strIngredient}')" class="meal rounded-2 position-relative text-center text-white">
                <i class="fa-solid fa-jar fa-4x"></i>   
                    <h3>${ing.strIngredient}</h3>
                </div>
            </div>
        `;
    }
    $(displayTag).html(displayContent);
}

async function getIngMeals(ing) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`);
    response = await response.json();
    displayMeals(response.meals.slice(0, 20));
}

// End of Ingredient Meals


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