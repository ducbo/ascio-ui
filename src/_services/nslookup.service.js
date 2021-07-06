export const nslookupService = {
    check
};

function check(fqdn) {
    //https://cloudflare-dns.com/dns-query?name=example.com&type=AAAA
    return fetch(`https://dns.google/resolve?name=${fqdn}`).then(handleResponse)
}
function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if(data.Answer.length === 0) {
            Promise.reject("Does not resolve.");
        } else {
            return true
        }
    });
}