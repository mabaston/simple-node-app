let currentCategory = "";
let categoryMode = false;
let searchMode = false;
let productFetching = true;

const searchField = document.querySelector('#searchField');

const limitNumber = document.querySelector('.limit-number');
const categoriesLists = document.querySelector('.categories-lists');

const productCardsContainer = document.querySelector('.product-cards-container');
const resultCount = document.querySelector('.results-count');

const categoryContainer = document.querySelector('.categories-container-head');
let categoryContainerOn = false;

const blockDisplay = document.querySelector('.block-screen');

const productDisplay = document.querySelector('.product-display-container');
let productDisplayOn = false;
const loadingEffect = `<div class="loading-container">
                            <div class="bars-container">
                                <div class="bars" id="bar3"></div>
                                <div class="bars" id="bar2"></div>
                                <div class="bars" id="bar1"></div>
                            </div>
                            <h3 class="loading-text">WAIT A MOMENT...</h3>
                        </div>`;

function allUrl(limit, currentCategory) {
    return {
        all: `https://dummyjson.com/products/?limit=${limit}`,
        category: `https://dummyjson.com/products/category/${currentCategory}/?limit=${limitNumber.innerHTML}`
    }
}

class Product {
    constructor (id, title, description, price, discountPercentage, rating, stock, brand, category, thumbnail, images)
    {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.discountPercentage = discountPercentage;
        this.rating = rating;
        this.stock = stock;
        this.brand = brand;
        this.category = category;
        this.thumbnail = thumbnail;
        this.images = images;
    }
}

class ProductRepository {
    async getAllProducts(url) {

        // Loading element
        productFetching = true;
        productCardsContainer.classList.add('product-cards-container-center');
        productCardsContainer.innerHTML = loadingEffect;

        const response = await fetch(url, { method: "GET" });
        const data = await response.json();

        return data.products.map(product => new Product(
            product.id,
            product.title,
            product.description,
            product.price,
            product.discountPercentage,
            product.rating,
            product.stock,
            product.brand,
            product.category,
            product.thumbnail,
            product.images
        ));
    }

    async getSingleProduct(id) {
        const response = await fetch(`https://dummyjson.com/products/${id}`, { method: "GET" });
        const data = await response.json();

        return data;
    }

    async getCategoriesLists() {
        const response = await fetch('https://dummyjson.com/products/category-list', { method: "GET" });
        const data = await response.json();

        return data;
    }
}

const productRepository = new ProductRepository();

async function displayProducts() {
    const products = await productRepository.getAllProducts(allUrl(limitNumber.innerHTML, "").all);
    appendProducts(products);
}

async function displayProductsByCategories(categoryName) {
    if(!productFetching) {

        categoryMode = true;
        currentCategory = categoryName;

        const products = await productRepository.getAllProducts(allUrl(limitNumber.innerHTML, currentCategory).category);

        appendProducts(products);
    }
}

function appendProducts(productsArray) {
    productCardsContainer.classList.remove('product-cards-container-center');
    productCardsContainer.innerHTML = "";

    productsArray.forEach(product => {
        productCardsContainer.innerHTML += `<div class="card-container" onclick="displayProduct(${product.id})">
                                                <img class="product-image" src="${product.thumbnail}">
                                                <span class="product-category">${product.category.toUpperCase()}</span>
                                                <h3 class="product-title">${product.title.toUpperCase()}</h3>
                                            </div>`;
    });

    resultCount.textContent = productsArray.length;

    productFetching = false;

    if(Number(limitNumber.innerHTML) > productsArray.length) limitNumber.innerHTML = productsArray.length;
}

