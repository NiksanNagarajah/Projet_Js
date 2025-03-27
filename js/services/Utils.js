const Utils = {
    parseRequestURL: () => {
        let url = location.hash.slice(1).toLowerCase() || '/';
        let r = url.split('/');
        let request = {
            resource : null,
            id : null,
            verb : null,
            action: null 
        };
        request.resource = r[0];
        request.id = r[1];
        request.verb = r[2];
        request.action = r[3]; 
        return request;
    }
    
}

export default Utils;

