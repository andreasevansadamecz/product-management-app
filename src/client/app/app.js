/* 
Name: Andreas Evans-Adamecz
filename: app.js
Course: INFT 2202
Date: January 14, 2025
Description: general application file
*/

document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    document.getElementById("copyright").textContent = 
        `© ${new Date().getFullYear()} Andreas Evans-Adamecz`;
});