searchField.addEventListener('keypress', async e => {

    if(searchField.value == "") return;

    if(e.key == "Enter") {

        const products = await productRepository.getAllProducts(`https://dummyjson.com/products/?limit=194`);

        let searchedProductArray = [];

        products.forEach(product => {
            if(product.title.toLowerCase().includes(searchField.value.toLowerCase())) {
                searchedProductArray.push(product);
            }

            if(product.category.toLowerCase().includes(searchField.value.toLowerCase())) {
                searchedProductArray.push(product);
            }
        });

        let filtered = searchedProductArray.filter((value, index, self) => {
            console.log(`${value}\n${index}\n${self}`);
            return self.indexOf(value) === index;
        });

        limitNumber.innerHTML = 194;

        searchedProductArray.length != 0 ? appendProducts(filtered) : productCardsContainer.innerHTML = `<h1 class="no-results-message">No results found!</h1>`
    }

});



async function displayProduct(id) {
    blockDisplay.style.visibility = "visible";

    document.body.style.overflow = "hidden";

    blockDisplay.innerHTML = loadingEffect;

    try {
        const product = await productRepository.getSingleProduct(id);

        blockDisplay.innerHTML = "";

        productDisplay.innerHTML = `<img class="display-image" src="${product.thumbnail}">
                                    <div class="display-contents-container">
                                        <span class="display-category">${product.category.toUpperCase()}</span>
                                        <span class="display-title">${product.title.toUpperCase()}</span>
                                        <div class="product-details-container">
                                            <div class="product-detail-cards">
                                                <span class="product-detail-title">RATING</span>
                                                <span class="product-detail-subtitle">${product.rating}</span>
                                            </div>
                                            <div class="product-detail-cards">
                                                <span class="product-detail-title">STOCK</span>
                                                <span class="product-detail-subtitle">${product.stock}</span>
                                            </div>
                                            <div class="product-detail-cards">
                                                <span class="product-detail-title">BRAND</span>
                                                <span class="product-detail-subtitle">${product.brand == undefined ? 'NA' : product.brand.toUpperCase()}</span>
                                            </div>
                                            <div class="product-detail-cards">
                                                <span class="product-detail-title">WEIGHT</span>
                                                <span class="product-detail-subtitle">${product.weight} KG</span>
                                            </div>
                                        </div>
                                        <span class="display-description">${product.description}</span>
                                    </div>`;
    } catch(error) {
        console.log(error);
        blockDisplay.innerHTML = `<h1 class="error-text">COULDN'T GET PRODUCT DATA</h1>`;
        productDisplayOn = true;
        return;
    }

    productDisplay.style.visibility = "visible";
    productDisplayOn = true;
}



window.addEventListener('keypress', e => closeBlockDisplay());
blockDisplay.onclick = () => closeBlockDisplay();

function closeBlockDisplay() {
    if(productDisplayOn == true) {
        productDisplay.style.visibility = "hidden";
        blockDisplay.style.visibility = "hidden";
        document.body.style.overflow = "auto";

        productDisplayOn = false;
    }
}



categoryContainer.onclick = () => {
    if(!categoryContainerOn) {
        displayCategoriesLists();
    } else {
        categoriesLists.innerHTML = "";
        categoriesLists.style.padding = '0';
        categoryContainerOn = false;
        document.querySelector('#categories-expand-icon').innerHTML = '+';
    }
}



async function displayCategoriesLists() {
    const categories = await productRepository.getCategoriesLists();

    categoryContainerOn = true;

    categoriesLists.innerHTML = "";
    categoriesLists.style.padding = '10px';

    categories.forEach(category => categoriesLists.innerHTML += `<li onclick="displayProductsByCategories('${category}')">${category.toUpperCase()}</li>`);

    document.querySelector('#categories-expand-icon').innerHTML = '-';
}



document.querySelector('#increment-button').onclick = () => {
    if(!productFetching) {
        limitNumber.innerHTML = Number(limitNumber.innerHTML) + 1;
        reload();
    }
}

document.querySelector('#decrement-button').onclick = () => {
    if(!productFetching) {
        limitNumber.innerHTML = Number(limitNumber.innerHTML) - 1;
        if(Number(limitNumber.innerHTML) < 1) limitNumber.innerHTML = 1;
        console.log(limitNumber.innerHTML);
        reload();
    }
}

function reload() {
    categoryMode ? displayProductsByCategories(currentCategory) : displayProducts();
}

reload();