const Utils = {
    parseRequestURL: () => {
        let url = location.hash.slice(1).toLocaleLowerCase() || '/';
        console.log(url);
        let r = url.split('/');
        let request = {
            resource : null,
            id : null,
            verb : null
        };
        request.resource = r[0];
        request.id = r[1];
        request.verb = r[2];
        return request;
    }
}

export default Utils;

