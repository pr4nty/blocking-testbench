import decodeJwt from 'jwt-decode';

export default {
    // called when the user attempts to log in
    login: ({ username, password }) =>  {
        const request = new Request('https://tacklingtest.herokuapp.com/users/authenticate', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.message);
                }
                return response.json();
            })
            .then(auth => {
                // saving the token containing user info in localStorage
                localStorage.setItem('authToken', auth.token);
                // load user permissions in localStorage
                const decodedToken = decodeJwt(auth.token);
                localStorage.setItem('permissions', decodedToken.role);
            })
            .catch((e) => {
                return e.message;            
            });
    },
    // called when the user clicks on the logout button
    logout: () => {
        // clear localStorage when logging out
        localStorage.removeItem('authToken');
        localStorage.removeItem('permissions')
        return Promise.resolve();
    },
    // called when the API returns an error
    checkError: (error) => {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('permissions')
            return Promise.reject();
        }
        // other error code (404, 500, etc): no need to log out
        return Promise.resolve();
    },
    // called when the user navigates to a new location, to check for authentication
    checkAuth: () => {
        return localStorage.getItem('authToken')
            ? Promise.resolve()
            : Promise.reject();
    },
    // called when the user navigates to a new location, to check for permissions / roles
    getPermissions: () => Promise.resolve(),

    // displaying user name and position on the top right
    getIdentity: () => {
        try {
            const token = localStorage.getItem('authToken');
            const decodedToken = decodeJwt(token);
            const { firstName, lastName, position } = decodedToken;
            const fullName = `${lastName} ${firstName} : ${position}`;

            return Promise.resolve({ fullName });
        } catch (error) {
            return Promise.reject(error);
        }
    },

    // used for authorization
    getPermissions: () => {
        const role = localStorage.getItem('permissions');
        return role ? Promise.resolve(role) : Promise.reject();
    }
};