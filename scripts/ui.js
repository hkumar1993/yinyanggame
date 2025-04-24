export const updateScoreValue = (id, value) => {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`${id} doesn't exist`);
        return;
    }
    element.innerText = value;
}