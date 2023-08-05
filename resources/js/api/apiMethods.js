const baseUrl = window.location.origin;
let requestOptions = {
    method: 'POST',
    body: ''
};

export default {
    name: "apiMethods",
    async checkUrlSecurity(url) {
        const apiUrl = "/api/checkUrlSecurity";

    let formData = new FormData();
    formData.append("url", url);
    requestOptions.method = 'POST';
    requestOptions.body = formData;

    let response = await fetch(baseUrl + apiUrl, requestOptions);
    
    return await response.json();
    }
}