function SideNavToggle() {
    const dialog = document.querySelector("dialog#sidenav");
    const aside = document.querySelector("body > aside");
    const display = window.getComputedStyle(aside, null).display;
    if (display != 'none')
        return;
    if(dialog.open)
        dialog.close();
    else
        dialog.showModal();
}
