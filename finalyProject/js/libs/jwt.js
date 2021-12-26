function base64url(source) {

    let encodedSource = CryptoJS.enc.Base64.stringify(source);
    encodedSource = encodedSource.replace(/=+$/, '');
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');

    return encodedSource;
}

export const jwtCreate = (params = {}) => {

    const header = {
        "alg": "HS256",
        "typ": "JWT"
    };

    const secret = "SECRET!!!";

    const encodedHeader = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(header)));
    const encodedData = base64url(CryptoJS.enc.Utf8.parse(JSON.stringify(params)));
    const signature = base64url(CryptoJS.HmacSHA256(`${encodedHeader}.${encodedData}`, secret));

    return `${encodedHeader}.${encodedData}.${signature}`;
}

export const jwtPayload = (token) => {
    try {
        return JSON.parse(CryptoJS.enc.Base64.parse(token.split('.')[1]).toString(CryptoJS.enc.Utf8));
    } catch (e) {
        return null;
    }
}