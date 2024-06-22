const navFunction = () => {
    let homeElement = document.getElementById("home");
    let aboutElement = document.getElementById("about");
    let contactElement = document.getElementById("contact");
    
    document.addEventListener('DOMContentLoaded', () => {
        const currentPath = window.location.pathname;
        console.log(currentPath);
        if(currentPath === "/") {
            homeElement.classList.add('active-site');
            aboutElement.classList.remove('active-site');
            contactElement.classList.remove('active-site');
        } else if(currentPath === "/about") {
            homeElement.classList.remove('active-site');
            aboutElement.classList.add('active-site');
            contactElement.classList.remove('active-site');
        } else if(currentPath === "/kontakt") {
            homeElement.classList.remove('active-site');
            aboutElement.classList.remove('active-site');
            contactElement.classList.add('active-site');
    }
});
}







export default navFunction;