export const baseURL = 'https://books.foreverbooks.co.in/laravel_api/api/';
export const mainURL = 'https://books.foreverbooks.co.in/laravel_api/';
export const token = "books002";
export const cbseboard = 1;
export const icseboard = 2;
export const apiRoot = Object.freeze({
    register:'register',
    login:'login',
    user:'user',
    getCountry:'getCountry',
    getState:'getState',
    addNewAddress:'addNewAddress',
    removeAddress:'removeAddress',
    getSavedAddress:'getSavedAddress',
    updateUserProfile:'updateUserProfile',
    updateUserAddress:'updateUserAddress',
    getCustomerProfileData:'getCustomerProfileData',
    productList:"productList",
    newReleaseBooks:"newReleaseBooks",
    getClasses:'getClasses',
    getSubjects:'getSubjects',
    getProductListAccToSubject:"getProductListAccToSubject",
    addToCart:"addToCart",
    cartList:"cartList",
    removeSingleItemFromCart:"removeSingleItemFromCart",
    removeAllItemsFromCart:"removeAllItemsFromCart",
    removeProductFromCart:"removeProductFromCart",
    addToWishList:"addToWishList",
    getWishList:"getWishList",
    getSingleProductDetail:"getSingleProductDetail",
    forgetPasswordOtp:"forgetPasswordOtp",
    matchEmailOtp:"matchEmailOtp",
    updatePassword:"updatePassword",
    bestSellerBooks:"bestSellerBooks",
    orderGenerate:"orderGenerate",
    books_buy:"books/buy",
    payment_verify:"payment/verify",
    mobileAndEmailVarify:"mobileAndEmailVarify",
    getOrderList:"getOrderList",
    paymentStatus:"paymentStatus",
    generatePDFInvoice:"generatePDFInvoice",
    mailInvoice:"mailInvoice",
    banner_api:"banner_api",
    searchBooks:"searchBooks",
    getShippingCharge:"getShippingCharge"
});
export const fBTheme = {
    fBWhite:"#ffffff",
    fbGray:"#808080",
    fBPurple:"#4A40A1",
    fBRed:"#FF4233",
    fBLigh:"#EAE8FF",
    fBGreen:"#00BB27"
};
export const nonVisibleTabRouts = [
    'Dashboard',
    'H',
];

export const paytmConst = {
    mid:"SobFbq23928001131696",
    callbackUrl:"https://books.foreverbooks.co.in/laravel_api/api/paymentStatus",
    isStaging:false,
    restrictAppInvoke:true,
    urlScheme:""
}