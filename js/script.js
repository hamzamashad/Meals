// variables holding tag selectors str
const menuShowBtnTag = 'nav .disp-btns .fa-bars',
menuCloseBtnTag = 'nav .disp-btns .fa-x',
nav = 'nav',
navLinks = 'nav ul li',
menuTag = 'nav .hide',
searchAreaTag = '.search',
nameSearchTag = '#nameSearch',
letterSearchTag = '#letterSearch',
displayTag = '.display .container .row',
loadingScreen = '#loadingScreen',
displayLoadingScreen = '#displayLoadingScreen';


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
    $(displayLoadingScreen).fadeIn(350);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${input}`);
    response = await response.json();
    if (response.meals == null) {
        displayMeals([]);
    } else {
        displayMeals(response.meals);
    }
    $(displayLoadingScreen).fadeOut(350);
}

async function searchByLetter(input) {
    $(displayLoadingScreen).fadeIn(350);
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
    $(displayLoadingScreen).fadeOut(350);
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
    $(displayLoadingScreen).fadeIn(350);
    hideNav();
    $(searchAreaTag).addClass('d-none');
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal}`);
    response = await response.json();
    displayMeal(response.meals[0]);
    $(displayLoadingScreen).fadeOut(350);
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
            <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
        </div>
    `;
    $(displayTag).html(displayContent);
}

// End of Meals display


// Meals by Category

async function getCats() {
    $(displayLoadingScreen).fadeIn(350);
    hideNav();
    $(searchAreaTag).addClass('d-none');
    displayMeals([]);
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
    response = await response.json();
    displayCats(response.categories);
    $(displayLoadingScreen).fadeOut(350);
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
    $(displayLoadingScreen).fadeIn(350);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
    response = await response.json();
    displayMeals(response.meals.slice(0, 20));
    $(displayLoadingScreen).fadeOut(350);
}

// End of Category Meals


// Meals by Area

async function getAreas() {
    $(displayLoadingScreen).fadeIn(350);
    hideNav();
    $(searchAreaTag).addClass('d-none');
    displayMeals([]);
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    response = await response.json();
    displayAreas(response.meals);
    $(displayLoadingScreen).fadeOut(350);
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
    $(displayLoadingScreen).fadeIn(350);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    response = await response.json();
    displayMeals(response.meals.slice(0, 20));
    $(displayLoadingScreen).fadeOut(350);
}

// End of Area Meals


// Meals by Ingredients

async function getIngs() {
    $(displayLoadingScreen).fadeIn(350);
    hideNav();
    $(searchAreaTag).addClass('d-none');
    displayMeals([]);
    let response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
    response = await response.json();
    displayIngs(response.meals.slice(0, 20))
    $(displayLoadingScreen).fadeOut(350);
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
    $(displayLoadingScreen).fadeIn(350);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`);
    response = await response.json();
    displayMeals(response.meals.slice(0, 20));
    $(displayLoadingScreen).fadeOut(350);
}

// End of Ingredient Meals


// Contact

const nameRegex = /^[a-zA-Z ]+$/,
emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
mobileRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
ageRegex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/,
passwordRegex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;

let validFlag = false,
validName, validEmail, validMobile, validAge, validPassword; 

function contact() {
    hideNav();
    $(searchAreaTag).addClass('d-none');
    displayMeals([]);
    const displayContent = `
        <div class="d-flex min-vh-100 justify-content-center align-items-center">
            <div class="container w-75 text-center py-4">
                <div class="row g-4">
                    <div class="col-md-6">
                        <input id="nameInput" type="text" class="form-control" placeholder="Enter your Name">
                        <div class="alert alert-danger w-100 mt-2 d-none">
                            Special characters and numbers are not allowed
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="emailInput" type="email" class="form-control" placeholder="Enter your Email">
                        <div class="alert alert-danger w-100 mt-2 d-none">
                            Email entered is not valid
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="phoneInput" type="text" class="form-control" placeholder="Enter your Mobile Number">
                        <div class="alert alert-danger w-100 mt-2 d-none">
                            Mobile Number entered is not valid
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="ageInput" type="nunmber" class="form-control" placeholder="Enter your Age">
                        <div class="alert alert-danger w-100 mt-2 d-none">
                            Special characters and numbers are not allowed
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="passwordInput" type="password" class="form-control" placeholder="Create a Password">
                        <div class="alert alert-danger w-100 mt-2 d-none">
                            Minimum eight characters, at least one letter and one number.
                        </div>
                    </div>
                    <div class="col-md-6">
                        <input id="repasswordInput" type="password" class="form-control" placeholder="Confirm Password">
                        <div class="alert alert-danger w-100 mt-2 d-none">
                            Passwords doesn't match
                        </div>
                    </div>
                </div>
                <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
            </div>
        </div>
    `;
    $(displayTag).html(displayContent);
    $('.form-control').keyup(function () {
        validateInput(this.value, this.id);
        if (validFlag) {
            $(this).next('.alert').addClass('d-none');
        } else {
            $(this).next('.alert').removeClass('d-none');
        }
    });
}

function validateInput(input, type) {
    if (type == 'nameInput') {
        if (nameRegex.test(input)) {
            validFlag = true;
            validName = true;
        }
        else {
            validFlag = false;
            validName = false;
        }
    } else if (type == 'emailInput') {
        if (emailRegex.test(input)) {
            validFlag = true;
            validEmail = true;
        }
        else {
            validFlag = false;
            validEmail = false;
        }
    } else if (type == 'phoneInput') {
        if (mobileRegex.test(input)) {
            validFlag = true;
            validMobile = true;
        }
        else {
            validFlag = false;
            validMobile = false;
        }
    } else if (type == 'ageInput') {
        if (ageRegex.test(input)) {
            validFlag = true;
            validAge = true;
        }
        else {
            validFlag = false;
            validAge = false;
        }
    } else if (type == 'passwordInput') {
        if (passwordRegex.test(input)) {
            validFlag = true;
            if (input == $('#repasswordInput').val()) {
                validPassword = true;
                $('#repasswordInput').next('.alert').addClass('d-none');
            } else {
                validPassword = false;
                $('#repasswordInput').next('.alert').removeClass('d-none');
            }
        }
        else {
            validFlag = false;
        }
    } else if (type == 'repasswordInput') {
        if (input == $('#passwordInput').val()) {
            validFlag = true;
            validPassword = true;
        } else {
            validFlag = false;
            validPassword = false;
        }
    }

    if (validName && validEmail && validMobile && validAge && validPassword) {
        $('#submitBtn').attr('disabled', false);
    } else {
        $('#submitBtn').attr('disabled', true);
    }
}

// End of Contact


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
$(document).ready(() => {
    searchByName("").then(() => {
        $(loadingScreen).fadeOut(750);
    })
})