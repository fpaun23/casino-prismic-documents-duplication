export async function generate(action = "", localeFrom = "", localeTo = "", repo = "", subset = []) {        
    const response = await fetch('/generate?action=' + action + "&localeFrom=" + localeFrom + "&localeTo=" + localeTo + "&repo=" + repo + "&subset=" + JSON.stringify(subset));  
    return await response.json();
}
